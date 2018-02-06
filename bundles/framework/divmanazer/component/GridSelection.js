/**
 * @class Oskari.userinterface.component.Grid
 *
 * Includes selection functionalities of Oskari.userinterface.component.Grid
 */
Oskari.clazz.category(
    'Oskari.userinterface.component.Grid',
    'selection',
    {
        selectionListeners: [],
        visibleColumnSelector: null,
        showColumnSelector: false,
        /**
         * @method selectColumn
         * Sets "selected" class to the column header
         * @param {String} value id for the column to be selected
         */
        selectColumn: function (value) {
            var me = this;
            // set selectedColumn in either case so render will use it immediately
            this.__selectedColumn = value;

            var columnIndex = me._fullFieldNames.map( function( name ) {
               return name.key;
           }).indexOf( value );

            if(!this.table || columnIndex === -1) {
                return;
            }
            // remove selection from headers
            this.table.find('th').removeClass('selected');
            // add selection to the one specified

            var selected = this.table.find('th.' + me._columnClsPrefix + columnIndex);
            selected.addClass('selected');

            this._selectActivePage();
        },
        /**
         * @method select
         * Tries to find an object from #getDataModel() using the the id given
         * as parameter "value".
         * Oskari.mapframework.bundle.featuredata.domain.GridModel.getIdField()
         * is used to determine the field which value is compared against.
         * If found, selects the corresponding row in the grid.
         *
         * @param {String|Array} value id for the data to be selected
         * @param {Boolean} keepPrevious
         * True to keep previous selection, false to clear before selecting
         * @param {Object} scrollable If defined then scroll grid to selected row. If scrollable.eLement is null then not scroll.
         */
        select: function (value, keepPrevious, scrollable) {
            var me = this;
            if(!me.model) {
                return;
            }
            var isArray = Array.isArray(value);
            if(!isArray) {
                value = [value];
            }

            if (keepPrevious !== true) {
                me.table.find('tbody tr').removeClass('selected');
            }

            value.forEach(function(val) {
                me.table.find('tbody tr[data-id="'+val+'"]').addClass('selected');
            });

            // Move selected rows top if configured
            if(me.sortOptions.moveSelectedRowsTop) {
                me.moveSelectedRowsTop(me.sortOptions.moveSelectedRowsTop);
            }

            if(scrollable && scrollable.element) {
                scrollable.element.scrollTop(0);
                var row = scrollable.element.find('tr[data-id="'+value+'"]');
                var fixTopPosition = scrollable.fixTopPosition || 0;

                if(row.length > 0) {
                    scrollable.element.scrollTop(row.position().top - fixTopPosition);
                }
            }
        },
        /**
         * @method removeSelections
         */
        removeSelections: function () {
            var rows = this.table.find('tbody tr');

            rows.removeClass('selected');
        },

        /**
         * @method addSelectionListener
         * The callback function will receive reference to the grid in question
         * as first parameter and the id for the selected data as second
         * parameter:
         * function({Oskari.userinterface.component.Grid} grid, {String} dataId)
         *
         * @param {function} pCallback
         * Callback to call when a row has been selected
         *
         */
        addSelectionListener: function (pCallback) {
            this.selectionListeners.push(pCallback);
        },

        /**
         * @method getSelection
         * Returns current selection visible on grid.
         *
         * @return {Object[]}
         * Subset of #getDataModel() that is currently selected in grid
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
         * Move selected rows on the top
         * @method @public moveSelectedRowsTop
         * @param {Boolean} move is wanted move selected rows on the top of grid?
         */
        moveSelectedRowsTop: function(move){
            var me = this;
            me.sortOptions.moveSelectedRowsTop = !!move;

            // If there is sort then keep rows order when selected keep selected rows on the top
            if(me._getSelectedRows().values && me._getSelectedRows().values.length > 0 && me.lastSort) {
                me.sortBy(me.lastSort.attr, me.lastSort.descending);
            }
            // Otherwise do only moving selected rows to top
            else {
                me._moveSelectedRowsTop();
            }
        },

        /**
         * @private @method _dataSelected
         * Notifies all selection listeners about selected data.
         *
         * @param {String} dataId id for the selected data
         * @param {Boolean} isCtrlKey was control key down when clicked?
         */
        _dataSelected: function (dataId, isCtrlKey) {
            var i;

            for (i = 0; i < this.selectionListeners.length; i += 1) {
                this.selectionListeners[i](this, dataId, isCtrlKey);
            }
        },

        /**
         * Gets selected rows elements and values
         * @method  @private _getSelectedRows
         * @return {Object} selected elements and values {elements:[],values:[]}
         */
        _getSelectedRows: function(){
            var me = this;
            var selected = {
                elements: [],
                values : []
            };
            if(me.table){
                me.table.find('tr.selected').each(function(){
                    var el = jQuery(this);
                    selected.elements.push(el);
                    selected.values.push(el.attr('data-id'));
                });
            }
            return selected;
        },

        /**
         * Move selected rows to top of grid
         * @method  @private _moveSelectedRowsTop
         */
        _moveSelectedRowsTop: function(){
            var me = this;
            if(me.sortOptions.moveSelectedRowsTop) {
                me.table.hide();
                var selected = me._getSelectedRows();
                var moveRow = function(rowEl) {
                    me.table.prepend(rowEl);
                };
                selected.elements.reverse().forEach(function(el){
                    moveRow(el);
                });

                // Also sort model data
                var idField = me.model.getIdField();
                var data = [];
                var moveData = function(item){
                    if(selected.values.indexOf(item[idField]) > -1) {
                        data.unshift(item);
                    } else {
                        data.push(item);
                    }
                };
                me.model.getData().forEach(function(item){
                    moveData(item);
                });

                me.model.data = data;
                me.table.show();
            }
        }
    }
);