/**
 * @class Oskari.userinterface.component.Grid.Sort
 *
 * Includes sort functionalities of Oskari.userinterface.component.Grid
 */
Oskari.clazz.category(
    'Oskari.userinterface.component.Grid',
    'sort', {
        /* Sort options.*/
        sortOptions: {},

        /* last sort parameters are saved so we can change sort direction if the
         * same column is sorted again
         */
        lastSort: null,

        /**
         * @public @method sortBy
         * Sorts the last search result by comparing given attribute on the search objects
         *
         * @param {String} scopedValue Attributename to sort by (e.g. result[pAttribute])
         * @param {Boolean} descending true if sort direction is descending
         */
        sortBy: function(scopedValue, descending) {
            if(!this.model || !this.table) {
                return;
            }
            var me = this;
            var selected = me._getSelectedRows();

            // sort the results
            me._sortBy(scopedValue, descending);
            // populate table content
            var fieldNames = me.visibleColumns;
            if(fieldNames.length === 0) {
                fieldNames = me.fieldNames;
            }
            // if visible fields not given, show all
            if (fieldNames.length === 0) {
                fieldNames = me.model.getFields();
            }
            this.table.find('tbody').empty();
            me._renderBody(this.table, fieldNames);

            // Highlight selected back
            selected.values.forEach(function(value){
                me.table.find('tr[data-id="'+value+'"]').addClass('selected');
            });

            me._moveSelectedRowsTop();

            me.trigger('sort', {
                column : scopedValue,
                ascending : !descending
            });
        },
        /**
         * @private @method _sortBy
         * Sorts the last search result by comparing given attribute on the search objects
         *
         * @param {String} pAttribute
         * Attributename to sort by (e.g. result[pAttribute])
         * @param {Boolean} pDescending true if sort direction is descending
         */
        _sortBy: function (pAttribute, pDescending) {
            if(!this.model) {
                return;
            }
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
                if (typeof a[pAttribute] === 'object' ||
                    typeof b[pAttribute] === 'object') {
                    // not sorting objects
                    return 0;
                }

                var nameA = me._getAttributeValue(a, pAttribute);
                var nameB = me._getAttributeValue(b, pAttribute);

                var renderer = me.valueRenderer[pAttribute];
                if (renderer) {
                    nameA = renderer(nameA);
                    nameB = renderer(nameB);
                }

                return Oskari.util.naturalSort(nameA, nameB, pDescending);
            });
        }
    }
);