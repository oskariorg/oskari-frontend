Oskari.clazz.define('Oskari.statistics.statsgrid.UserIndicatorDataForm', function ( service, locale, datasource ) {
    this.locale = locale;
    this.datasourceid = datasource;
    this.element = null;
    this.regionselect = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', Oskari.getSandbox(), locale );
    this.service = service;
    if ( !this.getElement() ) {
        this.createUi();
    }
}, {
    __templates: {
        main: _.template('<div class="indicator-data-form oskari-hidden"> '+
                            '<form id="user-indicator">'+
                            '   <input class="stats-indicator-form-item" type="text" name="year" placeholder="${year}"><br>'+
                            '</form>'+
                        '</div>')
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },

    getFormData: function () {
        var elements = this.getElement().find('.stats-indicator-form-item');
        var data = {};
        elements.filter( function (index, element) {
            element = jQuery(element);
            var key = element.attr("name");
            data[key] = element.val();
        });
    },
    toggle: function () {
        if( this.getElement().hasClass('oskari-hidden') ) {
            this.getElement().removeClass('oskari-hidden');
        } else {
            this.getElement().addClass('oskari-hidden');
        }
    },
    clearUi: function () {
        if (this.element === null) {
            return;
        }
        this.element.empty();
    },
    createUi: function () {
        var me = this;
        this.clearUi();

        var main = this.__templates.main({
            year: this.locale.userIndicators.formYear
        });
        var jMain = jQuery(main);
        var ds = this.service.getDatasource(this.datasourceid);
        var region = this.regionselect.create(ds.regionsets);
        jMain.append(region.container);
        this.setElement(jMain);
    },
    render: function (el) {
        el.append( this.getElement() );
    }

});