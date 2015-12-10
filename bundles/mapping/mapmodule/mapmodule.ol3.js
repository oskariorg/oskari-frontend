/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
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
     *      srsName : "EPSG:3067"
     *  }
     */

    function (id, imageUrl, options, mapDivId) {
        this._dpi = 72;   //   25.4 / 0.28;  use OL2 dpi so scales are calculated the same way
    }, {
        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * @return {OpenLayers.Map}
         */
        _initImpl: function (sandbox, options, map) {
            // TODO remove this whenever we're ready to add the containers when needed
            this._addMapControlPluginContainers();
            // css references use olMap as selectors so we need to add it
            this.getMapEl().addClass('olMap');
            return map;
        },

        /**
         * @method createMap
         * Creates Openlayers 3 map implementation
         * @return {ol.Map}
         */
        createMap: function() {

            var me = this;
            var sandbox = me._sandbox;
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup

            var map = new ol.Map({
                keyboardEventTarget: document,
                target: this.getMapElementId()
            });

            var projection = ol.proj.get(me.getProjection());
            projection.setExtent(this.__boundsToArray(this.getMaxExtent()));

            map.setView(new ol.View({
                extent: projection.getExtent(),
                projection: projection,
                // actual startup location is set with MapMoveRequest later on
                // still these need to be set to prevent errors
                center: [0, 0],
                zoom: 0,
                resolutions: this.getResolutionArray()
            }));

            me._setupMapEvents(map);

            return map;
        },
        /**
         * Add map event handlers
         * @method @private _setupMapEvents
         */
        _setupMapEvents: function(map){
            var me = this;
            var sandbox = me._sandbox;

            map.on('moveend', function(evt) {
                var map = evt.map;
                var extent = map.getView().calculateExtent(map.getSize());
                var center = map.getView().getCenter();

                sandbox.getMap().setMoving(false);
                sandbox.printDebug("sending AFTERMAPMOVE EVENT from map Event handler");

                var lonlat = map.getView().getCenter();
                me.updateDomain();
                var sboxevt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[1], map.getView().getZoom(), false, me.getMapScale());
                sandbox.notifyAll(sboxevt);
            });

            map.on('singleclick', function (evt) {
                var CtrlPressed = evt.originalEvent.ctrlKey;
                var lonlat = {
                  lon : evt.coordinate[0],
                  lat : evt.coordinate[1]
                };
                var mapClickedEvent = sandbox.getEventBuilder('MapClickedEvent')(lonlat, evt.pixel[0], evt.pixel[1], CtrlPressed);
                sandbox.notifyAll(mapClickedEvent);
            });

            map.on('pointermove', function (evt) {
                var hoverEvent = sandbox.getEventBuilder('MouseHoverEvent')(evt.coordinate[0], evt.coordinate[1], false);
                sandbox.notifyAll(hoverEvent);
            });
        },
        _startImpl: function () {
            this.getMap().render();
            return true;
        },

/* OL3 specific - check if this can be done in a common way
------------------------------------------------------------------> */
        getInteractionInstance: function (interactionName) {
            var interactions = this.getMap().getInteractions().getArray();
            var interactionInstance = interactions.filter(function(interaction) {
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
        __boundsToArray : function(bounds) {
            var extent = bounds || [];
            if(bounds.left && bounds.top && bounds.right && bounds.bottom) {
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
        getPixelFromCoordinate : function(lonlat) {
            lonlat = this.normalizeLonLat(lonlat);
            var px = this.getMap().getPixelFromCoordinate([lonlat.lon, lonlat.lat]);
            return {
                x : px[0],
                y : px[1]
            };
        },

        getMapCenter: function() {
            var center = this.getMap().getView().getCenter();
            return {
                lon : center[0],
                lat : center[1]
            };
        },

        getMapZoom: function() {
            return this.getMap().getView().getZoom();
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
            var view = this.getMap().getView(),
                centerCoords = view.getCenter();
                centerPixels = this.getMap().getPixelFromCoordinate(centerCoords),
                newCenterPixels = [centerPixels[0] + pX, centerPixels[1] + pY],
                newCenterCoords = this.getMap().getCoordinateFromPixel(newCenterPixels),
                pan = ol.animation.pan({
                    duration: 100,
                    source: (centerCoords)
                });

            this.getMap().beforeRender(pan);
            view.setCenter(newCenterCoords);

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
         * Transforms coordinates from given projection to the maps projectino.
         * @param {Object} pLonlat object with lon and lat keys
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @return {Object} transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (pLonlat, srs) {
            if(!srs || this.getProjection() === srs) {
                return pLonlat;
            }
            // TODO: check that srs definition exists as in OL2
            //var transformed = new ol.proj.fromLonLat([pLonlat.lon, pLonlat.lat], this.getProjection());
            var transformed = ol.proj.transform([pLonlat.lon, pLonlat.lat], srs, this.getProjection());
            return {
              lon : transformed[0],
              lat : transformed[1]
            };
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
         */
        addLayer: function(layerImpl) {
            if(!layerImpl) {
                return;
            }
            this.getMap().addLayer(layerImpl);
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
         * @param {ol.layer.Layer} layer ol3 specific!
         */
        setLayerIndex: function(layerImpl, index) {
            var layerColl = this.getMap().getLayers();
            var layerIndex = this.getLayerIndex(layerImpl);

            /* find */
            /* remove */
            /* insert at */

            if (index === layerIndex) {
                return
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
        getStyle : function(styleDef) {
            styleDef = styleDef || {};
            var olStyle = {};
            if(Oskari.util.keyExists(styleDef, 'fill.color')) {
                olStyle.fill = new ol.style.Fill({
                  color: styleDef.fill.color
                });
            }
            if(styleDef.stroke) {
                var stroke = {};
                if(styleDef.stroke.color) {
                    stroke.color = styleDef.stroke.color;
                }
                if(styleDef.stroke.width) {
                    stroke.width = styleDef.stroke.width;
                }
                olStyle.stroke = new ol.style.Stroke(stroke);
            }
            if(styleDef.image) {
                var image = {};
                if(styleDef.image.radius) {
                    image.radius = styleDef.image.radius;
                }
                if(Oskari.util.keyExists(styleDef.image, 'fill.color')) {
                    image.fill = new ol.style.Fill({
                        color: styleDef.image.fill.color
                    });
                }
                olStyle.image = new ol.style.Circle(image);
            }
            if(styleDef.text) {
                var text = {};
                if(styleDef.text.scale) {
                    text.scale = styleDef.text.scale;
                }
                if(Oskari.util.keyExists(styleDef.text, 'fill.color')) {
                    text.fill = new ol.style.Fill({
                        color: styleDef.text.fill.color
                    });
                }
                if(styleDef.text.stroke) {
                    var textStroke = {};
                    if(styleDef.text.stroke.color) {
                        textStroke.color = styleDef.text.stroke.color;
                    }
                    if(styleDef.text.stroke.width) {
                        textStroke.width = styleDef.text.stroke.width;
                    }
                    text.stroke = new ol.style.Stroke(textStroke);
                }
                olStyle.text = new ol.style.Text(text);
            }

            return new ol.style.Style(olStyle);
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
