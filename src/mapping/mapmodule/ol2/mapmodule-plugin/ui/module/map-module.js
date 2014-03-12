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
 * 		Unigue ID for this map
 * @param {String} imageUrl
 *      base url for marker etc images
 * @param {Array} map options, example data:
 *  {
 *		resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
 *      units : "m",
 *		maxExtent : {
 *			left : 0,
 *			bottom : 10000000,
 *			right : 10000000,
 *			top : 0
 *		},
 *      srsName : "EPSG:3067"
 *	}
 */
function(id, imageUrl, options) {

    this._id = id;
    this._imageUrl = imageUrl;

    this._options = {
        resolutions : [2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5],
        srsName : 'EPSG:3067',
        units : 'm'
    };
    // override defaults
    if (options) {
        for (var key in options) {
            this._options[key] = options[key];
        }
    }

    this._controls = {};
    this._layerPlugins = {};

    this._supportedFormats = {};

    this._map = null;

    // _mapScales are calculated based on resolutions on init
    this._mapScales = [];

    this._sandbox = null;
    this._stealth = false;

    this._pluginInstances = {};

    // mapcontrols assumes this to be present before init or start
    this._navigationHistoryTool = new OpenLayers.Control.NavigationHistory();
    this._navigationHistoryTool.id = "navigationhistory";
    this._localization = null;
}, {

    clearNavigationHistory : function() {
        this._navigationHistoryTool.clear();
    },

    /**
     * @method getMapViewPortDiv
     * Returns a reference to the map viewport div for setting correct z-ordering of divs
     * @return {HTMLDivElement}
     */
    getMapViewPortDiv : function() {
        return this._map.viewPortDiv;
    },

    /**
     * @method getMapLayersContainerDiv
     * Returns a reference to the div containing the map layers for setting correct z-ordering of divs
     * @return {HTMLDivElement}
     */
    getMapLayersContainerDiv : function() {
        return this._map.layerContainerDiv;
    },

    /**
     * @method createMap
     * @private
     * Creates the OpenLayers.Map object
     * @return {OpenLayers.Map}
     */
    _createMap : function() {

        var sandbox = this._sandbox;
        // this is done BEFORE enhancement writes the values to map domain
        // object... so we will move the map to correct location
        // by making a MapMoveRequest in application startup
        var lonlat = new OpenLayers.LonLat(0, 0);

        var mapExtent = new OpenLayers.Bounds(0, 0, 10000000, 10000000);
        if (this._options != null && this._options.maxExtent != null && this._options.maxExtent.left != null && this._options.maxExtent.bottom != null && this._options.maxExtent.right != null && this._options.maxExtent.top != null) {
            mapExtent = new OpenLayers.Bounds(this._options.maxExtent.left, this._options.maxExtent.bottom, this._options.maxExtent.right, this._options.maxExtent.top);
        }

        this._map = new OpenLayers.Map({
            controls : [],
            units : this._options.units, //'m',
            maxExtent : mapExtent,
            resolutions : this._options.resolutions,
            projection : this._options.srsName,
            isBaseLayer : true,
            center : lonlat,
            theme : null,
            zoom : 0
        });

        this._createBaseLayer();

        this.addMapControl('navigationHistoryTool', this._navigationHistoryTool);
        this.getMapControl('navigationHistoryTool').activate();

        return this._map;
    },
    /**
     * @method getProjection
     * Returns the SRS projection code for the map.
     * Currently always 'EPSG:3067'
     * @return {String}
     */
    getProjection : function() {
        return this._options.srsName;
    },
    /**
     * @method createBaseLayer
     * Creates a dummy base layer and adds it to the map. Nothing to do with Oskari maplayers really.
     * @private
     */
    _createBaseLayer : function() {

        var base = new OpenLayers.Layer("BaseLayer", {
            layerId : 0,
            isBaseLayer : true,
            displayInLayerSwitcher : false
        });

        this._map.addLayer(base);
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
    moveMapToLanLot : function(lonlat, zoomAdjust, pIsDragging) {
        // TODO: openlayers has isValidLonLat(); maybe use it here
        var isDragging = (pIsDragging === true);
        // using panTo BREAKS IE on startup so do not
        // should we spam events on dragmoves?
        this._map.setCenter(lonlat, this._map.getZoom(), isDragging);
        if (zoomAdjust) {
            this.adjustZoomLevel(zoomAdjust, true);
        }
        this._updateDomain();
    },
    /**
     * @method panMapToLonLat
     * Pans the map to the given position.
     * @param {OpenLayers.LonLat} lonlat coordinates to pan the map to
     * @param {Boolean} suppressEnd true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    panMapToLonLat : function(lonlat, suppressEnd) {
        this._map.setCenter(lonlat, this._map.getZoom());
        this._updateDomain();
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
    zoomToScale : function(scale, closest, suppressEnd) {
        var isClosest = (closest === true);
        this._map.zoomToScale(scale, isClosest);
        this._updateDomain();
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
    centerMap : function(lonlat, zoom, suppressEnd) {
        // TODO: openlayers has isValidLonLat(); maybe use it here
        this._map.setCenter(lonlat, zoom, false);
        this._updateDomain();
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
    panMapByPixels : function(pX, pY, suppressStart, suppressEnd, isDrag) {
        // usually programmatically for gfi centering
        this._map.pan(pX, pY, {
            dragging : ( isDrag ? true : false),
            animate : false
        });

        this._updateDomain();
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
    moveMapByPixels : function(pX, pY, suppressStart, suppressEnd) {
        // usually by mouse
        this._map.moveByPx(pX, pY);
        this._updateDomain();
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
    centerMapByPixels : function(pX, pY, suppressStart, suppressEnd) {
        var newXY = new OpenLayers.Pixel(pX, pY);
        var newCenter = this._map.getLonLatFromViewPortPx(newXY);
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
    zoomToExtent : function(bounds, suppressStart, suppressEnd) {
        this._map.zoomToExtent(bounds);
        this._updateDomain();
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
    adjustZoomLevel : function(amount, suppressEvent) {
        var requestedZoomLevel = this._getNewZoomLevel(amount);

        this._map.zoomTo(requestedZoomLevel);
        this._updateDomain();
        if (suppressEvent !== true) {
            // send note about map change
            this.notifyMoveEnd();
        }
    },
    /**
     * @method setZoomLevel
     * Sets the maps zoom level to given absolute number
     * @param {Number} newZoomLevel absolute zoom level (0-12)
     * @param {Boolean} suppressEvent true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    setZoomLevel : function(newZoomLevel, suppressEvent) {
        //console.log('zoom to ' + requestedZoomLevel);
        if (newZoomLevel == this._map.getZoom()) {
            // do nothing if requested zoom is same as current
            return;
        }
        if (newZoomLevel < 0 || newZoomLevel > this._map.getNumZoomLevels) {
            newZoomLevel = this._map.getZoom();
        }
        this._map.zoomTo(newZoomLevel);
        this._updateDomain();
        if (suppressEvent !== true) {
            // send note about map change
            this.notifyMoveEnd();
        }
    },

    getZoomLevel : function() {
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
    _getNewZoomLevel : function(adjustment) {
        // TODO: check isNaN?
        var requestedZoomLevel = this._map.getZoom() + adjustment;

        if (requestedZoomLevel >= 0 && requestedZoomLevel <= this._map.getNumZoomLevels()) {
            return requestedZoomLevel;
        }
        // if not in valid bounds, return original
        return this._map.getZoom();
    },
    /**
     * @method notifyStartMove
     * Notify other components that the map has started moving. Sends a MapMoveStartEvent.
     * Not sent always, preferrably track map movements by listening to AfterMapMoveEvent.
     * Ignores the call if map is in stealth mode
     */
    notifyStartMove : function() {
        if (this.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }
        this._sandbox.getMap().setMoving(true);
        var centerX = this._map.getCenter().lon;
        var centerY = this._map.getCenter().lat;
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
    notifyMoveEnd : function() {
        if (this.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }
        var sandbox = this._sandbox;
        sandbox.getMap().setMoving(false);

        var lonlat = this._map.getCenter();
        this._updateDomain();
        var event = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this._map.getZoom(), false, this._map.getScale());
        sandbox.notifyAll(event);
    },
    /**
     * @method updateSize
     * Notifies OpenLayers that the map size has changed and updates the size in sandbox map domain object.
     */
    updateSize : function() {
        this.getMap().updateSize();
        this._updateDomain();

        var sandbox = this._sandbox;
        var mapVO = sandbox.getMap();
        // send as an event forward to WFSPlugin (draws)
        var event = sandbox.getEventBuilder("MapSizeChangedEvent")(mapVO.getWidth(), mapVO.getHeight());
        sandbox.notifyAll(event);
    },
    /**
     * @method _updateDomain
     * @private
     * Updates the sandbox map domain object with the current map properties.
     * Ignores the call if map is in stealth mode.
     */
    _updateDomain : function() {

        if (this.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }
        var sandbox = this._sandbox;
        var mapVO = sandbox.getMap();
        var lonlat = this._map.getCenter();

        mapVO.moveTo(lonlat.lon, lonlat.lat, this._map.getZoom());

        mapVO.setScale(this._map.getScale());

        var size = this._map.getCurrentSize();
        mapVO.setWidth(size.w);
        mapVO.setHeight(size.h);

        mapVO.setResolution(this._map.getResolution());
        mapVO.setExtent(this._map.getExtent());
        mapVO.setMaxExtent(this._map.getMaxExtent());

        mapVO.setBbox(this._map.calculateBounds());

        // TODO: not sure if this is supposed to work like this
        // this resets the marker set by url control parameter so dont do it
        //mapVO.setMarkerVisible(this._hasMarkers());
    },
    /**
     * @method getMapScales
     * @return {Number[]} calculated mapscales
     */
    getMapScales : function() {
        return this._mapScales;
    },

    /**
     * @method _drawMarker
     * @private
     * Adds a marker on the center of the map
     */
    _drawMarker : function() {
        // FIXME: not really sure if markers are supposed to be handled here
        this._removeMarkers();
        var centerMapLonLat = this._map.getCenter();

        var layerMarkers = new OpenLayers.Layer.Markers("Markers");
        this._map.addLayer(layerMarkers);

        var size = new OpenLayers.Size(32, 32);
        var offset = new OpenLayers.Pixel(-16, -size.h);

        var icon = new OpenLayers.Icon(this.getImageUrl() + '/framework/bundle/mapmodule-plugin/images/marker.png', size, offset);
        var marker = new OpenLayers.Marker(centerMapLonLat, icon);
        layerMarkers.addMarker(marker);
    },
    /**
     * @method _removeMarkers
     * @private
     * Removes any markers from the map
     */
    _removeMarkers : function() {

        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var i = 0; i < markerLayer.length; i++) {
                if (markerLayer[i]) {
                    this._map.removeLayer(markerLayer[i], false);
                }
            }
        }
    },
    /**
     * @method _hasMarkers
     * @private
     * Returns true if there are any markers on the map
     * @return {Boolean}
     */
    _hasMarkers : function() {
        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var i = 0; i < markerLayer.length; i++) {
                if (markerLayer[i] && markerLayer[i].markers && markerLayer[i].markers.length > 0) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     * @property eventHandlers
     * @static
     */
    eventHandlers : {
        'SearchClearedEvent' : function(event) {
            this._removeMarkers();
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
    updateCurrentState : function() {

        var me = this;
        var sandbox = me._sandbox;

        var layers = sandbox.findAllSelectedMapLayers();
        var lps = this.getLayerPlugins();

        for (p in lps) {
            var layersPlugin = lps[p];

            sandbox.printDebug('preselecting ' + p);
            layersPlugin.preselectLayers(layers);
        }
    },

    /**
     * Removes all the css classes which respond to given regex from all elements
     * and adds the given class to them.
     *
     * @method changeCssClasses
     * @param {String} classToAdd the css class to add to all elements.
     * @param {RegExp} removeClassRegex the regex to test against to determine which classes should be removec
     * @param {Array[jQuery]} elements The elements where the classes should be changed.
     */
    changeCssClasses : function(classToAdd, removeClassRegex, elements) {
        var i, j, el;

        for ( i = 0; i < elements.length; i++) {
            el = elements[i];

            el.removeClass(function(index, classes) {
                var removeThese = '', classNames = classes.split(' ');

                // Check if there are any old font classes.
                for ( j = 0; j < classNames.length; ++j) {
                    if (removeClassRegex.test(classNames[j])) {
                        removeThese += classNames[j] + ' ';
                    }
                }

                // Return the class names to be removed.
                return removeThese;
            });

            // Add the new font as a CSS class.
            el.addClass(classToAdd);
        }
    },

    _addMapControlImpl : function(ctl) {
        this._map.addControl(ctl);
    },

    _removeMapControlImpl : function(ctl) {
        this._map.removeControl(ctl);
    },

    getMapScale : function() {
        return this._map.getScale();
    },
    getMapSize : function() {
        var wh = this._map.getSize();
        return [wh.w, wh.h];

    },

    /* TEMP : layer handling in Plugins to be replaced by one inherited from
     *  Oskari.mapping.mapmodule.AbstractMapModule
     */
    /* TEMP : shall be replaced by *Impl variants */

    _setLayerImplIndex : function(layerImpl, index) {
        return this._map.setLayerIndex(layerImpl, index);
    },

    getLayersByName : function(name) {
        return this._map.getLayersByName(name);
    },
    
    _addLayerImpl : function(layerImpl) {
        this._map.addLayer(layerImpl);
    },

    _removeLayerImpl : function(layerImpl) {
        this._map.removeLayer(layerImpl);
        layerImpl.destroy();
    }

    
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module'],
    "extend" : ["Oskari.mapping.mapmodule.AbstractMapModule"]
});
