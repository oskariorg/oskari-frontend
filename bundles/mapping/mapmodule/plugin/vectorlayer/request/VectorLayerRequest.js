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
     * @param {String} layerId layer's id
     * @param {Object} options additional options
     */
    function (layerId, options) {
        this._creator = null;
        this._layerId = layerId;
        this._options = options;
    }, {
        /** @static @property __name request name */
        __name: 'MapModulePlugin.VectorLayerRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getId
         * @return {String} layer id
         */
        getLayerId: function () {
            return this._layerId;
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
