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
        this._style = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style['default']);
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
        __featureClicked: function(features, olLayer) {
            var sandbox = this.getSandbox();
            var clickEvent = sandbox.getEventBuilder('FeatureEvent')().setOpClick();
            var formatter = this._supportedFormats['GeoJSON'];
            var me = this;
            _.forEach(features, function (feature) {
                var geojson = formatter.write([feature]);
                clickEvent.addFeature(feature.id, geojson, me._getLayerId(olLayer.name));
            });
            sandbox.notifyAll(clickEvent);
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
                    me._removeFeaturesByAttribute(olLayer, identifier, value);
                    olLayer.refresh();
                }
                //remove all features from the given layer
                else {
                    this._map.removeLayer(me._layers[layerId]);
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
            var featuresToRemove = [];

            // add all features if identifier and value are missing or
            // if given -> features that have
            if (!identifier && !value) {
                featuresToRemove = olLayer.features;
            }
            else {
                featuresToRemove = olLayer.getFeaturesByAttribute(identifier, value);

            }

            // notify other components of removal
            var formatter = this._supportedFormats['GeoJSON'];
            var sandbox = this.getSandbox();
            var removeEvent = sandbox.getEventBuilder('FeatureEvent')().setOpRemove();

            olLayer.removeFeatures(featuresToRemove);
            for (var i = 0; i < featuresToRemove.length; i++) {
                var feature = featuresToRemove[i];
                var geojson = formatter.write([feature]);
                removeEvent.addFeature(feature.id, geojson, this._getLayerId(olLayer.name));
            }
            sandbox.notifyAll(removeEvent);
        },
        _getGeometryType: function(geometry){
            if (typeof geometry === 'string' || geometry instanceof String) {
                return 'WKT';
            }
            return 'GeoJSON';
        },
        _getLayerId : function(name) {
            var index = this._olLayerPrefix.length;
            return name.substring(index +1);
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
                var features = format.read(geometry);
                //if there's no layerId provided -> Just use a generic vector layer for all.
                if (!options.layerId) {
                    options.layerId = 'VECTOR';
                }
                if (options.attributes && options.attributes !== null) {
                    if(features instanceof Array && geometryType === 'GeoJSON'){
                        //Remark: It is preferred to use GeoJSON properties for attributes
                        // There could be many features in GeoJson and now attributes are set only for 1st feature
                        features[0].attributes = options.attributes;
                    } else {
                        features.attributes = options.attributes;
                    }
                }
                if(!Array.isArray(features)) {
                    features = [features];
                }
                olLayer = me._map.getLayersByName(me._olLayerPrefix + options.layerId)[0];
                if (!olLayer) {
                    var opacity = 100;
                    if(layer){
                        opacity = layer.getOpacity() / 100;
                    }
                    olLayer = new OpenLayers.Layer.Vector(me._olLayerPrefix + options.layerId);
                    olLayer.events.register('click', this, function(e) {
                        // clicking on map, check if feature is hit
                        if (e.target && e.target._featureId) {
                            me.__featureClicked([olLayer.getFeatureById(e.target._featureId)], olLayer);
                        }
                        return true;
                    });
                    olLayer.setOpacity(opacity);
                    isOlLayerAdded = false;
                }
                if (options.clearPrevious === true) {
                    this._removeFeaturesByAttribute(olLayer);
                    olLayer.removeAllFeatures();
                    olLayer.refresh();
                }

                if (options.featureStyle) {
                    me.setDefaultStyle(options.featureStyle);
                    for (i=0; i < features.length; i++) {
                        featureInstance = features[i];
                        featureInstance.style = me._style;
                    }
                }
                olLayer.addFeatures(features);
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
                // notify other components that features have been added
                var formatter = this._supportedFormats['GeoJSON'];
                var sandbox = this.getSandbox();
                var addEvent = sandbox.getEventBuilder('FeatureEvent')().setOpAdd();
                _.forEach(features, function (feature) {
                    var geojson = formatter.write([feature]);
                    addEvent.addFeature(feature.id, geojson, options.layerId);
                });
                sandbox.notifyAll(addEvent);

                if(options.centerTo === true){
                    var center, bounds;
                    if(geometry.type !== 'FeatureCollection') {
                        center = features[0].geometry.getCentroid();
                        bounds = features[0].geometry.getBounds();
                    } else {
                        var bottom,
                            left,
                            top,
                            right;
                        for(var f=0;f<features.length;f++) {
                            var feat = features[f];
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
         * @method setDefaultStyle
         *
         * @param {Object} styles. If not given, will set default styles
         */
        setDefaultStyle : function(styles) {
            var me = this;
            //overwriting default style if given
            if(styles) {
                if(Oskari.util.keyExists(styles, 'fill.color')) {
                    me._style.fillColor = styles.fill.color;
                }
                if(Oskari.util.keyExists(styles, 'stroke.color')) {
                    me._style.strokeColor = styles.stroke.color;
                }
                if(Oskari.util.keyExists(styles, 'stroke.width')) {
                    me._style.strokeWidth = styles.stroke.width;
                }
                if(Oskari.util.keyExists(styles, 'text.fill.color')) {
                    me._style.fontColor = styles.text.fill.color;
                }
                if(Oskari.util.keyExists(styles, 'text.stroke.color')) {
                    me._style.labelOutlineColor = styles.text.stroke.color;
                }
                if(Oskari.util.keyExists(styles, 'text.stroke.width')) {
                    me._style.getText().labelOutlineWidth = styles.text.stroke.width;
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

