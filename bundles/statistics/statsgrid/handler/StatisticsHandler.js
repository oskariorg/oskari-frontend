import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { TableHandler } from './TableHandler';
import { SearchHandler } from './SearchHandler';
import { DiagramHandler } from './DiagramHandler';
import { IndicatorFormHandler } from './IndicatorFormHandler';
import { ClassificationHandler } from './ClassificationHandler';
import { getHash } from '../helper/StatisticsHelper';
import { normalizeDatasources, normalizeRegionsets } from '../helper/ConfigHelper';
import { validateClassification, DEFAULT_OPTS } from '../helper/ClassificationHelper';

class StatisticsController extends StateHandler {
    constructor (service, conf = {}) {
        super();
        this.sandbox = service.getSandbox();
        this.service = service;
        this.searchHandler = new SearchHandler(this, this.service, this.sandbox);
        this.tableHandler = new TableHandler(this, this.service, this.sandbox);
        this.diagramHandler = new DiagramHandler(this, this.service, this.sandbox);
        this.formHandler = new IndicatorFormHandler(this, this.service, this.sandbox);
        this.classificationHandler = new ClassificationHandler(this, this.service, this.sandbox);
        this.setState({
            datasources: normalizeDatasources(conf.sources),
            regionsets: normalizeRegionsets(conf.regionsets),
            indicators: [],
            regions: [],
            activeIndicator: null,
            activeRegionset: null,
            activeRegion: null,
            lastSelectedClassification: null
        });
        this.addStateListener(state => {
            // update search flyout in case indicators were added/removed
            this.searchHandler.updateFlyout();
            this.tableHandler.updateFlyout();
            this.diagramHandler.updateFlyout();
            this.classificationHandler.updateContainer();
        });
        this.eventHandlers = this.createEventHandlers();
    };

    getName () {
        return 'StatisticsHandler';
    }

    getSearchHandler () {
        return this.searchHandler;
    }

    getTableHandler () {
        return this.tableHandler;
    }

    getDiagramHandler () {
        return this.diagramHandler;
    }

    getFormHandler () {
        return this.formHandler;
    }

    getClassificationHandler () {
        return this.classificationHandler;
    }

    removeIndicator (indicator) {
        const indicators = [...this.state.indicators];
        const index = indicators.findIndex(ind => ind.hash === indicator.hash);
        if (index >= 0) {
            indicators.splice(index, 1);
        }
        this.updateState({
            indicators: indicators
        });
        if (this.state.indicators?.length < 1) {
            this.resetState();
        } else {
            if (indicator && indicator.hash && this.state.activeIndicator && this.state.activeIndicator.hash === indicator.hash) {
                // active was the one removed -> reset active
                const newActiveIndicator = this.state.indicators[this.state.indicators.length - 1];
                this.setActiveIndicator(newActiveIndicator.hash);
            }
        }
    }

    setActiveIndicator (hash) {
        const previous = this.state.activeIndicator;

        const indicator = this.state.indicators.find(ind => ind.hash === hash);
        this.updateState({
            activeIndicator: hash,
            lastSelectedClassification: indicator?.classification
        });

        const eventBuilder = Oskari.eventBuilder('StatsGrid.ActiveIndicatorChangedEvent');
        this.sandbox.notifyAll(eventBuilder(hash.activeIndicator, previous));

        if (indicator) {
            const indicatorEvent = Oskari.eventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(indicatorEvent(indicator.datasource, indicator.indicator, indicator.selections, indicator.series));
        }
    }

    setActiveRegionset (value) {
        this.updateState({
            activeRegionset: value
        });
        const eventBuilder = Oskari.eventBuilder('StatsGrid.RegionsetChangedEvent');
        this.sandbox.notifyAll(eventBuilder());
    }

    setActiveRegion (value) {
        this.updateState({
            activeRegion: value
        });
        const eventBuilder = Oskari.eventBuilder('StatsGrid.RegionSelectedEvent');
        // TODO: send which region was deselected so implementations can optimize rendering!!!!
        this.sandbox.notifyAll(eventBuilder(this.state.activeRegionset, value, null));
    }

    setFullState (state) {
        const { regionset, indicators = [], activeIndicator, activeRegion } = state || {};

        // map to keep stored states work properly
        const indicatorsArr = indicators.map(ind => {
            const hash = ind.hash || getHash(ind.ds, ind.id, ind.selections, ind.series);
            if (ind.classification) {
                validateClassification(ind.classification);
            }
            return {
                datasource: Number(ind.datasource),
                indicator: ind.indicator,
                selections: ind.selections,
                series: ind.series,
                hash,
                classification: ind.classification,
                labels: ind.labels
            };
        // published maps or saved views may contain dublicate indicators => filter dublicates
        }).filter((ind, i, inds) =>
            (inds.findIndex(find => (find.hash === ind.hash)) === i) &&
            (ind.hash && ind.hash !== '')
        );

        const active = indicatorsArr.find(ind => ind.hash === activeIndicator);
        let lastSelectedClassification;
        if (active) {
            const { classification, series, selections } = active;
            if (classification) {
                lastSelectedClassification = classification;
            }
            if (series) {
                this.service.getSeriesService().setValues(series.values, selections[series.id]);
            }
        }

        this.updateState({
            activeRegion: activeRegion,
            activeRegionset: regionset,
            indicators: indicatorsArr,
            lastSelectedClassification
        });

        if (active) {
            this.setActiveIndicator(active.hash);
        }

        const eventBuilder = Oskari.eventBuilder('StatsGrid.StateChangedEvent');
        this.sandbox.notifyAll(eventBuilder());
    }

