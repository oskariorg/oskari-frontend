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
        this._defaultStyle = {
            fill : {
                color : 'rgba(255,0,255,0.2)'
            },
            stroke : {
                color : 'rgba(0,0,0,1)',
                width : 2
            },
            image : {
                radius: 4,
                fill : {
                    color : 'rgba(0,0,0,1)'
                }
            },
            text : {
                scale : 1.3,
                fill : {
                    color : 'rgba(0,0,0,1)'
                },
                stroke : {
                    color : 'rgba(255,255,255,1)',
                    width : 2
                }
            }
        };
        this._pointerMoveAdded = false;
        this._layers = {};
        this._features = {};
        this._layerStyles = {};
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
            var me = this;
            me.registerVectorFormats();
            me._createConfiguredLayers();
        },

        /**
         * @method  @private _createConfiguredLayers Create configured layers an their styles
         */
        _createConfiguredLayers: function(){
            var me = this,
                conf = me.getConfig();
            if(conf.layers) {
                for(var i=0;i<conf.layers.length;i++) {
                    var layer = conf.layers[i];
                    var layerId = layer.id;
                    var layerStyle = layer.style;

                    if(!me._features[layerId]) {
                        me._features[layerId] = [];
                    }

                    var opacity = 100;
                    var vectorSource = new ol.source.Vector();
                    var olLayer = new ol.layer.Vector({
                      name: me._olLayerPrefix + layerId,
                      id: layerId,
                      source: vectorSource});

                    olLayer.setOpacity(opacity);

                    me._map.addLayer(olLayer);
                    me.raiseVectorLayer(olLayer);
                    me._layers[layerId] = olLayer;
                    me._layerStyles[layerId] = layerStyle;
                }
            }
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
                MapClickedEvent: function(event) {
                    me.__mapClick(event);
                },
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                }
            };
        },
        /**
         * Find features from layers controlled by vectorlayerplugin and handle clicks for all those features
         * @param  {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event [description]
         */
        __mapClick : function(event) {
            var me = this;
            var features = [];
            this.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], function (feature, layer) {
                _.forEach(me._layers, function (vectorlayer, id) {
                    if(vectorlayer === layer) {
                        features.push({
                            feature : feature,
                            layerId : id
                        });
                        return true;
                    }
                });
            });
            me.__featureClicked(features);
        },
        __featureClicked: function(features) {
            if(!features || !features.length) {
                return;
            }
            var sandbox = this.getSandbox();
            var clickEvent = sandbox.getEventBuilder('FeatureEvent')().setOpClick();
            var formatter = this._supportedFormats['GeoJSON'];
            _.forEach(features, function (obj) {
                var geojson = formatter.writeFeaturesObject([obj.feature]);
                clickEvent.addFeature(obj.feature.getId(), geojson, obj.layerId);
            });
            sandbox.notifyAll(clickEvent);
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
         * @param {String} identifier the feature attribute identifier
         * @param {String} value the feature identifier value
         * @param {Oskari.mapframework.domain.VectorLayer} layer layer details
         */
        removeFeaturesFromMap: function(identifier, value, layer){
            var me = this,
                olLayer,
                layerId;

            if(layer && layer !== null){
                layerId = layer.getId();
                olLayer = me._layers[layerId];
            }
            if (olLayer) {
                // Removes only wanted features from the given maplayer
                if (identifier && identifier !== null && value && value !== null) {
                    me._removeFeaturesByAttribute(olLayer, identifier, value);
                }
                //remove all features from the given layer
                else {
                    this._map.removeLayer(olLayer);
                    this._removeFeaturesByAttribute(olLayer);
                    delete this._layers[layerId];
                }
            }
            // Removes all features from all layers
            else {
                for (var layerId in me._layers) {
                    if (me._layers.hasOwnProperty(layerId)) {
                        olLayer = me._layers[layerId];
                        this._map.removeLayer(olLayer);
                        this._removeFeaturesByAttribute(olLayer);
                        delete this._layers[layerId];
                    }
                }
            }
        },
        _removeFeaturesByAttribute: function(olLayer, identifier, value) {
            var source = olLayer.getSource(),
                featuresToRemove = [];

            // add all features if identifier and value are missing or
            // if given -> features that have
            source.forEachFeature(function(feature) {
                if ((!identifier && !value) ||
                    feature.get(identifier) === value) {
                    featuresToRemove.push(feature);
                }
            });

            // notify other components of removal
            var formatter = this._supportedFormats['GeoJSON'];
            var sandbox = this.getSandbox();
            var removeEvent = sandbox.getEventBuilder('FeatureEvent')().setOpRemove();

            for (var i = 0; i < featuresToRemove.length; i++) {
                var feature = featuresToRemove[i];
                source.removeFeature(feature);
                var geojson = formatter.writeFeaturesObject([feature]);
                removeEvent.addFeature(feature.getId(), geojson, olLayer.get('id'));
            }
            sandbox.notifyAll(removeEvent);
        },
        _getGeometryType: function(geometry) {
            if (typeof geometry === 'string' || geometry instanceof String) {
                return 'WKT';
            }
            return 'GeoJSON';
        },
        /**
         * @method addFeaturesToMap
         * @public
         * Add feature on the map
         *
         * @param {Object} geometry the geometry WKT string or GeoJSON object
         * @param {Object} options additional options
         */

        addFeaturesToMap: function(geometry, options){
            var me = this,
                geometryType = me._getGeometryType(geometry),
                format = me._supportedFormats[geometryType],
                layer,
                vectorSource,
                mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');

            if (!format) {
                return;
            }

            if (geometry) {
                // if there's no layerId provided -> Just use a generic vector layer for all.
                if (!options.layerId) {
                    options.layerId = 'VECTOR';
                }
                var features = format.readFeatures(geometry);

                //add cursor if defined so
                if(options.cursor){
                    if (!options.attributes){
                      options.attributes = {};
                    }

                    options.attributes['oskari-cursor'] = options.cursor;

                    // Add pointer move if not added already
                    if(!me._pointerMoveAdded) {
                        me._map.on('pointermove', function (evt) {
                          var target = me._map.getTarget();
                          var jTarget = typeof target === "string" ? jQuery("#" + target) : jQuery(target);
                          var cursor = null;
                          var hit = this.forEachFeatureAtPixel(evt.pixel,
                              function(feature, layer) {
                                if(feature.getProperties()['oskari-cursor']) {
                                  cursor = feature.getProperties()['oskari-cursor'];
                                }
                                return true;
                              });

                            if (hit && cursor) {
                              jTarget.css('cursor', cursor);
                            } else {
                              jTarget.css('cursor', '');
                            }
                      });
                      me._pointerMoveAdded = true;
                  }
                }


                if (options.attributes && options.attributes !== null && features instanceof Array && features.length) {
                    features[0].setProperties(options.attributes);
                }
                _.forEach(features, function (feature) {
                    if (!feature.getId()) {
                        var id = 'F' + me._nextFeatureId++;
                        feature.setId(id);
                    }
                });

                var prio = options.prio || 0;

                _.forEach(features, function (feature) {
                    me.setupFeatureStyle(options, feature);
                });

                if(!me._features[options.layerId]) {
                  me._features[options.layerId] = [];
                }
                //check if layer is already on map
                if (me._layers[options.layerId]) {
                    layer = me._layers[options.layerId];
                    vectorSource = layer.getSource();

                    //layer is already on map
                    //clear old features if defined so
                    if (options.clearPrevious === true) {
                        this._removeFeaturesByAttribute(layer);
                        vectorSource.clear();
                        me._features[options.layerId] = [];
                    }

                    // prio handling
                    me._features[options.layerId].push({
                      data: features,
                      prio: prio
                    });

                    if(options.prio && !isNaN(options.prio)){
                        this._removeFeaturesByAttribute(layer);
                        vectorSource.clear();

                        me._features[options.layerId].sort(function(a,b){
                          return b.prio - a.prio;
                        });
                        var zIndex = 0;
                        _.forEach(me._features[options.layerId], function(featObj) {
                            _.forEach(featObj.data, function (feature) {
                                feature.getStyle().setZIndex(zIndex);
                                vectorSource.addFeature(feature);
                                zIndex++;
                            });

                        });
                    } else {
                      vectorSource.addFeatures(features);
                    }
                    me.raiseVectorLayer(layer);
                } else {
                    //let's create vector layer with features and add it to the map
                    vectorSource = new ol.source.Vector({
                        features: features
                    });
                    layer = new ol.layer.Vector({name: me._olLayerPrefix + options.layerId,
                                                    id: options.layerId,
                                                    source: vectorSource});
                    if (options.layerOptions) {
                        layer.setProperties(options.layerOptions);
                    }

                    me._features[options.layerId].push({
                      data: features,
                      prio: prio
                    });


                    me._layers[options.layerId] = layer;
                    me._map.addLayer(layer);
                    me.raiseVectorLayer(layer);
                }

                // notify other components that features have been added
                var formatter = this._supportedFormats['GeoJSON'];
                var sandbox = this.getSandbox();
                var addEvent = sandbox.getEventBuilder('FeatureEvent')().setOpAdd();

                _.forEach(features, function (feature) {
                    var geojson = formatter.writeFeaturesObject([feature]);
                    addEvent.addFeature(feature.getId(), geojson, layer.get('id'));
                });
                sandbox.notifyAll(addEvent);

                // re-position map when opted
                if (options.centerTo === true) {
                    var extent = vectorSource.getExtent();
                    me.getMapModule().zoomToExtent(extent);

                    // Check scale if defined so. Scale decreases when the map is zoomed in. Scale increases when the map is zoomed out.
                    if(options.minScale) {
                        var currentScale = this.getMapModule().getMapScale();
                        if(currentScale<options.minScale) {
                            this.getMapModule().zoomToScale(options.minScale, true);
                        }
                    }
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
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
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
        },
        /**
         * Possible workaround for arranging the feature draw order within a layer
         *
         */
        rearrangeFeatures : function() {
            var me = this,
                layers = me.layers;
            for(key in layers) {
                if(layers[key].features.length > 0) {
                    var layer = layers[key];
                    var features = layer.features;
                    features.sort(function(a, b) {
                        if(a.config !== undefined){
                            if (a.config.positionInsideLayer < b.config.positionInsideLayer) {
                                return -1;
                            }
                            if (a.config.positionInsideLayer > b.config.positionInsideLayer) {
                                return 1;
                            }
                            return 0;
                        }
                    });
                    layer.removeAllFeatures();
                    layer.addFeatures(features);
                }
            }
        },
        setupFeatureStyle: function(options, feature) {
            var style = this.getStyle(options);
            //set up property-based labeling
            if (Oskari.util.keyExists(options, 'featureStyle.text.labelProperty') && style.getText()) {
                var label = feature.get(options.featureStyle.text.labelProperty) ? feature.get(options.featureStyle.text.labelProperty) : '';
                style.getText().setText(label);
            }
            feature.setStyle(style);

        },
        /**
         * @method getStyle
         *
         * @param {Object} options. If option.featureStyle not given, will set default layer styles. If layer style not exist then use defaults.
         * Wanted style object:
         * {
         *     fill: {
         *         color: '#ff0000'
         *     },
         *     stroke: {
         *         color: '#00ff00',
         *         width: 3
         *     },
         *     text: {
         *         fill: {
         *             color: '#0000ff'
         *         },
         *         stroke: {
         *             color: '#ff00ff',
         *             width: 4
         *         }
         *     }
         * }
         */
        getStyle : function(options) {
            var me = this;
            var styles = options.featureStyle || me._layerStyles[options.layerId] ||{};

            // overriding default style with feature/layer style
            var styleDef = jQuery.extend({}, this._defaultStyle, styles);
            return me.getMapModule().getStyle(styleDef);
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

