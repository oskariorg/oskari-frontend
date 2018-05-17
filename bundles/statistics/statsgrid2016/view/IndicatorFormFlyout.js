Oskari.clazz.define('Oskari.statistics.statsgrid.view.IndicatorFormFlyout', function (title, options, instance) {
    this.instance = instance;
    this.locale = Oskari.getMsg.bind(null, 'StatsGrid');
    this.element = null;
    this.service = instance.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
    this.indicatorForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorForm', this.locale);
    this.indicatorParamsList = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParametersList', this.locale);
    this.indicatorDataForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorDataForm', this.locale);
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    var me = this;
    me.on('close', function () {
        me.indicatorForm.resetForm();
    });
    this.indicatorParamsList.on('insert.data', function (selectors) {
        me.genericInfoPanel.close();
        me.dataPanel.close();

        // overwrite id with name as it's displayed on the UI
        var regionset = me.service.getRegionsets(selectors.regionset);
        selectors.regionset = regionset.name;
        // TODO: show spinner as getting regions might take a while?
        me.service.getRegions(regionset.id, function (err, regions) {
            if (err) {
                return;
            }
            var formRegions = regions.map(function (region) {
                // TODO: include existing values per region when editing existing dataset
                return {
                    id: region.id,
                    name: region.name
                }
            });
            me.indicatorDataForm.showTable(selectors, formRegions);
        });
    });
    this.indicatorDataForm.on('save', function (data) {
        // TODO: validate values
        var isValidAndSaveSucceeded = true;
        if (isValidAndSaveSucceeded) {
            me.indicatorDataForm.clearUi();
        }
        Oskari.log('IndicatorFormFlyout').info('Save data form values', data);
    });
}, {
    _templates: {
        main: _.template('<div class="stats-user-indicator-form">' +
                            '<div class="stats-not-logged-in">${warning}</div>' +
                        '</div>')
    },
    showForm: function (datasourceId, indicatorId) {
        this.datasourceId = datasourceId;
        this.indicatorId = indicatorId;
        this.show();
        this.createUi();
        this.indicatorForm.createForm();
        // TODO: call this.indicatorForm.setValues() based on datasourceId, indicatorId
        // TODO: pass existing datasets
        this.indicatorParamsList.setDatasets([]);
        // pass available regionsets if user wants to add another year/regionset dataset
        var datasrc = this.service.getDatasource(datasourceId);
        var regionsetsForDatasource = this.service.getRegionsets(datasrc.regionsets);
        this.indicatorParamsList.setRegionsets(regionsetsForDatasource);
    },
    getElement: function () {
        return this.element;
    },
    createUi: function () {
        if (this.getElement()) {
            return;
        }
        this.element = jQuery(this._templates.main({
            warning: this.locale('userIndicators.notLoggedInWarning')
        }));
        if (Oskari.user().isLoggedIn()) {
            // remove the warning about not able to save the data for logged in users
            this.element.find('.stats-not-logged-in').remove();
        }

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
        this.dataPanel = dataPanel;
        this._accordion.addPanel(dataPanel);
        this._accordion.insertTo(this.element);

        var btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        btn.insertTo(this.element);
        btn.getButton().css('float', 'right');
        var me = this;
        btn.setHandler(function (event) {
            event.stopPropagation();
            var data = me.genericInfoPanel.getValues();
            // gather possible indicator year/regionset data as well before saving
            me.service.saveIndicatorData(me.datasourceId, data, function (err) {
                if (err) {
                    // TODO: handle error!
                    return;
                }
                // send out event about new indicators
                var eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                Oskari.getSandbox().notifyAll(eventBuilder(me.datasourceId));
                me.displayInfo();
            });
        });

        this.element.append(this.indicatorDataForm.createUi());
        this.setContent(this.element);
    },
    displayInfo: function () {
        var me = this;
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');
        var title = 'title';
        var content = '';
        okBtn.setPrimary(true);
        okBtn.setHandler(function () {
            dialog.close(true);
            me.parent.hide();
            me.resetForm();
        });
        dialog.show(title, content, [okBtn]);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
