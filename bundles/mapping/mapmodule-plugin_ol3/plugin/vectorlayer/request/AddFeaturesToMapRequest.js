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
     * @param {Object} geometry the geometry WKT string or GeoJSON object
     * @param {Object} options An object including the optional parameters and styles
     *                  - {String} layerId Id of the layer where features will be added. If not given, will create new vector layer
     *                  - {Boolean} replace True if the specified layer is to be replaced with a new one
     *                  - {Object} layerOptions options for layer in JSON or String format
     *                  - {Object} featureStyle Style for the feature. A JSON or String object representation of OpenLayers style object
     *                  - {Boolean} centerTo True to center the map to the given geometry.
     */
    function (geometry, options) {
        this._creator = null;
        this._geometry = geometry;
        this._layerId = options.layerId;
        this._replace = options.replace;
        this._layerOptions = options.layerOptions;
        this._centerTo = options.centerTo;
        this._featureStyle = options.featureStyle;
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
        getGeometry: function(){
            return this._geometry;
        },
        /**
         * @method getGeometryType
         * @return {String} get geometry type
         */
        getGeometryType: function(){
            if (typeof this._geometry === 'string' || this._geometry instanceof String) {
                return 'WKT';
            }
            return 'GeoJSON';
        },
        /**
         * @method getLayerId
         * @return {String} layerId
         */
        getLayerId: function(){
            return this._layerId;
        },
        /**
         * @method getOperation
         * @return {String} operation, currently supported 'replace'
         */
        getReplace: function(){
            return this._replace;
        },
        /**
         * @method getLayerOptions
         * @return {ol.layer.Vector options} layer options
         */
        getLayerOptions: function(){
            return this._layerOptions;
        },
        /**
         * @method getFeatureStyle
         * @return {Object} featureStyle
         */
        getFeatureStyle: function(){
            return this._featureStyle;
        },
        /**
         * @method getCenterTo
         * @return {Boolean} center map to features. Default true.
         */
        getCenterTo: function(){
            if(this._centerTo && this._centerTo !== null) {
                return this._centerTo;
            }
            else {
                return true;
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.request.Request']
    }
);