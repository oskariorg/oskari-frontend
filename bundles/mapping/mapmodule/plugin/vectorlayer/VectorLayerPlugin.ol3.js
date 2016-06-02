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
        this._nextVectorId = 0;
        this._nextFeatureId = 0;
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
                },
                offsetX: 55,
                offsetY: 10
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
                for (var i = 0; i < conf.layers.length; i++) {
                    var layer = conf.layers[i];
                    var layerId = layer.id;
                    var layerStyle = layer.style;

                    if (!me._features[layerId]) {
                        me._features[layerId] = [];
                    }

                    var opacity = 100;
                    var vectorSource = new ol.source.Vector();
                    var olLayer = new ol.layer.Vector({
                        name: me._olLayerPrefix + layerId,
                        id: layerId,
                        source: vectorSource
                    });

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
        _createEventHandlers: function() {
            var me = this;

            return {
                MapClickedEvent: function(event) {
                    me.__mapClick(event);
                },
                AfterMapLayerRemoveEvent: function(event) {
                    me.afterMapLayerRemoveEvent(event);
                }
            };
        },
        /**
         * Find features from layers controlled by vectorlayerplugin and handle clicks for all those features
         * @param  {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event [description]
         */
        __mapClick: function(event) {
            var me = this;
            var features = [];
            this.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], function(feature, layer) {
                _.forEach(me._layers, function(vectorlayer, id) {
                    if (vectorlayer === layer) {
                        features.push({
                            feature: feature,
                            layerId: id
                        });
                        return true;
                    }
                });
            });
            me.__featureClicked(features);
        },
        __featureClicked: function(features) {
            if (!features || !features.length) {
                return;
            }
            var sandbox = this.getSandbox();
            var clickEvent = sandbox.getEventBuilder('FeatureEvent')().setOpClick();
            var formatter = this._supportedFormats['GeoJSON'];
            _.forEach(features, function(obj) {
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
                new ol.format.GeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function() {
                    this.read = function(data) {
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
         * @param {ol.layer.Vector} layer object OR {String} layerId
         */
        removeFeaturesFromMap: function(identifier, value, layer) {
            var me = this,
                olLayer,
                layerId;
            if (layer && layer !== null) {
                if (layer instanceof ol.layer.Vector) {
                    layerId = layer.get('id');
                } else if (_.isString(layer) || _.isNumber(layer)) {
                    layerId = layer;
                }
                olLayer = me._layers[layerId];

                if (!olLayer) {
                    return;
                }
            }
            if (olLayer) {
                // Removes only wanted features from the given maplayer
                if (identifier && identifier !== null && value && value !== null) {
                    me._removeFeaturesByAttribute(olLayer, identifier, value);
                }
                //remove all features from the given layer
                else {
                    this._map.removeLayer(olLayer);
                    delete this._layers[layerId];
                    delete this._features[layerId];
                }
            }
            // Removes all features from all layers
            else {
                for (var layerId in me._layers) {
                    if (me._layers.hasOwnProperty(layerId)) {
                        olLayer = me._layers[layerId];
                        this._map.removeLayer(olLayer);
                        delete this._layers[layerId];
                        delete this._features[layerId];
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
                // remove from "cache"
                this._removeFromCache(olLayer.get('id'), feature);
                var geojson = formatter.writeFeaturesObject([feature]);
                removeEvent.addFeature(feature.getId(), geojson, olLayer.get('id'));
            }
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
                geometryType = me._getGeometryType(geometry),
                format = me._supportedFormats[geometryType],
                layer,
                vectorSource,
                mapLayerService = me._sandbox.getService('Oskari.mapframework.service.MapLayerService');

            if (!format || !geometry) {
                return;
            }

            if (geometryType === 'GeoJSON' && !me.getMapModule().isValidGeoJson(geometry)) {
                return;
            }

            options = options || {};
            // if there's no layerId provided -> Just use a generic vector layer for all.
            if (!options.layerId) {
                options.layerId = 'VECTOR';
            };
            if (!options.attributes) {
                options.attributes = {};
            }
            if (!me._features[options.layerId]) {
                me._features[options.layerId] = [];
            }

            var features = format.readFeatures(geometry);
            //add cursor if defined so
            if (options.cursor) {

                options.attributes['oskari-cursor'] = options.cursor;

                // Add pointer move if not added already
                if (!me._pointerMoveAdded) {
                    me._map.on('pointermove', function(evt) {
                        var target = me._map.getTarget();
                        var jTarget = typeof target === "string" ? jQuery("#" + target) : jQuery(target);
                        var originalCursor = me.getMapModule().getCursorStyle();
                        var hit = this.forEachFeatureAtPixel(evt.pixel,
                            function(feature, layer) {
                                if (feature.getProperties()['oskari-cursor']) {
                                    cursor = feature.getProperties()['oskari-cursor'];
                                }
                                return true;
                            });

                        if (hit && cursor) {
                            jTarget.css('cursor', cursor);
                        } else {
                            jTarget.css('cursor', originalCursor);
                        }
                    });
                    me._pointerMoveAdded = true;
                }
            }


            if (options.attributes && options.attributes !== null && features instanceof Array && features.length) {
                features[0].setProperties(options.attributes);
            }
            _.forEach(features, function(feature) {
                if (!feature.getId() && !feature.get('id')) {
                    var id = 'F' + me._nextFeatureId++;
                    feature.setId(id);
                    //setting id using set(key, value) to make id-property asking by get('id') possible
                    feature.set("id", id);
                }
            });

            var prio = options.prio || 0;

            _.forEach(features, function(feature) {
                me.setupFeatureStyle(options, feature);
            });

            if (!me._features[options.layerId]) {
                me._features[options.layerId] = [];
            }
            //check if layer is already on map
            if (me._layers[options.layerId]) {
                layer = me._layers[options.layerId];
                vectorSource = layer.getSource();

                //layer is already on map
                //clear old features if defined so
                if (options.clearPrevious === true) {
                    vectorSource.clear();
                    me._features[options.layerId] = [];
                }

                // prio handling
                me._features[options.layerId].push({
                    data: features,
                    prio: prio
                });

                if (options.prio && !isNaN(options.prio)) {
                    vectorSource.clear();

                    me._features[options.layerId].sort(function(a, b) {
                        return b.prio - a.prio;
                    });
                    var zIndex = 0;
                    _.forEach(me._features[options.layerId], function(featObj) {
                        _.forEach(featObj.data, function(feature) {
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
                layer = new ol.layer.Vector({
                    name: me._olLayerPrefix + options.layerId,
                    id: options.layerId,
                    source: vectorSource
                });
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
            var errorEvent = sandbox.getEventBuilder('FeatureEvent')().setOpError('feature has no geometry');

            _.forEach(features, function(feature) {
                var geojson = formatter.writeFeaturesObject([feature]);
                var event = addEvent;
                if (!feature.getGeometry()) {
                    event = errorEvent;
                }
                event.addFeature(feature.getId(), geojson, layer.get('id'));
            });
            if (errorEvent.hasFeatures()) {
                sandbox.notifyAll(errorEvent);
            }
            if (addEvent.hasFeatures()) {
                sandbox.notifyAll(addEvent);
            }
            // re-position map when opted
            if (options.centerTo === true) {
                var extent = vectorSource.getExtent();
                me.getMapModule().zoomToExtent(extent);

                // Check scale if defined so. Scale decreases when the map is zoomed in. Scale increases when the map is zoomed out.
                if (options.minScale) {
                    var currentScale = this.getMapModule().getMapScale();
                    if (currentScale < options.minScale) {
                        this.getMapModule().zoomToScale(options.minScale, true);
                    }
                }
            }
        },
        /* _isValidGeometry: function(geometry) {
              var wktFormat = new ol.format.WKT();
              if(wktFormat.writeGeometry(geometry)) {
                 return true;
              } else {
                 return false;
              }
         },*/
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
                ),
                'MapModulePlugin.ZoomToFeaturesRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.ZoomToFeaturesRequestHandler',
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
            return;
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
         * @method removeMapLayerFromMap
         * Remove map layer from map.
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer
         */
        removeMapLayerFromMap: function(layer) {
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
        getOLMapLayers: function(layer) {
            if (!layer.isLayerOfType('VECTOR')) {
                return null;
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
            return this._layers[id];
        },
        /**
         * Possible workaround for arranging the feature draw order within a layer
         *
         */
        rearrangeFeatures: function() {
            var me = this,
                layers = me.layers;
            for (key in layers) {
                if (layers[key].features.length > 0) {
                    var layer = layers[key];
                    var features = layer.features;
                    features.sort(function(a, b) {
                        if (a.config !== undefined) {
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
            var style = this.getStyle(options, feature);
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
        getStyle: function(options, feature) {
            var me = this,
                optionalStyle = null;
            var styles = options.featureStyle || me._layerStyles[options.layerId] || {};

            // overriding default style with feature/layer style
            var styleDef = jQuery.extend({}, this._defaultStyle, styles);
            // Optional styles based on property values
            if (feature && options.optionalStyles) {
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
                if (optionalStyles[i].hasOwnProperty('property') && feature.getProperties()) {
                    // check feature property  values and take style, if there is match case
                    var property = optionalStyles[i]['property'];
                    if (property.hasOwnProperty('key') && property.hasOwnProperty('value') && feature.getProperties().hasOwnProperty(property.key)) {
                        if (property.value === feature.getProperties()[property.key]) {
                            // overriding default style with feature style
                            var styleOpt = jQuery.extend({}, defStyle, optionalStyles[i]);
                            return me.getMapModule().getStyle(styleOpt);
                        }
                    }
                }
            }

        },
        /**
         * @method zoomToFeatures
         *  - zooms to features
         * @param {Object} layer
         * @param {Object} options
         */
        zoomToFeatures: function(layer, options) {
            var me = this,
                layers = me.getLayerIds(layer);
            features = me.getFeaturesMatchingQuery(layers, options);
            if (!_.isEmpty(features)) {
                var vector = new ol.source.Vector({
                    features: features
                });
                var extent = vector.getExtent();
                extent = me.getBufferedExtent(extent, 35);
                me.getMapModule().zoomToExtent(extent);
            }
            me.sendZoomFeatureEvent(features);
        },
        /**
         * @method getBufferedExtent
         * -  gets buffered extent
         * @param {ol.Extent} extent
         * @param {Number} percentage
         * @return {ol.Extent} extent
         */
        getBufferedExtent: function(extent, percentage) {
            var me = this,
                line = new ol.geom.LineString([
                    [extent[0], extent[1]],
                    [extent[2], extent[3]]
                ]),
                buffer = line.getLength() * percentage / 100;
            if (buffer === 0) {
                return extent;
            }
            var geometry = ol.geom.Polygon.fromExtent(extent),
                reader = new jsts.io.WKTReader(),
                wktFormat = new ol.format.WKT(),
                wktFormatString = wktFormat.writeGeometry(geometry),
                input = reader.read(wktFormatString),
                bufferGeometry = input.buffer(buffer),
                parser = new jsts.io.olParser();
            bufferGeometry.CLASS_NAME = "jsts.geom.Polygon";
            bufferGeometry = parser.write(bufferGeometry);
            return bufferGeometry.getExtent();
        },
        /**
         * @method sendZoomFeatureEvent
         *  - sends FeatureEvent with the zoom operation
         * @param {Array} features
         */
        sendZoomFeatureEvent: function(features) {
            var me = this,
                featureEvent = me._sandbox.getEventBuilder('FeatureEvent')().setOpZoom();
            if (!_.isEmpty(features)) {
                var formatter = me._supportedFormats['GeoJSON'];
                _.each(features, function(feature) {
                    var geojson = formatter.writeFeaturesObject([feature]);
                    featureEvent.addFeature(feature.getId(), geojson, feature.layerId);
                });
            }
            me._sandbox.notifyAll(featureEvent);
        },
        /**
         * @method sendZoomFeatureEvent
         *  - sends FeatureEvent with the error operation and error message if given
         * @param {Array} features
         */
        sendErrorFeatureEvent: function(msg) {
            var me = this,
                featureEvent = me._sandbox.getEventBuilder('FeatureEvent')().setOpError(msg);
            me._sandbox.notifyAll(featureEvent);
        },
        /**
         * @method getFeaturesMatchingQuery
         *  - gets features matching query
         * @param {Array} layers, object like {layer: ['layer1', 'layer2']}
         * @param {Object} featureQuery and object like { "id" : [123, "myvalue"] }
         */
        getFeaturesMatchingQuery: function(layers, featureQuery) {
            var me = this,
                features = [];
            _.each(layers, function(layerId) {
                if (!me._layers[layerId]) {
                    // invalid layerId
                    return;
                }
                var sourceFeatures = me._layers[layerId].getSource().getFeatures();
                if (_.isEmpty(featureQuery)) {
                    // no query requirements, add all features in layer
                    features = features.concat(sourceFeatures);
                    return;
                }
                _.each(sourceFeatures, function(feature) {
                    feature.layerId = layerId;
                    _.each(featureQuery, function(allowedValues, requestedProperty) {
                        var featureValue = feature.get(requestedProperty);
                        if (!featureValue) {
                            // feature doesn't have the property, don't include it
                            return;
                        }
                        _.each(allowedValues, function(value) {
                            if (featureValue === value) {
                                features.push(feature);
                            }
                        });
                    });
                });
            });
            return features;
        },
        /**
         * @method getLayerIds
         *  -
         * @param {Object} layerIds
         * @return {Array} layres
         */
        getLayerIds: function(layerIds) {
            var me = this,
                layers = [];
            if (_.isEmpty(layerIds)) {
                _.each(me._layers, function(key, value) {
                    layers.push(value);
                });
            } else {
                _.each(layerIds.layer, function(key, value) {
                    layers.push(key);
                });
            }
            return layers;
        },
        /**
         * @method getLayerFeatures
         *  - gets layer's features as geojson object
         * @param {String} id
         * @return {Object} geojson
         */
        getLayerFeatures: function(id) {
            var me = this;
            var features = me._layers[id].getSource().getFeatures();
            var formatter = me._supportedFormats['GeoJSON'];

            var geojson = formatter.writeFeaturesObject(features);
            return geojson;
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