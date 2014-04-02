/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
define(["bundles/framework/bundle/mapmodule-plugin/ui/module/map-module"], function(MapModule) {
    Oskari.cls('Oskari.mapframework.ui.module.common.MapModule').category({
        /**
         * @method createBaseLayer
         * Creates a dummy base layer and adds it to the map. Nothing to do with Oskari maplayers really.
         * @private
         */
        _createBaseLayer: function () {
            // do nothing
        },
        _getMapCenter: function () {
            return this._map.getCenter();
        },
        _getMapZoom: function () {
            return this._map.getZoom();
        },
        _getMapLayersByName: function (layerName) {
            // FIXME: Cannot detect Marker layer, which is called Overlays in OL3
            return [];
        },
        getProjection: function() {
            return this._projection;
        },
        getExtent: function () {
            return this.getMapExtent();
        },

        /**
         * @method createMap
         * @private
         * Creates the OpenLayers.Map object
         * @return {OpenLayers.Map}
         */
        _createMapImpl: function() {

            var sandbox = this._sandbox;
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup

            var maxExtent = this._maxExtent;
            var extent = this._extent;

            L.CRS.proj4js = (function() {
                var createProjection = function(code, def, /*L.Transformation*/ transformation) {
                    if (typeof(def) !== 'undefined') {
                        Proj4js.defs[code] = def;
                    }
                    var proj = new Proj4js.Proj(code);

                    return {
                        project: function(latlng) {
                            var point = new L.Point(latlng.lng, latlng.lat);
                            return Proj4js.transform(Proj4js.WGS84, proj, point);
                        },

                        unproject: function(point, unbounded) {
                            var point2 = Proj4js.transform(proj, Proj4js.WGS84, point.clone());
                            return new L.LatLng(point2.y, point2.x, unbounded);
                        }
                    };
                };

                return function(code, def, transformation) {
                    return L.Util.extend({}, L.CRS, {
                        code: code,
                        transformation: transformation ? transformation : new L.Transformation(1, 0, -1, 0),
                        projection: createProjection(code, def)
                    });
                };
            }());

            /* TODO support others as well */
            console.log("WARNING: EPSG:3067 hard coded temporarily");
//            var crs = L.CRS.proj4js('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs', new L.Transformation(1, 548576.0, -1, 8388608));
            var crs = L.CRS.proj4js('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs', new L.Transformation(1, -156499, -1, 7100255));

            crs.scale = function(zoom) {
                return 1 / resolutions[zoom];
                //    return 1 / ( 8192 / Math.pow(2, zoom) );
            };

            this._projection = crs;

            var resolutions = this._mapResolutions;

            var map = L.map('mapdiv', {
                crs: crs,
                scale: function(zoom) {
                    //  return 1 / ( 8192 / Math.pow(2, zoom) );
                    return 1 / resolutions[zoom];
                },
                center: [65.53425, 24.86703333],
                zoom: 2,
                continuousWorld: true,
                trackResize: false
            });
            window.debugMap = map;

            var me = this;

            map.on('moveend', function(e) {
                //

                var extent = me.getMapExtent();
                var center = map.getCenter();
                var zoom = map.getZoom();
                var lonlat = me._map2Crs(center.lng, center.lat);
                console.log("MOVEEND", e, extent, center, zoom, lonlat);

                me._updateDomainImpl();
                var sboxevt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[1], map.getZoom(), false, me.getMapScale());
                sandbox.notifyAll(sboxevt);

            });

            /*var kunnat = L.tileLayer.wms("http://viljonkkatu01.nls.fi:8280/geoserver/wms", {
         layers : 'tilastoalueet%3Akunnat2013',
         format : 'image/png',
         transparent : true,
         attribution : "MML",
         continuousWorld : true

         });

         map.addLayer(kunnat);*/

            this._map = map;

            return this._map;
        },
        /**
         * @method moveMapToLanLot
         * Moves the map to the given position.
         * NOTE! Doesn't send an event if zoom level is not changed.
         * Call notifyMoveEnd() afterwards to notify other components about changed state.
         * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
         * @param {Boolean} pIsDragging true if the user is dragging the map to a new location currently (optional)
         */
        moveMapToLanLot: function(lonlat, zoomAdjust, pIsDragging) {
            // TODO: openlayers has isValidLonLat(); maybe use it here
            var isDragging = (pIsDragging === true);
            // using panTo BREAKS IE on startup so do not
            // should we spam events on dragmoves?
            var mapLatLon = this._crs2Map(lonlat.lon, lonlat.lat);
            this._map.setView(mapLatLon);

            if (zoomAdjust) {
                this.adjustZoomLevel(zoomAdjust, true);
            }

            this._updateDomainImpl();
        },
        /**
         * @method panMapToLonLat
         * Pans the map to the given position.
         * @param {OpenLayers.LonLat} lonlat coordinates to pan the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        panMapToLonLat: function(lonlat, suppressEnd) {
            var mapLatLon = this._crs2Map(lonlat.lon, lonlat.lat);
            this._map.setView(mapLatLon);
            this._updateDomainImpl();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * @method zoomToScale
         * Pans the map to the given position.
         * @param {float} scale the new scale
         * @param {Boolean} closest find the zoom level that most closely fits the specified scale.
         *   Note that this may result in a zoom that does not exactly contain the entire extent.  Default is false
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToScale: function(scale, closest, suppressEnd) {
            var isClosest = (closest === true);
            this._map.zoomToScale(scale, isClosest);
            this._updateDomainImpl();
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
        centerMap: function(lonlat, zoom, suppressEnd) {
            // TODO: openlayers has isValidLonLat(); maybe use it here
            var mapLatLon = this._crs2Map(lonlat.lon, lonlat.lat);
            this._map.setView(mapLatLon, zoom || this._map.getZoom());

            this._updateDomainImpl();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
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
        panMapByPixels: function(pX, pY, suppressStart, suppressEnd, isDrag) {

            this._map.panBy([pX, pY], {
                animate: false
            });
            this._getMapLayersByName();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method centerMapByPixels
         * Moves the map so the given pixel coordinates relative to the viewport is on the center of the view port.
         * @param {Number} pX pixel coordinates on x axis
         * @param {Number} pY pixel coordinates on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMapByPixels: function(pX, pY, suppressStart, suppressEnd) {

            /*var newXY = new OpenLayers.Pixel(pX, pY);
         var newCenter = this._map.getLonLatFromViewPortPx(newXY);
         // check that the coordinates are reasonable, otherwise its easy to
         // scrollwheel the map out of view
         if (!this.isValidLonLat(newCenter.lon, newCenter.lat)) {
         // do nothing if not valid
         return;
         }
         this.moveMapToLanLot(newCenter);
         */
            throw "centerMapByPixels NYI";
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
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
        zoomToExtent: function(bounds, suppressStart, suppressEnd) {

            var sw = this._crs2Map(bounds.left, bounds.bottom);
            var ne = this._crs2Map(bounds.right, bounds.top);
            var mapBounds = new L.LatLngBounds(sw, ne);

            this._map.fitBounds(mapBounds);

            this._updateDomainImpl();
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },
        /**
         * @method adjustZoomLevel
         * Adjusts the maps zoom level by given relative number
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1
         * @param {Boolean} suppressEvent true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        adjustZoomLevel: function(amount, suppressEvent) {
            var delta = amount;
            var currZoom = this._map.getZoom();
            var newZoom = currZoom + delta;

            return this.setZoomLevel(newZoom, suppressEvent);
        },
        /**
         * @method setZoomLevel
         * Sets the maps zoom level to given absolute number
         * @param {Number} newZoomLevel absolute zoom level (0-12)
         * @param {Boolean} suppressEvent true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        setZoomLevel: function(newZoomLevel, suppressEvent) {
            if (newZoomLevel == this._map.getZoom()) {
                // do nothing if requested zoom is same as current
                return;
            }
            if (newZoomLevel < 0 || newZoomLevel > this._map.getNumZoomLevels) {
                newZoomLevel = this._map.getZoom();
            }
            this._map.setZoom(newZoomLevel);
            this._updateDomainImpl();
            if (suppressEvent !== true) {
                // send note about map change
                this.notifyMoveEnd();
            }
        },

        getOLMapLayers: function() {
            console.log('Not implemented in Leaflet yet!');
            return [];
        },
        getZoomLevel: function() {
            return this._map.getZoom();
        },

        /**
         * @method _getNewZoomLevel
         * @private
         * Does a sanity check on a zoomlevel adjustment to see if the adjusted zoomlevel is
         * supported by the map (is between 0-12). Returns the adjusted zoom level if it is valid or
         * current zoom level if the adjusted one is out of bounds.
         * @return {Number} sanitized absolute zoom level
         */
        _getNewZoomLevel: function(adjustment) {
            // TODO: check isNaN?
            var requestedZoomLevel = this.getZoomLevel() + adjustment;

            if (requestedZoomLevel >= 0 && requestedZoomLevel <= this._map.getNumZoomLevels()) {
                return requestedZoomLevel;
            }
            // if not in valid bounds, return original
            return this.getZoomLevel();
        },
        /**
         * @method notifyStartMove
         * Notify other components that the map has started moving. Sends a MapMoveStartEvent.
         * Not sent always, preferrably track map movements by listening to AfterMapMoveEvent.
         * Ignores the call if map is in stealth mode
         */
        notifyStartMove: function() {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            this._sandbox.getMap().setMoving(true);
            var center = this._map.getCenter();
            var centerX = center[0];
            var centerY = center[1];
            var event = this._sandbox.getEventBuilder('MapMoveStartEvent')(centerX, centerY);
            this._sandbox.notifyAll(event);
        },
        /**
         * @method notifyMoveEnd
         * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
         * sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode. Plugins should use this to notify other components
         * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
         * (this class) calls this automatically if not stated otherwise in API documentation.
         */
        notifyMoveEnd: function() {
            /*if (this.getStealth()) {
         // ignore if in "stealth mode"
         return;
         }
         var sandbox = this._sandbox;
         sandbox.getMap().setMoving(false);

         var lonlat = this._map.getCenter();
         this._updateDomainImpl();
         var scale = this.getMapScale();
         var zoom = this._map.getZoom();
         var evt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[0], zoom, false, scale);
         sandbox.notifyAll(evt);
         */
            var sandbox = this._sandbox;
            sandbox.printDebug("notifyMoveEnd CALLED BUT will not send");
        },
        /**
         * @method _updateDomainImpl
         * @private
         * Updates the sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode.
         */
        _updateDomainImpl: function() {

            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            var sandbox = this._sandbox;
            var mapVO = sandbox.getMap();
            var latlng = this._map.getCenter();
            var lonlat = this._map2Crs(latlng.lng, latlng.lat);

            var zoom = this._map.getZoom();
            mapVO.moveTo(lonlat.x, lonlat.y, zoom);
            mapVO.setScale(this.getMapScale());

            var size = this.getMapSize();
            mapVO.setWidth(size[0]);
            mapVO.setHeight(size[1]);
            //mapVO.setResolution(this._map.getResolution());

            var extent = this.getMapExtent();
            var bbox = new OpenLayers.Bounds(extent[0], extent[1], extent[2], extent[3]);

            mapVO.setExtent(bbox);
            mapVO.setBbox(bbox)

            var maxBbox = this._maxExtent;
            var maxExtentBounds = new OpenLayers.Bounds(maxBbox.left, maxBbox.bottom, maxBbox.right, maxBbox.top);
            mapVO.setMaxExtent(maxExtentBounds);

        },

        _addLayerImpl: function(layerImpl) {
            this._map.addLayer(layerImpl);
        },

        _removeLayerImpl: function(layerImpl) {
            this._map.removeLayer(layerImpl);
        },

        _setLayerImplIndex: function(layerImpl, index) {
            layerImpl.setZIndex(index);
        },

        getMapScale: function() {
            var size = this.getMapSize();
            var extent = this.getMapExtent();
            var res = (extent[2] - extent[0]) / size[0];
            return OpenLayers.Util.getScaleFromResolution(res, 'm');

        },

        getMapSize: function() {
            var mapContainer = jQuery(this._map.getContainer());
            return [mapContainer.width(), mapContainer.height()];
        },
        getMapExtent: function() {
            var bounds = this._map.getBounds();
            var bsw = bounds.getSouthWest();
            var sw = this._map2Crs(bsw.lng, bsw.lat);
            var bne = bounds.getNorthEast();
            var ne = this._map2Crs(bne.lng, bsw.lat);
            return [sw.x, sw.y, ne.x, ne.y];
        },

        _crs2Map: function(x, y) {
            return this._projection.projection.unproject(new L.Point(x, y));
        },
        _map2Crs: function(x, y) {
            return this._projection.projection.project(new L.LatLng(y, x));
        },

        updateSize: function() {
            this._map._onResize();
            /* api bypass */
        },
        _setLayerImplVisible: function(layerImpl, visibility) {
            layerImpl.setVisible(visibility);
        },
        _addMapControlImpl: function(ctl) {
            this._map.addControl(ctl);
        },
        _removeMapControlImpl: function(ctl) {
            this._map.removeControl(ctl);
        }
    });
});