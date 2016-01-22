/**
 * @class Oskari.mapframework.bundle.mapmodule.request.ZoomToFeaturesRequest
 *
 * Class for requesting add features to map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.ZoomToFeaturesRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Object} layer
     * @param {Object} options additional options
     */
    function (layer, options) {
        this._layer = layer;
        this._options = options;
    }, {
        /** @static @property __name request name */
        __name: 'MapModulePlugin.ZoomToFeaturesRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getLayer
         * @return {Object} layer
         */
        getLayer: function(){
            return this._layer;
        },
        /**
         * @method getOptions
         * @return {Object} options
         */
        getOptions: function(){
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