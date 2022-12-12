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
import jstsOL3Parser from 'jsts/org/locationtech/jts/io/OL3Parser';
import { BufferOp, BufferParameters } from 'jsts/org/locationtech/jts/operation/buffer';
import isValidOp from 'jsts/org/locationtech/jts/operation/valid/IsValidOp';

const olParser = new jstsOL3Parser();
const geoJsonFormatter = new olFormatGeoJSON();
olParser.inject(olGeom.Point, olGeom.LineString, LinearRing, olGeom.Polygon, olGeom.MultiPoint, olGeom.MultiLineString, olGeom.MultiPolygon, GeometryCollection);

const arrayValuesEqual = (array1, array2) => array1.length === array2.length && array1.every((value, index) => value === array2[index]);
const firstAndLastCoordinatesEqual = (coordinates) => coordinates.length > 1 && arrayValuesEqual(coordinates[0], coordinates[coordinates.length - 1]);
const hasEnoughCoordinatesForIntersect = (coordinates) => coordinates.length > 4;

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
    bufferAccuracy: 10, // is number of line segments used to represent a quadrant circle
    sidesForCircle: 50 // is number of sides/vertices used to represent circle as polygon
};
const isModifyLimited = shape => ['Square', 'Circle', 'Box'].includes(shape);

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
        this._bufferLayer = null;
        this._drawLayer = null;
        this._styles = {};
        this._overlays = {};
        this._drawFeatureIdSequence = 0;
        this._draw = null;
        this._modify = null;
        this._interacting = false;
        this._options = {};
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
        },
        setDefaultStyle: function (style) {
            this._defaultStyle = style;
        },
        getStyleFunction: function () {
            return (feature) => {
                const { valid, isFinished } = feature.getProperties();
                if (valid === false) {
                    return this._styles.invalid;
                }
                if (isFinished) {
                    return this._styles.modify;
                }
                return this._styles.draw;
            };
        },
        // used for interactions' style. Render style only for pointer to render Polygon's invalid style.
        getPointerStyleFunction: function () {
            return (feature) => {
                const type = feature.getGeometry().getType();
                return type === 'Point' ? this._styles.draw : null;
            };
        },
        getTempModifyStyle: function () {
            // style (not array)
            return this._styles.modify[0].clone();
        },
        /**
         * @method draw
         * - activates draw and modify controls
         *
         * @param {String} id, that identifies the request
         * @param {String} shape: drawing shape: Point/Circle/Polygon/Box/Square/LineString
         * @param {Object} options
         */
        draw: function (id, shape, options) {
            if (this._gfiTimeout) {
                clearTimeout(this._gfiTimeout);
            }
            // disable gfi
            this.getMapModule().setDrawingMode(true);

            // remove previous draw and modify controls
            this._cleanupInternalState(options.clear);

            // setup request
            this._id = id;
            this._shape = shape;
            const { geojson, style, ...opts } = options;
            this.setOptionsForRequest(opts);
            this.setStyles(style);
            this.setFeaturesFromGeoJson(geojson);

            // activate draw and modify controls
            const { drawControl, modifyControl } = this.getOpts();
            if (drawControl) {
                this.addDrawInteraction();
            }
            if (modifyControl) {
                this.addModifyInteraction();
            }
        },
        setOptionsForRequest: function (reqOpts = {}) {
            /* backwards compatibility:
            *  - self intersection is moved from options to limits
            *  - buffer was used as radius with Circle
            */
            if (this.getShape() === 'Circle' && reqOpts.buffer && !reqOpts.radius) {
                reqOpts.radius = reqOpts.buffer;
                delete reqOpts.buffer;
            }
            const { selfIntersection = true, limits: reqLimits = {}, ...rest } = reqOpts;
            const limits = {
                selfIntersection,
                ...reqLimits
            };
            const options = { ...OPTIONS, ...rest, limits };

            // add localized warning tooltips and buffer params to options as these doesn't change during request
            const locPath = options.modifyControl ? 'modify' : 'new';
            if (limits.area) {
                const formatted = this.getMapModule().formatMeasurementResult(limits.area, 'area', 0);
                const warn = this.loc(INVALID_REASONS.AREA_SIZE, { size: formatted });
                const tip = this.loc(`${locPath}.area`);
                options.limits.areaTooltip = `${warn} ${tip}`;
            }
            if (limits.length) {
                const formatted = this.getMapModule().formatMeasurementResult(limits.length, 'line', 0);
                const warn = this.loc(INVALID_REASONS.LINE_LENGTH, { length: formatted });
                const tip = this.loc(`${locPath}.line`);
                options.limits.lengthTooltip = `${warn} ${tip}`;
            }
            if (limits.selfIntersection) {
                const warn = this.loc(INVALID_REASONS.INTERSECTION);
                const tip = this.loc(`${locPath}.area`);
                options.limits.intersectionTooltip = `${warn} ${tip}`;
            }
            if (options.buffer || options.radius) {
                options.bufferParams = new BufferParameters(options.bufferAccuracy);
            }
            this._options = options;
        },
        _cleanupInternalState: function (clearDrawing) {
            const map = this.getMap();
            map.removeInteraction(this._draw);
            map.removeInteraction(this._modify);
            this._cleanSketch();
            this._draw = null;
            this._modify = null;
            if (clearDrawing) {
                this.clearDrawing();
            }
        },
        setFeaturesFromGeoJson: function (geojson) {
            if (!geojson) {
                return;
            }
            let featuresFromJson = geoJsonFormatter.readFeatures(geojson);
            // parse multi geometries to single geometries
            if (this.getOpts('allowMultipleDrawing') === 'multiGeom') {
                featuresFromJson = this.parseMultiGeometries(featuresFromJson);
            }
            featuresFromJson.forEach(f => {
                this.onNewFeature(f);
                this.onFinishedFeature(f, true);
            });
            this.getDrawSource().addFeatures(featuresFromJson);
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
        // for wrapping features to one feature with multi geometry used with 'multiGeom'
        createMultiGeometry: function (features) {
            if (!features.length) {
                return features;
            }
            const first = features[0];
            const coords = features.map(f => f.getGeometry().getCoordinates());
            let geometry;
            switch (first.getGeometry().getType()) {
            case 'Point':
                geometry = new olGeom.MultiPoint(coords);
                break;
            case 'LineString':
                geometry = new olGeom.MultiLineString(coords);
                break;
            case 'Polygon':
                geometry = new olGeom.MultiPolygon(coords);
                break;
            default:
                throw new Error('Unsupported geometry type!');
            }
            const feature = new olFeature({ geometry });
            feature.setId(first.getId());

            // Gather properties for createGeoJsonFeature => feature.geProperties
            const props = {
                valid: features.every(f => f.get('valid')),
                length: features.map(f => f.get('length') || 0).reduce((s, l) => s + l, 0),
                area: features.map(f => f.get('area') || 0).reduce((s, a) => s + a, 0),
                radius: first.get('radius') || 0,
                buffer: first.get('buffer') || 0,
                tooltip: features.filter(f => f.get('valid') === false).map(f => f.get('tooltip'))[0]
            };
            feature.setProperties(props, true);
            return [feature];
        },

        /**
         * This is the shape type that is currently being drawn
         * @return {String} 'Polygon' / 'LineString' etc
         */
        getShape: function () {
            return this._shape;
        },
        /**
         * Returns a source for drawn features.
         */
        getDrawSource: function () {
            if (!this._drawLayer) {
                this._drawLayer = this.createVectorLayer('DrawPluginLayer');
            }
            return this._drawLayer.getSource();
        },
        /**
         * Returns a source for buffered features.
         */
        getBufferSource: function () {
            if (!this._bufferLayer) {
                this._bufferLayer = this.createVectorLayer('DrawPluginBufferLayer');
            }
            return this._bufferLayer.getSource();
        },
        /**
         * @method addVectorLayer
         * -  adds a new layer to the map
         */
        createVectorLayer: function (id) {
            const layer = new olLayerVector({
                id,
                source: new olSourceVector(),
                title: id
            });
            this.getMapModule().addOverlayLayer(layer);
            return layer;
        },
        /**
         * The id sent in startdrawing request like "measure" or "feedback"
         * @return {String|Number}
         */
        getRequestId: function () {
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
         * @method stopDrawing
         * - used for clear or end drawing
         * - if id isn't given clears all drawings and doesn't send event
         * @param {String} id
         */
        stopDrawing: function (id, clearCurrent, supressEvent) {
            if (!id || clearCurrent) {
                this.clearDrawing(id);
            } else {
                // try to finish unfinished (currently drawn) feature
                this.forceFinishDrawing();
            }
            if (id && !supressEvent) {
                this.sendDrawingEvent(true);
            }
            // remove draw and modify controls
            this._cleanupInternalState();
            // enable gfi
            this._gfiTimeout = setTimeout(() => this.getMapModule().setDrawingMode(false), 500);
        },
        /**
         * @method forceFinishDrawing
         * Try to finish drawing if _scetch contains the unfinished (currently drawn) feature
         * Updates measurement on map and cleans sketch
         */
        forceFinishDrawing: function () {
            const feature = this._sketch;
            if (!feature) {
                return;
            }
            const geom = feature.getGeometry();
            const source = this.getDrawSource();

            if (geom.getType() === 'LineString') {
                const coords = geom.getCoordinates();
                if (coords.length > 2) {
                    const parsedCoords = coords.slice(0, coords.length - 1); // remove last point
                    geom.setCoordinates(parsedCoords);
                    source.addFeature(feature);
                    this.updateMeasurements(feature);
                } else {
                    // cannot finish geometry, remove measurement result from map
                    this._cleanSketch();
                }
            } else if (geom.getType() === 'Polygon') {
                // only for exterior linear ring, drawtools doesn't support linear rings (holes)
                const coords = geom.getCoordinates()[0];
                if (coords.length > 4) {
                    const parsedCoords = coords.slice(0, coords.length - 2); // remove second last point
                    parsedCoords.push(coords[coords.length - 1]); // add last point to close linear ring
                    geom.setCoordinates([parsedCoords]); // add parsed exterior linear ring
                    source.addFeature(feature);
                    this.updateMeasurements(feature);
                } else {
                    // cannot finish geometry, remove measurement result from map
                    this._cleanSketch();
                }
            }
            this._sketch = null; // clean sketch to not add to drawing event
        },
        _cleanSketch: function () {
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
            const drawSource = this.getDrawSource();
            const bufferSource = this.getBufferSource();
            // Clear all (e.g. another bundle sends stopdrawing)
            if (!id) {
                drawSource.clear();
                bufferSource.clear();
                Object.keys(this._overlays).forEach(id => this.removeDrawingTooltip(id));
                this._overlays = {};
                return;
            }

            const remove = (source, feat) => {
                if (feat.get('requestId') === id) {
                    this.removeDrawingTooltip(feat.getId());
                    source.removeFeature(feat);
                }
            };

            drawSource.getFeatures().forEach(feat => remove(drawSource, feat));
            bufferSource.getFeatures().forEach(feat => remove(bufferSource, feat));
        },
        /**
         * @method sendDrawingEvent
         * -  sends DrawingEvent
         *
         * @param {Boolean} isFinished  true - if drawing is completed. Default is false.
         */
        sendDrawingEvent: function (isFinished = false) {
            const shape = this.getShape();
            const { showMeasureOnMap, buffer } = this.getOpts();

            const features = this.getDrawFeatures();
            let bufferFeatures = [];
            if (buffer > 0) {
                bufferFeatures = this.getBufferFeatures();
            }
            if (!features.length && !bufferFeatures.length) {
                Oskari.log('DrawPlugin').debug('No features, skip send drawing event.');
                return;
            }

            const geojson = this.getFeaturesAsGeoJSON(features);
            const bufferedGeoJson = this.getFeaturesAsGeoJSON(bufferFeatures);

            const data = { buffer, shape, showMeasureOnMap, bufferedGeoJson };

            let sumArea = 0;
            let sumLength = 0;
            features.forEach(f => {
                const { area, length } = f.getProperties();
                if (area) sumArea += area;
                if (length) sumLength += length;
            });
            if (sumArea) data.area = sumArea;
            if (sumLength) data.length = sumLength;

            const event = Oskari.eventBuilder('DrawingEvent')(this.getRequestId(), geojson, data, isFinished);
            this.getSandbox().notifyAll(event);
        },
        getDrawFeatures: function () {
            return this._getFeatures(this.getDrawSource());
        },
        getBufferFeatures: function () {
            // sketch is always drawn feature, don't add it for buffer
            return this._getFeatures(this.getBufferSource(), true);
        },
        /**
         * @method getFeatures
         * -  gets features from layer
         *
         * @return {Array} features
         */
        _getFeatures: function (source, skipSketch) {
            if (!source) {
                return [];
            }
            const addSketch = this._sketch && !skipSketch;
            const reqId = this.getRequestId();
            const reqShape = this.getShape();
            const sketchId = addSketch ? this._sketch.getId() : '';
            const filterFeature = feat => {
                // when modifying drawn feature, don't add dublicate feature
                if (addSketch && sketchId === feat.getId()) return false;
                const { requestId, shape } = feat.getProperties();
                return requestId === reqId && shape === reqShape;
            };

            const features = source.getFeatures().filter(filterFeature);

            if (addSketch) {
                // include the unfinished (currently drawn) feature
                features.push(this._sketch);
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
            if (this.getOpts('allowMultipleDrawing') === 'multiGeom') {
                features = this.createMultiGeometry(features);
            }
            return {
                type: 'FeatureCollection',
                crs: this.getSandbox().getMap().getSrsName(),
                features: features.map(f => this.createGeoJsonFeature(f))
            };
        },

        createGeoJsonFeature: function (feature) {
            const json = geoJsonFormatter.writeFeatureObject(feature);

            const { length, area, radius, buffer, tooltip, valid } = feature.getProperties();
            const properties = { valid };
            if (length) {
                properties.length = valid ? length : tooltip;
            }
            if (area) {
                properties.area = valid ? area : tooltip;
            }
            if (radius) {
                properties.radius = radius;
            }
            if (buffer) {
                properties.buffer = buffer;
            }
            // override
            json.properties = properties;
            return json;
        },
        /**
         * @method addDrawInteraction
         * -  activates draw control
         * @param {String} layerId
         * @param {String} shape
         * @param {Object} options
         */
        addDrawInteraction: function () {
            const shape = this.getShape();
            const { radius, allowMultipleDrawing } = this.getOpts();
            let geometryFunction;
            let maxPoints;
            let type = shape;

            if (shape === 'LineString') {
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.LineString(coordinates);
                    } else {
                        geometry.setCoordinates(coordinates);
                    }
                    return geometry;
                };
            } else if (shape === 'Box') {
                maxPoints = 2;
                type = 'LineString';
                geometryFunction = createBox();
            } else if (shape === 'Point') {
                geometryFunction = function (coordinates, geometry) {
                    if (!geometry) {
                        geometry = new olGeom.Point(coordinates);
                    }
                    return geometry;
                };
            } else if (shape === 'Square') {
                type = 'Circle';
                geometryFunction = createRegularPolygon(4);
            } else if (shape === 'Circle' && radius > 0) {
                type = 'Point';
                geometryFunction = (coordinates, geometry) => {
                    if (!geometry) {
                        const point = new olGeom.Point(coordinates);
                        geometry = this.getBufferedGeometry(point, radius);
                    }
                    return geometry;
                };
            } else if (shape === 'Circle') {
                const { sidesForCircle } = this.getOpts();
                geometryFunction = createRegularPolygon(sidesForCircle);
            } else if (shape === 'Polygon') {
                geometryFunction = (coordinates, geometry) => {
                    // make closed Polygon
                    const coords = coordinates.map(ring => {
                        ring = ring.slice();
                        ring.push(ring[0].slice());
                        return ring;
                    });
                    if (!geometry) {
                        geometry = new olGeom.Polygon(coords);
                    } else {
                        geometry.setCoordinates(coords);
                    }
                    return geometry;
                };
            }

            const wrappedFunction = (...args) => {
                const geometry = geometryFunction(...args);
                this.onSketchChange();
                return geometry;
            };

            const drawOpts = {
                type,
                maxPoints,
                source: this.getDrawSource(),
                style: this.getPointerStyleFunction(),
                geometryFunction: wrappedFunction
            };

            if (!Oskari.util.isMobile(true)) {
                // use smaller snap tolerance on desktop
                drawOpts.snapTolerance = 3;
            }

            this._draw = new olInteractionDraw(drawOpts);

            this._draw.on('drawstart', ({ feature }) => {
                this._sketch = feature;
                this.onNewFeature();
                if (allowMultipleDrawing === 'single') {
                    this.clearDrawing(this.getRequestId());
                }
                // stop modify interaction while draw-mode is active
                this.toggleModify(false);
            });
            this._draw.on('drawend', () => {
                if (allowMultipleDrawing === false) {
                    this.toggleDraw(false);
                }
                // activate modify interaction after new drawing is finished
                this.toggleModify(true);
                this.onFinishedFeature();
            });
            this.getMap().addInteraction(this._draw);
        },
        toggleDraw: function (enabled) {
            if (this._draw) {
                this._draw.setActive(enabled);
            }
        },
        toggleModify: function (enabled) {
            if (this._modify) {
                this._modify.setActive(enabled);
            }
        },
        onDrawingChange: function (feature) {
            if (!feature) {
                return;
            }
            // update measurement before validating
            this.updateMeasurements(feature);
            // validate geometry before updating tooltip
            this.validateGeometry(feature);
            this.updateTooltip(feature);
            this.drawBuffer(feature);
        },
        // called on click for Point or pointer move for others
        onSketchChange: function () {
            this._interacting = true;
            this.onDrawingChange(this._sketch);
            this.sendDrawingEvent();
        },
        onFinishedFeature: function (feature = this._sketch, suppressEvent) {
            this._interacting = false;
            feature.setProperties({ isFinished: true }, true);
            this.onDrawingChange(feature);
            if (!suppressEvent) {
                this.sendDrawingEvent(true);
            }
            this._sketch = null;
        },
        onNewFeature: function (feature = this._sketch) {
            if (!feature.getId()) {
                feature.setId(this.generateNewFeatureId());
            }
            feature.setStyle(this.getStyleFunction());
            const requestId = this.getRequestId();
            const shape = this.getShape();
            feature.setProperties({ requestId, shape }, true);
        },
        validateGeometry: function (feature) {
            const limits = this.getOpts('limits');
            const geometry = feature.getGeometry();
            const type = geometry.getType();

            let { area, length, tooltip } = feature.getProperties();
            let invalidReason;
            if (type === 'Polygon') {
                if (this.checkIntersection(feature)) {
                    invalidReason = INVALID_REASONS.INTERSECTION;
                    tooltip = limits.intersectionTooltip;
                } else if (limits.area && area > limits.area) {
                    invalidReason = INVALID_REASONS.AREA_SIZE;
                    tooltip = limits.areaTooltip;
                }
            }
            if (limits.length && type === 'LineString' && length > limits.length) {
                invalidReason = INVALID_REASONS.LINE_LENGTH;
                tooltip = limits.lengthTooltip;
            }
            const valid = !invalidReason;
            feature.setProperties({ invalidReason, tooltip, valid }, true);
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
            const geometry = feature.getGeometry();
            const coordinates = geometry.getCoordinates()[0];
            // This function is called twice when modifying geometry from the point where the drawing initially began
            // That is because the first and the last point of the geometry are being modified at the same time
            // The points should have identical values but in the first call they don't
            // So the first call is ignored by the if statement below since it would otherwise throw an error from a 3rd party library
            if (hasEnoughCoordinatesForIntersect(coordinates) && firstAndLastCoordinatesEqual(coordinates)) {
                if (!isValidOp.isValid(olParser.read(geometry))) {
                    // lines intersect -> problem!!
                    return true;
                }
            }
            return false;
        },
        updateMeasurements: function (feature) {
            const mapmodule = this.getMapModule();
            const geom = feature.getGeometry();
            const format = this.getOpts('showMeasureOnMap');
            if (geom instanceof olGeom.Polygon) {
                const area = mapmodule.getGeomArea(geom);
                const length = mapmodule.getGeomLength(geom);
                const tooltip = format ? mapmodule.formatMeasurementResult(area, 'area') : '';
                feature.setProperties({ area, length, tooltip }, true);
                return;
            }
            if (geom instanceof olGeom.LineString) {
                const length = mapmodule.getGeomLength(geom);
                const tooltip = format ? mapmodule.formatMeasurementResult(length, 'line') : '';
                feature.setProperties({ length, tooltip }, true);
            }
        },
        updateTooltip: function (feature) {
            const overlay = this.getDrawingTooltip(feature.getId());
            const geom = feature.getGeometry();
            let tooltipCoord;
            let { tooltip = '', valid } = feature.getProperties();
            // don't show warning tooltip while drawing
            if (!valid && this._interacting) {
                tooltip = '';
            }
            if (geom instanceof olGeom.Polygon) {
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof olGeom.LineString) {
                tooltipCoord = geom.getLastCoordinate();
            }
            if (tooltipCoord) {
                overlay.setPosition(tooltipCoord);
            }
            const elem = overlay.getElement();
            elem.innerHTML = tooltip;
            if (tooltip) {
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
        addModifyInteraction: function () {
            const isLimited = isModifyLimited(this.getShape());
            this._modify = new olInteractionModify({
                source: this.getDrawSource(),
                style: this.getPointerStyleFunction(),
                insertVertexCondition: isLimited ? olEventsCondition.never : olEventsCondition.always,
                deleteCondition: isLimited ? olEventsCondition.never : event => olEventsCondition.shiftKeyOnly(event) && olEventsCondition.singleClick(event)
            });
            this.bindModifyEvents();
            this.getMap().addInteraction(this._modify);
        },
        /**
         * @method drawBufferedGeometry
         * -  adds buffered feature to the map
         *
         * @param {Geometry} geometry
         */
        drawBuffer: function (feature) {
            const { buffer } = this.getOpts();
            if (!buffer) {
                return;
            }
            const featGeom = feature.getGeometry();
            if (this.getShape() === 'Polygon' && featGeom.getCoordinates()[0].length < 4) {
                return;
            }
            const source = this.getBufferSource();
            const id = feature.getId();
            let bufferFeature = source.getFeatureById(id);
            const geometry = this.getBufferedGeometry(featGeom, buffer);
            if (bufferFeature) {
                bufferFeature.setGeometry(geometry);
                this.updateMeasurements(bufferFeature);
                return;
            }
            bufferFeature = new olFeature({ geometry });
            // copy id from actual feature
            bufferFeature.setId(id);
            bufferFeature.setProperties({ buffer, valid: true }, true);
            this.onNewFeature(bufferFeature);
            source.addFeature(bufferFeature);
            this.updateMeasurements(bufferFeature);
        },
        /**
         * @method modifyStartEvent
         * -  triggered upon feature modification start
         * @param {String} shape
         * @param {Object} options
         */
        bindModifyEvents: function () {
            const me = this;
            const shape = this.getShape();
            // if modifyend didn't get called for some reason, nullify the old listeners to be on the safe side
            if (this.modifyFeatureChangeEventCallback) {
                this.toggleDrawLayerChangeFeatureEventHandler(false);
                this.modifyFeatureChangeEventCallback = null;
            }

            let dragCoord;
            let startCoord;
            const updateDragCoord = evt => (dragCoord = evt.coordinate);
            const tempStyle = this.getTempModifyStyle();
            this._modify.on('modifystart', function (evt) {
                const feature = evt.features.item(0);
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
                    if (isModifyLimited(shape)) {
                        const geomToRender = me.getModifiedGeometry(startCoord, dragCoord);
                        // set rendered geometry to sketch to get correct measurements and geojson to unfinished event
                        me._sketch.setGeometry(geomToRender);
                        // modify interaction updates feature geometry so we can't set new geometry to feature
                        // use style to render new geometry instead of actual
                        tempStyle.setGeometry(geomToRender);
                        feature.setStyle(tempStyle);
                    }
                    me.onSketchChange();
                    // probably safe to start listening again
                    me.toggleDrawLayerChangeFeatureEventHandler(true);
                };
                me.toggleDrawLayerChangeFeatureEventHandler(true);
            });
            this._modify.on('modifyend', function (evt) {
                me.getMap().un('pointerdrag', updateDragCoord);
                me.toggleDrawLayerChangeFeatureEventHandler(false);
                me.modifyFeatureChangeEventCallback = null;
                me._sketch = evt.features.item(0);
                const newGeom = me.getModifiedGeometry(startCoord, evt.mapBrowserEvent.coordinate);
                if (newGeom) {
                    me._sketch.setGeometry(newGeom);
                }
                me.onFinishedFeature();
            });
        },
        toggleDrawLayerChangeFeatureEventHandler: function (enable) {
            if (enable) {
                this.getDrawSource().on('changefeature', this.modifyFeatureChangeEventCallback, this);
            } else {
                this.getDrawSource().un('changefeature', this.modifyFeatureChangeEventCallback, this);
            }
        },
        getModifiedGeometry: function (start, end) {
            if (!start || !end) {
                return;
            }
            const coords = [start, end];
            const shape = this.getShape();
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
         * @return {ol/Geometry} geometry
         */
        getBufferedGeometry: function (geometry, buffer) {
            const input = olParser.read(geometry);
            const bufferGeometry = BufferOp.bufferOp(input, buffer, this.getOpts('bufferParams'));
            bufferGeometry.CLASS_NAME = 'jsts.geom.Polygon';
            return olParser.write(bufferGeometry);
        },

        /**
         * @method  @private _getFeatureCenter get feature center coordinates.
         * @param  {ol/feature} feature feature where need to get center point
         * @return {Array} coordinates array
         */
        _getFeatureCenter: function (feature) {
            const geom = feature.getGeometry();
            // Circle has (multi)polygon or (multi)point ol type and it center need calculated different way
            if (geom.getType().indexOf('Polygon') > -1 || geom.getType().indexOf('Point') > -1) {
                return olExtent.getCenter(geom.getExtent());
            }
            return geom.getCenter();
        },
        /** @method getDrawingTooltip
        * - returns tooltip and creates a new tooltip if not exist
        */
        getDrawingTooltip: function (id) {
            if (this._overlays[id]) {
                return this._overlays[id];
            }
            const shape = this.getShape();
            const tooltipElement = document.createElement('div');
            tooltipElement.className = `drawplugin-tooltip-measure ${shape} ${id}`;
            const tooltip = new olOverlay({
                element: tooltipElement,
                offset: [0, -5],
                positioning: 'bottom-center',
                id: id
            });
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
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
