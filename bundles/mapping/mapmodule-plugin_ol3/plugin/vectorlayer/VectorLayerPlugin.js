/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 * Provides functionality to draw vector layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.VectorLayerPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.mapmodule.VectorLayerPlugin';
        me._name = 'VectorLayerPlugin';
        this._olLayerPrefix = "vectorlayer_";
        this._supportedFormats = {};
        this._nextVectorId = 0;
        this._nextFeatureId = 0;
        this._layers = {};
    }, {
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {
            this.getMapModule().setLayerPlugin('vectorlayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('vectorlayer', null);
        },
        /**
         * @method _startPluginImpl
         * @private
         * Start plugin implementation
         *
         */
        _startPluginImpl: function () {
            this.registerVectorFormats();
        },
        /**
        * @method _createEventHandlers
        * Create event handlers
        * @private
        *
        */
        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                }
            };
        },
        /**
         * @method registerVectorFormat
         * Adds vector format to props of known formats
         *
         * @param  {String} mimeType mime type
         * @param  {Function} formatImpl format implementation
         */
        registerVectorFormat: function (mimeType, formatImpl) {
            this._supportedFormats[mimeType] = formatImpl;
        },

        /**
         * @method registerVectorFormats
         * Registers default vector formats
         */
        registerVectorFormats: function () {
            var me = this;
            this.registerVectorFormat('application/json',
                new ol.format.GeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function () {
                    this.read = function (data) {
                        return data;
                    };
                }
            );
            me.registerVectorFormat('GeoJSON', new ol.format.GeoJSON());
            me.registerVectorFormat('WKT', new ol.format.WKT({}));
        },
        /**
         * @method removeFeaturesFromMap
         * @public
         * Removes all/selected features from map.
         *
         * @param {String} featureId Id of the feature that should be removed. If not given, will remove all the features from the layer.
         * @param {String} layerId id of the layer where features should be removed. If not given, will remove all the features from map.
         */
        removeFeaturesFromMap: function(featureId, layerId){
            var me = this,
                foundedFeatures,
                mapLayer;

            if (_.isEmpty(this._layers)) {
                return;
            }
            mapLayer = this._layers[layerId];

            if (mapLayer) {
                if (featureId) {
                    var feature = mapLayer.getSource().getFeatureById(featureId);
                    mapLayer.getSource().removeFeature(feature);
                } else {
                    me._map.removeLayer(mapLayer);
                    me.removeMapLayerFromMap(mapLayer);
                }
            } else {
                _.forEach(this._layers, function (layer) {
                    me.removeMapLayerFromMap(layer);
                });
            }
        },
        /**
         * @method addFeaturesOnMap
         * @public
         * Add feature on the map
         *
         * @param {Object} geometry the geometry WKT string or GeoJSON object
         * @param {String} geometryType the geometry type. Supported formats are: WKT and GeoJSON.
         * @param {String} layerId Id of the layer where features will be added. If not given, will create new vector layer
         * @param {String} operation layer operations. Supported: replace.
         * @param {Boolean} keepLayerOnTop. If true add layer on the top. Default true.
         * @param {ol.layer.Vector options} layerOptions options for layer
         * @param {ol.style.Style} featureStyle Style for the feature. This can be a single style object, an array of styles, or a function that takes a resolution and returns an array of styles.
         * @param {Boolean} centerTo True to center the map to the given geometry.
         */
        addFeaturesToMap: function(geometry, geometryType, layerId, operation, keepLayerOnTop, layerOptions, featureStyle, centerTo){
            var me = this,
                format = me._supportedFormats[geometryType],
                olLayer,
                mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');

            if (!format) {
                return;
            }

            if (!keepLayerOnTop) {
                var keepLayerOnTop = true;
            }

            if (geometry) {
                var features = format.readFeatures(geometry);
                _.forEach(features, function (feature) {
                    if (!feature.getId()) {
                        var id = 'F' + me._nextFeatureId++;
                        feature.setId(id);
                    }
                });

                if (featureStyle) {
                    _.forEach(features, function (feature) {
                        feature.setStyle(featureStyle);
                    });
                }

                //check if layer is already on map
                if (me._layers[layerId]) {
                    //layer is already on map
                    //clear old features if defined so
                    if (operation && operation !== null && operation === 'replace') {
                        layer.getSource().clear();
                    }
                    var vectorsource = layer.getSource();
                    vectorsource.addFeatures(features);
                } else {
                    //let's create vector layer with features and add it to the map
                    var vectorsource = new ol.source.Vector({
                        features: features
                    });
                    var id = 'V' + me._nextVectorId++;
                    var layer = new ol.layer.Vector({name: me._olLayerPrefix + id,
                                                    id: id,
                                                    source: vectorsource});
                    if (layerOptions) {
                        layer.setProperties(layerOptions);
                    }
                    me._layers[id] = layer;
                    me._map.addLayer(layer);
                }

                if (keepLayerOnTop) {
                    me.raiseVectorLayer(layer);
                }

                if (centerTo === true) {
                    var extent = vectorsource.getExtent();
                    me.getMapModule().zoomToExtent(extent);
                }
            }
        },

        /**
         * Raises the marker layer above the other layers
         *
         * @param markerLayer
         */
        raiseVectorLayer: function(layer) {
            this.getMapModule().bringToTop(layer);
            layer.setVisible(true);
        },
        /**
         * @method _createRequestHandlers
         * @private
         * Create request handlers.
         */
        _createRequestHandlers: function () {
            var me = this,
                sandbox = me.getSandbox();
            return {
                'MapModulePlugin.AddFeaturesToMapRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.AddFeaturesToMapRequestHandler',
                    sandbox,
                    me
                ),
                'MapModulePlugin.RemoveFeaturesFromMapRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.RemoveFeaturesFromMapRequestHandler',
                    sandbox,
                    me
                )
            };
        },

        /**
         * @method AddMapLayerToMap
         * Primitive for adding layer to this map
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer
         * @param {Boolean} keepLayerOnTop keep layer on top
         * @param {Boolean} isBaseMap is basemap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
                return;
        },
        /**
         * @method afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         *
         * @param {Object} event
         */
        afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this.removeMapLayerFromMap(layer);
        },
        /**
         * @method removeMapLayerFromMap
         * Remove map layer from map.
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        removeMapLayerFromMap: function (layer) {
            if (!this._layers[layer.getId()]) {
                return;
            }
            var vectorLayer = this._layers[layer.getId()];
            this._map.removeLayer(vectorLayer);
            delete this._layers[layer.getId()];

        },
        /**
         * @method getOLMapLayers
         * Get OpenLayers map layers.
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType('VECTOR')) {
                return null;
            }
            if(!this._layers[layer.getSource().get(id)]) {
                return null;
            }
            // only single layer/id, wrap it in an array
            return [this._layers[layer.getSource().get(id)]];
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);

