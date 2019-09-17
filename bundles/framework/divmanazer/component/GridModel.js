/**
 * @class Oskari.userinterface.component.GridModel
 *
 * Model object for Oskari.userinterface.component.Grid.
 */
Oskari.clazz.define('Oskari.userinterface.component.GridModel',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        this.fields = [];
        this.data = [];
        this.idField = null;
    }, {
        /**
         * @method addField
         * Adds a field name matching data for more convenient access
         * @private
         * @param {String} field name for a field in data objects
         */
        _addField: function (field) {
            if (!this.idField) {
                // default to first field
                this.idField = field;
            }
            this.fields.push(field);
        },
        /**
         * @method getFields
         * Returns field names that are available in data
         * @return {String[]}
         */
        getFields: function () {
            return this.fields;
        },
        /**
         * Use to assign field order
         * @param {String[]} fields
         */
        setFields: function (fields) {
            this.fields = fields;
        },
        /**
         * @method setIdField
         * If not given, first field in data will be used
         * @param {String} pField name of the field that will be used as an id field
         */
        setIdField: function (pField) {
            this.idField = pField;
        },
        /**
         * @method getIdField
         * Returns the name of the field that is used as an id field
         * @return {String}
         */
        getIdField: function () {
            return this.idField;
        },
        /**
         * @method setFirstField
         * Sets the given field name to the first column
         * @param {String} firstField name of the first field
         */
        setFirstField: function (firstField) {
            if (_.indexOf(this.fields, firstField) === 0 || _.indexOf(this.fields, firstField) === -1) {

            } else {
                _.pull(this.fields, firstField);
                this.fields.unshift(firstField);
            }
        },
        /**
         * @method addData
         * Used to accumulate the data array for the model
         * @param {Object} pData
         * @param {Boolean} addMissingFields true if user wants to add new feaute keys to the fields
         */
        addData: function (pData, addMissingFields) {
            var me = this,
                key;
            // populate fields array if first data
            if (me.fields.length === 0) {
                for (key in pData) {
                    if (pData.hasOwnProperty(key)) {
                        me._addField(key);
                    }
                }
            }
            // if key is not in fields, add it there
            if (addMissingFields) {
                _.forEach(pData, function (n, key) {
                    var index = _.indexOf(me.fields, key);
                    if (index === -1) {
                        me._addField(key);
                    }
                });
            }
            this.data.push(pData);
        },
        /**
         * @method getData
         * Returns the model data as array
         * @return {Object[]}
         */
        getData: function () {
            return this.data;
        }
    });
