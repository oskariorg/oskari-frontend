Oskari.clazz.define('Oskari.statistics.statsgrid.view.IndicatorFormFlyout', function (title, options, instance) {
    this.instance = instance;
    this.locale = Oskari.getMsg.bind(null, 'StatsGrid');
    this.element = null;
    this.service = instance.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
    this.indicatorForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorForm', this.locale);
    this.indicatorParamsList = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParametersList', this.locale);
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    var me = this;
    me.on('close', function () {
        me.indicatorForm.resetForm();
    });
    this.indicatorParamsList.on('insert.data', function (selectors) {
        // TODO: Show data form
        Oskari.log('IndicatorFormFlyout').info('Show data form for', selectors);
    });
}, {
    _templates: {
        main: _.template('<div class="stats-user-indicator-form">' +
                            '<div class="stats-not-logged-in">${warning}</div>' +
                        '</div>')
    },
    showForm: function (datasourceId, indicatorId) {
        this.show();
        this.createUi();
        // TODO: pass indicator details instead of datasource/indicator id
        this.indicatorForm.createForm(datasourceId, indicatorId);
        // TODO: pass existing datasets
        this.indicatorParamsList.setDatasets([]);
        // TODO: pass existing datasets
        var datasrc = this.service.getDatasource(datasourceId);
        var regionsetsForDatasource = this.service.getRegionsets(datasrc.regionsets);
        this.indicatorParamsList.setRegionsets(regionsetsForDatasource);
        // this.indicatorForm.render(this.getElement());
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
        var accordion = this._accordion;
        // generic info
        var genericInfoPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        genericInfoPanel.setTitle(this.locale('userIndicators.panelGeneric.title'));
        genericInfoPanel.open();
        genericInfoPanel.setContent(this.indicatorForm.createForm());
        accordion.addPanel(genericInfoPanel);

        // statistical data
        var dataPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        dataPanel.setTitle(this.locale('userIndicators.panelData.title'));
        dataPanel.setContent(this.indicatorParamsList.createUi());
        accordion.addPanel(dataPanel);
        accordion.insertTo(this.element);

        if (Oskari.user().isLoggedIn()) {
            // remove the warning about not able to save the data for logged in users
            this.element.find('.stats-not-logged-in').remove();
        }

        var btn = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        btn.insertTo(this.element);
        btn.getButton().css('float', 'right');
        var me = this;
        btn.setHandler(function (event) {
            event.stopPropagation();

            me.service.saveIndicatorData(me.datasourceId, me.genericInfoPanel.getValues(), function (err) {
                if (err) {
                    return;
                }
                // send out event about new indicators
                var eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                Oskari.getSandbox().notifyAll(eventBuilder(me.datasourceId));
                me.displayInfo();
            });
        });

        this.setContent(this.element);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
