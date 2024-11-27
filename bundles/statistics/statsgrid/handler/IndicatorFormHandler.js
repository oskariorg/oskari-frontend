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
        await this.preparePopupData({ id, ds });
        this.instance.getViewHandler()?.show('indicatorForm');
    }

    showClipboardPopup () {
        this.instance.getViewHandler().show('clipboard');
    }

    getInitState () {
        return {
            indicator: {},
            datasets: [],
            selection: '',
            regionset: null,
            dataByRegions: [],
            showDataTable: false,
            loading: false
        };
    }

    reset () {
        this.updateState(this.getInitState());
    }

    async preparePopupData (partialIndicator) {
        this.updateState({ loading: true });
        const { datasets, indicator } = await this.populateIndicatorFromMetadata(partialIndicator);
        this.updateState({ indicator, datasets, loading: false });
    }

    async populateIndicatorFromMetadata ({ ds, id }) {
        const datasets = [];
        let indicator = { ds, id };
        if (id && ds) {
            try {
                const { selectors, regionsets, ...fromMeta } = await getIndicatorMetadata(ds, id);
                indicator = { ...indicator, ...fromMeta };
                // create dataset for every value and regionset compination like {year: 2024, regionset: 2036}
                selectors.forEach(({ values, id }) => regionsets.forEach(regionset => values.forEach(({ value }) => datasets.push({ [id]: value, regionset }))));
            } catch (error) {
                Messaging.error(Oskari.getMsg('StatsGrid', 'errors.indicatorMetadataError'));
            }
        }
        return { datasets, indicator };
    }

    getFullIndicator (optSelection) {
        const { indicator, selection } = this.getState();
        const selections = { [SELECTOR]: optSelection || selection };
        const full = { ...indicator, selections };
        if (full.id) {
            full.hash = getHashForIndicator(full);
        }
        return full;
    }

    updateIndicator (key, value) {
        this.updateState({ indicator: { ...this.getState().indicator, [key]: value } });
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
            Messaging.error(this.loc('userIndicators.validate.year'));
            return;
        }
        if (!regionset) {
            Messaging.error(this.loc('userIndicators.validate.regionset'));
            return;
        }
        this.showDataTable();
    }

    updateRegionValue (key, value) {
        const dataByRegions = this.getState().dataByRegions
            .map(region => region.key === key ? { ...region, value } : region);
        this.updateState({ dataByRegions });
    }

    async showDataTable () {
        this.updateState({ loading: true, showDataTable: true });
        const indicator = this.getFullIndicator();
        const { regionset } = this.getState();
        try {
            const regions = await getRegionsAsync(regionset);
            let data = {};
            if (indicator.id) {
                try {
                    data = await getIndicatorData(indicator, regionset);
                } catch (e) {
                    // no data saved for selections
                }
            }
            // use key to use as datasource for Table
            const dataByRegions = regions
                .map(({ name, id }) => ({ key: id, name, value: data[id] }))
                .sort((a, b) => a.name.localeCompare(b.name));
            this.updateState({ dataByRegions, loading: false });
        } catch (error) {
            Messaging.error(Oskari.getMsg('StatsGrid', 'errors.regionsDataError'));
            this.closeDataTable();
        }
    }

    closeDataTable () {
        this.updateState({
            loading: false,
            showDataTable: false,
            dataByRegions: []
        });
    }

    async saveIndicator () {
        const { indicator } = this.getState();
        if (typeof indicator.name !== 'string' || indicator.name.trim().length === 0) {
            Messaging.warn(this.loc('userIndicators.validate.name'));
            return;
        }
        this.updateState({ loading: true });
        try {
            const id = await saveIndicator(indicator);
            const updated = { ...indicator, id };
            this.updateState({ indicator: updated, loading: false });
            this.notifyCacheUpdate(updated, 'save');
            this.log.info(`Saved indicator with id: ${id}`, updated);
            Messaging.success(this.loc('userIndicators.success.indicatorSave'));
        } catch (error) {
            this.updateState({ loading: false });
            Messaging.error(this.loc('userIndicators.error.indicatorSave'));
        }
    }

    async saveData () {
        const { dataByRegions, regionset, selection } = this.getState();

        const data = {};
        dataByRegions.forEach(({ key, value }) => {
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
            Messaging.warn(this.loc('userIndicators.validate.noData'));
            return;
        }
        try {
            this.updateState({ loading: true });
            const indicator = this.getFullIndicator();
            await saveIndicatorData(indicator, data, regionset);
            const indicatorInfo = `Indicator: ${indicator.id}, selection: ${selection}, regionset: ${regionset}.`;
            this.log.info('Saved data form values', data, indicatorInfo);
            Messaging.success(this.loc('userIndicators.success.datasetSave'));
            this.selectIndicator(selection, regionset);
            this.preparePopupData(indicator);
            this.closeDataTable();
            this.notifyCacheUpdate(indicator, 'data');
        } catch (error) {
            this.updateState({ loading: false });
            Messaging.error(this.loc('userIndicators.error.datasetSave'));
        }
    }

    notifyCacheUpdate (indicator, operation) {
        this.instance.getSearchHandler()?.onCacheUpdate(indicator);
        this.instance.getMyIndicatorsHandler()?.refreshIndicatorsList();
        if (operation !== 'delete') {
            this.instance.getStateHandler()?.onCacheUpdate(indicator, operation === 'data');
        }
    }

    async selectIndicator (selection, regionset) {
        const indicator = this.getFullIndicator(selection);
        const handler = this.instance.getStateHandler();
        const { success } = await handler?.addIndicator(indicator, regionset) || {};
        if (success) {
            handler?.setActiveIndicator(indicator.hash);
        }
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
                return { ...region, value };
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
            // should always have selection
            // without selection deleteIndicator removes all datasets
            Messaging.error(this.loc('userIndicators.error.datasetDelete'));
            return;
        }
        const indicator = this.getFullIndicator(selection);
        const handler = this.instance.getStateHandler();
        if (handler?.isIndicatorSelected(indicator, true)) {
            handler.getController().removeIndicator(indicator);
        }
        try {
            await deleteIndicator(indicator, item.regionset);
            Messaging.success(this.loc('userIndicators.success.datasetDelete'));
        } catch (error) {
            Messaging.error(this.loc('userIndicators.error.datasetDelete'));
        }
        this.preparePopupData(indicator);
        this.notifyCacheUpdate(indicator, 'delete');
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
