import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { getHashForIndicator, populateData, populateSeriesData, getUILabels, getUpdatedLabels, formatData } from '../helper/StatisticsHelper';
import { getClassification, getClassifiedData, shouldUpdateClassifiedData, validateClassification } from '../helper/ClassificationHelper';
import { LAYER_ID } from '../constants';
import { getRegionsets } from '../helper/ConfigHelper';

class StatisticsController extends StateHandler {
    constructor (instance, service) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.service = service;
        this.setState(this.getInitialState());
        this.log = Oskari.log('Oskari.statistics.statsgrid.StatisticsHandler');
    }

    getName () {
        return 'StatisticsHandler';
    }

    getInitialState () {
        const regionset = getRegionsets().length === 1 ? getRegionsets()[0] : null;
        return {
            loading: false,
            activeIndicator: null, // hash
            activeRegion: null,
            regionset,
            indicators: [],
            regions: [], // TODO: move to helper
            isSeriesActive: false
        };
    }

    resetState () {
        this.instance.clearDataProviderInfo();
        this.sandbox.postRequestByName('RemoveMapLayerRequest', [LAYER_ID]);
        this.instance.getViewHandler().closeAll(true);
        this.updateState(this.getInitialState());
    }

    isIndicatorSelected = (indicator, strict = false) => {
        const { hash, ds, id } = indicator;
        const { indicators } = this.getState();
        if (strict) {
            return indicators.some(ind => ind.hash === hash);
        }
        // selections could vary
        return indicators.some(ind => ind.ds === ds && ind.id === id);
    }

    removeIndicator (indicator) {
        const indicators = this.getState().indicators.filter(ind => ind.hash !== indicator.hash);
        if (indicators.length === 0) {
            this.resetState();
            return;
        }
        this.updateState({indicators});
        // check if the same indicator is added more than once with different selections
        if (!this.isIndicatorSelected(indicator)) {
            this.instance.removeDataProviverInfo(indicator);
        }
        if (this.getState().activeIndicator === hash) {
            // active was the one removed -> reset active
            this.setActiveIndicator();
        }
    }
    removeIndicators(ds, id) {
        const { indicators, activeIndicator } = this.getState();
        const hashes = indicators
            .filter(ind => ind.ds === ds && ind.id === id)
            .map(ind => ind.hash);
        this.updateState({indicators: indicators.filter(ind => !hashes.includes(ind.hash))});
        // needs only ds and id from indicator object
        this.instance.removeDataProviverInfo({ ds, id });
        if (hashes.includes(activeIndicator)) {
            // active was the one removed -> reset active
            this.setActiveIndicator();
        }
    }

    setActiveIndicator (hash = null) {
        let activeIndicator = hash;
        const { indicators } = this.getState();
        const indicator = indicators.find(ind => ind.hash === hash);
        if (!indicator && indicators.length) {
            activeIndicator = indicators[0].hash;
        }
        const isSeriesActive = indicator ? !!indicator.series : false;
        this.updateState({ activeIndicator, isSeriesActive });
    }

    async setActiveRegionset (regionset) {
        this.updateState({ loading: true });
        const regions = await this.service.getRegions(regionset);
        const indicators = await this.updateIndicatorsRegions(regionset, regions);
        this.updateState({ regionset, regions, indicators, loading: false });
    }

    async updateIndicatorsRegions (regionset, regions) {
        const { indicators } = this.getState();
        const updated = [];
        // async/await doesn't work with map()
        for (let i=0; i < indicators.length; i++) {
            const indicator = indicators[i];
            const data = await this.fetchIndicatorData(indicator, regionset, regions);
            validateClassification(indicator.classification, data);
            const classifiedData = getClassifiedData(data, indicator.classification);
            updated.push( {...indicator, data, classifiedData });
        };
        return updated;
    }

    setActiveRegion (activeRegion) {
        this.updateState({ activeRegion });
    }

    updateClassification (updated) {
        const { activeIndicator: hash, indicators } = this.getState();
        const indicator = indicators.find(ind => ind.hash === hash);
        if (!indicator) {
            this.log.warn(`Couldn't find indicator to update classification`);
            return;
        }
        const updatedKeys = Object.keys(updated);
        const classification = { ...indicator.classification, ...updated };
        validateClassification(classification, indicator.data);
        const classifiedData = getClassifiedData(indicator.data, classification);
        const updatedInd = { ...indicator, classification, classifiedData };

        if (updatedKeys.includes('fractionDigits')) {
            formatData(updatedInd.data, classification);
        }

        // keep order
        this.updateState({
            indicators: indicators.map(ind => ind.hash === hash ? updatedInd : ind)
        });
    }

    setSeriesValue (value) {
        const { indicators } = this.getState()
        const hashes = indicators.filter(ind => ind.series).map(ind => ind.hash);
        const updated = indicators.map(ind => {
            if (hashes.includes(ind.hash)) {
                const { id } = ind.series;
                const selections = {...ind.selections, [id]: value};
                const labels = getUpdatedLabels(ind.labels, selections);
                return { ...ind, selections, labels };
            }
            return ind;
        });
        this.updateState( {indicators: updated });
    }

    getStateToStore () {
        // State isn't cleared when stats layer is removed
        // return full state only if stats layer is selected
        if (!this.sandbox.isLayerAlreadySelected(LAYER_ID)) {
            return null;
        }
        const state = this.getState();
        const indicators = state.indicators.map(ind => {
            return {
                ds: ind.ds,
                id: ind.id,
                selections: ind.selections,
                classification: ind.classification,
                series: ind.series
            };
        });
        return {
            active: state.activeIndicator,
            activeRegion: state.activeRegion,
            regionset: state.regionset,
            indicators
        };
    }

    async setStoredState (state) {
        const { regionset, indicators = [], active: activeIndicator, activeRegion } = state || {};
        if (!indicators.length) {
            // if state doesn't have indicators, reset state
            this.resetState();
            return;
        }
        this.updateState({ loading: true });
        try {
            let active;
            const indicatorsToAdd = [];
            // async/await doesn't work with forEach()
            for (let i = 0; i < indicators.length; i++) {
                const toAdd = await this.getIndicatorToAdd(indicators[i], regionset);
                indicatorsToAdd.push(toAdd);
                this.instance.addDataProviderInfo(toAdd);
                if (toAdd.hash === activeIndicator) {
                    active = toAdd;
                }
            };
            const isSeriesActive = active ? !!active.series : false;
            this.updateState({ activeIndicator, isSeriesActive, activeRegion, regionset, indicators: indicatorsToAdd, loading: false });
            // backwards compatibility
            if (active) {
                const opacity = active.classification?.transparency || 100;
                this.sandbox.postRequestByName('ChangeMapLayerOpacityRequest', [LAYER_ID, opacity]);
            } else {
                // reset active
                this.setActiveIndicator();
            }
        } catch (error) {
            this.log.warn('Failed to set stored state', error.message);
        }
    }

    async addIndicator (indicator, regionset) {
        if (this.isIndicatorSelected(indicator, true)) {
            // already selected
            if (regionset === this.getState().regionset) {
                setActiveRegionset(regionset);
            }
            return true;
        }
        try {
            this.updateState({ loading: true });
            // TODO: SearchHandler should select first value
            if (indicator.series) {
                const { id, values } = indicator.series;
                indicator.selections[id] = values[0];
            }
            const indicatorToAdd = await this.getIndicatorToAdd(indicator, regionset);
            this.instance.addDataProviderInfo(indicatorToAdd);
            this.updateState({
                indicators: [...this.getState().indicators, indicatorToAdd]
            });
        } catch (error) {
            this.log.warn(error.message);
            return false;
        }
        this.updateState({ loading: false });
        return true;
    }

    // gather all needed stuff for rendering components before adding indicator to state
    async getIndicatorToAdd (indicator, regionset) {
        const regions = await this.service.getRegions(regionset);
        if (this.getState().regionset !== regionset) {
            this.updateState({regions, regionset});
        }
        if(!indicator.hash) {
            // to be sure that indicator has always hash
            indicator.hash = getHashForIndicator(indicator);
        }
        const data = await this.fetchIndicatorData(indicator, regionset, regions);
        const meta = await this.service.getIndicatorMetadata(indicator.ds, indicator.id);
        let { classification } = indicator;
        if (!classification) {
            // active indicicator has latest user selected classification
            const { indicators, activeIndicator } = this.getState();
            const { classification: latest } = indicators.find(ind => ind.hash === activeIndicator) || {};
            classification = getClassification(data, meta.metadata, latest);
        } else {
            validateClassification(classification, data);
        }
        const classifiedData = getClassifiedData(data, classification);
        const labels = getUILabels(indicator, meta);
        // format data here because data is populated before classification (fractionDigits) created
        formatData(data, classification);

        return {
            ...indicator,
            data,
            classification,
            labels,
            classifiedData
        };
    }

    async fetchIndicatorData (indicator, regionset, regions) {
        let data = {};
        const fractionDigits = indicator?.classification?.fractionDigits;
        if (indicator.series) {
            const { id, values } = indicator.series;
            const dataBySelection = {};
            for (let i = 0; i < values.length; i++) {
                const value = values[i];
                const selections = {...indicator.selections, [id]: value};
                const rawData = await this.service.getIndicatorData({...indicator, selections}, regionset);
                dataBySelection[value] = rawData;
            }
            data = populateSeriesData(dataBySelection, regions, regionset, fractionDigits);
        } else {
            const rawData = await this.service.getIndicatorData(indicator, regionset);
            data = populateData(rawData, regions, regionset, fractionDigits);
        }
        return data;
    }
}

const wrapped = controllerMixin(StatisticsController, [
    'removeIndicator',
    'removeIndicators',
    'setActiveIndicator',
    'setActiveRegionset',
    'setActiveRegion',
    'addIndicator',
    'resetState',
    'updateIndicator',
    'updateClassification',
    'setSeriesValue'
]);

export { wrapped as StateHandler };
