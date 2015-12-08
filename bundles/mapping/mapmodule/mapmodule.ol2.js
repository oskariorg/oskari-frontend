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
    }, {

        /**
         * @method _initImpl
         * Implements Module protocol init method. Creates the OpenLayers Map.
         * Called at the end of AbstractMapModule init()
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
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
            this._map.addLayer(base);

            // TODO remove this whenever we're ready to add the containers when needed
            this._addMapControlPluginContainers();
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
            var sandbox = this._sandbox;
            // this is done BEFORE enhancement writes the values to map domain
            // object... so we will move the map to correct location
            // by making a MapMoveRequest in application startup
            var lonlat = new OpenLayers.LonLat(0, 0);
            // Defaults set in AbstarctMapModule
            var extent = new OpenLayers.Bounds(this._maxExtent.left, this._maxExtent.bottom, this._maxExtent.right, this._maxExtent.top);
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

            me._setupMapEvents(map);

            return map;
        },

        /**
         * Add map click handler
         * @method @private _setupMapEvents
         */
        _setupMapEvents: function(map){
            var me = this;
            //Set up a click handler
            OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
                defaultHandlerOptions: {
                    'double': true,
                    'stopDouble': true
                },

                initialize: function(options) {
                    this.handlerOptions = OpenLayers.Util.extend(
                        {}, this.defaultHandlerOptions
                    );
                    OpenLayers.Control.prototype.initialize.apply(
                        this, arguments
                    );
                    this.handler = new OpenLayers.Handler.Click(
                        this, {
                            'click': function(evt){
                                me.__sendMapClickEvent(evt);
                            }
                        }, this.handlerOptions
                    );
                }
            });

            var click = new OpenLayers.Control.Click();
            map.addControl(click);
            click.activate();
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
            var lonlat = this._map.getLonLatFromViewPortPx(evt.xy);
            var evtBuilder = sandbox.getEventBuilder('MapClickedEvent');
            var event = evtBuilder(lonlat, evt.xy.x, evt.xy.y);
            sandbox.notifyAll(event);
        },
/*<------------- / OL2 specific ----------------------------------- */


/* Impl specific - found in ol2 AND ol3 modules
------------------------------------------------------------------> */

        getPixelFromCoordinate : function(lonlat) {
            lonlat = this.normalizeLonLat(lonlat);
            var px = this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(lonlat.lon, lonlat.lat));
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
            return this._map.getZoom();
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
            this._map.zoomToExtent(bounds);
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
            this._map.setCenter(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), zoom, false);
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
        getCurrentExtent: function(){
            var bbox = this.getMap().getExtent();
            return {
                left: bbox.left,
                bottom: bbox.bottom,
                right: bbox.right,
                top: bbox.top
            };
        },
/* --------- /Impl specific --------------------------------------> */


/* Impl specific - PRIVATE
------------------------------------------------------------------> */
        _calculateScalesImpl: function (resolutions) {
            for (var i = 0; i < resolutions.length; i += 1) {
                var calculatedScale = OpenLayers.Util.getScaleFromResolution(
                    resolutions[i],
                    // always calculate to meters
                    'm'
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
            this._map.zoomTo(newZoomLevel);
        },
/* --------- /Impl specific - PRIVATE ----------------------------> */




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
            this._map.pan(pX, pY, {
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
         * @method moveMapByPixels
         * Moves the map by given amount of pixels.
         * @param {Number} pX amount of pixels to move on x axis
         * @param {Number} pY amount of pixels to move on y axis
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        moveMapByPixels: function (pX, pY, suppressStart, suppressEnd) {
            // usually by mouse
            this._map.moveByPx(pX, pY);
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
        centerMapByPixels: function (pX, pY, suppressStart, suppressEnd) {
            var newXY = new OpenLayers.Pixel(pX, pY),
                newCenter = this._map.getLonLatFromViewPortPx(newXY);
            // check that the coordinates are reasonable, otherwise its easy to
            // scrollwheel the map out of view
            if (!this.isValidLonLat(newCenter.lon, newCenter.lat)) {
                // do nothing if not valid
                return;
            }
            // send note about map change
            if (suppressStart !== true) {
                this.notifyStartMove();
            }
            this.centerMap(newCenter, this.getMapZoom(), suppressEnd);

        },



        /**
         * @method transformCoordinates
         * Transforms coordinates from given projection to the maps projection.
         * @param {Object} pLonlat object with lon and lat keys
         * @param {String} srs projection for given lonlat params like "EPSG:4326"
         * @return {Object} transformed coordinates as object with lon and lat keys
         */
        transformCoordinates: function (pLonlat, srs) {
            if(!srs || this.getProjection() === srs) {
                return pLonlat;
            }
            var isProjectionDefined = Proj4js.defs[srs];
            if (!isProjectionDefined) {
                throw 'SrsName not supported! Provide Proj4js.def for ' + srs;
            }
            var tmp = new OpenLayers.LonLat(pLonlat.lon, pLonlat.lat);
            var transformed = tmp.transform(new OpenLayers.Projection(srs), this.getMap().getProjectionObject());

            return {
                lon : transformed.lon,
                lat : transformed.lat
            };
        },

        _addMapControlImpl: function (ctl) {
            this._map.addControl(ctl);
        },

        _removeMapControlImpl: function (ctl) {
            this._map.removeControl(ctl);
        },

        setLayerIndex: function (layerImpl, index) {
            this._map.setLayerIndex(layerImpl, index);
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
            var zIndex = Math.max(this._map.Z_INDEX_BASE.Feature,layerZIndex);
            buffer = buffer || 1;

            layer.setZIndex(zIndex + buffer);
            this.orderLayersByZIndex();
        },

        /**
         * @method orderLayersByZIndex
         * Orders layers by Z-indexes.
         */
        orderLayersByZIndex: function() {
            this._map.layers.sort(function(a, b){
                return a.getZIndex()-b.getZIndex();
            });
        },

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapModule']
    });