    resetState () {
        this.updateState({
            activeIndicator: null,
            activeRegion: null,
            activeRegionset: null,
            indicators: [],
            lastSelectedClassification: null
        });
        const eventBuilder = Oskari.eventBuilder('StatsGrid.StateChangedEvent');
        this.sandbox.notifyAll(eventBuilder(true));
    }

    updateClassificationTransparency (transparency) {
        const indicators = [...this.state.indicators];
        const index = indicators.findIndex(ind => ind.hash === this.state.activeIndicator);
        if (index) {
            indicators[index].classification.transparency = transparency;
            this.updateState({
                indicators: indicators
            });
        }
    }

    /**
     * Adds indicator to selected indicators. Triggers event to notify about change
     * and sets the added indicator as the active one triggering another event.
     * @param  {Number} datasrc    datasource id
     * @param  {Number} indicator  indicator id
     * @param  {Object} selections object containing the parameters for the indicator
     * @param  {Object} series object containing series values
     * @param {Object} classification indicator classification
     *
     * @return {Object} false if indicator is already selected or an object describing the added indicator (includes parameters as an object)
     */
    async addIndicator (datasrc, indicator, selections, series, classification) {
        const ind = {
            datasource: Number(datasrc),
            indicator: indicator,
            selections: selections,
            series: series,
            hash: getHash(datasrc, indicator, selections, series)
        };
        // init classification values if not given
        ind.classification = classification || await this.getClassificationOpts(ind.hash, {
            ds: datasrc,
            id: indicator
        });
        let found = false;
        this.state.indicators.forEach((existing) => {
            if (existing.hash === ind.hash) {
                found = true;
            }
        });

        if (found) return false;

        const labels = await this.service.getUILabels(ind);
        ind.labels = labels;

        if (series) {
            const seriesService = this.service.getSeriesService();
            seriesService.setValues(series.values);
            ind.selections[series.id] = seriesService.getValue();
            // Discontinuos mode is problematic for series data,
            // because each class has to get at least one hit -> set distinct mode.
            ind.classification.mode = 'distinct';
        }
        this.updateState({
            indicators: [...this.state.indicators, ind]
        });

        // notify
        const eventBuilder = Oskari.eventBuilder('StatsGrid.IndicatorEvent');
        this.sandbox.notifyAll(eventBuilder(ind.datasource, ind.indicator, ind.selections, ind.series));
        return ind;
    }

    /**
     * Gets getClassificationOpts
     * @param  {String} indicatorHash indicator hash
     */
    async getClassificationOpts (indicatorHash, opts = {}) {
        const indicator = this.state.indicators.find(ind => ind.hash === indicatorHash) || {};
        const lastSelected = { ...this.state.lastSelectedClassification };
        delete lastSelected.manualBounds;
        delete lastSelected.fractionDigits;
        delete lastSelected.base;

        const metadataClassification = {};
        // Note! Assumes that the metadata has been loaded when selecting the indicator from the list to get a sync response
        // don't try this at home...
        try {
            const data = await this.service.getIndicatorMetadata(indicator.datasource || opts.ds, indicator.indicator || opts.id);
            const metadata = data.metadata || {};
            if (typeof metadata.isRatio === 'boolean') {
                metadataClassification.mapStyle = metadata.isRatio ? 'choropleth' : 'points';
            }
            if (typeof metadata.decimalCount === 'number') {
                metadataClassification.fractionDigits = metadata.decimalCount;
            }
            if (typeof metadata.base === 'number') {
                // if there is a base value the data is divided at base value
                // TODO: other stuff based on this
                metadataClassification.base = metadata.base;
                metadataClassification.type = 'div';
            }
        } catch (error) {
            return;
        }

        const result = Object.assign({}, DEFAULT_OPTS.classification, lastSelected, metadataClassification);
        validateClassification(result);
        return result;
    }

    updateIndicator (indicator) {
        const indicators = [...this.state.indicators];
        const index = indicators.findIndex(ind => ind.hash === indicator.hash);
        if (index) {
            indicators[index] = indicator;
        }
        this.updateState({
            indicators
        });
    }

    createEventHandlers () {
        const handlers = {
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }

        return handler.apply(this, [e]);
    }
}

const wrapped = controllerMixin(StatisticsController, [
    'getSearchHandler',
    'getTableHandler',
    'getDiagramHandler',
    'getFormHandler',
    'getClassificationHandler',
    'removeIndicator',
    'setActiveIndicator',
    'setActiveRegionset',
    'setActiveRegion',
    'addIndicator',
    'setFullState',
    'resetState',
    'updateClassificationTransparency',
    'updateIndicator'
]);

export { wrapped as StatisticsHandler };
