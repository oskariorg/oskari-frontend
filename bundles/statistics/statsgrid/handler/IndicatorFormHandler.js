import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { showIndicatorForm } from '../view/Form/IndicatorForm';
import { showClipboardPopup } from '../view/Form/ClipboardPopup';

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

    showIndicatorPopup (datasourceId, indicatorId = null) {
        if (!datasourceId) return;
        this.getPopupData(datasourceId, indicatorId);
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

    getPopupData (datasourceId, indicatorId) {
        const datasource = this.service.getDatasource(datasourceId);
        const regionsetOptions = this.service.getRegionsets(datasource.regionsets);

        if (indicatorId) {
            this.getIndicatorDatasets(datasourceId, indicatorId);
        }
        this.updateState({
            datasource: datasourceId,
            indicator: indicatorId,
            regionsetOptions
        });
    }

    getIndicatorDatasets (datasourceId, indicatorId) {
        this.service.getIndicatorMetadata(datasourceId, indicatorId, (err, ind) => {
            if (err) {
                Messaging.error(Oskari.getMsg('StatsGrid', 'errors.indicatorMetadataError'));
                return;
            }
            const datasets = [];
            ind.selectors.forEach((sel) => {
                ind.regionsets.forEach((regionset) => {
                    sel.allowedValues.forEach((value) => {
                        const data = {};
                        if (typeof value === 'object') {
                            data[sel.id] = value.id;
                        } else {
                            data[sel.id] = value;
                        }
                        data.regionset = regionset;
                        datasets.push(data);
                    });
                });
            });
            this.updateState({
                datasets,
                indicatorName: Oskari.getLocalized(ind.name),
                indicatorDescription: Oskari.getLocalized(ind.description),
                indicatorDatasource: Oskari.getLocalized(ind.source)
            });
        });
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

    showDataTable (datasourceId, dataset, indicatorId) {
        this.updateState({
            loading: true
        });
        const regionset = this.service.getRegionsets(dataset.regionset);
        const labels = {};
        labels[dataset.regionset] = regionset.name;
        let formRegions;
        const promise = new Promise((resolve, reject) => {
            this.service.getRegions(regionset.id, (err, regions) => {
                if (err) {
                    reject(new Error(Oskari.getMsg('StatsGrid', 'errors.regionsDataError')));
                    return;
                }
                const showDataForm = (regions, data) => {
                    data = data || {};
                    formRegions = [...regions].sort((a, b) => a.name.localeCompare(b.name)).map((region) => {
                        return {
                            id: region.id,
                            name: region.name,
                            value: data[region.id]
                        };
                    });
                    resolve();
                };
                if (!indicatorId) {
                    // don't try to get data from backend, just show an empty form with regions
                    showDataForm(regions);
                } else {
                    // try getting existing values for regions
                    this.service.getIndicatorData(datasourceId, indicatorId, { year: dataset.year }, null, dataset.regionset, (err, data) => {
                        if (err) {
                            // Dataset might not exist or network failure. Either way show an empty form
                            Oskari.log('IndicatorFormFlyout').error(err);
                            showDataForm(regions);
                        }
                        // everything ok, setup existing values for regions on form
                        showDataForm(regions, data);
                    });
                }
            });
        });
        promise
            .then(() => {
                this.updateState({
                    loading: false,
                    selectedDataset: dataset,
                    formData: {
                        regions: formRegions,
                        labels: labels
                    }
                });
            })
            .catch((err) => {
                this.updateState({
                    loading: false,
                    selectedDataset: null,
                    datasetYear: '',
                    datasetRegionset: null,
                    formData: {}
                });
                Messaging.error(err);
            });
    }

    cancelForm () {
        this.updateState({
            selectedDataset: null,
            datasetYear: '',
            datasetRegionset: null,
            formData: {}
        });
    }

    saveForm () {
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
        this.state.formData?.regions?.forEach(region => {
            if (region.value && region.value !== '') {
                const value = `${region.value}`.replace(/,/g, '.');
                regionData.values.push({ ...region, value });
            }
        });

        const promise = new Promise((resolve, reject) => {
            // Format raw form data so that it is provided as numbers
            regionData.values.forEach((data, index) => {
                if (!isNaN(data.value)) {
                    regionData.values[index].value = Number(data.value);
                }
            });

            this.saveIndicator(indicatorData, (err, indicator) => {
                if (err) {
                    reject(new Error(err));
                    return;
                };
                if (regionData.values.length) {
                    this.saveIndicatorData(regionData, (err, someData) => {
                        if (err) {
                            reject(new Error(err));
                            return;
                        }
                        Messaging.success(this.loc('userIndicators.dialog.successMsg'));
                        this.selectSavedIndicator(indicator, regionData);
                        resolve();
                    });
                } else {
                    Messaging.success(this.loc('userIndicators.dialog.successMsg'));
                    resolve();
                }
            });
        });
        promise
            .then(() => {
                this.updateState({
                    loading: false,
                    selectedDataset: null,
                    formData: {},
                    datasetYear: '',
                    datasetRegionset: null
                });
                this.getPopupData(this.state.datasource, this.state.indicator);
            })
            .catch(() => {
                this.updateState({
                    loading: false,
                    selectedDataset: null,
                    formData: {},
                    datasetYear: '',
                    datasetRegionset: null
                });
                Messaging.error(this.loc('errors.datasetSave'));
            });
    }

    saveIndicator (data, callback) {
        if (!this.validateIndicator(data)) {
            callback(new Error('Error in indicator validation'));
            return;
        }
        // inject possible id for indicator
        if (this.state.indicator) {
            data.id = this.state.indicator;
        }
        this.service.saveIndicator(this.state.datasource, data, (err, indicator) => {
            if (err) {
                Messaging.error(this.loc('errors.indicatorSave'));
                Oskari.log('IndicatorFormFlyout').error(err);
                callback(err);
                return;
            }
            // update the indicator id we are operating on
            this.updateState({
                indicator: indicator.id
            });
            Oskari.log('IndicatorFormFlyout').info('Saved indicator', data, 'Indicator: ' + indicator.id);
            callback(null, indicator);
        });
    }

    saveIndicatorData (data, callback) {
        if (!this.validateIndicatorData(data)) {
            callback(new Error('Error in data validation'));
            return;
        }

        // save dataset
        Oskari.log('IndicatorFormFlyout').info('Save data form values', data, 'Indicator: ' + this.state.indicator);
        const values = {};
        data.values.forEach((regionData) => {
            values[regionData.id] = regionData.value;
        });

        this.service.saveIndicatorData(this.state.datasource, this.state.indicator, data.selectors, values, (err, someData) => {
            if (err) {
                Messaging.error(this.loc('errors.indicatorSave'));
                callback(err);
                return;
            }
            callback(null, someData);
        });
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
        const stateService = this.service.getStateService();
        stateService.setRegionset(selectors.regionset);
        delete selectors.regionset;
        stateService.addIndicator(ds, id, selectors);
        const hash = stateService.getHash(ds, id, selectors);
        stateService.setActiveIndicator(hash);
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

    deleteDataset (dataset) {
        this.service.deleteIndicator(Number(this.state.datasource), this.state.indicator, { year: dataset.year }, dataset.regionset, (err) => {
            if (err) {
                Messaging.error(this.loc('errors.datasetDelete'));
                return;
            }
            // refresh the dataset listing on form
            this.getPopupData(this.state.datasource, this.state.indicator);
        });
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
