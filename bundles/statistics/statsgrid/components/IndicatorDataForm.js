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
        row: _.template('<tr data-id="${regionId}" data-name="${regionName.toLowerCase()}">' +
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
        const me = this;
        const cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
        cancelBtn.setVisible(false);
        cancelBtn.setHandler(function () {
            me.clearUi();
            me.trigger('cancel');
        });
        jQuery(cancelBtn.getElement()).css({ 'margin-left': '6px' });
        this.buttons.push(cancelBtn);

        const importClipboard = Oskari.clazz.create('Oskari.userinterface.component.Button');
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
        const table = this.getElement().find('.user-indicator-table');
        data.forEach(({ name, value }) => {
            table.find('tr').each(function (index, tr) {
                if (tr.dataset.name === name.toLowerCase() || tr.dataset.id === name) {
                    jQuery(tr).find('td.uservalue div').text(value);
                }
            });
        });
    },
    showTable: function (selectors, regions, labels) {
        const me = this;
        this.clearUi();
        labels = labels || {};
        this.selectors = selectors || {};

        const header = this.__templates.header({
            regionsetLabel: this.locale('parameters.regionset'),
            yearLabel: this.locale('parameters.year'),
            regionset: labels[selectors.regionset] || selectors.regionset,
            year: labels[selectors.year] || selectors.year
        });
        this.getElement().append(header);

        const tableRef = jQuery(this.__templates.insertTable());
        regions.forEach(function (region) {
            tableRef.append(me.__templates.row({
                regionId: region.id,
                regionName: region.name,
                value: region.value === undefined ? '<br>' : region.value // firefox uses <br> for empty contenteditable
            }));
        });
        this.getElement().append(tableRef);

        const inputElems = tableRef.find('tr td.uservalue div');
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
        const table = this.getElement().find('table');
        const data = {
            selectors: this.selectors,
            values: []
        };
        table.find('tr').each(function (index, element) {
            const row = jQuery(element);
            const columns = row.find('td');
            const dataItem = {
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
            data.values.push(dataItem);
        });
        return data;
    },
    openImportPopup: function () {
        const me = this;
        const popup = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        popup.makeDraggable();
        const content = jQuery(this.__templates.import({
            placeholder: me.locale('userIndicators.import.placeholder')
        }));
        const okBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.OkButton');

        okBtn.setPrimary(true);
        okBtn.setHandler(function () {
            const textarea = content.find('textarea');
            const data = me.parseUserData(textarea);
            me.fillTable(data);
            popup.close(true);
        });
        const cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
        cancelBtn.setHandler(function () {
            popup.close(true);
        });
        popup.show(me.locale('userIndicators.import.title'), content, [cancelBtn, okBtn]);
    },
    parseUserData: function (textarea) {
        const data = textarea.val();
        const validRows = [];

        const lines = data.match(/[^\r\n]+/g);
        // loop through all the lines and parse municipalities (name or code)
        lines.forEach(function (line) {
            let area,
                value;

            // separator can be a tabulator or a semicolon
            const matches = line.match(/([^\t;]+) *[\t;]+ *(.*)/);
            if (matches && matches.length === 3) {
                area = matches[1].trim();
                value = (matches[2] || '').replace(',', '.').replace(/\s/g, '');
                if (Number.isNaN(parseInt(value))) {
                    value = '';
                }
                validRows.push({
                    name: area,
                    value: value
                });
            }
        });
        return validRows;
    }
});
