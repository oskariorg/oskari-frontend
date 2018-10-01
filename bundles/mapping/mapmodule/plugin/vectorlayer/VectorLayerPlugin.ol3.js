import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olOverlay from 'ol/Overlay';
import {fromExtent} from 'ol/geom/Polygon';
import olFormatWKT from 'ol/format/WKT';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import jstsOL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import {BufferOp} from 'jsts/org/locationtech/jts/operation/buffer';
import * as olGeom from 'ol/geom';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';

const olParser = new jstsOL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 * Provides functionality to draw vector layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.VectorLayerPlugin',
    function() {
        this._features = {};
        this._olLayers = {};
        this._oskariLayers = {};
        this._supportedFormats = {};
        this._olLayerPrefix = "vectorlayer_";
        this._featureStyles = {};
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
        this._nextFeatureId = 0;
        this._hoverOverlay = undefined;
        this._hoverFeature = undefined;
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
            me._createHoverOverlay();
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
                    var vectorSource = new olSourceVector();
                    var olLayer = new olLayerVector({
                        name: me._olLayerPrefix + layerId,
                        id: layerId,
                        source: vectorSource
                    });

                    olLayer.setOpacity(opacity);

                    me._map.addLayer(olLayer);
                    me.raiseVectorLayer(olLayer);
                    me._olLayers[layerId] = olLayer;
                    me._layerStyles[layerId] = layerStyle;
                }
            }
        },

        _createHoverOverlay: function () {
            var overlayDiv = document.createElement('div');
            overlayDiv.className = 'feature-hover-overlay';
            this._hoverOverlay = new olOverlay({
                element: overlayDiv
            });
            this._map.addOverlay(this._hoverOverlay);
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
                },
                AfterChangeMapLayerOpacityEvent: function(event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                },
                MouseHoverEvent: function (event) {
                    me._mapHover(event);
                }
            };
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

            me.handleLayerOpacity(layer, (layer.getOpacity() / 100), true);
        },
        /**
         * Find features from layers controlled by vectorlayerplugin and handle clicks for all those features
         * @param  {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event [description]
         */
        __mapClick: function(event) {
            var me = this;
            var features = [];
            this.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], function(feature, layer) {
                _.forEach(me._olLayers, function(vectorlayer, id) {
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
            var formatter = this._supportedFormats.GeoJSON;
            _.forEach(features, function(obj) {
                var geojson = formatter.writeFeaturesObject([obj.feature]);
                clickEvent.addFeature(obj.feature.getId(), geojson, obj.layerId);
            });
            sandbox.notifyAll(clickEvent);
        },
        _mapHover: function (event) {
            var me = this;
            var showTooltip = false;
            var cursor;
            var mapDiv = me._map.getTarget();
            mapDiv = typeof mapDiv === 'string' ? jQuery('#' + mapDiv) : jQuery(mapDiv);

            var hit = me.getMap().forEachFeatureAtPixel([event.getPageX(), event.getPageY()], function (feature, layer) {
                // Remove highlighting from the previously hovered feature
                if (me._hoverFeature && me._hoverFeature !== feature) {
                    me._applyOriginalStyle(me._hoverFeature);
                }
                var hover = feature.getProperties()['hover'];
                if (hover) {
                    // Highlight hovered feature
                    if (hover.style) {
                        me._applyHoverStyle(feature, hover.style);
                    }
                    // Update tooltip's position and content
                    if (hover.content) {
                        var margin = 20;
                        var tooltip = jQuery(me._hoverOverlay.getElement());
                        var positioningY = event.getPageY() > (tooltip.outerHeight() || 100) + margin ? 'bottom' : 'top';
                        var positioningX = event.getPageX() + (tooltip.outerWidth() || 200) + margin < mapDiv.width() ? 'left' : 'right';
                        var positioning = positioningY + '-' + positioningX;
                        me._hoverOverlay.setPositioning(positioning);
                        me._hoverOverlay.setPosition([event.getLon(), event.getLat()]);
                        tooltip.html(hover.content);
                        showTooltip = true;
                    }
                }
                me._hoverFeature = feature;
                cursor = feature.getProperties()['oskari-cursor'];
                return true;
            });
            if (!hit && me._hoverFeature) {
                // Remove feature highlighting
                me._applyOriginalStyle(me._hoverFeature);
                me._hoverFeature = null;
            }

            // Set tooltip's visibility
            me._hoverOverlay.getElement().style.display = showTooltip ? '' : 'none';

            // Update map cursor
            if (cursor) {
                mapDiv.css('cursor', cursor);
            } else {
                mapDiv.css('cursor', me.getMapModule().getCursorStyle());
            }
        },
        /**
         * @method _applyHoverStyle
         * 
         * Changes feature's style and preserves the original style to go back to.
         * 
         * @param {Object} feature ol3 feature
         * @param {Object} hoverStyle Oskari style object
         */
        _applyHoverStyle: function (feature, hoverStyle) {
            if (!feature.get('hoverStyleOn')) {
                if (!feature.get('olStyle')) {
                    // Preserve origial style
                    feature.set('olStyle', feature.getStyle());
                }
                var olHoverStyle = feature.get('hoverStyle');
                if (!olHoverStyle) {
                    // Create ol style object for hover
                    if (hoverStyle.inherit) {
                        var ftrStyle = feature.get('oskariStyle') || {};
                        hoverStyle = jQuery.extend(true, {}, ftrStyle, hoverStyle);
                    }
                    olHoverStyle = this.getMapModule().getStyle(hoverStyle);
                    olHoverStyle.setZIndex(10000);
                    feature.set('hoverStyle', olHoverStyle);
                }
                feature.setStyle(olHoverStyle);
                feature.set('hoverStyleOn', true);
            }
        },
        /**
         * @method _applyHoverStyle
         * 
         * Switch back to the original style.
         * 
         * @param {Object} feature ol3 feature
         */
        _applyOriginalStyle: function (feature) {
            var style = feature.get('olStyle');
            if (style) {
                feature.setStyle(style);
                feature.set('hoverStyleOn', false);
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
                new olFormatGeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function() {
                    this.read = function(data) {
                        return data;
                    };
                }
            );
            me.registerVectorFormat('GeoJSON', new olFormatGeoJSON());
            me.registerVectorFormat('WKT', new olFormatWKT({}));
        },
        /**
         * @method removeFeaturesFromMap
         * @public
         * Removes all/selected features from map.
         *
         * @param {String} identifier the feature attribute identifier
         * @param {String} value the feature identifier value
         * @param {ol/layer/Vector} layer object OR {String} layerId
         */
        removeFeaturesFromMap: function(identifier, value, layer) {
            var me = this,
                olLayer,
                layerId;
            if (layer && layer !== null) {
                if (layer instanceof olLayerVector) {
                    layerId = layer.get('id');
                } else if (_.isString(layer) || _.isNumber(layer)) {
                    layerId = layer;
                }
                olLayer = me._olLayers[layerId];

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
                    this._removeFeaturesByAttribute(olLayer);
                    delete this._features[layerId];
                }
            }
            // Removes all features from all layers if layer is not specified
            else if(!layer) {
                for (layerId in me._olLayers) {
                    if (me._olLayers.hasOwnProperty(layerId)) {
                        olLayer = me._olLayers[layerId];
                        this._removeFeaturesByAttribute(olLayer);
                        delete this._features[layerId];
                    }
                }
            }
        },
        _removeFeaturesByAttribute: function(olLayer, identifier, value) {
            var me = this,
                source = olLayer.getSource(),
                featuresToRemove = [];

            // add all features if identifier and value are missing or
            // if given -> features that have
            source.forEachFeature(function(feature) {
                if ((!identifier && !value) ||
                    feature.get(identifier) === value) {
                    featuresToRemove.push(feature);
                }
            });

            // If there is no features to remove then return
            if(featuresToRemove.length === 0) {
                return;
            }

            // notify other components of removal
            var formatter = this._supportedFormats.GeoJSON;
            var sandbox = this.getSandbox();
            var removeEvent = sandbox.getEventBuilder('FeatureEvent')().setOpRemove();

            featuresToRemove.forEach(function(feature) {
                source.removeFeature(feature);
                // remove from "cache"
                me._removeFromCache(olLayer.get('id'), feature);
                var geojson = formatter.writeFeaturesObject([feature]);
                removeEvent.addFeature(feature.getId(), geojson, olLayer.get('id'));
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

        _getOlLayer: function (layer) {
            var me = this;
            if(!layer || layer.getLayerType() !== 'vector') {
                return null;
            }

            var olLayer = me._olLayers[layer.getId()];
            if(!olLayer) {
                olLayer = new olLayerVector({
                    name: me._olLayerPrefix + layer.getId(),
                    id: layer.getId(),
                    source: new olSourceVector()
                });
                me._olLayers[layer.getId()] = olLayer;
                me._map.addLayer(olLayer);
                me.raiseVectorLayer(olLayer);
            }
            olLayer.setOpacity(layer.getOpacity() / 100);
            return olLayer;
        },

        /**
         * Handles layer opacity.
         * @param  {Oskari.mapframework.domain.VectorLayer} layer
         * @param  {Double} opacity
         */
        handleLayerOpacity: function(layer, opacity) {
            var me = this;
            var features = null;
            var olLayer = me._olLayers[layer.getId()];
            if(olLayer) {
                olLayer.setOpacity(opacity);
            }
        },
        /**
         * @method _findOskariLayer
         * @private
         * 
         * Returns cached Oskari layer by id.
         * 
         * @param {String} id layer id
         * @return {Oskari.mapframework.domain.VectorLayer} layer object
         */
        _findOskariLayer: function (id) {
            var layer = this._oskariLayers[id];
            if (!layer) {
                var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
                layer = mapLayerService.findMapLayer(id);
                if (layer && layer.getLayerType() !== 'vector') {
                    return null;
                }
            }
            return layer;
        },
        /**
         * @method prepareVectorLayer
         * @public
         * 
         * Creates a new layer or updates an existing one if found by options.layerId.
         *
         * @param {Object} options layer properties
         * @return {Oskari.mapframework.domain.VectorLayer} layer object
         */
        prepareVectorLayer: function (options) {
            options = options || {};
            var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if (!options.layerId) {
                options.layerId = 'VECTOR';
            }
            var layer = this._findOskariLayer(options.layerId);
            if (!layer) {
                layer = Oskari.clazz.create('Oskari.mapframework.domain.VectorLayer');
                layer.setId(options.layerId);
                layer.setName(options.layerName || 'VECTOR');
                layer.setGroups([{
                    id: options.layerId,
                    name: options.layerInspireName || 'VECTOR'
                }]);
                layer.setOrganizationName(options.layerOrganizationName || 'VECTOR');
                layer.setDescription(options.layerDescription);
                if (typeof options.opacity !== 'undefined') {
                    layer.setOpacity(options.opacity);
                }
                layer.setVisible(true);
                layer.setHoverOptions(options.hover);

                if (options.layerPermissions) {
                    for (var permission in options.layerPermissions) {
                        if (options.layerPermissions.hasOwnProperty(permission)) {
                            layer.addPermission(permission, options.layerPermissions[permission]);
                        }
                    }
                }
                this._getOlLayer(layer);
                this._oskariLayers[layer.getId()] = layer;
            } else if (this._containsLayerOptions(options)) {
                layer = this._updateVectorLayer(layer, options);
            }

            if (options.showLayer) {
                // Show layer in layer selector
                if (!mapLayerService.findMapLayer(layer.getId())) {
                    mapLayerService.addLayer(layer);
                }
                if (!this._sandbox.findMapLayerFromSelectedMapLayers(layer.getId())) {
                    var request = Oskari.requestBuilder('AddMapLayerRequest')(layer.getId());
                    this._sandbox.request(this, request);
                }
            }

            return layer;
        },
        /**
         * @method _updateVectorLayer
         * @private
         * 
         * Updates layer properties
         *
         * @param {Oskari.mapframework.domain.VectorLayer} layer layer to update
         * @param {Object} options update properties
         * @return {Oskari.mapframework.domain.VectorLayer} layer object
         */
        _updateVectorLayer: function (layer, options) {
            if (layer && options) {
                var mapLayerService = this._sandbox.getService('Oskari.mapframework.service.MapLayerService');
                if (options.layerName) {
                    layer.setName(options.layerName);
                }
                if (options.layerOrganizationName) {
                    layer.setOrganizationName(options.layerOrganizationName);
                }
                if (typeof options.opacity !== 'undefined') {
                    layer.setOpacity(options.opacity);
                    // Apply changes to ol layer
                    this._getOlLayer(layer);
                }
                if (options.hover) {
                    layer.setHoverOptions(options.hover);
                }
                if (options.layerDescription) {
                    layer.setDescription(options.layerDescription);
                }
                var lyrInService = mapLayerService.findMapLayer(layer.getId());
                if (lyrInService) {
                    // Send layer updated notification
                    var evt = Oskari.eventBuilder('MapLayerEvent')(layer.getId(), 'update');
                    this._sandbox.notifyAll(evt);
                }
            }
            return layer;
        },
        /**
         * @method _containsLayerOptions
         * @private
         * Check if options contains layer specific settings.
         * 
         * @return {boolean} true if options contains layer specific settings
         */
        _containsLayerOptions: function (options) {
            return options && !!(options.layerName ||
            options.layerOrganizationName ||
            typeof options.opacity !== 'undefined' ||
            options.hover ||
            options.layerDescription ||
            typeof options.showLayer !== 'undefined');
        },
        /**
         * @method addFeaturesToMap
         * @public
         * Add feature on the map
         *
         * @param {Object} geometry the geometry WKT string or GeoJSON object
         * @param {Object} options additional options
         */
        addFeaturesToMap: function (geometry, options) {
            var me = this;
            var geometryType = me._getGeometryType(geometry);
            var format = me._supportedFormats[geometryType];
            var olLayer;
            var layer;
            var vectorSource;

            options = options || {};
            // if there's no layerId provided -> Just use a generic vector layer for all.
            if (!options.layerId) {
                options.layerId = 'VECTOR';
            }
            if (!options.attributes) {
                options.attributes = {};
            }
            if (!me._features[options.layerId]) {
                me._features[options.layerId] = [];
            }

            layer = me.prepareVectorLayer(options);

            if (!me.getMapModule().isValidGeoJson(geometry) && typeof geometry === 'object') {
                for (var key in geometry) {
                    me._updateFeature(options, key, geometry[key]);
                }
                return;
            }

            if (!format || !geometry) {
                return;
            }

            if (geometryType === 'GeoJSON' && !me.getMapModule().isValidGeoJson(geometry)) {
                return;
            }
            var features = format.readFeatures(geometry);
            // add cursor if defined so
            if (options.cursor) {
                options.attributes['oskari-cursor'] = options.cursor;
            }

            if (options.attributes && options.attributes !== null && features instanceof Array && features.length) {
                features.forEach(function (ftr) {
                    ftr.setProperties(options.attributes);
                });
            }
            features.forEach(function (feature) {
                if (typeof feature.getId() === 'undefined' && typeof feature.get('id') === 'undefined') {
                    var id = 'F' + me._nextFeatureId++;
                    feature.setId(id);
                    // setting id using set(key, value) to make id-property asking by get('id') possible
                    feature.set('id', id);
                }
                me.setupFeatureStyle(options, feature, false);
                me.setupFeatureHover(layer, feature);
            });

            olLayer = me._getOlLayer(layer);
            vectorSource = olLayer.getSource();

            // clear old features if defined so
            if (options.clearPrevious === true) {
                vectorSource.clear();
                me._features[options.layerId] = [];
            }
            // prio handling
            var prio = options.prio || 0;
            me._features[options.layerId].push({
                data: features,
                prio: prio
            });

            if (options.prio && !isNaN(options.prio)) {
                // clear any features since we are re-adding the same features sorted by priority
                vectorSource.clear();
                me._features[options.layerId].sort(function (a, b) {
                    return b.prio - a.prio;
                });
                var zIndex = 0;
                me._features[options.layerId].forEach(function (featObj) {
                    featObj.data.forEach(function (feature) {
                        feature.getStyle().setZIndex(zIndex);
                        vectorSource.addFeature(feature);
                        zIndex++;
                    });
                });
            } else {
                vectorSource.addFeatures(features);
            }

            // notify other components that features have been added
            var formatter = this._supportedFormats.GeoJSON;
            var sandbox = this.getSandbox();
            var addEvent = Oskari.eventBuilder('FeatureEvent')().setOpAdd();
            var errorEvent = Oskari.eventBuilder('FeatureEvent')().setOpError('feature has no geometry');

            features.forEach(function (feature) {
                var geojson = formatter.writeFeaturesObject([feature]);
                var event = addEvent;
                if (!feature.getGeometry()) {
                    event = errorEvent;
                }
                event.addFeature(feature.getId(), geojson, olLayer.get('id'));
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
         /**
         * @method _updateFeature
         * @public
         * Updates feature's style
         *
         * @param {Object} options additional options
         * @param {String} propertyName
         * @param {String} value
         */
        _updateFeature: function(options, propertyName, value) {
            var layers = {layer: options.layerId};
            var features = {};
            features[propertyName] = [value];
            var featuresMatchingQuery = this.getFeaturesMatchingQuery(layers, features);
            var feature = featuresMatchingQuery[0];
            if(feature) {
                if(options.featureStyle) {
                   this.setupFeatureStyle(options, feature, true);
                }
                var formatter = this._supportedFormats.GeoJSON;
                var addEvent = this.getSandbox().getEventBuilder('FeatureEvent')().setOpAdd();
                var errorEvent = this.getSandbox().getEventBuilder('FeatureEvent')().setOpError('feature has no geometry');
                var highlighted = feature.get('highlighted');
                if(highlighted){
                    feature.set('highlighted', false);
                } else {
                    feature.set('highlighted', true);
                }
                var geojson = formatter.writeFeaturesObject([feature]);
                var event = addEvent;
                if(!feature.getGeometry()) {
                    event = errorEvent;
                }
                event.addFeature(feature.getId(), geojson, options.layerId);
                if(errorEvent.hasFeatures()) {
                    this.getSandbox().notifyAll(errorEvent);
                }
                if(addEvent.hasFeatures()) {
                    this.getSandbox().notifyAll(addEvent);
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
                ),
                'VectorLayerRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequestHandler',
                    sandbox,
                    me
                )
            };
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
            if (!this._olLayers[layer.getId()]) {
                return;
            }
            var vectorLayer = this._olLayers[layer.getId()];
            this._map.removeLayer(vectorLayer);
            delete this._olLayers[layer.getId()];

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
            var olLayer = this.getLayerById(layer.getId());
            if (!olLayer) {
                return null;
            }
            // only single layer/id, wrap it in an array
            return [olLayer];
        },
        getLayerById: function(id) {
            if (!id) {
                return null;
            }
            return this._olLayers[id];
        },
        setVisibleByLayerId : function(id, visible) {
            var layer = this.getLayerById(id);
            if(layer) {
                layer.setVisible(visible);
            }
        },
        /**
         * Possible workaround for arranging the feature draw order within a layer
         *
         */
        rearrangeFeatures: function() {
            var me = this,
                layers = me.layers;
            for (var key in layers) {
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
        setupFeatureStyle: function(options, feature, update) {
            var me = this;
            var style = this.getStyle(options, feature, update);

            //set up property-based labeling
            if(update && typeof feature.getId === 'function') {
                options.featureStyle = me._featureStyles[feature.getId()] || options.featureStyle;
            }
            if (Oskari.util.keyExists(options, 'featureStyle.text.labelProperty') && style.getText()) {
                var label = feature.get(options.featureStyle.text.labelProperty) ? feature.get(options.featureStyle.text.labelProperty) : '';
                // For ol3 label must be a string so force to it
                label = label + '';
                style.getText().setText(label);
            }
            feature.setStyle(style);
        },
        /**
         * @method setupFeatureHover
         * 
         * Set hover options for feature.
         * 
         * @param {Oskari.mapframework.domain.VectorLayer} layer the layer which hover options are applied to the feature
         * @param {Object} feature ol3 feature
         * 
         */
        setupFeatureHover: function (layer, feature) {
            var layerOptions = layer.getHoverOptions();
            if (layerOptions) {
                var featureOptions = {};
                if (Array.isArray(layerOptions.content)) {
                    var content = '';
                    layerOptions.content.forEach(function (entry) {
                        var key = entry.key;
                        if (typeof key === 'undefined' && entry.keyProperty) {
                            key = feature.get(entry.keyProperty);
                        }
                        if (typeof key !== 'undefined') {
                            content += '<div>' + key;
                            if (entry.valueProperty) {
                                content += ': ';
                                var value = feature.get(entry.valueProperty);
                                if (typeof value !== 'undefined') {
                                    content += value;
                                }
                            }
                            content += '</div>';
                        }
                    });
                    if (content) {
                        featureOptions.content = content;
                    }
                }
                if (layerOptions.featureStyle) {
                    featureOptions.style = layerOptions.featureStyle;
                }
                feature.set('hover', featureOptions);
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
         * @param {Object} feature ol3 feature
         * @param {Boolean} update update feature style
         */
        getStyle: function(options, feature, update) {
            var me = this,
                optionalStyle = null;

            var styles = options.featureStyle || me._layerStyles[options.layerId] || {};

            // overriding default style with feature/layer style
            var styleDef = jQuery.extend({}, this._defaultStyle, styles);

            if(update && typeof feature.getId === 'function' && me._featureStyles[feature.getId()] && options.featureStyle) {
                styleDef = jQuery.extend({}, me._featureStyles[feature.getId()], styles);
            }

            if(options.featureStyle) {
                me._featureStyles[feature.getId()] = styleDef;
            }

            feature.set('oskariStyle', styleDef);

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
                    var property = optionalStyles[i].property;
                    if (property.hasOwnProperty('key') && property.hasOwnProperty('value') && feature.getProperties().hasOwnProperty(property.key)) {
                        if (property.value === feature.getProperties()[property.key]) {
                            // overriding default style with feature style
                            var styleOpt = jQuery.extend({}, defStyle, optionalStyles[i]);
                            feature.set('oskariStyle', styleOpt);
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
                var vector = new olSourceVector({
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
         * @param {ol/Extent} extent
         * @param {Number} percentage
         * @return {ol/Extent} extent
         */
        getBufferedExtent: function(extent, percentage) {
            var me = this,
                line = new olGeom.LineString([
                    [extent[0], extent[1]],
                    [extent[2], extent[3]]
                ]),
                buffer = line.getLength() * percentage / 100;
            if (buffer === 0) {
                return extent;
            }
            var geometry = fromExtent(extent);
            var input = olParser.read(geometry);
            var bufferGeometry = BufferOp.bufferOp(input, buffer);
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
                var formatter = me._supportedFormats.GeoJSON;
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
                if (!me._olLayers[layerId]) {
                    // invalid layerId
                    return;
                }
                var sourceFeatures = me._olLayers[layerId].getSource().getFeatures();
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
                _.each(me._olLayers, function(key, value) {
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
            var features = me._olLayers[id].getSource().getFeatures();
            var formatter = me._supportedFormats.GeoJSON;

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