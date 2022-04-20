import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import * as olExtent from 'ol/extent';
import olInteractionDraw, { createRegularPolygon } from 'ol/interaction/Draw';
import olInteractionModify from 'ol/interaction/Modify';
import * as olEventsCondition from 'ol/events/condition';
import olOverlay from 'ol/Overlay';
import olFeature from 'ol/Feature';
import * as olGeom from 'ol/geom';
import LinearRing from 'ol/geom/LinearRing';
import GeometryCollection from 'ol/geom/GeometryCollection';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import olCollection from 'ol/Collection';
import jstsOL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import { BufferOp, BufferParameters } from 'jsts/org/locationtech/jts/operation/buffer';
import isValidOp from 'jsts/org/locationtech/jts/operation/valid/IsValidOp';

const olParser = new jstsOL3Parser();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

const arrayValuesEqual = (array1, array2) => array1.length === array2.length && array1.every((value, index) => value === array2[index]);
const firstAndLastCoordinatesEqual = (coordinates) => coordinates.length > 1 && arrayValuesEqual(coordinates[0], coordinates[coordinates.length - 1]);
const hasEnoughCoordinatesForArea = (coordinates) => coordinates.length > 3;
/**
 * @class Oskari.mapping.drawtools.plugin.DrawPlugin
 * Map engine specific implementation for draw tools
 */
