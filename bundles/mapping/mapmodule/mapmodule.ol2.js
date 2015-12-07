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
     *          bottom : 10000000,
     *          right : 10000000,
     *          top : 0
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
            this._mapClickedBuilder = sandbox.getEventBuilder('MapClickedEvent');
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
            var lonlat = new OpenLayers.LonLat(0, 0),
                mapExtent = new OpenLayers.Bounds(0, 0, 10000000, 10000000);
            // FIXME use some cleaner check
            if (this._options !== null &&
                this._options !== undefined &&
                this._options.maxExtent !== null &&
                this._options.maxExtent !== undefined &&
                this._options.maxExtent.left !== null &&
                this._options.maxExtent.left !== undefined &&
                this._options.maxExtent.bottom !== null &&
                this._options.maxExtent.bottom !== undefined &&
                this._options.maxExtent.right !== null &&
                this._options.maxExtent.right !== undefined &&
                this._options.maxExtent.top !== null &&
                this._options.maxExtent.top !== undefined) {
                mapExtent = new OpenLayers.Bounds(this._options.maxExtent.left, this._options.maxExtent.bottom, this._options.maxExtent.right, this._options.maxExtent.top);
            }
            var map = new OpenLayers.Map({
                controls: [],
                units: this._options.units, //'m',
                maxExtent: mapExtent,
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
        _getMapCenter: function () {
            return this._map.getCenter();
        },

        getMapZoom: function () {
            return this._map.getZoom();
        },

        getMapScale: function () {
            return this._map.getScale();
        },

/* Check if the next functions are necessary. Do they work?
------------------------------------------------------------------> */
        /**
         * @method getMapViewPortDiv
         * Returns a reference to the map viewport div for setting correct z-ordering of divs
         * @return {HTMLDivElement}
         */
        getMapViewPortDiv: function () {
            return this._map.viewPortDiv;
        },

        /**
         * @method getMapLayersContainerDiv
         * Returns a reference to the div containing the map layers for setting correct z-ordering of divs
         * @return {HTMLDivElement}
         */
        getMapLayersContainerDiv: function () {
            return this._map.layerContainerDiv;
        },

        _getMapLayersByName: function (layerName) {
            return this._map.getLayersByName(layerName);
        },


/*<--------------------------------------------------------------- */
        getPixelFromCoordinate : function(lonlat) {
            lonlat = this.normalizeLonLat(lonlat);
            var px = this._map.getViewPortPxFromLonLat(new OpenLayers.LonLat(lonlat.lon, lonlat.lat));
            return {
                x : px.x,
                y : px.y
            };
        },

        /**
         * @method getMaxZoomLevel
         * Gets map max zoom level.
         *
         * @return {Integer} map max zoom level
        */
        getMaxZoomLevel: function(){
            // getNumZoomLevels returns OL map resolutions length, so need decreased by one (this return max OL zoom)
            return this._map.getNumZoomLevels() - 1;
        },

        /**
         * Send map click event.
         * @method  @private __sendMapClickEvent
         * @param  {Object} evt event object
         */
        __sendMapClickEvent : function(evt) {
            var sandbox = this._sandbox;
            /* may be this should dispatch to mapmodule */
            var lonlat = this._map.getLonLatFromViewPortPx(evt.xy),
                event = this._mapClickedBuilder(lonlat, evt.xy.x, evt.xy.y);
            sandbox.notifyAll(event);
        },

        _calculateScalesImpl: function (resolutions) {
            for (var i = 0; i < resolutions.length; i += 1) {
                var calculatedScale = OpenLayers.Util.getScaleFromResolution(
                    resolutions[i],
                    'm'
                );
                calculatedScale = calculatedScale * 10000;
                calculatedScale = Math.round(calculatedScale);
                calculatedScale = calculatedScale / 10000;
                this._mapScales.push(calculatedScale);
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
        zoomToScale: function (scale, closest, suppressEnd) {
            var isClosest = (closest === true);
            this._map.zoomToScale(scale, isClosest);
            this._updateDomainImpl();
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
        zoomToExtent: function (bounds, suppressStart, suppressEnd) {
            this._map.zoomToExtent(bounds);
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
         * @method moveMapToLonLat
         * Moves the map to the given position.
         * NOTE! Doesn't send an event if zoom level is not changed.
         * Call notifyMoveEnd() afterwards to notify other components about changed state.
         * @param {Number[] | Object} or {Array} lonlat coordinates to move the map to
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
         * @param {Boolean} pIsDragging true if the user is dragging the map to a new location currently (optional)
         */
        moveMapToLonLat: function (lonlat, zoomAdjust, pIsDragging) {
            //if lonlat is given as an array instead of OpenLayers.LonLat
            // parse it to OpenLayers.LonLat for further use
            lonlat = this.normalizeLonLat(lonlat);
            var isDragging = (pIsDragging === true);
            this._map.setCenter(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), this.getMapZoom(), isDragging);

            if (zoomAdjust) {
                this.adjustZoomLevel(zoomAdjust, true);
            }
            this._updateDomainImpl();
        },

        /**
         * @method _updateDomain
         * Depricated
         * @private
         * Updates the sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode.
         */
        _updateDomain: function () {
            this.getSandbox().printWarn(
                '_updateDomain is deprecated. Use _updateDomainImpl instead.'
            );
            this._updateDomainImpl();
        },

        /**
         * @method _updateDomainImpl
         * @private
         * Updates the sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode.
         */
        _updateDomainImpl: function () {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            var sandbox = this.getSandbox(),
                mapVO = sandbox.getMap(),
                lonlat = this._getMapCenter();
            mapVO.moveTo(lonlat.lon, lonlat.lat, this.getMapZoom());

            mapVO.setScale(this.getMapScale());

            var size = this._map.getCurrentSize();
            mapVO.setWidth(size.w);
            mapVO.setHeight(size.h);

            mapVO.setResolution(this._map.getResolution());
            mapVO.setExtent(this._map.getExtent());
            mapVO.setMaxExtent(this._map.getMaxExtent());

            mapVO.setBbox(this._map.calculateBounds());
        },

        /**
         * @method panMapToLonLat
         * Pans the map to the given position.
         * @param {OpenLayers.LonLat} lonlat coordinates to pan the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        panMapToLonLat: function (lonlat, suppressEnd) {
            this._map.setCenter(lonlat, this.getMapZoom());
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
        centerMap: function (lonlat, zoom, suppressEnd) {
            // TODO: we have isValidLonLat(); maybe use it here
            lonlat = this.normalizeLonLat(lonlat);
            this._map.setCenter(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), zoom, false);
            this._updateDomainImpl();
            if (suppressEnd !== true) {
                this.notifyMoveEnd();
            }
        },

        /**
         * @method zoomTo
         * Sets the zoom level to given value
         * @param {Number} zoomLevel the new zoom level
         */
        zoomTo: function (zoomLevel) {
            this.setZoomLevel(zoomLevel, false);
        },

/* The next functions are not found in mapmodule.ol3. Are these necessary? If they are, add to ol3
----------------------------------------------------------------------------> */

        /**
         * @method zoomIn
         * Adjusts the zoom level by one
         */
        zoomIn: function () {
            this.adjustZoomLevel(1);
        },

        /**
         * @method zoomOut
         * Adjusts the zoom level by minus one
         */
        zoomOut: function () {
            this.adjustZoomLevel(-1);
        },

        /**
         * @method panMapEast
         * Pans the map toward east by 3/4 of the map width
         */
        panMapEast: function () {
            var size = this._map.getSize();
            this.panMapByPixels(0.75 * size.w, 0);
        },

        /**
         * @method panMapWest
         * Pans the map toward west by 3/4 of the map width
         */
        panMapWest: function () {
            var size = this._map.getSize();
            this.panMapByPixels(-0.75 * size.w, 0);
        },

        /**
         * @method panMapNorth
         * Pans the map toward north by 3/4 of the map height
         */
        panMapNorth: function () {
            var size = this._map.getSize();
            this.panMapByPixels(0, -0.75 * size.h);
        },

        /**
         * @method panMapSouth
         * Pans the map toward south by 3/4 of the map height
         */
        panMapSouth: function () {
            var size = this._map.getSize();
            this.panMapByPixels(0, 0.75 * size.h);
        },
/*<-----------------------------------------------------------------------------------*/


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
            this.moveMapToLanLot(newCenter);

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
        adjustZoomLevel: function (amount, suppressEvent) {
            var requestedZoomLevel = this._getNewZoomLevel(amount);

            this._map.zoomTo(requestedZoomLevel);
            this._map.updateSize();
            this._updateDomainImpl();
            if (suppressEvent !== true) {
                // send note about map change
                this.notifyMoveEnd();
            }
        },

        /**
         * @method setZoomLevel
         * Sets the maps zoom level to given absolute number
         * @param {Number} newZoomLevel absolute zoom level
         * @param {Boolean} suppressEvent true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        setZoomLevel: function (newZoomLevel, suppressEvent) {
            if (newZoomLevel < 0 || newZoomLevel > this._map.getNumZoomLevels()) {
                newZoomLevel = this.getMapZoom();
            }
            this._map.zoomTo(newZoomLevel);
            this._updateDomainImpl();
            if (suppressEvent !== true) {
                // send note about map change
                this.notifyMoveEnd();
            }
        },

        /**
         * @method _getNewZoomLevel
         * @private
         * Does a sanity check on a zoomlevel adjustment to see if the adjusted zoomlevel is
         * supported by the map (is between 0-12). Returns the adjusted zoom level if it is valid or
         * current zoom level if the adjusted one is out of bounds.
         * @return {Number} sanitized absolute zoom level
         */
        _getNewZoomLevel: function (adjustment) {
            // TODO: check isNaN?
            var requestedZoomLevel = this.getMapZoom() + adjustment;

            if (requestedZoomLevel >= 0 && requestedZoomLevel <= this._map.getNumZoomLevels()) {
                return requestedZoomLevel;
            }
            // if not in valid bounds, return original
            return this.getMapZoom();
        },

        /**
         * @method notifyStartMove
         * Notify other components that the map has started moving. Sends a MapMoveStartEvent.
         * Not sent always, preferrably track map movements by listening to AfterMapMoveEvent.
         * Ignores the call if map is in stealth mode
         */
        notifyStartMove: function () {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            this.getSandbox().getMap().setMoving(true);
            var centerX = this._getMapCenter().lon,
                centerY = this._getMapCenter().lat,
                evt = this.getSandbox().getEventBuilder('MapMoveStartEvent')(centerX, centerY);
            this.getSandbox().notifyAll(evt);
        },

        /**
         * @method notifyMoveEnd
         * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
         * sandbox map domain object with the current map properties.
         * Ignores the call if map is in stealth mode. Plugins should use this to notify other components
         * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
         * (this class) calls this automatically if not stated otherwise in API documentation.
         * @param {String} creator
         *        class identifier of object that sends event
         */
        notifyMoveEnd: function (creator) {
            if (this.getStealth()) {
                // ignore if in "stealth mode"
                return;
            }
            var sandbox = this.getSandbox();
            sandbox.getMap().setMoving(false);

            var lonlat = this._getMapCenter();
            this._updateDomainImpl();
            var evt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this.getMapZoom(), false, this.getMapScale(), creator);
            sandbox.notifyAll(evt);
        },

        getSize: function(){
            var sandbox = this._sandbox,
                mapVO = sandbox.getMap(),
                width =  mapVO.getWidth(),
                height = mapVO.getHeight();

            return {
                width: width,
                height: height
            };
        },

        /**
         * @method updateSize
         * Notifies OpenLayers that the map size has changed and updates the size in sandbox map domain object.
         */
        updateSize: function () {
            this.getMap().updateSize();
            this._updateDomainImpl();

            var sandbox = this.getSandbox(),
                mapVO = sandbox.getMap(),
                width =  mapVO.getWidth(),
                height = mapVO.getHeight();


            // send as an event forward
            if(width && height) {
              var evt = sandbox.getEventBuilder(
                  'MapSizeChangedEvent'
              )(width, height);
              sandbox.notifyAll(evt);
            }
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
        /**
         * Get map max extent.
         * @method getMaxExtent
         * @return {Object} max extent
         */
        getMaxExtent: function(){
            var bbox = this._maxExtent;
            return {
                bottom: bbox.bottom,
                left: bbox.left,
                right: bbox.right,
                top: bbox.top
            };
        }

    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapModule']
    });
