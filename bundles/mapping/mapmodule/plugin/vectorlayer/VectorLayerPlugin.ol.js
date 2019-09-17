import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import {unByKey} from 'ol/Observable.js';
import olOverlay from 'ol/Overlay';
import {fromExtent} from 'ol/geom/Polygon';
import olFormatWKT from 'ol/format/WKT';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import jstsOL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import {BufferOp} from 'jsts/org/locationtech/jts/operation/buffer';
import * as olGeom from 'ol/geom';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import { LAYER_ID, LAYER_HOVER, LAYER_TYPE, FTR_PROPERTY_ID, SERVICE_LAYER_REQUEST } from '../../domain/constants';

const olParser = new jstsOL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 * Provides functionality to draw vector layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.VectorLayerPlugin',
    function () {
        this._features = {};
        this._olLayers = {};
        this._oskariLayers = {};
        this._supportedFormats = {};
        this._olLayerPrefix = 'vectorlayer_';
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
        this._hoverState = null;
        this._log = Oskari.log('VectorLayerPlugin');
        this._styleCache = {};
        this._animatingFeatures = {};
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
            me._registerToFeatureService();
        },
        /**
         * @method  @private _createConfiguredLayers Create configured layers an their styles
         */
        _createConfiguredLayers: function () {
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
                        source: vectorSource
                    });
                    olLayer.set(LAYER_ID, layerId, true);
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
        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                }
            };
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

            this._log.debug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );

            me.handleLayerOpacity(layer, (layer.getOpacity() / 100), true);
        },
        /**
         * @method _registerToFeatureService
         * @private
         * Registers vector layer type to feature service for tooltip, click and layer requests.
         */
        _registerToFeatureService: function () {
            var defaultHandlerDef = [SERVICE_LAYER_REQUEST];
            var vectorFeatureService = this.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService');
            vectorFeatureService.registerLayerType('vector', this, defaultHandlerDef);
        },
        /**
         * @method onLayerRequest VectorFeatureService handler impl method
         * Handles VectorLayerRequest.
         *
         * @param { Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest } request
         */
        onLayerRequest: function (request) {
            this.prepareVectorLayer(request.getOptions());
        },
        /**
         * @method onMapHover VectorFeatureService handler impl method
         * Handles feature highlighting on map hover.
         *
         * @param { Oskari.mapframework.event.common.MouseHoverEvent } event
         * @param { olFeature } feature
         * @param { olVectorLayer } layer
         */
        onMapHover: function (event, feature, layer) {
            const oldHoverState = this._hoverState;
            this._hoverState = null;
            if (feature) {
                this._applyHoverStyle(feature, layer);
                this._hoverState = { feature, layer };
            }
            // Remove highlighting from the previously hovered feature
            if (oldHoverState && oldHoverState.feature !== feature) {
                this._applyOriginalStyle(oldHoverState.feature, oldHoverState.layer);
            }
            // Update map cursor if feature is/was hovered
            if (oldHoverState || this._hoverState) {
                const cursor = this._hoverState ? this._hoverState.feature.get('oskari-cursor') : null;
                var mapDiv = this._map.getTarget();
                mapDiv = typeof mapDiv === 'string' ? jQuery('#' + mapDiv) : jQuery(mapDiv);
                if (cursor) {
                    mapDiv.css('cursor', cursor);
                } else {
                    mapDiv.css('cursor', this.getMapModule().getCursorStyle());
                }
            }
        },
        /**
         * @method _applyHoverStyle
         *
         * Changes feature's style and preserves the original style to go back to.
         *
         * @param {ol/Feature} feature ol feature
         * @param {ol/layer/Vector || object} layer ol layer or layer id
         */
        _applyHoverStyle: function (feature, layer) {
            if (typeof layer !== 'object') {
                layer = this._getOlLayer(layer);
            }
            const hoverOptions = layer.get(LAYER_HOVER);
            if (!hoverOptions || !hoverOptions.featureStyle) {
                return;
            }
            if (hoverOptions.filter) {
                const match = hoverOptions.filter.find(cur => cur.key && feature.get(cur.key) === cur.value);
                if (!match) {
                    return;
                }
            }
            const ftrStyles = this.getCachedStyles(layer.get(LAYER_ID), this.getFeatureId(feature));
            if (!ftrStyles || ftrStyles.hoverActive) {
                return;
            }
            const hoverStyleDef = hoverOptions.featureStyle;
            if (!ftrStyles.olHover) {
                let hoverStyle = hoverStyleDef.inherit ? jQuery.extend(true, {}, ftrStyles.oskari || {}, hoverStyleDef) : hoverStyleDef;
                ftrStyles.olHover = this.getMapModule().getStyle(hoverStyle);
                ftrStyles.olHover.setZIndex(ftrStyles.ol.getZIndex());
                this._setFeatureLabel(feature, hoverStyle, ftrStyles.olHover);
            }
            ftrStyles.hoverActive = true;
            feature.setStyle(ftrStyles.olHover);
        },
        /**
         * @method _applyOriginalStyle
         *
         * Switch back to the original style.
         *
         * @param {ol/Feature} feature ol feature
         * @param {ol/layer/Vector} layer ol layer
         */
        _applyOriginalStyle: function (feature, layer) {
            const ftrStyles = this.getCachedStyles(layer.get(LAYER_ID), this.getFeatureId(feature));
            if (!ftrStyles || !ftrStyles.ol || !ftrStyles.hoverActive) {
                return;
            }
            feature.setStyle(ftrStyles.ol);
            ftrStyles.hoverActive = false;
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
                new olFormatGeoJSON({}));
            this.registerVectorFormat('application/nlsfi-x-openlayers-feature',
                function () {
                    this.read = function (data) {
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
        removeFeaturesFromMap: function (identifier, value, layer) {
            var me = this,
                olLayer,
                layerId;
            if (layer && layer !== null) {
                if (layer instanceof olLayerVector) {
                    layerId = layer.get(LAYER_ID);
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
                // remove all features from the given layer
                else {
                    this._removeFeaturesByAttribute(olLayer);
                    delete this._features[layerId];
                }
            }
            // Removes all features from all layers if layer is not specified
            else if (!layer) {
                for (layerId in me._olLayers) {
                    if (me._olLayers.hasOwnProperty(layerId)) {
                        olLayer = me._olLayers[layerId];
                        this._removeFeaturesByAttribute(olLayer);
                        delete this._features[layerId];
                    }
                }
            }
        },
        _removeFeaturesByAttribute: function (olLayer, identifier, value) {
            var me = this,
                source = olLayer.getSource(),
                featuresToRemove = [];

            // add all features if identifier and value are missing or
            // if given -> features that have
            source.forEachFeature(function (feature) {
                if ((!identifier && !value) ||
                    feature.get(identifier) === value) {
                    featuresToRemove.push(feature);
                }
            });

            // If there is no features to remove then return
            if (featuresToRemove.length === 0) {
                return;
            }

            // notify other components of removal
            var formatter = this._supportedFormats.GeoJSON;
            var sandbox = this.getSandbox();
            var removeEvent = Oskari.eventBuilder('FeatureEvent')().setOpRemove();

            featuresToRemove.forEach(function (feature) {
                source.removeFeature(feature);
                // remove from "cache"
                me._removeFromCache(olLayer.get(LAYER_ID), feature);

                var geojson = formatter.writeFeaturesObject([feature]);
                removeEvent.addFeature(feature.getId(), geojson, olLayer.get(LAYER_ID));
            });
            sandbox.notifyAll(removeEvent);
        },
        _removeFromCache: function (layerId, feature) {
            var storedFeatures = this._features[layerId];
            for (var i = 0; i < storedFeatures.length; i++) {
                var featuresInDataset = storedFeatures[i].data;
                for (var j = 0; j < featuresInDataset.length; j++) {
                    if (feature === featuresInDataset[j]) {
                        featuresInDataset.splice(j, 1);
                    }
                }
                if (!featuresInDataset.length) {
                    // remove block if empty
                    storedFeatures.splice(i, 1);
                }
            }
            if (this._styleCache[layerId]) {
                delete this._styleCache[layerId][this.getFeatureId(feature)];
            }
        },
        _getGeometryType: function (geometry) {
            if (typeof geometry === 'string' || geometry instanceof String) {
                return 'WKT';
            }
            return 'GeoJSON';
        },

        _getOlLayer: function (layer) {
            var me = this;
            if (!layer || layer.getLayerType() !== 'vector') {
                return null;
            }

            var olLayer = me._olLayers[layer.getId()];
            if (!olLayer) {
                olLayer = new olLayerVector({
                    source: new olSourceVector()
                });
                // Set oskari properties
                const silent = true;
                olLayer.set(LAYER_ID, layer.getId(), silent);
                olLayer.set(LAYER_TYPE, layer.getLayerType(), silent);
                olLayer.set(LAYER_HOVER, layer.getHoverOptions(), silent);
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
        handleLayerOpacity: function (layer, opacity) {
            var me = this;
            var olLayer = me._olLayers[layer.getId()];
            if (olLayer) {
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

                if (options.hover && options.hover.filter) {
                    if (!Array.isArray(options.hover.filter)) {
                        options.hover.filter = [options.hover.filter];
                    }
                }
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
                    this._getOlLayer(layer).set(LAYER_HOVER, layer.getHoverOptions());
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
         * @param {Object} geometry the geometry WKT string or GeoJSON object or object containing feature properties for updating
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
            olLayer = me._getOlLayer(layer);
            vectorSource = olLayer.getSource();

            if (!me.getMapModule().isValidGeoJson(geometry) && typeof geometry === 'object') {
                for (var key in geometry) {
                    me._updateFeature(options, key, geometry[key]);
                }
                me._applyPrioOnSource(options.layerId, vectorSource, options.prio);
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
                if (typeof feature.getId() === 'undefined' && typeof feature.get(FTR_PROPERTY_ID) === 'undefined') {
                    var id = 'F' + me._nextFeatureId++;
                    feature.setId(id);
                    // setting id using set(key, value) to make id-property asking by get('id') possible
                    feature.set(FTR_PROPERTY_ID, id);
                }
                me.setFeatureStyle(options, feature, false);
            });
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

            me._applyPrioOnSource(options.layerId, vectorSource, options.prio);
            vectorSource.addFeatures(features);

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
                event.addFeature(feature.getId(), geojson, olLayer.get(LAYER_ID));
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
         * @method _applyPrioOnSource
         * Set feature zIndexes based on cached prio values.
         *
         * @param {String} layerId
         * @param {olSourceVector} source
         * @param {Number} prio
         */
        _applyPrioOnSource: function (layerId, source, prio) {
            if (isNaN(prio) || !source) {
                return;
            }
            let zIndex = 0;
            this._features[layerId].sort((a, b) => b.prio - a.prio);
            this._features[layerId].forEach(featObj => {
                featObj.data.forEach(feature => {
                    this.updateCachedZIndex(layerId, feature, zIndex);
                    zIndex++;
                });
            });
            // apply changes on map
            this.getMapModule().getMap().render();
        },
        /**
         * @method _updateFeature
         * @public
         * Updates feature's style
         *
         * @param {Object} options additional options
         * @param {String} propertyName
         * @param {String} value
         * @param {Number} animationDuration
         */
        _updateFeature: function (options, propertyName, value) {
            const { prio, layerId, featureStyle } = options;
            var layers = {layer: layerId};
            var values = Array.isArray(value) ? value : [value];
            var searchValues = values.map(cur => typeof cur === 'object' ? cur.value : cur);
            var searchOptions = {
                [propertyName]: searchValues
            };
            this.getFeaturesMatchingQuery(layers, searchOptions).forEach(feature => {
                const updateValue = values.find(cur => typeof cur === 'object' && feature.get(propertyName) === cur.value);
                if (updateValue && updateValue.properties) {
                    Object.keys(updateValue.properties).forEach(key => feature.set(key, updateValue.properties[key]));
                }
                if (featureStyle) {
                    this.setFeatureStyle(options, feature, true);
                }
                this._updateCachedPrio(layerId, feature, prio);

                var formatter = this._supportedFormats.GeoJSON;
                var addEvent = Oskari.eventBuilder('FeatureEvent')().setOpAdd();
                var errorEvent = Oskari.eventBuilder('FeatureEvent')().setOpError('feature has no geometry');

                var geojson = formatter.writeFeaturesObject([feature]);
                var event = addEvent;
                if (!feature.getGeometry()) {
                    event = errorEvent;
                }
                event.addFeature(feature.getId(), geojson, layerId);
                if (errorEvent.hasFeatures()) {
                    this.getSandbox().notifyAll(errorEvent);
                }
                if (addEvent.hasFeatures()) {
                    this.getSandbox().notifyAll(addEvent);
                }
            });
        },
        /**
         * @method _updateCachedPrio
         * Moves the feature to a dataset having the specified prio
         *
         * @param {String} layerId
         * @param {olFeature} feature
         * @param {Number} prio
         */
        _updateCachedPrio: function (layerId, feature, prio) {
            if (!layerId || !feature || isNaN(prio)) {
                return;
            }
            const datasets = this._features[layerId];
            const oldDataset = datasets.find(cur => cur.data.find(ftr => ftr === feature));
            if (oldDataset && oldDataset.prio !== prio) {
                oldDataset.data.splice(oldDataset.data.indexOf(feature), 1);
                const newDataset = datasets.find(cur => cur.prio === prio);
                if (newDataset) {
                    newDataset.data.push(feature);
                } else {
                    datasets.push({
                        data: [feature],
                        prio
                    });
                }
            }
        },
        _animateFillColorChange: function (feature, newStyle, duration) {
            const me = this;
            const featureId = me.getFeatureId(feature);
            const hasFillColor = style => style && style.getFill() && style.getFill().getColor();
            if (!hasFillColor(feature.getStyle()) || !hasFillColor(newStyle) || !duration) {
                // No animation. Just set the style.
                delete me._animatingFeatures[featureId];
                feature.setStyle(newStyle);
                return;
            }

            me._animatingFeatures[featureId] = feature;
            const start = new Date().getTime();
            const map = me.getMapModule().getMap();
            const listenerKey = map.on('postcompose', animate);

            const oldColor = feature.getStyle().getFill().getColor();
            const newColor = newStyle.getFill().getColor();

            function animate (event) {
                if (!me._animatingFeatures[featureId]) {
                    unByKey(listenerKey);
                    return;
                }
                const elapsed = event.frameState.time - start;
                const elapsedRatio = elapsed / duration;
                if (elapsed > duration) {
                    unByKey(listenerKey);
                    feature.setStyle(newStyle);
                    return;
                }
                const style = feature.getStyle();
                style.getFill().setColor(d3.interpolateLab(oldColor, newColor)(elapsedRatio));
                feature.setStyle(style);
            }
            // Start animation
            map.render();
        },
        /**
         * Raises the marker layer above the other layers
         *
         * @param markerLayer
         */
        raiseVectorLayer: function (layer) {
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
                ),
                'MapModulePlugin.ZoomToFeaturesRequest': Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapmodule.request.ZoomToFeaturesRequestHandler',
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
        getOLMapLayers: function (layer) {
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
        getLayerById: function (id) {
            if (!id) {
                return null;
            }
            return this._olLayers[id];
        },
        setVisibleByLayerId: function (id, visible) {
            var layer = this.getLayerById(id);
            if (layer) {
                layer.setVisible(visible);
            }
        },
        /**
         * Possible workaround for arranging the feature draw order within a layer
         *
         */
        rearrangeFeatures: function () {
            var me = this,
                layers = me.layers;
            for (var key in layers) {
                if (layers[key].features.length > 0) {
                    var layer = layers[key];
                    var features = layer.features;
                    features.sort(function (a, b) {
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
        getFeatureId: function (feature) {
            return feature.getId() || feature.get(FTR_PROPERTY_ID);
        },
        _initStyleCache: function (layerId, featureId) {
            const isUndef = val => typeof val === 'undefined' || val === null;
            if (isUndef(layerId) || isUndef(featureId)) {
                return;
            }
            const cache = this._styleCache[layerId] || {};
            cache[featureId] = cache[featureId] || {};
            this._styleCache[layerId] = cache;
        },
        getCachedStyles: function (layerId, featureId) {
            const cache = this._styleCache[layerId];
            if (cache) {
                return cache[featureId];
            }
        },
        updateCachedZIndex: function (layerId, feature, zIndex) {
            if (!layerId || !feature) {
                return;
            }
            const cached = this.getCachedStyles(layerId, this.getFeatureId(feature));
            if (!cached) {
                return;
            }
            if (cached.ol) {
                cached.ol.setZIndex(zIndex);
                if (!cached.hoverActive) {
                    feature.setStyle(cached.ol);
                }
            }
            if (cached.olHover) {
                cached.olHover.setZIndex(zIndex);
            }
        },
        _setFeatureLabel: function (feature, oskariStyle, olStyle) {
            if (!feature || !oskariStyle || !olStyle) {
                return;
            }
            if (olStyle.getText()) {
                const showLabel = Oskari.util.keyExists(oskariStyle, 'text.labelProperty');
                const label = showLabel ? feature.get(oskariStyle.text.labelProperty) || '' : '';
                olStyle.getText().setText('' + label);
            }
            return olStyle;
        },
        setFeatureStyle: function (options, feature, update) {
            const me = this;
            const layerId = options.layerId;
            const featureId = me.getFeatureId(feature);

            me._initStyleCache(layerId, featureId);
            const olStyle = this.getStyle(options, feature, update);

            // Setup label
            const cached = me.getCachedStyles(layerId, featureId);
            let styleDef = options.featureStyle || {};
            if (cached && cached.oskari) {
                styleDef = cached.oskari;
                delete cached.olHover;
            }
            me._setFeatureLabel(feature, styleDef, olStyle);

            if (update && cached.hoverActive) {
                delete cached.hoverActive;
                me._applyHoverStyle(me._hoverState.feature, me._hoverState.layer);
            } else {
                me._animateFillColorChange(feature, olStyle, options.animationDuration);
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
        getStyle: function (options, feature, update) {
            const me = this;
            const cached = me.getCachedStyles(options.layerId, me.getFeatureId(feature));

            // overriding default style with feature/layer style
            const overrideStyle = options.featureStyle || me._layerStyles[options.layerId] || {};
            const baseStyle = update && cached.oskari ? cached.oskari : this._defaultStyle;
            cached.oskari = jQuery.extend(true, {}, baseStyle, overrideStyle);

            // Optional styles based on property values
            if (feature && options.optionalStyles) {
                const optionalStyleDef = me.getOptionalStyle(options.optionalStyles, cached.oskari, feature);
                if (optionalStyleDef) {
                    cached.oskari = optionalStyleDef;
                }
            }

            let zIndex = 1;
            if (cached.ol) {
                zIndex = cached.ol.getZIndex();
            }
            cached.ol = me.getMapModule().getStyle(cached.oskari);
            cached.ol.setZIndex(zIndex);
            return cached.ol;
        },
        /**
         * @method getOptionalStyle
         * Returns a style, if style property value matches to any of feature property values
         * @param {Object} optional style
         * @param {Object} default style
         * @param {Object} feature properties
         * @return
         * */
        getOptionalStyle: function (optionalStyles, defStyle, feature) {
            for (var i in optionalStyles) {
                if (optionalStyles[i].hasOwnProperty('property') && feature.getProperties()) {
                    // check feature property  values and take style, if there is match case
                    var property = optionalStyles[i].property;
                    if (property.hasOwnProperty('key') && property.hasOwnProperty('value') && feature.getProperties().hasOwnProperty(property.key)) {
                        if (property.value === feature.getProperties()[property.key]) {
                            // overriding default style with feature style
                            return jQuery.extend(true, {}, defStyle, optionalStyles[i]);
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
        zoomToFeatures: function (layer, options) {
            var me = this,
                layers = me.getLayerIds(layer),
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
        getBufferedExtent: function (extent, percentage) {
            var line = new olGeom.LineString([
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
            bufferGeometry.CLASS_NAME = 'jsts.geom.Polygon';
            bufferGeometry = olParser.write(bufferGeometry);
            return bufferGeometry.getExtent();
        },
        /**
         * @method sendZoomFeatureEvent
         *  - sends FeatureEvent with the zoom operation
         * @param {Array} features
         */
        sendZoomFeatureEvent: function (features) {
            var me = this,
                featureEvent = Oskari.eventBuilder('FeatureEvent')().setOpZoom();
            if (!_.isEmpty(features)) {
                var formatter = me._supportedFormats.GeoJSON;
                _.each(features, function (feature) {
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
        sendErrorFeatureEvent: function (msg) {
            var me = this,
                featureEvent = Oskari.eventBuilder('FeatureEvent')().setOpError(msg);
            me._sandbox.notifyAll(featureEvent);
        },
        /**
         * @method getFeaturesMatchingQuery
         *  - gets features matching query
         * @param {Array} layers, object like {layer: ['layer1', 'layer2']}
         * @param {Object} featureQuery and object like { "id" : [123, "myvalue"] }
         */
        getFeaturesMatchingQuery: function (layers, featureQuery) {
            var me = this,
                features = [];
            _.each(layers, function (layerId) {
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
                _.each(sourceFeatures, function (feature) {
                    feature.layerId = layerId;
                    _.each(featureQuery, function (allowedValues, requestedProperty) {
                        var featureValue = feature.get(requestedProperty);
                        if (!featureValue) {
                            // feature doesn't have the property, don't include it
                            return;
                        }
                        _.each(allowedValues, function (value) {
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
        getLayerIds: function (layerIds) {
            var me = this,
                layers = [];
            if (_.isEmpty(layerIds)) {
                _.each(me._olLayers, function (key, value) {
                    layers.push(value);
                });
            } else {
                _.each(layerIds.layer, function (key, value) {
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
        getLayerFeatures: function (id) {
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
