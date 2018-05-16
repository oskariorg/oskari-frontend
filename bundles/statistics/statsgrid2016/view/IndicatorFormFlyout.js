Oskari.clazz.define('Oskari.statistics.statsgrid.view.IndicatorFormFlyout', function (title, options, instance) {
    this.instance = instance;
    this.locale = Oskari.getMsg.bind(null, 'StatsGrid');
    this.element = null;
    this.service = instance.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
    this.myIndicatorForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorForm', this.service, this.locale);
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    var me = this;
    me.on('close', function () {
        me.myIndicatorForm.resetForm();
    });
}, {
    _templates: {
        main: _.template('<div class="stats-user-indicator-form">' +
                            '<div class="stats-not-logged-in">${warning}</div>' +
                        '</div>')
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
        var genericInfoPanel = this._createAccordionPanel(this.locale('userIndicators.panelGeneric.title'));
        var dataPanel = this._createAccordionPanel(this.locale('userIndicators.panelData.title'));
        // panel.getHeader().remove();
        genericInfoPanel.open();
        accordion.addPanel(genericInfoPanel);
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

            me.service.saveIndicatorData(me.datasourceId, me.getFormData(), function (err) {
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
    },
    showForm: function (datasourceId, indicatorId) {
        this.show();
        this.createUi();
        // TODO: pass indicator details instead of datasource/indicator id
        this.myIndicatorForm.createForm(datasourceId, indicatorId);
        // this.myIndicatorForm.render(this.getElement());
    },
    /**
     * Creates an accordion panel for legend and classification edit with eventlisteners on open/close
     * @param  {String} title UI label
     * @return {Oskari.userinterface.component.AccordionPanel} panel without content
     */
    _createAccordionPanel: function (title) {
        var panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(title);
        return panel;
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
