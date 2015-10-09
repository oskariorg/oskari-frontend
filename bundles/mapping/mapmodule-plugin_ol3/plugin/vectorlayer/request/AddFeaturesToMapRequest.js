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
     * @param {String} geometryType the geometry type. Supported formats are: WKT and GeoJSON.
     * @param {String} layerId Id of the layer where features will be added. If not given, will create new vector layer
     * @param {String} operation layer operations. Supported: replace.
     * @param {Boolean} keepLayerOnTop. If true add layer on the top. Default true.
     * @param {ol.layer.Vector options} layerOptions options for layer.
     * @param {ol.style.Style} featureStyle Style for the feature. This can be a single style object, an array of styles, or a function that takes a resolution and returns an array of styles.
     * @param {Boolean} centerTo center map to features. Default true.
     */
    function (geometry, geometryType, layerId, operation, keepLayerOnTop, layerOptions, featureStyle, centerTo) {
        this._creator = null;
        this._geometry = geometry;
        this._geometryType = geometryType;
        this._layerId = layerId;
        this._operation = operation; // supported now: 'replace'
        this._layerOptions = layerOptions;
        this._centerTo = centerTo;
        this._featureStyle = featureStyle;
        this._keepLayerOnTop = keepLayerOnTop;
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
            return this._geometryType;
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
        getOperation: function(){
            return this._operation;
        },
        /**
         * @method getKeepLayerOnTop
         * @return {Boolean} keep layer on top
         */
        getKeepLayerOnTop: function(){
            return this._keepLayerOnTop;
        },
        /**
         * @method getLayerOptions
         * @return {ol.layer.Vector options} layer options
         */
        getLayerOptions: function(){
            return this._layerOptions;
        },
        /**
         * @method getLayerOptions
         * @return {ol.layer.Vector options} layer options
         */
        getFeatureStyle: function(){
            return this._featureStyle;
        },
        /**
         * @method getCenterTo
         * @return {Boolean} kcenter map to features. Default true.
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