import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

import { getHashForIndicator } from '../helper/StatisticsHelper';
import { getIndicatorMetadata, getIndicatorData, saveIndicator, saveIndicatorData, deleteIndicator } from './IndicatorHelper';
import { getDatasources, getRegionsets } from '../helper/ConfigHelper';
import { getRegions } from '../helper/RegionsHelper';

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
        await this.preparePopupData({ds, id});
        this.instance.getViewHandler().show('indicatorForm');
    }

    showClipboardPopup () {
        this.instance.getViewHandler().show('clipboard');
    }

    // TODO: why state doesn't use same syntax for indicator than others (ds, source, id, selections)
    getSelectedIndicator(full) {
        const { indicatorName, indicatorDescription, indicatorSource, datasourceId, indicatorId } = this.getState();
        if (!full) {
            return {
                ds: datasourceId,
                id: indicatorId,
                selections: { [SELECTOR]: datasetYear }
            }
        }
        const indicator = {
            ds: datasourceId,
            name: indicatorName,
            description: indicatorDescription,
            source: indicatorSource,
            selections: { [SELECTOR]: datasetYear }
        };
        if (indicatorId) {
            indicator.id = indicatorId;
        }
        return indicator;
    }

    getInitState () {
        return {
            indicatorName: '',
            indicatorSource: '',
            indicatorDescription: '',
            indicatorId: null,
            datasourceId: null,
            regionsetOptions: null,
            datasets: null,
            datasetYear: '',
            datasetRegionset: null,
            selectedDataset: null,
            formData: {}
        };
    }
    reset () {
        this.updateState(this.getInitState());
    }

    async preparePopupData (indicator) {
        const { id, ds } = indicator;
        const { regionsets = [] } = getDatasources().find(ds => ds.id === ds) || {};
        const regionsetOptions = getRegionsets().filter(rs => regionsets.includes(rs.id));

        if (id) {
            await this.getIndicatorDatasets(indicator);
        }
        this.updateState({ datasourceId: ds, indicatorId: id, regionsetOptions });
    }

    async getIndicatorDatasets (indicator) {
        try {
            const ind = await getIndicatorMetadata(indicator.ds, indicator.id);
            const datasets = [];
            for (const sel of ind?.selectors) {
                for (const regionset of ind.regionsets) {
                    for (const value of sel.allowedValues) {
                        const data = {};
                        if (typeof value === 'object') {
                            data[sel.id] = value.id;
                        } else {
                            data[sel.id] = value;
                        }
                        data.regionset = regionset;
                        datasets.push(data);
                    }
                }
            }
            this.updateState({
                datasets,
                indicatorName: Oskari.getLocalized(ind.name),
                indicatorDescription: Oskari.getLocalized(ind.description),
                indicatorSource: Oskari.getLocalized(ind.source)
            });
        } catch (error) {
            Messaging.error(Oskari.getMsg('StatsGrid', 'errors.indicatorMetadataError'));
        }
    }

    setIndicatorName (value) {
        this.updateState({
            indicatorName: value
        });
    }

    setIndicatorDescription (value) {
        this.updateState({
            indicatorDescription: value
        });
    }

    setindicatorSource (value) {
        this.updateState({
            indicatorSource: value
        });
    }

    setDatasetYear (value) {
        this.updateState({
            datasetYear: value
        });
    }

    setDatasetRegionset (value) {
        this.updateState({
            datasetRegionset: value
        });
    }

    addStatisticalData () {
        const { datasetYear, datasetRegionset } = this.getState();
        if (datasetYear.length === 0 || isNaN(datasetYear)) {
            Messaging.error(this.loc('errors.myIndicatorYearInput'));
            return;
        }
        if (!datasetRegionset) {
            Messaging.error(this.loc('errors.myIndicatorRegionselect'));
            return;
        }
        const indicator = this.getSelectedIndicator();;
        this.showDataTable(indicator, datasetRegionset);
    }

    updateFormData (value, regionId) {
        const { formData } = this.getState();
        const regions = formData.regions?.map(region => {
            if (region.id === regionId) {
                return {
                    ...region,
                    value: value
                };
            }
            return region;
        });
        this.updateState({
            formData: {
                ...formData,
                regions
            }
        });
    }

    async showDataTable (indicator, regionsetId) {
        this.updateState({
            loading: true
        });
        const { name } = getRegionsets().find(rs => rs.id === regionsetId) || {};
        const labels = {};
        labels[regionsetId] = name;
        try {
            const regions = await getRegions(regionsetId);
            let data = {};
            if (indicator.id) {
                data = await getIndicatorData(indicator, regionsetId);
            }
            const formRegions = [...regions].sort((a, b) => a.name.localeCompare(b.name)).map((region) => {
                return {
                    id: region.id,
                    name: region.name,
                    value: data[region.id]
                };
            });
            this.updateState({
                loading: false,
                selectedDataset: dataset,
                formData: {
                    regions: formRegions,
                    labels: labels
                }
            });
        } catch (error) {
            Messaging.error(Oskari.getMsg('StatsGrid', 'errors.regionsDataError'));
            if (regions) {
                this.updateState({
                    loading: false,
                    selectedDataset: dataset,
                    formData: {
                        regions: formRegions,
                        labels: labels
                    }
                });
            } else {
                this.cancelForm();
            }
        }
    }

    cancelForm () {
        this.updateState({
            loading: false,
            selectedDataset: null,
            datasetYear: '',
            datasetRegionset: null,
            formData: {}
        });
    }

    async saveForm () {
        this.updateState({
            loading: true
        });
        const { formData, datasetRegionset } = this.getState();
        const indicator = this.getSelectedIndicator(true);
        if (typeof indicator.name !== 'string' || indicator.name.trim().length === 0) {
            Messaging.warn(this.loc('errors.myIndicatorNameInput'));
            return;
        }
        
        const { regions = [] } = formData;
        // TODO: what is stored? Strings, undefined??
        console.log(regions);
        const data = regions           
            .map(reg => {
                if (typeof reg.value === 'undefined') {
                    return;
                }
                const value = `${reg.value}`.replace(/,/g, '.');
                if (isNaN(value)) {
                    return;
                }
                return {...region, value: Number(value)};
            })
            // remove empty fields
            .filter(region => region);
        // TODO: actually {regionId: value} is required not list
        try {
            indicator.id = await saveIndicator(indicator);
            indicator.hash = getHashForIndicator(indicator);
            this.log().info('Saved indicator', data, 'Indicator: ' + indicator.id);
            if (data.length) {
                await saveIndicatorData(indicator, data, regionset);
                this.log().info('Saved data form values', data, 'Indicator: ' + indicator.id);
            }
            this.selectSavedIndicator(indicator, datasetRegionset);
            this.cancelForm();
            this.getPopupData(indicator);
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorSave'));
            this.cancelForm();
        }
    }

    selectSavedIndicator (indicator, regionset) {
        const handler = this.instance.getStateHandler();
        handler?.addIndicator(indicator, regionset);
        handler?.setActiveIndicator(indicator.hash);
    }

    importFromClipboard (data) {
        const validRows = [];

        const lines = data.match(/[^\r\n]+/g);
        // loop through all the lines and parse municipalities (name or code)
        lines.forEach((line) => {
            let area,
                value;

            // separator can be a tabulator or a semicolon
            const matches = line.match(/([^\t;]+) *[\t;]+ *(.*)/);
            if (matches && matches.length === 3) {
                area = matches[1].trim();
                value = (matches[2] || '').replace(',', '.').replace(/\s/g, '');
                if (Number.isNaN(parseInt(value))) {
                    value = '';
                }
                validRows.push({
                    name: area,
                    value: value
                });
            }
        });

        const formData = this.getState().formData.regions;
        validRows.forEach(row => {
            formData.forEach((data, index) => {
                if (data.name.toLowerCase() === row.name.toLowerCase()) {
                    formData[index].value = row.value;
                }
            });
        });
        this.updateState({
            formData: {
                ...this.getState().formData,
                regions: formData
            }
        });
    }
    // TODO: is this needed? editDataset => showDataTable
    editDataset (selections = {}, regionset) {
        console.log(selections);
        return;
        const indicator = { ...this.getSelectedIndicator(), selections };
        this.showDataTable(indicator, regionset);
    }
    // TODO:
    async deleteDataset (selections = {}, regionset) {
        console.log(selections);
        return;
        const indicator = { ...this.getSelectedIndicator(), selections };
        try {
            await deleteIndicator(indicator, regionset);
        } catch (error) {
            Messaging.error(this.loc('errors.datasetDelete'));
        }
        this.getPopupData(indicator);
    }
}

const wrapped = controllerMixin(IndicatorFormController, [
    'setIndicatorName',
    'setIndicatorDescription',
    'setindicatorSource',
    'setDatasetYear',
    'setDatasetRegionset',
    'showDataTable',
    'addStatisticalData',
    'updateFormData',
    'cancelForm',
    'showClipboardPopup',
    'saveForm',
    'importFromClipboard',
    'setClipboardValue',
    'editDataset',
    'showIndicatorPopup',
    'deleteDataset'
]);

export { wrapped as IndicatorFormHandler };
