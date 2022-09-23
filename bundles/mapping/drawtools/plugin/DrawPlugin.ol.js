import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import * as olExtent from 'ol/extent';
import olInteractionDraw, { createRegularPolygon, createBox } from 'ol/interaction/Draw';
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

const INVALID_REASONS = {
    INTERSECTION: 'intersectionNotAllowed',
    AREA_SIZE: 'invalidAreaSize',
    LINE_LENGTH: 'invalidLineLenght'
};
const OPTIONS = {
    drawControl: true,
    modifyControl: true,
    allowMultipleDrawing: true,
    showMeasureOnMap: false,
    buffer: 0,
    bufferAccuracy: 10 // is number of line segments used to represent a quadrant circle
};
const isModifyLimited = shape => ['Square', 'Circle', 'Box'].some(s => s === shape);

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
        this._styles = {};
        this._drawLayers = {};
        this._overlays = {};
        this._drawFeatureIdSequence = 0;
        this._tooltipClassForMeasure = 'drawplugin-tooltip-measure';
        this._mode = '';
        this._invalidFeatures = {}; // id: INVALID_REASON
        // TODO: figure out why we have some variables that are "globally reset" and some that are functionality id specific.
        // As some are "global"/shared between functionalities resuming a previous id will probably NOT work the way expected
        //  and storing these for each id is probably not needed.
        this._draw = {};
        this._modify = {};
        this._functionalityIds = {};
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
        this.loc = Oskari.getMsg.bind(null, 'DrawTools');
    },
    {
        /**
         * @method setStyles
         * - set styles for draw, modify and invalid
         *
         * @param {Object} styles. If not given, will set default styles
         */
        setStyles: function (styles = {}) {
            const setStyle = (type, defForType = {}) => {
                // overriding default style configured style
                const styleDef = jQuery.extend({}, this._defaultStyle, defForType);
                this._styles[type] = this.getMapModule().getStyle(styleDef);
            };
            // setting default style for draw, modify and invalid
            ['draw', 'modify'].forEach(type => setStyle(type, styles[type]));
            // style def for invalid can be intersect or invalid in request
            const invalid = styles.invalid || styles.intersect;
            setStyle('invalid', invalid);
            setStyle('temp', styles.modify);
        },
        setDefaultStyle: function (style) {
            this._defaultStyle = style;
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
         *                  {Boolean} showMeasureOnMap: true - if measure result should be displayed on map near drawing feature.
         *                  {Boolean} drawControl: true - will activate draw control, false - will not activate.
         *                  {Boolean} modifyControl: true - will activate modify control, false, will not activate.
         *                  {String} geojson: geojson for editing. If not given, will activate draw/modify control according to given shape.
         *                  {Boolean} selfIntersection: true - user will see warning text if polygon has self-intersection. Features will be not sended to event before polygon is valid. false - itself intersection will be not checked.
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
            // disable gfi
            me.getMapModule().setDrawingMode(true);

            me.removeInteractions(me._draw, me._id);
            me.removeInteractions(me._modify, me._id);
            this._cleanupInternalState();

            me._shape = shape;

            // setup functionality id
            me._id = id;
            // setup options
            const { geojson, style, ...opts } = options;
            this.initOptions(opts);
            // this sets styles for this and all the following requests (not functionality id specific, written to "class variables")
            this.setStyles(style);

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
                me.drawShape(shape, geojson);
            } else {
                // if shape == undefined -> update buffer for existing drawing (any other reason for this? text etc?)
            }
        },
        initOptions: function (options) {
            const { selfIntersection = true, limits: optLimits = {}, ...rest } = options;
            const limits = {
                selfIntersection,
                ...optLimits
            };
            this._options = { ...OPTIONS, ...rest, limits };
        },
        /**
         * @method drawShape
         * - activates draw/modify controls. If geojson is given, setup editing it
         *
         * @param {String} shape
         * @param {Object} geojson optional feature for editing
         */
        drawShape: function (shape, geojson) {
            if (geojson) {
                const jsonFormat = new olFormatGeoJSON();
                let featuresFromJson = jsonFormat.readFeatures(geojson);
                // parse multi geometries to single geometries
                if (this.drawMultiGeom) {
                    featuresFromJson = this.parseMultiGeometries(featuresFromJson);
                }
                featuresFromJson.forEach(f => {
                    if (!f.getId()) {
                        f.setId(this.generateNewFeatureId());
                    }
                    this.handleFinishedDrawing(f, true);
                });
                this.getCurrentDrawLayer().getSource().addFeatures(featuresFromJson);
            }
            const { drawControl, modifyControl } = this.getOpts();
            if (drawControl) {
                this.addDrawInteraction(this.getCurrentLayerId(), shape);
            }
            if (modifyControl) {
                this.addModifyInteraction(this.getCurrentLayerId(), shape);
            }
        },
        // used only for editing multigeometries (allowMultipleDrawing === 'multiGeom')
        parseMultiGeometries: function (features) {
            const createFeatures = geometries => geometries.map(geometry => new olFeature({ geometry }));

            return features.flatMap(feat => {
                const geom = feat.getGeometry();
                const type = geom.getType();
                if (type === 'MultiPoint') {
                    return createFeatures(geom.getPoints());
                }
                if (type === 'MultiLineString') {
                    return createFeatures(geom.getLineStrings());
                }
                if (type === 'MultiPolygon') {
                    return createFeatures(geom.getPolygons());
                }
                return feat;
            });
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
         * @return {Any}
         */
        getOpts: function (key) {
            if (key) {
                return this._options[key];
            }
            return this._options;
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
         */
        stopDrawing: function (id, clearCurrent, supressEvent) {
            const me = this;

            if (!me.getLayerIdForFunctionality(id)) {
                // layer not found for functionality id
                // clear drawings from all drawing layers
                me.clearDrawing();
                return;
            }
            if (clearCurrent) {
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
            }
            if (!supressEvent) {
                me.sendDrawingEvent(true);
            }
            // deactivate draw and modify controls
            me.removeInteractions(me._draw, id);
            me.removeInteractions(me._modify, id);
            me._cleanupInternalState();
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
            if (!this._sketch) {
                return;
            }
            const feature = this._sketch;
            const geom = feature.getGeometry();
            const source = this.getCurrentDrawLayer().getSource();

            if (geom.getType() === 'LineString') {
                const coords = geom.getCoordinates();
                if (coords.length > 2) {
                    const parsedCoords = coords.slice(0, coords.length - 1); // remove last point
                    geom.setCoordinates(parsedCoords);
                    feature.setStyle(this._styles.modify);
                    source.addFeature(feature);
                    this.updateMeasurementTooltip(feature);
                } else {
                    // cannot finish geometry, remove measurement result from map
                    this._cleanupInternalState();
                }
            } else if (geom.getType() === 'Polygon') {
                // only for exterior linear ring, drawtools doesn't support linear rings (holes)
                const coords = geom.getCoordinates()[0];
                if (coords.length > 4) {
                    const parsedCoords = coords.slice(0, coords.length - 2); // remove second last point
                    parsedCoords.push(coords[coords.length - 1]); // add last point to close linear ring
                    geom.setCoordinates([parsedCoords]); // add parsed exterior linear ring
                    feature.setStyle(this._styles.modify);
                    source.addFeature(feature);
                    this.updateMeasurementTooltip(feature);
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
         * @param {Boolean} isFinished  true - if drawing is completed. Default is false.
         */
        sendDrawingEvent: function (isFinished = false) {
            let bufferedFeatures = [];
            const id = this.getCurrentFunctionalityId();
            const layerId = this.getLayerIdForFunctionality(id);
            const requestedBuffer = this.getOpts('buffer');
            let features = this.getFeatures(layerId);
            if (!isFinished && this._sketch) {
                const id = this._sketch.getId();
                features = features.filter(f => f.getId() !== id);
                features.push(this._sketch);
            }

            if (!features) {
                Oskari.log('DrawPlugin').debug('Layer "' + layerId + '" has no features, not send drawing event.');
                return;
            }

            if (requestedBuffer > 0) {
                // TODO: check the ifs below if they should only be run if buffer is used
                // TODO: doesn't work for multi drawing because buffered layer contains only currently drawn feature
                bufferedFeatures = this.getFeatures(this._bufferedFeatureLayerId);
            }

            switch (this.getCurrentDrawShape()) {
            case 'Point':
            case 'LineString':
                if (requestedBuffer > 0) {
                    this.addBufferPropertyToFeatures(features, requestedBuffer);
                }
                break;
            case 'Circle':
                // Do common stuff
                // buffer is used for circle's radius
                if (requestedBuffer > 0) {
                    features = features.map(feat => this.getCircleAsPolygonFeature(feat));
                    bufferedFeatures = features; // or = [];
                }
                break;
            }

            const geojson = this.getFeaturesAsGeoJSON(features);
            const bufferedGeoJson = this.getFeaturesAsGeoJSON(bufferedFeatures);

            const measures = this.sumMeasurements(features);
            const data = {
                buffer: requestedBuffer,
                bufferedGeoJson: bufferedGeoJson,
                shape: this.getCurrentDrawShape(),
                showMeasureOnMap: this.getOpts('showMeasureOnMap')
            };

            if (measures.length) {
                data.length = measures.length;
            }
            if (measures.area) {
                data.area = measures.area;
            }
            const event = Oskari.eventBuilder('DrawingEvent')(id, geojson, data, isFinished);
            this.getSandbox().notifyAll(event);
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
                    crs: this._getSRS(),
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
            const geoJSONformatter = new olFormatGeoJSON();
            const jsonObject = geoJSONformatter.writeFeatureObject(feature);

            const id = feature.getId();
            const valid = this.isFeatureValid(id);
            const invalidReason = this.getInvalidReasonMessage(id);
            const properties = { valid };

            if (measures.length) {
                properties.length = valid ? measures.length : invalidReason;
            }
            if (measures.area) {
                properties.area = valid ? measures.area : invalidReason;
            }
            if (buffer) {
                properties.buffer = buffer;
            }

            jsonObject.properties = properties;
            return jsonObject;
        },

        /**
         * Calculates line length and polygon area as measurements
         * @param  {Array} features features with geometries
         * @return {Object} object with length and area keys with numbers as values indicating meters/m2.
         */
        sumMeasurements: function (features) {
            let area = 0;
            let length = 0;
            const mapmodule = this.getMapModule();
            features.forEach(function (f) {
                const geom = f.getGeometry();
                const geomType = geom.getType();
                if (geomType === 'LineString') {
                    length += mapmodule.getGeomLength(geom);
                } else if (geomType === 'Polygon') {
                    const line = new olGeom.LineString(geom.getCoordinates()[0]);
                    length += mapmodule.getGeomLength(line);
                    area += mapmodule.getGeomArea(geom);
                }
            });
            return { area, length };
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
        addDrawInteraction: function (layerId, shape) {
            const { buffer } = this.getOpts();
            var me = this;
            var geometryFunction, maxPoints;
            var functionalityId = this.getCurrentFunctionalityId();
            var geometryType = shape;

            function makeClosedPolygonCoords (coords) {
                return coords.map(function (ring) {
                    ring = ring.slice();
                    ring.push(ring[0].slice());
                    return ring;
                });
            }
            const notifyChange = () => {
                this.updateMeasurementTooltip();
                this.sendDrawingEvent();
            };
            const getReqularPolygonGeometryFunction = sides => {
                const geometryFunction = createRegularPolygon(sides);
                return (...args) => {
                    const geometry = geometryFunction(...args);
                    notifyChange();
                    return geometry;
                };
            };
            if (shape === 'LineString') {
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.LineString(coordinates);
                    } else {
                        geometry.setCoordinates(coordinates);
                    }
                    if (buffer > 0) {
                        me.drawBufferedGeometry(geometry);
                    }
                    notifyChange();
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
                    notifyChange();
                    return geometry;
                };
            } else if (shape === 'Point') {
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.Point(coordinates);
                    }
                    if (buffer > 0) {
                        me.drawBufferedGeometry(geometry, buffer);
                    }
                    notifyChange();
                    return geometry;
                };
            } else if (shape === 'Square') {
                geometryType = 'Circle';
                geometryFunction = getReqularPolygonGeometryFunction(4);
            } else if (shape === 'Circle' && buffer > 0) {
                geometryType = 'Point';
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.Circle(coordinates, buffer);
                    }
                    notifyChange();
                    return geometry;
                };
            } else if (shape === 'Circle' && !buffer) {
                geometryType = 'Circle';
                geometryFunction = getReqularPolygonGeometryFunction(50);
            } else if (shape === 'Polygon') {
                geometryFunction = function (coordinates, geometry) {
                    var coords = makeClosedPolygonCoords(coordinates);
                    if (!geometry) {
                        geometry = new olGeom.Polygon(coords);
                    } else {
                        geometry.setCoordinates(coords);
                    }
                    me.checkIntersection();
                    notifyChange();
                    return geometry;
                };
            }
            const drawOpts = {
                features: me._drawLayers[layerId].getSource().getFeaturesCollection(),
                type: geometryType,
                style: me._styles.draw,
                geometryFunction: geometryFunction,
                maxPoints: maxPoints
            };

            if (!Oskari.util.isMobile(true)) {
                // use smaller snap tolerance on desktop
                drawOpts.snapTolerance = 3;
            }
            var drawInteraction = new olInteractionDraw(drawOpts);
            // does this need to be registered here and/or for each functionalityId?
            me._draw[functionalityId] = drawInteraction;

            me.getMap().addInteraction(drawInteraction);

            me.bindDrawStartEvent(drawInteraction);
            me.bindDrawEndEvent(drawInteraction, shape);
        },
        /**
         * @method bindDrawStartEvent
         * -  binds drawstart event handling to interaction
         */
        bindDrawStartEvent: function (interaction) {
            var me = this;
            interaction.on('drawstart', function (evt) {
                // stop modify interaction while draw-mode is active
                me.removeInteractions(me._modify, me._id);
                me._mode = 'draw';
                evt.feature.setId(me.generateNewFeatureId());
                me._sketch = evt.feature;
                if (me.getOpts('allowMultipleDrawing') === 'single') {
                    me.clearDrawing();
                }
            });
        },
        /**
         * @method bindDrawEndEvent
         * -  binds drawend event handling to interaction
         * @param {Object} options
         */
        bindDrawEndEvent: function (interaction, shape) {
            const me = this;
            const { modifyControl, allowMultipleDrawing } = this.getOpts();
            interaction.on('drawend', function (evt) {
                me.handleFinishedDrawing();

                if (allowMultipleDrawing === false && !modifyControl) {
                    // stop drawing without modifying
                    me.stopDrawing(me.getCurrentFunctionalityId());
                    return;
                }
                if (allowMultipleDrawing === false) {
                    // stop drawing and start modifying
                    me.removeInteractions(me._draw, me._id);
                }

                evt.feature.setStyle(me._styles.modify);
                // activate modify interaction after new drawing is finished
                if (modifyControl !== false) {
                    me.addModifyInteraction(me.getCurrentLayerId(), shape);
                }
            });
        },
        handleFinishedDrawing: function (feature = this._sketch, suppressEvent) {
            this._mode = '';
            if (!this.validateGeometry(feature)) {
                this.updateTooltip(feature, this.getInvalidReasonMessage(feature.getId()));
            } else if (this.getOpts('showMeasureOnMap')) {
                this.updateMeasurementTooltip(feature);
            } else {
                this.updateTooltip(feature);
            }
            if (!suppressEvent) {
                this.sendDrawingEvent(true);
            }
            this._sketch = null;
        },
        setFeatureValidity: function (id, invalidReason) {
            // For now handles only one reason in order: intersection, size/length
            if (invalidReason) {
                this._invalidFeatures[id] = invalidReason;
                return;
            }
            delete this._invalidFeatures[id];
        },
        isFeatureValid: function (id) {
            return !this._invalidFeatures[id];
        },
        getInvalidReasonMessage: function (id) {
            const reason = this._invalidFeatures[id];
            if (!reason) {
                return '';
            }
            if (reason === INVALID_REASONS.LINE_LENGTH) {
                const { line } = this.getOpts('limits');
                const length = this.getMapModule().formatMeasurementResult(line, 'line');
                return this.loc(reason, { length });
            }
            if (reason === INVALID_REASONS.AREA_SIZE) {
                const { area } = this.getOpts('limits');
                const size = this.getMapModule().formatMeasurementResult(area, 'area');
                return this.loc(reason, { size });
            }
            return this.loc(reason);
        },
        validateGeometry: function (feature) {
            const limits = this.getOpts('limits');
            if (!limits || !feature) {
                return;
            }

            const id = feature.getId();
            const geometry = feature.getGeometry();
            const type = geometry.getType();
            const mapmodule = this.getMapModule();

            let invalidReason;
            if (type === 'Polygon') {
                if (this.checkIntersection()) {
                    invalidReason = INVALID_REASONS.INTERSECTION;
                } else if (limits.area) {
                    const area = mapmodule.getGeomArea(geometry);
                    if (area > limits.area) {
                        invalidReason = INVALID_REASONS.AREA_SIZE;
                    }
                }
            }
            if (limits.line && type === 'LineString') {
                const length = mapmodule.getGeomLength(geometry);
                if (length > limits.line) {
                    invalidReason = INVALID_REASONS.LINE_LENGTH;
                }
            }
            this.setFeatureValidity(id, invalidReason);
            return !invalidReason;
        },
        /**
         * @method checkIntersection
         * -  checks if feature's geometry intersects itself
         * @param {ol/Feature} feature
         * @param {Object} options
         */
        checkIntersection: function (feature) {
            if (!this.getOpts('limits').selfIntersection) {
                return false;
            }
            const currentDrawing = feature || this._sketch;
            if (!currentDrawing) {
                return false;
            }
            const geometry = currentDrawing.getGeometry();
            const coordinates = geometry.getCoordinates()[0];
            const id = currentDrawing.getId();
            // This function is called twice when modifying geometry from the point where the drawing initially began
            // That is because the first and the last point of the geometry are being modified at the same time
            // The points should have identical values but in the first call they don't
            // So the first call is ignored by the if statement below since it would otherwise throw an error from a 3rd party library
            if (hasEnoughCoordinatesForArea(coordinates) && firstAndLastCoordinatesEqual(coordinates)) {
                if (!isValidOp.isValid(olParser.read(geometry))) {
                    // lines intersect -> problem!!
                    currentDrawing.setStyle(this._styles.invalid);
                    this.setFeatureValidity(id, INVALID_REASONS.INTERSECTION);
                    return true;
                }
            }
            // geometry is valid
            if (geometry.getArea() > 0) {
                if (this.isCurrentlyDrawing()) {
                    currentDrawing.setStyle(this._styles.draw);
                } else {
                    currentDrawing.setStyle(this._styles.modify);
                }
                this.setFeatureValidity(id);
            }
            return false;
        },
        updateMeasurementTooltip: function (feature = this._sketch) {
            if (!feature || !this.getOpts('showMeasureOnMap')) {
                return;
            }
            if (this._invalidFeatures[feature.getId()] === INVALID_REASONS.INTERSECTION) {
                // remove measurement for self intersecting geometries while drawing/modifying
                if (this.isCurrentlyDrawing() || this.isCurrentlyModifying()) {
                    this.updateTooltip(feature);
                }
                return;
            }

            const mapmodule = this.getMapModule();
            const geom = feature.getGeometry();
            let output = '';
            if (geom instanceof olGeom.Polygon) {
                const area = mapmodule.getGeomArea(geom);
                output = mapmodule.formatMeasurementResult(area, 'area');
            } else if (geom instanceof olGeom.LineString) {
                const length = mapmodule.getGeomLength(geom);
                output = mapmodule.formatMeasurementResult(length, 'line');
            }
            this.updateTooltip(feature, output);
        },
        updateTooltip: function (feature = this._sketch, text = '') {
            if (!feature) {
                return;
            }
            const overlay = this.getDrawingTooltip(feature.getId());
            const geom = feature.getGeometry();
            let tooltipCoord;
            if (geom instanceof olGeom.Polygon) {
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof olGeom.LineString) {
                tooltipCoord = geom.getLastCoordinate();
            }
            if (tooltipCoord) {
                overlay.setPosition(tooltipCoord);
            }
            const elem = overlay.getElement();
            elem.innerHTML = text;
            if (text) {
                elem.classList.remove('withoutText');
            } else {
                elem.classList.add('withoutText');
            }
        },
        /**
         * @method addModifyInteraction
         * -  activates modify control
         * @param {String} layerId
         * @param {String} shape
         * @param {Object} options
         */
        addModifyInteraction: function (layerId, shape) {
            const me = this;
            const layer = me.getLayer(layerId);
            if (layer) {
                me._modify[me._id] = new olInteractionModify({
                    features: layer.getSource().getFeaturesCollection(),
                    style: me._styles.modify,
                    insertVertexCondition: isModifyLimited(shape) ? olEventsCondition.never : olEventsCondition.always,
                    deleteCondition: function (event) {
                        return olEventsCondition.shiftKeyOnly(event) && olEventsCondition.singleClick(event);
                    }
                });
            }
            me.modifyStartEvent(shape);
            me.getMap().addInteraction(me._modify[me._id]);
        },
        /**
         * @method drawBufferedGeometry
         * -  adds buffered feature to the map
         *
         * @param {Geometry} geometry
         */
        drawBufferedGeometry: function (geometry) {
            const bufferedFeature = this.getBufferedFeature(geometry);
            this.getBufferedFeatureLayer().getSource().getFeaturesCollection().clear();
            this.getBufferedFeatureLayer().getSource().getFeaturesCollection().push(bufferedFeature);
        },
        /**
         * @method modifyStartEvent
         * -  triggered upon feature modification start
         * @param {String} shape
         * @param {Object} options
         */
        modifyStartEvent: function (shape) {
            var me = this;

            // if modifyend didn't get called for some reason, nullify the old listeners to be on the safe side
            if (me.modifyFeatureChangeEventCallback) {
                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
            }

            let dragCoord;
            let startCoord;
            const updateDragCoord = evt => (dragCoord = evt.coordinate);
            const tempStyle = this._styles.temp[0];
            const { buffer } = this.getOpts();
            me._modify[me._id].on('modifystart', function (evt) {
                const feature = evt.features.item(0);
                me._mode = 'modify';
                if (isModifyLimited(shape)) {
                    dragCoord = evt.mapBrowserEvent.coordinate;
                    if (shape === 'Box') {
                        const coords = feature.getGeometry().getCoordinates()[0].slice(0, 4);
                        const mapmodule = me.getMapModule();
                        let maxDistance = 0;
                        coords.forEach(coord => {
                            const dist = mapmodule.getGeomLength(new olGeom.LineString([coord, dragCoord]));
                            if (dist > maxDistance) {
                                maxDistance = dist;
                                startCoord = coord;
                            }
                        });
                    } else {
                        startCoord = me._getFeatureCenter(feature);
                    }
                    const tempFeature = new olFeature();
                    tempFeature.setId(feature.getId());
                    // use temp feature as sketch to get correct measurements and geojson to unfinished event
                    me._sketch = tempFeature;
                    me.getMap().on('pointerdrag', updateDragCoord);
                } else {
                    me._sketch = feature;
                }

                me.modifyFeatureChangeEventCallback = function ({ feature }) {
                    // turn off changehandler in case something we touch here triggers a change event -> avoid eternal loop
                    me.toggleDrawLayerChangeFeatureEventHandler(false);
                    if (shape === 'LineString') {
                        if (buffer > 0) {
                            me.drawBufferedGeometry(feature.getGeometry());
                        }
                    } else if (shape === 'Point' && buffer > 0) {
                        me.drawBufferedGeometry(feature.getGeometry());
                    } else if (shape === 'Polygon') {
                        me.checkIntersection();
                    } else if (isModifyLimited(shape)) {
                        const geomToRender = me.getModifiedGeometry(startCoord, dragCoord);
                        // set rendered geometry to sketch to get correct measurements and geojson to unfinished event
                        me._sketch.setGeometry(geomToRender);
                        // modify interaction updates feature geometry so we can't set new geometry to feature
                        // use style to render new geometry instead of actual
                        tempStyle.setGeometry(geomToRender);
                        feature.setStyle(tempStyle);
                    }
                    me.updateMeasurementTooltip();
                    me.sendDrawingEvent();
                    // probably safe to start listening again
                    me.toggleDrawLayerChangeFeatureEventHandler(true);
                };
                me.toggleDrawLayerChangeFeatureEventHandler(true);
            });
            me._modify[me._id].on('modifyend', function (evt) {
                me.getMap().un('pointerdrag', updateDragCoord);
                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
                me._sketch = evt.features.item(0);
                const newGeom = me.getModifiedGeometry(startCoord, evt.mapBrowserEvent.coordinate);
                me._sketch.setStyle(me._styles.modify);
                if (newGeom) {
                    me._sketch.setGeometry(newGeom);
                }
                me.handleFinishedDrawing();
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
        getModifiedGeometry: function (start, end) {
            if (!start || !end) {
                return;
            }
            const coords = [start, end];
            const shape = this.getCurrentDrawShape();
            if (shape === 'Circle') {
                return createRegularPolygon(50)(coords);
            }
            if (shape === 'Square') {
                return createRegularPolygon(4)(coords);
            }
            if (shape === 'Box') {
                return createBox()(coords);
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
        getBufferedFeature: function (geometry) {
            const input = olParser.read(geometry);
            const { bufferAccuracy, buffer } = this.getOpts();
            let bufferGeometry = BufferOp.bufferOp(input, buffer, new BufferParameters(bufferAccuracy));
            bufferGeometry.CLASS_NAME = 'jsts.geom.Polygon';
            bufferGeometry = olParser.write(bufferGeometry);
            const feature = new olFeature({
                geometry: bufferGeometry
            });
            feature.setStyle(this._styles.draw);
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
         *  Used for Circle + buffer
         */
        getCircleAsPolygonFeature: function (feature) {
            if (feature.getGeometry().getType() === 'Polygon') {
                return feature;
            }
            const pointFeature = new olGeom.Point(this._getFeatureCenter(feature));
            const bufferedFeature = this.getBufferedFeature(pointFeature);
            bufferedFeature.setId(feature.getId());
            return bufferedFeature;
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
        /** @method getDrawingTooltip
       * - returns tooltip and creates a new tooltip if not exist
       */
        getDrawingTooltip: function (id) {
            if (this._overlays[id]) {
                return this._overlays[id];
            }
            const tooltipClass = this._tooltipClassForMeasure + ' ' + this.getCurrentDrawShape() + ' ' + id;
            const tooltipElement = document.createElement('div');
            tooltipElement.className = tooltipClass;
            const tooltip = new olOverlay({
                element: tooltipElement,
                offset: [0, -5],
                positioning: 'bottom-center',
                id: id
            });
            tooltipElement.parentElement.style.pointerEvents = 'none';
            tooltip.id = id;
            this.getMap().addOverlay(tooltip);
            this._overlays[id] = tooltip;
            return tooltip;
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
