import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

import { getHashForIndicator } from '../helper/StatisticsHelper';
import { getIndicatorMetadata, getIndicatorData, saveIndicator, saveIndicatorData, deleteIndicator } from './IndicatorHelper';
import { getRegionsAsync } from '../helper/RegionsHelper';

const SELECTOR = 'year';

class IndicatorFormController extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.sandbox = instance.getSandbox();
        this.setState(this.getInitState());
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.IndicatorFormHandler');
    };

    getName () {
        return 'IndicatorFormHandler';
    }

    async showIndicatorPopup (ds, id = null) {
        if (!ds) return;
        this.reset();
        await this.preparePopupData(ds, id);
        this.instance.getViewHandler()?.show('indicatorForm');
        if (!id && !Oskari.user().isLoggedIn()) {
            Messaging.warn({
                duration: 10,
                content: this.loc('userIndicators.notLoggedInWarning')
            });
        }
    }

    showClipboardPopup () {
        this.instance.getViewHandler().show('clipboard');
    }

    getInitState () {
        return {
            indicator: {}, // TODO: is it ok to pass additional info (name,..) for other handlers??
            datasets: [],
            selection: '',
            regionset: null,
            dataByRegions: [],
            showDataTable: 'todo add button',
            loading: false
        };
    }
    reset () {
        this.updateState(this.getInitState());
    }

    async preparePopupData (ds, id) {
        this.updateState({ loading: true });
        const indicator = { id, ds };
        const datasets = await this.populateIndicatorFromMetadata(indicator);
        this.updateState({ indicator, datasets, loading: false });
    }

    async populateIndicatorFromMetadata (indicator) {
        const datasets = [];
        if (indicator.id && indicator.ds) {
            try {
                const { selectors, regionsets, name, description, source } = await getIndicatorMetadata(indicator.ds, indicator.id);
                indicator.name = name;
                indicator.description = description;
                indicator.source = source;
                selectors.forEach(sel => regionsets.forEach(regionset => sel.allowedValues.forEach(val => datasets.push({[sel.id]: val.id, regionset}))));
            } catch (error) {
                Messaging.error(Oskari.getMsg('StatsGrid', 'errors.indicatorMetadataError'));
            }
        }
        return datasets;
    }

    updateIndicator (key, value) {
        this.updateState({ indicator: {...this.getState().indicator, [key]: value }});
    }

    setSelection (selection) {
        this.updateState({ selection });
    }

    setRegionset (regionset) {
        this.updateState({ regionset });
    }

    addStatisticalData () {
        const { selection, regionset } = this.getState();
        if (selection.length === 0 || isNaN(selection)) {
            Messaging.error(this.loc('errors.myIndicatorYearInput'));
            return;
        }
        if (!regionset) {
            Messaging.error(this.loc('errors.myIndicatorRegionselect'));
            return;
        }
        this.showDataTable();
    }

    updateRegionValue (id, value) {
        const dataByRegions = this.getState().dataByRegions
            .map(region => region.id === id ? {...region, value } : region);
        this.updateState({ dataByRegions });
    }

    async showDataTable () {
        this.updateState({ loading: true, showDataTable: true });
        const { indicator, regionset, selection } = this.getState();
        const selections = { [SELECTOR]: selection };
        try {
            const regions = await getRegionsAsync(regionset);
            let data = {};
            if (indicator.id) {
                try {
                    data = await getIndicatorData({...indicator, selections }, regionset);
                } catch (e) {
                    console.log(e.message);
                    // no data saved for selections
                    // TODO: handle getIndicatorData properly
                }
            }
            const dataByRegions = regions
                .map(({name, id}) => ({key: id, name, value: data[id]}))
                .sort((a, b) => a.name.localeCompare(b.name));
            this.updateState({ dataByRegions, loading: false });
        } catch (error) {
            Messaging.error(Oskari.getMsg('StatsGrid', 'errors.regionsDataError'));
            this.closeDataTable();
        }
    }

    closeDataTable () {
        // TODO: selection, regionset??
        this.updateState({
            loading: false,
            showDataTable: false,
            dataByRegions: []
        });
    }
    async saveIndicator () {
        this.updateState({ loading: true });
        const { indicator } = this.getState();
        try {
            const id = await saveIndicator(indicator);
            const updated =  {...indicator, id};
            this.updateState({ indicator: updated, loading: false });
            this.notifyCacheUpdate(updated);
            this.log.info(`Saved indicator with id: ${id}`, updated);
            Messaging.success(this.loc('userIndicators.dialog.successMsg'));
        } catch (error) {
            this.updateState({ loading: false });
            Messaging.error(this.loc('errors.indicatorSave'));
        }
    }
    async saveData () {
        this.updateState({ loading: true });
        const { dataByRegions, regionset, selection } = this.getState();
        const selections = { [SELECTOR]: selection };
        const indicator = { ...this.getState().indicator, selections };

        if (typeof indicator.name !== 'string' || indicator.name.trim().length === 0) {
            // TODO: disable button, mark name as mandatory?
            Messaging.warn(this.loc('errors.myIndicatorNameInput'));
            return;
        }
        const data = {};
        dataByRegions.forEach(({key, value}) => {
            if (typeof value === 'undefined') {
                return;
            }
            const valString = `${value}`.trim().replace(/,/g, '.');
            if (!valString || isNaN(valString)) {
                return;
            }
            data[key] = Number(valString);
        });
        if (!Object.keys(data).length) {
            Messaging.warn(this.loc('errors.myIndicatorNoData'));
            return;
        }
        try {
            await saveIndicatorData(indicator, data, regionset);
            const indicatorInfo = `Indicator: ${indicator.id}, selection: ${selection}, regionset: ${regionset}.`;
            this.log.info('Saved data form values', data, indicatorInfo);
            Messaging.success(this.loc('userIndicators.dialog.successMsg'));
            // add indicator only when data is saved
            const dataset = {...selections, regionset };
            this.selectIndicator(dataset);

            this.updateState({ datasets: [...this.getState().datasets, dataset] });
            this.closeDataTable();
            this.notifyCacheUpdate(indicator);
        } catch (error) {
            this.updateSate({ loading: false });
            Messaging.error(this.loc('errors.indicatorSave'));
        }
    }

    notifyCacheUpdate (indicator) {
        this.instance.getSearchHandler()?.onCacheUpdate(indicator);
    }

    selectIndicator (dataset) {
        const selections = { [SELECTOR]: dataset[SELECTOR] };
        const indicator = { ...this.getState().indicator, selections };
        indicator.hash = getHashForIndicator(indicator);
        this.instance.getStateHandler()?.getController().selectSavedIndicator(indicator, dataset.regionset);
    }

    importFromClipboard (data) {
        const regionValues = {};

        const lines = data.match(/[^\r\n]+/g);
        // loop through all the lines and parse municipalities (name or code)
        lines.forEach((line) => {
            // separator can be a tabulator or a semicolon
            const matches = line.match(/([^\t;]+) *[\t;]+ *(.*)/);
            if (matches && matches.length === 3) {
                const region = matches[1].trim().toLowerCase();
                const value = (matches[2] || '').replace(',', '.').replace(/\s/g, '');
                if (!value || isNaN(value)) {
                    return;
                }
                regionValues[region] = value;
            }
        });

        const dataByRegions = this.getState().dataByRegions.map(region => {
            const { key, name } = region;
            const value = regionValues[key] || regionValues[name.toLowerCase()];
            // String or undefined
            if (value) {
                return {...region, value};
            }
            return region;
        });
        this.updateState({ dataByRegions });
    }
    editDataset (item = {}) {
        const selection = item[SELECTOR];
        const regionset = item.regionset;
        this.updateState({ selection, regionset });
        this.showDataTable();
    }

    async deleteDataset (item = {}) {
        const selection = item[SELECTOR];
        if (!selection) {
            // without selection deletes all datasets
            return;
        }
        const selections = { [SELECTOR]: selection };
        const indicator = { ...this.getState().indicator, selections };
        indicator.hash = getHashForIndicator(indicator);
        const handler = this.instance.getStateHandler();
        if (handler?.isIndicatorSelected(indicator, true)) {
            handler.getController().removeIndicator(indicator);
        }
        try {
            await deleteIndicator(indicator, item.regionset);
            Messaging.success(this.loc('tab.popup.deleteSuccess'));
        } catch (error) {
            Messaging.error(this.loc('errors.datasetDelete'));
        }
        this.preparePopupData(indicator);
        this.notifyCacheUpdate(indicator);
    }
}

const wrapped = controllerMixin(IndicatorFormController, [
    'updateIndicator',
    'setSelection',
    'setRegionset',
    'addStatisticalData',
    'updateRegionValue',
    'closeDataTable',
    'showClipboardPopup',
    'saveIndicator',
    'saveData',
    'importFromClipboard',
    'editDataset',
    'showIndicatorPopup',
    'deleteDataset',
    'selectIndicator'
]);

export { wrapped as IndicatorFormHandler };
