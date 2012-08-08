/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 * Provides map functionality/Wraps actual map implementation (Openlayers)
 *
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.MapModule',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String} id
 * 		Unigue ID for this map
 *
 */
function(id) {

    this._id = id;

    this._controls = {};
    this._layerPlugins = {};

    /** @static @property {String} _projectionCode SRS projection code, defaults
     * to 'EPSG:3067' */
    this._projectionCode = 'EPSG:3067';
    this._supportedFormats = {};

    this._map = null;

    /** @static @property {Number[]} _mapScales map scales */
    //this._mapScales = [5669294.4, 2834647.2, 1417323.6, 566929.44, 283464.72,
    // 141732.36, 56692.944, 28346.472, 11338.5888, 5669.2944, 2834.6472,
    // 1417.3236, 708.6618];
    // calculated based on resolutions on init
    this._mapScales = [];
    this._mapResolutions = [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25];

    this._navigationHistoryTool = null;
    this._sandbox = null;

    this._stealth = false;

    this._pluginInstances = {};

    // mapcontrols assumes this to be present before init or start
    this._navigationHistoryTool = new OpenLayers.Control.NavigationHistory();
    this._navigationHistoryTool.id = "navigationhistory";
    this._localization = null;
}, {
    /*
     * map controls - storage for controls by id
     */
    getControls : function() {
        return this._controls;
    },
    addMapControl : function(id, ctl) {
        this._controls[id] = ctl;
        this._map.addControl(ctl);
    },
    getMapControl : function(id) {
        return this._controls[id];
    },
    removeMapControl : function(id) {
        this._map.removeControl(this._controls[id]);
        this._controls[id] = null;
        delete this._controls[id];
    },
    /**
     * special plugins for handling layers - plugin is
     * responsible to registering as layer plugin
     */
    setLayerPlugin : function(id, plug) {
        this._layerPlugins[id] = plug;
    },
    getLayerPlugin : function(id) {
        return this._layerPlugins[id];
    },
    getLayerPlugins : function() {
        return this._layerPlugins;
    },
    clearNavigationHistory : function() {
        this._navigationHistoryTool.clear();
    },
    /**
     * Registeres load events to layer that will notify when map
     * is ready
     *
     * @param {Object}
     *            openLayer openLayer object
     *
     * @param {Layer}
     *            portti layer
     */
    attachLoadingStatusToLayer : function(openLayer, layer) {
        var sandbox = this._sandbox;
        var mapModule = this;

        var statusText = this.getLocalization('status_update_map') + " '" + layer.getName() + "'...";

        /* Notify that loading has started */
        openLayer.events.register("loadstart", openLayer, function() {
            sandbox.request(mapModule, sandbox.getRequestBuilder('ActionStartRequest')(openLayer.id, statusText, true));
        });
        /* Notify that Map is ready */
        openLayer.events.register("loadend", openLayer, function() {
            sandbox.request(mapModule, sandbox.getRequestBuilder('ActionReadyRequest')(openLayer.id, true));
        });
        /* Notify that Map is ready */
        openLayer.events.register("loadcancel", openLayer, function() {
            sandbox.request(mapModule, sandbox.getRequestBuilder('ActionReadyRequest')(openLayer.id, true));
        });
    },
    /**
     * governance
     */

    getName : function() {
        return this._id + "MapModule";
    },
    getSandbox : function() {
        return this._sandbox;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current
     * language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization('MapModule');
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },
    /**
     * Init module
     *
     * @param {Object}
     *            sandbox
     */
    init : function(sandbox) {

        sandbox.printDebug("Initializing map module...#############################################");

        this._sandbox = sandbox;

        /*
         * register events & requesthandlers
         * TODO: should these be in start-method?
         */
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        this.requestHandlers = {
            mapLayerUpdateHandler : Oskari.clazz.create('Oskari.mapframework.mapmodule-plugin' + '.request.MapLayerUpdateRequestHandler', sandbox, this),
            mapMoveRequestHandler : Oskari.clazz.create('Oskari.mapframework.mapmodule-plugin' + '.request.MapMoveRequestHandler', sandbox, this),
            clearHistoryHandler : Oskari.clazz.create('Oskari.mapframework.mapmodule-plugin' + '.controls.ClearHistoryHandler', sandbox, this)
        };
        sandbox.addRequestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
        sandbox.addRequestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);
        sandbox.addRequestHandler('ClearHistoryRequest', this.requestHandlers.clearHistoryHandler);
        /*
         * setup based on opts
         */

        this.createMap();
        // changed to resolutions based map zoom levels
        // -> calculate scales array for backward compatibility
        for(var i = 0; i < this._mapResolutions.length; ++i) {
            var calculatedScale = OpenLayers.Util.getScaleFromResolution(this._mapResolutions[i], 'm');
            calculatedScale = calculatedScale * 10000;
            calculatedScale = Math.round(calculatedScale);
            calculatedScale = calculatedScale / 10000;
            this._mapScales.push(calculatedScale);
        }

        this.createBaseLayer();

        this.addMapControl('navigationHistoryTool', this._navigationHistoryTool);
        this.getMapControl('navigationHistoryTool').activate();

        return this._map;
    },
    getPluginInstances : function() {
        return this._pluginInstances;
    },
    isPluginActivated : function(pluginName) {
        var plugin = this._pluginInstances[this.getName() + pluginName];
        if(plugin) {
            return true;
        }
        return false;
    },
    registerPlugin : function(plugin) {
        var sandbox = this._sandbox;
        plugin.setMapModule(this);
        var pluginName = plugin.getName();
        sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
        plugin.register();
        this._pluginInstances[pluginName] = plugin;

    },
    unregisterPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();
        sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
        plugin.unregister();
        this._pluginInstances[pluginName] = undefined;
        plugin.setMapModule(null);
        delete this._pluginInstances[pluginName];
    },
    startPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();

        sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.startPlugin(sandbox);
    },
    stopPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();

        sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.stopPlugin(sandbox);
    },
    startPlugins : function(sandbox) {
        for(var pluginName in this._pluginInstances) {
            sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            this._pluginInstances[pluginName].startPlugin(sandbox);
        }
    },
    stopPlugins : function(sandbox) {
        for(var pluginName in this._pluginInstances) {
            sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            this._pluginInstances[pluginName].stopPlugin(sandbox);
        }
    },
    getStealth : function() {
        return this._stealth;
    },
    setStealth : function(s) {
        this._stealth = s;
    },
    notifyAll : function(event, retainEvent) {
        // propably not called anymore?
        if(this._stealth) {
            return;
        }

        this._sandbox.notifyAll(event, retainEvent);

    },
    getMap : function() {
        return this._map;
    },
    getMapImpl : function() {
        return this._panel;
    },
    /**
     * @method createMap
     *
     */
    createMap : function() {

        var sandbox = this._sandbox;
        // this is done BEFORE enhancement writes the values to map domain
        // object... so we will move the map to correct location
        // by making a MapMoveRequest in startup
        var lonlat = new OpenLayers.LonLat(0, 0);

        this._map = new OpenLayers.Map({
            controls : [], // new OpenLayers.Control()
            units : 'm',
            maxExtent : new OpenLayers.Bounds(0, 0, 10000000, 10000000),
            //scales : this._mapScales,
            resolutions : this._mapResolutions,
            projection : this._projectionCode,
            isBaseLayer : true,
            center : lonlat,
            theme : null,
            zoom : 0
        });

        return this._map;
    },
    /**
     * @method createBaseLayer
     *
     */
    createBaseLayer : function() {

        var base = new OpenLayers.Layer("BaseLayer", {
            layerId : 0,
            isBaseLayer : true,
            displayInLayerSwitcher : false
        });

        this._map.addLayer(base);
    },
    /**
     * Start moving
     */
    notifyStartMove : function() {
        if(this.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }
        this._sandbox.getMap().setMoving(true);
        var centerX = this._map.getCenter().lon;
        var centerY = this._map.getCenter().lat;
        var event = this._sandbox.getEventBuilder('MapMoveStartEvent')(centerX, centerY);
        this._sandbox.notifyAll(event);
    },
    moveMapToLanLot : function(lonlat, zoomAdjust, pIsDragging) {
        // openlayers has isValidLonLat();
        //console.log('move to');
        if(zoomAdjust) {
            this.adjustZoomLevel(zoomAdjust, true);
        }
        var isDragging = (pIsDragging === true);
        // using panTo BREAKS IE on startup so - do not
        // should we spam events on dragmoves?
        //	      alert("Move to " + lonlat.lon + ", " + lonlat.lat);
        this._map.setCenter(lonlat, this._map.getZoom(), isDragging);

        this._updateDomain();
    },
    zoomIn : function() {
        this.adjustZoomLevel(1);
    },
    zoomOut : function() {
        this.adjustZoomLevel(-1);
    },
    zoomTo : function(zoomLevel) {
        this.setZoomLevel(zoomLevel, false);
    },
    panMapEast : function() {
        var size = this._map.getSize();
        this.panMapByPixels(0.75 * size.w, 0);
    },
    panMapWest : function() {
        var size = this._map.getSize();
        this.panMapByPixels(-0.75 * size.w, 0);
    },
    panMapNorth : function() {
        var size = this._map.getSize();
        this.panMapByPixels(0, -0.75 * size.h);
    },
    panMapSouth : function() {
        var size = this._map.getSize();
        this.panMapByPixels(0, 0.75 * size.h);
    },
    panMapByPixels : function(pX, pY, suppressStart, suppressEnd) {
        // usually by keyboard
        var mapPixels = this._map.getViewPortPxFromLonLat(this._map.getCenter());
        var newXY = new OpenLayers.Pixel(mapPixels.x + pX, mapPixels.y + pY);
        var newCenter = this._map.getLonLatFromViewPortPx(newXY);
        // check that the coordinates are reasonable, otherwise its easy to
        // scroll the map out of view
        if(!this.isValidLonLat(newCenter.lon, newCenter.lat)) {
            // do nothing if not valid
            return;
        }
        this._map.pan(pX, pY);
        this._updateDomain();
        // send note about map change
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    moveMapByPixels : function(pX, pY, suppressStart, suppressEnd) {
        // usually by mouse
        this._map.moveByPx(pX, pY);
        this._updateDomain();
        // send note about map change
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    centerMapByPixels : function(pX, pY, suppressStart, suppressEnd) {
        var newXY = new OpenLayers.Pixel(pX, pY);
        var newCenter = this._map.getLonLatFromViewPortPx(newXY);
        // check that the coordinates are reasonable, otherwise its easy to
        // scrollwheel the map out of view
        if(!this.isValidLonLat(newCenter.lon, newCenter.lat)) {
            // do nothing if not valid
            return;
        }
        this.moveMapToLanLot(newCenter);

        // send note about map change
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    /*
     N: 8 200 000 > 6 250 000
     E: 0 > 1 350 000
     */
    isValidLonLat : function(lon, lat) {
        var isOk = true;
        if(lat < 6250000 || lat > 8200000) {
            isOk = false;
            return isOk;
        }
        if(lon < 0 || lon > 1350000) {
            isOk = false;
        }
        return isOk;
    },
    zoomToExtent : function(bounds, suppressStart, suppressEnd) {
        this._map.zoomToExtent(bounds);
        this._updateDomain();
        // send note about map change
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    adjustZoomLevel : function(amount, suppressEvent) {
        var requestedZoomLevel = this._getNewZoomLevel(amount);

        this._map.zoomTo(requestedZoomLevel);
        this._updateDomain();
        if(suppressEvent !== true) {
            // send note about map change
            this.notifyMoveEnd();
        }
    },
    setZoomLevel : function(newZoomLevel, suppressEvent) {
        //console.log('zoom to ' + requestedZoomLevel);
        if(newZoomLevel < 0 || newZoomLevel > this._map.getNumZoomLevels) {
            newZoomLevel = this._map.getZoom();
        }
        this._map.zoomTo(newZoomLevel);
        this._updateDomain();
        if(suppressEvent !== true) {
            // send note about map change
            this.notifyMoveEnd();
        }
    },
    _getNewZoomLevel : function(adjustment) {
        // TODO: check isNaN?
        var requestedZoomLevel = this._map.getZoom() + adjustment;

        if(requestedZoomLevel >= 0 && requestedZoomLevel <= this._map.getNumZoomLevels()) {
            return requestedZoomLevel;
        }
        // if not in valid bounds, return original
        return this._map.getZoom();
    },
    notifyMoveEnd : function() {
        if(this.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }
        var sandbox = this._sandbox;
        sandbox.getMap().setMoving(false);

        var lonlat = this._map.getCenter();
        this._updateDomain();
        var event = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat.lon, lonlat.lat, this._map.getZoom(), false, this._map.getScale());
        sandbox.notifyAll(event);
        sandbox.doSniffing();
    },
    _updateDomain : function() {

        if(this.getStealth()) {
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
        mapVO.setMarkerVisible(this._hasMarkers());
    },
    /**
     * Calculate layer scales return: calculated mapscales
     */
    calculateLayerScales : function(maxScale, minScale) {
        var layerScales = new Array();

        if(minScale && maxScale) {
            this.layerScales = [];
            for(var i = 0; i < this._mapScales.length; i++) {
                if(minScale >= this._mapScales[i] && maxScale <= this._mapScales[i])
                    layerScales.push(this._mapScales[i]);
            }
        }
        return layerScales;
    },
    /**
     * Calculate closest zoom level
     */
    getClosestZoomLevel : function(maxScale, minScale) {
        var zoomLevel = this._map.getZoom();

        if(!minScale || !maxScale) {
            return zoomLevel;
        }

        var scale = this._map.getScale();

        if(scale < minScale) {
            // zoom out
            //for(var i = this._mapScales.length; i > zoomLevel; i--) {
            for(var i = zoomLevel; i > 0; i--) {
                if(this._mapScales[i] >= minScale) {
                    return i;
                }
            }
        } else if(scale > maxScale) {
            // zoom in
            for(var i = zoomLevel; i < this._mapScales.length; i++) {
                if(this._mapScales[i] <= maxScale) {
                    return i;
                }
            }
        }
        return zoomLevel;
    },
    /***********************************************************
     * Start module
     *
     * @param {Object}
     *            sandbox
     */
    start : function(sandbox) {

        if(this.started) {
            return;
        }

        sandbox.printDebug("Starting " + this.getName());

        /*if(this.getOpt('createMapMoveHandlers')) {
         this.createMapMoveHandlers();
         }*/

        this.startPlugins(sandbox);

        /*
        * to initialize map parameters(width/bbox etc.)
        * correctly:
        */
        // TODO: init map domain object here?

        this.updateCurrentState();

        this.started = true;

    },
    /***********************************************************
     *
     */
    stop : function(sandbox) {

        if(!this.started) {
            return;
        }

        /**
         * Stop any plugins
         *
         *
         */
        this.stopPlugins(sandbox);

        this.started = false;
    },
    /***********************************************************
     * Draw marker on center
     *
     */
    _drawMarker : function() {
        // FIXME: not really sure if markers are supposed to be handled here
        this._removeMarkers();
        var centerMapLonLat = this._map.getCenter();

        var layerMarkers = new OpenLayers.Layer.Markers("Markers");
        this._map.addLayer(layerMarkers);

        var size = new OpenLayers.Size(32, 32);
        var offset = new OpenLayers.Pixel(0, -size.h);

        var icon = new OpenLayers.Icon(Oskari.$().startup.imageLocation + '/resource/icons/paikkamerkinta.png', size, offset);
        var marker = new OpenLayers.Marker(centerMapLonLat, icon);
        layerMarkers.addMarker(marker);
    },
    _removeMarkers : function() {

        var markerLayer = this._map.getLayersByName("Markers");
        if(markerLayer) {
            for(var i = 0; i < markerLayer.length; i++) {
                if(markerLayer[i]) {
                    this._map.removeLayer(markerLayer[i], false);
                }
            }
        }
    },
    _hasMarkers : function() {
        var markerLayer = this._map.getLayersByName("Markers");
        if(markerLayer) {
            for(var i = 0; i < markerLayer.length; i++) {
                if(markerLayer[i] && markerLayer[i].markers && markerLayer[i].markers.length > 0) {
                    return true;
                }
            }
        }
        return false;
    },
    /**
     *
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            //this.afterAfterMapMoveEvent(event);
        },
        'SearchClearedEvent' : function(event) {
            this._removeMarkers();
        }
    },

    /***********************************************************
     * Module onEvent handler
     *
     * @param {Object}
     *            event
     */
    onEvent : function(event) {
        /*
         * var sandbox = this._sandbox;
         *
         * sandbox.printDebug( "MAP-MODULE onEvent " +
         * sandbox.getObjectCreator(event) + " vs. " +
         * this.getName() + " " + event.getName());
         */

        var handler = this.eventHandlers[event.getName()];

        if(!handler)
            return;

        return handler.apply(this, [event]);
    },
    getOLMapLayers : function(layerId) {
        var me = this;
        var sandbox = me._sandbox;

        var layer = sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
            // not found
            return null;
        }
        var lps = this.getLayerPlugins();
        // let the actual layerplugins find the layer since the name depends on
        // type
        for(var p in lps) {
            var layersPlugin = lps[p];
            // find the actual openlayers layers (can be many)
            var layerList = layersPlugin.getOLMapLayers(layer);
            if(layerList) {
                // if found -> return list
                // otherwise continue looping
                return layerList;
            }
        }
        return null;
    },
    /**
     * setup layers from selected layers
     * This is needed if map layers are added before plugins are started.
     * Should be called only on startup, preferrably not even then
     * (workaround for timing issues)
     * If layers are already in map, this adds them twice and they cannot be
     * removed
     * anymore by removemaplayerrequest (it should be sent twice but ui doesn't
     * offer that).
     */
    updateCurrentState : function() {

        var me = this;
        var sandbox = me._sandbox;

        var layers = sandbox.findAllSelectedMapLayers();
        var lps = this.getLayerPlugins();

        for(p in lps) {
            var layersPlugin = lps[p];

            sandbox.printDebug('preselecting ' + p);
            layersPlugin.preselectLayers(layers);
        }

    }
}, {
    'protocol' : ['Oskari.mapframework.module.Module']
});

/** Inheritance */