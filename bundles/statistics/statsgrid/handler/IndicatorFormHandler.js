import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showIndicatorForm } from '../view/Form/IndicatorForm';
import { showClipboardPopup } from '../view/Form/ClipboardPopup';
import { getHash } from '../helper/StatisticsHelper';

class IndicatorFormController extends StateHandler {
    constructor (stateHandler, service, sandbox) {
        super();
        this.stateHandler = stateHandler;
        this.service = service;
        this.sandbox = sandbox;
        this.setState({
            indicatorName: '',
            indicatorDescription: '',
            indicatorDatasource: '',
            indicatorPopup: null,
            clipboardPopup: null,
            indicator: null,
            datasource: null,
            regionsetOptions: [],
            datasets: [],
            datasetYear: '',
            datasetRegionset: null,
            selectedDataset: null,
            formData: {},
            clipboardValue: ''
        });
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.addStateListener(() => this.updatePopup());
    };

    getName () {
        return 'IndicatorFormHandler';
    }

    async showIndicatorPopup (datasourceId, indicatorId = null) {
        if (!datasourceId) return;
        await this.getPopupData(datasourceId, indicatorId);
        if (!this.state.indicatorPopup) {
            this.updateState({
                indicatorPopup: showIndicatorForm(this.getState(), this.getController(), () => this.closeIndicatorPopup())
            });
        }
    }

    reset () {
        this.updateState({
            indicatorName: '',
            indicatorDatasource: '',
            indicatorDescription: '',
            indicator: null,
            datasource: null,
            regionsetOptions: null,
            datasets: null,
            datasetYear: '',
            datasetRegionset: null,
            selectedDataset: null,
            formData: {},
            clipboardValue: ''
        });
    }

    closeIndicatorPopup () {
        if (this.state.indicatorPopup) {
            this.state.indicatorPopup.close();
        }
        this.reset();
        this.updateState({
            indicatorPopup: null
        });
        this.closeClipboardPopup();
    }

    updatePopup () {
        if (this.state.clipboardPopup) {
            this.state.clipboardPopup.update(this.getState());
        }
        if (this.state.indicatorPopup) {
            this.state.indicatorPopup.update(this.getState());
        }
    }

    showClipboardPopup () {
        if (!this.state.clipboardPopup) {
            this.updateState({
                clipboardPopup: showClipboardPopup(this.getState(), this.getController(), () => this.closeClipboardPopup())
            });
        }
    }

    closeClipboardPopup () {
        if (this.state.clipboardPopup) {
            this.state.clipboardPopup.close();
        }
        this.updateState({
            clipboardPopup: null,
            clipboardValue: ''
        });
    }

    async getPopupData (datasourceId, indicatorId) {
        const datasource = this.service.getDatasource(datasourceId);
        const regionsetOptions = this.service.getRegionsets(datasource.regionsets);

        if (indicatorId) {
            await this.getIndicatorDatasets(datasourceId, indicatorId);
        }
        this.updateState({
            datasource: datasourceId,
            indicator: indicatorId,
            regionsetOptions
        });
    }

    async getIndicatorDatasets (datasourceId, indicatorId) {
        try {
            const ind = await this.service.getIndicatorMetadata(datasourceId, indicatorId);
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
                indicatorDatasource: Oskari.getLocalized(ind.source)
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

    setIndicatorDatasource (value) {
        this.updateState({
            indicatorDatasource: value
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

    setClipboardValue (value) {
        this.updateState({
            clipboardValue: value
        });
    }

    addStatisticalData () {
        if (this.state.datasetYear.length === 0 || isNaN(this.state.datasetYear)) {
            Messaging.error(this.loc('errors.myIndicatorYearInput'));
            return;
        }
        if (!this.state.datasetRegionset) {
            Messaging.error(this.loc('errors.myIndicatorRegionselect'));
            return;
        }
        const dataset = {
            year: this.state.datasetYear,
            regionset: this.state.datasetRegionset
        };
        this.showDataTable(this.state.datasource, dataset, this.state.indicator);
    }

    updateFormData (value, regionId) {
        const regions = this.state.formData?.regions?.map(region => {
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
                ...this.state.formData,
                regions
            }
        });
    }

    async showDataTable (datasourceId, dataset, indicatorId) {
        this.updateState({
            loading: true
        });
        const regionset = this.service.getRegionsets(dataset.regionset);
        const labels = {};
        labels[dataset.regionset] = regionset.name;
        let formRegions;
        let regions;

        try {
            regions = await this.service.getRegions(regionset.id);
            let data;
            if (indicatorId) {
                data = await this.service.getIndicatorData(datasourceId, indicatorId, { year: dataset.year }, null, dataset.regionset);
            }
            formRegions = [...regions].sort((a, b) => a.name.localeCompare(b.name)).map((region) => {
                return {
                    id: region.id,
                    name: region.name,
                    value: data ? data[region.id] : null
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
                this.updateState({
                    loading: false,
                    selectedDataset: null,
                    datasetYear: '',
                    datasetRegionset: null,
                    formData: {}
                });
            }
        }
    }

    cancelForm () {
        this.updateState({
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
        const indicatorData = {
            name: this.state.indicatorName,
            description: this.state.indicatorDescription,
            datasource: this.state.indicatorDatasource
        };
        const regionData = {
            selectors: this.state.selectedDataset,
            values: []
        };
        for (const region of this.state.formData?.regions || []) {
            if (region.value && region.value !== '') {
                const value = `${region.value}`.replace(/,/g, '.');
                regionData.values.push({ ...region, value });
            }
        }

        try {
            let index = 0;
            for (const data of regionData?.values) {
                if (!isNaN(data.value)) {
                    regionData.values[index].value = Number(data.value);
                }
                index++;
            }
            const saveIndicator = await this.saveIndicator(indicatorData);
            if (regionData.values?.length) {
                await this.saveIndicatorData(regionData);
            }
            this.selectSavedIndicator(saveIndicator, regionData);
            this.updateState({
                loading: false,
                selectedDataset: null,
                formData: {},
                datasetYear: '',
                datasetRegionset: null
            });
            this.getPopupData(this.state.datasource, this.state.indicator);
        } catch (error) {
            Messaging.error(this.loc('errors.indicatorSave'));
            this.updateState({
                loading: false,
                selectedDataset: null,
                formData: {},
                datasetYear: '',
                datasetRegionset: null
            });
        }
    }

    async saveIndicator (data) {
        if (!this.validateIndicator(data)) {
            Messaging.error('Error in indicator validation');
            return;
        }
        // inject possible id for indicator
        if (this.state.indicator) {
            data.id = this.state.indicator;
        }
        try {
            const response = await this.service.saveIndicator(this.state.datasource, data);
            this.updateState({
                indicator: response.id
            });
            Oskari.log('IndicatorFormFlyout').info('Saved indicator', data, 'Indicator: ' + response.id);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    async saveIndicatorData (data) {
        if (!this.validateIndicatorData(data)) {
            Messaging.error('Error in data validation');
            return;
        }

        // save dataset
        Oskari.log('IndicatorFormFlyout').info('Save data form values', data, 'Indicator: ' + this.state.indicator);
        const values = {};
        for (const regionData of data?.values) {
            values[regionData.id] = regionData.value;
        }

        try {
            const response = await this.service.saveIndicatorData(this.state.datasource, this.state.indicator, data.selectors, values);
            return response;
        } catch (error) {
            throw new Error(error);
        }
    }

    validateIndicator (data) {
        const { name } = data;
        if (typeof name !== 'string' || name.trim().length === 0) {
            Messaging.warn(this.loc('errors.myIndicatorNameInput'));
            return false;
        }
        return true;
    }

    validateIndicatorData (regionValues) {
        for (const singleRegion of regionValues.values) {
            if (typeof singleRegion.value === 'undefined' || isNaN(singleRegion.value) || typeof singleRegion.value !== 'number') {
                Messaging.warn(this.loc('errors.myIndicatorInvalidData'));
                return false;
            }
        }
        return true;
    }

    selectSavedIndicator (indicator, data) {
        const { ds, id } = indicator;
        const selectors = { ...data.selectors };
        this.stateHandler.getController().setActiveRegionset(selectors.regionset);
        delete selectors.regionset;
        this.stateHandler.addIndicator(ds, id, selectors);
        const hash = getHash(ds, id, selectors);
        this.stateHandler.setActiveIndicator(hash);
    }

    importFromClipboard () {
        const data = this.state.clipboardValue;
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

        const formData = this.state.formData.regions;
        validRows.forEach(row => {
            formData.forEach((data, index) => {
                if (data.name.toLowerCase() === row.name.toLowerCase()) {
                    formData[index].value = row.value;
                }
            });
        });
        this.updateState({
            formData: {
                ...this.state.formData,
                regions: formData
            }
        });
        this.closeClipboardPopup();
    }

    editDataset (dataset) {
        this.showDataTable(this.state.datasource, { year: dataset.year, regionset: dataset.regionset }, this.state.indicator);
    }

    async deleteDataset (dataset) {
        try {
            await this.service.deleteIndicator(Number(this.state.datasource), this.state.indicator, { year: dataset.year }, dataset.regionset);
        } catch (error) {
            Messaging.error(this.loc('errors.datasetDelete'));
        }
        this.getPopupData(this.state.datasource, this.state.indicator);
    }
}

const wrapped = controllerMixin(IndicatorFormController, [
    'setIndicatorName',
    'setIndicatorDescription',
    'setIndicatorDatasource',
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
