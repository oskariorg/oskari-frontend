import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';
import olStyleIcon from 'ol/style/Icon';
import olStyleText from 'ol/style/Text';
import {defaults as olInteractionDefaults} from 'ol/interaction';
import olView from 'ol/View';
import {METERS_PER_UNIT as olProjUnitsMETERS_PER_UNIT} from 'ol/proj/Units';
import * as olProj from 'ol/proj';
import olMap from 'ol/Map';
import {defaults as olControlDefaults} from 'ol/control';
import OLCesium from 'ol-cesium';

/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation (Ol-Cesium).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3857'.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.MapModule',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     *      Unigue ID for this map
     */
    function (id, imageUrl, options, mapDivId) {
        this._dpi = 72; //   25.4 / 0.28;  use OL2 dpi so scales are calculated the same way
        this._map3d = null;
        this._mapReady = false;
        this._mapReadySubscribers = [];
        this._lastKnownZoomLevel = null;
    }, {
        __TERRAIN_SERVICE_URL: 'https://beta-karttakuva.maanmittauslaitos.fi/hmap/',
        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * @param {Oskari.Sandbox} sandbox
         * @return {OpenLayers.Map}
         */
        _initImpl: function (sandbox, options, map) {
            // css references use olMap as selectors so we need to add it
            this.getMapEl().addClass('olMap');
            return map;
        },
        /**
         * @method createMap
         * Creates OlCesium map implementation
         * @return {ol/Map}
         */
        createMap: function () {
            var me = this;
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup
            
            var controls = olControlDefaults({
                zoom: false,
                attribution: false,
                rotate: false
            });

            var map = new olMap({
                keyboardEventTarget: document,
                target: this.getMapElementId(),
                controls: controls,
                interactions: me._olInteractionDefaults,
                loadTilesWhileInteracting: true,
                loadTilesWhileAnimating: true,
                moveTolerance: 2
            });

            var projection = olProj.get(me.getProjection());
            map.setView(new olView({
                projection: projection,
                // actual startup location is set with MapMoveRequest later on
                // still these need to be set to prevent errors
                center: [0, 0],
                zoom: 0,
                resolutions: this.getResolutionArray()
            }));

            me._setupMapEvents(map);

            this._map3d = new OLCesium({
                map: map,
                sceneOptions: {
                    showCredit: false
                }
            });

            var scene = this._map3d.getCesiumScene();
            var terrainProvider = new Cesium.CesiumTerrainProvider({
                url: this.__TERRAIN_SERVICE_URL
            });
            terrainProvider.readyPromise.then(() => {
                scene.terrainProvider = terrainProvider;
            });

            var updateReadyStatus = function () {
                scene.postRender.removeEventListener(updateReadyStatus);
                me._mapReady = true;
                me._notifyMapReadySubscribers();
            }
            scene.postRender.addEventListener(updateReadyStatus);

            return map;
        },
        /**
         * Fire operations that have been waiting for the map to initialize.
         */
        _notifyMapReadySubscribers: function () {
            var me = this;
            this._mapReadySubscribers.forEach(function (fireOperation) {
                fireOperation.operation.apply(me, fireOperation.arguments);
            });
        },
        /**
         * Add map event handlers
         * @method @private _setupMapEvents
         */
        _setupMapEvents: function (map) {
            var me = this;
            var sandbox = me._sandbox;

            map.on('moveend', function (evt) {
                me.notifyMoveEnd();
            });

            map.on('singleclick', function (evt) {
                if (me.getDrawingMode()) {
                    return;
                }
                var CtrlPressed = evt.originalEvent.ctrlKey;
                var lonlat = {
                  lon: evt.coordinate[0],
                  lat: evt.coordinate[1]
                };
                var mapClickedEvent = sandbox.getEventBuilder('MapClickedEvent')(lonlat, evt.pixel[0], evt.pixel[1], CtrlPressed);
                sandbox.notifyAll(mapClickedEvent);
            });
            map.on('dblclick', function () {
                if (me.getDrawingMode()) {
                    return false;
                }
            });

            map.on('pointermove', function (evt) {
                clearTimeout(this.mouseMoveTimer);
                this.mouseMoveTimer = setTimeout(function () {
                    // No mouse move in 1000 ms - mouse move paused
                    var hoverEvent = sandbox.getEventBuilder('MouseHoverEvent')(evt.coordinate[0], evt.coordinate[1], true);
                    sandbox.notifyAll(hoverEvent);
                }, 1000);
                var hoverEvent = sandbox.getEventBuilder('MouseHoverEvent')(evt.coordinate[0], evt.coordinate[1], false);
                sandbox.notifyAll(hoverEvent);
            });
        },
        _startImpl: function () {
            return true;
        },

/* OL3 specific - check if this can be done in a common way
------------------------------------------------------------------> */
        getInteractionInstance: function (interactionName) {
            var interactions = this.getMap().getInteractions().getArray();
            var interactionInstance = interactions.filter(function (interaction) {
              return interaction instanceof interactionName;
            })[0];
            return interactionInstance;
        },

        /**
         * Transforms a bounds object with left,top,bottom and right properties
         * to an OL3 array. Returns the parameter as is if those properties don't exist.
         * @param  {Object | Array} bounds bounds object or OL3 array
         * @return {Array}          Ol3 presentation of bounds
         */
        __boundsToArray: function (bounds) {
            var extent = bounds || [];
            if (!isNaN(bounds.left) && !isNaN(bounds.top) && !isNaN(bounds.right) && !isNaN(bounds.bottom)) {
              extent = [
                    bounds.left,
                    bounds.bottom,
                    bounds.right,
                    bounds.top];
            }
            return extent;
        },
/*<------------- / OL3 specific ----------------------------------- */


/* Impl specific - found in ol2 AND ol3 modules
------------------------------------------------------------------> */

        getMapCenter: function () {
            var center = this.getMap().getView().getCenter();
            return {
                lon: center[0],
                lat: center[1]
            };
        },

        getMapZoom: function () {
            var zoomlevel = this.getMap().getView().getZoom();
            if (typeof (zoomlevel) === 'undefined') {
                // Cesium view has been zoomed outside ol zoomlevels.
                zoomlevel = this._lastKnownZoomLevel;
            } else {
                this._lastKnownZoomLevel = Math.round(zoomlevel);
            }
            return Math.round(zoomlevel);
        },

        getSize: function () {
            var size = this.getMap().getSize();
            return {
                width: size[0],
                height: size[1]
            };
        },

        /**
         * @method zoomToExtent
         * Zooms the map to fit given bounds on the viewport
         * @param {OpenLayers.Bounds} bounds BoundingBox that should be visible on the viewport
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToExtent: function (bounds, suppressStart, suppressEnd) {
            var extent = this.__boundsToArray(bounds);
            this.getMap().getView().fit(extent, this.getMap().getSize());
            this.updateDomain();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * @method centerMap
         * Moves the map to the given position and zoomlevel.
         * @param {Number[] | Object} lonlat coordinates to move the map to
         * @param {Number} zoomLevel absolute zoomlevel to set the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMap: function (lonlat, zoom, suppressEnd) {
            // TODO: we have isValidLonLat(); maybe use it here
            lonlat = this.normalizeLonLat(lonlat);
            this.getMap().getView().setCenter([lonlat.lon, lonlat.lat]);
            if(zoom === null ||zoom === undefined) {
                zoom = this.getMapZoom();
            }
            this.getMap().getView().setZoom(zoom);
            this.updateDomain();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * Get maps current extent.
         * @method getCurrentExtent
         * @return {Object} current extent
         */
        getCurrentExtent: function() {
            var ol3 = this.getMap();
            var extent = ol3.getView().calculateExtent(ol3.getSize());
            return {
                left: extent[0],
                bottom: extent[1],
                right: extent[2],
                top: extent[3]
            };
        },

        /**
         * @method  @public getProjectionUnits Get projection units. If projection is not defined then using map projection.
         * @param {String} srs projection srs, if not defined used map srs
         * @return {String} projection units. 'degrees' or 'm'
         */
        getProjectionUnits: function (srs) {
            var me = this;
            var units = null;
            srs = srs || me.getProjection();

            try {
                var proj = olProj.get(srs);
                units = proj.getUnits(); // return 'degrees' or 'm'
            } catch (err) {
                var log = Oskari.log('Oskari.mapframework.ui.module.common.MapModule');
                log.warn('Cannot get map units for "' + srs + '"-projection!');
            }
            return units;
        },
        /**
         * @method panMapByPixels
         * Pans the map by given amount of pixels.
         * @param {Number} pX amount of pixels to pan on x axis
         * @param {Number} pY amount of pixels to pan on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} isDrag true if the user is dragging the map to a new location currently (optional)
         */
        panMapByPixels: function (pX, pY, suppressStart, suppressEnd, isDrag) {
            var view = this.getMap().getView();
            var centerCoords = view.getCenter();
            var centerPixels = this.getMap().getPixelFromCoordinate(centerCoords);
            var newCenterPixels = [centerPixels[0] + pX, centerPixels[1] + pY];
            var newCenterCoords = this.getMap().getCoordinateFromPixel(newCenterPixels);

            view.animate({
                duration: 100,
                center: newCenterCoords
            });

            this.updateDomain();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * @method transformCoordinates
         * Transforms coordinates from srs projection to the targerSRS projection.
         * @param {Object} pLonlat object with lon and lat keys
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @param {String} targetsrs projection to transform to like "EPSG:4326" (optional, defaults to map projection)
         * @return {Object} transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (pLonlat, srs, targetSRS) {
            if(!targetSRS) {
                targetSRS = this.getProjection();
            }
            if(!srs || targetSRS === srs) {
                return pLonlat;
            }

            var isSRSDefined = olProj.get(srs);
            var isTargetSRSDefined = olProj.get(targetSRS);

            if (isSRSDefined && isTargetSRSDefined) {
              var transformed = olProj.transform([pLonlat.lon, pLonlat.lat], srs, targetSRS);
                  return {
                      lon : transformed[0],
                      lat : transformed[1]
                  };
            }

            var log = Oskari.log('Oskari.mapframework.ui.module.common.MapModule');
            log.warn('SrsName not supported!');
            throw new Error('SrsName not supported!');
        },
        /**
         * @method orderLayersByZIndex
         * Orders layers by Z-indexes.
         */
        orderLayersByZIndex: function() {
            this.getMap().getLayers().getArray().sort(function(a, b){
                return a.getZIndex()-b.getZIndex();
            });
        },
/* --------- /Impl specific --------------------------------------> */

/* Impl specific - PRIVATE
------------------------------------------------------------------> */
        _calculateScalesImpl: function(resolutions) {
            var units = this.getMap().getView().getProjection().getUnits(),
                mpu = olProjUnitsMETERS_PER_UNIT[units];

            for (var i = 0; i < resolutions.length; ++i) {
                var scale = resolutions[i] * mpu * 39.37 * this._dpi;
                    scale = Math.round(scale);

                this._mapScales.push(scale);
            }
        },
        _updateSizeImpl : function() {
            this.getMap().updateSize();
        },
        _setZoomLevelImpl : function(newZoomLevel) {
            this.getMap().getView().setZoom(newZoomLevel);
        },
        _setResolutionImpl: function (newResolution) {
            this.getMap().getView().setResolution(newResolution);
        },
        _getExactResolutionImpl: function (scale) {
            var units = this.getMap().getView().getProjection().getUnits();
            var dpiTest = jQuery('<div></div>');
            dpiTest.css({
                height: '1in',
                width: '1in',
                position: 'absolute',
                left: '-100%',
                top: '-100%'
            });
            jQuery('body').append(dpiTest);
             var dpi = dpiTest.height();
            dpiTest.remove();
            var mpu = olProjUnitsMETERS_PER_UNIT[units];
            var resolution = scale / (mpu * 39.37 * dpi);
            return resolution;
        },
/* --------- /Impl specific - PRIVATE ----------------------------> */

/* Impl specific - found in ol2 AND ol3 modules BUT parameters and/or return value differ!!
------------------------------------------------------------------> */

        /**
         * @param {Object} layerImpl ol/layer/Layer or Cesium.Cesium3DTileset, olcs specific!
         * @param {Boolean} toBottom if false or missing adds the layer to the top, if true adds it to the bottom of the layer stack
         */
        addLayer: function (layerImpl, toBottom) {
            if (!layerImpl) {
                return;
            }
            if (layerImpl instanceof Cesium.Cesium3DTileset) {
                this._map3d.getCesiumScene().primitives.add(layerImpl);
            } else {
                this.getMap().addLayer(layerImpl);
                // check for boolean true instead of truthy value since some calls might send layer name as second parameter/functionality has changed
                if (toBottom === true) {
                    this.setLayerIndex(layerImpl, 0);
                }
            }
        },
        /**
         * @param {Object} layerImpl ol/layer/Layer or Cesium.Cesium3DTileset, olcs specific!
         */
        removeLayer: function (layerImpl) {
            if (!layerImpl) {
                return;
            }
            if (layerImpl instanceof Cesium.Cesium3DTileset) {
                layerImpl.destroy();
            } else {
                this.getMap().removeLayer(layerImpl);
                if (typeof layerImpl.destroy === 'function') {
                    layerImpl.destroy();
                }
            }
        },
        /**
         * Brings map layer to top
         * @method bringToTop
         *
         * @param {ol/layer/Layer} layer The new topmost layer
         */
        bringToTop: function(layer) {
            var map = this.getMap();
            var list = map.getLayers();
            list.remove(layer);
            list.push(layer);
        },
        /**
         * Set
         * @param {boolean} mode drawing mode on or off!
         */
        setDrawingMode: function (mode) {
            this.isDrawing = !!mode;
            this.set3dEnabled(!this.isDrawing);
        },
        /**
         * @method afterRearrangeSelectedMapLayerEvent
         * @private
         * Handles AfterRearrangeSelectedMapLayerEvent.
         * Changes the layer order in Openlayers to match the selected layers list in
         * Oskari. Ignores Cesium 3D Tilesets.
         */
        afterRearrangeSelectedMapLayerEvent: function () {
            var me = this;
            var layers = this.getSandbox().findAllSelectedMapLayers();
            var layerIndex = 0;

            // setup new order based on the order we get from sandbox
            layers.forEach(function (layer) {
                if (!layer) {
                    return;
                }
                var olLayers = me.getOLMapLayers(layer.getId());
                olLayers.forEach(function (layerImpl) {
                    if (!(layerImpl instanceof Cesium.Cesium3DTileset)) {
                        me.setLayerIndex(layerImpl, layerIndex++);
                    }
                });
            });

            this.orderLayersByZIndex();
        },
        /**
         * @param {ol/layer/Layer} layer ol3 specific!
         */
        setLayerIndex: function(layerImpl, index) {
            var layerColl = this.getMap().getLayers();
            var layerIndex = this.getLayerIndex(layerImpl);

            /* find */
            /* remove */
            /* insert at */

            if (index === layerIndex) {
                return;
            } else if (index === layerColl.getLength()) {
                /* to top */
                layerColl.removeAt(layerIndex);
                layerColl.insertAt(index, layerImpl);
            } else if (layerIndex < index) {
                /* must adjust change */
                layerColl.removeAt(layerIndex);
                layerColl.insertAt(index - 1, layerImpl);

            } else {
                layerColl.removeAt(layerIndex);
                layerColl.insertAt(index, layerImpl);
            }

        },

        /**
         * @param {ol/layer/Layer} layer ol3 specific!
         */
        getLayerIndex: function(layerImpl) {
            var layerColl = this.getMap().getLayers();
            var layerArr = layerColl.getArray();

            for (var n = 0; n < layerArr.length; n++) {
                if (layerArr[n] === layerImpl) {
                    return n;
                }
            }
            return -1;
        },
        /**
         * @param {ol/control/Control} layer ol3 specific!
         */
        _addMapControlImpl: function(ctl) {
            this.getMap().addControl(ctl);
        },
        /**
         * @param {ol/control/Control} layer ol3 specific!
         */
        _removeMapControlImpl: function(ctl) {
            this.getMap().removeControl(ctl);
        },

        /**
         * Creates style based on JSON
         * @return {ol/style/Style} style ol3 specific!
         */
        getStyle: function(styleDef) {
            var me = this;
            style = jQuery.extend(true, {}, styleDef);
            var olStyle = {};
            if(Oskari.util.keyExists(style, 'fill.color')) {
                var color = style.fill.color;
                if(Oskari.util.keyExists(style, 'image.opacity')) {
                    var rgb = null;
                    // check if color is hex
                    if (color.charAt(0) === '#') {
                        rgb = Oskari.util.hexToRgb(color);
                        color = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+style.image.opacity+')';
                    }
                    // else check at if color is rgb
                    else if(color.indexOf('rgb(') > -1){
                        var hexColor = '#' + Oskari.util.rgbToHex(color);
                        rgb = Oskari.util.hexToRgb(hexColor);
                        color = 'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+style.image.opacity+')';
                    }
                }
                olStyle.fill = new olStyleFill({
                  color: color
                });
            }
            if(style.stroke) {
            	olStyle.stroke = me.__getStrokeStyle(style);
            }
            if(style.image) {
                olStyle.image = me.__getImageStyle(style);
            }
            if (style.text) {
                var textStyle = me.__getTextStyle(style.text);
                if (textStyle) {
                    olStyle.text = textStyle;
                }
            }
            return new olStyleStyle(olStyle);
        },
        /**
         * Parses stroke style from json
         * @method __getStrokeStyle
         * @param {Object} style json
         * @return {ol/style/Stroke}
         */
        __getStrokeStyle: function(styleDef) {
            var stroke = {};
            if(styleDef.stroke.width === 0) {
                return null;
            }
            if(styleDef.stroke.color) {
                stroke.color = styleDef.stroke.color;
            }

            if(styleDef.stroke.width) {
                stroke.width = styleDef.stroke.width;
            }
            if(styleDef.stroke.lineDash) {
                if(_.isArray(styleDef.stroke.lineDash)) {
                    stroke.lineDash = styleDef.stroke.lineDash;
                } else {
                    stroke.lineDash = [styleDef.stroke.lineDash];
                }
            }
            if(styleDef.stroke.lineCap) {
                stroke.lineCap = styleDef.stroke.lineCap;
            }
            return new olStyleStroke(stroke);
        },
        /**
         * Parses image style from json
         * @method __getImageStyle
         * @param {Object} style json
         * @return {ol/style/Circle}
         */
        __getImageStyle: function(styleDef) {
            var me = this,
                image = {},
                size;

            if (styleDef.image && styleDef.image.sizePx){
                size = styleDef.image.sizePx;
            } else if (styleDef.image && styleDef.image.size){
                size = this.getPixelForSize(styleDef.image.size);
            } else {
                size = this._defaultMarker.size;
            }

            if(typeof size !== 'number'){
                size = this._defaultMarker.size;
            }

            styleDef.image.size = size;

            if(me.isSvg(styleDef.image)) {
                var svg = me.getSvg(styleDef.image);
                image = new olStyleIcon({
                    src: svg,
                    size: [size, size],
                    imgSize: [size, size],
                    opacity: styleDef.image.opacity || 1
                });
                return image;
            }
            else if(styleDef.image && styleDef.image.shape) {
                var offsetX = (!isNaN(style.image.offsetX)) ? style.image.offsetX : 16;
                var offsetY = (!isNaN(style.image.offsetY)) ? style.image.offsetY : 16;
                image = new olStyleIcon({
                    src: style.image.shape,
                    anchorYUnits: 'pixels',
                    anchorXUnits: 'pixels',
                    anchorOrigin: 'bottom-left',
                    anchor: [offsetX,offsetY],
                    opacity: styleDef.image.opacity || 1
                });
                return image;
            }

            if(styleDef.image.radius) {
                image.radius = styleDef.image.radius;
            } else {
                image.radius = 1;
            }
            if(styleDef.snapToPixel) {
                image.snapToPixel = styleDef.snapToPixel;
            }
            if(Oskari.util.keyExists(styleDef.image, 'fill.color')) {
                image.fill = new olStyleFill({
                    color: styleDef.image.fill.color
                });
            }
            if(styleDef.stroke) {
                image.stroke = this.__getStrokeStyle(styleDef);
            }
            return new olStyleCircle(image);
        },
        /**
         * Parses JSON and returns matching ol/style/Text
         * @param  {Object} textStyleJSON text style definition
         * @return {ol/style/Text} parsed style or undefined if no param is given
         */
        __getTextStyle : function(textStyleJSON) {
            if(!textStyleJSON) {
                return;
            }
            var text = {};
            if(textStyleJSON.scale) {
                text.scale = textStyleJSON.scale;
            }
            if(textStyleJSON.offsetX) {
                text.offsetX = textStyleJSON.offsetX;
            }
            if(textStyleJSON.offsetY) {
                text.offsetY = textStyleJSON.offsetY;
            }
            if(textStyleJSON.rotation) {
                text.rotation = textStyleJSON.rotation;
            }
            if(textStyleJSON.textAlign) {
                text.textAlign = textStyleJSON.textAlign;
            }
            if(textStyleJSON.textBaseline) {
                text.textBaseline = textStyleJSON.textBaseline;
            }
            if(textStyleJSON.font) {
                text.font = textStyleJSON.font;
            }
            if(Oskari.util.keyExists(textStyleJSON, 'fill.color')) {
                text.fill = new olStyleFill({
                    color: textStyleJSON.fill.color
                });
            }
            if(textStyleJSON.stroke) {
                text.stroke = this.__getStrokeStyle(textStyleJSON);
            }
            if (textStyleJSON.labelText) {
                if(typeof textStyleJSON.labelText === 'number'){
                    text.text = textStyleJSON.labelText.toString();
                } else {
                    text.text = textStyleJSON.labelText;
                }
            }
            return new olStyleText(text);
        },
        /**
         * Enable 3d view.
         */
        set3dEnabled: function (enable) {
            if (enable === this._map3d.getEnabled()) {
                return;
            }
            var map = this.getMap();
            var interactions = null;
            if (enable) {
                // Remove all ol interactions before switching to 3d view.
                // Editing interactions after ol map is hidden doesn't work.
                interactions = map.getInteractions();
                if (interactions) {
                    var removals = [];
                    interactions.forEach(function (cur) {
                        removals.push(cur);
                    });
                    removals.forEach(function (cur) {
                        map.removeInteraction(cur);
                    });
                }
            } else {
                // Add default interactions to 2d view.
                interactions = olInteractionDefaults({
                    altShiftDragRotate: false,
                    pinchRotate: false
                });
                interactions.forEach(function (cur) {
                    map.addInteraction(cur);
                });
            }
            this._map3d.setEnabled(enable);
        },
        /**
         * Returns camera's position and orientation for state saving purposes.
         */
        getCamera: function () {
            var view = {};
            var olcsCam = this._map3d.getCamera();
            var coords = olcsCam.getPosition();
            view.location = {
                x: coords[0],
                y: coords[1],
                altitude: olcsCam.getAltitude()
            }
            var sceneCam = this._map3d.getCesiumScene().camera;
            view.orientation = {
                heading: Cesium.Math.toDegrees(sceneCam.heading),
                pitch: Cesium.Math.toDegrees(sceneCam.pitch),
                roll: Cesium.Math.toDegrees(sceneCam.roll)
            }
            return view;
        },
        /**
         * Turns on 3D view and positions the camera.
         *
         * Options example:
         * Camera location in map projection coordinates (EPSG:3857)
         * Orientation values in degrees
         * {
                location: {
                    x: 2776460.39,
                    y: 8432972.40,
                    altitude: 1000.0 //meters
                },
                orientation: {
                    heading: 90.0,  // east, default value is 0.0 (north)
                    pitch: -90,     // default value (looking down)
                    roll: 0.0       // default value
                }
         * }
         */
        setCamera: function (options) {
            this.set3dEnabled(true);
            if (this._mapReady) {
                if (options) {
                    var camera = this._map3d.getCesiumScene().camera;
                    var view = {};
                    if (options.location) {
                        var pos = options.location;
                        var lonlat = olProj.transform([pos.x, pos.y], this.getProjection(), 'EPSG:4326');
                        view.destination = new Cesium.Cartesian3.fromDegrees(lonlat[0], lonlat[1], pos.altitude);
                    }
                    if (options.orientation) {
                        view.orientation = {
                            heading: this._toRadians(options.orientation.heading),
                            pitch: this._toRadians(options.orientation.pitch),
                            roll: this._toRadians(options.orientation.roll)
                        }
                    }
                    camera.setView(view);
                    this._map3d.getCamera().updateView();
                    this.updateDomain();
                }
            } else {
                // Cesium is not ready yet. Fire after it has been initialized properly.
                this._mapReadySubscribers.push({
                    operation: this.setCamera,
                    arguments: [options]
                });
            }
        },
        _toRadians: function (value) {
            return !isNaN(value) ? Cesium.Math.toRadians(value) : undefined;
        },
        /**
         * Returns state for mapmodule including plugins that have getState() function
         * @method getState
         * @return {Object} properties for each pluginName
         */
        getState: function () {
            var state = {
                plugins: {}
            };
            var pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getState) {
                    state.plugins[pluginName] = this._pluginInstances[pluginName].getState();
                }
            }
            if (this._map3d.getEnabled()) {
                state.camera = this.getCamera();
            }
            return state;
        },
        /**
         * Returns state for mapmodule including plugins that have getStateParameters() function
         * @method getStateParameters
         * @return {String} link parameters for map state
         */
        getStateParameters: function () {
            var params = '';
            var pluginName;

            if (this._map3d.getEnabled()) {
                var cam = this.getCamera();
                params +=
                    '&cam=' + cam.location.x.toFixed(0) +
                    '_' + cam.location.y.toFixed(0) +
                    '_' + cam.location.altitude.toFixed(0) +
                    '_' + cam.orientation.heading.toFixed(2) +
                    '_' + cam.orientation.pitch.toFixed(2) +
                    '_' + cam.orientation.roll.toFixed(2);
            }

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getStateParameters) {
                    params = params + this._pluginInstances[pluginName].getStateParameters();
                }
            }
            return params;
        }
/* --------- /Impl specific - PARAM DIFFERENCES  ----------------> */
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapModule']
    });
