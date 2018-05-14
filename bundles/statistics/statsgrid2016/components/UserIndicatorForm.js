Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorForm', function (flyout, service, locale, datasourceId) {
    this.parent = flyout;
    this.locale = locale;
    this.service = service;
    this.datasourceId = datasourceId;
    this.addIndicatorDataForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorDataForm', service, locale, datasourceId);
    this._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
    this.element = null;
    Oskari.makeObservable(this);
    this.createUi();
}, {
    __templates: {
        main: _.template('<div class="stats-user-indicator-form">' +
                            '<div class="stats-not-logged-in oskari-hidden">${warning}</div>' +
                        '</div>'),
        form: _.template('<form class="stats-indicator-details">' +
                            '   <input class="stats-indicator-form-item" type="text" name="name" placeholder="${name}"><br>' +
                            '   <textarea class="stats-indicator-form-item" name="description" form="stats-user-indicator" placeholder="${description}"></textarea> ' +
                            '   <input class="stats-indicator-form-item" type="text" name="datasource" placeholder="${source}"><br>' +
                            '</form>')
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
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
    },
    isLoggedIn: function () {
        return Oskari.user().isLoggedIn();
    },
    resetForm: function () {
        var form = this.getElement().find('form.stats-indicator-details');
        form[0].reset();
        this.addIndicatorDataForm.resetForm();
    },
    getFormData: function () {
        var elements = this.getElement().find('.stats-indicator-form-item');
        var data = {
            indicators: []
        };
        var indicator = {};
        elements.filter(function (index, element) {
            element = jQuery(element);
            var key = element.attr('name');
            indicator[key] = element.val();
        });
        // FIXME: no hard coded IDs!
        indicator['id'] = 1;
        indicator['values'] = this.addIndicatorDataForm.getTableData();
        data['indicators'].push(indicator);
        return data;
    },
    clearUi: function () {
        if (this.element === null) {
            return;
        }
        this.element.empty();
    },
    toggle: function () {
        var form = this.getElement().find('#stats-user-indicator');
        if (form.hasClass('oskari-hidden')) {
            form.removeClass('oskari-hidden');
        } else {
            form.addClass('oskari-hidden');
        }
    },
    createUi: function () {
        var me = this;
        this.clearUi();

        var accordion = this._accordion;
        var main = this.__templates.main({
            warning: this.locale('userIndicators.notLoggedInWarning')
        });
        var form = this.__templates.form({
            name: this.locale('userIndicators.panelGeneric.formName'),
            description: this.locale('userIndicators.panelGeneric.formDescription'),
            source: this.locale('userIndicators.panelGeneric.formDatasource')
        });

        var panel = this._createAccordionPanel(this.locale('userIndicators.panelGeneric.title'));
        var dataPanel = this._createAccordionPanel(this.locale('userIndicators.panelData.title'));
        // panel.getHeader().remove();
        panel.open();
        accordion.addPanel(panel);
        accordion.addPanel(dataPanel);

        var jMain = jQuery(main);
        var jForm = jQuery(form);
        panel.setContent(jForm);
        accordion.insertTo(jMain);

        if (!this.isLoggedIn()) {
            jMain.find('.stats-not-logged-in').removeClass('oskari-hidden');
        }
        me.addIndicatorDataForm.render(dataPanel);
        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.setTitle(this.locale('userIndicators.buttonSave'));
        btn.insertTo(jMain);
        btn.getButton().css('float', 'right');
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

        this.setElement(jMain);
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
    },
    render: function (el) {
        el.append(this.getElement());
    }
});
