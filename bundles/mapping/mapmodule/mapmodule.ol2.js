/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation for Openlayers 2.
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.MapModule',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     *      Unigue ID for this map
     * @param {Array} map options, example data:
     *  {
     *      resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
     *      units : "m",
     *      maxExtent : {
     *          left : 0,
     *          bottom : 0,
     *          right : 10000000,
     *          top : 10000000
     *      },
     *      srsName : "EPSG:3067",
     *      openLayers : {
     *           imageReloadAttemps: 5,
     *           onImageLoadErrorColor: 'transparent'
     *      }
     *  }
     */

    function (id, imageUrl, options, mapDivId) {
		this._defaulfMarkerShape = 2;
		this._preSVGIconUrl = 'data:image/svg+xml;base64,';
    }, {

        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * Called at the end of AbstractMapModule init()
         * @param {Oskari.Sandbox} sandbox
         * @return {OpenLayers.Map}
         */
        _initImpl: function (sandbox, options, map) {
            /*Added to handle pink tiles */
      	    var olOpts = options.openLayers || {};
            OpenLayers.IMAGE_RELOAD_ATTEMPTS = olOpts.imageReloadAttemps || 5;
            OpenLayers.Util.onImageLoadErrorColor = olOpts.onImageLoadErrorColor || 'transparent';

            // This is something that OL2 needs to work, without it Ol2 doesn't startup correctly
            // can be ignored after it's done
            var base = new OpenLayers.Layer('BaseLayer', {
                layerId: 0,
                isBaseLayer: true,
                displayInLayerSwitcher: false
            });
            this.getMap().addLayer(base);

            return map;
        },

        /**
         * @method createMap
         * @private
         * Creates Openlayers 2 map implementation
         * Called by init
         * @return {OpenLayers.Map}
         */
        createMap: function () {
            var me = this;
            var sandbox = this.getSandbox();
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup
            var lonlat = new OpenLayers.LonLat(0, 0);
            // Defaults set in AbstarctMapModule
            var maxExt = this.getMaxExtent();
            var extent = new OpenLayers.Bounds(maxExt.left, maxExt.bottom, maxExt.right, maxExt.top);
            var map = new OpenLayers.Map({
                controls: [],
                units: this._options.units, //'m',
                maxExtent: extent,
                resolutions: this.getResolutionArray(),
                projection: this.getProjection(),
                isBaseLayer: true,
                center: lonlat,
                // https://github.com/openlayers/openlayers/blob/master/notes/2.13.md#map-property-fallthrough-defaults-to-false
                // fallThrough: true is needed for statsgrid drag resizing
                fallThrough: true,
                theme: null,
                zoom: 0,
                zoomMethod: null
            });

            return map;
        },

        _startImpl: function () {
            this.getMap().render(this.getMapElementId());
            return true;
        },


/* OL2 specific - check if this can be done in a common way
------------------------------------------------------------------> */
        /**
         * Send map click event.
         * @method  @private __sendMapClickEvent
         * @param  {Object} evt event object
         */
        __sendMapClickEvent : function(evt) {
            var sandbox = this.getSandbox();
            /* may be this should dispatch to mapmodule */
            var lonlat = this.getMap().getLonLatFromViewPortPx(evt.xy);
            var evtBuilder = sandbox.getEventBuilder('MapClickedEvent');
            var event = evtBuilder(lonlat, evt.xy.x, evt.xy.y);
            sandbox.notifyAll(event);
        },
        /**
         * Formats the measurement of the geometry.
         * Returns a string with the measurement and
         * an appropriate unit (m/km or m²/km²)
         * or an empty string for point.
         *
         * @public @method formatMeasurementResult
         *
         * @param  {OpenLayers.Geometry} geometry
         * @param  {String} drawMode
         * @return {String}
         *
         */
        formatMeasurementResult: function(geometry, drawMode) {
            var measurement,
                unit;

            if (drawMode === 'area') {
                measurement = (Math.round(100 * geometry.getGeodesicArea(this._projectionCode)) / 100);
                unit = ' m²';
                // 1 000 000 m² === 1 km²
                if (measurement >= 1000000) {
                    measurement = (Math.round(measurement) / 1000000);
                    unit = ' km²';
                }
            } else if (drawMode === 'line') {
                measurement = (Math.round(100 * geometry.getGeodesicLength(this._projectionCode)) / 100);
                unit = ' m';
                // 1 000 m === 1 km
                if (measurement >= 1000) {
                    measurement = (Math.round(measurement) / 1000);
                    unit = ' km';
                }
            } else {
                return '';
            }
            return measurement.toFixed(3).replace(
                '.',
                Oskari.getDecimalSeparator()
            ) + unit;
        },
/*<------------- / OL2 specific ----------------------------------- */


/* Impl specific - found in ol2 AND ol3 modules
------------------------------------------------------------------> */

        getPixelFromCoordinate : function(lonlat) {
            lonlat = this.normalizeLonLat(lonlat);
            var px = this.getMap().getViewPortPxFromLonLat(new OpenLayers.LonLat(lonlat.lon, lonlat.lat));
            return {
                x : px.x,
                y : px.y
            };
        },

        getMapCenter: function () {
            var center = this.getMap().getCenter();
            return {
                lon : center.lon,
                lat : center.lat
            };
        },

        getMapZoom: function () {
            // Touch devices zoom level (after pinch zoom) may contains decimals
            // for this reason zoom need rounded to nearest integer.
            // Tested with Android pinch zoom.
            return Math.round(this.getMap().getZoom());
        },

        getSize: function() {
            var size = this.getMap().getCurrentSize();
            return {
                width: size.w,
                height: size.h
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
            // OpenLayers.Bounds or Array (left, bottom, right, top)
            this.getMap().zoomToExtent(new OpenLayers.Bounds(bounds.left, bounds.bottom, bounds.right, bounds.top));
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
         * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
         * @param {Number} zoomLevel absolute zoomlevel to set the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMap: function (lonlat, zoom, suppressEnd) {
            // TODO: we have isValidLonLat(); maybe use it here
            lonlat = this.normalizeLonLat(lonlat);
            if(zoom === null ||zoom === undefined) {
                zoom = this.getMapZoom();
            }
            this.getMap().setCenter(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), zoom, false);
            this.updateDomain();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method  @public getMapUnits Get map units
         * @return {String} map units. 'degrees' or 'm'
         */
        getMapUnits: function(){
            var me = this;
            var map = me.getMap();
            return map.getUnits(); // return 'degrees' or 'm'
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
                var proj = new Proj4js.Proj(srs);
                units = proj.units || 'degrees'; // return 'degrees' or 'm'
            } catch(err){
                var log = Oskari.log('Oskari.mapframework.ui.module.common.MapModule');
                log.warn('Cannot get map units for "' + srs + '"-projection!');
            }
            return units;
        },

        /**
         * Get maps current extent.
         * @method getCurrentExtent
         * @return {Object} current extent
         */
        getCurrentExtent: function(){
            var bbox = this.getMap().getExtent();
            return {
                left: bbox.left,
                bottom: bbox.bottom,
                right: bbox.right,
                top: bbox.top
            };
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
            // usually programmatically for gfi centering
            this.getMap().pan(pX, pY, {
                dragging: (isDrag ? true : false),
                animate: false
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
         * @param {String} targetSRS projection to transform to like "EPSG:4326" (optional, defaults to map projection)
         * @return {Object} transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (pLonlat, srs, targetSRS) {
            if(!targetSRS) {
                targetSRS = this.getProjection();
            }
            if(!srs || targetSRS === srs) {
                return pLonlat;
            }

            var isSRSDefined = Proj4js.defs[srs];
            var isTargetSRSDefined = Proj4js.defs[targetSRS];

            if (isSRSDefined && isTargetSRSDefined) {
                var tmp = new OpenLayers.LonLat(pLonlat.lon, pLonlat.lat);
                var transformed = tmp.transform(new OpenLayers.Projection(srs), new OpenLayers.Projection(targetSRS));

                return {
                    lon : transformed.lon,
                    lat : transformed.lat
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
            this.getMap().layers.sort(function(a, b){
                return a.getZIndex()-b.getZIndex();
            });
        },
/* --------- /Impl specific --------------------------------------> */


/* Impl specific - PRIVATE
------------------------------------------------------------------> */
        _calculateScalesImpl: function (resolutions) {

            for (var i = 0; i < resolutions.length; i += 1) {
                var calculatedScale = OpenLayers.Util.getScaleFromResolution(
                    resolutions[i],
                    this._options.units
                );
                calculatedScale = calculatedScale * 10000;
                calculatedScale = Math.round(calculatedScale);
                calculatedScale = calculatedScale / 10000;
                this._mapScales.push(calculatedScale);
            }
        },
        _updateSizeImpl : function() {
            this.getMap().updateSize();
        },
        _setZoomLevelImpl : function(newZoomLevel) {
            this.getMap().zoomTo(newZoomLevel);
        },
/* --------- /Impl specific - PRIVATE ----------------------------> */


/* Impl specific - found in ol2 AND ol3 modules BUT parameters and/or return value differ!!
------------------------------------------------------------------> */

        /**
         * @param {OpenLayers.Layer} layer ol2 specific!
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
         * @param {OpenLayers.Layer} layer ol2 specific!
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
         * @param {OpenLayers.Layer} layer The new topmost layer
         * @param {Integer} buffer Add this buffer to z index. If it's undefined, using 1.
         */
        bringToTop: function(layer, buffer) {
            if (!layer || !layer.getZIndex) {
                return;
            }
            var layerZIndex = layer.getZIndex();
            var zIndex = Math.max(this.getMap().Z_INDEX_BASE.Feature,layerZIndex);
            buffer = buffer || 1;

            layer.setZIndex(zIndex + buffer);
            this.orderLayersByZIndex();
        },
        /**
         * @return {OpenLayers.Layer} layer ol2 specific!
         */
        getLayerIndex: function(layerImpl) {
            return this.getMap().getLayerIndex(layerImpl);
        },
        /**
         * @param {OpenLayers.Layer} layer ol2 specific!
         */
        setLayerIndex: function (layerImpl, index) {
            this.getMap().setLayerIndex(layerImpl, index);
        },

        /**
         * @param {OpenLayers.Control} control ol2 specific!
         */
        _addMapControlImpl: function (ctl) {
            this.getMap().addControl(ctl);
        },

        /**
         * @param {OpenLayers.Control} control ol2 specific!
         */
        _removeMapControlImpl: function (ctl) {
            this.getMap().removeControl(ctl);
        },
        /**
         * Creates style based on JSON
         * @return {Object} ol2 specific style hash
         */
        getStyle : function(styleDef) {
            var me = this,
                style = jQuery.extend(true, {}, styleDef),
                size;
            //create a blank style with default values
            var olStyle = OpenLayers.Util.applyDefaults({}, OpenLayers.Feature.Vector.style["default"]);
            // use sizePx if given
            if (style.image && style.image.sizePx){
                size = style.image.sizePx;
            } else if (style.image && style.image.size){
                size = this.getPixelForSize(style.image.size);
            } else {
                size = this._defaultMarker.size;
            }

            if(typeof size !== 'number'){
                size = this._defaultMarker.size;
            }

            olStyle.graphicWidth = size;
            olStyle.graphicHeight = size;

            // If svg marker
            if(me.isSvg(style.image)) {
                var svg = this.getSvg(style.image);
                olStyle.externalGraphic = svg;
            }
            // else if external graphic
            else if(style.image && style.image.shape) {
                olStyle.externalGraphic = style.image.shape;
                olStyle.graphicWidth = style.image.size || 32;
                olStyle.graphicHeight = style.image.size || 32;
                var offsetX = (!isNaN(style.image.offsetX))  ? style.image.offsetX : 16;
                var offsetY = (!isNaN(style.image.offsetY))  ? style.image.offsetY : 16;
                olStyle.graphicXOffset = -offsetX;
                olStyle.graphicYOffset = -(32 - offsetY);
            }

            if(style.image.opacity) {
                olStyle.fillOpacity = style.image.opacity;
            }

            if(style.stroke) {
                if(style.stroke.color) {
                    olStyle.strokeColor = style.stroke.color;
                }
                if(style.stroke.width) {
                    olStyle.strokeWidth = style.stroke.width;
                }
                if(style.stroke.lineDash) {
                    olStyle.strokeDashstyle = style.stroke.lineDash;
                }
                if(style.stroke.lineCap) {
                    olStyle.strokeLinecap = style.stroke.lineCap;
                }
            }
            if (style.image.radius) {
                if(style.image.radius) {
                    olStyle.pointRadius = style.image.radius;
                    //currently only supporting circle
                    olStyle.graphicName = "circle";
                }
            }
          if(style.text.font) {
            var split = style.text.font.split(" ");
            if(split[1]) {
               olStyle.fontSize = split[1];
            }
            if(split[0]) {
                olStyle.fontWeight = split[0];
            }
            if(split[2]) {
                olStyle.fontFamily = split[2];
            }
          }

          if(style.text.stroke && typeof style.text.stroke.width === 'number') {
            olStyle.labelOutlineWidth = style.text.stroke.width;
          }

          if(Oskari.util.keyExists(style, 'fill.color')) {
                olStyle.fillColor = style.fill.color;
          }
          if(Oskari.util.keyExists(style.text, 'fill.color')) {
              olStyle.fontColor = style.text.fill.color;
          }
          if(style.text.stroke) {
              if(style.text.stroke.color) {
                  olStyle.labelOutlineColor = style.text.stroke.color;
              }
              if(style.text.stroke.width) {
                  olStyle.labelOutlineWidth = style.text.stroke.width;
              }
          }
          // TODO: remove support for labelAlign as ol3 uses textAlign and we only want to support one
          if(style.text.labelAlign || style.text.textAlign) {
             olStyle.labelAlign = style.text.labelAlign || style.text.textAlign;
          }
          if(style.text.offsetX) {
             olStyle.labelXOffset = style.text.offsetX;
          }
          if(style.text.offsetY) {
             olStyle.labelYOffset = style.text.offsetY;
          }

          //label
          if (style.text.labelText) {
              if(typeof style.text.labelText === 'number'){
                  olStyle.label = style.text.labelText.toString();
              } else {
                  olStyle.label = style.text.labelText;
              }
          } else if (style.text.labelProperty) {
             olStyle.label = "${"+style.text.labelProperty+"}";
          }
            return olStyle;
        },
        /**
         * Create a feature from a wkt and calculate a new map viewport to be able to view entire geometry and center to it
         * @param {String} wkt Well known text representation of the geometry
         */
        getViewPortForGeometry: function(wkt) {

            if (!wkt) {
                return null;
            }
            var me = this,
                feature = me.getFeatureFromWKT(wkt),
                centroid,
                bounds,
                mapBounds,
                zoomToBounds = null;

            if (!feature) {
                return;
            }

            if (feature && feature.geometry && feature.geometry.getBounds()) {
                bounds = feature.geometry.getBounds();
                centroid = bounds.toGeometry().getCentroid();
                mapBounds = me.getMap().getExtent();
                //if both width and height are < mapbounds', no need to change the bounds. Otherwise use the feature's geometry's bounds.
                if (bounds.getHeight() < mapBounds.getHeight() && bounds.getWidth() < mapBounds.getWidth()) {
                    zoomToBounds = null;
                } else {
                    zoomToBounds = bounds;
                }
                return {
                    'x': centroid.x,
                    'y': centroid.y,
                    'bounds': zoomToBounds
                };
            }

            return null;
        },
        /**
         * @method getFeatureFromWKT
         */
        getFeatureFromWKT: function(wkt) {
            var wktFormat = new OpenLayers.Format.WKT(),
                feature = wktFormat.read(wkt);

            return feature;
        },
        /**
         * @method getLayerTileUrls
         * @param layerId id of the layer
         * @return {String[]}
         * Get urls of tile layer tiles.
         */
        getLayerTileUrls: function(layerId) {
            var OLlayers = this.getOLMapLayers(layerId);
            var urls = [];
            OLlayers[0].grid.forEach(function (a) {
                a.forEach(function (b) {
                    urls.push(b.url);
                });
            });
            return urls;
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
