Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorForm', function (locale) {
    this.locale = locale;
    this.element = null;
}, {
    __templates: {
        form: _.template('<form class="stats-indicator-details">' +
                            // should there be a datasource row here?
                            '   <input class="stats-indicator-form-item" type="text" name="name" placeholder="${name}">' +
                            '   <textarea class="stats-indicator-form-item" name="description" form="stats-user-indicator" placeholder="${description}"></textarea>' +
                            '   <input class="stats-indicator-form-item" type="text" name="datasource" placeholder="${source}">' +
                            '</form>')
    },
    getElement: function () {
        return this.element;
    },
    createForm: function () {
        if (this.getElement()) {
            this.resetForm();
            return this.getElement();
        }
        var form = this.__templates.form({
            name: this.locale('userIndicators.panelGeneric.formName'),
            description: this.locale('userIndicators.panelGeneric.formDescription'),
            source: this.locale('userIndicators.panelGeneric.formDatasource')
        });

        this.element = jQuery(form);
        return this.element;
    },
    setValues: function (name, desc, source) {
        var elements = this.getElement().find('.stats-indicator-form-item');
        elements.each(function (index, el) {
            var element = jQuery(el);
            var key = element.attr('name');
            if (key === 'name') {
                element.val(Oskari.getLocalized(name) || '');
                el.focus();
            } else if (key === 'description') {
                element.val(Oskari.getLocalized(desc) || '');
            } else if (key === 'datasource') {
                element.val(Oskari.getLocalized(source) || '');
            }
        });
    },
    getValues: function () {
        var elements = this.getElement().find('.stats-indicator-form-item');
        var data = {};
        elements.each(function (index, element) {
            element = jQuery(element);
            var key = element.attr('name');
            data[key] = element.val();
        });
        return data;
    },
    resetForm: function () {
        // set empty values
        this.setValues();
    }
});
