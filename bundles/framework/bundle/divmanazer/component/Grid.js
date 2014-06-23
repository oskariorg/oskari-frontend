/**
 * @class Oskari.userinterface.component.Grid
 *
 * Renders given data model as a grid/table. Provides sorting funtionality.
 * If table data is structured to have "inner tables" -> #setAdditionalDataHandler
 * method can be used to set a callback which will show the additional data externally
 * to keep the table clean.
 */
Oskari.clazz.define('Oskari.userinterface.component.Grid',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.model = null;
        this._defaultLocKey = 'Grid';
        this._loc = this._getLocalization('DivManazer');
        this.template = jQuery('<table class="oskari-grid"><thead><tr></tr></thead><tbody></tbody></table>');
        this.templateTableHeader = jQuery('<th><a href="JavaScript:void(0);"></a></th>');
        this.templateDiv = jQuery('<div></div>');
        this.templateRow = jQuery('<tr></tr>');
        this.templateCell = jQuery('<td></td>');
        this.templatePopupLink = jQuery('<a href="JavaScript: void(0);"></a>');
        this.templateTabTools = jQuery('<div class="tab-tools"></div>');
        this.templateExporter = jQuery('<div class="exporter"></div>');
        this.templateColumnSelectorTitle = jQuery('<div class="column-selector-title"></div>');
        this.templateColumnSelectorWrapper = jQuery('<div/>', {});
        this.templateColumnSelector = jQuery('<div/>', {});
        this.templateColumnSelectorList = jQuery('<ul/>', {});
        this.templateColumnSelectorListItem = jQuery('<li>' +
            '<div>' +
            '<input type="checkbox"/>' +
            '<label></label>' +
            '</div>' +
            '</li>'
            );
        this.templateColumnSelectorClose = jQuery('<div class="icon-close close-selector-button"></div>');
        this.csvButton = null;
        this.excelButton = null;
        this.table = null;
        this.fieldNames = [];
        this.selectionListeners = [];
        this.additionalDataHandler = null;
        this.visibleColumnSelector = null;
        this.showColumnSelector = false;
        this.showExcelExporter = false;
        this.resizableColumns = false;

        this.uiNames = {};
        this.valueRenderer = {};

        // last sort parameters are saved so we can change sort direction if the same column is sorted again
        this.lastSort = null;
    }, {
        /**
         * @method setDataModel
         * Sets the data model the grid uses for rendering
         * @param {Oskari.userinterface.component.GridModel} pData
         */
        setDataModel: function (pData) {
            this.model = pData;
        },
        /**
         * @method getDataModel
         * Returns the data model the grid uses for rendering
         * @return {Oskari.userinterface.component.GridModel}
         */
        getDataModel: function () {
            return this.model;
        },

        /**
         * @method setColumnSelector
         * Sets the column selector visible or invisible
         * @param {Boolean} newShowColumnSelector truth value for showing a column selector
         */
        setColumnSelector: function (newShowColumnSelector) {
            this.showColumnSelector = newShowColumnSelector;
        },
        /**
         * @method setExcelExporter
         * Sets the Excel exporter visible or invisible
         * @param {Boolean} newShowExcelExporter truth value for showing an Excel exporter
         */
        setExcelExporter: function (newShowExcelExporter) {
            this.showExcelExporter = newShowExcelExporter;
        },
        /**
         * @method setResizableColumns
         * Sets the columns resizable or static
         * @param {Boolean} newResizableColumns truth value for column resizability
         */
        setResizableColumns: function (newResizableColumns) {
            this.resizableColumns = newResizableColumns;
        },
        /**
         * @method setColumnUIName
         * Sets an UI text for a given field.
         * The grid shows the UI name instead of the datas field name
         * @param {String} fieldName field name we want to replace in UI
         * @param {String} uiName field name we want to use instead in UI
         */
        setColumnUIName: function (fieldName, uiName) {
            this.uiNames[fieldName] = uiName;
        },
        /**
         * @method setColumnValueRenderer
         * When rendering the field value the given renderer function is called if given.
         * The function takes the value as parameter and should return the processed value:
         * function({String} value, {Object} rowData) {
         *     return value;
         * }
         * RowData parameter includes the object being rendered including
         * the value so renderer has access to id and such
         * @param {String} fieldName field name we want to process before showing in ui
         * @param {String} renderer function that will process the value
         */
        setColumnValueRenderer: function (fieldName, renderer) {
            this.valueRenderer[fieldName] = renderer;
        },
        /**
         * @method setVisibleFields
         * If not given renders all data fields
         * @param {String[]} pFieldNames fieldnames that should be rendered from data
         */
        setVisibleFields: function (pFieldNames) {
            this.fieldNames = pFieldNames;
        },
        /**
         * @method addSelectionListener
         * The callback function will receive reference to the grid in question as first parameter
         * and the id for the selected data as second parameter:
         * function({Oskari.userinterface.component.Grid} grid, {String} dataId)
         * @param {function} pCallback callback to call when a row has been selected
         */
        addSelectionListener: function (pCallback) {
            this.selectionListeners.push(pCallback);
        },

        /**
         * @method _createSubTable
         * Creates columns from a subtable object.
         * @param {jQuery} row current row
         * @param {Number} columnIndex current column index
         * @param {String} key object key
         * @param {Object} value object value
         * @private
         */
        _createSubTable: function (row, columnIndex, key, value) {
            var baseKey,
                subKeys,
                hidden,
                found,
                field,
                cell,
                index;
            cell = this.templateCell.clone();
            baseKey = key;
            index = columnIndex;
//            subKeys = this.table.find("th>a");
            subKeys = this.table.find("th");
            hidden = jQuery(this.table.find("th")[index]).hasClass("closedSubTable");
            cell.addClass('base');
            cell.addClass(baseKey);
            row.append(cell);
            index = index+1;
console.log("createSubTable");
console.log(index);
console.log(cell);
console.log(baseKey);
console.log(subKeys);
console.log(hidden);
console.log(row);
            do {
                if (index === subKeys.length) {
                    break;
                }
console.log("A");
                found = false;
                // Let's not assume field order
                for (field in value) {
                    if (value.hasOwnProperty(field)) {
console.log(baseKey);
console.log(field);
console.log("!!!!!!!!!!!");
console.log(subKeys[index]);
console.log(jQuery(subKeys[index]));
console.log(jQuery(subKeys[index]).data());
//                        if (jQuery(subKeys[columnIndex]).html() === baseKey+"."+field) {
//debugger;
                        if ((jQuery(subKeys[index]).data("key") === baseKey)&&(jQuery(subKeys[index]).data("value") === field)) {
                            cell = this.templateCell.clone();
                            cell.addClass(baseKey);
                            cell.append(value[field]);
                            if (hidden) {
                                cell.addClass('hidden');
                            }
                            row.append(cell);
                            index = index+1;
                            found = true;
                            break;
                        }
                    }
                }
            } while (found);
            return index;
        },

        /**
         * @method setAdditionalDataHandler
         * If grid data has internal table structures, it can be hidden behind a link
         * by using this method. This way the grid stays more clear.
         * @param {String} title text for the link
         * @param {function} handler callback to call when the link is clicked
         */
        setAdditionalDataHandler: function (title, handler) {
            this.additionalDataHandler = {
                title: title,
                handler: handler
            };
        },

        /**
         * @method _createAdditionalDataField
         * Renders the given data using #_renderAdditionalData() and wraps it with a linked callback if
         * #setAdditionalDataHandler() has been used.
         * @private
         * @param {Object[]} data data to be rendered
         * @return (jQuery) reference to rendered content
         */
        _createAdditionalDataField: function (data) {
            if (!data || jQuery.isEmptyObject(data)) {
                return false;
            }
            var me = this,
                content = this._renderAdditionalData(data),
                link;
            // if handler set -> show link instead
            // exception if data is an array (=has size method)
            if (!data.size && this.additionalDataHandler) {
                link = this.templatePopupLink.clone();
                link.append(this.additionalDataHandler.title);
                link.bind('click', function () {
                    // show userguide popup with data
                    me.additionalDataHandler.handler(link, content);
                    return false;
                });
                return link;
            }
            return content;

        },
        /**
         * @method _renderAdditionalData
         * Renders the given data to a table or comma separated list depending on type
         * @private
         * @param {Object[]} data data to be rendered
         * @return (jQuery) reference to rendered content
         */
        _renderAdditionalData: function (data) {
            var table = this.template.clone(),
                body = table.find('tbody'),
                value,
                row,
                fieldCell,
                valueCell,
                type,
                innerTable,
                i,
                field;
            if (data.size) {
                // array data
                value = '';
                for (i = 0; i < data.size(); i += 1) {
                    if (i !== 0) {
                        value = value + ', ';
                    }
                    value = value + data[i];
                }
                return value;
            }

            // format array
            if (jQuery.isArray(data)) {
                var valueDiv = this.templateDiv.clone();
                for (i = 0; i < data.length; ++i) {
                    innerTable = this._renderAdditionalData(data[i]);
                    valueDiv.append(innerTable);
                }
                return valueDiv;
            }

            // else format as table
            for (field in data) {
                if (data.hasOwnProperty(field)) {
                    row = this.templateRow.clone();
                    fieldCell = this.templateCell.clone();
                    valueCell = this.templateCell.clone();
                    value = data[field];
                    fieldCell.append(field);
                    row.append(fieldCell);

                    //row.append('<td>' + field + '</td>');
                    try {
                        type = typeof value;
                        if (type === 'object') {
                            innerTable = this._renderAdditionalData(value);
                            valueCell.append(innerTable);
                        } else if (type !== 'function') {
                            valueCell.append(value);
                        }
                        /* else {
                            // we have a problem, debug
                            //alert(type + ':\r\n' +JSON.stringify(data));
                        }*/
                        row.append(valueCell);
                    } catch (ignore) {}

                    body.append(row);
                }
            }
            return table;
        },
        /**
         * @method _renderHeader
         * Renders the header part for data in #getDataModel() to the given table.
         * @private
         * @param {jQuery} table reference to the table DOM element whose header should be populated
         * @param {String[]} fieldNames names of the fields to render in render order
         */
        _renderHeader: function (table, fieldNames) {
            var me = this,
                // print header
                headerContainer = table.find('thead tr'),
                bodyContainer = table.find('tbody'),
                i,
                header,
                link,
                dataArray,
                data,
                fullFieldNames,
                fieldName,
                baseKey,
                uiName,
                key,
                value,
                field,
                headerClosureMagic;

            // header reference needs some closure magic to work here
            headerClosureMagic = function (scopedValue) {
                return function () {
                    // reference to sort link element
                    var linky = jQuery(this),
                        // get previous selection
                        selection = me.getSelection(),
                        // default to descending sort
                        descending = false,
                        idField,
                        j;
                    // clear table for sorted results
                    bodyContainer.empty();
                    // if last sort was made on the same column -> change direction
                    if (me.lastSort && me.lastSort.attr === scopedValue) {
                        descending = !me.lastSort.descending;
                    }
                    // sort the results
                    me._sortBy(scopedValue, descending);
                    // populate table content
                    me._renderBody(table, fieldNames);
                    // apply visual changes
                    headerContainer.find('th').removeClass('asc');
                    headerContainer.find('th').removeClass('desc');
                    if (descending) {
                        linky.parent().addClass('desc');
                    } else {
                        linky.parent().addClass('asc');
                    }
                    // reselect selection
                    idField = me.model.getIdField();
                    for (j = 0; j < selection.length; j += 1) {
                        me.select(selection[j][idField], true);
                    }
                    return false;
                };
            };
//debugger;
console.log("...");
            // Expand the table
            dataArray = this.model.getData();
            if (dataArray.length === 0) {
                return;
            }
            fullFieldNames = [];
            data = dataArray[0];
            for (i = 0; i < fieldNames.length; i += 1) {
console.log("i: "+i);
                key = fieldNames[i];
                value = data[key];
console.log(key);
console.log(value);
                if (typeof value === 'object') {
console.log("a");
                    fullFieldNames.push({key: key, baseKey: key, subKey: key, type: 'object', visibility: 'shown'});
                    for (field in value) {
                        if (value.hasOwnProperty(field)) {
                            fullFieldNames.push({key: key+'.'+field, baseKey: key, subKey: field, type: 'default', visibility: 'hidden'});
                        }
                    }
                } else {
console.log("b");
                    fullFieldNames.push({key: key, baseKey: key, subKey: field, type: 'default', visibility: 'shown'});
                }
console.log(fullFieldNames);
            }

            for (i = 0; i < fullFieldNames.length; i += 1) {
console.log("I: "+i);
                header = this.templateTableHeader.clone();
                link = header.find('a');
                fieldName = fullFieldNames[i].key;
                baseKey = fullFieldNames[i].baseKey;
                uiName = this.uiNames[baseKey];
console.log(header);
console.log(link);
console.log(fieldName);
console.log(baseKey);
console.log(this.uiNames);
console.log(uiName);
console.log(fullFieldNames);
console.log(fullFieldNames[i][key]);
console.log(fullFieldNames[i].key);
                if (!uiName) {
console.log("A");
                    uiName = fieldName;
                } else if (fieldName !== fullFieldNames[i][key]) {
console.log("B");
                    uiName = fieldName.replace(baseKey,uiName);
                }
console.log(uiName);
                link.append(uiName);
                if (me.lastSort && fieldName === me.lastSort.attr) {
                    if (me.lastSort.descending) {
                        header.addClass('desc');
                    } else {
                        header.addClass('asc');
                    }
                }
                if (fullFieldNames[i].type === 'default') {
                    link.bind('click', headerClosureMagic(fullFieldNames[i].key));
                } else if (fullFieldNames[i].type === 'object') {
                    header.addClass('closedSubTable');
                    header.addClass('base');
                    // Expand or close subtable
                    link.bind('click', function() {
                        var parentItem = jQuery(this).parent();
//debugger;
//                        var thisKey = jQuery.grep(jQuery(parentItem).attr('class').split(/\s+/),function(s){
//                            return (['base','openSubTable','closedSubTable','hidden'].indexOf(s) < 0) ;
//                        })[0];
                        var thisKey = parentItem.data("key");
                        if (parentItem.hasClass('closedSubTable')) {
                            table.find('th.hidden.'+thisKey).removeClass('hidden');
                            // jQuery(this).parent().addClass('hidden');
                            table.find('td.hidden.'+thisKey).removeClass('hidden');
                            // table.find('td.base.'+thisKey).addClass('hidden');
                            parentItem.removeClass('closedSubTable');
                            parentItem.addClass('openSubTable');
                        } else {
                            table.find('th.'+thisKey).not('.base').addClass('hidden');
                            table.find('td.'+thisKey).not('.base').addClass('hidden');
                            parentItem.removeClass('openSubTable');
                            parentItem.addClass('closedSubTable');
                        }
                    });
                }

                if (fullFieldNames[i].visibility === 'hidden') {
                    header.addClass('hidden');
                }

                header.addClass(fullFieldNames[i].baseKey);
                header.data("key",fullFieldNames[i].baseKey);
                header.data("value",fullFieldNames[i].subKey);
                headerContainer.append(header);
            }
        },

        /**
         * @method _renderBody
         * Renders the data in #getDataModel() to the given table.
         * @private
         * @param {jQuery} table reference to the table DOM element whose body should be populated
         * @param {String[]} fieldNames names of the fields to render in render order
         */
        _renderBody: function (table, fieldNames) {
            var me = this,
                // print data
                body = table.find('tbody'),
                dataArray = this.model.getData(),
                i,
                row,
                data,
                f,
                key,
                value,
                cell,
                columnIndex,
                renderer,
                rows,
                rowClicked;
            for (i = 0; i < dataArray.length; i += 1) {
                row = this.templateRow.clone();
                data = dataArray[i];

                row.attr('data-id', data[this.model.getIdField()]);
                columnIndex = 0;
                for (f = 0; f < fieldNames.length; f += 1) {
                    key = fieldNames[f];
                    value = data[key];
                    // Handle subtables
console.log("?");
console.log(key);
console.log(value);
                    if (typeof value === 'object') {
console.log("ci1: "+columnIndex);
                        columnIndex = this._createSubTable(row,columnIndex,key,value);
console.log("ci2: "+columnIndex);
                        // cell.append(this._createAdditionalDataField(value)); // old version
                    } else {
                        cell = this.templateCell.clone();
                        renderer = this.valueRenderer[key];
                        if (renderer) {
                            value = renderer(value, data);
                        }
                        cell.append(value);
                        row.append(cell);
                        columnIndex = columnIndex+1;
                    }
                }
                body.append(row);
            }
            rows = table.find('tbody tr');
            rowClicked = function () {
                me._dataSelected(jQuery(this).attr('data-id'));
            };
            rows.bind('click', rowClicked);
            // enable links to work normally (unbind row click on hover and rebind when mouse exits)
            rows.find('a').hover(function () {
                jQuery(this).parents('tr').unbind('click');
            }, function () {
                jQuery(this).parents('tr').bind('click', rowClicked);
            });
        },

        /**
         * @method _renderColumnSelector
         * Renders the column selector for the given table.
         * @private
         * @param {jQuery} table reference to the table DOM element
         * @param {String[]} fieldNames names of the fields to select visible
         */
        _renderColumnSelector: function (table, fieldNames) {
            // Utilize the templates
            this.visibleColumnSelector = this.templateColumnSelectorWrapper.clone();
            var me = this,
                columnSelectorLabel = this.templateColumnSelectorTitle.clone(),
                columnSelector = this.templateColumnSelector.clone(),
                columnSelectorList = this.templateColumnSelectorList.clone(),
                columnSelectorClose = this.templateColumnSelectorClose.clone(),
                fields,
                visibleField,
                i,
                j,
                newColumn,
                checkboxInput;

            this.visibleColumnSelector.addClass('column-selector-placeholder');
            columnSelector.addClass('column-selector');
            columnSelectorLabel.append(this._loc.columnSelector.title);
            this.visibleColumnSelector.append(columnSelectorLabel);
            this.visibleColumnSelector.append(columnSelector);

            jQuery('input.column-selector-list-item').remove();
            // Open or close the checkbox dropdown list
            this.visibleColumnSelector.click(function () {
                if (columnSelector.css('visibility') !== 'hidden') {
                    columnSelector.css('visibility', 'hidden');
                } else {
                    columnSelector.css('visibility', 'visible');
                }
            });
            columnSelectorClose.click(function (e) {
                e.stopPropagation();
                columnSelector.css('visibility', 'hidden');
            });
            fields = this.model.getFields();
            // Add field names to the list
            for (i = 0; i < fields.length; i += 1) {
                visibleField = false;
                // Set current checkbox value for the field
                for (j = 0; j < fieldNames.length; j += 1) {
                    if (fields[i] === fieldNames[j]) {
                        visibleField = true;
                        break;
                    }
                }
                newColumn = this.templateColumnSelectorListItem.clone();
                newColumn.addClass('column-selector-list-item');
                checkboxInput = newColumn.find('input');
                checkboxInput.attr('checked', visibleField);
                checkboxInput.addClass('column-selector-list-item');
                checkboxInput.attr('id', fields[i]);
                newColumn.find('label')
                    .attr({
                        'for': fields[i],
                        'class': 'column-label'
                    })
                    .html(fields[i]);
                newColumn.css({
                    'margin': '5px'
                });

                // Update visible fields after checkbox change
                // FIXME create function outside the loop
                checkboxInput.change(function () {
                    var fieldSelectors = jQuery('input.column-selector-list-item'),
                        oldFields = me.model.getFields(),
                        newFields = [],
                        k,
                        l;
                    for (k = 0; k < oldFields.length; k += 1) {
                        for (l = 0; l < fieldSelectors.length; l += 1) {
                            if (oldFields[k] === fieldSelectors[l].id) {
                                if (fieldSelectors[l].checked) {
                                    newFields.push(oldFields[k]);
                                }
                                break;
                            }
                        }
                    }
                    if (newFields.length > 0) {
                        me.setVisibleFields(newFields);
                    }
                    me.renderTo(table.parent(), {
                        columnSelector: 'open'
                    });
                });
                columnSelectorList.append(newColumn);
            }
            columnSelectorList.attr('class', 'column-selector-list');
            columnSelector.append(columnSelectorList, columnSelectorClose);
            columnSelectorClose.click(function (e) {
                e.stopPropagation();
                columnSelector.css('visibility', 'hidden');
            });
        },

        /**
         * @method _enableColumnResizer
         * Enables column resizing functionality
         */
        _enableColumnResizer: function () {
            var pressed = false,
                start,
                startX,
                startWidth,
                featureTable = jQuery('table.oskari-grid th');
            featureTable.css('cursor', 'e-resize');

            // Start resizing
            featureTable.mousedown(function (e) {
                start = jQuery(this);
                pressed = true;
                startX = e.pageX;
                startWidth = jQuery(this).width();
                jQuery(start).addClass("resizing");
                // Disable mouse selecting
                jQuery(document).attr('unselectable', 'on')
                    .css('user-select', 'none')
                    .on('selectstart', false);
            });

            // Resize when mouse moves
            jQuery(document).mousemove(function (e) {
                if (pressed) {
                    jQuery(start).width(startWidth + (e.pageX - startX));
                }
            });

            // Stop resizing
            jQuery(document).mouseup(function () {
                if (pressed) {
                    jQuery(start).removeClass("resizing");
                    pressed = false;
                }
            });
        },

        /**
         * @method renderTo
         * Renders the data in #getDataModel() to the given DOM element.
         * @param {jQuery} container reference to DOM element where the grid should be inserted.
         * @param {Object} state tells into what state we are going to render this grid
         * (e.g. columnSelector: open tells that we want to show columnselector)
         */
        renderTo: function (container, state) {
            var me = this;
            container.empty();

            // Tool row
            if ((this.showColumnSelector)||(this.showExcelExporter)) {
                var toolRow = this.templateTabTools.clone();
                container.parent().children(".tab-tools").remove();
                container.parent().prepend(toolRow);
            }

            var fieldNames = this.fieldNames,
                table = this.template.clone();
            // if visible fields not given, show all
            if (fieldNames.length === 0) {
                fieldNames = this.model.getFields();
            }

            this.table = table;
            this._renderHeader(table, fieldNames);

            if (this.lastSort) {
                // sort with last know sort when updating data
                this._sortBy(this.lastSort.attr, this.lastSort.descending);
            }
            this._renderBody(table, fieldNames);

            if (this.showColumnSelector) {
                this._renderColumnSelector(table, fieldNames);
                container.parent().find(".tab-tools").append(this.visibleColumnSelector);
                if (state !== null && state !== undefined && state.columnSelector === 'open') {
                    this.visibleColumnSelector.find('.column-selector').css('visibility', 'visible');
                }
            }

            // Exporter
            if (this.showExcelExporter) { // Todo: configure this
                var exporter = me.templateExporter.clone();
                var label = me._loc.export.title;
                exporter.append(label);

                // CSV
                me.csvButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                me.csvButton.setTitle(me._loc.export.csv);
                me.csvButton.addClass("csvExportButton");
                me.csvButton.setHandler(function() {
                    var str = "";
                    var i,j;
                    // Header
                    var header = me.table.find("thead th").not(".hidden").find("a");
                    for (i=0; i<header.length; i++) {
                        if (i > 0) {
                            str = str+",";
                        }
                        str = str+"\""+jQuery(header[i]).html()+"\"";
                    }
                    str = str+"\n";

                    // Body
                    var rows = me.table.find("tbody tr");
                    for (i=0; i<rows.length; i++) {
                        var items = jQuery(rows[i]).find("td").not(".hidden");
                        for (j=0; j<items.length; j++) {
                            if (j > 0) {
                                str = str+",";
                            }
                            str = str+"\""+jQuery(items[j]).html()+"\"";
                        }
                        str = str+"\n";
                    }

                    // Output
                    if (navigator.appName !== 'Microsoft Internet Explorer') {
                        window.location = 'data:text/csv;charset=utf8,' + encodeURIComponent(str);
                    } else {
                        str = str.split("\n").join("<br />");
                        var generator = window.open('', 'csv', 'height=400,width=600');
                        generator.document.write('<html><head><title>CSV</title>');
                        generator.document.write('</head><body >');
                        generator.document.write(str);
                        generator.document.write('</textArea>');
                        generator.document.close();
                    }
                });
                exporter.append(me.csvButton.getButton());

                // Excel
                me.excelButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                me.excelButton.setTitle(me._loc.export.excel);
                me.excelButton.addClass("excelExportButton");

                me.excelButton.setHandler(function() {
//                    if (navigator.appName !== 'Microsoft Internet Explorer') {
                        var tmpTable = me.table.clone();
                        // Do not export hidden fields
                        tmpTable.find("th.hidden").remove();
                        tmpTable.find("td.hidden").remove();
                        var uri = 'data:application/vnd.ms-excel;base64,',
                            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
                            format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) };
                        var ctx = {worksheet: 'Worksheet', table: tmpTable.html()};
                        window.location.href = uri + jQuery.base64.encode(format(template, ctx));
/*                    } else {
                         var ExcelApp = new ActiveXObject("Excel.Application");
                         var ExcelSheet = new ActiveXObject("Excel.Sheet");
                         ExcelSheet.Application.Visible = true;

                         me.table.find('th, td').each(function(i){
                         ExcelSheet.ActiveSheet.Cells(i+1,i+1).Value = this.innerHTML;
                         });
                    }
*/
                });
                if (navigator.appName !== 'Microsoft Internet Explorer') {
                    exporter.append(me.excelButton.getButton());
                }
                container.parent().find(".tab-tools").append(exporter);
            }

            container.append(table);

            if (this.resizableColumns) {
                this._enableColumnResizer();
            }
        },
        /**
         * @method _dataSelected
         * Notifies all selection listeners about selected data.
         * @private
         * @param {String} dataId id for the selected data
         */
        _dataSelected: function (dataId) {
            var i;
            for (i = 0; i < this.selectionListeners.length; i += 1) {
                this.selectionListeners[i](this, dataId);
            }
        },

        /**
         * @method select
         * Tries to find an object from #getDataModel() using the the id given as parameter "value".
         * Oskari.mapframework.bundle.featuredata.domain.GridModel.getIdField() is used to determine
         * the field which value is compared against.
         * If found, selects the corresponding row in the grid.
         * @param {String} value id for the data to be selected
         * @param {Boolean} keepPrevious true to keep previous selection, false to clear before selecting
         */
        select: function (value, keepPrevious) {
            var key = this.model.getIdField(),
                dataArray = this.model.getData(),
                index,
                rows,
                data;
            for (index = 0; index < dataArray.length; index += 1) {
                data = dataArray[index];
                if (data[key] === value) {
                    // found
                    break;
                }
            }
            rows = this.table.find('tbody tr');
            if (keepPrevious !== true) {
                rows.removeClass('selected');
            }
            jQuery(rows[index]).addClass('selected');
        },

        /**
         * @method removeSelections
         */
        removeSelections: function () {
            var rows = this.table.find('tbody tr');
            rows.removeClass('selected');
        },

        /**
         * @method getSelection
         * Returns current selection visible on grid.
         * @return {Object[]} subset of #getDataModel() that is currently selected in grid
         */
        getSelection: function () {
            var dataArray = this.model.getData(),
                selection = [],
                rows = this.table.find('tbody tr'),
                i,
                row;
            for (i = 0; i < rows.length; i += 1) {
                row = jQuery(rows[i]);
                if (row.hasClass('selected')) {
                    selection.push(dataArray[i]);
                }
            }
            return selection;
        },

        /**
         * @method getTable
         * Returns the grid table.
         * @return {Object} table for the grid data
         */
        getTable: function () {
            return this.table;
        },

        /**
         * @method _sortBy
         * Sorts the last search result by comparing given attribute on the search objects
         * @private
         * @param {String} pAttribute attributename to sort by (e.g. result[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         */
        _sortBy: function (pAttribute, pDescending) {
            var me = this,
                dataArray = me.model.getData();
            if (dataArray.length === 0) {
                return;
            }
            this.lastSort = {
                attr: pAttribute,
                descending: pDescending
            };
            dataArray.sort(function (a, b) {
                return me._sortComparator(a, b, pAttribute, pDescending);
            });

        },

        /**
         * @method _sortComparator
         * Compares the given attribute on given objects for sorting search result objects.
         * @private
         * @param {Object} a search result 1
         * @param {Object} b search result 2
         * @param {String} pAttribute attributename to sort by (e.g. a[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         */
        _sortComparator: function (a, b, pAttribute, pDescending) {
            var nameA,
                nameB,
                value,
                split;
            if (typeof a[pAttribute] === 'object' ||
                    typeof b[pAttribute] === 'object') {
                // not sorting objects
                return 0;
            }
            // to string so number will work also
            nameA = a[pAttribute];
            // if not found, try subtable
            split = pAttribute.split(".");
            if (typeof nameA === "undefined") {
                nameA = a[split[0]][split[1]]
            }
            if (!nameA) {
                nameA = '';
            } else if (nameA.toLowerCase) {
                nameA = nameA.toLowerCase();
            }
            nameB = b[pAttribute];
            // if not found, try subtable
            split = pAttribute.split(".");
            if (typeof nameB === "undefined") {
                nameB = b[split[0]][split[1]]
            }
            if (!nameB) {
                nameB = '';
            } else if (nameB.toLowerCase) {
                nameB = nameB.toLowerCase();
            }

            value = 0;

            if (nameA < nameB) {
                value = -1;
            } else if (nameA > nameB) {
                value = 1;
            }
            if (pDescending) {
                value = value * -1;
            }
            return value;
        },

        /**
         * Returns the localization object for the given key.
         *
         * @method _getLocalization
         * @param  {String} locKey
         * @return {Object/null}
         */
        _getLocalization: function (locKey) {
            var locale = Oskari.getLocalization(locKey),
                ret = null;
            if (locale) {
                ret = locale[this._defaultLocKey];
            }
            return ret;
        }
    });
