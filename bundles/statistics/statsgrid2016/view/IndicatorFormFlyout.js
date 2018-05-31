Oskari.clazz.define('Oskari.statistics.statsgrid.view.IndicatorFormFlyout', function (title, options, instance) {
    this.instance = instance;
    this.locale = Oskari.getMsg.bind(null, 'StatsGrid');
    this.element = null;
    this.service = instance.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
    this.indicatorForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorForm', this.locale);
    this.indicatorParamsList = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParametersList', this.locale);
    this.indicatorDataForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorDataForm', this.locale);
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    this.addClass('statsgrid-user-indicator-flyout');
    var me = this;
    this.errorService = this.service.getErrorService();
    me.on('hide', function () {
        me.reset();
    });
    // handle paramslist "add data button" -> show form to input/edit data
    this.indicatorParamsList.on('insert.data', function (selectors) {
        me.showDatasetForm(selectors);
    });

    this.indicatorParamsList.on('delete.data', function (selectors) {
        me.service.deleteIndicator(me.datasourceId, me.indicatorId, { year: selectors.year }, selectors.regionset, function (err) {
            if (err) {
                me.errorService.show(me.locale('errors.title'), me.locale('errors.datasetDelete'));
                return;
            }
            // refresh the dataset listing on form
            me.updateDatasetList();
        });
    });

    this.indicatorDataForm.on('cancel', function () {
        me.genericInfoPanel.open();
        me.dataPanel.open();
    });
    this.indicatorDataForm.on('save', function (data) {
        me.saveIndicatorData(data, function (err, notReallySureWhatThisCouldBe) {
            if (err) {
                me.errorService.show(me.locale('errors.title'), me.locale('errors.datasetSave'));
                return;
            }
            // TODO: update paramsList?
            me.indicatorDataForm.clearUi();
        });
    });
}, {
    _templates: {
        main: _.template('<div class="stats-user-indicator-form">' +
                            '<div class="stats-not-logged-in">${warning}</div>' +
                        '</div>')
    },
    /**
     * Main external API function - shows the form for given indicator
     */
    showForm: function (datasourceId, indicatorId) {
        this.datasourceId = datasourceId;
        this.indicatorId = indicatorId;
        this.show();
        this.createUi();
        this.indicatorForm.createForm();
        // pass available regionsets if user wants to add another year/regionset dataset
        var datasrc = this.service.getDatasource(datasourceId);
        var regionsetsForDatasource = this.service.getRegionsets(datasrc.regionsets);
        this.indicatorParamsList.setRegionsets(regionsetsForDatasource);

        if (!indicatorId) {
            return;
        }
        this.updateDatasetList();
    },
    updateDatasetList: function () {
        // call this.indicatorForm.setValues() based on datasourceId, indicatorId passing existing datasets
        var me = this;
        var locale = this.locale;
        this.service.getIndicatorMetadata(me.datasourceId, me.indicatorId, function (err, ind) {
            if (err) {
                me.errorService.show(locale('errors.title'), locale('errors.indicatorMetadataError'));
                return;
            }
            me.indicatorForm.setValues(ind.name, ind.description, ind.source);
            var datasets = [];
            ind.selectors.forEach(function (sel) {
                ind.regionsets.forEach(function (regionset) {
                    sel.allowedValues.forEach(function (value) {
                        var data = {};
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
    getElement: function () {
        return this.element;
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
        if (this.getElement()) {
            return;
        }
        this.element = jQuery(this._templates.main({
            warning: this.locale('userIndicators.notLoggedInWarning')
        }));
        /*
        // FOR NOW SAVING THE DATA IS NOT SUPPORTED FOR ANYONE
        if (Oskari.user().isLoggedIn()) {
            // remove the warning about not able to save the data for logged in users
            this.element.find('.stats-not-logged-in').remove();
        }
        */

        // generic info
        var genericInfoPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        genericInfoPanel.setTitle(this.locale('userIndicators.panelGeneric.title'));
        genericInfoPanel.open();
        genericInfoPanel.setContent(this.indicatorForm.createForm());
        this.genericInfoPanel = genericInfoPanel;
        this._accordion.addPanel(genericInfoPanel);

        // statistical data
        var dataPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        dataPanel.setTitle(this.locale('userIndicators.panelData.title'));
        dataPanel.setContent(this.indicatorParamsList.createUi());
        dataPanel.open();
        this.dataPanel = dataPanel;
        this._accordion.addPanel(dataPanel);
        this._accordion.insertTo(this.element);

        var btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        btn.insertTo(this.element);
        jQuery(btn.getElement()).css({
            'float': 'right',
            'clear': 'both'
        });

        var me = this;
        btn.setHandler(function (event) {
            event.stopPropagation();
            me.saveIndicator(me.indicatorForm.getValues(), function (err, indicator) {
                if (err) {
                    me.errorService.show(me.locale('errors.title'), me.locale('errors.indicatorSave'));
                    return;
                }
                var dataForm = me.indicatorDataForm.getValues();
                if (dataForm.values.length) {
                    me.saveIndicatorData(dataForm, function (err, someData) {
                        if (err) {
                            me.errorService.show(me.locale('errors.title'), me.locale('errors.indicatorSave'));
                            Oskari.log('IndicatorFormFlyout').error(err);
                            return;
                        }
                        me.displayInfo();
                    });
                } else {
                    me.displayInfo();
                }
            });
        });

        this.element.append(this.indicatorDataForm.createUi());
        this.setContent(this.element);
    },
    /**
     * Opens a form for user to add or edit data for indicators year/regionset
     */
    showDatasetForm: function (selectors) {
        var me = this;
        var locale = this.locale;
        me.genericInfoPanel.close();
        me.dataPanel.close();

        // overwrite id with name as it's displayed on the UI
        var regionset = me.service.getRegionsets(selectors.regionset);
        var labels = {};
        labels[selectors.regionset] = regionset.name;

        // TODO: show spinner as getting regions might take a while?
        me.service.getRegions(regionset.id, function (err, regions) {
            if (err) {
                me.errorService.show(locale('errors.title'), locale('errors.regionsDataError'));
                return;
            }
            var showDataForm = function (regions, data) {
                data = data || {};
                var formRegions = regions.map(function (region) {
                    // TODO: include existing values per region when editing existing dataset
                    return {
                        id: region.id,
                        name: region.name,
                        value: data[region.id]
                    }
                });
                me.indicatorDataForm.showTable(selectors, formRegions, labels);
            }
            if (!me.indicatorId) {
                // not editing an indicator -> just show an empty form with regions
                showDataForm(regions);
                return;
            }
            // try getting existing values for regions
            me.service.getIndicatorData(me.datasourceId, me.indicatorId, { year: selectors.year }, selectors.regionset, function (err, data) {
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
    /**
     * Saves the indicator name, description etc
     */
    saveIndicator: function (data, callback) {
        var me = this;
        // TODO: validate values
        var isValid = function (data) {
            if (typeof (data.name) !== 'string' || data.name.length === 0) {
                return false;
            }
            return true;
        }

        if (!isValid(data)) {
            callback('Input not valid');
            return;
        }
        // inject possible id for indicator
        data.id = me.indicatorId;
        me.service.saveIndicator(me.datasourceId, data, function (err, indicator) {
            if (err) {
                callback(err);
                return;
            }
            // update the indicator id we are operating on
            me.indicatorId = indicator.id;
            Oskari.log('IndicatorFormFlyout').info('Saved indicator', data, 'Indicator: ' + indicator.id);
            callback(null, indicator);
        });
    },
    /**
     * Adds/edits a year/regionset dataset for an indicator
     */
    saveIndicatorData: function (data, callback) {
        var me = this;
        if (!this.indicatorId) {
            // new indicator, we need to save it first!
            this.saveIndicator(this.indicatorForm.getValues(), function (err, indicator) {
                if (err) {
                    callback(err);
                    return;
                }
                // call self again now that we have an indicator we can attach the dataset to
                me.saveIndicatorData(data, callback);
            });
            return;
        }

        // TODO: validate values
        var isValid = true;
        if (!isValid) {
            callback('Input not valid');
            return;
        }

        // save dataset
        Oskari.log('IndicatorFormFlyout').info('Save data form values', data, 'Indicator: ' + this.indicatorId);
        var values = {};
        data.values.forEach(function (regionData) {
            values[regionData.id] = regionData.value;
        });
        me.service.saveIndicatorData(me.datasourceId, this.indicatorId, data.selectors, values, function (err, someData) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, someData);
        });
    },
    displayInfo: function () {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
        // TODO: add a button to show the added indicator on map or just show it right away?
        // TODO: add the name of the indicator and/or year/regionset that was added/modified?
        var title = this.locale('userIndicators.dialog.successTitle');
        var content = this.locale('userIndicators.dialog.successMsg');
        okBtn.setPrimary(true);
        okBtn.setHandler(function () {
            dialog.close(true);
            me.hide();
        });
        dialog.show(title, content, [okBtn]);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
