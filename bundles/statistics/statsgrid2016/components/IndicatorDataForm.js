// FIXME: Make this form generic in a sense that only the values for the table are sent as parameter
Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorDataForm', function () {
    this.element = this.createUi();
}, {
    __templates: {
        main: _.template('<div class="user-indicator-main"></div>'),
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
    getElement: function () {
        return this.element;
    },
    createUi: function () {
        if (this.getElement()) {
            return this.getElement();
        }
        return jQuery(this.__templates.main());
    },
    showTable: function (selectors, regions) {
        var me = this;
        this.getElement().empty();
        var header = this.__templates.header({
            regionPrefix: 'regionset',
            yearPrefix: 'year',
            region: selectors.regionset,
            year: selectors.year
        });
        this.getElement().append(header);

        var tableRef = jQuery(this.__templates.insertTable());
        regions.forEach(function (region) {
            tableRef.append(me.__templates.row({
                regionset: region.name
            }));
        });
        this.getElement().append(tableRef);
    },
    getValues: function () {
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
    }
});
