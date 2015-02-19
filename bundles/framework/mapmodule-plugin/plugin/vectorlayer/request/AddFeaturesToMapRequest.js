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
     * @param {String} geometryType geometry type, WKT or GeoJSON
     * @param {Object} attributes the attributes
     * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
     * @param {String} operation the operation, supported: 'replace'
     * @param {Boolean} keepLayerOnTop keep layer on top
     * @param {OpenLayers.Style} style the features style
     * @param {Boolean} centerTo center map to features. Default true.
     */
    function (geometry, geometryType, attributes, layer, operation, keepLayerOnTop, style, centerTo) {
        this._creator = null;
        this._geometry = geometry;
        this._geometryType = geometryType;
        this._attributes = attributes;
        this._layer = layer;
        this._operation = operation; // supported now: 'replace'
        this._style = style;
        this._centerTo = centerTo;
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
         * @method getAttributes
         * @return {Object} attributes object
         */
        getAttributes: function(){
            return this._attributes;
        },
        /**
         * @method getLayer
         * @return {Oskari.mapframework.domain.VectorLayer} layer
         */
        getLayer: function(){
            return this._layer;
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
         * @method getStyle
         * @return {OpenLayers.Style} sld style
         */
        getStyle: function(){
            return this._style;
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