Oskari.clazz.define(
    'Oskari.mapping.drawtools.plugin.DrawPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this._clazz = 'Oskari.mapping.drawtools.plugin.DrawPlugin';
        this._name = 'GenericDrawPlugin';
        this._bufferedFeatureLayerId = 'BufferedFeatureDrawLayer';
        this._styleTypes = ['draw', 'modify', 'intersect'];
        this._styles = {};
        this._drawLayers = {};
        this._overlays = {};
        this._drawFeatureIdSequence = 0;
        this._tooltipClassForMeasure = 'drawplugin-tooltip-measure';
        this._mode = '';
        this._featuresValidity = {};
        // TODO: figure out why we have some variables that are "globally reset" and some that are functionality id specific.
        // As some are "global"/shared between functionalities resuming a previous id will probably NOT work the way expected
        //  and storing these for each id is probably not needed.
        this._draw = {};
        this._modify = {};
        this._functionalityIds = {};
        this._showIntersectionWarning = false;
        this._circleHasGeom = false;
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
        this._loc = Oskari.getLocalization('DrawTools');
    },
    {
        /**
         * @method setDefaultStyle
         * - set styles for draw, modify and intersect mode
         *
         * @param {Object} styles. If not given, will set default styles
         */
        setDefaultStyle: function (styles) {
            var me = this;
            styles = styles || {};
            // setting defaultStyles
            me._styleTypes.forEach(function (type) {
                // overriding default style configured style
                var styleForType = styles[type] || {};
                var styleDef = jQuery.extend({}, me._defaultStyle, styleForType);
                me._styles[type] = me.getMapModule().getStyle(styleDef);
            });
        },
        /**
         * @Return{String} reference system as defined in GeoJSON format
         * @method _getSRS
         */
        _getSRS: function () {
            return this.getSandbox().getMap().getSrsName();
        },
        /**
         * Used to toggle GFI functionality off when the user is drawing to not generate popups on clicks
         * and on after the drawing is finished to resume showing GFI popups.
         * @param {Boolean} enabled
         */
        setGFIEnabled: function (enabled) {
            var reqBuilder = Oskari.requestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
            if (!reqBuilder) {
                // GFI functionality not available
                return;
            }
            // enable (resume showing gfi popups after drawing is completed)
            // or disable (when drawing in progress to not generate popups on clicks)
            this.getSandbox().request(this, reqBuilder(!!enabled));
        },
        /**
         * @method draw
         * - activates draw and modify controls
         *
         * @param {String} id, that identifies the request
         * @param {String} shape: drawing shape: Point/Circle/Polygon/Box/Square/LineString
         * @param {Object} options include:
         *                  {Number} buffer: buffer for drawing buffered line and dot. If not given or 0, will disable dragging.
         *                  {Object} style: styles for draw, modify and intersect mode. If options don't include custom style, sets default styles
         *                  {Boolean/String} allowMultipleDrawing: true - multiple selection is allowed,
         *                                                         false - after drawing is finished (by doubleclick), will stop drawing tool, but keeps selection on the map.
         *                                                        'single' - selection will be removed before drawing a new selection.
         *                                                        'multiGeom' - form multigeometry from drawn features.
         *                                                         Default is false.
         *                  {Boolean} showMeasureOnMap: true - if measure result should be displayed on map near drawing feature. Default is false.
         *                  {Boolean} drawControl: true - will activate draw control, false - will not activate. Default is true.
         *                  {Boolean} modifyControl: true - will activate modify control, false, will not activate. Default is true.
         *                  {String} geojson: geojson for editing. If not given, will activate draw/modify control according to given shape.
         *                  {Boolean} selfIntersection: true - user will see warning text if polygon has self-intersection. Features will be not sended to event before polygon is valid. false - itself intersection will be not checked. By default intersections are not allowed.
         *                  {Number} maxSize: max size = perimeter of feature's boundbox. User can't continue drawing after feature's max bbox is achieved. Default is null.
         */
        draw: function (id, shape, options) {
            // TODO: implementations
            // if shape == geojson -> setup editing it
            // if shape == undefined -> update buffer for existing drawing (any other reason for this? text etc?)
            // if shape is one of the predefined draw options -> start corresponding draw tool
            // if options.buffer is defined -> use it for dot and line and prevent dragging to create buffer
            // TODO : start draw control
            // use default style if options don't include custom style
            var me = this;
            me.drawMultiGeom = options.allowMultipleDrawing === 'multiGeom';
            if (me._gfiTimeout) {
                clearTimeout(me._gfiTimeout);
            }
            // set default accuracy for buffer.
            // bufferAccuracy is number of line segments used to represent a quadrant circle
            options.bufferAccuracy = options.bufferAccuracy || 10;

            // disable gfi
            me.getMapModule().setDrawingMode(true);

            me.removeInteractions(me._draw, me._id);
            me.removeInteractions(me._modify, me._id);
            this._cleanupInternalState();

            me._shape = shape;

            // setup functionality id
            me._id = id;
            // setup options
            me._options = options;
            // this sets styles for this and all the following requests (not functionality id specific, written to "class variables")
            me.setDefaultStyle(this.getOpts('style'));

            // creating layer for drawing (if layer not already added)
            if (!me.getCurrentDrawLayer()) {
                me.addVectorLayer(me.getCurrentLayerId());
            } else {
                me.getCurrentDrawLayer().setStyle(me._styles.draw);
            }

            // always assign layerId for functionality id
            me._functionalityIds[id] = me.getCurrentLayerId();

            // activate drawcontrols
            if (shape) {
                me.drawShape(shape, options);
            } else {
                // if shape == undefined -> update buffer for existing drawing (any other reason for this? text etc?)
            }
        },
        /**
         * @method drawShape
         * - activates draw/modify controls. If geojson is given, setup editing it
         *
         * @param {String} shape
         * @param {Object} options
         */
        drawShape: function (shape, options) {
            var me = this;
            var optionalFeatureForEditing = options.geojson;
            if (optionalFeatureForEditing) {
                var jsonFormat = new olFormatGeoJSON();
                var featuresFromJson = jsonFormat.readFeatures(optionalFeatureForEditing);
                // parse multi geometries to single geometries
                if (me.drawMultiGeom) {
                    var parsedFeatures = me.parseMultiGeometries(featuresFromJson);
                    me.getCurrentDrawLayer().getSource().addFeatures(parsedFeatures);
                } else {
                    me.getCurrentDrawLayer().getSource().addFeatures(featuresFromJson);
                }
            }
            if (options.drawControl !== false) {
                me.addDrawInteraction(me.getCurrentLayerId(), shape, options);
            }
            if (options.modifyControl !== false) {
                me.addModifyInteraction(me.getCurrentLayerId(), shape, options);
            }
        },
        // used only for editing multigeometries (allowMultipleDrawing === 'multiGeom')
        parseMultiGeometries: function (features) {
            var geom,
                geoms,
                feat,
                feats = [];
            for (var i = 0; i < features.length; i++) {
                feat = features[i];
                geom = feat.getGeometry();

                if (geom.getType() === 'MultiPoint') {
                    geoms = geom.getPoints();
                    feats = feats.concat(this.createFeatures(geoms, false));
                } else if (geom.getType() === 'MultiLineString') {
                    geoms = geom.getLineStrings();
                    feats = feats.concat(this.createFeatures(geoms, false));
                } else if (geom.getType() === 'MultiPolygon') {
                    geoms = geom.getPolygons();
                    feats = feats.concat(this.createFeatures(geoms, true));
                } else {
                    feats.push(feat);
                }
            }
            return feats;
        },
        // used only for editing multigeometries (allowMultipleDrawing === 'multiGeom')
        createFeatures: function (geometries, checkIntersection) {
            var me = this,
                feat,
                feats = [];
            geometries.forEach(function (geom) {
                feat = new olFeature({ geometry: geom });
                feat.setId(me.generateNewFeatureId());
                feats.push(feat);
                if (checkIntersection) {
                    me._sketch = feat;
                    me.checkIntersection(geom);
                }
            });
            me._sketch = null;
            return feats;
        },
        /**
         * This is the shape type that is currently being drawn
         * @return {String} 'Polygon' / 'LineString' etc
         */
        getCurrentDrawShape: function () {
            return this._shape;
        },
        /**
         * This is the layer ID for the current functionality
         * @return {String}
         */
        getCurrentLayerId: function () {
            return this.getCurrentDrawShape() + 'DrawLayer';
        },
        /**
         * This is the layer for the current functionality
         * @return {ol/Layer}
         */
        getCurrentDrawLayer: function () {
            return this.getLayer(this.getCurrentLayerId());
        },
        /**
         * Returns a shared buffering layer.
         */
        // for some reason there's always just one buffered features layer even though there are multiple draw layers
        getBufferedFeatureLayer: function () {
            if (!this.getLayer(this._bufferedFeatureLayerId)) {
                // creating layer for buffered features (if layer not already added)
                this.addVectorLayer(this._bufferedFeatureLayerId);
            }
            return this.getLayer(this._bufferedFeatureLayerId);
        },
        /**
         * Layer id for functionality.
         * TODO: is this really needed? some of the variables used are shared between functionalities anyway. Consider using just "currentLayer"
         * @param  {String|Number} id functionality id
         * @return {String} layer ID
         */
        getLayerIdForFunctionality: function (id) {
            return this._functionalityIds[id];
        },
        /**
         * Returns the actual layer matching the given id
         * @param  {String} layerId
         * @return {ol/Layer}
         */
        getLayer: function (layerId) {
            return this._drawLayers[layerId];
        },
        /**
         * The id sent in startdrawing request like "measure" or "feedback"
         * @return {String|Number}
         */
        getCurrentFunctionalityId: function () {
            return this._id;
        },
        /**
         * Each new geometry gets a "unique id" with this sequence
         * @return {String} [description]
         */
        generateNewFeatureId: function () {
            return 'drawFeature' + this._drawFeatureIdSequence++;
        },
        /**
         * Returns a value in the options.
         * @param  {String} key  key for the value inside options
         * @param  {Object} options optional options object, defaults to options in the startdrawing request if not given
         * @return {Any}
         */
        getOpts: function (key, options) {
            var opts = options || this._options || {};
            if (key == 'modifyControl' && typeof opts[key] === 'undefined') {
                // default for modifyControl key
                return true;
            }
            if (key) {
                return opts[key];
            }
            return opts;
        },
        /**
         * Returns true if the user has an unfinished sketch in the works (started drawing a geometry, but not yet finished it)
         * @return {Boolean}
         */
        isCurrentlyDrawing: function () {
            return this._mode === 'draw';
        },
        /**
         * Returns true if the user is currently holding on to one of the edges in geometry and in process of editing the sketch
         * @return {Boolean}
         */
        isCurrentlyModifying: function () {
            return this._mode === 'modify';
        },
        /**
         * @method stopDrawing
         * -  sends DrawingEvent and removes draw and modify controls
         *
         * @param {String} id
         * @param {boolean} clearCurrent: if true, all selection will be removed from the map
         */
        stopDrawing: function (id, clearCurrent, supressEvent) {
            var me = this;
            if (typeof supressEvent === 'undefined') {
                supressEvent = false;
            }
            var options = {
                clearCurrent: clearCurrent,
                isFinished: true
            };

            if (!me.getLayerIdForFunctionality(id)) {
                // layer not found for functionality id
                // clear drawings from all drawing layers
                me.clearDrawing();
                return;
            }
            if (supressEvent === true) {
                // another bundle sends StopDrawingRequest to clear own drawing (e.g. toolselected)
                // skip deactivate draw and modify controls
                // should be also with suppressEvent !== true ??
                // TODO: remove this hack, when stopdrawing, startdrawing, cleardrawing,. methods and requests are handled more properly
                if (me._id !== id) {
                    me.clearDrawing(); // clear all
                    return;
                } else {
                    me.clearDrawing(id); // clear drawing from given layer
                }
            } else {
                // try to finish unfinished (currently drawn) feature
                me.forceFinishDrawing();
                me.sendDrawingEvent(id, options);
            }
            // deactivate draw and modify controls
            me.removeInteractions(me._draw, id);
            me.removeInteractions(me._modify, id);
            me._cleanupInternalState();
            me.getMap().un('pointermove', me.pointerMoveHandler, me);
            // enable gfi
            me._gfiTimeout = setTimeout(function () {
                me.getMapModule().setDrawingMode(false);
            }, 500);
        },
        /**
         * @method forceFinishDrawing
         * Try to finish drawing if _scetch contains the unfinished (currently drawn) feature
         * Updates measurement on map and cleans sketch
         */
        forceFinishDrawing: function () {
            if (this._sketch === null || this._sketch === undefined) {
                return;
            }
            var feature = this._sketch,
                geom = feature.getGeometry(),
                source = this.getCurrentDrawLayer().getSource(),
                coords,
                parsedCoords;

            if (geom.getType() === 'LineString') {
                coords = geom.getCoordinates();
                if (coords.length > 2) {
                    parsedCoords = coords.slice(0, coords.length - 1); // remove last point
                    geom.setCoordinates(parsedCoords);
                    feature.setStyle(this._styles.modify);
                    source.addFeature(feature);
                    // update measurement result on map
                    this._sketch = feature;
                    this.pointerMoveHandler();
                } else {
                    // cannot finish geometry, remove measurement result from map
                    this._cleanupInternalState();
                }
            } else if (geom.getType() === 'Polygon') {
                // only for exterior linear ring, drawtools doesn't support linear rings (holes)
                coords = geom.getCoordinates()[0];
                if (coords.length > 4) {
                    parsedCoords = coords.slice(0, coords.length - 2); // remove second last point
                    parsedCoords.push(coords[coords.length - 1]); // add last point to close linear ring
                    geom.setCoordinates([parsedCoords]); // add parsed exterior linear ring
                    feature.setStyle(this._styles.modify);
                    source.addFeature(feature);
                    // update measurement result on map
                    this._sketch = feature;
                    this.pointerMoveHandler();
                } else {
                    // cannot finish geometry, remove measurement result from map
                    this._cleanupInternalState();
                }
            }
            this._sketch = null; // clean sketch to not add to drawing event
        },
        _cleanupInternalState: function () {
            // Remove measure result from map
            if (this._sketch) {
                this.removeDrawingTooltip(this._sketch.getId());
            }
            this._sketch = null;
        },
        /**
         * @method clearDrawing
         * -  remove features from the draw layers
         * @param {String} functionality id. If not given, will remove features from all drawLayers
         */
        clearDrawing: function (id) {
            var me = this;
            if (id) {
                var layer = me.getLayer(me.getLayerIdForFunctionality(id));
                if (layer) {
                    layer.getSource().getFeaturesCollection().clear();
                }
            } else {
                Object.keys(me._drawLayers).forEach(function (key) {
                    me._drawLayers[key].getSource().getFeaturesCollection().clear();
                });
            }
            me.getBufferedFeatureLayer().getSource().getFeaturesCollection().clear();

            // remove overlays from map (measurement tooltips)
            Object.keys(me._overlays).forEach(function (key) {
                me.getMap().removeOverlay(me._overlays[key]);
            });
            me._overlays = {};
        },
        /**
         * @method sendDrawingEvent
         * -  sends DrawingEvent
         *
         * @param {String} id
         * @param {object} options include:
         *                  {Boolean} clearCurrent: true - all selection will be removed from the map after stopping plugin, false - will keep selection on the map. Default is false.
         *                  {Boolean} isFinished: true - if drawing is completed. Default is false.
         */
        sendDrawingEvent: function (id, options) {
            var me = this,
                features = null,
                bufferedFeatures = [],
                layerId = me.getLayerIdForFunctionality(id),
                isFinished = false;
            var requestedBuffer = me.getOpts('buffer') || 0;

            features = me.getFeatures(layerId);

            if (!features) {
                Oskari.log('DrawPlugin').debug('Layer "' + layerId + '" has no features, not send drawing event.');
                return;
            }

            if (requestedBuffer > 0) {
                // TODO: check the ifs below if they should only be run if buffer is used
                // TODO: doesn't work for multi drawing because buffered layer contains only currently drawn feature
                bufferedFeatures = me.getFeatures(me._bufferedFeatureLayerId);
            }

            switch (me.getCurrentDrawShape()) {
            case 'Point':
            case 'LineString':
                if (requestedBuffer > 0) {
                    me.addBufferPropertyToFeatures(features, requestedBuffer);
                }
                break;
            case 'Box':
            case 'Square':
                features.forEach(function (f) {
                    me._featuresValidity[f.getId()] = true;
                });
                break;
            case 'Circle':
                // Do common stuff
                // buffer is used for circle's radius
                if (requestedBuffer > 0) {
                    features = me.getCircleAsPolygonFeature(features, requestedBuffer);
                    bufferedFeatures = features; // or = [];
                } else {
                    features = me.getCircleAsPolygonFeature(features);
                }
                break;
            }

            var geojson = me.getFeaturesAsGeoJSON(features);
            geojson.crs = me._getSRS();
            var bufferedGeoJson = me.getFeaturesAsGeoJSON(bufferedFeatures);

            var measures = me.sumMeasurements(features);
            var data = {
                buffer: requestedBuffer,
                bufferedGeoJson: bufferedGeoJson,
                shape: me.getCurrentDrawShape()
            };

            if (measures.length) {
                data.length = measures.length;
            }
            if (measures.area) {
                data.area = measures.area;
            }

            var showMeasureUI = !!me.getOpts('showMeasureOnMap');
            if (showMeasureUI) {
                data.showMeasureOnMap = showMeasureUI;
            }
            if (options.clearCurrent) {
                me.clearDrawing(id);
            }
            if (options.isFinished) {
                isFinished = options.isFinished;
            }
            var event = Oskari.eventBuilder('DrawingEvent')(id, geojson, data, isFinished);
            me.getSandbox().notifyAll(event);
        },
        /**
         * @method getFeatures
         * -  gets features from layer
         *
         * @param {String} layerId
         * @return {Array} features
         */
        getFeatures: function (layerId) {
            var me = this,
                features = [],
                layer = me.getLayer(layerId);

            if (!layer) {
                return null;
            }

            var featuresFromLayer = me.getLayer(layerId).getSource().getFeatures();

            if (me._sketch && layerId === me.getCurrentLayerId()) {
                // include the unfinished (currently drawn) feature
                var sketchFeatId = me._sketch.getId();
                featuresFromLayer.forEach(function (f) {
                    // when modifying drawn feature, don't add dublicate feature
                    if (f.getId() !== sketchFeatId) {
                        features.push(f);
                    }
                });
                features.push(me._sketch);
            } else {
                featuresFromLayer.forEach(function (f) {
                    features.push(f);
                });
            }
            return features;
        },
        /**
         * @method getFeaturesAsGeoJSON
         * - converts features to GeoJson
         * - adds measurements (length/area) as properties
         * - adds buffer as property if buffer is defined
         *
         * @param {Array} features
         * @return {String} geojson
         */
        getFeaturesAsGeoJSON: function (features) {
            var me = this,
                geoJsonObject = {
                    type: 'FeatureCollection',
                    features: []
                },
                measures,
                jsonObject,
                buffer,
                i,
                feature;

            if (!features || features.length === 0) {
                return geoJsonObject;
            }
            // form multigeometry from features
            if (me.drawMultiGeom) {
                measures = me.sumMeasurements(features);
                var geometries = [];

                for (i = 0; i < features.length; i++) {
                    feature = features[i];
                    if (!buffer && feature.buffer) {
                        buffer = feature.buffer;
                    }
                    var geometry = feature.getGeometry();
                    geometries.push(geometry);
                }

                var multiGeometry = me.createMultiGeometry(geometries);

                feature = new olFeature({ geometry: multiGeometry });
                feature.setId(me.generateNewFeatureId());

                jsonObject = me.formJsonObject(feature, measures, buffer);
                geoJsonObject.features.push(jsonObject);
            } else {
                features.forEach(function (feature) {
                    if (feature.buffer) {
                        buffer = feature.buffer;
                    }
                    measures = me.sumMeasurements([feature]);

                    if (!me._featuresValidity[feature.getId()]) {
                        measures.area = me._loc.intersectionNotAllowed;
                    }
                    jsonObject = me.formJsonObject(feature, measures, buffer);
                    geoJsonObject.features.push(jsonObject);
                });
            }

            return geoJsonObject;
        },

        createMultiGeometry: function (geometries) {
            var coordinatesAgg = geometries.map(function (geometry) {
                return geometry.getCoordinates();
            });

            var featureGeom;

            switch (geometries[0].getType()) {
            case 'Point':
                featureGeom = new olGeom.MultiPoint(coordinatesAgg);
                break;
            case 'LineString':
                featureGeom = new olGeom.MultiLineString(coordinatesAgg);
                break;
            case 'Polygon':
                featureGeom = new olGeom.MultiPolygon(coordinatesAgg);
                break;
            default:
                throw new Error('Unsupported geometry type!');
            }

            return featureGeom;
        },

        formJsonObject: function (feature, measures, buffer) {
            var me = this,
                geoJSONformatter = new olFormatGeoJSON(),
                jsonObject = geoJSONformatter.writeFeatureObject(feature);
            jsonObject.properties = {};

            if (measures.length) {
                jsonObject.properties.length = measures.length;
            }
            if (!me._featuresValidity[feature.getId()]) {
                jsonObject.properties.area = me._loc.intersectionNotAllowed;
            } else if (measures.area) {
                jsonObject.properties.area = measures.area;
            }
            if (buffer) {
                jsonObject.properties.buffer = buffer;
            }
            return jsonObject;
        },

        /**
         * Calculates line length and polygon area as measurements
         * @param  {Array} features features with geometries
         * @return {Object} object with length and area keys with numbers as values indicating meters/m2.
         */
        sumMeasurements: function (features) {
            var me = this;
            var value = {};
            var mapmodule = this.getMapModule();
            features.forEach(function (f) {
                const geomType = f.getGeometry().getType();
                if (geomType === 'LineString' || geomType === 'Polygon') {
                    if (!value.length) {
                        value.length = 0;
                    }
                    value.length += mapmodule.getGeomLength(f.getGeometry());
                }
                if (me._featuresValidity[f.getId()] && geomType === 'Polygon') {
                    if (!value.area) {
                        value.area = 0;
                    }
                    value.area += mapmodule.getGeomArea(f.getGeometry());
                }
            });
            return value;
        },
        /**
         * @method addVectorLayer
         * -  adds a new layer to the map
         *
         * @param {String} layerId
         */
        addVectorLayer: function (layerId) {
            var me = this;
            var vector = new olLayerVector({
                id: layerId,
                source: new olSourceVector({ features: new olCollection() }),
                style: me._styles.draw
            });
            me.getMapModule().addOverlayLayer(vector);
            me._drawLayers[layerId] = vector;
        },
        /**
         * @method addDrawInteraction
         * -  activates draw control
         * @param {String} layerId
         * @param {String} shape
         * @param {Object} options
         */
        addDrawInteraction: function (layerId, shape, options) {
            var me = this;
            var geometryFunction, maxPoints;
            var functionalityId = this.getCurrentFunctionalityId();
            var geometryType = shape;
            var optionsForDrawingEvent = {
                isFinished: false
            };

            function makeClosedPolygonCoords (coords) {
                return coords.map(function (ring) {
                    ring = ring.slice();
                    ring.push(ring[0].slice());
                    return ring;
                });
            }
            if (shape === 'LineString') {
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.LineString(coordinates);
                    } else {
                        geometry.setCoordinates(coordinates);
                    }
                    if (options.buffer > 0) {
                        me.drawBufferedGeometry(geometry, options.buffer);
                    }
                    me.pointerMoveHandler();
                    me.sendDrawingEvent(functionalityId, optionsForDrawingEvent);
                    return geometry;
                };
            } else if (shape === 'Box') {
                maxPoints = 2;
                geometryType = 'LineString';
                geometryFunction = function (coordinates, geometry) {
                    var start = coordinates[0];
                    var end = coordinates[1];
                    var coords = [[start, [start[0], end[1]], end, [end[0], start[1]], start]];
                    if (!geometry) {
                        geometry = new olGeom.Polygon(coords);
                    } else {
                        geometry.setCoordinates(coords);
                    }

                    me.pointerMoveHandler();
                    me.sendDrawingEvent(functionalityId, optionsForDrawingEvent);
                    return geometry;
                };
            } else if (shape === 'Point') {
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.Point(coordinates);
                    }
                    if (options.buffer > 0) {
                        me.drawBufferedGeometry(geometry, options.buffer);
                    }
                    me.pointerMoveHandler();
                    me.sendDrawingEvent(me._id, optionsForDrawingEvent);
                    return geometry;
                };
            } else if (shape === 'Square') {
                geometryType = 'Circle';
                geometryFunction = createRegularPolygon(4);
            } else if (shape === 'Circle' && options.buffer > 0) {
                geometryType = 'Point';
                me._circleHasGeom = true;
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.Circle(coordinates, options.buffer);
                    }
                    me.pointerMoveHandler();
                    me.sendDrawingEvent(functionalityId, optionsForDrawingEvent);
                    return geometry;
                };
            } else if (shape === 'Circle' && !options.buffer) {
                geometryType = 'Circle';
                geometryFunction = createRegularPolygon(50);
            } else if (shape === 'Polygon') {
                geometryFunction = function (coordinates, geometry) {
                    var coords = makeClosedPolygonCoords(coordinates);
                    if (!geometry) {
                        geometry = new olGeom.Polygon(coords);
                    } else {
                        geometry.setCoordinates(coords);
                    }
                    if (options.selfIntersection !== false) {
                        me.checkIntersection(geometry);
                    }
                    me.pointerMoveHandler();
                    me.sendDrawingEvent(functionalityId, optionsForDrawingEvent);
                    return geometry;
                };
            }
            const opts = {
                features: me._drawLayers[layerId].getSource().getFeaturesCollection(),
                type: geometryType,
                style: me._styles.draw,
                geometryFunction: geometryFunction,
                maxPoints: maxPoints
            };

            if (!Oskari.util.isMobile(true)) {
                // use smaller snap tolerance on desktop
                opts.snapTolerance = 3;
            }
            var drawInteraction = new olInteractionDraw(opts);
            // does this need to be registered here and/or for each functionalityId?
            me._draw[functionalityId] = drawInteraction;

            me.getMap().addInteraction(drawInteraction);

            me.bindDrawStartEvent(drawInteraction, options);
            me.bindDrawEndEvent(drawInteraction, options, shape);

            if (options.showMeasureOnMap) {
                me.getMap().on('pointermove', me.pointerMoveHandler, me);
            }
        },
        /**
         * @method bindDrawStartEvent
         * -  binds drawstart event handling to interaction
         * @param {Object} options
         */
        bindDrawStartEvent: function (interaction, options) {
            var me = this;
            interaction.on('drawstart', function (evt) {
                me._showIntersectionWarning = false;
                // stop modify interaction while draw-mode is active
                me.removeInteractions(me._modify, me._id);
                me._mode = 'draw';
                var id = me.generateNewFeatureId();
                evt.feature.setId(id);
                me._sketch = evt.feature;
                if (options.allowMultipleDrawing === 'single') {
                    me.clearDrawing();
                }
                me.createDrawingTooltip(id);
            });
        },
        /**
         * @method bindDrawEndEvent
         * -  binds drawend event handling to interaction
         * @param {Object} options
         */
        bindDrawEndEvent: function (interaction, options, shape) {
            var me = this;
            interaction.on('drawend', function (evt) {
                var eventOptions = {
                    isFinished: true
                };
                me.sendDrawingEvent(me._id, eventOptions);
                me._showIntersectionWarning = true;
                me.pointerMoveHandler();
                me._mode = '';

                // stop drawing without modifying
                if (options.allowMultipleDrawing === false && options.modifyControl === false) {
                    // sketch needs to be nulled here if modify is not selected or the geometry loses the last drawn point
                    me._sketch = null;
                    me.stopDrawing(me._id, false);
                } else if (options.allowMultipleDrawing === false) {
                    // stop drawing and start modifying
                    me.removeInteractions(me._draw, me._id);
                }

                evt.feature.setStyle(me._styles.modify);
                // activate modify interaction after new drawing is finished
                if (options.modifyControl !== false) {
                    me.addModifyInteraction(me.getCurrentLayerId(), shape, options);
                }
                me._sketch = null;
            });
        },
        /**
         * @method checkIntersection
         * -  checks if geometry intersects itself
         * @param {ol/geom/Geometry} geometry
         * @param {Object} options
         */
        checkIntersection: function (geometry) {
            var me = this;
            var currentDrawing = me._sketch;
            if (!currentDrawing) {
                // intersection is allowed or geometry isn't being drawn currently
                return;
            }

            const coordinates = geometry.getCoordinates()[0];
            // This function is called twice when modifying geometry from the point where the drawing initially began
            // That is because the first and the last point of the geometry are being modified at the same time
            // The points should have identical values but in the first call they don't
            // So the first call is ignored by the if statement below since it would otherwise throw an error from a 3rd party library
            if (hasEnoughCoordinatesForArea(coordinates) && firstAndLastCoordinatesEqual(coordinates)) {
                if (!isValidOp.isValid(olParser.read(geometry))) {
                    // lines intersect -> problem!!
                    currentDrawing.setStyle(me._styles.intersect);
                    me._featuresValidity[currentDrawing.getId()] = false;
                    return;
                }
            }
            // geometry is valid
            if (geometry.getArea() > 0) {
                if (me.isCurrentlyDrawing()) {
                    currentDrawing.setStyle(me._styles.draw);
                } else {
                    currentDrawing.setStyle(me._styles.modify);
                }
                me._featuresValidity[currentDrawing.getId()] = true;
            }
        },
        /**
         * @method pointerMoveHandler - pointer moving handler for displaying
         * - displays measurement result on feature
         * @param {ol/MapBrowserEvent} evt
         */
        pointerMoveHandler: function (evt) {
            if (!this._sketch || !this.getOpts('showMeasureOnMap')) {
                // if no drawing of we don't want to show it on map -> skip
                return;
            }
            this.updateDrawingTooltip(this._sketch);
        },
        updateDrawingTooltip: function (feature) {
            const id = feature.getId();
            const overlay = this._overlays[id];
            if (!overlay) {
                // no overlay to update
                return;
            }
            const geom = feature.getGeometry();
            const mapmodule = this.getMapModule();
            let output = '';
            let tooltipCoord;
            if (geom instanceof olGeom.Polygon) {
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
                // for Polygon-drawing checking itself-intersection
                if (this._featuresValidity[id] === false) {
                    if (this._showIntersectionWarning) {
                        output = this._loc.intersectionNotAllowed;
                    }
                } else {
                    // all good - get actual measurement
                    const area = mapmodule.getGeomArea(geom);
                    output = mapmodule.formatMeasurementResult(area, 'area');
                }
            } else if (geom instanceof olGeom.LineString) {
                const length = mapmodule.getGeomLength(geom);
                output = mapmodule.formatMeasurementResult(length, 'line');
                tooltipCoord = geom.getLastCoordinate();
            }
            if (!tooltipCoord) {
                // we don't know where we should show this
                return;
            }
            const elem = overlay.getElement();
            elem.innerHTML = output;
            if (output === '') {
                elem.classList.add('withoutText');
            } else {
                elem.classList.remove('withoutText');
            }
            overlay.setPosition(tooltipCoord);
        },
        /**
         * @method addModifyInteraction
         * -  activates modify control
         * @param {String} layerId
         * @param {String} shape
         * @param {Object} options
         */
        addModifyInteraction: function (layerId, shape, options) {
            const me = this;
            const layer = me.getLayer(layerId);
            if (layer) {
                me._modify[me._id] = new olInteractionModify({
                    features: layer.getSource().getFeaturesCollection(),
                    style: me._styles.modify,
                    deleteCondition: function (event) {
                        return olEventsCondition.shiftKeyOnly(event) && olEventsCondition.singleClick(event);
                    }
                });
                if (options.showMeasureOnMap) {
                    layer.getSource().forEachFeature(f => {
                        this.createDrawingTooltip(f.getId());
                        this.updateDrawingTooltip(f);
                    });
                }
            }
            me.modifyStartEvent(shape, options);
            me.getMap().on('pointermove', me.pointerMoveHandler, me);
            me.getMap().addInteraction(me._modify[me._id]);
        },
        /**
         * @method drawBufferedGeometry
         * -  adds buffered feature to the map
         *
         * @param {Geometry} geometry
         * @param {Number} buffer
         */
        drawBufferedGeometry: function (geometry, buffer) {
            var bufferedFeature = this.getBufferedFeature(geometry, buffer, this._styles.draw, this._options.bufferAccuracy);
            this.getBufferedFeatureLayer().getSource().getFeaturesCollection().clear();
            this.getBufferedFeatureLayer().getSource().getFeaturesCollection().push(bufferedFeature);
        },
        /**
         * @method modifyStartEvent
         * -  triggered upon feature modification start
         * @param {String} shape
         * @param {Object} options
         */
        modifyStartEvent: function (shape, options) {
            var me = this;

            // if modifyend didn't get called for some reason, nullify the old listeners to be on the safe side
            if (me.modifyFeatureChangeEventCallback) {
                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
            }
            me._modify[me._id].on('modifystart', function () {
                me._showIntersectionWarning = false;
                me._mode = 'modify';

                me.modifyFeatureChangeEventCallback = function (evt) {
                    // turn off changehandler in case something we touch here triggers a change event -> avoid eternal loop
                    me.toggleDrawLayerChangeFeatureEventHandler(false);
                    me._sketch = evt.feature;
                    if (shape === 'LineString') {
                        if (options.buffer > 0) {
                            me.drawBufferedGeometry(evt.feature.getGeometry(), options.buffer);
                        }
                    } else if (shape === 'Point' && options.buffer > 0) {
                        me.drawBufferedGeometry(evt.feature.getGeometry(), options.buffer);
                    } else if (shape === 'Polygon' && options.selfIntersection !== false) {
                        me.checkIntersection(me._sketch.getGeometry());
                    }
                    me.pointerMoveHandler();
                    me.sendDrawingEvent(me._id, options);
                    // probably safe to start listening again
                    me.toggleDrawLayerChangeFeatureEventHandler(true);
                };
                me.toggleDrawLayerChangeFeatureEventHandler(true);
            });
            me._modify[me._id].on('modifyend', function () {
                me._showIntersectionWarning = true;
                me._mode = '';
                me._sketch = null;

                // send isFinished when user stops modifying the feature
                // (the user might make another edit, but at least he/she let go of the mouse button etc)
                var opts = jQuery.extend({}, options);
                opts.isFinished = true;
                me.sendDrawingEvent(me._id, opts);

                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
            });
        },
        toggleDrawLayerChangeFeatureEventHandler: function (enable) {
            var me = this,
                layer = me.getLayer(me.getCurrentLayerId());
            if (layer) {
                if (enable) {
                    layer.getSource().on('changefeature', me.modifyFeatureChangeEventCallback, me);
                } else {
                    layer.getSource().un('changefeature', me.modifyFeatureChangeEventCallback, me);
                }
            }
        },
        /**
         * @method getBufferedFeature
         * -  creates buffered feature using given geometry and buffer. If style is given, adds style to feature
         *
         * @param {Geometry} geometry
         * @param {Number} buffer
         * @param {ol/style/Style} style
         * @param {Number} side amount of polygon
         * @return {ol/Feature} feature
         */
        getBufferedFeature: function (geometry, buffer, style, sides) {
            var input = olParser.read(geometry);
            var bufferGeometry = BufferOp.bufferOp(input, buffer, new BufferParameters(sides));
            bufferGeometry.CLASS_NAME = 'jsts.geom.Polygon';
            bufferGeometry = olParser.write(bufferGeometry);
            var feature = new olFeature({
                geometry: bufferGeometry
            });
            feature.setStyle(style);
            feature.buffer = buffer;
            return feature;
        },
        /**
         * @method removeInteractions
         * -  removes draw and modify controls
         * @param {String} id
         */
        removeInteractions: function (interaction, id) {
            var me = this;
            if (!id || id === undefined || id === '') {
                Object.keys(interaction).forEach(function (key) {
                    me.getMap().removeInteraction(interaction[key]);
                });
            } else {
                me.getMap().removeInteraction(interaction[id]);
            }
        },
        /**
         * @method reportDrawingEvents
         * -  reports draw and modify control's events
         */
        reportDrawingEvents: function () {
            var me = this;

            if (me._draw[me._id]) {
                me._draw[me._id].on('drawstart', function () {
                    Oskari.log('DrawPlugin').debug('drawstart');
                });
                me._draw[me._id].on('drawend', function () {
                    Oskari.log('DrawPlugin').debug('drawend');
                });
                me._draw[me._id].on('change:active', function () {
                    Oskari.log('DrawPlugin').debug('drawchange');
                });
            }
            if (me._modify[me._id]) {
                me._modify[me._id].on('modifystart', function () {
                    Oskari.log('DrawPlugin').debug('modifystart');
                });
                me._modify[me._id].on('change', function () {
                    Oskari.log('DrawPlugin').debug('modifychange');
                });

                me._modify[me._id].on('modifyend', function () {
                    Oskari.log('DrawPlugin').debug('modifyend');
                });
            }
        },
        /**
         * @method  @private _getFeatureCenter get feature center coordinates.
         * @param  {ol/feature} feature feature where need to get center point
         * @return {Array} coordinates array
         */
        _getFeatureCenter: function (feature) {
            // Circle has (multi)polygon or (multi)point ol type and it center need calculated different way
            if (feature.getGeometry().getType().indexOf('Polygon') > -1 || feature.getGeometry().getType().indexOf('Point') > -1) {
                return olExtent.getCenter(feature.getGeometry().getExtent());
            }
            return feature.getGeometry().getCenter();
        },
        /**
         * @method  @private _getFeatureRadius get circle/point geometry radius.
         * @param  {ol/feature} feature fetarue where need to get circle radius
         * @return {Number}     circle radius
         */
        _getFeatureRadius: function (feature) {
            var type = feature.getGeometry().getType();
            // If circle ol geometry type is polygon then calculate radius
            if (type === 'Polygon') {
                return Math.sqrt(feature.getGeometry().getArea() / Math.PI);
            } else if (type === 'Circle') {
                return feature.getGeometry().getRadius();
            }
            // else if drawing point, radius is 0
            return 0;
        },
        /**
         * [getCircleFeature description]
         * @param  {Array} features
         * @return {Array}  polygon or point features
         */
        getCircleFeature: function (features) {
            var me = this;
            if (me.getCurrentDrawShape() === 'Point') {
                return me.getCircleAsPointFeature(features);
            }
            return me.getCircleAsPolygonFeature(features);
        },
        /**
         * @method getCircleAsPolygonFeature
         * - converts circle geometry to polygon geometry
         *
         * @param {Array} features
         * @return {Array} polygonfeatures
         */
        getCircleAsPolygonFeature: function (features, requestedBuffer) {
            var me = this;
            var polygonFeatures = [];
            if (!features) {
                return polygonFeatures;
            }
            features.forEach(function (f) {
                var pointFeature = new olGeom.Point(me._getFeatureCenter(f));
                var buffer = requestedBuffer || me._getFeatureRadius(f); // requested buffer is used for circle radius
                var bufferedFeature = me.getBufferedFeature(pointFeature, buffer, me._styles.draw, me._options.bufferAccuracy);
                var id = me.generateNewFeatureId();
                bufferedFeature.setId(id);
                me._featuresValidity[id] = true;
                polygonFeatures.push(bufferedFeature);
            });
            return polygonFeatures;
        },
        /**
         * @method getCircleAsPointFeature
         * - converts circle geometry to point geometry
         *
         * @param {Array} features
         * @return {Array} pointFeatures
         */
        getCircleAsPointFeature: function (features) {
            var me = this;
            var pointFeatures = [];
            if (!features) {
                return pointFeatures;
            }
            features.forEach(function (f) {
                var feature = new olFeature({
                    geometry: new olGeom.Point(me._getFeatureCenter(f))
                });
                me.addBufferPropertyToFeatures([feature], me._getFeatureRadius(f));
                pointFeatures.push(feature);
            });
            return pointFeatures;
        },
        /**
         * @method addBufferPropertyToFeatures
         * - adds buffer property to given features. This is needed for converting buffered Point and buffered LineString to geoJson
         *
         * @param {Array} features
         * @param {Number} buffer
         */
        addBufferPropertyToFeatures: function (features, buffer) {
            if (features && buffer) {
                features.forEach(function (f) {
                    f.buffer = buffer;
                });
            }
        },
        /** @method createDrawingTooltip
       * - creates a new tooltip on drawing
       */
        createDrawingTooltip: function (id) {
            if (this._overlays[id]) {
                // already added to map
                return;
            }
            const tooltipClass = this._tooltipClassForMeasure + ' ' + this.getCurrentDrawShape() + ' ' + id;
            var tooltipElement = document.createElement('div');
            tooltipElement.className = tooltipClass;
            var tooltip = new olOverlay({
                element: tooltipElement,
                offset: [0, -5],
                positioning: 'bottom-center',
                id: id
            });
            tooltipElement.parentElement.style.pointerEvents = 'none';
            tooltip.id = id;
            this.getMap().addOverlay(tooltip);
            this._overlays[id] = tooltip;
        },
        removeDrawingTooltip: function (id) {
            const overlay = this._overlays[id];
            if (!overlay) {
                return;
            }
            this.getMap().removeOverlay(overlay);
            delete this._overlays[id];
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
    });
