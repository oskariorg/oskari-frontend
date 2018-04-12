/**
 * @class Oskari.mapping.mapmodule.AbstractMapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.AbstractFunc = function () {
    var name = arguments[0];
    return function () {
        throw 'AbstractFuncCalled: ' + name;
    };
};

Oskari.clazz.define(
    'Oskari.mapping.mapmodule.AbstractMapModule',
    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String} id
     *      Unigue ID for this map
     * @param {String} imageUrl
     *      base url for marker etc images
     * @param {Array} map options, example data:
     *  {
     *      resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
     *      maxExtent : {
     *          left : 0,
     *          bottom : 0,
     *          right : 10000000,
     *          top : 10000000
     *      },
     srsName : "EPSG:3067"
     *  }
     */
    function (id, imageUrl, options, mapDivId) {
        var me = this;

        // Id will be a prefix for getName()
        me._id = id;
        me._mapDivId = mapDivId;
        me._imageUrl = imageUrl || '/Oskari/bundles';
        // defaults
        me._options = {
            resolutions: [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
            srsName: 'EPSG:3067',
            units: 'm'
        };
        if (options) {
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    me._options[key] = options[key];
                }
            }
        }

        // SRS projection code, defaults to 'EPSG:3067'
        me._projectionCode = me._options.srsName;

        // reference to the map-engine instance (e.g. ol2/ol3 map)
        me._map = null;

        // array of resolutions
        me._mapResolutions = me._options.resolutions;
        // _mapScales are calculated in _calculateScalesImpl based on resolutions in options
        me._mapScales = [];

        // props: left,bottom,right, top
        me._maxExtent = me._options.maxExtent || {
            left: 0,
            bottom: 0,
            right: 10000000,
            top: 10000000
        };

        me._sandbox = null;

        me._mapLayerService = null;

        // reference to map-engine controls
        me._controls = {};
        // reference to plugins
        me._pluginInstances = {};
        // another reference to plugins (only layerhandling ones)
        me._layerPlugins = {};

        // mapcontrols assumes this to be present before init or start
        me._localization = null;

        me._defaultMarker = {
            shape: 2,
            size: 64
        };
        me._markerTemplate = jQuery('<svg viewBox="0 0 64 64" width="64" height="64" xmlns="http://www.w3.org/2000/svg"></svg>');

        me._wellknownStyles = {};

        me._isInMobileMode = null;
        me._mobileToolbar = null;
        me._mobileToolbarId = 'mobileToolbar';
        me._toolbarContent = null;

        // possible custom css cursor set via rpc
        this._cursorStyle = '';
        this.log = Oskari.log('AbstractMapModule');

        this.isDrawing = false;

        this.templates = {
            'crosshair': jQuery(
                '<div class="oskari-crosshair">' +
                    '<div class="oskari-crosshair-vertical-bar"></div>' +
                    '<div class="oskari-crosshair-horizontal-bar"></div>' +
                '</div>')
        };
    }, {
        /**
         * Moved from core, to be removed
         */
        handleMapLinkParams: function (stateService) {
            this.log.debug('Checking if map is started with link...');
            var coord = Oskari.util.getRequestParam('coord', null);
            var zoomLevel = Oskari.util.getRequestParam('zoomLevel', null);

            if (coord === null || zoomLevel === null) {
                // not a link
                return;
            }

            var splittedCoord;

            // Coordinates can be separated either with new "_" or old "%20"
            if (coord.indexOf('_') >= 0) {
                splittedCoord = coord.split('_');
            } else if (coord.indexOf('%20') >= 0) {
                splittedCoord = coord.split('%20');
            } else {
                // coordinate format not recognized
                return;
            }

            var longitude = splittedCoord[0];
            var latitude = splittedCoord[1];
            if (longitude === null || latitude === null) {
                this.log.debug('Could not parse link location. Skipping.');
                return;
            }
            this.log.debug('This is startup by link, moving map...');
            stateService.moveTo(longitude, latitude, zoomLevel);
        },
        /**
         * @method init
         * Implements Module protocol init method. Creates the Map.
         * @param {Oskari.Sandbox} sandbox
         * @return {Map}
         */
        init: function (sandbox) {
            var me = this;
            this.log.debug(
                'Initializing oskari map module...#############################################'
            );

            me._sandbox = sandbox;

            var stateService = Oskari.clazz.create('Oskari.mapframework.domain.Map', sandbox);
            sandbox.registerService(stateService);
            this.handleMapLinkParams(stateService);

            if (me._options) {
                if (me._options.resolutions) {
                    me._mapResolutions = me._options.resolutions;
                }
                if (me._options.srsName) {
                    me._projectionCode = me._options.srsName;
                    // set srsName to Oskari.mapframework.domain.Map
                    if (me._sandbox) {
                        me._sandbox.getMap().setSrsName(me._projectionCode);
                    }
                }
            }

            me._map = me.createMap();

            if (me._options.crosshair) {
                me.toggleCrosshair(true);
            }

            // changed to resolutions based map zoom levels
            // -> calculate scales array for backward compatibility
            me._calculateScalesImpl(me._mapResolutions);

            // TODO remove this whenever we're ready to add the containers when needed
            this._addMapControlPluginContainers();
            this._addMobileDiv();
            return me._initImpl(me._sandbox, me._options, me._map);
        },
        /**
         * @method start
         * implements BundleInstance protocol start method
         * Starts the plugins registered on the map and adds
         * selected layers on the map if layers were selected before
         * mapmodule was registered to listen to these events.
         * @param {Oskari.Sandbox} sandbox
         */
        start: function (sandbox) {
            var me = this;
            if (this.started) {
                return;
            }

            this.log.debug('Starting ' + this.getName());

            // listen to application started event and trigger a forced update on any remaining lazy plugins
            Oskari.on('app.start', function (details) {
                // force update on lazy plugins
                // this means tell plugins to render UI with the means available
                // if toolbar for example isn't present, most plugins should display "desktop-ui" instead of using the "mobile-ui" toolbar
                me.startLazyPlugins(true);
            });

            // register events handlers
            for (var p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }

            this._mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if (!this._mapLayerService) {
                // create maplayer service to sandbox if it doesn't exist yet
                this._mapLayerService = Oskari.clazz.create('Oskari.mapframework.service.MapLayerService', sandbox);
                sandbox.registerService(this._mapLayerService);
            }

            // register request handlers
            this.requestHandlers = {
                mapLayerUpdateHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler', sandbox, this),
                mapMoveRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler', sandbox, this),
                showSpinnerRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.ShowProgressSpinnerRequestHandler', sandbox, this),
                userLocationRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.GetUserLocationRequestHandler', sandbox, this),
                registerStyleRequestHandler: Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.RegisterStyleRequestHandler', sandbox, this),
                mapLayerHandler: Oskari.clazz.create('map.layer.handler', sandbox.getMap(), this._mapLayerService)
            };

            sandbox.requestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
            sandbox.requestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);
            sandbox.requestHandler('ShowProgressSpinnerRequest', this.requestHandlers.showSpinnerRequestHandler);
            sandbox.requestHandler('MyLocationPlugin.GetUserLocationRequest', this.requestHandlers.userLocationRequestHandler);
            sandbox.requestHandler('MapModulePlugin.RegisterStyleRequest', this.requestHandlers.registerStyleRequestHandler);
            sandbox.requestHandler('activate.map.layer', this.requestHandlers.mapLayerHandler);
            sandbox.requestHandler('AddMapLayerRequest', this.requestHandlers.mapLayerHandler);
            sandbox.requestHandler('RemoveMapLayerRequest', this.requestHandlers.mapLayerHandler);
            sandbox.requestHandler('RearrangeSelectedMapLayerRequest', this.requestHandlers.mapLayerHandler);
            sandbox.requestHandler('ChangeMapLayerOpacityRequest', this.requestHandlers.mapLayerHandler);
            sandbox.requestHandler('ChangeMapLayerStyleRequest', this.requestHandlers.mapLayerHandler);

            this.started = this._startImpl();
            this.setMobileMode(Oskari.util.isMobile());
            me.startPlugins();
            me._adjustMobileMapSize();
            this.updateCurrentState();
            this._registerForGuidedTour();
        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         * Stops the plugins registered on the map.
         * @param {Oskari.Sandbox} sandbox
         */
        stop: function (sandbox) {
            if (!this.started) {
                return;
            }

            this.stopPlugins();
            this.started = this._stopImpl();
        },
        /**
         * @property eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapLayerAddEvent': function (event) {
                this.afterMapLayerAddEvent(event);
            },
            'LayerToolsEditModeEvent': function (event) {
                this._isInLayerToolsEditMode = event.isInMode();
            },
            AfterRearrangeSelectedMapLayerEvent: function (event) {
                this.afterRearrangeSelectedMapLayerEvent(event);
            },
            MapSizeChangedEvent: function (evt) {
                this._handleMapSizeChanges({width: evt.getWidth(), height: evt.getHeight()});
            },
            'Toolbar.ToolbarLoadedEvent': function () {
                this.startLazyPlugins();
            },
            'RPCUIEvent': function (event) {
                var me = this;
                if (event.getBundleId() === 'mapmodule.crosshair') {
                    var show = (me.getMapEl().find('div.oskari-crosshair').length === 0);
                    me.toggleCrosshair(show);
                }
            }
        },

        /* Impl specific - found in ol2 AND ol3 modules
------------------------------------------------------------------> */
        /**
         * @method createMap
         * Creates the Implementation specific Map object
         * @return {Map}
         */
        createMap: Oskari.AbstractFunc('createMap'),
        getPixelFromCoordinate: Oskari.AbstractFunc('getPixelFromCoordinate'),
        getMapCenter: Oskari.AbstractFunc('getMapCenter'),
        getMapZoom: Oskari.AbstractFunc('getMapZoom'),
        getSize: Oskari.AbstractFunc('getSize'),
        getCurrentExtent: Oskari.AbstractFunc('getCurrentExtent'),
        getProjectionUnits: Oskari.AbstractFunc('getProjectionUnits'),

        /**
         * @method centerMap
         * Moves the map to the given position and zoomlevel.
         * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
         * @param {Number} zoomLevel absolute zoomlevel to set the map to
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        centerMap: Oskari.AbstractFunc('centerMap'),
        /**
         * @method zoomToExtent
         * Zooms the map to fit given bounds on the viewport
         * @param {Object} bounds BoundingBox with left,top,bottom,right keys that should be visible on the viewport
         * @param {Boolean} suppressStart true to NOT send an event about the map starting to move
         *  (other components wont know that the map has started moving, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         * @param {Boolean} suppressEnd true to NOT send an event about the map move
         *  (other components wont know that the map has moved, only use when chaining moves and
         *     wanting to notify at end of the chain for performance reasons or similar) (optional)
         */
        zoomToExtent: Oskari.AbstractFunc('zoomToExtent'),
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
        panMapByPixels: Oskari.AbstractFunc('panMapByPixels'),
        orderLayersByZIndex: Oskari.AbstractFunc('orderLayersByZIndex'),
        /* --------- /Impl specific --------------------------------------> */

        /* Impl specific - PRIVATE
------------------------------------------------------------------> */
        /**
         * @method _initImpl
         * Init for implementation specific functionality.
         * @param {Oskari.Sandbox} sandbox
         * @param {Map} map
         * @return {Map}
         */
        _initImpl: function (sandbox, options, map) {
            return map;
        },
        _startImpl: function () {
            return true;
        },
        _stopImpl: function () {
            return false;
        },
        _calculateScalesImpl: Oskari.AbstractFunc('_calculateScalesImpl(resolutions)'),
        _updateSizeImpl: Oskari.AbstractFunc('_updateSizeImpl'),
        _setZoomLevelImpl: Oskari.AbstractFunc('_setZoomLevelImpl'),
        /* --------- /Impl specific - PRIVATE ----------------------------> */

        /* Impl specific - found in ol2 AND ol3 modules BUT parameters and/or return value differ!!
------------------------------------------------------------------> */
        addLayer: Oskari.AbstractFunc('addLayer'),
        removeLayer: Oskari.AbstractFunc('removeLayer'),
        bringToTop: Oskari.AbstractFunc('bringToTop'),
        getLayerIndex: Oskari.AbstractFunc('getLayerIndex'),
        setLayerIndex: Oskari.AbstractFunc('setLayerIndex'),
        _addMapControlImpl: Oskari.AbstractFunc('_addMapControlImpl(ctl)'),
        _removeMapControlImpl: Oskari.AbstractFunc('_removeMapControlImpl(ctl)'),
        getStyle: Oskari.AbstractFunc('getStyle'),
        /* --------- /Impl specific - PARAM DIFFERENCES  ----------------> */

        /* ---------------- SHARED FUNCTIONS --------------- */

        /**
         * getProjectionDecimals get projection decimals
         *
         * @param {String} srs projection srs, if not defined used map srs
         *
         * @return {Integer} projetion decimals (decimal count spefied by units)
         */
        getProjectionDecimals: function (srs) {
            var me = this;
            var units = me.getProjectionUnits(srs);
            if (units === 'm') {
                return 0;
            } else if (units === 'degrees') {
                return 6;
            }
            return 6;
        },
        /**
         * Returns the id where map is rendered.
         * @return {String} DOMElement id like 'mapdiv'
         */
        getMapElementId: function () {
            return this._mapDivId;
        },

        /**
         * @method getMapEl
         * Get jQuery reference to map element
         */
        getMapEl: function () {
            var mapDiv = jQuery('#' + this.getMapElementId());
            if (!mapDiv.length) {
                this.log.warn('mapDiv not found with #' + this._mapDivId);
            }
            return mapDiv;
        },
        /**
         * @method getMap
         * Returns a reference to the map implementation
         * @return {OpenLayers.Map|ol.Map}
         */
        getMap: function () {
            return this._map;
        },
        /**
         * @method getImageUrl
         * Returns a base url for plugins to show. Can be set in constructor and
         * defaults to "/Oskari/bundles" if not set.
         * @return {String}
         */
        getImageUrl: function () {
            return this._imageUrl;
        },
        /**
         * Get map max extent.
         * @method getMaxExtent
         * @return {Object} max extent
         */
        getMaxExtent: function () {
            var bbox = this._maxExtent;
            return {
                bottom: bbox.bottom,
                left: bbox.left,
                right: bbox.right,
                top: bbox.top
            };
        },
        /**
         * @method getProjection
         * Returns the SRS projection code for the map.
         * Currently always 'EPSG:3067'
         * @return {String}
         */
        getProjection: function () {
            return this._projectionCode;
        },

        setDrawingMode: function (mode) {
            this.isDrawing = !!mode;
        },

        getDrawingMode: function () {
            return this.isDrawing;
        },
        /* --------------- MAP LOCATION ------------------------ */
        /**
         * @method moveMapToLonLat
         * Moves the map to the given position.
         * NOTE! Doesn't send an event if zoom level is not changed.
         * Call notifyMoveEnd() afterwards to notify other components about changed state.
         * @param {Number[] | Object} lonlat coordinates to move the map to
         * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
         */
        moveMapToLonLat: function (lonlat, zoomAdjust) {
            var blnSilent = true;
            var requestedZoomLevel = this.getMapZoom();

            if (zoomAdjust) {
                requestedZoomLevel = this.getNewZoomLevel(zoomAdjust);
                blnSilent = false;
            }
            this.centerMap(lonlat, requestedZoomLevel, blnSilent);
        },
        /**
         * @method isValidLonLat
         * Checks that lat and lon are within bounds of the map extent
         * @param {Number} lon longitude to check
         * @param {Number} lat latitude to check
         * @return {Boolean} true if coordinates are inside boundaries
         */
        isValidLonLat: function (lon, lat) {
            var maxExtent = this.getMaxExtent();

            if (isNaN(lon) || isNaN(lat)) {
                return false;
            } else if (lon < maxExtent.left || lon > maxExtent.right || lat < maxExtent.bottom || lat > maxExtent.top) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * Changes array to object and use Number values
         * OL3 fails, if string type lon, lat values
         * @param  {Object | Number[]} lonlat [description]
         * @return {Object}        [description]
         */
        normalizeLonLat: function (lonlat) {
            if (_.isArray(lonlat)) {
                return {
                    lon: Number(lonlat[0]),
                    lat: Number(lonlat[1])
                };
            }
            lonlat.lon = Number(lonlat.lon);
            lonlat.lat = Number(lonlat.lat);

            return lonlat;
        },
        /**
         * Tries to get the user location. Signals with an UserLocationEvent and callback with lon and lat params
         * when successfully got the location or without params as error indicator.
         * @param  {Function} callback function that is called with lon, lat as params on happy case
         * @param  {Object}   options  options for navigator.geolocation.getCurrentPosition()
         */
        getUserLocation: function (callback, options) {
            var me = this;
            var sandbox = me.getSandbox();
            var evtBuilder = Oskari.eventBuilder('UserLocationEvent');
            // normalize opts with defaults
            var opts = options || {};
            if (!opts.hasOwnProperty('maximumAge')) {
                // don't accept cached position
                opts.maximumAge = 0;
            }
            if (!opts.hasOwnProperty('timeout')) {
                // timeout after 6 seconds
                opts.timeout = 6000;
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        // transform coordinates from browser projection to current
                        var lonlat = me.transformCoordinates({ 
                            lon: position.coords.longitude, 
                            lat: position.coords.latitude }, 'EPSG:4326');
                        sandbox.notifyAll(evtBuilder(lonlat.lon, lonlat.lat));
                        // notify callback
                        if (typeof callback === 'function') {
                            callback(lonlat.lon, lonlat.lat);
                        }
                    },
                    function (errors) {
                        // if users just ignores/closes the browser dialog
                        // -> error handler won't be called in most browsers
                        me.log.warn('Error getting user location', errors);
                        // notify callback and event without lonlat to signal failure
                        sandbox.notifyAll(evtBuilder());
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, opts
                );
            }
        },
        /* --------------- /MAP LOCATION ------------------------ */

        /* --------------- MAP ZOOM ------------------------ */
        /**
         * @method getScaleArray
         * @return {Number[]} calculated mapscales
         */
        getScaleArray: function () {
            return this._mapScales;
        },
        getMapScale: function () {
            var scales = this.getScaleArray();
            return scales[this.getMapZoom()];
        },
        getResolutionArray: function () {
            return this._mapResolutions;
        },
        getResolution: function () {
            return this.getResolutionArray()[this.getMapZoom()];
        },
        /**
         * @method getMaxZoomLevel
         * Gets map max zoom level.
         *
         * @return {Integer} map max zoom level
        */
        getMaxZoomLevel: function () {
            // getNumZoomLevels returns OL map resolutions length, so need decreased by one (this return max OL zoom)
            return this.getResolutionArray().length - 1;
        },
        /**
         * @method getNewZoomLevel
         * @private
         * Does a sanity check on a zoomlevel adjustment to see if the adjusted zoomlevel is
         * supported by the map (is between 0-12). Returns the adjusted zoom level if it is valid or
         * current zoom level if the adjusted one is out of bounds.
         * @return {Number} sanitized absolute zoom level
         */
        getNewZoomLevel: function (adjustment) {
            // TODO: check isNaN?
            var requestedZoomLevel = this.getMapZoom() + adjustment;

            if (requestedZoomLevel >= 0 && requestedZoomLevel <= this.getMaxZoomLevel()) {
                return requestedZoomLevel;
            }
            // if not in valid bounds, return original
            return this.getMapZoom();
        },
        /**
         * @method getClosestZoomLevel
         * Calculate closest zoom level given the given boundaries.
         * If map is zoomed too close -> returns the closest zoom level level possible within given bounds
         * If map is zoomed too far out -> returns the furthest zoom level possible within given bounds
         * If the boundaries are within current zoomlevel or undefined, returns the current zoomLevel
         * @param {Number} minScale minimum scale boundary (optional)
         * @param {Number} maxScale maximum scale boundary (optional)
         * @return {Number} zoomLevel (0-12)
         */
        getClosestZoomLevel: function (minScale, maxScale) {
            var zoomLevel = this.getMapZoom();
            var scale = this.getMapScale(),
                scaleList = this.getScaleArray(),
                i;
            // default to values from scaleList if missing
            minScale = minScale || scaleList[0];
            maxScale = maxScale || scaleList[scaleList.length - 1];

            if (scale < maxScale) {
                // zoom out
                // for(i = this._mapScales.length; i > zoomLevel; i--) {
                for (i = zoomLevel; i > 0; i -= 1) {
                    if (scaleList[i] >= maxScale) {
                        return i;
                    }
                }
            } else if (scale > minScale) {
                // zoom in
                for (i = zoomLevel; i < scaleList.length; i += 1) {
                    if (scaleList[i] <= minScale) {
                        return i;
                    }
                }
            }
            return zoomLevel;
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
            var requestedZoomLevel = this.getNewZoomLevel(amount);
            this.setZoomLevel(requestedZoomLevel, suppressEvent);
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
            if (newZoomLevel < 0 || newZoomLevel > this.getMaxZoomLevel()) {
                newZoomLevel = this.getMapZoom();
            }
            this._setZoomLevelImpl(newZoomLevel);
            this.updateDomain();
            if (suppressEvent !== true) {
                // send note about map change
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
        zoomToScale: function (scale, closest, suppressEnd) {
            var resolution = this.getResolutionForScale(scale);
            var zoom = this.getResolutionArray().indexOf(resolution);
            if (zoom !== -1) {
                this.setZoomLevel(zoom, suppressEnd);
            }
        },
        /**
         * @method getResolutionForScale
         * Calculate max resolution for the scale
         * If scale is not defined return -1
         * @param {Number} scale
         * @return {Number[]} calculated resolution
         */
        getResolutionForScale: function (scale) {
            if (!scale && scale !== 0) {
                return -1;
            }
            var resIndex = -1,
                scaleList = this.getScaleArray(),
                i;
            for (i = 1; i < scaleList.length; i += 1) {
                if ((scale > scaleList[i]) && (scale <= scaleList[i - 1])) {
                    // resolutions are in the same order as scales so just use them
                    resIndex = i - 1;
                    break;
                }
            }
            // Is scale out of scale ranges
            if (resIndex === -1) {
                resIndex = scale < scaleList[scaleList.length - 1] ? scaleList.length - 1 : 0;
            }
            return this.getResolutionArray()[resIndex];
        },
        /**
         * @method calculateLayerScales
         * Calculate a subset of maps scales array that matches the given boundaries.
         * If boundaries are not defined, returns all possible scales.
         * @param {Number} maxScale maximum scale boundary (optional)
         * @param {Number} minScale minimum scale boundary (optional)
         * @return {Number[]} calculated mapscales that are within given bounds
         */
        calculateLayerScales: function (maxScale, minScale) {
            var layerScales = [],
                mapScales = this.getScaleArray();

            for (var i = 0; i < mapScales.length; i += 1) {
                if ((!minScale || minScale >= mapScales[i]) && (!maxScale || maxScale <= mapScales[i])) {
                    layerScales.push(mapScales[i]);
                }
            }
            return layerScales;
        },
        /**
         * @method calculateLayerResolutions
         * Calculate a subset of maps resolutions array that matches the given boundaries.
         * If boundaries are not defined, returns all possible resolutions.
         * @param {Number} maxScale maximum scale boundary (optional)
         * @param {Number} minScale minimum scale boundary (optional)
         * @return {Number[]} calculated resolutions that are within given bounds
         */
        calculateLayerResolutions: function (maxScale, minScale) {
            var layerResolutions = [],
                mapScales = this.getScaleArray(),
                mapResolutions = this.getResolutionArray();

            for (var i = 0; i < mapScales.length; i += 1) {
                if ((!minScale || minScale >= mapScales[i]) && (!maxScale || maxScale <= mapScales[i])) {
                    // resolutions are in the same order as scales so just use them
                    layerResolutions.push(mapResolutions[i]);
                }
            }
            return layerResolutions;
        },
        /* --------------- /MAP ZOOM ------------------------ */

        /* --------------- MAP STATE ------------------------ */

        /**
         * @method updateDomain
         * Updates the sandbox map domain object with the current map properties.
         */
        updateDomain: function () {
            var sandbox = this.getSandbox();
            var mapVO = sandbox.getMap();
            var lonlat = this.getMapCenter();
            var zoom = this.getMapZoom();
            mapVO.moveTo(lonlat.lon, lonlat.lat, zoom);

            mapVO.setScale(this.getMapScale());
            var resolution = this.getResolutionArray()[zoom];
            mapVO.setResolution(resolution);

            var size = this.getSize();
            mapVO.setWidth(size.width);
            mapVO.setHeight(size.height);

            mapVO.setBbox(this.getCurrentExtent());
            mapVO.setMaxExtent(this.getMaxExtent());
        },
        /**
         * @method updateSize
         * Signal map-engine that DOMElement size has changed and trigger a MapSizeChangedEvent
         */
        updateSize: function () {
            var sandbox = this.getSandbox(),
                mapVO = sandbox.getMap(),
                width = mapVO.getWidth(),
                height = mapVO.getHeight();

            this._updateSizeImpl();
            this.updateDomain();

            var widthNew = mapVO.getWidth(),
                heightNew = mapVO.getHeight();
            // send as an event forward
            if (width !== widthNew || height !== heightNew) {
                var evt = Oskari.eventBuilder('MapSizeChangedEvent')(widthNew, heightNew);
                sandbox.notifyAll(evt);
            }
        },
        /**
         * @method updateCurrentState
         * Setup layers from selected layers
         * This is needed if map layers are added before mapmodule/plugins are started.
         * Should be called only on startup, preferrably not even then
         * (workaround for timing issues).
         * If layers are already in map, this adds them twice and they cannot be
         * removed anymore by removemaplayerrequest (it should be sent twice but ui doesn't
         * offer that).
         */
        updateCurrentState: function () {
            var me = this,
                sandbox = me._sandbox,
                layers = sandbox.findAllSelectedMapLayers(),
                lps = this.getLayerPlugins(),
                layersPlugin,
                p;

            for (p in lps) {
                if (lps.hasOwnProperty(p)) {
                    layersPlugin = lps[p];
                    if (typeof layersPlugin.preselectLayers !== 'function') {
                        continue;
                    }
                    this.log.debug('preselecting ' + p);
                    layersPlugin.preselectLayers(layers);
                }
            }
        },
        isLoading: function () {
            var oskariLayers = this.getSandbox().getMap().getLayers();
            var loading = false;
            oskariLayers.forEach(function (layer) {
                if (loading) {
                    return;
                }
                loading = layer.getLoadingState().loading > 0;
            });
            return loading;
        },
        /**
         * @method loadingState
         * Gather info on layer loading status
         * @param {Number} layerid, the id number of the abstract layer in loading
         * @param {boolean} started is true if tileloadstart has been called, false if tileloadend
         */
        loadingState: function (layerId, started, errors) {
            if (typeof errors === 'undefined') {
                errors = false;
            }
            var done = false;
            var me = this;
            var layers = this.getSandbox().findAllSelectedMapLayers();
            var oskariLayer = this.getSandbox().getMap().getSelectedLayer(layerId);
            if (!oskariLayer) {
                return;
            }

            if (!this.progBar) {
                this.progBar = Oskari.clazz.create('Oskari.userinterface.component.ProgressBar');
                this.progBar.create(jQuery('#' + this.getMapElementId()));
            }

            if (this.loadtimer) {
                clearTimeout(this.loadtimer);
            }

            if (started) {
                var wasFirstTile = oskariLayer.loadingStarted();
                if (wasFirstTile) {
                    this.progBar.show();
                    layers.forEach(function (layer) {
                        oskariLayer.resetLoadingState();
                    });
                }
            } else {
                var tilesLoaded = 0;
                var pendingTiles = 0;
                if (!errors) {
                    layers.forEach(function (layer) {
                        tilesLoaded += layer.loaded;
                        pendingTiles += layer.tilesToLoad;
                    });
                    done = oskariLayer.loadingDone();
                    this.progBar.updateProgressBar(pendingTiles - 1, tilesLoaded);
                } else {
                    this.progBar.setColor('rgba( 190, 0, 10, 0.4 )');
                    oskariLayer.loadingError(oskariLayer.getLoadingState().loading);
                    errors = oskariLayer.getLoadingState().errors;
                    oskariLayer.loadingDone(0);

                    setTimeout(function () {
                        me.progBar.hide();
                    }, 2000);
                    tilesLoaded = 0;
                    pendingTiles = 0;
                    this.notifyErrors(errors, oskariLayer);
                }
            }
            this.loadtimer = setTimeout(function () {
                var eventBuilder = Oskari.eventBuilder('ProgressEvent');
                var event = eventBuilder(done, layerId);
                me._sandbox.notifyAll(event);
            }, 50);
        },
        notifyErrors: function (errors, oskariLayer) {
            Oskari.log(this.getName()).warn('error loading layer: ' + oskariLayer._name);
        },
        /**
         * Returns state for mapmodule including plugins that have getState() function
         * @method getState
         * @return {Object} properties for each pluginName
         */
        getState: function () {
            var state = {
                    plugins: {}
                },
                pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getState) {
                    state.plugins[pluginName] = this._pluginInstances[pluginName].getState();
                }
            }
            return state;
        },
        /**
         * Returns state for mapmodule including plugins that have getStateParameters() function
         * @method getStateParameters
         * @return {String} link parameters for map state
         */
        getStateParameters: function () {
            var params = '',
                pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && this._pluginInstances[pluginName].getStateParameters) {
                    params = params + this._pluginInstances[pluginName].getStateParameters();
                }
            }
            return params;
        },
        /**
         * Sets state for mapmodule including plugins that have setState() function
         * NOTE! Not used for now
         * @method setState
         * @param {Object} properties for each pluginName
         */
        setState: function (state) {
            var pluginName;

            for (pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName) && state[pluginName] && this._pluginInstances[pluginName].setState) {
                    this._pluginInstances[pluginName].setState(state[pluginName]);
                }
            }
        },
        /**
         * @method notifyStartMove
         * Notify other components that the map has started moving. Sends a MapMoveStartEvent.
         * Not sent always, preferrably track map movements by listening to AfterMapMoveEvent.
         */
        notifyStartMove: function () {
            this.getSandbox().getMap().setMoving(true);
            var centerX = this.getMapCenter().lon,
                centerY = this.getMapCenter().lat,
                evt = Oskari.eventBuilder('MapMoveStartEvent')(centerX, centerY);
            this.getSandbox().notifyAll(evt);
        },
        /**
         * @method notifyMoveEnd
         * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
         * sandbox map domain object with the current map properties.
         * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
         * (this class) calls this automatically if not stated otherwise in API documentation.
         * @param {String} creator
         *        class identifier of object that sends event
         */
        notifyMoveEnd: function (creator) {
            var sandbox = this.getSandbox();
            sandbox.getMap().setMoving(false);

            var lonlat = this.getMapCenter();
            this.updateDomain();
            var evt = Oskari.eventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this.getMapZoom(), this.getMapScale(), creator);
            sandbox.notifyAll(evt);
        },
        /* --------------- /MAP STATE ------------------------ */

        /* ---------------- MAP MOBILE MODE ------------------- */

        _addMobileDiv: function () {
            var mapDiv = this.getMapEl();
            jQuery(mapDiv[0].parentElement).prepend('<div class="mobileToolbarDiv"></div>');
        },

        getMobileDiv: function () {
            var me = this,
                mobileDiv = jQuery(me.getMapEl()[0].parentElement).find('.mobileToolbarDiv');

            return mobileDiv;
        },

        getMobileToolbar: function () {
            var me = this;
            if (!me._mobileToolbar) {
                me._createMobileToolbar();
            }
            return me._mobileToolbarId;
        },

        _createMobileToolbar: function () {
            var me = this,
                request,
                sandbox = me.getSandbox();

            if (!me._mobileToolbarId || !sandbox.hasHandler('Toolbar.ToolbarRequest')) {
                return;
            }
            me._mobileToolbar = true;
            me.getMobileDiv().append('<div class="mobileToolbarContent"></div>');
            me._toolbarContent = me.getMobileDiv().find('.mobileToolbarContent');
            // add toolbar when toolbarId and target container is configured
            // We assume the first container is intended for the toolbar
            request = Oskari.requestBuilder('Toolbar.ToolbarRequest')(
                me._mobileToolbarId,
                'add',
                {
                    show: true,
                    toolbarContainer: me._toolbarContent,
                    colours: {
                        hover: this.getThemeColours().hoverColour,
                        background: this.getThemeColours().backgroundColour
                    },
                    disableHover: true
                }
            );
            sandbox.request(me.getName(), request);
        },

        setMobileMode: function (isInMobileMode) {
            this._isInMobileMode = isInMobileMode;

            var mobileDiv = this.getMobileDiv();
            if (isInMobileMode) {
                mobileDiv.show();
                mobileDiv.css('backgroundColor', this.getThemeColours().backgroundColour);
            } else {
                mobileDiv.hide();
            }
        },

        getMobileMode: function () {
            return this._isInMobileMode;
        },

        _handleMapSizeChanges: function (newSize, pluginName) {
            var me = this;
            var modeChanged = false;
            var mobileDiv = this.getMobileDiv();
            if (Oskari.util.isMobile()) {
                modeChanged = me.getMobileMode() !== true;
                me.setMobileMode(true);
            } else {
                modeChanged = me.getMobileMode() !== false;
                me.setMobileMode(false);
            }

            if (modeChanged) {
                me.redrawPluginUIs(modeChanged);
            }
            me._adjustMobileMapSize();
        },
        /**
         * @method redrawPluginUIs
         * Called when map size changes, mode changes or when late comer plugins (coordinatetool, featuredata) enter the mobile toolbar.
         * Basically just redraws the whole toolbar with the tools in correct order.
         *
         * @param {boolean} modeChanged whether there was a transition between mobile <> desktop
         *
         */
        redrawPluginUIs: function (modeChanged) {
            var me = this,
                sortedList = me._getSortedPlugins();
            _.each(sortedList, function (plugin) {
                if (plugin && typeof plugin.redrawUI === 'function') {
                    plugin.redrawUI(me.getMobileMode(), modeChanged);
                }
            });
        },
        /**
         * Get a sorted list of plugins. This is used to control order of elements in the UI.
         * Functionality shouldn't assume order.
         * @return {Oskari.mapframework.ui.module.common.mapmodule.Plugin[]} index ordered list of registered plugins
         */
        _getSortedPlugins: function () {
            return _.sortBy(this._pluginInstances, function (plugin) {
                if (typeof plugin.getIndex === 'function') {
                    return plugin.getIndex();
                }
                // index not defined, start after ones that have indexes
                // This is just for the UI order, functionality shouldn't assume order
                return 99999999999;
            });
        },

        _adjustMobileMapSize: function () {
            var mapDivHeight = this.getMapEl().height();
            var mobileDiv = this.getMobileDiv();
            var toolbar = mobileDiv.find('.mobileToolbarContent');

            if (mobileDiv.children().length === 0) {
                // plugins didn't add any content -> hide it so the empty bar is not visible
                mobileDiv.hide();
            } else {
                // case: tools in toolbar, show the div as it might be hidden and remove explicit size
                if (toolbar.find('.tool').length) {
                    // if only lazy plugins on startup -> mobilediv is hidden on startup -> need to make it visible here
                    mobileDiv.show();
                    // if there are a tools, make sure we don't restrict it's height by setting specific size
                    // tools may flow to multiple rows
                    mobileDiv.height('');
                }
                // case: no tools in toolbar or no toolbar -> force height
                else if (mobileDiv.height() < mobileDiv.children().height()) {
                    // any floated plugins might require manual height setting if there is no toolbar
                    mobileDiv.height(mobileDiv.children().height());
                }
            }

            // Adjust map size always if in mobile mode because otherwise bottom tool drop out of screen
            // only reduce size if div is visible, otherwise padding will make the map smaller than it should be
            if (Oskari.util.isMobile() && mobileDiv.is(':visible')) {
                var totalHeight = jQuery('#contentMap').height();
                if (totalHeight < mapDivHeight + mobileDiv.outerHeight()) {
                    mapDivHeight -= mobileDiv.outerHeight();
                }
                if ((mobileDiv.attr('data-height')) !== mapDivHeight.toString()) {
                    jQuery('#' + this.getMapElementId()).css('height', mapDivHeight + 'px');
                    this.updateDomain();
                    mobileDiv.attr('data-height', mapDivHeight);
                }
            }
            this.updateSize();
        },

        /* ---------------- /MAP MOBILE MODE ------------------- */

        /* ---------------- THEME ------------------- */
        getTheme: function () {
            var me = this;
            var toolStyle = me.getToolStyle();
            if (toolStyle === null || toolStyle.indexOf('-dark') > 0 || toolStyle === 'default') {
                return 'dark';
            } else {
                return 'light';
            }
        },

        getReverseTheme: function () {
            var me = this;
            if (me.getTheme() === 'light') {
                return 'dark';
            } else {
                return 'light';
            }
        },

        getThemeColours: function (theme) {
            var me = this;
            // Check at the is konowed theme
            if (theme && theme !== 'light' && theme !== 'dark') {
                theme = 'dark';
            }
            var wantedTheme = theme || me.getTheme();

            var darkTheme = {
                textColour: '#ffffff',
                backgroundColour: '#3c3c3c',
                activeColour: '#E6E6E6',
                activeTextColour: '#000000',
                hoverColour: '#E6E6E6'
            };

            var lightTheme = {
                textColour: '#000000',
                backgroundColour: '#ffffff',
                activeColour: '#3c3c3c',
                activeTextColour: '#ffffff',
                hoverColour: '#3c3c3c'
            };

            if (wantedTheme === 'dark') {
                return darkTheme;
            } else {
                return lightTheme;
            }
        },
        getCursorStyle: function () {
            return this._cursorStyle;
        },
        setCursorStyle: function (cursorStyle) {
            var me = this,
                element = this.getMapEl();
            jQuery(element).css('cursor', cursorStyle);
            this._cursorStyle = cursorStyle;
            return this._cursorStyle;
        },

        /**
         * @method toggleCrosshair
         * toggles the crosshair marking the center of the map
         */
        toggleCrosshair: function (show) {
            var me = this,
                crosshair = null,
                mapEl = me.getMapEl();

            mapEl.find('div.oskari-crosshair').remove();
            if (show) {
                crosshair = me.templates.crosshair.clone();
                mapEl.append(crosshair);
            }
        },

        /* ---------------- /THEME ------------------- */

        /* --------------- CONTROLS ------------------------ */
        /**
         * @method getControls
         * Returns map controls - storage for controls by id. See getMapControl for getting single control.
         * @return {Object} contains control names as keys and control
         *      objects as values
         */
        getControls: function () {
            return this._controls;
        },
        /**
         * @method getMapControl
         * Returns a single map control that matches the given id/name.
         *  See getControls for getting all controls.
         * @param {String} id name of the map control
         * @return {OpenLayers.Control} control matching the id or undefined if not found
         */
        getMapControl: function (id) {
            return this._controls[id];
        },
        /**
         * @method addMapControl
         * Adds a control to the map and saves a reference so the control
         * can be accessed with getControls/getMapControl.
         * @param {String} id control id/name
         * @param {OpenLayers.Control} ctl
         */
        addMapControl: function (id, ctl) {
            this._controls[id] = ctl;
            this._addMapControlImpl(ctl);
        },
        /**
         * @method removeMapControl
         * Removes a control from the map matching the given id/name and
         * also removes it from references gotten by getControls()
         * @param {String} id control id/name
         */
        removeMapControl: function (id) {
            var ctl = this._controls[id];
            this._removeMapControlImpl(ctl);
            delete this._controls[id];
        },
        /* --------------- /CONTROLS ----------------------- */

        /* --------------- PLUGINS ------------------------ */
        /**
         * @method setLayerPlugin
         * Adds a plugin to the map that is responsible for rendering maplayers on the map.
         * Other types of plugins doesn't need to be registered like this.
         * Saves a reference so the plugin so it can be accessed with getLayerPlugins.
         *
         * The plugin handling rendering a layer is responsible for calling this method and registering
         * itself as a layersplugin.
         *
         * @param {String} id plugin id/name
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plug, set to null if you want to remove the entry
         */
        setLayerPlugin: function (id, plug) {
            if (id === null || id === undefined || !id.length) {
                this.log.warn(
                    'Setting layer plugin', plug, 'with a non-existent ID:', id
                );
            }
            if (plug === null || plug === undefined) {
                delete this._layerPlugins[id];
            } else {
                this._layerPlugins[id] = plug;
            }
        },
        /**
         * @method getLayerPlugins
         * Returns plugins that have been registered as layer plugins. See setLayerPlugin for more about layerplugins.
         * @param {String} id optional plugin id to return just the matching plugin
         * @return {Object} contains plugin ids keys and plugin objects as values or single plugin if param is given
         */
        getLayerPlugins: function (id) {
            if (id) {
                return this._layerPlugins[id];
            }
            return this._layerPlugins;
        },

        /**
         * @method getPluginInstances
         * Returns object containing plugins that have been registered to the map.
         * @param {String} pluginName name of the plugin to get (optional)
         * @return {Object} contains plugin ids as keys and plugin objects as values or single plugin if param was given
         */
        getPluginInstances: function (pluginName) {
            if (pluginName) {
                return this._pluginInstances[this.getName() + pluginName];
            }
            return this._pluginInstances;
        },
        /**
         * @method isPluginActivated
         * Checks if a plugin matching the given name is registered to the map
         * @param {String} pluginName name of the plugin to check
         * @return {Boolean} true if a plugin with given name is registered to the map
         */
        isPluginActivated: function (pluginName) {
            var plugin = this.getPluginInstances(pluginName);
            if (plugin) {
                return true;
            }
            return false;
        },
        /**
         * @method registerPlugin
         * Registers the given plugin to this map module. Sets the mapmodule reference to the plugin and
         * calls plugins register method. Saves a reference to the plugin that can be fetched through
         * getPluginInstances().
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        registerPlugin: function (plugin) {
            var sandbox = this.getSandbox();
            plugin.setMapModule(this);
            var pluginName = plugin.getName();
            this.log.debug(
                '[' + this.getName() + ']' + ' Registering ' + pluginName
            );
            plugin.register();
            if (this._pluginInstances[pluginName]) {
                this.log.warn(
                    '[' + this.getName() + ']' + ' Overwriting plugin with same name ' + pluginName
                );
            }
            this._pluginInstances[pluginName] = plugin;
        },
        /**
         * @method unregisterPlugin
         * Unregisters the given plugin from this map module. Sets the mapmodule reference on the plugin
         * to <null> and calls plugins unregister method. Removes the reference to the plugin from
         * getPluginInstances().
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        unregisterPlugin: function (plugin) {
            var sandbox = this.getSandbox(),
                pluginName = plugin.getName();

            this.log.debug(
                '[' + this.getName() + ']' + ' Unregistering ' + pluginName
            );
            plugin.unregister();
            this._pluginInstances[pluginName] = undefined;
            plugin.setMapModule(null);
            delete this._pluginInstances[pluginName];
        },
        lazyStartPlugins: [],
        /**
         * @method startPlugin
         * Starts the given plugin by calling its startPlugin() method.
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        startPlugin: function (plugin) {
            var sandbox = this.getSandbox(),
                pluginName = plugin.getName();

            this.log.debug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            try {
                var tryAgainLater = plugin.startPlugin(sandbox);
                if (tryAgainLater && typeof plugin.redrawUI === 'function') {
                    this.lazyStartPlugins.push(plugin);
                }
            } catch (e) {
                // something wrong with plugin (e.g. implementation not imported) -> log a warning
                this.log.warn(
                    'Unable to start plugin: ' + pluginName + ': ' +
                    e
                );
            }
        },
        /**
         * Starts any plugins that reported
         * @param  {[type]} force [description]
         * @return {[type]}       [description]
         */
        startLazyPlugins: function (force) {
            var me = this;
            var tryStartingThese = this.lazyStartPlugins.slice(0);
            // reset
            this.lazyStartPlugins = [];

            tryStartingThese.forEach(function (plugin) {
                var tryAgainLater = plugin.redrawUI(me.getMobileMode(), !!force);
                if (tryAgainLater) {
                    if (force) {
                        me.log.warn('Tried to force a start on plugin, but it still refused to start', plugin.getName());
                    }
                    me.lazyStartPlugins.push(plugin);
                }
            });
            me._adjustMobileMapSize();
        },
        /**
         * @method stopPlugin
         * Stops the given plugin by calling its stopPlugin() method.
         * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
         */
        stopPlugin: function (plugin) {
            var sandbox = this.getSandbox(),
                pluginName = plugin.getName();

            this.log.debug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            plugin.stopPlugin(sandbox);
        },
        /**
         * @method startPlugin
         * Starts all registered plugins (see getPluginInstances() and registerPlugin()) by
         * calling its startPlugin() method.
         */
        startPlugins: function () {
            var me = this;
            var sortedList = this._getSortedPlugins();

            _.each(sortedList, function (plugin) {
                if (plugin && typeof plugin.startPlugin === 'function') {
                    me.startPlugin(plugin);
                }
            });
        },
        /**
         * @method stopPlugins
         * Stops all registered plugins (see getPluginInstances() and registerPlugin()) by
         * calling its stopPlugin() method.
         */
        stopPlugins: function () {
            for (var pluginName in this._pluginInstances) {
                if (this._pluginInstances.hasOwnProperty(pluginName)) {
                    this.stopPlugin(this._pluginInstances[pluginName]);
                }
            }
        },

        /* --------------- /PLUGINS ------------------------ */

        /* --------------- BUNDLE BOILERPLATE ------------------------ */

        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this._id + 'MapModule';
        },
        /**
         * @method getSandbox
         * Returns reference to Oskari sandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function () {
            return this._sandbox;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current
         * language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @param {Boolean} force (optional) true to force reload for localization data
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key, force) {
            if (!this._localization || force === true) {
                this._localization = Oskari.getLocalization('MapModule');
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },
        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        },
        /* --------------- /BUNDLE BOILERPLATE ------------------------ */

        /* --------------- PUBLISHER ------------------------ */
        isInLayerToolsEditMode: function () {
            return this._isInLayerToolsEditMode;
        },
        /* --------------- /PUBLISHER ------------------------ */

        /* --------------- STYLES --------------------------- */

        /**
         * Register wellknown style
         * !! DO NOT USE - SUBJECT TO CHANGE !!
         * @method  @public registerStyle
         * @param  {String} key    style key
         * @param  {Object} styles styles object
         */
        registerWellknownStyle: function (key, styles) {
            var me = this,
                sandbox = this.getSandbox();

            if (key && styles) {
                var styleKey = Oskari.util.sanitize(key);
                var sanitizedStyles = {};
                var added = 0;

                for (var name in styles) {
                    var styleName = Oskari.util.sanitize(name);
                    var style = styles[name];

                    // if supported style format. Currently now supported only svg.
                    if (style && typeof style.data === 'string' && style.data.indexOf('<svg') > -1) {
                        if (!sanitizedStyles[styleKey]) {
                            sanitizedStyles[styleKey] = {};
                        }
                        sanitizedStyles[styleKey][styleName] = {
                            offsetX: (style.offsetX !== null && Oskari.util.isNumber(style.offsetX)) ? parseFloat(Oskari.util.sanitize(style.offsetX)) : null,
                            offsetY: (style.offsetY !== null && Oskari.util.isNumber(style.offsetY)) ? parseFloat(Oskari.util.sanitize(style.offsetY)) : null,
                            data: (style.data !== null) ? Oskari.util.sanitize(style.data) : null
                        };

                        if (styleName && !sanitizedStyles[styleKey][styleName].data) {
                            delete sanitizedStyles[styleKey][styleName];
                        } else {
                            added++;
                        }
                    }
                }

                if (added === 0) {
                    me.log.warn('Cannot add wellknown style for key=' + key + ', please check request!');
                    delete sanitizedStyles[styleKey];
                }

                if (styleKey && sanitizedStyles[styleKey]) {
                    if (me._wellknownStyles[styleKey]) {
                        me.log.warn('Founded allready added wellknown style for key=' + key + ', merging styles');
                        for (var sanitizedStyleName in sanitizedStyles[styleKey]) {
                            if (me._wellknownStyles[styleKey][sanitizedStyleName]) {
                                me.log.warn('Founded allready added wellknown style for key=' + key + ' and style name=' + sanitizedStyleName + ', replacing style');
                            }
                            me._wellknownStyles[styleKey][sanitizedStyleName] = sanitizedStyles[styleKey][sanitizedStyleName];
                        }
                    } else {
                        me._wellknownStyles[styleKey] = sanitizedStyles[styleKey];
                    }
                }
            }
        },

        /**
         * Get wellknown style object
         * !! DO NOT USE - SUBJECT TO CHANGE !!
         * @method  @public getWellknownStyle
         * @param  {String} key   style key
         * @param  {String} style style name
         * @return {Object} returns styles for wanted key or if defined also style name return only wanted style
         */
        getWellknownStyle: function (key, style) {
            var me = this,
                sandbox = this.getSandbox();

            if (!me._wellknownStyles[key] && !style) {
                this.log.warn('Not found wellknown markers for key=' + key + ', returning default markers');
                return Oskari.getMarkers();
            }

            if (key && style) {
                if (me._wellknownStyles[key] && me._wellknownStyles[key][style]) {
                    return me._wellknownStyles[key][style];
                } else {
                    this.log.warn('Not found wellknown markers for key=' + key + ' and style=' + style + ', returning default marker');
                    return Oskari.getDefaultMarker();
                }
            } else {
                return me._wellknownStyles[key];
            }
        },

        /* --------------- /STYLES --------------------------- */

        /* --------------- SVG MARKER ------------------------ */
        isSvg: function (style) {
            if (!isNaN(style.shape)) {
                return true;
            }
            // marker shape is svg
            else if ((typeof style.shape === 'object' && style.shape !== null &&
                style.shape.data) || (typeof style.shape === 'string' && style.shape.indexOf('<svg') > -1)) {
                return true;
            }
            // Marker is welknown named svg marker
            else if (typeof style.shape === 'object' && style.shape !== null &&
                style.shape.key && style.shape.name) {
                return true;
            }

            return false;
        },
        /**
         * Gets the svg marker to be used draw marker
         * @method  @public getSvg
         * @param  {Object} style marker style
         * @return {String} marget svg image format
         */
        getSvg: function (style) {
            var sandbox = this.getSandbox(),
                marker = this._markerTemplate.clone(),
                svgObject = null,
                isWellknownMarker = false;

            // marker shape is number --> find it from Oskari.getMarkers()
            if (!isNaN(style.shape)) {
                var markers = Oskari.getMarkers();
                svgObject = markers[style.shape];
                if (!svgObject) {
                    svgObject = Oskari.getDefaultMarker();
                }

                if (style.color) {
                    svgObject.data = this.__changePathAttribute(svgObject.data, 'fill', style.color);
                }
                if (style.stroke) {
                    svgObject.data = this.__changePathAttribute(svgObject.data, 'stroke', style.stroke);
                }
            }
            // marker shape is svg
            else if ((typeof style.shape === 'object' && style.shape !== null &&
                style.shape.data) || (typeof style.shape === 'string' && style.shape.indexOf('<svg') > -1)) {
                var offset = {
                    x: style.offsetX || style.shape.x,
                    y: style.offsetY || style.shape.y
                };

                if (isNaN(offset.x)) {
                    offset.x = 16;
                }

                if (isNaN(offset.y)) {
                    offset.y = 16;
                }

                svgObject = {
                    data: style.shape.data || style.shape,
                    offsetX: offset.x,
                    offsetY: offset.y
                };
            }
            // Marker is welknown named svg marker
            else if (typeof style.shape === 'object' && style.shape !== null &&
                style.shape.key && style.shape.name) {
                svgObject = this.getWellknownStyle(style.shape.key, style.shape.name);
                if (svgObject === null) {
                    this.log.warn('Not identified wellknown marker shape. Not handled getSvg.');
                    return null;
                }
                isWellknownMarker = true;
            }
            // marker icon not found
            else {
                return null;
            }

            svgObject.data = this.__addPositionMarks(svgObject);

            marker.append(svgObject.data);

            // IE needs this because ol.style.Icon opacity property not work on IE
            marker.css('opacity', style.opacity || 1);

            if (isWellknownMarker && style.shape.color) {
                marker.find('.normal-color').attr('fill', style.shape.color);
                var shadowRgb = Oskari.util.hexToRgb(style.shape.color);
                shadowRgb.r -= 30;
                shadowRgb.g -= 30;
                shadowRgb.b -= 30;
                if (shadowRgb.r < 0) {
                    shadowRgb.r = 0;
                }
                if (shadowRgb.g < 0) {
                    shadowRgb.g = 0;
                }
                if (shadowRgb.b < 0) {
                    shadowRgb.b = 0;
                }
                var rgbColor = 'rgb(' + shadowRgb.r + ',' + shadowRgb.g + ',' + shadowRgb.b + ')';
                marker.find('.shading-color').attr('fill', rgbColor);
            }

            var markerHTML = marker.outerHTML();

            if (style.size) {
                markerHTML = this.__changeSvgAttribute(markerHTML, 'height', style.size);
                markerHTML = this.__changeSvgAttribute(markerHTML, 'width', style.size);
            } else {
                markerHTML = this.__changeSvgAttribute(markerHTML, 'height', this._defaultMarker.size);
                markerHTML = this.__changeSvgAttribute(markerHTML, 'width', this._defaultMarker.size);
            }

            var svgSrc = 'data:image/svg+xml,' + encodeURIComponent(markerHTML);

            return svgSrc;
        },

        /**
         * Gets popup position in pixel for selected marker
         * @method  @public getSvgMarkerPopupPxPosition
         * @param  {Integer|Object} marker marker shape number or object if used own markers
         * @return {Object} object wit popup x and y position in pixel
         */
        getSvgMarkerPopupPxPosition: function (marker) {
            var me = this;
            var offsetX = 0;
            var offsetY = -20;

            var isMarker = !!((marker && marker.data));

            if (!isMarker) {
                return {
                    x: offsetX,
                    y: offsetY
                };
            }

            var isMarkerShape = !!((marker && marker.data && marker.data.shape !== null && !isNaN(marker.data.shape)));
            var isCustomMarker = !!((marker && marker.data && marker.data.shape !== null && (marker.data.shape.data || (typeof marker.data.shape === 'string' && marker.data.shape.indexOf('<svg')>-1))));

            var markerSize = (marker && marker.data && marker.data.size) ? me.getPixelForSize(marker.data.size) : 32;

            var markerDetails = {
                offsetX: 16,
                offsetY: 16
            };

            if (isMarker && isMarkerShape) {
                if (marker.data.shape < Oskari.getMarkers().length) {
                    markerDetails = Oskari.getMarkers()[marker.data.shape];
                } else {
                    markerDetails = Oskari.getDefaultMarker();
                }
            } else if (isCustomMarker) {
                markerDetails = {
                    data: marker.data.shape.data,
                    offsetX: marker.data.shape.x || marker.data.offsetX,
                    offsetY: marker.data.shape.x || marker.data.offsetY
                };
            }

            var dx = !isNaN(markerDetails.offsetX) ? markerDetails.offsetX : 16;
            var dy = !isNaN(markerDetails.offsetY) ? markerDetails.offsetY : 16;

            var diff = markerSize / 32;

            if (dx === 16) {
                offsetX = 0;
            } else if (dx < 16) {
                offsetX = (32 - dx) / 2;
            } else {
                offsetX = -(32 - dx) / 2;
            }

            if (dy <= 16) {
                offsetY = -(32 - dy) / 2 * diff;
            } else {
                offsetY = (32 - dy) / 2 * diff;
            }

            return {
                x: offsetX,
                y: offsetY
            };
        },

        /**
         * Add x and y attributes to svg image
         * @method  @private __addPositionMarks
         * @param  {Object} svgObject the svg object
         * @return {String} svg string
         */
        __addPositionMarks: function (svgObject) {
            var htmlObject = jQuery(svgObject.data);
            var defaultCenter = this._defaultMarker.size / 2;

            var dx = !isNaN(svgObject.offsetX) ? svgObject.offsetX : 16;
            var dy = !isNaN(svgObject.offsetY) ? svgObject.offsetY : 16;

            var x = defaultCenter - dx;
            var y = defaultCenter - (defaultCenter - dy);

            if (!isNaN(x) && !isNaN(y)) {
                htmlObject.attr('x', x);
                htmlObject.attr('y', y);
            }

            return htmlObject.outerHTML();
        },
        /**
         * Changes svg path attributes
         * @method  @private __changePathAttribute description]
         * @param  {String} svg   svg format
         * @param  {String} attr  attribute name
         * @param  {String} value attribute value
         * @return {String} svg string
         */
        __changePathAttribute: function (svg, attr, value) {
            var htmlObject = jQuery(svg);
            var sandbox = this.getSandbox();
            htmlObject.find('path').attr(attr, value);

            if (htmlObject.find('path').length > 1) {
                this.log.warn('Founded more than one <path> in SVG. SVG can maybe looks confusing');
            }

            return htmlObject.outerHTML();
        },
        /**
         * Changes svg attribute
         * @method  @private __changeSvgAttribute
         * @param  {String} svg   svg format
         * @param  {String} attr  attribute name
         * @param  {String} value attribute value
         * @return {String} svg string
         */
        __changeSvgAttribute: function (svg, attr, value) {
            var htmlObject = jQuery(svg);
            htmlObject.attr(attr, value);
            return htmlObject.outerHTML();
        },
        /**
         * Converts from abstract marker size to real pixel size
         * @method  @public getPixelForSize
         * @param {Number} size Abstract size if number then calculated new size.
         * @returns {Number} Size in pixels
         */
        getPixelForSize: function (size) {
            return 40 + 10 * size;
        },
        /* --------------- /SVG MARKER ------------------------ */

        /* --------------- PLUGIN CONTAINERS ------------------------ */
        /**
         * Removes all the css classes which respond to given regex from all elements
         * and adds the given class to them.
         *
         * @method changeCssClasses
         * @param {String} classToAdd the css class to add to all elements.
         * @param {RegExp} removeClassRegex the regex to test against to determine which classes should be removec
         * @param {Array[jQuery]} elements The elements where the classes should be changed.
         */
        changeCssClasses: function (classToAdd, removeClassRegex, elements) {
            // TODO: deprecate this, make some error message appear or smthng

            var i,
                j,
                el;

            var removeClasses = function (el) {
                el.removeClass(function (index, classes) {
                    var removeThese = '',
                        classNames = classes.split(' ');

                    // Check if there are any old font classes.
                    for (j = 0; j < classNames.length; j += 1) {
                        if (removeClassRegex.test(classNames[j])) {
                            removeThese += classNames[j] + ' ';
                        }
                    }

                    // Return the class names to be removed.
                    return removeThese;
                });
            };

            for (i = 0; i < elements.length; i += 1) {
                el = elements[i];
                removeClasses(el);

                // Add the new font as a CSS class.
                el.addClass(classToAdd);
            }
        },
        /**
         * Sets the style to be used on plugins and asks all the active plugins that support changing style to change their style accordingly.
         *
         * @method changeToolStyle
         * @param {Object} style The style object to be applied on all plugins that support changing style.
         */
        changeToolStyle: function (style) {
            var me = this;

            if (me._options) {
                me._options.style = _.cloneDeep(style);
            }

            // notify plugins of the style change.
            if (style) {
                _.each(me._pluginInstances, function (plugin) {
                    if (plugin && plugin.hasUI()) {
                        var styleConfig = me._options.style.toolStyle !== 'default' ? me._options.style.toolStyle : null;
                        if (plugin.changeToolStyle && typeof plugin.changeToolStyle === 'function') {
                            plugin.changeToolStyle(styleConfig);
                        }
                        if (plugin.changeFont && typeof plugin.changeFont === 'function') {
                            plugin.changeFont(me._options.style.font);
                        }
                    }
                });
            }
        },
        /**
         * Gets the style to be used on plugins
         *
         * @method getToolStyle
         * @return {String} style The mapmodule's style configuration.
         */
        getToolStyle: function () {
            var me = this;
            if (me._options && me._options.style && me._options.style.toolStyle) {
                return me._options.style.toolStyle && me._options.style.toolStyle !== 'default' ? me._options.style.toolStyle : null;
            } else {
                return null;
            }
        },
        /**
         * Gets the font to be used on plugins
         * @method getToolFont
         * @return {String} font The mapmodule's font configuration or null if not set.
         */
        getToolFont: function () {
            var me = this;
            if (me._options && me._options.style && me._options.style.font) {
                return me._options.style.font;
            } else {
                return null;
            }
        },

        /**
         * Gets the colourscheme to be used on plugins
         * @method getToolColourScheme
         * @return {String} font The mapmodule's font configuration or null if not set.
         */
        getToolColourScheme: function () {
            var me = this;
            if (me._options && me._options.style && me._options.style.colourScheme) {
                return me._options.style.colourScheme;
            } else {
                return null;
            }
        },
        _getContainerWithClasses: function (containerClasses) {
            var mapDiv = this.getMapEl(),
                containerDiv = jQuery(
                    '<div class="mapplugins">' +
                    '  <div class="mappluginsContainer">' +
                    '    <div class="mappluginsContent"></div>' +
                    '  </div>' +
                    '</div>'
                );

            containerDiv.addClass(containerClasses);
            containerDiv.attr('data-location', containerClasses);
            return containerDiv;
        },

        _getContainerClasses: function () {
            return [
                'bottom center',
                'center top',
                'center right',
                'center left',
                'bottom right',
                'bottom left',
                'right top',
                'left top'
            ];
        },

        /**
         * Adds containers for map control plugins
         */
        _addMapControlPluginContainers: function () {
            var containerClasses = this._getContainerClasses(),
                containerDiv,
                mapDiv = this.getMapEl(),
                i;

            for (i = 0; i < containerClasses.length; i += 1) {
                mapDiv.append(
                    this._getContainerWithClasses(containerClasses[i])
                );
            }
        },

        _getMapControlPluginContainer: function (containerClasses) {
            var splitClasses = (containerClasses + '').split(' '),
                selector = '.mapplugins.' + splitClasses.join('.'),
                containerDiv,
                mapDiv = this.getMapEl();

            containerDiv = mapDiv.find(selector);
            if (!containerDiv.length) {
                var containersClasses = this._getContainerClasses(),
                    currentClasses,
                    previousFound = null,
                    current,
                    classesMatch,
                    i,
                    j;

                for (i = 0; i < containersClasses.length; i += 1) {
                    currentClasses = containersClasses[i].split(' ');
                    current = mapDiv.find('.mapplugins.' + currentClasses.join('.'));
                    if (current.length) {
                        // container was found in DOM
                        previousFound = current;
                    } else {
                        // container not in DOM, see if it's the one we're supposed to add
                        classesMatch = true;
                        for (j = 0; j < currentClasses.length; j += 1) {
                            if (jQuery.inArray(currentClasses[j], splitClasses) < 0) {
                                classesMatch = false;
                                break;
                            }
                        }
                        if (classesMatch) {
                            // It's the one we're supposed to add
                            containerDiv = this._getContainerWithClasses(
                                currentClasses
                            );
                            if (previousFound !== null && previousFound.length) {
                                previousFound.after(containerDiv);
                            } else {
                                mapDiv.prepend(containerDiv);
                            }
                        }
                    }
                }
            }
            return containerDiv;
        },

        /**
         * @method setMapControlPlugin
         * Inserts a map control plugin instance to the map DOM
         * @param  {Object} element          Control container (jQuery)
         * @param  {String} containerClasses List of container classes separated by space, e.g. 'top left'
         * @param  {Number} slot             Preferred slot/position for the plugin element. Inverted for bottom corners (at least).
         */

        setMapControlPlugin: function (element, containerClasses, position) {
            // Get the container
            var container = this._getMapControlPluginContainer(containerClasses),
                content = container.find('.mappluginsContainer .mappluginsContent'),
                inverted = /^(?=.*\bbottom\b)((?=.*\bleft\b)|(?=.*\bright\b)).+/.test(containerClasses), // bottom corner container?
                precedingPlugin = null,
                curr;

            if (!element) {
                throw 'Element is non-existent.';
            }
            if (!containerClasses) {
                throw 'No container classes.';
            }
            if (!content || !content.length) {
                throw 'Container with classes "' + containerClasses + '" not found.';
            }
            if (content.length > 1) {
                throw 'Found more than one container with classes "' + containerClasses + '".';
            }

            // Add slot to element
            element.attr('data-position', position);
            // Detach element
            element.detach();
            // Get container's children, iterate through them
            if (position !== null && position !== undefined) {
                content.find('.mapplugin').each(function () {
                    curr = jQuery(this);
                    // if plugin's slot isn't bigger (or smaller for bottom corners) than ours, store it to precedingPlugin
                    if ((!inverted && parseInt(curr.attr('data-position')) <= position) ||
                        (inverted && parseInt(curr.attr('data-position')) > position)) {
                        precedingPlugin = curr;
                    }
                });
                if (!precedingPlugin) {
                    // no preceding plugin found, just slap our plugin to the beginning of the container
                    content.prepend(element);
                } else {
                    // preceding plugin found, insert ours after it.
                    precedingPlugin.after(element);
                }
            } else {
                // no position given, add to end
                content.append(element);
            }
            // Make sure container is visible
            container.css('display', '');
        },

        /**
         * @method removeMapControlPlugin
         * Removes a map control plugin instance from the map DOM
         * @param  {Object} element Control container (jQuery)
         * @param  {Boolean} keepContainerVisible Keep container visible even if there's no children left.
         * @param {Boolean} detachOnly true to detach and preserve event handlers, false to remove element
         */
        removeMapControlPlugin: function (element, keepContainerVisible, detachOnly) {
            var container = element.parents('.mapplugins'),
                content = element.parents('.mappluginsContent');
            // TODO take this into use in all UI plugins so we can hide unused containers...
            if (detachOnly) {
                element.detach();
            } else {
                element.remove();
            }
            if (!keepContainerVisible && content.children().length === 0) {
                container.css('display', 'none');
            }
        },

        /* --------------- /PLUGIN CONTAINERS ------------------------ */

        /* --------------- MAP LAYERS ------------------------ */
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * Internally calls getOLMapLayers() on all registered layersplugins.
         * @param {String} layerId
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layerId) {
            var me = this,
                sandbox = me._sandbox,
                layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                // not found
                return null;
            }
            var lps = this.getLayerPlugins(),
                p,
                layersPlugin,
                layerList,
                results = [];
            // let the actual layerplugins find the layer since the name depends on
            // type
            for (p in lps) {
                if (lps.hasOwnProperty(p)) {
                    layersPlugin = lps[p];
                    if (!layersPlugin) {
                        me.log.warn(
                            'LayerPlugins has no entry for "' + p + '"'
                        );
                    }
                    // find the actual openlayers layers (can be many)
                    layerList = layersPlugin ? layersPlugin.getOLMapLayers(layer) : null;
                    if (layerList) {
                        // if found -> add to results
                        // otherwise continue looping
                        results = results.concat(layerList);
                    }
                }
            }
            return results;
        },
        /**
         * Adds the layer to the map through the correct plugin for the layer's type.
         *
         * @method afterMapLayerAddEvent
         * @param  {Object} layer Oskari layer of any type registered to the mapmodule plugin
         * @param  {Boolean} keepLayersOrder
         * @param  {Boolean} isBaseMap
         * @return {undefined}
         */
        afterMapLayerAddEvent: function (event) {
            var map = this.getMap(),
                layer = event.getMapLayer(),
                keepLayersOrder = true,
                isBaseMap = false,
                layerPlugins = this.getLayerPlugins(),
                layerFunctions = [],
                sandbox = this.getSandbox();

            if (!layer.isSupported(sandbox.getMap().getSrsName())) {
                this._mapLayerService.showUnsupportedPopup();
            }

            _.each(layerPlugins, function (plugin) {
                // true if either plugin doesn't have the function or says the layer is supported.
                var isSupported = !_.isFunction(plugin.isLayerSupported) || plugin.isLayerSupported(layer);
                if (_.isFunction(plugin.addMapLayerToMap) && isSupported) {
                    var layerFunction = plugin.addMapLayerToMap(layer, keepLayersOrder, isBaseMap);
                    if (_.isFunction(layerFunction)) {
                        layerFunctions.push(layerFunction);
                    }
                }
            });

            // Execute each layer function
            _.each(layerFunctions, function (func) {
                func.apply();
            });
        },

        /**
         * @method afterRearrangeSelectedMapLayerEvent
         * @private
         * Handles AfterRearrangeSelectedMapLayerEvent.
         * Changes the layer order in Openlayers to match the selected layers list in
         * Oskari.
         */
        afterRearrangeSelectedMapLayerEvent: function () {
            var me = this;
            var layers = this.getSandbox().findAllSelectedMapLayers();
            var layerIndex = 0;

            // setup new order based on the order we get from sandbox
            _.each(layers, function (layer) {
                if (!layer) {
                    return;
                }
                var olLayers = me.getOLMapLayers(layer.getId());
                _.each(olLayers, function (layerImpl) {
                    me.setLayerIndex(layerImpl, layerIndex++);
                });
            });

            this.orderLayersByZIndex();
        },
        /**
         * @method @public isValidGeoJson
         * checks geoJSON validity
         * @return {boolean} true: if valid
         */
        isValidGeoJson: function (geoJson) {
            // checking if geoJSON has features
            if (geoJson.features && geoJson.features.length > 0) {
                return true;
            }
            // checkig other things, will be added later...
            return false;
        },
        /**
         * @method handleMapLayerUpdateRequest
         * Update layer params and force update (wms) or force redraw for other layer types
         * @param layerId
         * @param {boolean} forced
         * @param {Object} params
         */
        handleMapLayerUpdateRequest: function (layerId, forced, params) {
            var me = this,
            	sandbox = me.getSandbox(),
            	layerPlugins = me.getLayerPlugins(),
            	layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
            if (!layer) {
                // couldn't find layer to update
                return;
            }
            _.each(layerPlugins, function (plugin) {
                // true if either plugin doesn't have the function or says the layer is supported.
                var isSupported = !_.isFunction(plugin.isLayerSupported) || plugin.isLayerSupported(layer);
                if (_.isFunction(plugin.updateLayerParams) && isSupported) {
                    plugin.updateLayerParams(layer, forced, params);
                }
            });
        },
        /**
         * @static
         * @property __guidedTourDelegateTemplates
         * Delegate object templates given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        __guidedTourDelegateTemplates: [{
            priority: 70,
            getTitle: function () {
                return this.getLocalization().guidedTour.help1.title;
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.getLocalization().guidedTour.help1.message);
                return content;
            },
            getPositionRef: function () {
                return jQuery('.panbuttonDiv');
            },
            positionAlign: 'left'
        },
        {
            priority: 80,
            getTitle: function () {
                return this.getLocalization().guidedTour.help2.title;
            },
            getContent: function () {
                var content = jQuery('<div></div>');
                content.append(this.getLocalization().guidedTour.help2.message);
                return content;
            },
            getPositionRef: function () {
                return jQuery('.pzbDiv');
            },
            positionAlign: 'left'
        }],
        /**
         * @method getLayerTileUrls
         * @param layerId id of the layer
         * @return {String[]}
         * Get urls of tile layer tiles. Override in implementation
         */
        getLayerTileUrls: function (layerId) {
            return [];
        },
        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function () {
            var me = this;
            function sendRegister () {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder) {
                    me.__guidedTourDelegateTemplates.forEach(function (template, i) {
                        var delegate = {
                            bundleName: me.getName() + '_' + (i + 1)
                        };
                        for (var prop in template) {
                            if (typeof template[prop] === 'function') {
                                delegate[prop] = template[prop].bind(me); // bind methods to bundle instance
                            } else {
                                delegate[prop] = template[prop]; // assign values
                            }
                        }
                        me._sandbox.request(me, requestBuilder(delegate));
                    });
                }
            }

            function handler (msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me._sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        }
        /* --------------- /MAP LAYERS ------------------------ */
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: ['Oskari.mapframework.module.Module']
    }
);
