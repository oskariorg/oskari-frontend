/**
 * Generic form for feeding values for regions. Triggers events on cancel and save.
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.IndicatorDataForm', function (locale) {
    this.locale = locale;
    this.selectors = {};
    this.element = this.createUi();
    Oskari.makeObservable(this);
    this.buttons = [];
}, {
    __templates: {
        main: _.template('<div class="user-indicator-main"></div>'),
        insertTable: _.template('<table class="user-indicator-table">' +
                                        '<tbody></tbody>' +
                                '</table>'),
        header: _.template('<div class="user-indicator-specification">' +
                                '<div>${regionsetLabel}: ${regionset}</div>' +
                                '<div>${yearLabel}: ${year}</div>' +
                            '</div>'),
        row: _.template('<tr data-id="${regionId}">' +
                            '<td class="region" style=" border: 1px solid black ;">${regionName}</td>' +
                            '<td class="uservalue" style="border: 1px solid black ;"><div contenteditable="true">${value}</div></td>' +
                        '</tr> '),
        import: _.template('<div class="user-indicator-import"><textarea placeholder="${placeholder}"></textarea></div>')
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
    getButtons: function () {
        if (this.buttons.length) {
            return this.buttons;
        }
        var me = this;
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
        cancelBtn.setVisible(false);
        cancelBtn.setHandler(function () {
            me.clearUi();
            me.trigger('cancel');
        });
        jQuery(cancelBtn.getElement()).css({'margin-left': '6px'});
        this.buttons.push(cancelBtn);

        var importClipboard = Oskari.clazz.create('Oskari.userinterface.component.Button');
        importClipboard.setVisible(false);
        importClipboard.setTitle(this.locale('userIndicators.import.title'));
        importClipboard.setHandler(function (event) {
            me.openImportPopup();
        });
        this.buttons.push(importClipboard);
        return this.buttons;
    },
    clearUi: function () {
        if (!this.getElement()) {
            return;
        }
        this.buttons.forEach(function (btn) {
            btn.setVisible(false);
        });
        this.getElement().empty();
    },
    fillTable: function (data) {
        var table = this.getElement().find('.user-indicator-table');
        data.forEach(function (iteration) {
            table.find('tr').each(function (index, tr) {
                if (tr.innerText.trim().toLowerCase() === iteration.name.toLowerCase() || tr.dataset.id === iteration.name) {
                    var uservalue = jQuery(tr).find('td.uservalue div');
                    uservalue.text(iteration.value);
                }
            });
        });
    },
    showTable: function (selectors, regions, labels) {
        var me = this;
        this.clearUi();
        labels = labels || {};
        this.selectors = selectors || {};

        var header = this.__templates.header({
            regionsetLabel: this.locale('parameters.regionset'),
            yearLabel: this.locale('parameters.year'),
            regionset: labels[selectors.regionset] || selectors.regionset,
            year: labels[selectors.year] || selectors.year
        });
        this.getElement().append(header);

        var tableRef = jQuery(this.__templates.insertTable());
        regions.forEach(function (region) {
            tableRef.append(me.__templates.row({
                regionId: region.id,
                regionName: region.name,
                value: region.value === undefined ? '<br>' : region.value // firefox uses <br> for empty contenteditable
            }));
        });
        this.getElement().append(tableRef);

        var inputElems = tableRef.find('tr td.uservalue div');
        // Focus on the first input cell
        inputElems[0].focus();
        // prevent KeyboardPan
        inputElems.on('keydown', function (e) {
            e.stopPropagation();
        });
        // prevent KeyboardZoom
        inputElems.on('keypress', function (e) {
            e.stopPropagation();
        });

        this.buttons.forEach(function (btn) {
            btn.setVisible(true);
        });
    },
    getValues: function () {
        var table = this.getElement().find('table');
        var data = {
            selectors: this.selectors,
            values: []
        };
        table.find('tr').each(function (index, element) {
            var row = jQuery(element);
            var columns = row.find('td');
            var dataItem = {
                id: row.attr('data-id'),
                name: columns[0].innerText,
                value: columns[1].innerText.trim()
            };
            // only include rows with values
            if (dataItem.value === '') {
                return;
            }
            // replace commas and cast value to number as legend expects it to be a number
            dataItem.value = dataItem.value.replace(/,/g, '.');
            if (!isNaN(dataItem.value)) {
                dataItem.value = Number(dataItem.value);
                data.values.push(dataItem);
            }
        });
        return data;
    },
    openImportPopup: function () {
        var me = this;
        var popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        popup.makeDraggable();
        var content = jQuery(this.__templates.import({
            placeholder: me.locale('userIndicators.import.placeholder')
        }));
        var okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');

        okBtn.setPrimary(true);
        okBtn.setHandler(function () {
            var textarea = content.find('textarea');
            var data = me.parseUserData(textarea);
            me.fillTable(data);
            popup.close(true);
        });
        var cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
        cancelBtn.setHandler(function () {
            popup.close(true);
        });
        popup.show(me.locale('userIndicators.import.title'), content, [cancelBtn, okBtn]);
    },
    parseUserData: function (textarea) {
        var data = textarea.val();
        var validRows = [];

        var lines = data.match(/[^\r\n]+/g);
        // loop through all the lines and parse municipalities (name or code)
        lines.forEach(function (line) {
            var area,
                value;

            // separator can be tabulator, comma or colon
            var matches = line.match(/([^\t;,]+) *[\t;,]+ *(.*)/);
            if (matches && matches.length === 3) {
                area = matches[1].trim();
                value = (matches[2] || '').replace(',', '.').replace(/\s/g, '');

                validRows.push({
                    name: area,
                    value: value
                });
            }
        });
        return validRows;
    }
});
