/**
 * @class Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequest
 *
 * Class for requesting add features to map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequest',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String/OpenLayers.Format.GeoJSON} geometry the geometry
     * @param {Object} options additional options
     */
    function (geometry, options) {
        this._creator = null;
        this._geometry = geometry;
        this._options = options;
    }, {
        /** @static @property __name request name */
        __name: 'MapModulePlugin.AddFeaturesToMapRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getGeometry
         * @return {String/Object} geometry
         */
        getGeometry: function() {
            return this._geometry;
        },
        /**
         * @method getOptions
         * @return {String} get geometry type
         */
        getOptions: function() {
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