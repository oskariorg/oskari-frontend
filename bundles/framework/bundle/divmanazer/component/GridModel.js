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
        "use strict";
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
            "use strict";
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
            "use strict";
            return this.fields;
        },
        /**
         * @method setIdField
         * If not given, first field in data will be used
         * @param {String} pField name of the field that will be used as an id field
         */
        setIdField: function (pField) {
            "use strict";
            this.idField = pField;
        },
        /**
         * @method getIdField
         * Returns the name of the field that is used as an id field
         * @return {String}
         */
        getIdField: function () {
            "use strict";
            return this.idField;
        },
        /**
         * @method addData
         * Used to accumulate the data array for the model
         * @param {Object} pData
         */
        addData: function (pData) {
            "use strict";
            var key;
            // populate fields array if first data
            if (this.fields.length === 0) {
                for (key in pData) {
                    if (pData.hasOwnProperty(key)) {
                        this._addField(key);
                    }
                }
            }
            this.data.push(pData);
        },
        /**
         * @method getData
         * Returns the model data as array
         * @return {Object[]}
         */
        getData: function () {
            "use strict";
            return this.data;
        }
    });
