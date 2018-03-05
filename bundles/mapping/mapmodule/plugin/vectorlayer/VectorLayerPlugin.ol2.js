/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 * Provides functionality to draw vector layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.VectorLayerPlugin',
    function() {
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

        this._olLayers = {};
        this._features = {};
        this._layerStyles = {};
        this._defaultStyle = {
            fill: {
                color: 'rgba(255,0,255,0.2)'
            },
            stroke: {
                color: 'rgba(0,0,0,1)',
                width: 2
            },
            image: {
                radius: 4,
                fill: {
                    color: 'rgba(0,0,0,1)'
                }
            },
            text: {
                scale: 1.3,
                fill: {
                    color: 'rgba(0,0,0,1)'
                },
                stroke: {
                    color: 'rgba(255,255,255,1)',
                    width: 2
                }
            }
        };
    }, {
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function() {
            this.getMapModule().setLayerPlugin('vectorlayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function() {
            this.getMapModule().setLayerPlugin('vectorlayer', null);
        },
        /**
         * @method _startPluginImpl
         * @private
         * Start plugin implementation
         *
         */
        _startPluginImpl: function() {
            var me = this;
            me.registerVectorFormats();
            me._createConfiguredLayers();
        },

        /**
         * @method  @private _createConfiguredLayers Create configured layers an their styles
         */
        _createConfiguredLayers: function() {
            var me = this,
                conf = me.getConfig();
            if (conf.layers) {
                var clickHandler = function(e) {
                    // clicking on map, check if feature is hit
                    if (e.target && e.target._featureId) {
                        me.__featureClicked([olLayer.getFeatureById(e.target._featureId)], olLayer);
                    }
                    return true;
                };
                for (var i = 0; i < conf.layers.length; i++) {
                    var layer = conf.layers[i];
                    var layerId = layer.id;
                    var layerStyle = layer.style;

                    if (!me._features[layerId]) {
                        me._features[layerId] = [];
                    }

                    var opacity = 100;
                    var olLayer = new OpenLayers.Layer.Vector(me._olLayerPrefix + layerId);
                    olLayer.events.register('click', this, clickHandler);
                    olLayer.events.fallThrough = true;
                    olLayer.setOpacity(opacity);

                    me._map.addLayer(olLayer);
                    me._map.setLayerIndex(
                        olLayer,
                        me._map.layers.length
                    );
                    me._olLayers[layerId] = olLayer;
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
        _createEventHandlers: function() {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function(event) {
                    me.afterMapLayerRemoveEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function(event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                }
            };
        },
        __featureClicked: function(features, olLayer) {
            var sandbox = this.getSandbox();
            var clickEvent = sandbox.getEventBuilder('FeatureEvent')().setOpClick();
            var formatter = this._supportedFormats.GeoJSON;
            var me = this;
            _.forEach(features, function(feature) {
                var geojson = JSON.parse(formatter.write([feature]));
                clickEvent.addFeature(feature.id, geojson, me._getLayerId(olLayer.name));
            });
            sandbox.notifyAll(clickEvent);
        },
        /**
         * @method preselectLayers
         * @public preselect layers
         */
        preselectLayers: function(layers) {
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
        registerVectorFormat: function(mimeType, formatImpl) {
            this._supportedFormats[mimeType] = formatImpl;
        },

        /**
         * @method registerVectorFormats
         * Registers default vector formats
         */
        registerVectorFormats: function() {
            var me = this;
            this.registerVectorFormat('application/json',
                new OpenLayers.Format.GeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function() {
                    this.read = function(data) {
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
         * @param {Oskari.mapframework.domain.VectorLayer} layer layer details OR {String} layerId
         */
        removeFeaturesFromMap: function(identifier, value, layer) {
            var me = this,
                foundFeatures,
                olLayer,
                layerId;

            if (layer && layer !== null) {
                if (layer instanceof OpenLayers.Layer.Vector) {
                    layerId = layer.id;
                } else if (_.isString(layer)) {
                    layerId = layer;
                }
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
                    this._map.removeLayer(me._olLayers[layerId]);
                    this._removeFeaturesByAttribute(olLayer);
                    delete this._olLayers[layerId];
                    delete this._features[layerId];
                }
            }
            // Removes all features from all layers if layer is not specified
            else if(!layer) {
                for (layerId in me._olLayers) {
                    if (me._olLayers.hasOwnProperty(layerId)) {
                        olLayer = me._olLayers[layerId];
                        this._removeFeaturesByAttribute(olLayer);
                        this._map.removeLayer(olLayer);
                        delete this._olLayers[layerId];
                        delete this._features[layerId];
                    }
                }
            }
        },
        _removeFeaturesByAttribute: function(olLayer, identifier, value) {
            var me = this,
                featuresToRemove = [];

            // add all features if identifier and value are missing or
            // if given -> features that have
            if (!identifier && !value) {
                featuresToRemove = olLayer.features;
            } else {
                // first try to find features by ol function
                featuresToRemove = olLayer.getFeaturesByAttribute(identifier, value);
                // if not found then check also feature data values (ol2 getFeaturesByAttribute not functionality right when features are added from GeoJSON?)
                if(featuresToRemove === null || featuresToRemove.length === 0) {
                  featuresToRemove = jQuery.grep(olLayer.features, function(f){
                      var hasData = (f.data && f.data[identifier]) ? true : false;
                      var hasWantedAttributes = (hasData && f.data[identifier] === value) ? true : false;
                      return hasWantedAttributes;
                  });
                }
            }

            // If there is no features to remove then return
            if(!featuresToRemove || featuresToRemove.length === 0) {
                return;
            }

            // notify other components of removal
            var formatter = this._supportedFormats.GeoJSON;
            var sandbox = this.getSandbox();
            var removeEvent = sandbox.getEventBuilder('FeatureEvent')().setOpRemove();

            olLayer.removeFeatures(featuresToRemove);

            featuresToRemove.forEach(function(feature) {
                // remove from "cache"
                me._removeFromCache(me._getLayerId(olLayer.name), feature);
                var geojson = JSON.parse(formatter.write([feature]));
                removeEvent.addFeature(feature.id, geojson, me._getLayerId(olLayer.name));
            });
            sandbox.notifyAll(removeEvent);
        },
        _removeFromCache : function(layerId, feature) {
            var storedFeatures = this._features[layerId];
            for (var i = 0; i < storedFeatures.length; i++) {
                var featuresInDataset = storedFeatures[i].data;
                for (var j = 0; j < featuresInDataset.length; j++) {
                    if(feature === featuresInDataset[j]) {
                        featuresInDataset.splice(j, 1);
                    }
                }
                if(!featuresInDataset.length) {
                    // remove block if empty
                    storedFeatures.splice(i, 1);
                }
            }
        },
        _getGeometryType: function(geometry) {
            if (typeof geometry === 'string' || geometry instanceof String) {
                return 'WKT';
            }
            return 'GeoJSON';
        },
        _getLayerId: function(name) {
            var index = this._olLayerPrefix.length;
            return name.substring(index);
        },
        _getOlLayer: function(layer, layerOpts) {
            var me = this;
            if(!layer || layer.getLayerType() !== 'vector') {
                return null;
            }

            if(!layerOpts) {
                layerOpts = {};
            }

            var olLayer = me._map.getLayersByName(me._olLayerPrefix + layer.getId())[0];
            if (!olLayer) {
                olLayer = new OpenLayers.Layer.Vector(me._olLayerPrefix + layer.getId());
                me._map.addLayer(olLayer);
                me._map.setLayerIndex(
                    olLayer,
                    me._map.layers.length
                );
                me._olLayers[layer.getId()] = olLayer;
                olLayer.events.fallThrough = true;
                olLayer.events.register('click', this, function(e) {
                    // clicking on map, check if feature is hit
                    if (e.target && e.target._featureId) {
                        me.__featureClicked([olLayer.getFeatureById(e.target._featureId)], olLayer);
                    }
                    return true;
                });
            }

            olLayer.setOpacity(layer.getOpacity() / 100);

            return olLayer;
        },
        /**
         * @method addFeaturesToMap
         * @public
         * Add feature on the map
         *
         * @param {Object} geometry the geometry WKT string or GeoJSON object
         * @param {Object} options additional options
         */
        addFeaturesToMap: function(geometry, options) {
            var me = this,
                olLayer,
                mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');

            options = options || {};

            // if there's no layerId provided -> Just use a generic vector layer for all.
            if (!options.layerId) {
                options.layerId = 'VECTOR';
            }
            if (!options.attributes) {
                options.attributes = {};
            }

            if(!options.layerName) {
                options.layerName = 'VECTOR';
            }

            var layer = mapLayerService.findMapLayer(options.layerId);
            if(!layer) {
                layer = Oskari.clazz.create('Oskari.mapframework.domain.VectorLayer');
                layer.setGroups([{
                    id: options.layerId,
                    name: options.layerInspireName || 'VECTOR'
                }]);
                layer.setOrganizationName(options.layerOrganizationName || 'VECTOR');
                layer.setOpacity(options.opacity || 100);
                layer.setVisible(true);
                layer.setId(options.layerId);

                if(options.layerPermissions) {
                    for(var permission in options.layerPermissions) {
                        if(options.layerPermissions.hasOwnProperty(permission)) {
                            layer.addPermission(permission, options.layerPermissions[permission]);
                        }
                    }
                }
            }

            // Update layer description and name always
            if(options.layerDescription) {
                layer.setDescription(options.layerDescription);
            }
            layer.setName(options.layerName || 'VECTOR');
            if(mapLayerService.findMapLayer(options.layerId)) {
                mapLayerService.updateLayer(options.layerId, layer);
            }


            olLayer = me._getOlLayer(layer);
            if(!olLayer) {
                return;
            }

            if (options.clearPrevious === true) {
                olLayer.removeAllFeatures();
                olLayer.refresh();
                me._features[options.layerId] = [];
            }

            var geometryType = me._getGeometryType(geometry),
                format = me._supportedFormats[geometryType],
                featureInstance,
                styleMap = new OpenLayers.StyleMap();

            if (!format || !geometry) {
                return;
            }
            if (geometryType === 'GeoJSON' && !me.getMapModule().isValidGeoJson(geometry)) {
                return;
            }

            if (!me._features[options.layerId]) {
                me._features[options.layerId] = [];
            }
            var features = format.read(geometry);
            if (options.attributes && options.attributes !== null) {
                if (features instanceof Array && geometryType === 'GeoJSON') {
                    // Remark: It is preferred to use GeoJSON properties for attributes
                    // There could be many features in GeoJson and now attributes are set only for 1st feature
                    features[0].attributes = options.attributes;
                } else {
                    features.attributes = options.attributes;
                }
            }
            if (!Array.isArray(features)) {
                features = [features];
            }

            //set feature styles. For attribute dependent styles (=label text from property) we gotta use styleMap
            for (i = 0; i < features.length; i++) {
                featureInstance = features[i];
                styleMap.styles["default"] = new OpenLayers.Style(me.getStyle(options, features[i]));
                featureInstance.style = styleMap.createSymbolizer(featureInstance, "default");
            }

            if (options.cursor) {
                for (i = 0; i < features.length; i++) {
                    featureInstance = features[i];
                    if (featureInstance.style) {
                        featureInstance.style.cursor = options.cursor;
                    } else {
                        featureInstance.style = {
                            cursor: options.cursor
                        };
                    }
                }
            }

            // prio handling
            var prio = options.prio || 0;
            me._features[options.layerId].push({
                data: features,
                prio: prio
            });

            if (options.prio && !isNaN(options.prio)) {
                olLayer.removeAllFeatures();
                olLayer.refresh();

                me._features[options.layerId].sort(function(a, b) {
                    return b.prio - a.prio;
                });

                _.forEach(me._features[options.layerId], function(featObj) {
                    olLayer.addFeatures(featObj.data);
                });
            } else {
                olLayer.addFeatures(features);
            }

            // notify other components that features have been added
            var formatter = this._supportedFormats.GeoJSON;
            var sandbox = this.getSandbox();
            var addEvent = sandbox.getEventBuilder('FeatureEvent')().setOpAdd();
            _.forEach(features, function(feature) {
                var geojson = JSON.parse(formatter.write([feature]));
                addEvent.addFeature(feature.id, geojson, options.layerId);
            });
            sandbox.notifyAll(addEvent);

            if (options.centerTo === true) {
                var center, bounds;
                if (geometry.type !== 'FeatureCollection') {
                    center = features[0].geometry.getCentroid();
                    bounds = features[0].geometry.getBounds();
                } else {
                    var bottom,
                        left,
                        top,
                        right;
                    for (var f = 0; f < features.length; f++) {
                        var feat = features[f];
                        var featBounds = feat.geometry.getBounds();
                        if (!bottom || featBounds.bottom < bottom) {
                            bottom = featBounds.bottom;
                        }
                        if (!left || featBounds.left < left) {
                            left = featBounds.left;
                        }
                        if (!top || featBounds.top > top) {
                            top = featBounds.top;
                        }
                        if (!right || featBounds.right > right) {
                            right = featBounds.right;
                        }
                    }
                    bounds = new OpenLayers.Bounds();
                    bounds.extend(new OpenLayers.LonLat(left, bottom));
                    bounds.extend(new OpenLayers.LonLat(right, top));
                    center = new OpenLayers.LonLat((right - ((right - left) / 2)), (top - ((top - bottom) / 2)));
                }

                mapmoveRequest = Oskari.requestBuilder('MapMoveRequest')(center.x, center.y, bounds);
                me._sandbox.request(me, mapmoveRequest);

                // Check scale if defined so. Scale decreases when the map is zoomed in. Scale increases when the map is zoomed out.
                if (options.minScale) {
                    var currentScale = this.getMapModule().getMapScale();
                    if (currentScale < options.minScale) {
                        this.getMapModule().zoomToScale(options.minScale, true);
                    }
                }
            }

            if(options.showLayer) {
                if(!mapLayerService.findMapLayer(options.layerId)) {
                    mapLayerService.addLayer(layer);
                }
                if(!me._sandbox.findMapLayerFromSelectedMapLayers(options.layerId)) {
                    var request = Oskari.requestBuilder('AddMapLayerRequest')(layer.getId());
                    me._sandbox.request(me, request);
                }
                // not too sure about this logic and if we can assume AddMapLayerRequest is sync
                olLayer.display(!!me._sandbox.findMapLayerFromSelectedMapLayers(options.layerId) && layer.isVisible());
            }
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
        getStyle: function(options, feature) {
            var me = this,
                optionalStyle = null;

            var styles = options.featureStyle || me._layerStyles[options.layerId] || {};

            // overriding default style with feature/layer style
            var styleDef = jQuery.extend({}, this._defaultStyle, styles);

            if(feature && options.optionalStyles) {
                optionalStyle = me.getOptionalStyle(options.optionalStyles, styleDef, feature);
            }
            return optionalStyle ? optionalStyle : me.getMapModule().getStyle(styleDef);
        },
        /**
         * @method getOptionalStyle
         * Returns a style, if style property value matches to any of feature property values
         * @param {Object} optional style
         * @param {Object} default style
         * @param {Object} feature properties
         * @return
         * */
        getOptionalStyle: function(optionalStyles, defStyle, feature) {
            var me = this;
            for (var i in optionalStyles) {
                if (optionalStyles[i].hasOwnProperty('property') && feature.data) {
                    // check feature property  values and take style, if there is match case
                    var property = optionalStyles[i].property;
                    if (property.hasOwnProperty('key') && property.hasOwnProperty('value') && feature.data.hasOwnProperty(property.key)) {
                        if (property.value === feature.data[property.key]) {
                            // overriding default style with feature style
                            var styleOpt = jQuery.extend({}, defStyle, optionalStyles[i]);
                            return me.getMapModule().getStyle(styleOpt);
                        }
                    }
                }
            }

        },
        /**
         * @method _createRequestHandlers
         * @private
         * Create request handlers.
         */
        _createRequestHandlers: function() {
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
        addMapLayerToMap: function(layer, keepLayerOnTop) {
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

            var openLayer = me._getOlLayer(layer, layerOpts);
            if(!openLayer) {
                return;
            }

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
        afterMapLayerRemoveEvent: function(event) {
            var layer = event.getMapLayer();

            this.removeMapLayerFromMap(layer);
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent} event
         */
        _afterChangeMapLayerOpacityEvent: function(event) {
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
        removeMapLayerFromMap: function(layer) {
            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }

            var me = this,
                remLayer = this.getMap().getLayersByName(me._olLayerPrefix + layer.getId());

            // This should free all memory
            if (remLayer[0]) {
                remLayer[0].destroy();
            }
        },
        /**
         * @method getOLMapLayers
         * Get OpenLayers map layers.
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        getOLMapLayers: function(layer) {
            if (!layer.isLayerOfType('VECTOR')) {
                return;
            }
            var ol = this.getLayerById(layer.getId());
            if (!ol) {
                return null;
            }
            // only single layer/id, wrap it in an array
            return [ol];
        },
        getLayerById: function(id) {
            if (!id) {
                return null;
            }
            var layers = this.getMap().getLayersByName(this._olLayerPrefix + id);
            if (!layers || !layers.length) {
                return null;
            }
            // should have only one, return always the first one
            return layers[0];
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