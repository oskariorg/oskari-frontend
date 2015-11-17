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
        this._sldFormat = new OpenLayers.Format.SLD({
            multipleSymbolizers: false,
            namedLayersAsArray: true
        });
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
                },
                FeaturesAvailableEvent: function (event) {
                    me.handleFeaturesAvailableEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                }
            };
        },
        /**
         * @method preselectLayers
         * @public preselect layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                ilen,
                layer,
                layerId;

            for (i = 0, ilen = layers.length; i < ilen; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (!layer.isLayerOfType('VECTOR')) {
                    continue;
                }

                sandbox.printDebug('preselecting ' + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }
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
                new OpenLayers.Format.GeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function () {
                    this.read = function (data) {
                        return data;
                    };
                }
            );
            me.registerVectorFormat('GeoJSON', new OpenLayers.Format.GeoJSON());
            me.registerVectorFormat('WKT', new OpenLayers.Format.WKT({}));
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
                foundFeatures,
                olLayer,
                layerId;

            if(layer && layer !== null){
                layerId = layer.getId();
                olLayer = me._map.getLayersByName(me._olLayerPrefix + layerId)[0];
            }
            // Removes only wanted features from the given maplayer
            if (olLayer) {
                if (identifier && identifier !== null && value && value !== null) {
                    foundFeatures = olLayer.getFeaturesByAttribute(identifier, value);
                    olLayer.removeFeatures(foundFeatures);
                    olLayer.refresh();
                }
                //remove all features from the given layer
                else {
                    this._map.removeLayer(me._layers[layerId]);
                    delete this._layers[layerId];
                }
            }
            // Removes all features from all layers
            else {
                for (var layerId in me._layers) {
                    if (me._layers.hasOwnProperty(layerId)) {
                        this._map.removeLayer(me._layers[layerId]);
                        delete this._layers[layerId];
                    }
                }
            }
        },
        _getGeometryType: function(geometry){
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
                olLayer,
                layer,
                mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if (!format) {
                return;
            }
            if (geometry) {
                var feature = format.read(geometry);
                //if there's no layerId provided -> Just use a generic vector layer for all.
                if (!options.layerId) {
                    options.layerId = 'VECTOR';
                }
                if (options.attributes && options.attributes !== null) {
                    if(feature instanceof Array && geometryType === 'GeoJSON'){
                        //Remark: It is preferred to use GeoJSON properties for attributes
                        // There could be many features in GeoJson and now attributes are set only for 1st feature
                        feature[0].attributes = options.attributes;
                    } else {
                        feature.attributes = options.attributes;
                    }
                }
                olLayer = me._map.getLayersByName(me._olLayerPrefix + options.layerId)[0];
                if (!olLayer) {
                    var opacity = 100;
                    if(layer){
                        opacity = layer.getOpacity() / 100;
                    }
                    olLayer = new OpenLayers.Layer.Vector(me._olLayerPrefix + options.layerId);
                    olLayer.setOpacity(opacity);
                    isOlLayerAdded = false;
                }
                if (options.replace && options.replace !== null && options.replace === 'replace') {
                    olLayer.removeAllFeatures();
                    olLayer.refresh();
                }
                if (options.featureStyle && options.featureStyle !== null) {
                    for (i=0; i < feature.length; i++) {
                        featureInstance = feature[i];
                        featureInstance.style = options.featureStyle;
                    }
                }
                olLayer.addFeatures(feature);
                if(isOlLayerAdded === false) {
                    me._map.addLayer(olLayer);
                    me._map.setLayerIndex(
                        olLayer,
                        me._map.layers.length
                    );
                    me._layers[options.layerId] = olLayer;
                }

                if (layer && layer !== null) {
                    mapLayerService.addLayer(layer, false);

                    window.setTimeout(function(){
                        var request = me._sandbox.getRequestBuilder('AddMapLayerRequest')(layerId, true);
                            me._sandbox.request(me.getName(), request);
                        },
                    50);
                }
                if(options.centerTo === true){
                    var center, bounds;
                    if(geometry.type !== 'FeatureCollection') {
                        center = feature.geometry.getCentroid();
                        bounds = feature.geometry.getBounds();
                    } else {
                        var bottom,
                            left,
                            top,
                            right;
                        for(var f=0;f<feature.length;f++) {
                            var feat = feature[f];
                            var featBounds = feat.geometry.getBounds();
                            if(!bottom || featBounds.bottom<bottom) {
                                bottom = featBounds.bottom;
                            }
                            if(!left || featBounds.left<left) {
                                left = featBounds.left;
                            }
                            if(!top || featBounds.top>top) {
                                top = featBounds.top;
                            }
                            if(!right || featBounds.right>right) {
                                right = featBounds.right;
                            }
                        }
                        bounds = new OpenLayers.Bounds();
                        bounds.extend(new OpenLayers.LonLat(left,bottom));
                        bounds.extend(new OpenLayers.LonLat(right,top));
                        center = new OpenLayers.LonLat((right-((right-left)/2)),(top-((top-bottom)/2)));
                    }

                    mapmoveRequest = me._sandbox.getRequestBuilder('MapMoveRequest')(center.x, center.y, bounds, false);
                    me._sandbox.request(me, mapmoveRequest);
                }
            }
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
            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            var styleMap = new OpenLayers.StyleMap(),
                layerOpts = {
                    styleMap: styleMap
                },
                sldSpec = layer.getStyledLayerDescriptor(),
                me = this;

            if (sldSpec) {
                this.getSandbox().printDebug(sldSpec);
                var styleInfo = this._sldFormat.read(sldSpec),
                    styles = styleInfo.namedLayers[0].userStyles,
                    style = styles[0];

                styleMap.styles['default'] = style;
            }

            var openLayer = new OpenLayers.Layer.Vector(
                me._olLayerPrefix + layer.getId(),
                layerOpts
            );

            openLayer.opacity = layer.getOpacity() / 100;

            this.getMap().addLayer(openLayer);

            this.getSandbox().printDebug(
                '#!#! CREATED VECTOR / OPENLAYER.LAYER.VECTOR for ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                this.getMap().setLayerIndex(
                    openLayer,
                    this.getMap().layers.length
                );
            } else {
                this.getMap().setLayerIndex(openLayer, 0);
            }
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
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent} event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var me = this,
                layer = event.getMapLayer();

            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            var mapLayer = this.getMap().getLayersByName(
                me._olLayerPrefix + layer.getId()
            );
            if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },
        /**
         * @method removeMapLayerFromMap
         * Remove map layer from map.
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        removeMapLayerFromMap: function (layer) {
            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            var me = this,
                remLayer = this.getMap().getLayersByName(me._olLayerPrefix + layer.getId());

            // This should free all memory
            if(remLayer[0]) {
                remLayer[0].destroy();
            }
        },
        /**
         * @method getOLMapLayers
         * Get OpenLayers map layers.
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }
            var me = this;
            return this.getMap().getLayersByName(me._olLayerPrefix + layer.getId());
        },
        /**
         * @method handleFeaturesAvailableEvent
         * Handle features available event.
         *
         * @param {object} event
         */
        handleFeaturesAvailableEvent: function (event) {
            var me = this,
                mimeType = event.getMimeType(),
                features = event.getFeatures(),
                op = event.getOp(),
                mapLayer = this.getMap().getLayersByName(
                    me._olLayerPrefix
                )[0];

            if (!mapLayer) {
                return;
            }

            if (op && op === 'replace') {
                mapLayer.removeFeatures(mapLayer.features);
            }

            var format = this._supportedFormats[mimeType];

            if (!format) {
                return;
            }

            var fc = format.read(features);

            mapLayer.addFeatures(fc);
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

