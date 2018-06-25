Oskari.clazz.define('Oskari.statistics.statsgrid.SpanSelect', function (locale, options) {
    this.locale = locale;
    this.element = null;
    this.selectOptions = options;
    this.selections = {
        from: null,
        to: null
    };
    this._createUI();
}, {
    __templates: {
        main: _.template('<div class="parameter margintop"><div class="clear"></div></div>'),
        select: _.template('<div class="label">${label}</div>')
    },
    getId: function () {
        return this.selectOptions.id;
    },
    getElement: function () {
        return this.element;
    },
    _createUI: function () {
        var cont = jQuery(this.__templates.main());
        var lblFrom = this.selectOptions.title + ' ' + this.locale.parameters.from;
        var lblTo = this.selectOptions.title + ' ' + this.locale.parameters.to;
        var tempFrom = jQuery(this.__templates.select({label: lblFrom}));
        var tempTo = jQuery(this.__templates.select({label: lblTo}));

        var options = {
            placeholder_text: this.selectOptions.placeholder_text
        }
        var from = Oskari.clazz.create('Oskari.userinterface.component.SelectList', this.selectOptions.id + '_from');
        var to = Oskari.clazz.create('Oskari.userinterface.component.SelectList', this.selectOptions.id + '_to');

        var widthDef = {width: '205px'};
        var dropdown = to.create(this.selectOptions.values, options);
        dropdown.css(widthDef);
        to.adjustChosen();
        to.selectFirstValue();
        tempTo.append(dropdown);
        tempTo.css(widthDef);
        cont.prepend(tempTo);
        this.selections.to = to;

        dropdown = from.create(this.selectOptions.values, options);
        dropdown.css(widthDef);
        from.adjustChosen();
        from.selectLastValue();
        tempFrom.append(dropdown);
        tempFrom.css(widthDef);
        cont.prepend(tempFrom);
        this.selections.from = from;

        this.element = cont;
    },
    getValue: function () {
        var me = this;
        if (me.selectOptions.values) {
            var filtered = this.selectOptions.values.filter(function (option) {
                var value = option.id;
                var ok = true;
                var from = me.selections.from ? me.selections.from.getValue() : false;
                var to = me.selections.to ? me.selections.to.getValue() : false;
                if (from) {
                    ok = from <= value;
                }
                if (ok) {
                    if (to) {
                        ok = to >= value;
                    }
                }
                return ok;
            }).map(function (option) {
                return option.id;
            });
            return filtered;
        }
        return [];
    }

});
