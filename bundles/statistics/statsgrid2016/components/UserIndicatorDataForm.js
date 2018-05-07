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
        main: _.template('<div class="user-indicator-main"> '+
                        '</div>'),
        form: _.template('<form id="indicator-restriction-form">'+
                            '   <input class="stats-indicator-form-item" type="text" name="year" placeholder="${year}"><br>'+
                            '</form>'),
        insertTable: _.template('<table class="user-indicator-table">'+
                                        '<tbody></tbody>'+
                                    '</table>'),
        header: _.template('<thead>'+
                            '<tr>' +
                                '<th id="nort">${north}</th>'+
                                '<th id="east">${east}</th>'+
                            '</tr>'+
                        '</thead>'),
        row: _.template('<tr>' +
                '<td class="cell regionset" style=" border: 1px solid black ;">${regionset}</td>'+
                '<td class="cell uservalue" contenteditable=true style=" border: 1px solid black ;"></td>'+
        '</tr> '),
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
    createTable: function() {
        return jQuery( this.__templates.insertTable() );
    },
    refreshTable: function ( region, mountPoint, tableRef) {
        var me = this;
        tableRef.empty();
        this.service.getRegions( Number(region), function (err, regionlist) {

            regionlist.forEach( function (region) {
                tableRef.append( me.__templates.row({
                    regionset: region.name
                }));
            });
            mountPoint.append(tableRef);
        });
    },
    toggle: function () {
        var form = this.getElement().find('#indicator-restriction-form');
        var table = this.getElement().find('table');

        if ( form.hasClass('oskari-hidden') ) {
            form.removeClass('oskari-hidden');
            table.addClass('oskari-hidden');
        } else {
            form.addClass('oskari-hidden');
            table.removeClass('oskari-hidden');
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

        var main = jQuery(this.__templates.main());
        var form = jQuery(this.__templates.form({
            year: this.locale.userIndicators.formYear
        }));

        var ds = this.service.getDatasource(this.datasourceid);
        var region = this.regionselect.create(ds.regionsets);
        form.append(region.container);
        main.prepend(form);

        var indBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        indBtn.setTitle(this.locale.userIndicators.buttonAddIndicator);
        indBtn.insertTo( main );
        var table = me.createTable();
        // var header = this.__templates.header();

        indBtn.setHandler(function (event) {
            event.stopPropagation();
            me.toggle();
            me.refreshTable( region.value(), main, table );
        });
        this.setElement(main);
    },
    render: function (panel) {
        panel.setContent( this.getElement() );
    }

});