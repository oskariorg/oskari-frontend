Oskari.clazz.define('Oskari.statistics.statsgrid.UserIndicatorDataForm', function (service, locale, datasource) {
    this.locale = locale;
    this.datasourceid = datasource;
    this.element = null;
    this.regionselect = Oskari.clazz.create('Oskari.statistics.statsgrid.RegionsetSelector', Oskari.getSandbox(), locale);
    this.service = service;
    this.createUi();
}, {
    __templates: {
        main: _.template('<div class="user-indicator-main"></div>'),
        form: _.template('<form id="indicator-restriction-form">' +
                            '   <input class="stats-indicator-form-item" type="text" name="year" placeholder="${year}"><br>' +
                        '</form>'),
        insertTable: _.template('<table class="user-indicator-table">' +
                                        '<tbody></tbody>' +
                                '</table>'),
        header: _.template('<div class="user-indicator-specification">' +
                                '<div id="region">${regionPrefix}: ${region}</div>' +
                                '<div id="year">${yearPrefix}: ${year}</div>' +
                            '</div>'),
        row: _.template('<tr>' +
                            '<td class="region" style=" border: 1px solid black ;">${regionset}</td>' +
                            '<td class="uservalue" contenteditable=true style=" border: 1px solid black ;"></td>' +
                        '</tr> ')
    },
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    resetForm: function () {
        var form = this.getElement().find('#indicator-restriction-form');
        form[0].reset();
    },
    getFormData: function () {
        var elements = this.getElement().find('.stats-indicator-form-item');
        var data = {};
        elements.filter(function (index, element) {
            element = jQuery(element);
            var key = element.attr('name');
            data[key] = element.val();
        });
        return data;
    },
    createTable: function () {
        return jQuery(this.__templates.insertTable());
    },
    refreshTable: function (region, mountPoint, tableRef) {
        var me = this;

        tableRef.empty();
        var header = this.__templates.header({
            regionPrefix: 'regionset',
            yearPrefix: 'year',
            region: region,
            year: me.getFormData().year
        });
        this.service.getRegions(Number(region), function (err, regionlist) {
            if (err) {
                // TODO: handle error
                return;
            }
            regionlist.forEach(function (region) {
                tableRef.append(me.__templates.row({
                    regionset: region.name
                }));
            });
            tableRef.prepend(header);
            mountPoint.append(tableRef);
        });
    },
    getTableData: function () {
        var table = this.getElement().find('table');
        var data = [];
        var makePair = function (elementArray) {
            var pair = {};
            for (var i = 0; i < elementArray.length; i++) {
                pair[elementArray[i].className] = elementArray[i].innerText;
            }
            return pair;
        };
        table.find('tr').filter(function (index, element) {
            var elements = jQuery(element).find('td');
            data.push(makePair(elements));
        });
        return data;
    },
    toggle: function () {
        var form = this.getElement().find('#indicator-restriction-form');
        var table = this.getElement().find('table');

        if (form.hasClass('oskari-hidden')) {
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
    createRegionSelector: function (regionsets, element) {
        var regionOptions = {
            placeholder_text: this.locale('panels.newSearch.selectRegionsetPlaceholder'),
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: this.locale('panels.newSearch.noResults'),
            width: '100%'
        };
        var allowedRegionsets = this.regionselect.__getOptions(regionsets);
        var regionSelect = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
        var regionDropdown = regionSelect.create(allowedRegionsets, regionOptions);
        regionDropdown.css({width: '100%'});
        element.append(regionDropdown);
        regionSelect.adjustChosen();
        return regionSelect;
    },
    createUi: function () {
        var me = this;
        this.clearUi();

        var main = jQuery(this.__templates.main());
        var form = jQuery(this.__templates.form({
            year: this.locale('userIndicators.panelData.formYear')
        }));

        var ds = this.service.getDatasource(Number(this.datasourceid));
        var regions = this.createRegionSelector(ds.regionsets, form);

        main.prepend(form);

        var indBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        indBtn.setTitle(this.locale('userIndicators.buttonAddIndicator'));
        indBtn.insertTo(main);
        var table = me.createTable();
        this.setElement(main);

        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        cancelBtn.setTitle('Peruuta');
        cancelBtn.insertTo(main);

        cancelBtn.setHandler(function (event) {
            me.toggle();
        });

        indBtn.setHandler(function (event) {
            event.stopPropagation();
            me.toggle();
            me.refreshTable(regions.getValue(), main, table);
        });
    },
    render: function (panel) {
        panel.setContent(this.getElement());
    }

});
