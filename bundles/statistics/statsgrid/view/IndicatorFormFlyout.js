import { Messaging } from 'oskari-ui/util';

Oskari.clazz.define('Oskari.statistics.statsgrid.view.IndicatorFormFlyout', function (title, options, instance) {
    this.instance = instance;
    this.locale = Oskari.getMsg.bind(null, 'StatsGrid');
    this.uiElement = null;
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.service = instance.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
    this.indicatorForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorForm', this.locale);
    this.indicatorParamsList = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParametersList', this.locale);
    this.indicatorDataForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorDataForm', this.locale);
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    const me = this;
    this.errorService = this.service.getErrorService();
    me.on('hide', function () {
        me.reset();
    });
    // handle paramslist "add data button" -> show form to input data
    this.indicatorParamsList.on('insert.data', function (selectors) {
        me.showDatasetForm(selectors, true);
    });
    // handle paramslist edit link -> show form to edit data
    this.indicatorParamsList.on('edit.data', function (selectors) {
        me.showDatasetForm(selectors, false);
    });

    this.indicatorParamsList.on('delete.data', function (selectors) {
        me.service.deleteIndicator(Number(me.datasourceId), me.indicatorId, { year: selectors.year }, selectors.regionset, function (err) {
            if (err) {
                me.errorService.show(me.locale('errors.title'), me.locale('errors.datasetDelete'));
                return;
            }
            // refresh the dataset listing on form
            me.updateDatasetList();
        });
    });

    this.indicatorDataForm.on('cancel', function () {
        me.genericInfoPanel.close();
        me.dataPanel.open();
        me.indicatorParamsList.showAddDatasetForm(!me.indicatorId);
    });
}, {
    _templates: {
        main: '<div></div>',
        notLoggedIn: _.template('<div class="stats-not-logged-in">${warning}</div>'),
        spinner: '<div class="spinner-holder"></div>'
    },
    /**
     * Main external API function - shows the form for given indicator
     */
    showForm: function (datasourceId, indicatorId) {
        if (!datasourceId) {
            this.errorService.error(this.locale('errors.myIndicatorDatasource'));
            return;
        }
        if (this.isVisible()) {
            this.reset();
        }
        this.datasourceId = datasourceId;
        this.indicatorId = indicatorId;
        this.createUi();
        this.showOnPosition();

        // set empty values to focus on name field
        this.indicatorForm.setValues();
        // pass available regionsets if user wants to add another year/regionset dataset
        const datasrc = this.service.getDatasource(datasourceId);
        const regionsetsForDatasource = this.service.getRegionsets(datasrc.regionsets);
        this.indicatorParamsList.setRegionsets(regionsetsForDatasource);
        this.indicatorParamsList.showAddDatasetForm(!this.indicatorId);
        this.saveBtn.setPrimary(!!this.indicatorId);

        if (indicatorId) {
            this.updateDatasetList();
        }
    },
    updateDatasetList: function () {
        // call this.indicatorForm.setValues() based on datasourceId, indicatorId passing existing datasets
        if (!this.isVisible()) {
            return;
        }

        const me = this;
        const locale = this.locale;

        this.service.getIndicatorMetadata(me.datasourceId, me.indicatorId, function (err, ind) {
            if (err) {
                me.errorService.show(locale('errors.title'), locale('errors.indicatorMetadataError'));
                return;
            }
            me.indicatorForm.setValues(ind.name, ind.description, ind.source);
            const datasets = [];
            ind.selectors.forEach(function (sel) {
                ind.regionsets.forEach(function (regionset) {
                    sel.allowedValues.forEach(function (value) {
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
            me.indicatorParamsList.setDatasets(datasets); // [{ year : 2017, regionset: 1850}]
        });
    },
    getUiElement: function () {
        return this.uiElement;
    },
    reset: function () {
        this.datasourceId = null;
        this.indicatorId = null;
        this.indicatorForm.resetForm();
        this.indicatorParamsList.setDatasets();
        this.indicatorDataForm.clearUi();
    },
    /**
     * Internal function to create the baseline UI
     */
    createUi: function () {
        const me = this;
        if (this.getUiElement()) {
            return;
        }
        this.uiElement = jQuery(this._templates.main);
        this.addClassForContent('stats-user-indicator-form');

        if (!Oskari.user().isLoggedIn()) {
            const popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const content = jQuery(this._templates.notLoggedIn({
                warning: this.locale('userIndicators.notLoggedInWarning')
            }));
            popup.show(me.locale('userIndicators.notLoggedInTitle'), content);
            popup.fadeout();
        }

        // generic info
        const genericInfoPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        genericInfoPanel.setTitle(this.locale('userIndicators.panelGeneric.title'));
        genericInfoPanel.open();
        genericInfoPanel.setContent(this.indicatorForm.createForm());
        this.genericInfoPanel = genericInfoPanel;
        this._accordion.addPanel(genericInfoPanel);

        // statistical data
        const dataPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        dataPanel.setTitle(this.locale('userIndicators.panelData.title'));
        dataPanel.setContent(this.indicatorParamsList.createUi());
        dataPanel.open();
        this.dataPanel = dataPanel;
        this._accordion.addPanel(dataPanel);
        this._accordion.insertTo(this.uiElement);

        const spinnerHolder = jQuery(this._templates.spinner);
        this.uiElement.append(spinnerHolder);
        this.spinner.insertTo(spinnerHolder);
        this.uiElement.append(this.indicatorDataForm.createUi());

        me.indicatorDataForm.getButtons().forEach(function (btn) {
            btn.insertTo(me.uiElement);
        });

        const saveBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        this.saveBtn = saveBtn;
        saveBtn.insertTo(this.uiElement);
        jQuery(saveBtn.getElement()).css({
            float: 'right',
            clear: 'both'
        });
        const onSuccess = () => {
            me.genericInfoPanel.close();
            me.dataPanel.open();
            me.indicatorParamsList.showAddDatasetForm(!me.indicatorId);
            me.indicatorDataForm.clearUi();
            me.updateDatasetList();

            Messaging.success(this.locale('userIndicators.dialog.successMsg'));
        };
        saveBtn.setHandler(function () {
            const dataForm = me.indicatorForm.getValues();
            const valuesForm = me.indicatorDataForm.getValues();

            // Format raw form data so that it is provided as numbers
            valuesForm.values.forEach((regionData, index) => {
                if (!isNaN(regionData.value)) {
                    valuesForm.values[index].value = Number(regionData.value);
                }
            });

            me.saveIndicator(dataForm, function (err, indicator) {
                if (err) {
                    me.genericInfoPanel.open();
                    return;
                }
                if (valuesForm.values.length) {
                    me.saveIndicatorData(valuesForm, function (err, someData) {
                        if (err) {
                            return;
                        }
                        onSuccess(indicator, valuesForm);
                        me.selectSavedIndicator(indicator, valuesForm);
                    });
                } else {
                    onSuccess(indicator, valuesForm);
                }
            });
        });
        this.setContent(this.uiElement);
    },
    setSpinnerVisible: function (show) {
        this.uiElement.find('.spinner-holder').css('height', show ? '100px' : '0');
        show ? this.spinner.start() : this.spinner.stop();
    },
    selectSavedIndicator: function (indicator, data) {
        const { ds, id } = indicator;
        const selectors = { ...data.selectors };
        const stateService = this.service.getStateService();
        stateService.setRegionset(selectors.regionset);
        delete selectors.regionset;
        stateService.addIndicator(ds, id, selectors);
        const hash = stateService.getHash(ds, id, selectors);
        stateService.setActiveIndicator(hash);
    },
    /**
     * Opens a form for user to add or edit data for indicators year/regionset
     */
    showDatasetForm: function (selectors, isNew) {
        const me = this;
        const locale = this.locale;
        me.genericInfoPanel.close();
        me.dataPanel.close();

        // overwrite id with name as it's displayed on the UI
        const regionset = me.service.getRegionsets(selectors.regionset);
        const labels = {};
        labels[selectors.regionset] = regionset.name;

        me.setSpinnerVisible(true);
        me.service.getRegions(regionset.id, function (err, regions) {
            me.setSpinnerVisible(false);
            if (err) {
                me.errorService.show(locale('errors.title'), locale('errors.regionsDataError'));
                return;
            }
            const showDataForm = function (regions, data) {
                data = data || {};
                const formRegions = [...regions].sort((a, b) => a.name.localeCompare(b.name)).map(function (region) {
                    // TODO: include existing values per region when editing existing dataset
                    return {
                        id: region.id,
                        name: region.name,
                        value: data[region.id]
                    };
                });
                me.indicatorDataForm.showTable(selectors, formRegions, labels);
                me.saveBtn.setPrimary(true);
            };
            if (!me.indicatorId || isNew) {
                // don't try to get data from backend, just show an empty form with regions
                showDataForm(regions);
                return;
            }
            // try getting existing values for regions
            me.service.getIndicatorData(me.datasourceId, me.indicatorId, { year: selectors.year }, null, selectors.regionset, function (err, data) {
                if (err) {
                    // Dataset might not exist or network failure. Either way show an empty form
                    Oskari.log('IndicatorFormFlyout').error(err);
                    showDataForm(regions);
                    return;
                }
                // everything ok, setup existing values for regions on form
                showDataForm(regions, data);
            });
        });
    },
    validateIndicator: function (data) {
        const { name } = data;
        if (typeof name !== 'string' || name.trim().length === 0) {
            this.errorService.warn(this.locale('errors.myIndicatorNameInput'));
            return false;
        }
        return true;
    },
    validateIndicatorData: function (regionValues) {
        for (const singleRegion of regionValues.values) {
            if (typeof singleRegion.value === 'undefined' || isNaN(singleRegion.value) || typeof singleRegion.value !== 'number') {
                this.errorService.warn(this.locale('errors.myIndicatorInvalidData'));
                return false;
            }
        }

        return true;
    },
    /**
     * Saves the indicator name, description etc
     */
    saveIndicator: function (data, callback) {
        if (!this.validateIndicator(data)) {
            callback(new Error('Error in indicator validation'));
            return;
        }
        // inject possible id for indicator
        data.id = this.indicatorId;
        this.service.saveIndicator(this.datasourceId, data, (err, indicator) => {
            if (err) {
                this.errorService.error(this.locale('errors.indicatorSave'));
                Oskari.log('IndicatorFormFlyout').error(err);
                callback(err);
                return;
            }
            // update the indicator id we are operating on
            this.indicatorId = indicator.id;
            Oskari.log('IndicatorFormFlyout').info('Saved indicator', data, 'Indicator: ' + indicator.id);
            callback(null, indicator);
        });
    },
    /**
     * Adds/edits a year/regionset dataset for an indicator
     */
    saveIndicatorData: function (data, callback) {
        if (!this.validateIndicatorData(data)) {
            callback(new Error('Error in data validation'));
            return;
        }

        // save dataset
        Oskari.log('IndicatorFormFlyout').info('Save data form values', data, 'Indicator: ' + this.indicatorId);
        const values = {};
        data.values.forEach(function (regionData) {
            values[regionData.id] = regionData.value;
        });

        this.service.saveIndicatorData(this.datasourceId, this.indicatorId, data.selectors, values, (err, someData) => {
            if (err) {
                this.errorService.error(this.locale('errors.indicatorSave'));
                callback(err);
                return;
            }
            callback(null, someData);
        });
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
