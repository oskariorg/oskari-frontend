Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorForm', function (service, locale) {
    // this.parent = flyout;
    this.locale = locale;
    this.service = service;
    // this.datasourceId = datasourceId;
    // this.addIndicatorDataForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorParametersList', service, locale, datasourceId);
    this.element = null;
    // this.createUi();
}, {
    __templates: {
        form: _.template('<form class="stats-indicator-details">' +
                            '   <input class="stats-indicator-form-item" type="text" name="name" placeholder="${name}"><br>' +
                            '   <textarea class="stats-indicator-form-item" name="description" form="stats-user-indicator" placeholder="${description}"></textarea> ' +
                            '   <input class="stats-indicator-form-item" type="text" name="datasource" placeholder="${source}"><br>' +
                            '</form>')
    },
    getElement: function () {
        return this.element;
    },
    createForm: function (datasourceId, indicatorId) {

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
        // indicator['id'] = 1;
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
        this.clearUi();

        var form = this.__templates.form({
            name: this.locale('userIndicators.panelGeneric.formName'),
            description: this.locale('userIndicators.panelGeneric.formDescription'),
            source: this.locale('userIndicators.panelGeneric.formDatasource')
        });

        this.element = jQuery(form);
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
