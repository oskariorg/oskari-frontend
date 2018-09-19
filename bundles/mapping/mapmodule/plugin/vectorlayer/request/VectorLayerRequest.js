/**
 * @class Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest
 *
 * Class for requesting adding a new vector feature layer to map or updating existing map by id.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} options additional options
     */
    function (options) {
        this._creator = null;
        this._options = options;
    }, {
        /** @static @property __name request name */
        __name: 'VectorLayerRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getOptions
         * @return {String} get options for the layer
         */
        getOptions: function () {
            return this._options;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    }
);
