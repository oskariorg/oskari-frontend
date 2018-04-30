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
     }, {
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
         * Creates Openlayers 3 map implementation
         * @return {ol.Map}
         */
        createMap: function () {
            var me = this;
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup
            
            var controls = ol.control.defaults({
                zoom: false,
                attribution: false,
                rotate: false
            });
            var interactions = ol.interaction.defaults({
                altShiftDragRotate: false,
                pinchRotate: false
            });

            var map = new ol.Map({
                keyboardEventTarget: document,
                target: this.getMapElementId(),
                controls: controls,
                interactions: interactions,
                loadTilesWhileInteracting: true,
                loadTilesWhileAnimating: true,
                moveTolerance: 2
            });

            var projection = ol.proj.get(me.getProjection());
            map.setView(new ol.View({
                projection: projection,
                // actual startup location is set with MapMoveRequest later on
                // still these need to be set to prevent errors
                center: [0, 0],
                zoom: 0,
                resolutions: this.getResolutionArray()
            }));

            me._setupMapEvents(map);

            var olcsMap = new olcs.OLCesium({
                map: map,
                time () {
                    return Cesium.JulianDate.now();
                }
            });

            map.olcsMap = olcsMap;
            return map;
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
            this.getMap().olcsMap.setEnabled(true);

            /*
             * This does not belong here.
             * Should set altitude from state on load.
             */
            this.getMap().olcsMap.getCamera().setAltitude(1000000);

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

        getMapCenter: function() {
            var center = this.getMap().getView().getCenter();
            return {
                lon : center[0],
                lat : center[1]
            };
        },

        getMapZoom: function() {
            // Touch devices zoom level (after pinch zoom) may contains decimals
            // for this reason zoom need rounded to nearest integer.
            // Tested with Android pinch zoom.
            return Math.round(this.getMap().getView().getZoom());
        },

        getSize: function() {
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
        getProjectionUnits: function(srs){
            var me = this;
            var units = null;
            srs = srs || me.getProjection();

            try {
                var proj = ol.proj.get(srs);
                units = proj.getUnits(); // return 'degrees' or 'm'
            } catch(err){
                var log = Oskari.log('Oskari.mapframework.ui.module.common.MapModule');
                log.warn('Cannot get map units for "' + srs + '"-projection!');
            }
            return units;
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

            var isSRSDefined = ol.proj.get(srs);
            var isTargetSRSDefined = ol.proj.get(targetSRS);

            if (isSRSDefined && isTargetSRSDefined) {
              var transformed = ol.proj.transform([pLonlat.lon, pLonlat.lat], srs, targetSRS);
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
                mpu = ol.proj.METERS_PER_UNIT[units];

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
/* --------- /Impl specific - PRIVATE ----------------------------> */

/* Impl specific - found in ol2 AND ol3 modules BUT parameters and/or return value differ!!
------------------------------------------------------------------> */

        /**
         * @param {ol.layer.Layer} layer ol3 specific!
         * @param {Boolean} toBottom if false or missing adds the layer to the top, if true adds it to the bottom of the layer stack
         */
        addLayer: function(layerImpl, toBottom) {
            if(!layerImpl) {
                return;
            }
            this.getMap().addLayer(layerImpl);
            // check for boolean true instead of truthy value since some calls might send layer name as second parameter/functionality has changed
            if(toBottom === true) {
                this.setLayerIndex(layerImpl, 0);
            }
        },
        /**
         * @param {ol.layer.Layer} layer ol3 specific!
         */
        removeLayer : function(layerImpl) {
            if(!layerImpl) {
                return;
            }
            this.getMap().removeLayer(layerImpl);
            if(typeof layerImpl.destroy === 'function') {
                layerImpl.destroy();
            }
        },
        /**
         * Brings map layer to top
         * @method bringToTop
         *
         * @param {ol.layer.Layer} layer The new topmost layer
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
            this.getMap().olcsMap.setEnabled(!this.isDrawing);
        },
        /**
         * @param {ol.layer.Layer} layer ol3 specific!
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
         * @param {ol.layer.Layer} layer ol3 specific!
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
         * @param {ol.control.Control} layer ol3 specific!
         */
        _addMapControlImpl: function(ctl) {
            this.getMap().addControl(ctl);
        },
        /**
         * @param {ol.control.Control} layer ol3 specific!
         */
        _removeMapControlImpl: function(ctl) {
            this.getMap().removeControl(ctl);
        },

        /**
         * Creates style based on JSON
         * @return {ol.style.Style} style ol3 specific!
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
                olStyle.fill = new ol.style.Fill({
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
            return new ol.style.Style(olStyle);
        },
        /**
         * Parses stroke style from json
         * @method __getStrokeStyle
         * @param {Object} style json
         * @return {ol.style.Stroke}
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
            return new ol.style.Stroke(stroke);
        },
        /**
         * Parses image style from json
         * @method __getImageStyle
         * @param {Object} style json
         * @return {ol.style.Circle}
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
                image = new ol.style.Icon({
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
                image = new ol.style.Icon({
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
                image.fill = new ol.style.Fill({
                    color: styleDef.image.fill.color
                });
            }
            if(styleDef.stroke) {
                image.stroke = this.__getStrokeStyle(styleDef);
            }
            return new ol.style.Circle(image);
        },
        /**
         * Parses JSON and returns matching ol.style.Text
         * @param  {Object} textStyleJSON text style definition
         * @return {ol.style.Text} parsed style or undefined if no param is given
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
                text.fill = new ol.style.Fill({
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
            return new ol.style.Text(text);
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
