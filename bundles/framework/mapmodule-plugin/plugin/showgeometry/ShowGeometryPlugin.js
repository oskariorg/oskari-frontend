/**
 * @class Oskari.mapframework.bundle.plugin.ShowGeometryPlugin
 * Shows WKT or GeoJSON to the map.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.ShowGeometryPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */
    function () {
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
        
        this._olLayerPrefix = "SHOWGEOMETRY_";
        
    }, {
        /** @static @property __name plugin name */
        __name: 'ShowGeometryPlugin',
        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has not UI so always returns false
         */
        hasUI: function () {
            return false;
        },
        /**
         * @method init
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            
        },

        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },

        /**
         * @method _registerVectorFormat
         * @private
         * Adds vector format to props of known formats
         *
         * @param geometryType vector format
         * @param formatImpl format implementation
         */
        _registerVectorFormat: function (geometryType, formatImpl) {
            var me = this;
            me._supportedFormats[geometryType] = formatImpl;
        },
        /**
         * @method _registerVectorFormats
         * @private
         * Registers default vector formats
         */
        _registerVectorFormats: function () {
            var me = this;
            me._registerVectorFormat('GeoJSON', new OpenLayers.Format.GeoJSON());
            me._registerVectorFormat('WKT', new OpenLayers.Format.WKT({}));
        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this;
            me._sandbox = sandbox;
            me._map = this.getMapModule().getMap();

            sandbox.register(this);

            me._registerVectorFormats();
/*
            POLYGON ((4094485.56723472 2476062.767112067, 
                5400519.165736005 2811354.452930909, 
                4742671.868119625 4458566.284254857, 
                3671322.242936889 4017334.5608673007, 
                4094485.56723472 2476062.767112067))
*/
/*
            var wkt = 'POLYGON (('+
                '429268 6903911,' +
                '438128 6908451,' +
                '443288 6897751,' +
                '430468 6895391,' +
                '429268 6903911' +
                '))';

            var wkt = "POLYGON ((375207.07719295955 6679961.038833934, 375207.07719295955 6697464.48468633, 400444.3787757725 6697464.48468633, 400444.3787757725 6679961.038833934, 375207.07719295955 6679961.038833934))";

            var layerJson = {
                wmsName: '',
                type: 'vectorlayer',
                isQueryable: false,
                opacity: 60,
                //metaType: '100000',
                orgName: 'METATIETO ORGANISAATIO',
                inspire: 'METATIETO INSPIRE',
                id: 'METATIETOKATTAVUUS_ID',
                name: 'METATIETOKATTAVUUS'
            };

            var mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var vectorLayer = mapLayerService.createMapLayer(layerJson);

            var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            style.pointRadius = 8;
            style.strokeColor = '#D3BB1B';
            style.fillColor = '#FFDE00';
            style.fillOpacity = 1;
            style.strokeOpacity = 1;
            style.strokeWidth = 2;
            style.cursor = 'pointer';
            me._sandbox.postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [wkt, 'WKT', null, vectorLayer, 'replace', true, style, true]);
            */
            
            
        },
        /**
         * @method addFeaturesOnMap
         * @public
         * Add feature on the map
         * 
         * @param {Object} geometry the geometry WKT string or GeoJSON object
         * @param {String} geometryType the geometry type. Supported formats are: WKT and GeoJSON.
         * @param {Object} attributes the geometry attributes
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layer
         * @param {String} operation layer operations. Supported: replace.
         * @param {Boolean} keepLayerOnTop. If true add layer on the top. Default true.
         * @param {OpenLayers.Style} style the features style
         * @param {Boolean} centerTo center map to features. Default true.
         */
        addFeaturesToMap: function(geometry, geometryType, attributes, layer, operation, keepLayerOnTop, style, centerTo){
            var me = this,
                format = me._supportedFormats[geometryType],
                olLayer,
                isOlLayerAdded = true;

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            if (!format) {
                return;
            }

            if (!keepLayerOnTop) {
                var keepLayerOnTop = true;
            }

            if (geometry) {
                var feature = format.read(geometry);

                if (attributes && attributes !== null) {
                    feature.attributes = attributes;
                }
                
                olLayer = me._map.getLayersByName(me._olLayerPrefix + layer.getId())[0];
                
                if (!olLayer) {
                    var opacity = 100;
                    if(layer){
                        opacity = layer.getOpacity() / 100;
                    }
                    olLayer = new OpenLayers.Layer.Vector(me._olLayerPrefix + layer.getId());

                    olLayer.setOpacity(opacity);
                    isOlLayerAdded = false;
                }

                if (operation && operation !== null && operation === 'replace') {
                    olLayer.removeFeatures(olLayer.features);
                }

                if (style && style !== null) {
                    feature.style = style;
                }

                olLayer.addFeatures([feature]);
                
                if(isOlLayerAdded === false) me._map.addLayer(olLayer);

                if (keepLayerOnTop) {
                    me._map.setLayerIndex(
                        olLayer,
                        me._map.layers.length
                    );
                } else {
                    me._map.setLayerIndex(openLayer, 0);
                }

                if (layer && layer !== null) {
                    var mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
                    mapLayerService.addLayer(layer, false);

                    window.setTimeout(function(){
                        var request = me._sandbox.getRequestBuilder('AddMapLayerRequest')(layer.getId(), true);
                            me._sandbox.request(me.getName(), request);
                        }, 
                    100);
                }
                
                if(centerTo === true){
                    var center = feature.geometry.getCentroid(),
                        mapmoveRequest = me._sandbox.getRequestBuilder('MapMoveRequest')(center.x, center.y, feature.geometry.getBounds(), false);
                    me._sandbox.request(me, mapmoveRequest);
                } 
            }
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this;
            sandbox.unregister(this);
            me._map = null;
            me._sandbox = null;
            me._supportedFormats = {};
        },     
        /**
         * @method _getDefaultStyle
         * Get feature deault style
         * @return {OpenLayers.Style} style
         */
        _getDefaultStyle: function(){
            var style = OpenLayers.Util.applyDefaults(style, OpenLayers.Feature.Vector.style['default']);
            style.pointRadius = 8;
            style.strokeColor = '#000000';
            style.fillColor = '#E9DA14';
            style.fillOpacity = 0.6;
            style.strokeOpacity = 1;
            style.strokeWidth = 2;
            style.cursor = 'pointer';
            return style;
        },
        _removeFeaturesFromMap: function(identifierValue, identifierName, layer){
            if(identifierValue && identifierName){
                // remove only matching features
                // remove layer from selected (if layer has no anymore features)
            } else {
                // remove all features
                // remove layer from selected
            }
        },

        /** 
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {},
        /** 
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method _getLayers
         * @private
         * @return selected layers in the pop-up
         */
        _getLayers: function () {
            var me = this,
                selectedLayers = me._sandbox.findAllSelectedMapLayers();
            //sort the layers
            selectedLayers.sort(function (a, b) {
                return me._layerListComparator(a, b);
            });
            return selectedLayers;
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });