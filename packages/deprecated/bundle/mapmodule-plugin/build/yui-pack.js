/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 12:23:19 GMT+0300 (Suomen kesäaika)) */ 
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

    /** @static @property {String} _projectionCode SRS projection code, defaults to 'EPSG:3067' */
    this._projectionCode = 'EPSG:3067';
    this._supportedFormats = {};

    this._map = null;

    /** @static @property {Number[]} _mapScales map scales */
    //this._mapScales = [5669294.4, 2834647.2, 1417323.6, 566929.44, 283464.72, 141732.36, 56692.944, 28346.472, 11338.5888, 5669.2944, 2834.6472, 1417.3236, 708.6618];
    // calculated based on resolutions on init
    this._mapScales = [];
    this._mapResolutions = [ 2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25 ];

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
     * Returns JSON presentation of bundles localization data for current language.
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
            mapLayerUpdateHandler : 
                Oskari.clazz.create('Oskari.mapframework.mapmodule-plugin' + 
                                    '.request.MapLayerUpdateRequestHandler', 
                                    sandbox, 
                                    this),
            mapMoveRequestHandler : 
                Oskari.clazz.create('Oskari.mapframework.mapmodule-plugin' + 
                                    '.request.MapMoveRequestHandler', 
                                    sandbox, 
                                    this),
            clearHistoryHandler :
                Oskari.clazz.create('Oskari.mapframework.mapmodule-plugin' + 
                                    '.controls.ClearHistoryHandler', 
                                    sandbox, 
                                    this)
        };
        sandbox.addRequestHandler('MapModulePlugin.MapLayerUpdateRequest', 
                                  this.requestHandlers.mapLayerUpdateHandler);
        sandbox.addRequestHandler('MapMoveRequest',
                                  this.requestHandlers.mapMoveRequestHandler);
        sandbox.addRequestHandler('ClearHistoryRequest',
                                  this.requestHandlers.clearHistoryHandler);
        /*
         * setup based on opts
         */

        this.createMap();
        // changed to resolutions based map zoom levels 
        // -> calculate scales array for backward compatibility
        for(var i = 0; i < this._mapResolutions.length; ++i) {
        	var calculatedScale = OpenLayers.Util.getScaleFromResolution(this._mapResolutions[i] , 'm');
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
            theme: null,
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
        // check that the coordinates are reasonable, otherwise its easy to scroll the map out of view
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
        // check that the coordinates are reasonable, otherwise its easy to scrollwheel the map out of view
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
        if(lat < 6250000 || lat > 8200000 ) {
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
        if (newZoomLevel < 0 ||
            newZoomLevel > this._map.getNumZoomLevels) {
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
	            if(this._mapScales[i] >= minScale ) {
	            	return i;
	            }
	        }
		}
		else if(scale > maxScale){
			// zoom in
	        for(var i = zoomLevel; i < this._mapScales.length; i++) {
	            if(this._mapScales[i] <= maxScale ) {
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
                if (markerLayer[i]) {
                    this._map.removeLayer(markerLayer[i], false);
                }
            }
        }
    },
    _hasMarkers : function() {
        var markerLayer = this._map.getLayersByName("Markers");
        if(markerLayer) {
            for(var i = 0; i < markerLayer.length; i++) {
                if (markerLayer[i] && markerLayer[i].markers
                	&& markerLayer[i].markers.length > 0) {
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
        for(p in lps) {
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
     * If layers are already in map, this adds them twice and they cannot be removed 
     * anymore by removemaplayerrequest (it should be sent twice but ui doesn't offer that).
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

/** Inheritance *//**
 * 
 */
Oskari.clazz
        .define(
                'Oskari.mapframework.ui.module.common.mapmodule.Plugin',
                function() {
                    throw "Oskari.mapframework.ui.module.common.mapmodule.Plugin should not be instantiated";
                },

                {
                    getName : function() {
                        throw "Implement your own";
                    },

                    setMapModule : function(mapModule) {
                        throw "Implement your own";
                    },

                    register : function() {
                        throw "Implement your own";
                    },
                    unregister : function() {
                        throw "Implement your own";
                    },

                    startPlugin : function(sandbox) {
                        throw "Implement your own";
                    },
                    stopPlugin : function(sandbox) {
                        throw "Implement your own";
                    },

                    eventHandlers : {},

                    onEvent : function(event) {
                        return this.eventHandlers[event.getName()].apply(this,
                                [ event ]);
                    }

                });
/**
 * @class Oskari.mapframework.mapmodule.ControlsPlugin
 * Provides tools for measurement/zoombox
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.ControlsPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    /** @static @property __name plugin name */
    __name : 'ControlsPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {

        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        var me = this;
        this.requestHandlers = {
            toolSelectionHandler : Oskari.clazz.create('Oskari.mapframework.mapmodule.ToolSelectionHandler', sandbox, me)
        };
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);

        sandbox.addRequestHandler('ToolSelectionRequest', this.requestHandlers.toolSelectionHandler);

        for(var p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        this.addMapControls();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterDisableMapKeyboardMovementEvent' : function(event) {
            this._keyboardControls.deactivate();
        },
        'AfterEnableMapKeyboardMovementEvent' : function(event) {
            this._keyboardControls.activate();
        },
        'ToolSelectedEvent' : function(event) {
            var tshName = this.requestHandlers.toolSelectionHandler.getName();
            this._sandbox.printDebug("[ControlsPlugin] Get ToolSelectedEvent " + "from '" + event.getOrigin() + "':");
            this._sandbox.printDebug("                 " + event.getToolId());

            if(event.getOrigin() != tshName) {
                this._zoomBoxTool.deactivate();
                this._measureControls.line.deactivate();
                this._measureControls.area.deactivate();
                // this.controlsPlugin._WMSQueryTool = false; //?
                //this.controlsPlugin._panhandTool.activate();
            }
        }
    },
    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /***********************************************************
     * Add necessary controls on the map
     *
     * @param {Oskari.mapframework.sandbox.Sandbox}
     *            sandbox
     */
    addMapControls : function(sandbox) {
        var me = this;
                
        // zoom tool
        OpenLayers.Control.ZoomBox.prototype.draw = function() {
            this.handler = new OpenLayers.Handler.Box(this, {
                done : function(position) {
                    this.zoomBox(position);
                    me.getMapModule().notifyMoveEnd();
                }
            }, {
                keyMask : this.keyMask
            });
        };
        this._zoomBoxTool = new OpenLayers.Control.ZoomBox({
            alwaysZoom : true
        });

        this.getMapModule().addMapControl('zoomBoxTool', this._zoomBoxTool);
        this._zoomBoxTool.deactivate();

        // Map movement/keyboard control
        this._keyboardControls = new OpenLayers.Control.PorttiKeyboard({
            core : this._sandbox._core,
            mapmodule : this.getMapModule()
        });
        this.getMapModule().addMapControl('keyboardControls', this._keyboardControls);
        this.getMapModule().getMapControl('keyboardControls').activate();
        
        // Measure tools
        var optionsLine = {
            handlerOptions : {
                persist : true
            },
            immediate : true
        };
        var optionsPolygon = {
            handlerOptions : {
                persist : true
            },
            immediate : true
        };

        this._measureControls = {
            line : (new OpenLayers.Control.Measure(OpenLayers.Handler.Path, optionsLine)),
            area : (new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, optionsPolygon))
        };

        var me = this;
        function measurementsHandler(event, finished) {
            var sandbox = me._sandbox;
            // var geometry = event.geometry;
            var units = event.units;
            var order = event.order;
            var measure = event.measure;
            var out = measure.toFixed(3) + " " + units;
            /*
            if(order == 1) {
                out += sandbox.getText('mapcontrolsservice_measure_length_title') + ": " + measure.toFixed(3) + " " + units;
            } else {
                out += // "<div style='float:left;'>"
                sandbox.getText('mapcontrolsservice_measure_area_title') + ": " + measure.toFixed(3) + " " + units;
                // + "<sup
                // style='font-size:6px;color:#000000;'>2</sup></div>";
            }
            */
            sandbox.printDebug(out + " " + ( finished ? "FINISHED" : "CONTINUES"));
            sandbox.request(me, sandbox.getRequestBuilder('ShowMapMeasurementRequest')(out));
        };

        for(var key in this._measureControls) {
            var control = this._measureControls[key];
            control.events.on({
                'measure' : function(event) {
                    measurementsHandler(event, true);
                },
                'measurepartial' : function(event) {
                    measurementsHandler(event, false);
                }
            });
        }
        this.getMapModule().addMapControl('measureControls_line', this._measureControls.line);
        this._measureControls.line.deactivate();
        this.getMapModule().addMapControl('measureControls_area', this._measureControls.area);
        this._measureControls.area.deactivate();

        // mouse control
        this._mouseControls = new OpenLayers.Control.PorttiMouse({
            sandbox : this._sandbox,
            mapmodule : this.getMapModule()
        });
        this.getMapModule().addMapControl('mouseControls', this._mouseControls);
        

    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
* full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the
* full text of the license. */

/**
 * Copyright (c) 2011 National Land Survey of Finland.
 */

OpenLayers.Control.PorttiKeyboard = OpenLayers.Class(OpenLayers.Control, {
    autoActivate : true,
    slideFactor : 50, // 75
    core : null,
    constructor : function(config) {
        this.core = config.core;
        this.mapmodule = config.mapmodule;
    },
    draw : function() {
        this.handler = new OpenLayers.Handler.Keyboard(this, {
            "keydown" : this.defaultKeyDown,
            "keyup" : this.defaultKeyUp
        });
    },
    defaultKeyDown : function(evt) {
        switch(evt.keyCode) {
            case OpenLayers.Event.KEY_LEFT:
            	this.mapmodule.panMapByPixels(-this.slideFactor,0, false, true);
                break;
            case OpenLayers.Event.KEY_RIGHT:
            	this.mapmodule.panMapByPixels(this.slideFactor,0, false, true);
                break;
            case OpenLayers.Event.KEY_UP:
            	this.mapmodule.panMapByPixels(0, -this.slideFactor, false, true);
                break;
            case OpenLayers.Event.KEY_DOWN:
            	this.mapmodule.panMapByPixels(0, this.slideFactor, false, true);
                break;
            case 17:
                // CTRL
                this.core.processRequest(this.core.getRequestBuilder('CtrlKeyDownRequest')());
                break;
            case 27:
                // ESC
                this.core.dispatch(this.core.getEventBuilder('EscPressedEvent')());
                break;
            case 33:
                // Page Up. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapNorth();
                break;
            case 34:
                // Page Down. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapSouth();
                break;
            case 35:
                // End. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapEast();
                break;
            case 36:
                // Home. Same in all browsers.
            	this.mapmodule.notifyStartMove();
                this.mapmodule.panMapWest();
                break;
            case 43:
            // +/= (ASCII), keypad + (ASCII, Opera)
            case 61:
            // +/= (Mozilla, Opera, some ASCII)
            case 187:
            // +/= (IE)
            case 107:
                // keypad + (IE, Mozilla)
                this.mapmodule.zoomIn();
                break;
            case 45:
            // -/_ (ASCII, Opera), keypad - (ASCII, Opera)
            case 109:
            // -/_ (Mozilla), keypad - (Mozilla, IE)
            case 189:
            // -/_ (IE)
            case 95:
                // -/_ (some ASCII)
                this.mapmodule.zoomOut();
                break;
        }
    },
    defaultKeyUp : function(evt) {
        switch(evt.keyCode) {
            // CTRL
            case 17:
                this.core.processRequest(this.core.getRequestBuilder('CtrlKeyUpRequest')());
                break;
            case 37:
            case 38:
            case 39:
            case 40:
            case 33:
            case 34:
            case 35:
            case 36:
            case 43:
            case 61:
            case 187:
            case 107:
            case 45:
            case 109:
            case 189:
            case 95:
        		this.mapmodule.notifyMoveEnd();
                //this.core.processRequest(this.core.getRequestBuilder('MapNotMovingRequest')());
                break;
        }
    },
    CLASS_NAME : "OpenLayers.Control.PorttiKeyboard"
});
/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

/* Copyright (c) 2011 National Land Survey of Finland (http://www.nls.fi) */

OpenLayers.Control.PorttiZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoom, {
    zoomStopWidth : 18,
    zoomStopHeight : 11,
    slider : null,
    sliderEvents : null,
    zoombarDiv : null,
    divEvents : null,
    zoomWorldIcon : false,
    panIcons : false,
    forceFixedZoomLevel : false,
    mouseDragStart : null,
    deltaY : null,
    zoomStart : null,
    constructor : function(config) {
        this.sandbox = config.sandbox;
        this.mapModule = config.mapModule;
    },
    destroy : function() {

        this._removeZoomBar();

        this.map.events.un({
            "changebaselayer" : this.redraw,
            scope : this
        });

        OpenLayers.Control.PanZoom.prototype.destroy.apply(this, arguments);
        delete this.mouseDragStart;
        delete this.zoomStart;
    },
    setMap : function(map) {
        OpenLayers.Control.PanZoom.prototype.setMap.apply(this, arguments);
        this.map.events.register("changebaselayer", this, this.redraw);
    },
    redraw : function() {
        if(this.div != null) {
            this.removeButtons();
            this._removeZoomBar();
        }
        this.draw();
    },
    draw : function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];

        var sz = new OpenLayers.Size(18, 18);
        if(this.panIcons) {
            var centered = new OpenLayers.Pixel(px.x + sz.w / 2, px.y);
            var wposition = sz.w;

            if(this.zoomWorldIcon) {
                centered = new OpenLayers.Pixel(px.x + sz.w, px.y);
            }

            this._addButton("panup", "north-mini.png", centered, sz);
            px.y = centered.y + sz.h;
            this._addButton("panleft", "west-mini.png", px, sz);
            if(this.zoomWorldIcon) {
                this._addButton("zoomworld", "zoom-world-mini.png", px.add(sz.w, 0), sz);
                wposition *= 2;
            }
            this._addButton("panright", "east-mini.png", px.add(wposition, 0), sz);
            this._addButton("pandown", "south-mini.png", centered.add(0, sz.h * 2), sz);
            this._addButton("zoomin", "zoom-plus-mini.png", centered.add(0, sz.h * 3 + 5), sz);
            centered = this._addZoomBar(centered.add(0, sz.h * 4 + 5));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
        } else {
            this._addButton("zoomin", "zoom-plus-mini.png", px, sz);
            centered = this._addZoomBar(px.add(0, sz.h));
            this._addButton("zoomout", "zoom-minus-mini.png", centered, sz);
            if(this.zoomWorldIcon) {
                centered = centered.add(0, sz.h + 3);
                this._addButton("zoomworld", "zoom-world-mini.png", centered, sz);
            }
        }
        return this.div;
    },
    buttonDown : function(evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        switch (this.action) {
            case "zoomin" :
                // TODO: Why on earth does this not work?
                // this.mapModule.zoomIn();
                Oskari.$().sandbox.findRegisteredModuleInstance('MainMapModule').zoomIn();
                break;
            case "zoomout" :
                // TODO: Why on earth does this not work?
                // this.mapModule.zoomOut();
                Oskari.$().sandbox.findRegisteredModuleInstance('MainMapModule').zoomOut();
                break;
            }
    },
    _addZoomBar : function(centered) {
        var imgLocation = OpenLayers.Util.getImagesLocation();

        var id = this.id + "_" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id, centered.add(-1, zoomsToEnd * this.zoomStopHeight), new OpenLayers.Size(20, 9), imgLocation + "slider.png", "absolute");
        slider.style.cursor = "move";
        this.slider = slider;

        this.sliderEvents = new OpenLayers.Events(this, slider, null, true, {
            includeXY : true
        });
        this.sliderEvents.on({
            "touchstart" : this.zoomBarDown,
            "touchmove" : this.zoomBarDrag,
            "touchend" : this.zoomBarUp,
            "mousedown" : this.zoomBarDown,
            "mousemove" : this.zoomBarDrag,
            "mouseup" : this.zoomBarUp,
            "dblclick" : this.doubleClick,
            "click" : this.doubleClick
        });

        var sz = new OpenLayers.Size();
        sz.h = this.zoomStopHeight * this.map.getNumZoomLevels();
        sz.w = this.zoomStopWidth;
        var div = null;

        if(OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered, new OpenLayers.Size(sz.w, this.zoomStopHeight), imgLocation + "zoombar.png", "absolute", null, "crop");
            div.style.height = sz.h + "px";
        } else {
            div = OpenLayers.Util.createDiv('OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id, centered, sz, imgLocation + "zoombar.png");
        }
        div.style.cursor = "pointer";
        this.zoombarDiv = div;

        this.divEvents = new OpenLayers.Events(this, div, null, true, {
            includeXY : true
        });
        this.divEvents.on({
            "touchmove" : this.passEventToSlider,
            "mousedown" : this.divClick,
            "mousemove" : this.passEventToSlider,
            "dblclick" : this.doubleClick,
            "click" : this.doubleClick
        });

        this.div.appendChild(div);

        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);

        this.map.events.register("zoomend", this, this.moveZoomBar);
        centered = centered.add(0, this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered;
    },
    _removeZoomBar : function() {
        this.sliderEvents.un({
            "touchmove" : this.zoomBarDrag,
            "mousedown" : this.zoomBarDown,
            "mousemove" : this.zoomBarDrag,
            "mouseup" : this.zoomBarUp,
            "dblclick" : this.doubleClick,
            "click" : this.doubleClick
        });
        this.sliderEvents.destroy();

        this.divEvents.un({
            "touchmove" : this.passEventToSlider,
            "mousedown" : this.divClick,
            "mousemove" : this.passEventToSlider,
            "dblclick" : this.doubleClick,
            "click" : this.doubleClick
        });
        this.divEvents.destroy();

        this.div.removeChild(this.zoombarDiv);
        this.zoombarDiv = null;
        this.div.removeChild(this.slider);
        this.slider = null;

        this.map.events.unregister("zoomend", this, this.moveZoomBar);
    },
    passEventToSlider : function(evt) {
        this.sliderEvents.handleBrowserEvent(evt);
    },
    divClick : function(evt) {
        if(!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        var levels = evt.xy.y / this.zoomStopHeight;
        if(this.forceFixedZoomLevel || !this.map.fractionalZoom) {
            levels = Math.floor(levels);
        }
        var zoom = (this.map.getNumZoomLevels() - 1) - levels;
        zoom = Math.min(Math.max(zoom, 0), this.map.getNumZoomLevels() - 1);
        this.mapModule.zoomTo(zoom);
        OpenLayers.Event.stop(evt);
    },
    zoomBarDown : function(evt) {
        if(!OpenLayers.Event.isLeftClick(evt) && !OpenLayers.Event.isSingleTouch(evt)) {
            return;
        }
        this.map.events.on({
            "touchmove" : this.passEventToSlider,
            "mousemove" : this.passEventToSlider,
            "mouseup" : this.passEventToSlider,
            scope : this
        });
        this.mouseDragStart = evt.xy.clone();
        this.zoomStart = evt.xy.clone();
        this.div.style.cursor = "move";
        // reset the div offsets just in case the div moved
        this.zoombarDiv.offsets = null;
        OpenLayers.Event.stop(evt);
    },
    zoomBarDrag : function(evt) {
        if(this.mouseDragStart != null) {
            var deltaY = this.mouseDragStart.y - evt.xy.y;
            var offsets = OpenLayers.Util.pagePosition(this.zoombarDiv);
            if((evt.clientY - offsets[1]) > 0 && (evt.clientY - offsets[1]) < parseInt(this.zoombarDiv.style.height) - 2) {
                var newTop = parseInt(this.slider.style.top) - deltaY;
                this.slider.style.top = newTop + "px";
                this.mouseDragStart = evt.xy.clone();
            }
            // set cumulative displacement
            this.deltaY = this.zoomStart.y - evt.xy.y;
            OpenLayers.Event.stop(evt);
        }
    },
    zoomBarUp : function(evt) {
        if(!OpenLayers.Event.isLeftClick(evt) && evt.type !== "touchend") {
            return;
        }
        if(this.mouseDragStart) {
            this.div.style.cursor = "";
            this.map.events.un({
                "touchmove" : this.passEventToSlider,
                "mouseup" : this.passEventToSlider,
                "mousemove" : this.passEventToSlider,
                scope : this
            });
            var zoomLevel = this.map.zoom;
            if(!this.forceFixedZoomLevel && this.map.fractionalZoom) {
                zoomLevel += this.deltaY / this.zoomStopHeight;
                zoomLevel = Math.min(Math.max(zoomLevel, 0), this.map.getNumZoomLevels() - 1);
            } else {
                zoomLevel += this.deltaY / this.zoomStopHeight;
                zoomLevel = Math.max(Math.round(zoomLevel), 0);
            }
            this.mapModule.zoomTo(zoomLevel);
            this.mouseDragStart = null;
            this.zoomStart = null;
            this.deltaY = 0;
            OpenLayers.Event.stop(evt);
        }
    },
    moveZoomBar : function() {
        var newTop = ((this.map.getNumZoomLevels() - 1) - this.map.getZoom()) * this.zoomStopHeight + this.startTop + 1;
        this.slider.style.top = newTop + "px";
    },
    CLASS_NAME : "OpenLayers.Control.PorttiZoomBar"
});
OpenLayers.Control.PorttiDragPan = OpenLayers.Class(OpenLayers.Control, {
    type: OpenLayers.Control.TYPE_TOOL,
    panned: false,
    interval: 1,       
    documentDrag: false,
    kinetic: null, 
    enableKinetic: false,
    kineticInterval: 10,


    draw: function() {
        if(this.enableKinetic) {
            var config = {interval: this.kineticInterval};
            if(typeof this.enableKinetic === "object") {
                config = 
                    OpenLayers.Util.extend(config, this.enableKinetic);
            }
            this.kinetic = new OpenLayers.Kinetic(config);
        }
        this.handler = new OpenLayers.Handler.PorttiDrag(this, {
                "move": this.panMap,
                "done": this.panMapDone,
                "down": this.panMapStart
            }, {
                interval: this.interval,
                documentDrag: this.documentDrag
            }
        );
    },

    panMapStart: function() {
        if(this.kinetic) {
            this.kinetic.begin();
        }
    },

    panMap: function(xy) {
        if(this.kinetic) {
            this.kinetic.update(xy);
        }
        this.panned = true;
        this.map.pan(
            this.handler.last.x - xy.x,
            this.handler.last.y - xy.y,
            {dragging: true, animate: false}
        );
    },
    
    panMapDone: function(xy) {
        if(this.panned) {
            var res = null;
            if (this.kinetic) {
                res = this.kinetic.end(xy);
            }
            this.map.pan(
                this.handler.last.x - xy.x,
                this.handler.last.y - xy.y,
                {dragging: !!res, animate: false}
            );
            if (res) {
                var self = this;
                this.kinetic.move(res, function(x, y, end) {
                    self.map.pan(x, y, {dragging: !end, animate: false});
                });
            }
            this.panned = false;
        }
    },

    CLASS_NAME: "OpenLayers.Control.PorttiDragPan"
});
OpenLayers.Handler.PorttiDrag = OpenLayers.Class(OpenLayers.Handler, {
  
    /** 
     * Property: started
     * {Boolean} When a mousedown or touchstart event is received, 
     *   we want to record it, but not set 'dragging' until the mouse 
     *   moves after starting.
     */
    started: false,

    /**
     * Property: stopDown
     * {Boolean} Stop propagation of mousedown events from getting 
     *   to listeners on the same element.  Default is true.
     */
    stopDown: true,

    /** 
     * Property: dragging 
     * {Boolean} 
     */
    dragging: false,

    /**
     * Property: touch
     * {Boolean} When a touchstart event is fired, touch will be true 
     *   and all mouse related listeners will do nothing.
     */
    touch: false,

    /** 
     * Property: last
     * {<OpenLayers.Pixel>} The last pixel location of the drag.
     */
    last: null,

    /** 
     * Property: start
     * {<OpenLayers.Pixel>} The first pixel location of the drag.
     */
    start: null,

    /**
     * Property: lastMoveEvt
     * {Object} The last mousemove event that occurred. Used to
     *   position the map correctly when our "delay drag"
     *   timeout expired.
     */
    lastMoveEvt: null,

    /**
     * Property: oldOnselectstart
     * {Function}
     */
    oldOnselectstart: null,
    
    /**
     * Property: interval
     * {Integer} In order to increase performance, an interval (in 
     *   milliseconds) can be set to reduce the number of drag events 
     *   called. If set, a new drag event will not be set until the 
     *   interval has passed. 
     *   Defaults to 0, meaning no interval. 
     */
    interval: 0,
    
    /**
     * Property: timeoutId
     * {String} The id of the timeout used for the mousedown interval.
     *   This is "private", and should be left alone.
     */
    timeoutId: null,
    
    /**
     * APIProperty: documentDrag
     * {Boolean} If set to true, the handler will also handle mouse 
     *   moves when the cursor has moved out of the map viewport. 
     *   Default is false.
     */
    documentDrag: false,
    
    /**
     * Property: documentEvents
     * {Boolean} Are we currently observing document events?
     */
    documentEvents: null,

    /**
     * Constructor: OpenLayers.Handler.Drag
     * Returns OpenLayers.Handler.Drag
     * 
     * Parameters:
     * control - {<OpenLayers.Control>} The control that is making use of
     *   this handler.  If a handler is being used without a control, 
     *   the handlers setMap method must be overridden to deal properly
     *   with the map.
     * callbacks - {Object} An object containing a single function to be
     *   called when the drag operation is finished. The callback should
     *   expect to recieve a single argument, the pixel location of the
     *   event. Callbacks for 'move' and 'done' are supported. You can
     *   also speficy callbacks for 'down', 'up', and 'out' to respond 
     *   to those events.
     * options - {Object} 
     */
    initialize: function(control, callbacks, options) {
        OpenLayers.Handler.prototype.initialize.apply(this, arguments);
        
        if (this.documentDrag === true) {
            var me = this;
            this._docMove = function(evt) {
                me.mousemove({
                    xy: {x: evt.clientX, y: evt.clientY},
                    element: document
                });
            };
            this._docUp = function(evt) {
                me.mouseup({xy: {x: evt.clientX, y: evt.clientY}});
            };
        }
    },

    
    /**
     * Method: dragstart
     * This private method is factorized from mousedown and touchstart
     * methods
     *
     * Parameters:
     * evt - {Event} The event
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    dragstart: function (evt) {
        var propagate = true;
        this.dragging = false;
        if (this.checkModifiers(evt) &&
               (OpenLayers.Event.isLeftClick(evt) ||
                OpenLayers.Event.isSingleTouch(evt))) {
            this.started = true;
            this.start = evt.xy;
            this.last = evt.xy;
            OpenLayers.Element.addClass(
                this.map.viewPortDiv, "olDragDown"
            );
            this.down(evt);
            this.callback("down", [evt.xy]);

            // OpenLayers.Event.stop(evt);

            if(!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart ?
                    document.onselectstart : OpenLayers.Function.True;
            }
            document.onselectstart = OpenLayers.Function.False;

            propagate = !this.stopDown;
        } else {
            this.started = false;
            this.start = null;
            this.last = null;
        }
        return propagate;
    },

    /**
     * Method: dragmove
     * This private method is factorized from mousemove and touchmove
     * methods
     *
     * Parameters:
     * evt - {Event} The event
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    dragmove: function (evt) {
        this.lastMoveEvt = evt;
        if (this.started && 
            !this.timeoutId && 
            (evt.xy.x != this.last.x || 
             evt.xy.y != this.last.y)) {
            if(this.documentDrag === true && this.documentEvents) {
                if(evt.element === document) {
                    this.adjustXY(evt);
                    // do setEvent manually because the documentEvents
                    // are not registered with the map
                    this.setEvent(evt);
                } else {
                    this.removeDocumentEvents();
                }
            }
            if (this.interval > 0) {
                this.timeoutId = setTimeout(
                    OpenLayers.Function.bind(this.removeTimeout, this),
                    this.interval);
            }
            this.dragging = true;

            this.move(evt);
            this.callback("move", [evt.xy]);
            if(!this.oldOnselectstart) {
                this.oldOnselectstart = document.onselectstart;
                document.onselectstart = OpenLayers.Function.False;
            }
            this.last = evt.xy;
        }
        return true;
    },

    /**
     * Method: dragend
     * This private method is factorized from mouseup and touchend
     * methods
     *
     * Parameters:
     * evt - {Event} The event
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    dragend: function (evt) {
        if (this.started) {
            if(this.documentDrag === true && this.documentEvents) {
                this.adjustXY(evt);
                this.removeDocumentEvents();
            }
            var dragged = (this.start != this.last);
            this.started = false;
            this.dragging = false;
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, "olDragDown"
            );
            this.up(evt);
            this.callback("up", [evt.xy]);
            if(dragged) {
                this.callback("done", [evt.xy]);
            }
            document.onselectstart = this.oldOnselectstart;
        }
        return true;
    },

    /**
     * The four methods below (down, move, up, and out) are used by
     * subclasses to do their own processing related to these mouse
     * events.
     */

    /**
     * Method: down
     * This method is called during the handling of the mouse down event.
     *     Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse down event
     */
    down: function(evt) {
    },

    /**
     * Method: move
     * This method is called during the handling of the mouse move event.
     * Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse move event
     *
     */
    move: function(evt) {
    },

    /**
     * Method: up
     * This method is called during the handling of the mouse up event.
     * Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse up event
     */
    up: function(evt) {
    },

    /**
     * Method: out
     * This method is called during the handling of the mouse out event.
     * Subclasses can do their own processing here.
     *
     * Parameters:
     * evt - {Event} The mouse out event
     */
    out: function(evt) {
    },

    /**
     * The methods below are part of the magic of event handling. 
     * Because they are named like browser events, they are registered 
     * as listeners for the events they represent.
     */

    /**
     * Method: mousedown
     * Handle mousedown events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mousedown: function(evt) {
        return this.dragstart(evt);
    },

    /**
     * Method: touchstart
     * Handle touchstart events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchstart: function(evt) {
        if (!this.touch) {
            this.touch = true;
            // unregister mouse listeners
            this.map.events.un({
                mousedown: this.mousedown,
                mouseup: this.mouseup,
                mousemove: this.mousemove,
                click: this.click,
                scope: this
            });
        }
        return this.dragstart(evt);
    },

    /**
     * Method: mousemove
     * Handle mousemove events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mousemove: function(evt) {
        return this.dragmove(evt);
    },

    /**
     * Method: touchmove
     * Handle touchmove events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchmove: function(evt) {
        return this.dragmove(evt);
    },

    /**
     * Method: removeTimeout
     * Private. Called by mousemove() to remove the drag timeout.
     */
    removeTimeout: function() {
        this.timeoutId = null;
        // if timeout expires while we're still dragging (mouseup
        // hasn't occurred) then call mousemove to move to the
        // correct position
        if(this.dragging) {
            this.mousemove(this.lastMoveEvt);
        }
    },

    /**
     * Method: mouseup
     * Handle mouseup events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mouseup: function(evt) {
        return this.dragend(evt);
    },

    /**
     * Method: touchend
     * Handle touchend events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    touchend: function(evt) {
        // override evt.xy with last position since touchend does 
        // not have any touch position
        evt.xy = this.last;
        return this.dragend(evt);
    },

    /**
     * Method: mouseout
     * Handle mouseout events
     *
     * Parameters:
     * evt - {Event}
     *
     * Returns:
     * {Boolean} Let the event propagate.
     */
    mouseout: function (evt) {
        if (this.started && OpenLayers.Util.mouseLeft(evt, this.map.eventsDiv)) {
            if(this.documentDrag === true) {
                this.addDocumentEvents();
            } else {
                var dragged = (this.start != this.last);
                this.started = false; 
                this.dragging = false;
                OpenLayers.Element.removeClass(
                    this.map.viewPortDiv, "olDragDown"
                );
                this.out(evt);
                this.callback("out", []);
                if(dragged) {
                    this.callback("done", [evt.xy]);
                }
                if(document.onselectstart) {
                    document.onselectstart = this.oldOnselectstart;
                }
            }
        }
        return true;
    },

    /**
     * Method: click
     * The drag handler captures the click event.  If something else
     * registers for clicks on the same element, its listener will 
     * not be called after a drag.
     * 
     * Parameters: 
     * evt - {Event} 
     * 
     * Returns:
     * {Boolean} Let the event propagate.
     */
    click: function (evt) {
        // let the click event propagate only if the mouse moved
        return (this.start == this.last);
    },

    /**
     * Method: activate
     * Activate the handler.
     * 
     * Returns:
     * {Boolean} The handler was successfully activated.
     */
    activate: function() {
        var activated = false;
        if(OpenLayers.Handler.prototype.activate.apply(this, arguments)) {
            this.dragging = false;
            activated = true;
        }
        return activated;
    },

    /**
     * Method: deactivate 
     * Deactivate the handler.
     * 
     * Returns:
     * {Boolean} The handler was successfully deactivated.
     */
    deactivate: function() {
        var deactivated = false;
        if(OpenLayers.Handler
            .prototype.deactivate.apply(this, arguments)) {
            this.touch = false;
            this.started = false;
            this.dragging = false;
            this.start = null;
            this.last = null;
            deactivated = true;
            OpenLayers.Element.removeClass(
                this.map.viewPortDiv, "olDragDown"
            );
        }
        return deactivated;
    },
    
    /**
     * Method: adjustXY
     * Converts event coordinates that are relative to the document 
     * body to ones that are relative to the map viewport. The latter 
     * is the default in OpenLayers.
     * 
     * Parameters:
     * evt - {Object}
     */
    adjustXY: function(evt) {
        var pos = OpenLayers.Util.pagePosition(this.map.viewPortDiv);
        evt.xy.x -= pos[0];
        evt.xy.y -= pos[1];
    },
    
    /**
     * Method: addDocumentEvents
     * Start observing document events when documentDrag is true and 
     * the mouse cursor leaves the map viewport while dragging.
     */
    addDocumentEvents: function() {
        OpenLayers.Element.addClass(document.body, "olDragDown");
        this.documentEvents = true;
        OpenLayers.Event.observe(document, "mousemove", this._docMove);
        OpenLayers.Event.observe(document, "mouseup", this._docUp);
    },
    
    /**
     * Method: removeDocumentEvents
     * Stops observing document events when documentDrag is true and 
     * the mouse cursor re-enters the map viewport while dragging.
     */
    removeDocumentEvents: function() {
        OpenLayers.Element.removeClass(document.body, "olDragDown");
        this.documentEvents = false;
        OpenLayers.Event.stopObserving(document, 
                                       "mousemove", 
                                       this._docMove);
        OpenLayers.Event.stopObserving(document, 
                                       "mouseup", 
                                       this._docUp);
    },

    CLASS_NAME: "OpenLayers.Handler.PorttiDrag"
});
/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for       * full list of contributors). Published under the Clear BSD license.
* See http://svn.openlayers.org/trunk/openlayers/license.txt for the            * full text of the license. */

/**
 * Copyright (c) 2011 National Land Survey of Finland.
 */
OpenLayers.Control.PorttiMouse = OpenLayers.Class(OpenLayers.Control, {
    performedDrag : false,
    wheelObserver : null,
    _hoverEvent : null,
    name : 'PorttiMouse',
    events : new OpenLayers.Events(),
    constructor : function(config) {
        this.sandbox = config.sandbox;
        this.mapmodule = config.mapmodule;
    },
    isReallyLeftClick : function(evt) {
        var isLeftClick = OpenLayers.Event.isLeftClick(evt);
        if(isLeftClick === false) {
            return false;
        }
        if(isLeftClick === true) {
            return true;
        }
        if(isLeftClick != 0) {
            return false;
        }
        return true;
    },
    /*
    getName : function() {
        // this.sandbox.printDebug("[PorttiMouse] getName: " + this.name);
        return this.name;
    },
    init : function(sandbox) {
        // this.sandbox.printDebug("[PorttiMouse] init called.");
    }, */
    initialize : function() {
        OpenLayers.Control.prototype.initialize.apply(this, arguments);
    },
    destroy : function() {
        //this.sandbox.unregister(this);
        if(this.handler) {
            this.handler.destroy();
        }
        this.handler = null;

        this.map.events.un({
            "click" : this.defaultClick,
            "dblclick" : this.defaultDblClick,
            "mousedown" : this.defaultMouseDown,
            "mouseup" : this.defaultMouseUp,
            "mousemove" : this.defaultMouseMove,
            "mouseout" : this.defaultMouseOut,
            scope : this
        });

        // unregister mousewheel events specifically on the window and document
        OpenLayers.Event.stopObserving(window, "DOMMouseScroll", this.wheelObserver);
        OpenLayers.Event.stopObserving(window, "mousewheel", this.wheelObserver);
        OpenLayers.Event.stopObserving(document, "mousewheel", this.wheelObserver);
        this.wheelObserver = null;

        OpenLayers.Control.prototype.destroy.apply(this, arguments);
    },
    draw : function() {
       this.map.events.on({
            "click" : this.defaultClick,
            "dblclick" : this.defaultDblClick,
            "mousedown" : this.defaultMouseDown,
            "mouseup" : this.defaultMouseUp,
            "mousemove" : this.defaultMouseMove,
            "mouseout" : this.defaultMouseOut,
            scope : this
        });

        this.registerWheelEvents();

    },
    registerWheelEvents : function() {
        this.wheelObserver = OpenLayers.Function.bindAsEventListener(this.onWheelEvent, this);
        // register mousewheel events specifically on the window and document
        OpenLayers.Event.observe(window, "DOMMouseScroll", this.wheelObserver);
        OpenLayers.Event.observe(window, "mousewheel", this.wheelObserver);
        OpenLayers.Event.observe(document, "mousewheel", this.wheelObserver);
    },
    defaultClick : function(evt) {
        if(!this.isReallyLeftClick(evt)) {
            return;
        }
        var notAfterDrag = !this.performedDrag;
        this.performedDrag = false;
        if(notAfterDrag) {
            // moved to mouseup
            // this.sandbox.request(this,
            // this.sandbox.getRequestBuilder('MapModulePlugin.MapClickRequest')
            // (this.map.getLonLatFromViewPortPx(evt.xy),
            // evt.xy.x, evt.xy.y));
        }
        return notAfterDrag;
    },
    defaultDblClick : function(evt) {
        this.mapmodule.centerMapByPixels(evt.xy.x, evt.xy.y, true, true);
        this.mapmodule.zoomIn();
        // OpenLayers.Event.stop(evt);
        return false;
    },
    defaultMouseDown : function(evt) {
        if(!this.isReallyLeftClick(evt)) {
            return;
        }
        this.mouseDragStart = evt.xy.clone();
        this.performedDrag = false;
        if(evt.shiftKey) {
            this.map.div.style.cursor = "crosshair";
            this.zoomBox = OpenLayers.Util.createDiv('zoomBox', this.mouseDragStart, null, null, "absolute", "2px solid red");
            this.zoomBox.style.backgroundColor = "white";
            this.zoomBox.style.filter = "alpha(opacity=50)";
            // IE
            this.zoomBox.style.opacity = "0.50";
            this.zoomBox.style.fontSize = "1px";
            this.zoomBox.style.zIndex = this.map.Z_INDEX_BASE["Popup"] - 1;
            this.map.eventsDiv.appendChild(this.zoomBox);
        }

        document.onselectstart = OpenLayers.Function.False;

        //this.sandbox.request(this,
        // this.sandbox.getRequestBuilder('MapMoveStartRequest')());
    },
    defaultMouseMove : function(evt) {
        // record the mouse position, used in onWheelEvent
        this.mousePosition = evt.xy.clone();

        if(this.mouseDragStart != null) {
            if(this.zoomBox) {
                var deltaX = Math.abs(this.mouseDragStart.x - evt.xy.x);
                var deltaY = Math.abs(this.mouseDragStart.y - evt.xy.y);
                this.zoomBox.style.width = Math.max(1, deltaX) + "px";
                this.zoomBox.style.height = Math.max(1, deltaY) + "px";
                if(evt.xy.x < this.mouseDragStart.x) {
                    this.zoomBox.style.left = evt.xy.x + "px";
                }
                if(evt.xy.y < this.mouseDragStart.y) {
                    this.zoomBox.style.top = evt.xy.y + "px";
                }
            } else {
                if(this.performedDrag === false) {
                    // send event on first move after mouse down
                    this.mapmodule.notifyStartMove();
                }
                var deltaX = this.mouseDragStart.x - evt.xy.x;
                var deltaY = this.mouseDragStart.y - evt.xy.y;
                this.mapmodule.moveMapByPixels(deltaX, deltaY, true, true);
                this.mouseDragStart = evt.xy.clone();
                this.map.div.style.cursor = "move";
            }
            this.performedDrag = true;
        } else {
            this.notifyHover(evt);
        }
    },
    defaultMouseUp : function(evt) {
        if(!this.isReallyLeftClick(evt)) {
            return;
        }
        if(this.zoomBox) {
            this.zoomBoxEnd(evt);
        } else {
            if(this.performedDrag) {
                //this.mapmodule.moveMapToLanLot(this.map.center);
                //this.mapmodule.notifyMoveEnd();
                // FIXME: This is an ugly hack to update history...
                var nh = this.mapmodule._navigationHistoryTool;
                var state = nh.getState();
                nh.previousStack.unshift(state);
                if(nh.previousStack.length > 1) {
                    nh.onPreviousChange(nh.previousStack[1], nh.previousStack.length - 1);
                }
                if(nh.previousStack.length > (nh.limit + 1)) {
                    nh.previousStack.pop();
                }
                if(nh.nextStack.length > 0) {
                    nh.nextStack = [];
                    nh.onNextChange(null, 0);
                }
                //this.mapmodule.adjustZoomLevel(0, false);
                this.mapmodule.notifyMoveEnd();
            } else {
                // Moved from defaultclick
                var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);
                var builder = this.sandbox.getEventBuilder('MapClickedEvent');
                var evt = builder(lonlat, evt.xy.x, evt.xy.y);
                this.sandbox.notifyAll(evt, true);
            }
        }
        document.onselectstart = null;
        this.mouseDragStart = null;
        this.map.div.style.cursor = "";
    },
    defaultMouseOut : function(evt) {
        if(this.mouseDragStart != null && OpenLayers.Util.mouseLeft(evt, this.map.eventsDiv)) {
            if(this.zoomBox) {
                this.removeZoomBox();
            }
            // send event that dragging has stopped
            //this.mapmodule.moveMapToLanLot(this.map.center);
            this.mapmodule.notifyMoveEnd();
            this.mouseDragStart = null;
            this.map.div.style.cursor = "";
        }
    },
    defaultWheelUp : function(evt) {
        // center map to mouse location
        this.mapmodule.centerMapByPixels(evt.xy.x, evt.xy.y, true, true);
        // zoom
        this.mapmodule.zoomIn();
    },
    defaultWheelDown : function(evt) {
        // center map to mouse location
        this.mapmodule.centerMapByPixels(evt.xy.x, evt.xy.y, true, true);
        // zoom
        this.mapmodule.zoomOut();
    },
    zoomBoxEnd : function(evt) {
        if(this.mouseDragStart != null) {
            if(Math.abs(this.mouseDragStart.x - evt.xy.x) > 5 || Math.abs(this.mouseDragStart.y - evt.xy.y) > 5) {
                // TODO: refactor map references so that we only pass pixels to
                // mapmodule?
                var start = this.map.getLonLatFromViewPortPx(this.mouseDragStart);
                var end = this.map.getLonLatFromViewPortPx(evt.xy);
                var top = Math.max(start.lat, end.lat);
                var bottom = Math.min(start.lat, end.lat);
                var left = Math.min(start.lon, end.lon);
                var right = Math.max(start.lon, end.lon);
                var bounds = new OpenLayers.Bounds(left, bottom, right, top);
                this.mapmodule.zoomToExtent(bounds, true);
            } else {
                this.mapmodule.centerMapByPixels(evt.xy.x, evt.xy.y, true, true);
                this.mapmodule.zoomIn();
            }
            this.removeZoomBox();
        }
    },
    removeZoomBox : function() {
        this.map.eventsDiv.removeChild(this.zoomBox);
        this.zoomBox = null;
    },
    notifyHover : function(evt) {
        if(this.mapmodule.getStealth()) {
            // ignore if in "stealth mode"
            return;
        }

        if(!this._hoverEvent) {
            this._hoverEvent = this.sandbox.getEventBuilder("MouseHoverEvent")();
        }
        var lonlat = this.map.getLonLatFromViewPortPx(evt.xy);

        this._hoverEvent.set(lonlat.lon, lonlat.lat);

        this.sandbox.notifyAll(this._hoverEvent, true);
    },
    /**
     *  Mouse ScrollWheel code thanks to
     * http://adomas.org/javascript-mouse-wheel/
     */
    onWheelEvent : function(e) {
        // first determine whether or not the wheeling was inside the map
        var inMap = false;
        var elem = OpenLayers.Event.element(e);
        while(elem != null) {
            if(this.map && elem == this.map.div) {
                inMap = true;
                break;
            }
            // check if we mousewheel over a popup
            if(elem.className == 'olPopup') {
            	inMap = false;
            	break;
            }
            elem = elem.parentNode;
        }

        if(inMap) {

            var delta = 0;
            if(!e) {
                e = window.event;
            }
            if(e.wheelDelta) {
                delta = e.wheelDelta / 120;
                if(window.opera && window.opera.version() < 9.2) {
                    delta = -delta;
                }
            } else if(e.detail) {
                delta = -e.detail / 3;
            }
            if(delta) {
                // add the mouse position to the event because mozilla has a bug
                // with clientX and clientY
                // (see https://bugzilla.mozilla.org/show_bug.cgi?id=352179)
                // getLonLatFromViewPortPx(e) returns wrong values
                e.xy = this.mousePosition;
                if(delta < 0) {
                    this.defaultWheelDown(e);
                } else {
                    this.defaultWheelUp(e);
                }
            }
            // only wheel the map, not the window
            OpenLayers.Event.stop(e);
        }
    },
    CLASS_NAME : "OpenLayers.Control.PorttiMouse"
});
/**
 * @class Oskari.mapframework.request.common.ShowMapMeasurementRequest
 *
 * Requests for the given value to be shown in UI.
 *
 * TODO: This could and propably should be refactored into a common show message
 * request since it could be used to show any message/this is actually not
 * measure tool specific.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */

Oskari.clazz.define('Oskari.mapframework.request.common.ShowMapMeasurementRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            value message to be shown
 */
function(value) {
    this._creator = null;
    this._value = value;
}, {
    /** @static @property __name request name */
    __name : "ShowMapMeasurementRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getValue
     * @return {String} value
     */
    getValue : function() {
        return this._value;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});

/* Inheritance *//* Copyright (c) 2006-2010 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Control.js
 * @requires OpenLayers/Handler/Click.js
 * @requires OpenLayers/Handler/Hover.js
 * @requires OpenLayers/Request.js
 */

/**
 * @class OpenLayers.Control.GetInfoAdapter
 * Class: OpenLayers.Control.WMSGetFeatureInfo The WMSGetFeatureInfo control
 * uses a WMS query to get information about a point on the map. The information
 * may be in a display-friendly format such as HTML, or a machine-friendly
 * format such as GML, depending on the server's capabilities and the client's
 * configuration. This control handles click or hover events, attempts to parse
 * the results using an OpenLayers.Format, and fires a 'getfeatureinfo' event
 * with the click position, the raw body of the response, and an array of
 * features if it successfully read the response.
 * 
 * Inherits from: - <OpenLayers.Control>
 */
Oskari.$("OpenLayers.Control.GetInfoAdapter",OpenLayers.Class(OpenLayers.Control, {

   /**
	 * APIProperty: hover {Boolean} Send GetFeatureInfo requests when mouse
	 * stops moving. Default is false.
	 */
    hover: false,
    

    /**
	 * APIProperty: drillDown {Boolean} Drill down over all WMS layers in the
	 * map. When using drillDown mode, hover is not possible, and an infoFormat
	 * that returns parseable features is required. Default is false.
	 */
    drillDown: false,

    /**
	 * APIProperty: maxFeatures {Integer} Maximum number of features to return
	 * from a WMS query. This sets the feature_count parameter on WMS
	 * GetFeatureInfo requests.
	 */
    maxFeatures: 10,

    /**
	 * APIProperty: clickCallback {String} The click callback to register in the {<OpenLayers.Handler.Click>}
	 * object created when the hover option is set to false. Default is "click".
	 */
    clickCallback: "click",
    
    /**
	 * APIProperty: handlerOptions {Object} Additional options for the handlers
	 * used by this control, e.g. (start code) { "click": {delay: 100}, "hover":
	 * {delay: 300} } (end)
	 */
    handlerOptions: null,
    
    /**
	 * Property: handler {Object} Reference to the <OpenLayers.Handler> for this
	 * control
	 */
    handler: null,
    
    /**
	 * @property EVENT_TYPES
	 * @static
	 * 
	 * Supported event types (in addition to those from <OpenLayers.Control>):
	 * beforegetfeatureinfo - Triggered before the request is sent. The event
	 * object has an *xy* property with the position of the mouse click or hover
	 * event that triggers the request. nogetfeatureinfo - no queryable layers
	 * were found. getfeatureinfo - Triggered when a GetFeatureInfo response is
	 * received. The event object has a *text* property with the body of the
	 * response (String), a *features* property with an array of the parsed
	 * features, an *xy* property with the position of the mouse click or hover
	 * event that triggered the request, and a *request* property with the
	 * request itself. If drillDown is set to true and multiple requests were
	 * issued to collect feature info from all layers, *text* and *request* will
	 * only contain the response body and request object of the last request.
	 */
    EVENT_TYPES: ["beforegetfeatureinfo", "nogetfeatureinfo", "getfeatureinfo"],

    /**
	 * Constructor: <OpenLayers.Control.WMSGetFeatureInfo>
	 * 
	 * Parameters: options - {Object}
	 */
    initialize: function(options) {
	
	
        // concatenate events specific to vector with those from the base
        this.EVENT_TYPES =
            //OpenLayers.Control.WMSGetFeatureInfo.prototype.EVENT_TYPES.concat(
            OpenLayers.Control.prototype.EVENT_TYPES
        //)
            ;

        options = options || {};
		this.callback = options.callback ;
		this.hoverCallback = options.hoverCallback ;
        
        options.handlerOptions = options.handlerOptions || {};

        OpenLayers.Control.prototype.initialize.apply(this, [options]);
        
        
        if(this.drillDown === true) {
            this.hover = false;
        }

        if(this.hover) {
            this.handler = new OpenLayers.Handler.Hover(
                   this, {
                       'move': this.cancelHover,
                       'pause': this.getInfoForHover
                   },
                   OpenLayers.Util.extend(this.handlerOptions.hover || {}, {
                       'delay': 250
                   }));
        } else {
            var callbacks = {};
            callbacks[this.clickCallback] = this.getInfoForClick;
            this.handler = new OpenLayers.Handler.Click(
                this, callbacks, this.handlerOptions.click || {});
        }
    },

    /**
	 * Method: activate Activates the control.
	 * 
	 * Returns: {Boolean} The control was effectively activated.
	 */
    activate: function () {
        if (!this.active) {
            this.handler.activate();
        }
        return OpenLayers.Control.prototype.activate.apply(
            this, arguments
        );
    },

    /**
	 * Method: deactivate Deactivates the control.
	 * 
	 * Returns: {Boolean} The control was effectively deactivated.
	 */
    deactivate: function () {
        return OpenLayers.Control.prototype.deactivate.apply(
            this, arguments
        );
    },
    
    /**
	 * Method: getInfoForClick Called on click
	 * 
	 * Parameters: evt - {<OpenLayers.Event>}
	 */
    getInfoForClick: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        // Set the cursor to "wait" to tell the user we're working on their
        // click.
        OpenLayers.Element.addClass(this.map.viewPortDiv, "olCursorWait");
        this.request(evt.xy, {});
    },
   
    /**
	 * Method: getInfoForHover Pause callback for the hover handler
	 * 
	 * Parameters: evt - {Object}
	 */
    getInfoForHover: function(evt) {
        this.events.triggerEvent("beforegetfeatureinfo", {xy: evt.xy});
        this.request(evt.xy, {hover: true});
    },

    /**
	 * Method: cancelHover Cancel callback for the hover handler
	 */
    cancelHover: function() {
    },

    /**
	 * Method: request Sends a GetFeatureInfo request to the WMS
	 * 
	 * Parameters: clickPosition - {<OpenLayers.Pixel>} The position on the map
	 * where the mouse event occurred. options - {Object} additional options for
	 * this method.
	 * 
	 * Valid options: - *hover* {Boolean} true if we do the request for the
	 * hover handler
	 */
    request: function(clickPosition, options) {
      
        OpenLayers.Element.removeClass(this.map.viewPortDiv, "olCursorWait");
        
        
        var loc = this.map.getLonLatFromViewPortPx(clickPosition); 
        /*
		 * 
		 */
        if(options.hover&&this.hoverCallback)
        	this.hoverCallback(loc,clickPosition,options);
        else if( this.callback )
        	this.callback(loc,clickPosition,options);
        
    },
    
    

    /**
     * @property {String} CLASS_NAME
     * @static  
     */
    CLASS_NAME: "OpenLayers.Control.GetInfoAdapter"
}));
Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.getinfo.GetFeatureInfoHandler', 
                    function(sandbox, getInfoPlugin) {
    this.getInfoPlugin = getInfoPlugin;
    this.sandbox = sandbox;
}, {
    __name : 'GetFeatureInfoHandler',
    getName : function() {
        return this.__name;
    },
    init : function(sandbox) {
    },
    /**
     * @deprecated not used anywhere?
     */
    _getWmsReqParams : function(request, layer) {
    	
    	var map = this.sandbox.getMap();
    	var width = request.getMapWidth();
    	if(!width) {
    		width = map.getWidth();
    	}
    	var height = request.getMapHeight();
    	if(!height) {
    		height = map.getHeight();
    	}
        return 
            'REQUEST=GetFeatureInfo' + 
            '&EXCEPTIONS=application/vnd.ogc.se_xml' + 
            '&SRS=' + this._getSRS(request) + 
            '&VERSION=1.1.1' + 
            '&BBOX=' + this._getBBString(request) + 
            '&X=' + request.getX() + 
            '&Y=' + request.getY() + 
            '&INFO_FORMAT=' + layer.getQueryFormat() + 
            '&QUERY_LAYERS=' + layer.getWmsName() + 
            '&WIDTH=' + width + 
            '&HEIGHT=' + height + 
            '&FEATURE_COUNT=1' + 
            '&FORMAT=image/png' + 
            '&SERVICE=WMS' + 
            '&STYLES=' + layer.getCurrentStyle().getName() + 
            '&LAYERS=' + layer.getWmsName();
    },
    _getWmtsReqParams : function(request, layer) {
    	
        var openLayerList = this.getInfoPlugin._map.getLayersByName('layer_' + layer.getId());
        
     	
        var lonlat = new OpenLayers.LonLat(request.getLon(), request.getLat());
        var tileInfo = openLayerList[0].getTileInfo(lonlat);
        
        
       var params =
       		openLayerList[0].url + '?' +
        	'service=WMTS' + 
            '&request=GetFeatureInfo' + 
            '&version=' + openLayerList[0].version + 
            '&layer=' + openLayerList[0].layer + 
            '&style=' + openLayerList[0].style +
            '&format=text/xml' +
            '&TileMatrixSet=' + openLayerList[0].matrixSet + 
            '&TileMatrix=' + openLayerList[0].getMatrix().identifier + 
            '&TileCol=' + tileInfo.col +
            '&TileRow=' + tileInfo.row +
            '&I=' + tileInfo.i +
            '&J=' + tileInfo.j +
            '&InfoFormat=text/xml';
        
        return params;	    
    },
    _getBBString : function(request) {
    	var extent = request.getBoundingBox();
    	if(!extent) {
    		extent = this.getInfoPlugin.getMapModule().getMap().getExtent();
    	}
        return  extent.left + ',' + 
	            extent.bottom + ',' + 
	            extent.right + ',' + 
	            extent.top;
    },
    _getSRS : function(request) {
    	var srs = request.getSRS();
    	if(!srs) {
    		srs = 'EPSG:3067';
    	}
    	return srs;
    },
    _notifyNotSupported : function(layerName, request) {
        var msgKey = "rightpanel_wms_getfeatureinfo_not_supported_txt";
        var msg = this.sandbox.getText(msgKey) + ": " + layerName + ".";
        var eBuilder = this.sandbox.getEventBuilder('AfterAppendFeatureInfoEvent');
        var e = eBuilder(layerName, msg);
        this.sandbox.copyObjectCreatorToFrom(e, request);
        this.sandbox.notifyAll(e);
    },
    handleRequest : function(core, request) {
        var reqLayers = request.getMapLayers();
        var numReqLayers = reqLayers.length;
        var wfsSelected = (numReqLayers > 0) && reqLayers[0].isLayerOfType('WFS');

        // We're only interested in WMS & WMTS
        var interested = !wfsSelected && (numReqLayers > 0);
        var eBuilder = this.sandbox.getEventBuilder('AfterGetFeatureInfoEvent');
        var e = eBuilder(interested, wfsSelected);
        this.sandbox.copyObjectCreatorToFrom(e, request);
        this.sandbox.notifyAll(e, true);
        if(!interested) {
            return;
        }
        var me = this;
		
        var ajaxCallback = function(name, format) {
            this.name = name;
            this.format = format;
            this.success = function(response) {
            	var msg = "";
                if(this.format === 'application/vnd.ogc.gml' || 
                   this.format === 'application/gnd_ogc.se_xml' || 
                   this.format === 'application/vnd.ogc.wms_xml' || 
                   this.format === 'text/xml') {
                    msg = response.responseText.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                } else if(response.responseText === '') {
                    msg = me.sandbox.getText('mapcontrolsservice_not_found_wms_feature_info');
                } else {
                    msg = response.responseText;
                }
                var eBuilder = me.sandbox.getEventBuilder('AfterAppendFeatureInfoEvent');
                var e = eBuilder(name, msg);
                me.sandbox.copyObjectCreatorToFrom(e, request);
                me.sandbox.notifyAll(e, true);
            };
            this.failure = function(response) {
                var eBuilder = me.sandbox.getEventBuilder('AfterAppendFeatureInfoEvent');
                var e = eBuilder(name, response.responseText);
                me.sandbox.copyObjectCreatorToFrom(e, request);
                me.sandbox.notifyAll(e, true);
            };
        };
    	
    	var map = this.sandbox.getMap();
        for(var i = 0; i < numReqLayers; i++) {
            // TODO: move this away from core
            this.sandbox._core.actionInProgressGetFeatureInfo();
            var layer = request.getMapLayers()[i];
            var layerName = layer.getName();
            var format = layer.getQueryFormat();

            var hasFormat = ((format !== null) && (format !== ""));
            if(!layer.getQueryable() || layer.isLayerOfType('WFS') || !hasFormat) {
                this._notifyNotSupported(layerName, request);
                continue;
            }
            
            var url = "";

			if(url.indexOf('?') < 0) {
                url = url + '?';
            }
            if (layer.isLayerOfType('WMTS')) {
                url = this._getWmtsReqParams(request, layer);
            } else if (layer.isLayerOfType('WMS')) {
            	
		    	var width = request.getMapWidth();
		    	if(!width) {
		    		width = map.getWidth();
		    	}
		    	var height = request.getMapHeight();
		    	if(!height) {
		    		height = map.getHeight();
		    	}
                url = startup.globalMapAjaxUrl + "&action_route=GetFeatureInfoWMS"+
                '&REQUEST=GetFeatureInfo' + 
                '&layerId=' + layer.getId() + 
	            '&EXCEPTIONS=application/vnd.ogc.se_xml' + 
	            '&SRS=' + this._getSRS(request) + 
	            '&VERSION=1.1.1' + 
	            '&BBOX=' + map.getExtent()+
	            '&X=' + request.getX() + 
	            '&Y=' + request.getY() + 
	            '&INFO_FORMAT=' + layer.getQueryFormat() + 
	            '&QUERY_LAYERS=' + layer.getWmsName() + 
	            '&WIDTH=' + width + 
	            '&HEIGHT=' + height + 
	            '&FEATURE_COUNT=1' + 
	            '&FORMAT=image/png' + 
	            '&SERVICE=WMS' + 
	            '&STYLES=' + layer.getCurrentStyle().getName() + 
	            '&LAYERS=' + layer.getWmsName();
            } 
			
            var callback = new ajaxCallback(layerName, format);
            this.sandbox.ajax( url, 
            	function(response) {
            		callback.success(response);
        		},
	            function(response) {
	            	callback.failure(response);
	        	}
    		);
        }
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.mapmodule.GetInfoPlugin
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.GetInfoPlugin', 

/** 
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    /** @static @property __name plugin name */
    __name : 'GetInfoPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    register : function() {

    },
    unregister : function() {

    },
    init : function(sandbox) {
        sandbox.printDebug("[GetInfoPlugin] init");
        var me = this;
        var gfih = 'Oskari.mapframework.mapmodule-plugin.getinfo.GetFeatureInfoHandler';
        this.requestHandlers = {
            getFeatureInfoHandler : Oskari.clazz.create(gfih, sandbox, me)
        };
        this._sandbox.addRequestHandler('GetFeatureInfoRequest',
                                        this.requestHandlers.getFeatureInfoHandler);
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        /**
         * getinfo
         */
        var me = this;
        this._getinfoTool = new (Oskari.$("OpenLayers.Control.GetInfoAdapter"))({
            callback : function(loc, clickLocation, options) {
                me.handleGetInfo(loc, clickLocation, options);
            },
            hoverCallback : function(loc, clickLocation, options) {
                me.handleGetInfoHover(loc, clickLocation, options);
            }
        });

        this.getMapModule().addMapControl('getinfo', this._getinfoTool);

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        // sandbox.printDebug("[GetInfoPlugin] Registering " + this.requestHandlers.mapClickHandler);
        // sandbox.addRequestHandler('MapModulePlugin.MapClickRequest', this.requestHandlers.mapClickHandler);
    },
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }
        // sandbox.removeRequestHandler('MapModulePlugin.MapClickRequest', this.requestHandlers.mapClickHandler);
        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    },
    eventHandlers : {
        'ToolSelectedEvent' : function(event) {
            // TODO: get rid of magic strings
            if (event.getToolName == 'map_control_select_tool') {
                this._getinfoTool.activate();
            } else {
                this._getinfoTool.deactivate();
            }
        },
        'AfterDeactivateAllOpenlayersMapControlsButNotMeasureToolsEvent' : function(event) {
            this.afterDeactivateAllOpenlayersMapControlsButNotMeasureToolsEvent();
        },
        'AfterDeactivateAllOpenlayersMapControlsEvent' : function(event) {
            this.afterDeactivateAllOpenlayersMapControlsEvent(event);
        },
        'MapClickedEvent' : function(evt) {
            var lonlat = evt.getLonLat();
            var mouseX = evt.getMouseX();
            var mouseY = evt.getMouseY();   
            if (this._activated) {        
            	this.buildWMSQueryOrWFSFeatureInfoRequest(lonlat, mouseX, mouseY);
            }
        },
        'AfterHighlightMapLayerEvent' : function(event) {
            this._handleHighlightLayer(event);
        },
        'AfterDimMapLayerEvent' : function(event) {
            this._handleDimLayer();
        }
    },
    _handleHighlightLayer : function(event) {
    	this._activated = true;
    },
    _handleDimLayer : function() {
    	this._activated = false;
    },
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    handleGetInfo : function(loc, clickLocation, options) {

        this._sandbox.printDebug("GETINFO " + loc.lat + "," + loc.lon);
        this.buildWMSQueryOrWFSFeatureInfoRequest(loc, clickLocation.x, clickLocation.y);

    },
    handleGetInfoHover : function(loc, clickLocation, options) {
        this._sandbox.printDebug("GETINFO HOVER " + loc.lat + "," + loc.lon);
    },
    /**
     * converts given array to CSV
     *
     * @param {Object}
     *            array
     */
    arrayToCSV : function(array) {
        var separatedValues = "";

        for(var i = 0; i < array.length; i++) {
            separatedValues += array[i];
            if(i < array.length - 1) {
                separatedValues += ",";
            }
        }

        return separatedValues;
    },
    /***********************************************************
     * Build WMS GetFeatureInfo request
     *
     * @param {Object}
     *            e
     */
    buildWMSQueryOrWFSFeatureInfoRequest : function(lonlat, mouseX, mouseY) {

        var sandbox = this._sandbox;
        var allHighlightedLayers = sandbox.findAllHighlightedLayers();
		
		this._projectionCode = 'EPSG:3067';
		
        if(allHighlightedLayers[0] &&
           allHighlightedLayers[0] != null && 
           (allHighlightedLayers[0].isLayerOfType('WMS') || allHighlightedLayers[0].isLayerOfType('WMTS'))) {
			
			var mapWidth = sandbox.getMap().getWidth();
            var mapHeight = sandbox.getMap().getHeight();
            var bbox = sandbox.getMap().getBbox();

            var queryLayerIds = sandbox.findAllHighlightedLayers();
			
            sandbox.request(this, 
                            sandbox.getRequestBuilder('GetFeatureInfoRequest')
                                (queryLayerIds, lonlat.lon, lonlat.lat, 
                                 mouseX, mouseY, mapWidth, mapHeight, 
                                 bbox, this._projectionCode));

        } else if(allHighlightedLayers[0] &&
                  allHighlightedLayers[0] != null && 
                  allHighlightedLayers[0].isLayerOfType('VECTOR')) {
            this.getMapModule().notifyAll(sandbox.getEventBuilder('FeaturesGetInfoEvent')
                           (allHighlightedLayers[0], null, 
                            lonlat.lon, lonlat.lat, this._map.getProjection, 
                            "GetFeatureInfo"));

        } else if(allHighlightedLayers[0] &&
                  allHighlightedLayers[0] != null && 
                  allHighlightedLayers[0].isLayerOfType('WFS')) {

            var layer = allHighlightedLayers[0];

            if(layer != null && layer.getId() != null) {

                this._selectedCoordinatesLon = [];
                this._selectedCoordinatesLat = [];
                this._selectedCoordinatesLon.push(lonlat.lon);
                this._selectedCoordinatesLat.push(lonlat.lat);

                var imageBbox = this._map.getExtent();
                var params = 
                    "&flow_pm_wfsLayerId=" + layer.getId() + 
                    "&flow_pm_point_x=" + 
                    this.arrayToCSV(this._selectedCoordinatesLon) + 
                    "&flow_pm_point_y=" + 
                    this.arrayToCSV(this._selectedCoordinatesLat) + 
                    "&flow_pm_bbox_min_x=" + imageBbox.left + 
                    "&flow_pm_bbox_min_y=" + imageBbox.bottom + 
                    "&flow_pm_bbox_max_x=" + imageBbox.right + 
                    "&flow_pm_bbox_max_y=" + imageBbox.top + 
                    "&flow_pm_zoom_level=" + this._map.getZoom();
                sandbox.request(this, 
                                sandbox.getRequestBuilder(
                                    'HighlightWFSFeatureRequestByGeoPoint')
                                    (params));
            }
        }
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 *
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.SketchLayerPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
}, {
    getName : function() {
        return this.pluginName;
    },
    __name : "SketchLayerPlugin",

    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    register : function() {
    },
    unregister : function() {
        // alert(this.getName() + '.unregister()');
    },
    init : function(sandbox) {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        this.createMapSketchLayer();
        this.createMapVectorLayer();

        var defStyle = {
            graphicOpacity : "1",
            fillOpacity : "0.95",
            strokeColor : "#000000",
            fillColor : "#ff00ff",
            strokeOpacity : "1",
            strokeWidth : 1,
            pointRadius : 1,
            cursor : "pointer"
        };
        var sty = OpenLayers.Util.applyDefaults(defStyle, OpenLayers.Feature.Vector.style["default"]);
        this._drawArea = new OpenLayers.Control.DrawFeature(this._polygonLayer, OpenLayers.Handler.RegularPolygon, {
            handlerOptions : {
                sides : 4,
                irregular : true,
                style : sty
            }
        });
        this._drawArea.id = "drawarea";
        // this._map.addControl(this._drawArea);
        this.getMapModule().addMapControl('drawarea', this._drawArea);

        this._vectorSelector = new OpenLayers.Control.SelectFeature(this._vectorLayer, {
            clickout : false,
            toggle : false,
            multiple : false,
            hover : false,
            box : false
        });
        this._vectorSelector.id = "vectorselector";
        this.getMapModule().addMapControl('vectorselector', this._vectorSelector);
        // this._map.addControl(this._vectorSelector);

        sandbox.register(this);

        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
    },
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    },
    // TODO: move event handling here
    eventHandlers : {
        'AfterDrawPolygonEvent' : function(event) {
            this.afterDrawPolygonEvent(event);
        },
        'AfterDrawSelectedPolygonEvent' : function(event) {
            this.afterDrawSelectedPolygonEvent(event);
        },
        'AfterErasePolygonEvent' : function(event) {
            this.afterErasePolygonEvent(event);
        },
        'AfterSelectPolygonEvent' : function(event) {
            this.afterSelectPolygonEvent(event);
        },
        'AfterRemovePolygonEvent' : function(event) {
            this.afterRemovePolygonEvent(event);
        },
        'ToolSelectedEvent' : function(event) {
            // this._WMSQueryTool = false;
            
            // TODO: get rid of magic strings
            if(event.getToolName() == 'map_control_draw_area_tool') {
                this._drawArea.activate();
            } else {
                this._drawArea.deactivate();
                if(event.getToolName() == 'map_control_select_tool') {
                    /* clear selected area */
                    this.clearBbox();
                }
            }      
        }
    },

    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     *
     */
    createMapVectorLayer : function() {
        //						var sandbox = this._sandbox;
        var moduleName = this.getName();
        var me = this;
        /* Create handler for set selected vector */
        var areaSelectorHandler = new function(moduleName) {
        this.handle = function(evt) {
        me.setSelectMetadata(evt.feature.id,
        evt.feature.attributes.groupId);
        };
        }(moduleName);

        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.2;
        layer_style.graphicOpacity = 1;
        layer_style.strokeColor = "blue";
        layer_style.fillColor = "blue";

        this._vectorLayer = new OpenLayers.Layer.Vector("Vector Layer", {
            style : layer_style
        });

        this._vectorLayer.events.on({
            'featureselected' : areaSelectorHandler.handle
        });

        this._map.addLayer(this._vectorLayer);

    },
    createMapSketchLayer : function() {
        //                        var sandbox = this._sandbox;
        var moduleName = this.getName();
        //                        var mapModule = this.getMapModule();
        var me = this;

        var pollayer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        pollayer_style.fillOpacity = 0.95;
        pollayer_style.graphicOpacity = 1;

        pollayer_style.strokeColor = "#000000";
        pollayer_style.fillColor = "#ff00ff";
        this._polygonLayer = new OpenLayers.Layer.Vector("Polygon Layer", {
            style : pollayer_style
        });

        /* Create handler for clearing bbox */
        var clearBboxHandler = new function(moduleName) {
        this.handle = function(evt) {
        me.clearBbox();
        };
        }(moduleName);

        /* Create handler for setting bbox */

        var setBboxHandler = new function(moduleName) {
        this.handle = function(evt) {
        me.setBbox();
        };
        }(moduleName);

        this._polygonLayer.events.on({
            'sketchstarted' : clearBboxHandler.handle,
            'featureadded' : setBboxHandler.handle
        });

        this.getMapModule()._map.addLayer(this._polygonLayer);
    },
    /***********************************************************
     * Clear drawed bboxes
     */
    clearBbox : function() {
        var layer = this._map.getLayersByName("Polygon Layer");
        if(layer[0] != null) {
            layer[0].destroyFeatures();
        }
    },
    /***********************************************************
     * Set bbox
     */
    setBbox : function() {
        var layer = this._map.getLayersByName("Polygon Layer");
        var polygon = Oskari.clazz.create('Oskari.mapframework.domain.Polygon');

        if(layer[0] != undefined) {

            polygon.setTop(layer[0].getDataExtent().top);
            polygon.setLeft(layer[0].getDataExtent().left);
            polygon.setBottom(layer[0].getDataExtent().bottom);
            polygon.setRight(layer[0].getDataExtent().right);
            polygon.setDescription('Valittu alue');
            polygon.setColor("#ff00ff");
            polygon.setId(-1);
        } else {
            polygon.setId(-2);
        }
        this._sandbox.request(this, this._sandbox.getRequestBuilder('UpdateHiddenValueRequest')(polygon));
    },
    /***********************************************************
     * Create handler for areaselector bbox
     *
     * @param {Object}
     *            id
     * @param {Object}
     *            groupId
     */
    setSelectMetadata : function(id, groupId) {
        this._sandbox.request(this, this._sandbox.getRequestBuilder('SelectPolygonRequest')(id, groupId));
    },
    /***********************************************************
     * Handle AfterDrawPolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterDrawPolygonEvent : function(event) {
        var pointList = [];

        var polTop = '' + event.getPolygon().getTop() + '';
        polTop = polTop.replace(".", "-");

        var polLeft = '' + event.getPolygon().getLeft() + '';
        polLeft = polLeft.replace(".", "-");

        var polBottom = '' + event.getPolygon().getBottom() + '';
        polBottom = polBottom.replace(".", "-");

        var polRight = '' + event.getPolygon().getRight() + '';
        polRight = polRight.replace(".", "-");

        var bounds = new OpenLayers.Bounds(event.getPolygon().getLeft(), event.getPolygon().getBottom(), event.getPolygon().getRight(), event.getPolygon().getTop());

        var srcProj = new OpenLayers.Projection("EPSG:4326");
        var mapProj = new OpenLayers.Projection("EPSG:3067");
        var boundsMap = bounds.transform(srcProj, mapProj);
        //						var polygon = boundsMap.toGeometry();

        var newPoint = new OpenLayers.Geometry.Point(polLeft, polTop);
        pointList.push(newPoint);
        newPoint = new OpenLayers.Geometry.Point(polLeft, polBottom);
        pointList.push(newPoint);
        newPoint = new OpenLayers.Geometry.Point(polRight, polBottom);
        pointList.push(newPoint);
        newPoint = new OpenLayers.Geometry.Point(polRight, polTop);
        pointList.push(newPoint);

        pointList.push(pointList[0]);
        //						var linearRing = new OpenLayers.Geometry.LinearRing(
        //								pointList);

        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.2;
        layer_style.graphicOpacity = 1;

        layer_style.display = event.getPolygon().getDisplay();
        layer_style.strokeColor = event.getPolygon().getColor();
        layer_style.fillColor = event.getPolygon().getColor();

        var polygon = boundsMap.toGeometry();

        var polygonFeature = new OpenLayers.Feature.Vector(polygon, {
            id : event.getPolygon().getId(),
            groupId : polTop + "_" + polLeft + "_" + polBottom + "_" + polRight
        });

        polygonFeature.id = event.getPolygon().getId();
        polygonFeature.style = layer_style;

        this._vectorLayer.addFeatures(polygonFeature);
        this._vectorSelector.activate();

        if(event.getPolygon().getZoomToExtent()) {
            this._map.zoomToExtent(boundsMap, true);
        }
    },
    /***********************************************************
     * Handle AfterDrawSelectedPolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterDrawSelectedPolygonEvent : function(event) {
        //						var pointList = [];

        var polTop = '' + event.getPolygon().getTop() + '';
        polTop = polTop.replace(".", "-");

        var polLeft = '' + event.getPolygon().getLeft() + '';
        polLeft = polLeft.replace(".", "-");

        var polBottom = '' + event.getPolygon().getBottom() + '';
        polBottom = polBottom.replace(".", "-");

        var polRight = '' + event.getPolygon().getRight() + '';
        polRight = polRight.replace(".", "-");

        var bounds = new OpenLayers.Bounds(event.getPolygon().getLeft(), event.getPolygon().getBottom(), event.getPolygon().getRight(), event.getPolygon().getTop());

        var srcProj = new OpenLayers.Projection("EPSG:4326");
        var mapProj = new OpenLayers.Projection("EPSG:3067");

        var boundsMap = bounds.transform(srcProj, mapProj);

        //						var polygon = boundsMap.toGeometry();

        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.95;
        layer_style.graphicOpacity = 1;

        layer_style.display = event.getPolygon().getDisplay();
        layer_style.strokeColor = event.getPolygon().getColor();
        layer_style.fillColor = event.getPolygon().getColor();

        var polygon = boundsMap.toGeometry();

        var polygonFeature = new OpenLayers.Feature.Vector(polygon, {
            id : event.getPolygon().getId(),
            groupId : polTop + "_" + polLeft + "_" + polBottom + "_" + polRight
        });

        polygonFeature.id = event.getPolygon().getId();
        polygonFeature.style = layer_style;
        this._polygonLayer.addFeatures(polygonFeature);
    },
    /***********************************************************
     * Handle AfterErasePolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterErasePolygonEvent : function(event) {
        var tmpLayer = this._vectorLayer.getFeatureById(event.getId());
        this._vectorLayer.removeFeatures(tmpLayer);
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.fillOpacity = 0.3;
        layer_style.graphicOpacity = 1;
        layer_style.strokeColor = "blue";
        layer_style.fillColor = "blue";

        if(tmpLayer.style.display != 'undefined' && tmpLayer.style.display != "none") {
            layer_style.display = "none";
        } else {
            layer_style.display = "";
        }
        tmpLayer.style = layer_style;
        this._vectorLayer.addFeatures(tmpLayer);
        this._vectorLayer.redraw();
    },
    /***********************************************************
     * Handle AfterSelectPolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterSelectPolygonEvent : function(event) {
        var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style.strokeColor = "blue";
        layer_style.fillColor = "blue";
        layer_style.fillOpacity = 0.3;
        layer_style.graphicOpacity = 1;

        var layer_style_blue = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
        layer_style_blue.strokeColor = "#CC2388";
        layer_style_blue.fillColor = "#CC2388";
        layer_style_blue.fillOpacity = 0.2;
        layer_style_blue.graphicOpacity = 1;

        this._vectorLayer.redraw();
        var tmpLayer = this._vectorLayer.getFeatureById(event.getId());

        this._vectorLayer.drawFeature(tmpLayer, layer_style_blue);
    },
    /***********************************************************
     * Handle AfterRemovePolygonEvent
     *
     * @param {Object}
     *            event
     */
    afterRemovePolygonEvent : function(event) {
        var showPol = event.getShowPol();

        if(showPol) {
            var tmpLayer = this._vectorLayer.getFeatureById(event.getId());
            var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
            layer_style.strokeColor = "blue";
            layer_style.fillColor = "blue";
            layer_style.fillOpacity = 0.2;
            layer_style.graphicOpacity = 1;
            this._vectorLayer.redraw();
            this._vectorLayer.drawFeature(tmpLayer, layer_style);
        } else {
            var tmpLayer = this._vectorLayer.getFeatureById(event.getId());
            var layer_style = OpenLayers.Util.extend({}, OpenLayers.Feature.Vector.style['default']);
            this._vectorLayer.removeFeatures(tmpLayer);
            layer_style.fillOpacity = 0.2;
            layer_style.graphicOpacity = 1;
            layer_style.strokeColor = "blue";
            layer_style.fillColor = "blue";
            layer_style.display = "none";
            tmpLayer.style = layer_style;
            this._vectorLayer.addFeatures(tmpLayer);
            this._vectorLayer.redraw();
        }
    }
}, {
    "protocol" : ["Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/** modifications free software  (c) 2009-IV maanmittauslaitos.fi **/
/** OpenLayers.Strategy.Grid CLONE - REVIEW NEEDED */
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */

Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTilesGrid",
		function(options) {
      this.grid = [];
      this.map = null;
      this.tileSize = null;
      this.maxExtent = null;
      this.buffer = 0;
      this.numLoadingTiles = 0;
      
      for( p in options ) this[p] = options[p];
	},{

    /**
     * APIMethod: destroy
     * Deconstruct the layer and clear the grid.
     */
    destroy: function() {
        this.clearGrid();
        this.grid = null;
        this.tileSize = null;
    },

    /**
     * Method: clearGrid
     * Go through and remove all tiles from the grid, calling
     *    destroy() on each of them to kill circular references
     */
    clearGrid:function() {
        if (this.grid) {
            for(var iRow=0, len=this.grid.length; iRow<len; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0, clen=row.length; iCol<clen; iCol++) {
                    var tile = row[iCol];
                    tile.destroy();
                }
            }
            this.grid = [];
        }
    },

    /**
     * Method: moveTo
     * This function is called whenever the map is moved. All the moving
     * of actual 'tiles' is done by the map, but moveTo's role is to accept
     * a bounds and make sure the data that that bounds requires is pre-loaded.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged) {

        bounds = bounds || this.map.getExtent();

        if (bounds != null) {

            // if grid is empty or zoom has changed, we *must* re-tile
            var forceReTile = !this.grid.length || zoomChanged;

            // total bounds of the tiles
            var tilesBounds = this.getTilesBounds();


                // if the bounds have changed such that they are not even
                //  *partially* contained by our tiles (IE user has
                //  programmatically panned to the other side of the earth)
                //  then we want to reTile (thus, partial true).
                //
                if (forceReTile || !tilesBounds.containsBounds(bounds, true)) {
                    this.initGriddedTiles(bounds);
                } else {
                    //we might have to shift our buffer tiles
                    this.moveGriddedTiles(bounds);
                }
        }
    },

    /**
     * APIMethod: setTileSize
     * Check if we are in singleTile mode and if so, set the size as a ratio
     *     of the map size (as specified by the layer's 'ratio' property).
     *
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setTileSize: function(size) {

    },



    /**
     * APIMethod: getTilesBounds
     * Return the bounds of the tile grid.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object representing the bounds of all the
     *     currently loaded tiles (including those partially or not at all seen
     *     onscreen).
     */
    getTilesBounds: function() {
        var bounds = null;

        if (this.grid.length) {
            var bottom = this.grid.length - 1;
            var bottomLeftTile = this.grid[bottom][0];

            var right = this.grid[0].length - 1;
            var topRightTile = this.grid[0][right];

            bounds = new OpenLayers.Bounds(bottomLeftTile.bounds.left,
                                           bottomLeftTile.bounds.bottom,
                                           topRightTile.bounds.right,
                                           topRightTile.bounds.top);

        }
        return bounds;
    },


    /**
     * Method: calculateGridLayout
     * Generate parameters for the grid layout. This
     *
     * Parameters:
     * bounds - {<OpenLayers.Bound>}
     * extent - {<OpenLayers.Bounds>}
     * resolution - {Number}
     *
     * Returns:
     * Object containing properties tilelon, tilelat, tileoffsetlat,
     * tileoffsetlat, tileoffsetx, tileoffsety
     */
    calculateGridLayout: function(bounds, extent, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;

        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;

        var offsetlat = bounds.top - (extent.bottom + tilelat);
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.bottom + tilerow * tilelat;

        return {
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },

    /**
     * Method: initGriddedTiles
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    initGriddedTiles:function(bounds) {

        // work out mininum number of rows and columns; this is the number of
        // tiles required to cover the viewport plus at least one for panning

        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) +
                      Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) +
                      Math.max(1, 2 * this.buffer);

        var extent = this.maxExtent;
        var resolution = this.map.getResolution();

        var tileLayout = this.calculateGridLayout(bounds, extent, resolution);

        var tileoffsetx = Math.round(tileLayout.tileoffsetx); // heaven help us
        var tileoffsety = Math.round(tileLayout.tileoffsety);

        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;

        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;

        this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);

        var startX = tileoffsetx;
        var startLon = tileoffsetlon;

        var rowidx = 0;

        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);


        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;

            do {
                var tileBounds =
                    new OpenLayers.Bounds(tileoffsetlon,
                                          tileoffsetlat,
                                          tileoffsetlon + tilelon,
                                          tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= layerContainerDivLeft;

                var y = tileoffsety;
                y -= layerContainerDivTop;

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }

                tileoffsetlon += tilelon;
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols)

            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows)

        //shave off exceess rows and colums
        this.removeExcessTiles(rowidx, colidx);

    },


    /**
     * APIMethod: addTile
     * Gives subclasses of Grid the opportunity to create an
     * OpenLayer.Tile of their choosing. The implementer should initialize
     * the new tile and take whatever steps necessary to display it.
     *
     * Parameters
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.Tile>} The added OpenLayers.Tile
     */

        addTile: function(bounds, position) {
    	/*  var bfix = bounds;//.transform(map.projection, map.displayProjection);
                var boundsGeom = bfix.toGeometry();
              var boundsFeature = new OpenLayers.Feature.Vector(boundsGeom);

              this.layer.addFeatures([boundsFeature]);*/
              return new OpenLayers.Tile(this.layer,bounds,position,"",this.tileSize);
    },


    /**
     * Method: moveGriddedTiles
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    moveGriddedTiles: function(bounds) {
        var buffer = this.buffer || 1;
        while (true) {
            var tlLayer = this.grid[0][0].position;
            var tlViewPort =
                this.map.getViewPortPxFromLayerPx(tlLayer);
            if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                this.shiftColumn(true);
            } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                this.shiftColumn(false);
            } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                this.shiftRow(true);
            } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                this.shiftRow(false);
            } else {
                break;
            }
        };
    },

    /**
     * Method: shiftRow
     * Shifty grid work
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftRow:function(prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var grid = this.grid;
        var modelRow = grid[modelRowIndex];

        var resolution = this.map.getResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;

        var row = (prepend) ? grid.pop() : grid.shift();

        for (var i=0, len=modelRow.length; i<len; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }

        if (prepend) {
            grid.unshift(row);
        } else {
            grid.push(row);
        }
    },

    /**
     * Method: shiftColumn
     * Shift grid work in the other dimension
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftColumn: function(prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.map.getResolution();
        var deltaLon = resolution * deltaX;

        for (var i=0, len=this.grid.length; i<len; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];

            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;

            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
            tile.moveTo(bounds, position);
            if (prepend) {
                row.unshift(tile);
            } else {
                row.push(tile);
            }
        }
    },

    /**
     * Method: removeExcessTiles
     * When the size of the map or the buffer changes, we may need to
     *     remove some excess rows and columns.
     *
     * Parameters:
     * rows - {Integer} Maximum number of rows we want our grid to have.
     * colums - {Integer} Maximum number of columns we want our grid to have.
     */
    removeExcessTiles: function(rows, columns) {

        // remove extra rows
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (var i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                tile.destroy();
            }
        }

        // remove extra columns
        while (this.grid[0].length > columns) {
            for (var i=0, l=this.grid.length; i<l; i++) {
                var row = this.grid[i];
                var tile = row.pop();
                tile.destroy();
           }
        }
    },

    /**
     * Method: onMapResize
     * For singleTile layers, this will set a new tile size according to the
     * dimensions of the map pane.
     */
    onMapResize: function() {
    },



    CLASS_NAME: "NLSFI.OpenLayers.Strategy.QueuedTilesGrid"
});
/* 
/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * license.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. 
 */
/**
 * Class: OpenLayers.Strategy.QueuedTilesStrategy A simple strategy that reads
 * new features when the viewport invalidates some bounds.
 * 
 * We'll split requested area into a NUMBER of subrequests which we'll ask the
 * protocol to fulfill sequentially. Subrequests are processed 'in background'
 * 
 * Inherits from: - <OpenLayers.Strategy>
 */

Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTilesStrategy",
		function(options) {

			this.debugGridFeatures = true;
	
			this.options = options;

			this.tileQueue = options.tileQueue;
			this.autoActivate = true;
			this.autoDestroy = false;

			/** grid implementation that calculates tile bounds */
			this.grid = null;

			/** current data bounds */
			this.bounds = null;

			for (p in options)
				this[p] = options[p];

			this.active = false;

		}, {

			setLayer : function(layer) {
				this.layer = layer;
			},

			/** unload job requests and optional tile visualisations */
			flushTileQueue : function() {
				var q = this.tileQueue.queue;

				var tileFeatures = [];
				for ( var n = 0; n < q.length; n++) {
					if (q[n].tileFeature != null) {
						tileFeatures.push(q[n].tileFeature);
						q[n].tileFeature = null;
					}
				}
				if (tileFeatures.length > 0) {
					this.layer.destroyFeatures(tileFeatures);
				}
				this.tileQueue.flushQueue();

			},

			/**
			 * unload out of view features to save(?) some memory however
			 * intersects operation for this DID kill browser so let's not
			 */
			unloadOutOfViewFeatures : function() {

			},

			/**
			 * Property: ratio {Float} The ratio of the data bounds to the
			 * viewport bounds (in each dimension).
			 */
			ratio : 1,

			/**
			 * Method: activate Set up strategy with regard to reading new
			 * batches of remote data.
			 * 
			 * Returns: {Boolean} The strategy was successfully activated.
			 */
			activate : function() {
				if (this.active) {
					return false;
				}
				this.active = true;

				this.grid = Oskari.clazz.create(
						"Oskari.mapframework.gridcalc.QueuedTilesGrid", {
							map : this.layer.map,
							layer : this.layer,
							maxExtent : this.layer.map.getMaxExtent(),
							tileSize : this.layer.map.getTileSize()

						});
				/*this.layer.events.on( {
					"moveend" : this.updateMoveEnd,
					scope : this
				});*/
				this.layer.events.on( {
					"refresh" : this.updateRefresh,
					scope : this
				});

				return true;
			},

			/**
			 * Method: deactivate Tear down strategy with regard to reading new
			 * batches of remote data.
			 * 
			 * Returns: {Boolean} The strategy was successfully deactivated.
			 */
			deactivate : function() {
				if (!this.active) {
					return false;
				}

				/*this.layer.events.un( {
					"moveend" : this.update,
					scope : this
				});*/
				this.layer.events.un( {
					"refresh" : this.update,
					scope : this
				});
				this.grid.destroy();
				this.grid = null;
				return true;
			},

			updateRefresh : function(options) {
				this.update();
			},
			updateMoveEnd : function(options) {
				this.update();
			},

			/**
			 * Method: update Callback function called on "moveend" or "refresh"
			 * layer events.
			 * 
			 * Parameters: options - {Object} An object with a property named
			 * "force", this property references a boolean value indicating if
			 * new data must be incondtionally read.
			 */
			update : function(options) {
				var mapBounds = this.layer.map.getExtent();
				this.grid.moveTo(mapBounds, true);
				this.flushTileQueue();

				var mapZoom = this.layer.map.getZoom();

				if (mapZoom < this.minZoom) {
					return;
				}
				this.triggerRead();

			},

			/**
			 * Method: invalidBounds
			 * 
			 * Parameters: mapBounds - {<OpenLayers.Bounds>} the current map
			 * extent, will be retrieved from the map object if not provided
			 * 
			 * Returns: {Boolean}
			 */
			invalidBounds : function(mapBounds) {
				if (!mapBounds) {
					mapBounds = this.layer.map.getExtent();
				}
				return !this.bounds || !this.bounds.containsBounds(mapBounds);
			},

			/**
			 * unload of out of view features killed browser - so destruction is
			 * the right thing to do
			 */
			triggerUnload : function(bounds) {

				this.layer.destroyFeatures();

			},

			/**
			 * Method: triggerRead
			 * 
			 * Returns: {<OpenLayers.Protocol.Response>} The protocol response
			 * object returned by the layer protocol.
			 */
			triggerRead : function() {

				var gridGrid = this.grid.grid;
				var gridFeatures = [];
				var debugGridFeatures = this.debugGridFeatures;

				for ( var r = 0; r < gridGrid.length; r++) {
					for ( var c = 0; c < gridGrid[r].length; c++) {
						var bs = gridGrid[r][c].bounds.clone();
						var tileBounds = {
								left: bs.left,
								top: bs.top,
								right: bs.right,
								bottom: bs.bottom
						};

						
						  // just for debugging
							//	gridcalc bundle supports this as well
						var boundsFeature = null;
						if( debugGridFeatures) {
						var ptFromA = new
						  OpenLayers.Geometry.Point(bs.left, bs.bottom); 
						var
						  ptToA = new OpenLayers.Geometry.Point(bs.right,
						  bs.top); 
						
						var ptFromB = new
						  OpenLayers.Geometry.Point(bs.left, bs.top); 
						var ptToB =
						  new OpenLayers.Geometry.Point(bs.right, bs.bottom);
						var boundGeomArea = new
						  OpenLayers.Geometry.LineString( [ ptFromA, ptToB,
						  ptToA, ptFromB, ptFromA ]); 
						var boundsFeature = new
						  OpenLayers.Feature.Vector(boundGeomArea, {
						  featureClassName : this.CLASS_NAME, 
						  description : "" }); 
						boundsFeature.renderIntent =
						  "tile"; 
						gridFeatures.push(boundsFeature);
						}
						var qObj = Oskari.clazz.create(
								"Oskari.mapframework.gridcalc.QueuedTile", {
									bounds : tileBounds,
									tileFeature: boundsFeature
								});
						this.tileQueue.pushJob(qObj);

					}
				}

				if( debugGridFeatures ) {
					this.layer.addFeatures(gridFeatures);
				}
					

			},

			/**
			 * Method: merge Given a list of features, determine which ones to
			 * add to the layer.
			 * 
			 * Parameters: resp - {<OpenLayers.Protocol.Response>} The response
			 * object passed by the protocol.
			 */
			merge : function(resp) {
				// this will NOT destroy ANY features
			// we'll just trigger a unload job
			// this.layer.destroyFeatures();
			var features = resp.features;
			if (features && features.length > 0) {
				this.layer.addFeatures(features);
			}
		},

		CLASS_NAME : "NLSFI.OpenLayers.Strategy.QueuedTilesStrategy"
		});
/**
 * Resolves bounding boxes for WFS layer image tiles
 */
Oskari.clazz
        .define(
                'Oskari.mapframework.mapmodule.TilesGridPlugin',
                function() {
                	this.mapModule = null;
                	this.pluginName = null;
                	this._sandbox = null;
                	this._map = null;
                },

                {
                	__name: 'TilesGridPlugin',
                	
                    getName : function() {
                        return this.pluginName;
                    },
                    
                    getMapModule : function(){
                    	return this.mapModule;
                    },
                    setMapModule : function(mapModule) {
                    	this.mapModule = mapModule;
                    	this.pluginName = mapModule.getName()+this.__name;
                    },
                    init: function(sandbox) {
                    },
                    register : function() {
                        
                    },
                    unregister : function() {
                        
                    },

                    startPlugin : function(sandbox) {
                    	this._sandbox = sandbox;
                        this._map = this.getMapModule().getMap();
                        
                        
                        this.createTilesGrid();
                        
                        sandbox.register(this);
                        
                       	for( p in this.eventHandlers ) {
   							sandbox.registerForEventByName(this,p);
   						}
   						this.afterMapMoveEvent();
                    },
                    stopPlugin : function(sandbox) {
                      
                        for( p in this.eventHandlers ) {
                        	sandbox.unregisterFromEventByName(this,p);
                        }
                    	
                        sandbox.unregister(this);
                        
                    	this._map = null;
                    	this._sandbox = null;
                    },
                    
                    /* @method start 
                     * called from sandbox
                     */
                    start: function(sandbox) {
                    },
                    /**
                     * @method stop
                     * called from sandbox
                     * 
                     */
                    stop: function(sandbox) {
                    },
                    

                    
                    /**
					 * @method createTilesGrid
					 * 
					 * Creates an invisible layer to support Grid operations
					 * This manages sandbox Map's TileQueue  
					 * 
					 */
					createTilesGrid: function() {
						var me = this;
						var sandbox = me._sandbox;
						
						var tileQueue = 
						    Oskari.clazz.create("Oskari.mapframework.gridcalc.TileQueue");
						                        
						sandbox.getMap().setTileQueue(tileQueue);
						
				        var strategy = Oskari.clazz.create("Oskari.mapframework.gridcalc.QueuedTilesStrategy",{
				                tileQueue: tileQueue
				        });
				        strategy.debugGridFeatures = false;
				        this.tileQueue = tileQueue;
				        this.tileStrategy = strategy;
				        
				        var styles = new OpenLayers.StyleMap({
				            "default": new OpenLayers.Style({
				                pointRadius: 3,
				                strokeColor: "red",
				                strokeWidth: 2,
				                fillColor: '#800000'
				            }),
				            "tile": new OpenLayers.Style({
				                strokeColor: "#008080",
				                strokeWidth: 5,
				                fillColor: "#ffcc66",
				                fillOpacity: 0.5
				            }),
				            "select": new OpenLayers.Style({
				                fillColor: "#66ccff",
				                strokeColor: "#3399ff"
				            })
				        });
				        
				        this._tilesLayer = new OpenLayers.Layer.Vector(
								"Tiles Layer", {
									strategies: [strategy],
									styleMap: styles,
									visibility: true
								});
				        this._map.addLayer(this._tilesLayer);
				        this._tilesLayer.setOpacity(0.3);
						
					},
					getTileQueue: function() {
						return this.tileQueue;
					},

					afterMapMoveEvent: function(event) {
						this.tileStrategy.update();
						this._tilesLayer.redraw();
					},
					
					eventHandlers : {
						'AfterMapMoveEvent' : function(event) {
			            this.afterMapMoveEvent(event);
			        	}					
						
					},

					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this, [ event ]);
					}





                },{
					'protocol' : [ "Oskari.mapframework.module.Module",
					               "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
				});
/**
 * 
 */
Oskari.clazz
        .define(
                'Oskari.mapframework.mapmodule.MarkersPlugin',
                function() {
                	this.mapModule = null;
                	this.pluginName = null;
                	this._sandbox = null;
                	this._map = null;
                },

                {
                	__name: 'MarkersPlugin',
                	
                    getName : function() {
                        return this.pluginName;
                    },
                    
                    getMapModule : function(){
                    	return this.mapModule;
                    },
                    setMapModule : function(mapModule) {
                    	this.mapModule = mapModule;
                    	this.pluginName = mapModule.getName()+this.__name;
                    },

                    init: function(sandbox) {
                    },

                    register : function() {
                        
                    },
                    unregister : function() {
                        
                    },

                    startPlugin : function(sandbox) {
                    	this._sandbox = sandbox;
                        this._map = this.getMapModule().getMap();
                        
                        this.createMapMarkersLayer();
                        
                        sandbox.register(this);
                       	for( p in this.eventHandlers ) {
   							sandbox.registerForEventByName(this,p);
   						}
                    },
                    stopPlugin : function(sandbox) {
                      
                        for( p in this.eventHandlers ) {
                        	sandbox.unregisterFromEventByName(this,p);
                        }
                    	
                        sandbox.unregister(this);
                    	this._map = null;
                    	this._sandbox = null;
                    },

                    /* @method start 
                     * called from sandbox
                     */
                    start: function(sandbox) {
                    },
                    /**
                     * @method stop
                     * called from sandbox
                     * 
                     */
                    stop: function(sandbox) {
                    },
                    
                    eventHandlers : {'AfterHideMapMarkerEvent' : function(event) {
						this.afterHideMapMarkerEvent(event);
					}},

                    onEvent : function(event) {
                        return this.eventHandlers[event.getName()].apply(this,
                                [ event ]);
                    },
                    
					/**
					 * 
					 */
					createMapMarkersLayer: function() {
						var sandbox = this._sandbox;
						var layerMarkers = new OpenLayers.Layer.Markers(
						"Markers");
						this._map.addLayer(layerMarkers);

					},

					/***********************************************************
					 * Handle HideMapMarkerEvent
					 * 
					 * @param {Object}
					 *            event
					 */
					afterHideMapMarkerEvent : function(event) {
						var markerLayer = this._map.getLayersByName("Markers");
						if (markerLayer != null && markerLayer[0] != null) {
							markerLayer[0].setVisibility(false);
						}
					}


                },{
					'protocol' : [ "Oskari.mapframework.module.Module",
					               "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
				});
/**
 * @class Oskari.mapframework.bundle.mappublished.SearchPlugin
 * Provides a search functionality and result panel for published map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 * 		JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
    this.container = null;
}, {
    /** @static @property __name plugin name */
    __name : 'SearchPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        var searchBoxMessage = 'Etsi...';
        var buttonSearchMessage = 'Hae';
        var closeSearchMessage = 'Sulje';
        this.template = jQuery('<div class="mapplugin search-div">' +
            '<div class="search-textarea-and-button">' +
                '<input placeholder="' + searchBoxMessage + '" type="text" />' +
                '<input type="button" value="' + buttonSearchMessage + '" name="search" />' +
            '</div>' + 
            '<div class="results">' + 
            '<div class="header"><div class="close" title="' + closeSearchMessage + '"></div></div>' +
            '<div class="content">&nbsp;</div>' +
            '</div>' +
            '</div>');
        
        /*
            "<th>Nimi" + 'searchservice_search_result_column_name' + "</th>" +
            "<th>Kunta" + 'searchservice_search_result_column_village' + "</th>" +
            "<th>Tyyppi" + 'searchservice_search_result_column_type' + "</th>" +
            */
        this.templateResultsTable = jQuery("<table><thead><tr>" +
            "<th>Nimi" + "</th>" +
            "<th>Kunta" + "</th>" +
            "<th>Tyyppi" + "</th>" +
            "</tr></thead><tbody></tbody></table>");
            
        this.templateResultsRow = jQuery("<tr><td nowrap='nowrap'></td><td nowrap='nowrap'></td><td nowrap='nowrap'></td></tr>");

        var ajaxUrl = null;
        if(this.conf && this.conf.url) {
            ajaxUrl = this.conf.url;
        }
        else {
            ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetSearchResult';
        } 
        
        this.service = 
            Oskari.clazz.create('Oskari.mapframework.bundle.search.service.SearchService', ajaxUrl);
    },
    /**
     * @method register
     *
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     *
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this._createUI();
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
        this.container.remove();
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {/*
        'DummyEvent' : function(event) {
            alert(event.getName());
        }*/
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if
     * not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    
    /**
     * @method _createUI
     * @private
     * Creates UI for search functionality in the 
     * HTML div thats id is passed in #_conf.toolsContainer
     */
    _createUI : function() {
    	var sandbox = this._sandbox;
    	var me = this;
    	// get div where the map is rendered from openlayers
    	var parentContainer = jQuery(this._map.div);
    	
		var content = this.template.clone();
		this.container = content;
        
        // bind events
        var me = this;
        var inputField = content.find('input[type=text]');
        // to text box
        inputField.focus(function(){
            sandbox.request(me.getName(), sandbox.getRequestBuilder('DisableMapKeyboardMovementRequest')());
            //me._checkForKeywordClear();
	    });
        inputField.blur(function(){
            sandbox.request(me.getName(), sandbox.getRequestBuilder('EnableMapKeyboardMovementRequest')());
            //me._checkForKeywordInsert();
	    });
	    
        inputField.keypress(function(event){
            me._checkForEnter(event);
	    });
	    // to search button
        content.find('input[type=button]').click(function(event){
            me._doSearch();
	    });
	    
	    // to close button
        content.find('div.close').click(function(event){
            me._hideSearch();
            // TODO: this should also unbind the TR tag click listeners?
	    });
        content.find('div.results').hide();
        parentContainer.append(content);
        // override default location if configured
        if(this._conf && this._conf.location) {
            if(this._conf.location.top) {
                content.css('top', this._conf.location.top);
            }
            if(this._conf.location.left) {
                content.css('left', this._conf.location.left);
            }
            if(this._conf.location.right) {
                content.css('right', this._conf.location.right);
            }
            if(this._conf.location.bottom) {
                content.css('bottom', this._conf.location.bottom);
            }
        }
    },
    
    
    /**
     * @method _checkForEnter
     * @private
     * @param {Object} event
     * 		keypress event object from browser
     * Detects if <enter> key was pressed and calls #_doSearch if it was
     */
	_checkForEnter : function(event) {
        var keycode;
        if (window.event) {
            keycode = window.event.keyCode;
        } else if (event) {
            keycode = event.which;
        } 
	  
        if (event.keyCode == 13) {
            this._doSearch();
        }
	},
	
    /**
     * @method _doSearch
     * @private
     * Sends out a Oskari.mapframework.request.common.SearchRequest with results callback #_showResults
     */
    _doSearch : function() {
        if(this._searchInProgess == true) {
            return;
        }

		var me = this;
        this._hideSearch();
        this._searchInProgess = true;
        var inputField = this.container.find('input[type=text]');
        inputField.addClass("search-loading");
        var searchText = inputField.val();
        
        var searchCallback = function(msg) {
        	me._showResults(msg);
            me._enableSearch();
        };
        var onErrorCallback = function() {
        	me._enableSearch();
        };
        this.service.doSearch(searchText, 
            searchCallback, onErrorCallback);
    },
    /**
     * @method _showResults
     * @private
     * @param {Object} msg 
     * 			Result JSON returned by search functionality
     * Renders the results of the search or shows an error message if nothing was found.
     * Coordinates and zoom level of the searchresult item is written in data-href 
     * attribute in the tr tag of search result HTML table. Also binds click listeners to <tr> tags.
     * Listener reads the data-href attribute and calls #_resultClicked with it for click handling.
     */
    _showResults : function(msg) {
		// check if there is a problem with search string       
		var errorMsg = msg.error;
		var me = this;
		var resultsContainer = this.container.find('div.results');
        var header = resultsContainer.find('div.header');
        var content = resultsContainer.find('div.content');
		
		if (errorMsg != null) {
		    content.html(errorMsg);
		    resultsContainer.show();
            return;
		}
		
		// success
		var totalCount = msg.totalCount;
		if (totalCount == 0) {
			content.html("search_published_map_no_results");
            resultsContainer.show();
		} else if (totalCount == 1) {
			// only one result, show it immediately
			var lon = msg.locations[0].lon;
			var lat = msg.locations[0].lat;
			var zoom = msg.locations[0].zoomLevel;
			
        	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
		} else {
		    
            // many results, show all
            var table = this.templateResultsTable.clone();
            var tableBody = table.find('tbody');
            
				
			for(var i=0; i<totalCount; i++) {

				if (i>=100) {
				  tableBody.append("<tr><td class='search-result-too-many' colspan='3'>" + 'search_published_map_too_many_results' + "</td></tr>");
				  break;
				}				
				var lon = msg.locations[i].lon;
				var lat = msg.locations[i].lat;
				var zoom = msg.locations[i].zoomLevel;
				
                var row = this.templateResultsRow.clone();
                row.attr('data-location', lon + "---" + lat + "---" + zoom);
                
                var name = msg.locations[i].name;
                var municipality = msg.locations[i].village;
                var type = msg.locations[i].type;
                var cells = row.find('td');
                jQuery(cells[0]).append(name);
                jQuery(cells[1]).append(municipality);
                jQuery(cells[2]).append(type);
                tableBody.append(row);
		  }
		  
          content.html(table);
          resultsContainer.show();
		  // bind click events to search result table rows
		  // coordinates and zoom level of the searchresult is written in data-href attribute in the tr tag
		  tableBody.find('tr[data-location]').addClass('clickable').click( 
		  	function() {
				me._resultClicked(jQuery(this).attr('data-location'));
			}).find('a').hover( function() {
				jQuery(this).parents('tr').unbind('click');
			}, function() {
				jQuery(this).parents('tr').click( function() {
					me._resultClicked(jQuery(this).attr('data-location'));
				});
		  }); 
		}
	},
	
    /**
     * @method _resultClicked
     * @private
     * @param {String} paramStr String that has coordinates and zoom level separated with '---'.
     * Click event handler for search result HTML table rows.
     * Parses paramStr and sends out Oskari.mapframework.request.common.MapMoveRequest
     */
	_resultClicked : function(paramStr) {
			var values = paramStr.split('---');
			var lon = values[0];
			var lat = values[1];
			var zoom = values[2];
        	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('MapMoveRequest')(lon, lat, zoom, true));
	},
	
    /**
     * @method _enableSearch
     * @private
	 * Resets the 'search in progress' flag and removes the loading icon
     */
	_enableSearch : function() {
        this._searchInProgess = false;
		jQuery("#search-string").removeClass("search-loading");
	},
	
    /**
     * @method _hideSearch
     * @private
	 * Hides the search result and sends out Oskari.mapframework.request.common.HideMapMarkerRequest
     */
	_hideSearch : function() {
	    
        this.container.find('div.results').hide();
		
		/* Send hide marker request */				 
    	this._sandbox.request(this.getName(), this._sandbox.getRequestBuilder('HideMapMarkerRequest')());
   }

}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin
 * Provides indexmap functionality for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 *      JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
    this._indexMap = null;
    // TODO: location was previously gotten from Oskari.$.startup, but this might not be any better
    this._indexMapUrl = '/Oskari/resources/framework/bundle/mapmodule-plugin/plugin/indexmap/images/suomi25m_tm35fin.png';
    //ikoni_indeksikartta.png';
}, {
    /** @static @property __name plugin name */
    __name : 'IndexMapPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {

        /* overview map */
        var graphic = new OpenLayers.Layer.Image('Overview map image', this._indexMapUrl, new OpenLayers.Bounds(26783, 6608595, 852783, 7787250), new OpenLayers.Size(120, 173));

        /*
         * create an overview map control with non-default
         * options
         */
        var controlOptions = {
            mapOptions : {
                maxExtent : new OpenLayers.Bounds(26783, 6608595, 852783, 7787250),
                units : 'm',
                projection : this._map.getProjection(),
                numZoomLevels : 1
            },
            layers : [graphic],
            size : new OpenLayers.Size(120, 173),
            autoPan : false
        };

        /* Indexmap */
        this._indexMap = new OpenLayers.Control.OverviewMap(controlOptions);
        //
        //this._overviewMap.id = "index-map-" + this.getName();
        //this._overviewMap.title = 'mapcontrolsservice_indexmap_title';

    },
    /**
     * @method register
     *
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     *
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this.getMapModule().addMapControl('overviewMap', this._indexMap);
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        this.getMapModule().removeMapControl('overviewMap');

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            if(this._indexMap) {
                this._indexMap.update();
            }
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if
     * not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin
 * Provides scalebar functionality for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Object} config
 *      JSON config with params needed to run the plugin
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._conf = config;
    this._scalebar = null;
}, {
    /** @static @property __name plugin name */
    __name : 'ScaleBarPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {

        this._scalebar = new OpenLayers.Control.ScaleLine();
        //this._scalebar.id = 'scaleBar';
    },
    /**
     * @method register
     *
     * Interface method for the module protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     *
     * Interface method for the module protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }
        this.getMapModule().addMapControl('scaleBar', this._scalebar);
    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        this.getMapModule().removeMapControl('scaleBar');

        for(p in this.eventHandlers ) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            if(this._scalebar) {
                this._scalebar.update();
            }
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if
     * not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map implementation. 
 * It provides handling for rearranging layer order and controlling layer visibility. 
 * Provides information to other bundles if a layer becomes visible/invisible 
 * (out of scale/out of content geometry) and request handlers to move map to location/scale 
 * based on layer content. Also optimizes openlayers maplayers visibility setting 
 * if it detects that content is not in the viewport.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.mapModule = null;
	this.pluginName = null;
	this._sandbox = null;
	this._map = null;
	this._supportedFormats = {};
	// visibility checks are cpu intensive so only make them when tha map has stopped moving
	// after map move stopped -> activate a timer that will
	// do the check after _visibilityPollingInterval milliseconds
	this._visibilityPollingInterval = 1500;
	this._visibilityCheckOrder = 0;
	this._previousTimer = null;
}, {
    /** @static @property __name module name */
	__name : 'LayersPlugin',

    /**
     * @method getName
     * @return {String} module name
     */
	getName : function() {
		return this.pluginName;
	},
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
	getMapModule : function() {
		return this.mapModule;
	},
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
	setMapModule : function(mapModule) {
		this.mapModule = mapModule;
		this.pluginName = mapModule.getName() + this.__name;
	},
    /**
     * @method getMap
     * @return {OpenLayers.Map} reference to map implementation
     * 
     */
	getMap : function() {
		return this._map;
	},
    /**
     * @method register
     * Interface method for the module protocol
     */
	register : function() {
		/*this.getMapModule().setLayerPlugin('layers', this);*/
	},
    /**
     * @method unregister
     * Interface method for the module protocol
     */
	unregister : function() {
		/*this.getMapModule().setLayerPlugin('layers', null);*/
	},
    /**
     * @method init
     *
     * Interface method for the module protocol. Initializes the request handlers.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
	init : function(sandbox) {
		this.requestHandlers = {
			layerVisibilityHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler', sandbox, this),
			layerContentHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler', sandbox, this)
		};
	},
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Registers requesthandlers and eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		this._map = this.getMapModule().getMap();
		sandbox.register(this);
		for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}
		sandbox.addRequestHandler('MapModulePlugin.MapLayerVisibilityRequest', this.requestHandlers.layerVisibilityHandler);
		sandbox.addRequestHandler('MapModulePlugin.MapMoveByLayerContentRequest', this.requestHandlers.layerContentHandler);

	},
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol. Unregisters requesthandlers and eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
	stopPlugin : function(sandbox) {

		sandbox.removeRequestHandler('MapModulePlugin.MapLayerVisibilityRequest', this.requestHandlers.layerVisibilityHandler);
		sandbox.removeRequestHandler('MapModulePlugin.MapMoveByLayerContentRequest', this.requestHandlers.layerContentHandler);
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);

		this._map = null;
		this._sandbox = null;
	},
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
	start : function(sandbox) {
	},
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
	stop : function(sandbox) {
	},
    /**
     * @property {Object} eventHandlers
     * @static
     */
	eventHandlers : {
		'AfterRearrangeSelectedMapLayerEvent' : function(event) {
			this._afterRearrangeSelectedMapLayerEvent(event);
		},
		'MapMoveStartEvent' : function() {
			// clear out any previous visibility check when user starts to move map
			// not always sent f.ex. when moving with keyboard so do this in AfterMapMoveEvent also
			this._visibilityCheckOrder++;
			if(this._previousTimer) {
				clearTimeout(this._previousTimer);
				this._previousTimer = null;
			}
		},
		'AfterMapMoveEvent' : function() {
			var me = this;
			// throttle requests with small delay
			if(this._previousTimer) {
				clearTimeout(this._previousTimer);
				this._previousTimer = null;
			}
			this._visibilityCheckOrder++;
			this._previousTimer = setTimeout(function() {
				me._checkLayersVisibility(me._visibilityCheckOrder);
			}, this._visibilityPollingInterval);
		},
		'AfterMapLayerAddEvent' : function(event) {
			// parse geom if available
			this._parseGeometryForLayer(event.getMapLayer());
		}
	},

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [event]);
	},
	/**
	 * @method preselectLayers
	 * Does nothing, protocol method for mapmodule-plugin
	 */
	preselectLayers : function(layers) {
	},
	/**
	 * @method _parseGeometryForLayer
	 * @private
	 * @param
	 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
	 *            layer layer for which to parse geometry
	 *
	 * If layer.getGeometry() is empty, tries to parse layer.getGeometryWKT()
	 * and set parsed geometry to the layer
	 */
	_parseGeometryForLayer : function(layer) {

		// parse geometry if available
		if(layer.getGeometry().length == 0) {
			var layerWKTGeom = layer.getGeometryWKT();
			if(!layerWKTGeom) {
				// no wkt, dont parse
				return;
			}
			// http://dev.openlayers.org/docs/files/OpenLayers/Format/WKT-js.html
			// parse to OpenLayers.Geometry.Geometry[] array -> layer.setGeometry();
			var wkt = new OpenLayers.Format.WKT();

			var features = wkt.read(layerWKTGeom);
			if(features) {
				if(features.constructor != Array) {
					features = [features];
				}
				var geometries = [];
				for(var i = 0; i < features.length; ++i) {
					geometries.push(features[i].geometry);
				}
				layer.setGeometry(geometries);
			} else {
				// 'Bad WKT';
			}
		}
	},
	/**
	 * @method _checkLayersVisibility
	 * @private
	 * Loops through selected layers and notifies other modules about visibility changes
	 * @param {Number} orderNumber checks orderNumber against #_visibilityCheckOrder 
	 * 		to see if this is the latest check, if not - does nothing
	 */
	_checkLayersVisibility : function(orderNumber) {
		if(orderNumber != this._visibilityCheckOrder) {
			return;
		}
		var layers = this._sandbox.findAllSelectedMapLayers();
		for(var i = 0; i < layers.length; ++i) {
			var layer = layers[i];
			if(!layer.isVisible()) {
				// don't go further if not visible
				continue;
			}
			this.notifyLayerVisibilityChanged(layer);
		}
		this._visibilityCheckScheduled = false;
	},
	/**
	 * @method _isInScale
	 * @private
	 * Checks if the maps scale is in the given maplayers scale range 
	 * @param
	 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
	 *            layer layer to check scale against
	 */
	_isInScale : function(layer) {
		var scale = this._sandbox.getMap().getScale();
		return layer.isInScale(scale);
	},
	/**
	 * @method isInGeometry
	 * If the given layer has geometry, checks if it is the maps viewport.
	 * If layer doesn't have geometry, returns always true since then we can't determine this.
	 * @param
	 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
	 *            layer layer to check against
	 */
	isInGeometry : function(layer) {
		var geometries = layer.getGeometry();
		var bounds = null;
		for(var i = 0; i < geometries.length; ++i) {
			if(!bounds) {
				bounds = geometries[i].getBounds();
			} else {
				bounds.extend(geometries[i].getBounds());
			}
		}
		if(bounds) {
			return this.getMap().getExtent().intersectsBounds(bounds);
		}
		return true;
	},
	/**
	 * @method notifyLayerVisibilityChanged
	 * If the given layer has geometry, checks if it is the maps viewport.
	 * If layer doesn't have geometry, returns always true since then we can't determine this.
	 * @param
	 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
	 *            layer layer to check against
	 */
	notifyLayerVisibilityChanged : function(layer) {
		var scaleOk = layer.isVisible();
		var geometryMatch = layer.isVisible();
		// if layer is visible check actual values
		if(layer.isVisible()) {
			scaleOk = this._isInScale(layer);
			geometryMatch = this.isInGeometry(layer);
		}
		// setup openlayers visibility
		// NOTE: DO NOT CHANGE visibility in internal layer object (it will change in UI also)
		// this is for optimization purposes
		var map = this.getMap();
		if(scaleOk && geometryMatch && layer.isVisible()) {
			// show non-baselayer if in scale, in geometry and layer visible
			var mapLayer = map.getLayersByName('layer_' + layer.getId());
			if(mapLayer && mapLayer.setVisibility) {
				mapLayer.setVisibility(true);
				mapLayer.display(true);
			}
		} else {
			// otherwise hide non-baselayer
			var mapLayer = map.getLayersByName('layer_' + layer.getId());
			if(mapLayer && mapLayer.setVisibility) {
				mapLayer.setVisibility(false);
				mapLayer.display(false);
			}
		}
		var event = this._sandbox.getEventBuilder('MapLayerVisibilityChangedEvent')(layer, scaleOk, geometryMatch);
		this._sandbox.notifyAll(event);
	},
	/**
	 * @method _afterRearrangeSelectedMapLayerEvent
	 * 
	 * Handles AfterRearrangeSelectedMapLayerEvent. 
	 * Changes the layer order in Openlayers to match the selected layers list in Oskari. 
	 *
	 * @param {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent}
	 *            event
	 */
	_afterRearrangeSelectedMapLayerEvent : function(event) {
		var layers = this._sandbox.findAllSelectedMapLayers();
		var layerIndex = 0;

		var opLayersLength = this._map.layers.length;

		var changeLayer = this._map.getLayersByName('Markers');
		if(changeLayer.length > 0) {
			this._map.setLayerIndex(changeLayer[0], opLayersLength);
			opLayersLength--;
		}

		for(var i = 0; i < layers.length; i++) {

			if(layers[i].isBaseLayer()) {
				for(var bl = 0; bl < layers[i].getSubLayers().length; bl++) {
					var changeLayer = this._map.getLayersByName('basemap_' + layers[i]
					.getSubLayers()[bl].getId());
					this._map.setLayerIndex(changeLayer[0], layerIndex);
					layerIndex++;
				}
			} else if(layers[i].isLayerOfType('WFS')) {
				var wfsReqExp = new RegExp('wfs_layer_' + layers[i].getId() + '_WFS_LAYER_IMAGE*', 'i');
				var mapLayers = this._map.getLayersByName(wfsReqExp);
				for(var k = 0; k < mapLayers.length; k++) {
					this._map.setLayerIndex(mapLayers[k], layerIndex);
					layerIndex++;
				}

				var wfsReqExp = new RegExp('wfs_layer_' + layers[i].getId() + '_HIGHLIGHTED_FEATURE*', 'i');
				var changeLayer = this._map.getLayersByName(wfsReqExp);
				if(changeLayer.length > 0) {
					this._map.setLayerIndex(changeLayer[0], layerIndex);
					layerIndex++;
				}

			} else {
				var changeLayer = this._map.getLayersByName('layer_' + layers[i].getId());
				this._map.setLayerIndex(changeLayer[0], layerIndex);
				layerIndex++;
			}
		}
	}
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
	'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest
 * Requests visibility change for maplayer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in Oskari.mapframework.service.MapLayerService
 * @param {Boolean}
 *            visible boolean if map layer should be visible or not
 */
function(mapLayerId, visible) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
    this._visible = visible;

}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.MapLayerVisibilityRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in
     * Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    },
    /**
     * @method getVisible
     * @return {Boolean} boolean if map layer should be visible or not
     */
    getVisible : function() {
        return this._visible;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler
 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 * @param {Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin} layersPlugin
 * 			reference to layersplugin
 */
function(sandbox, layersPlugin) {
    this.sandbox = sandbox;
    this.layersPlugin = layersPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Shows/hides the maplayer specified in the request in OpenLayers implementation.
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        var layerId = request.getMapLayerId();
        var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
        	return;
        }
        layer.setVisible(request.getVisible());
        var map = this.layersPlugin.getMap();
		if (layer.isBaseLayer()) {
			for ( var bl = 0; bl < layer.getSubLayers().length; bl++) {
				var mapLayer = map.getLayersByName('basemap_' + layer.getSubLayers()[bl].getId());
				mapLayer[0].setVisibility(layer.isVisible());
				mapLayer[0].display(layer.isVisible());
			}
		} else {
			var mapLayer = map.getLayersByName('layer_' + layer.getId());
			mapLayer[0].setVisibility(layer.isVisible());
			mapLayer[0].display(layer.isVisible());
		}
		
		// notify other components
    	this.layersPlugin.notifyLayerVisibilityChanged(layer);
   }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest
 * Requests map to move to location/scale where given layer has content
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in Oskari.mapframework.service.MapLayerService
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "MapModulePlugin.MapMoveByLayerContentRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in
     * Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});/**
 * @class Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler
 * Provides functionality to:
 * - Move the map to zoom level that is in scale with the requested maplayer.
 * - Move the map to given layers geometry if it has one.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler', 
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
 * 			reference to application sandbox
 * @param {Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin} layersPlugin
 * 			reference to layersplugin
 */
function(sandbox, layersPlugin) {
    this.sandbox = sandbox;
    this.layersPlugin = layersPlugin; 
}, {
	/**
	 * @method handleRequest 
	 * Moves the map to zoom level that is in scale with the requested maplayer.
	 * Also moves the map to given layers geometry if it has one.
	 * @param {Oskari.mapframework.core.Core} core
	 * 		reference to the application core (reference sandbox core.getSandbox())
	 * @param {Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequest} request
	 * 		request to handle
	 */
    handleRequest : function(core, request) {
        var layerId = request.getMapLayerId();
        var layer = this.sandbox.findMapLayerFromSelectedMapLayers(layerId);
        if(!layer) {
        	return;
        }

		// set zoom level by layer scales
        var newZoom = this.layersPlugin.getMapModule().getClosestZoomLevel(layer.getMinScale(), layer.getMaxScale());
        // suppress mapmove-event here and send it after we have possibly also moved the map
        this.layersPlugin.getMapModule().setZoomLevel(newZoom, true);
        
        // move map to geometries if available
        // this needs to be done after the zoom since it's comparing to viewport which changes in zoom
        if(layer.getGeometry().length > 0) {
        	var containsGeometry = this.layersPlugin.isInGeometry(layer);
        	// only move if not currently in geometry
        	if(!containsGeometry) {
		    	var center = layer.getGeometry()[0].getCentroid();
		    	this.layersPlugin.getMapModule().moveMapToLanLot(new OpenLayers.LonLat(center.x, center.y));
        	}
	    }
	    // notify components that the map has moved
        this.layersPlugin.getMapModule().notifyMoveEnd();
        // force visibility check immediately bypassing the performance
        // scheduler thats triggered by notifymoveend
        this.layersPlugin._checkLayersVisibility(this.layersPlugin._visibilityCheckOrder);
    }
    
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.event.MapLayerVisibilityChangedEvent
 * 
 * This is used to notify that layers visibility has changed. Either the map has 
 * moved out of the layers scale range or the layers geometry is no longer in the maps viewport.
 * Listeners should also check getMapLayer().getVisible() method that indicates if the map has been hidden by the user.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.event.MapLayerVisibilityChangedEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *      mapLayer maplayer thats visibility changed
 * 
 * @param {Boolean} inScale
 * 		true if layer is in scale
 * @param {Boolean} geometryMatch
 * 		(optional, defaults to true) true if geometry is in current map bbox
 */
    function(mapLayer, inScale, geometryMatch) {
        this._mapLayer = mapLayer;
        this._inScale = (inScale == true);
        // default to true
        this._geomMatch = (geometryMatch != false);
}, {
    /** @static @property __name event name */
    __name : "MapLayerVisibilityChangedEvent",
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
 	 * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method isInScale
 	 * @return {Boolean} true if layer is in scale
     */
    isInScale : function() {
        return this._inScale;
    },
    /**
     * @method isGeometryMatch
 	 * @return {Boolean} true if in scale/geometry is visible
     */
    isGeometryMatch : function() {
        return this._geomMatch;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
/**
 *
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.WmsLayerPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
}, {
    __name : 'WmsLayerPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    register : function() {
        this.getMapModule().setLayerPlugin('wmslayer', this);
    },
    unregister : function() {
        this.getMapModule().setLayerPlugin('wmslayer', null);
    },
    init : function(sandbox) {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    },
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this.afterChangeMapLayerStyleEvent(event);
        }
    },

    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     *
     */
    preselectLayers : function(layers) {

        var sandbox = this._sandbox;
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(!layer.isLayerOfType('WMS'))
                continue;

            sandbox.printDebug("preselecting " + layerId);
            this.addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /***************************************************************************
     * Handle AfterMapLaeyrAddEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerAddEvent : function(event) {
        this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * primitive for adding layer to this map
     */
    addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        if(!layer.isLayerOfType('WMS')) {
            return;
        }
        this._sandbox.printDebug(" [SnappyWMSLayer]  Creating " + 
                                 layer.getId() + 
                                 " KEEP ON TOP ? " + 
                                 keepLayerOnTop + 
                                 " BASE? " + 
                                 isBaseMap);

        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.removeLayer(markerLayer[mlIdx], false);
                }
            }
        }

        if(layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap == true) {
			if(layer.getSubLayers().length > 0) {
                /**
                 * loop all basemap layers and add these on the map
                 */
                for(var i = 0; i < layer.getSubLayers().length; i++) {

                    var layerUrls = "";
                    for(var j = 0; j < layer.getSubLayers()[i].getWmsUrls().length; j++) {
                        layerUrls += layer.getSubLayers()[i]
                        .getWmsUrls()[j];
                    }

                    var layerScales = this.getMapModule().calculateLayerScales(layer
                    .getSubLayers()[i].getMaxScale(), layer
                    .getSubLayers()[i].getMinScale());

                    var WMS = Oskari.$("SnappyWMSLayer");
                    var openLayer = new WMS('basemap_' + layer.getSubLayers()[i].getId(), 
                                            layer.getSubLayers()[i].getWmsUrls(), {
                        layers : layer.getSubLayers()[i].getWmsName(),
                        transparent : true,
                        id : layer.getSubLayers()[i].getId(),
                        styles : layer.getSubLayers()[i].getCurrentStyle().getName(),
                        format : "image/png"
                    }, {
                        layerId : layer.getSubLayers()[i].getWmsName(),
                        scales : layerScales,
                        isBaseLayer : false,
                        displayInLayerSwitcher : true,
                        visibility : true,
                        buffer : 0
                    });

                    openLayer.opacity = layer.getOpacity() / 100;

                    this.attachLoadingStatusToLayer(openLayer, true, layer);

                    this._map.addLayer(openLayer);

                    this._sandbox.printDebug(" [SnappyWMSLayer]  Created SnappyGrid for WMS WITH SUBLAYERS for " + layer.getId());

                    if(!keepLayerOnTop) {
                        this._map.setLayerIndex(openLayer, 0);
                    }

                }

            } else {
                var layerScales = this.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());

                var WMS = Oskari.$("SnappyWMSLayer");
                var openLayer = new WMS('layer_' + layer.getId(), layer.getWmsUrls(), {
                    layers : layer.getWmsName(),
                    transparent : true,
                    id : layer.getId(),
                    styles : layer.getCurrentStyle().getName(),
                    format : "image/png"
                }, {
                    layerId : layer.getWmsName(),
                    scales : layerScales,
                    isBaseLayer : false,
                    displayInLayerSwitcher : true,
                    visibility : true,
                    buffer : 0
                });

                openLayer.opacity = layer.getOpacity() / 100;

                this.attachLoadingStatusToLayer(openLayer, true, layer);

                this._map.addLayer(openLayer);

                this._sandbox.printDebug(" [SnappyWMSLayer]  Created SnappyGrid for WMS WITH SUBLAYERS for " + layer.getId());

                if(keepLayerOnTop) {
                    this._map.setLayerIndex(openLayer, this._map.layers.length);
                } else {
                    this._map.setLayerIndex(openLayer, 0);
                }
            }

        } else {

            var layerScales = this.getMapModule().calculateLayerScales(layer.getMaxScale(), layer.getMinScale());
            var WMS = Oskari.$("SnappyWMSLayer");
            var openLayer = new WMS('layer_' + layer.getId(), layer.getWmsUrls(), {
                layers : layer.getWmsName(),
                transparent : true,
                id : layer.getId(),
                styles : layer.getCurrentStyle().getName(),
                format : "image/png"
            }, {
                layerId : layer.getWmsName(),
                scales : layerScales,
                isBaseLayer : false,
                displayInLayerSwitcher : true,
                visibility : true,
                buffer : 0
            });

            this.attachLoadingStatusToLayer(openLayer, true, layer);
            openLayer.opacity = layer.getOpacity() / 100;

            this._map.addLayer(openLayer);

            this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for " + layer.getId());

            if(keepLayerOnTop) {
                this._map.setLayerIndex(openLayer, this._map.layers.length);
            } else {
                this._map.setLayerIndex(openLayer, 0);
            }

        }
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.addLayer(markerLayer[mlIdx]);
                }
            }
        }
    },
    /***************************************************************************
     * Handle AfterMapLayerRemoveEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();

        this.removeMapLayerFromMap(layer);
    },
    removeMapLayerFromMap : function(layer) {

        if(!layer.isLayerOfType('WMS'))
            return;

        if(layer.isBaseLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
                    var remLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                    remLayer[0].destroy();
                }
            } else {
                var remLayer = this._map.getLayersByName('layer_' + layer.getId());
                remLayer[0].destroy();
            }
        } else {
            var remLayer = this._map.getLayersByName('layer_' + layer.getId());
            /* This should free all memory */
            remLayer[0].destroy();
        }
    },
    getOLMapLayers : function(layer) {

        if(!layer.isLayerOfType('WMS'))
            return null;

        if(layer.isBaseLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
                    return this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                }
            } else {
                return this._map.getLayersByName('layer_' + layer.getId());
            }
        } else {
            return this._map.getLayersByName('layer_' + layer.getId());
        }
        return null;
    },
    /***************************************************************************
     * Handle AfterChangeMapLayerOpacityEvent
     *
     * @param {Object}
     *            event
     */
    afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType('WMS'))
            return;

        if(layer.isBaseLayer() || layer.isGroupLayer()) {
            if(layer.getSubLayers().length > 0) {
                for(var bl = 0; bl < layer.getSubLayers().length; bl++) {
                    var mapLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
                if(mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(mapLayer[0] != null) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        }
    },
    /***************************************************************************
     * Handle AfterChangeMapLayerStyleEvent
     *
     * @param {Object}
     *            event
     */
    afterChangeMapLayerStyleEvent : function(event) {
        var layer = event.getMapLayer();

        /** Change selected layer style to defined style */
        if(!layer.isBaseLayer()) {
            var styledLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(styledLayer != null) {
                styledLayer[0].mergeNewParams({
                    styles : layer.getCurrentStyle().getName()
                });
            }
        }
    },
    /**
     * Registeres load events to layer that will notify when map is ready
     *
     * @param {Object}
     *            openLayer openLayer object
     * @param {Boolean}
     *            isWms is this a wms layer
     * @param {Layer}
     *            portti layer
     */
    attachLoadingStatusToLayer : function(openLayer, isWms, layer) {
        var sandbox = this._sandbox;
        var me = this;
        
		
        var statusText = this.getMapModule().getLocalization('status_update_map') + " '" + layer.getName() + "'...";

        /* Notify that loading has started */
        openLayer.events.register("loadstart", openLayer, function() {
            sandbox.request(me, sandbox.getRequestBuilder('ActionStartRequest')(openLayer.id, statusText, true));
        });
        /* Notify that Map is ready */
        openLayer.events.register("loadend", openLayer, function() {
            sandbox.request(me, sandbox.getRequestBuilder('ActionReadyRequest')(openLayer.id, true));
        });
        /* Notify that Map is ready */
        openLayer.events.register("loadcancel", openLayer, function() {
            sandbox.request(me, sandbox.getRequestBuilder('ActionReadyRequest')(openLayer.id, true));
        });
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/* Copyright (c) 2006-2010 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/HTTPRequest.js
 * @requires OpenLayers/Console.js
 */

/**
 * @class OpenLayers.Layer.SnappyGrid
 * Base class for layers that use a lattice of tiles.  Create a new grid
 * layer with the <OpenLayers.Layer.Grid> constructor.
 *
 * Inherits from:
 *  - <OpenLayers.Layer.HTTPRequest>
 */
Oskari.$("SnappyGrid",OpenLayers.Class(OpenLayers.Layer.HTTPRequest, {
    
    /**
     * APIProperty: tileSize
     * {<OpenLayers.Size>}
     */
    tileSize: null,
    
    /**
     * Property: grid
     * {Array(Array(<OpenLayers.Tile>))} This is an array of rows, each row is 
     *     an array of tiles.
     */
    grid: null,

    /**
     * APIProperty: singleTile
     * {Boolean} Moves the layer into single-tile mode, meaning that one tile 
     *     will be loaded. The tile's size will be determined by the 'ratio'
     *     property. When the tile is dragged such that it does not cover the 
     *     entire viewport, it is reloaded.
     */
    singleTile: false,

    /** APIProperty: ratio
     *  {Float} Used only when in single-tile mode, this specifies the 
     *          ratio of the size of the single tile to the size of the map.
     */
    ratio: 1.5,

    /**
     * APIProperty: buffer
     * {Integer} Used only when in gridded mode, this specifies the number of 
     *           extra rows and colums of tiles on each side which will
     *           surround the minimum grid tiles to cover the map.
     */
    buffer: 2,

    /**
     * APIProperty: numLoadingTiles
     * {Integer} How many tiles are still loading?
     */
    numLoadingTiles: 0,

    /**
     * Constructor: OpenLayers.Layer.Grid
     * Create a new grid layer
     *
     * Parameters:
     * name - {String}
     * url - {String}
     * params - {Object}
     * options - {Object} Hashtable of extra options to tag onto the layer
     */
    initialize: function(name, url, params, options) {
        OpenLayers.Layer.HTTPRequest.prototype.initialize.apply(this, 
                                                                arguments);
        
        //grid layers will trigger 'tileloaded' when each new tile is 
        // loaded, as a means of progress update to listeners.
        // listeners can access 'numLoadingTiles' if they wish to keep track
        // of the loading progress
        //
        this.events.addEventType("tileloaded");

        this.grid = [];
    },

    /**
     * APIMethod: destroy
     * Deconstruct the layer and clear the grid.
     */
    destroy: function() {
        this.clearGrid();
        this.grid = null;
        this.tileSize = null;
        OpenLayers.Layer.HTTPRequest.prototype.destroy.apply(this, arguments); 
    },

    /**
     * Method: clearGrid
     * Go through and remove all tiles from the grid, calling
     *    destroy() on each of them to kill circular references
     */
    clearGrid:function() {
        if (this.grid) {
            for(var iRow=0, len=this.grid.length; iRow<len; iRow++) {
                var row = this.grid[iRow];
                for(var iCol=0, clen=row.length; iCol<clen; iCol++) {
                    var tile = row[iCol];
                    this.removeTileMonitoringHooks(tile);
                    tile.destroy();
                }
            }
            this.grid = [];
        }
    },

    /**
     * APIMethod: clone
     * Create a clone of this layer
     *
     * Parameters:
     * obj - {Object} Is this ever used?
     * 
     * Returns:
     * {<OpenLayers.Layer.Grid>} An exact clone of this OpenLayers.Layer.Grid
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.Grid(this.name,
                                            this.url,
                                            this.params,
                                            this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.HTTPRequest.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here
        if (this.tileSize != null) {
            obj.tileSize = this.tileSize.clone();
        }
        
        // we do not want to copy reference to grid, so we make a new array
        obj.grid = [];

        return obj;
    },    

    /**
     * Method: moveTo
     * This function is called whenever the map is moved. All the moving
     * of actual 'tiles' is done by the map, but moveTo's role is to accept
     * a bounds and make sure the data that that bounds requires is pre-loaded.
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     * zoomChanged - {Boolean}
     * dragging - {Boolean}
     */
    moveTo:function(bounds, zoomChanged, dragging) {
        OpenLayers.Layer.HTTPRequest.prototype.moveTo.apply(this, arguments);
        
        bounds = bounds || this.map.getExtent();

        if (bounds != null) {
             
            // if grid is empty or zoom has changed, we *must* re-tile
            var forceReTile = !this.grid.length || zoomChanged;

            // total bounds of the tiles
            var tilesBounds = this.getTilesBounds();            
      
            if (this.singleTile) {
                
                // We want to redraw whenever even the slightest part of the 
                //  current bounds is not contained by our tile.
                //  (thus, we do not specify partial -- its default is false)
                if ( forceReTile || 
                     (!dragging && !tilesBounds.containsBounds(bounds))) {
                    this.initSingleTile(bounds);
                }
            } else {
             
                // if the bounds have changed such that they are not even 
                //  *partially* contained by our tiles (IE user has 
                //  programmatically panned to the other side of the earth) 
                //  then we want to reTile (thus, partial true).  
                //
                if (forceReTile || !tilesBounds.containsBounds(bounds, true)) {
                    this.initGriddedTiles(bounds);
                } else {
                    //we might have to shift our buffer tiles
                    this.moveGriddedTiles(bounds);
                }
            }
        }
    },
    
    /**
     * APIMethod: setTileSize
     * Check if we are in singleTile mode and if so, set the size as a ratio
     *     of the map size (as specified by the layer's 'ratio' property).
     * 
     * Parameters:
     * size - {<OpenLayers.Size>}
     */
    setTileSize: function(size) { 
        if (this.singleTile) {
            size = this.map.getSize();
            size.h = parseInt(size.h * this.ratio);
            size.w = parseInt(size.w * this.ratio);
        } 
        OpenLayers.Layer.HTTPRequest.prototype.setTileSize.apply(this, [size]);
    },
        
    /**
     * Method: getGridBounds
     * Deprecated. This function will be removed in 3.0. Please use 
     *     getTilesBounds() instead.
     * 
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object representing the bounds of all the
     * currently loaded tiles (including those partially or not at all seen 
     * onscreen)
     */
    getGridBounds: function() {
        var msg = "The getGridBounds() function is deprecated. It will be " +
                  "removed in 3.0. Please use getTilesBounds() instead.";
        OpenLayers.Console.warn(msg);
        return this.getTilesBounds();
    },

    /**
     * APIMethod: getTilesBounds
     * Return the bounds of the tile grid.
     *
     * Returns:
     * {<OpenLayers.Bounds>} A Bounds object representing the bounds of all the
     *     currently loaded tiles (including those partially or not at all seen 
     *     onscreen).
     */
    getTilesBounds: function() {    
        var bounds = null; 
        
        if (this.grid.length) {
            var bottom = this.grid.length - 1;
            var bottomLeftTile = this.grid[bottom][0];
    
            var right = this.grid[0].length - 1; 
            var topRightTile = this.grid[0][right];
    
            bounds = new OpenLayers.Bounds(bottomLeftTile.bounds.left, 
                                           bottomLeftTile.bounds.bottom,
                                           topRightTile.bounds.right, 
                                           topRightTile.bounds.top);
            
        }   
        return bounds;
    },

    /**
     * Method: initSingleTile
     * 
     * Parameters: 
     * bounds - {<OpenLayers.Bounds>}
     */
    initSingleTile: function(bounds) {

        //determine new tile bounds
        var center = bounds.getCenterLonLat();
        var tileWidth = bounds.getWidth() * this.ratio;
        var tileHeight = bounds.getHeight() * this.ratio;
                                       
        var tileBounds = 
            new OpenLayers.Bounds(center.lon - (tileWidth/2),
                                  center.lat - (tileHeight/2),
                                  center.lon + (tileWidth/2),
                                  center.lat + (tileHeight/2));
  
        var ul = new OpenLayers.LonLat(tileBounds.left, tileBounds.top);
        var px = this.map.getLayerPxFromLonLat(ul);

        if (!this.grid.length) {
            this.grid[0] = [];
        }

        var tile = this.grid[0][0];
        if (!tile) {
            tile = this.addTile(tileBounds, px);
            
            this.addTileMonitoringHooks(tile);
            tile.draw();
            this.grid[0][0] = tile;
        } else {
            tile.moveTo(tileBounds, px);
        }           
        
        //remove all but our single tile
        this.removeExcessTiles(1,1);
    },

    /** 
     * Method: calculateGridLayout
     * Generate parameters for the grid layout. This  
     *
     * Parameters:
     * bounds - {<OpenLayers.Bound>}
     * extent - {<OpenLayers.Bounds>}
     * resolution - {Number}
     *
     * Returns:
     * Object containing properties tilelon, tilelat, tileoffsetlat,
     * tileoffsetlat, tileoffsetx, tileoffsety
     */
    calculateGridLayout: function(bounds, extent, resolution) {
        var tilelon = resolution * this.tileSize.w;
        var tilelat = resolution * this.tileSize.h;
        
        var offsetlon = bounds.left - extent.left;
        var tilecol = Math.floor(offsetlon/tilelon) - this.buffer;
        var tilecolremain = offsetlon/tilelon - tilecol;
        var tileoffsetx = -tilecolremain * this.tileSize.w;
        var tileoffsetlon = extent.left + tilecol * tilelon;
        
        var offsetlat = bounds.top - (extent.bottom + tilelat);  
        var tilerow = Math.ceil(offsetlat/tilelat) + this.buffer;
        var tilerowremain = tilerow - offsetlat/tilelat;
        var tileoffsety = -tilerowremain * this.tileSize.h;
        var tileoffsetlat = extent.bottom + tilerow * tilelat;
        
        return { 
          tilelon: tilelon, tilelat: tilelat,
          tileoffsetlon: tileoffsetlon, tileoffsetlat: tileoffsetlat,
          tileoffsetx: tileoffsetx, tileoffsety: tileoffsety
        };

    },

    /**
     * Method: initGriddedTiles
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    initGriddedTiles:function(bounds) {
        
        // work out mininum number of rows and columns; this is the number of
        // tiles required to cover the viewport plus at least one for panning

        var viewSize = this.map.getSize();
        var minRows = Math.ceil(viewSize.h/this.tileSize.h) + 
                      Math.max(1, 2 * this.buffer);
        var minCols = Math.ceil(viewSize.w/this.tileSize.w) +
                      Math.max(1, 2 * this.buffer);
        
        var extent = this.getMaxExtent();
        var resolution = this.map.getResolution();
        
        var tileLayout = this.calculateGridLayout(bounds, extent, resolution);

        var tileoffsetx = Math.round(tileLayout.tileoffsetx); // heaven help us
        var tileoffsety = Math.round(tileLayout.tileoffsety);

        var tileoffsetlon = tileLayout.tileoffsetlon;
        var tileoffsetlat = tileLayout.tileoffsetlat;
        
        var tilelon = tileLayout.tilelon;
        var tilelat = tileLayout.tilelat;

        this.origin = new OpenLayers.Pixel(tileoffsetx, tileoffsety);

        var startX = tileoffsetx; 
        var startLon = tileoffsetlon;

        var rowidx = 0;
        
        var layerContainerDivLeft = parseInt(this.map.layerContainerDiv.style.left);
        var layerContainerDivTop = parseInt(this.map.layerContainerDiv.style.top);
        
    
        do {
            var row = this.grid[rowidx++];
            if (!row) {
                row = [];
                this.grid.push(row);
            }

            tileoffsetlon = startLon;
            tileoffsetx = startX;
            var colidx = 0;
 
            do {
                var tileBounds = 
                    new OpenLayers.Bounds(tileoffsetlon, 
                                          tileoffsetlat, 
                                          tileoffsetlon + tilelon,
                                          tileoffsetlat + tilelat);

                var x = tileoffsetx;
                x -= layerContainerDivLeft;

                var y = tileoffsety;
                y -= layerContainerDivTop;

                var px = new OpenLayers.Pixel(x, y);
                var tile = row[colidx++];
                if (!tile) {
                    tile = this.addTile(tileBounds, px);
                    this.addTileMonitoringHooks(tile);
                    row.push(tile);
                } else {
                    tile.moveTo(tileBounds, px, false);
                }
     
                tileoffsetlon += tilelon;       
                tileoffsetx += this.tileSize.w;
            } while ((tileoffsetlon <= bounds.right + tilelon * this.buffer)
                     || colidx < minCols);
             
            tileoffsetlat -= tilelat;
            tileoffsety += this.tileSize.h;
        } while((tileoffsetlat >= bounds.bottom - tilelat * this.buffer)
                || rowidx < minRows);
        
        //shave off exceess rows and colums
        this.removeExcessTiles(rowidx, colidx);

        //now actually draw the tiles
        this.spiralTileLoad();
    },

    /**
     * Method: getMaxExtent
     * Get this layer's maximum extent. (Implemented as a getter for
     *     potential specific implementations in sub-classes.)
     *
     * Returns:
     * {OpenLayers.Bounds}
     */
    getMaxExtent: function() {
        return this.maxExtent;
    },
    
    /**
     * Method: spiralTileLoad
     *   Starts at the top right corner of the grid and proceeds in a spiral 
     *    towards the center, adding tiles one at a time to the beginning of a 
     *    queue. 
     * 
     *   Once all the grid's tiles have been added to the queue, we go back 
     *    and iterate through the queue (thus reversing the spiral order from 
     *    outside-in to inside-out), calling draw() on each tile. 
     */
    spiralTileLoad: function() {
        var tileQueue = [];
 
        var directions = ["right", "down", "left", "up"];

        var iRow = 0;
        var iCell = -1;
        var direction = OpenLayers.Util.indexOf(directions, "right");
        var directionsTried = 0;
        
        while( directionsTried < directions.length) {

            var testRow = iRow;
            var testCell = iCell;

            switch (directions[direction]) {
                case "right":
                    testCell++;
                    break;
                case "down":
                    testRow++;
                    break;
                case "left":
                    testCell--;
                    break;
                case "up":
                    testRow--;
                    break;
            } 
    
            // if the test grid coordinates are within the bounds of the 
            //  grid, get a reference to the tile.
            var tile = null;
            if ((testRow < this.grid.length) && (testRow >= 0) &&
                (testCell < this.grid[0].length) && (testCell >= 0)) {
                tile = this.grid[testRow][testCell];
            }
            
            if ((tile != null) && (!tile.queued)) {
                //add tile to beginning of queue, mark it as queued.
                tileQueue.unshift(tile);
                tile.queued = true;
                
                //restart the directions counter and take on the new coords
                directionsTried = 0;
                iRow = testRow;
                iCell = testCell;
            } else {
                //need to try to load a tile in a different direction
                direction = (direction + 1) % 4;
                directionsTried++;
            }
        } 
        
        // now we go through and draw the tiles in forward order
        for(var i=0, len=tileQueue.length; i<len; i++) {
            var tile = tileQueue[i];
            tile.draw();
            //mark tile as unqueued for the next time (since tiles are reused)
            tile.queued = false;       
        }
    },

    /**
     * APIMethod: addTile
     * Gives subclasses of Grid the opportunity to create an 
     * OpenLayer.Tile of their choosing. The implementer should initialize 
     * the new tile and take whatever steps necessary to display it.
     *
     * Parameters
     * bounds - {<OpenLayers.Bounds>}
     * position - {<OpenLayers.Pixel>}
     *
     * Returns:
     * {<OpenLayers.Tile>} The added OpenLayers.Tile
     */
    addTile:function(bounds, position) {
        // Should be implemented by subclasses
    },
    
    /** 
     * Method: addTileMonitoringHooks
     * This function takes a tile as input and adds the appropriate hooks to 
     *     the tile so that the layer can keep track of the loading tiles.
     * 
     * Parameters: 
     * tile - {<OpenLayers.Tile>}
     */
    addTileMonitoringHooks: function(tile) {
        
        tile.onLoadStart = function() {
            //if that was first tile then trigger a 'loadstart' on the layer
            if (this.numLoadingTiles == 0) {
                this.events.triggerEvent("loadstart");
            }
            this.numLoadingTiles++;
        };
        tile.events.register("loadstart", this, tile.onLoadStart);
      
        tile.onLoadEnd = function() {
            this.numLoadingTiles--;
            this.events.triggerEvent("tileloaded");
            //if that was the last tile, then trigger a 'loadend' on the layer
            if (this.numLoadingTiles == 0) {
                this.events.triggerEvent("loadend");
            }
        };
        tile.events.register("loadend", this, tile.onLoadEnd);
        tile.events.register("unload", this, tile.onLoadEnd);
    },

    /** 
     * Method: removeTileMonitoringHooks
     * This function takes a tile as input and removes the tile hooks 
     *     that were added in addTileMonitoringHooks()
     * 
     * Parameters: 
     * tile - {<OpenLayers.Tile>}
     */
    removeTileMonitoringHooks: function(tile) {
        tile.unload();
        tile.events.un({
            "loadstart": tile.onLoadStart,
            "loadend": tile.onLoadEnd,
            "unload": tile.onLoadEnd,
            scope: this
        });
    },
    
    /**
     * Method: moveGriddedTiles
     * 
     * Parameters:
     * bounds - {<OpenLayers.Bounds>}
     */
    moveGriddedTiles: function(bounds) {
        var buffer = this.buffer || 1;
        while (true) {
            var tlLayer = this.grid[0][0].position;
            var tlViewPort = 
                this.map.getViewPortPxFromLayerPx(tlLayer);
            if (tlViewPort.x > -this.tileSize.w * (buffer - 1)) {
                this.shiftColumn(true);
            } else if (tlViewPort.x < -this.tileSize.w * buffer) {
                this.shiftColumn(false);
            } else if (tlViewPort.y > -this.tileSize.h * (buffer - 1)) {
                this.shiftRow(true);
            } else if (tlViewPort.y < -this.tileSize.h * buffer) {
                this.shiftRow(false);
            } else {
                break;
            }
        };
    },

    /**
     * Method: shiftRow
     * Shifty grid work
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftRow:function(prepend) {
        var modelRowIndex = (prepend) ? 0 : (this.grid.length - 1);
        var grid = this.grid;
        var modelRow = grid[modelRowIndex];

        var resolution = this.map.getResolution();
        var deltaY = (prepend) ? -this.tileSize.h : this.tileSize.h;
        var deltaLat = resolution * -deltaY;

        var row = (prepend) ? grid.pop() : grid.shift();

        for (var i=0, len=modelRow.length; i<len; i++) {
            var modelTile = modelRow[i];
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.bottom = bounds.bottom + deltaLat;
            bounds.top = bounds.top + deltaLat;
            position.y = position.y + deltaY;
            row[i].moveTo(bounds, position);
        }

        if (prepend) {
            grid.unshift(row);
        } else {
            grid.push(row);
        }
    },

    /**
     * Method: shiftColumn
     * Shift grid work in the other dimension
     *
     * Parameters:
     * prepend - {Boolean} if true, prepend to beginning.
     *                          if false, then append to end
     */
    shiftColumn: function(prepend) {
        var deltaX = (prepend) ? -this.tileSize.w : this.tileSize.w;
        var resolution = this.map.getResolution();
        var deltaLon = resolution * deltaX;

        for (var i=0, len=this.grid.length; i<len; i++) {
            var row = this.grid[i];
            var modelTileIndex = (prepend) ? 0 : (row.length - 1);
            var modelTile = row[modelTileIndex];
            
            var bounds = modelTile.bounds.clone();
            var position = modelTile.position.clone();
            bounds.left = bounds.left + deltaLon;
            bounds.right = bounds.right + deltaLon;
            position.x = position.x + deltaX;

            var tile = prepend ? this.grid[i].pop() : this.grid[i].shift();
            tile.moveTo(bounds, position);
            if (prepend) {
                row.unshift(tile);
            } else {
                row.push(tile);
            }
        }
    },
    
    /**
     * Method: removeExcessTiles
     * When the size of the map or the buffer changes, we may need to
     *     remove some excess rows and columns.
     * 
     * Parameters:
     * rows - {Integer} Maximum number of rows we want our grid to have.
     * colums - {Integer} Maximum number of columns we want our grid to have.
     */
    removeExcessTiles: function(rows, columns) {
        
        // remove extra rows
        while (this.grid.length > rows) {
            var row = this.grid.pop();
            for (var i=0, l=row.length; i<l; i++) {
                var tile = row[i];
                this.removeTileMonitoringHooks(tile);
                tile.destroy();
            }
        }
        
        // remove extra columns
        while (this.grid[0].length > columns) {
            for (var i=0, l=this.grid.length; i<l; i++) {
                var row = this.grid[i];
                var tile = row.pop();
                this.removeTileMonitoringHooks(tile);
                tile.destroy();
            }
        }
    },

    /**
     * Method: onMapResize
     * For singleTile layers, this will set a new tile size according to the
     * dimensions of the map pane.
     */
    onMapResize: function() {
        if (this.singleTile) {
            this.clearGrid();
            this.setTileSize();
        }
    },
    
    /**
     * APIMethod: getTileBounds
     * Returns The tile bounds for a layer given a pixel location.
     *
     * Parameters:
     * viewPortPx - {<OpenLayers.Pixel>} The location in the viewport.
     *
     * Returns:
     * {<OpenLayers.Bounds>} Bounds of the tile at the given pixel location.
     */
    getTileBounds: function(viewPortPx) {
        var maxExtent = this.maxExtent;
        var resolution = this.getResolution();
        var tileMapWidth = resolution * this.tileSize.w;
        var tileMapHeight = resolution * this.tileSize.h;
        var mapPoint = this.getLonLatFromViewPortPx(viewPortPx);
        var tileLeft = maxExtent.left + (tileMapWidth *
                                         Math.floor((mapPoint.lon -
                                                     maxExtent.left) /
                                                    tileMapWidth));
        var tileBottom = maxExtent.bottom + (tileMapHeight *
                                             Math.floor((mapPoint.lat -
                                                         maxExtent.bottom) /
                                                        tileMapHeight));
        return new OpenLayers.Bounds(tileLeft, tileBottom,
                                     tileLeft + tileMapWidth,
                                     tileBottom + tileMapHeight);
    },
    /**
     * @property {String} CLASS_NAME
     * @static  
     */
    CLASS_NAME: "OpenLayers.Layer.SnappyGrid"
}));





/***

**/

/* Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for 
 * full list of contributors). Published under the Clear BSD license.  
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */
/**
 * @class OpenLayers.Layer.SnappyWMSLayer
 * Instances of OpenLayers.Layer.WMS are used to display data from OGC Web
 *     Mapping Services. Create a new WMS layer with the <OpenLayers.Layer.WMS>
 *     constructor.
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
Oskari.$("SnappyWMSLayer",OpenLayers.Class(OpenLayers.Layer.Grid, {
 
    /**
     * @property {Object} DEFAULT_PARAMS Hashtable of default parameter key/value pairs
     * @static  
     */
    DEFAULT_PARAMS: { service: "WMS",
                      version: "1.1.1",
                      request: "GetMap",
                      styles: "",
                      format: "image/jpeg"
                     },
    
    /**
     * Property: reproject
     * *Deprecated*. See http://trac.openlayers.org/wiki/SphericalMercator
     * for information on the replacement for this functionality. 
     * {Boolean} Try to reproject this layer if its coordinate reference system
     *           is different than that of the base layer.  Default is false.  
     *           Set this in the layer options.  Should be set to false in 
     *           most cases.
     */
    reproject: false,
 
    /**
     * APIProperty: isBaseLayer
     * {Boolean} Default is true for WMS layer
     */
    isBaseLayer: true,
    
    /**
     * APIProperty: encodeBBOX
     * {Boolean} Should the BBOX commas be encoded? The WMS spec says 'no', 
     * but some services want it that way. Default false.
     */
    encodeBBOX: false,
    
    /** 
     * APIProperty: noMagic 
     * {Boolean} If true, the image format will not be automagicaly switched 
     *     from image/jpeg to image/png or image/gif when using 
     *     TRANSPARENT=TRUE. Also isBaseLayer will not changed by the  
     *     constructor. Default false. 
     */ 
    noMagic: false,
    
    /**
     * Property: yx
     * {Object} Keys in this object are EPSG codes for which the axis order
     *     is to be reversed (yx instead of xy, LatLon instead of LonLat), with
     *     true as value. This is only relevant for WMS versions >= 1.3.0.
     */
    yx: {'EPSG:4326': true},
    
    /**
     * Constructor: OpenLayers.Layer.WMS
     * Create a new WMS layer object
     *
     * Examples:
     *
     * The code below creates a simple WMS layer using the image/jpeg format.
     * (code)
     * var wms = new OpenLayers.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {layers: "modis,global_mosaic"});
     * (end)
     * Note the 3rd argument (params). Properties added to this object will be
     * added to the WMS GetMap requests used for this layer's tiles. The only
     * mandatory parameter is "layers". Other common WMS params include
     * "transparent", "styles" and "format". Note that the "srs" param will
     * always be ignored. Instead, it will be derived from the baseLayer's or
     * map's projection.
     *
     * The code below creates a transparent WMS layer with additional options.
     * (code)
     * var wms = new OpenLayers.Layer.WMS("NASA Global Mosaic",
     *                                    "http://wms.jpl.nasa.gov/wms.cgi", 
     *                                    {
     *                                        layers: "modis,global_mosaic",
     *                                        transparent: true
     *                                    }, {
     *                                        opacity: 0.5,
     *                                        singleTile: true
     *                                    });
     * (end)
     * Note that by default, a WMS layer is configured as baseLayer. Setting
     * the "transparent" param to true will apply some magic (see <noMagic>).
     * The default image format changes from image/jpeg to image/png, and the
     * layer is not configured as baseLayer.
     *
     * Parameters:
     * name - {String} A name for the layer
     * url - {String} Base url for the WMS
     *                (e.g. http://wms.jpl.nasa.gov/wms.cgi)
     * params - {Object} An object with key/value pairs representing the
     *                   GetMap query string parameters and parameter values.
     * options - {Object} Hashtable of extra options to tag onto the layer.
     *     These options include all properties listed above, plus the ones
     *     inherited from superclasses.
     */
    initialize: function(name, url, params, options) {
        var newArguments = [];
        //uppercase params
        params = OpenLayers.Util.upperCaseObject(params);
        if (parseFloat(params.VERSION) >= 1.3 && !params.EXCEPTIONS) {
            params.EXCEPTIONS = "INIMAGE";
        } 
        newArguments.push(name, url, params, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);
        OpenLayers.Util.applyDefaults(
                       this.params, 
                       OpenLayers.Util.upperCaseObject(this.DEFAULT_PARAMS)
                       );


        //layer is transparent        
        if (!this.noMagic && this.params.TRANSPARENT && 
            this.params.TRANSPARENT.toString().toLowerCase() == "true") {
            
            // unless explicitly set in options, make layer an overlay
            if ( (options == null) || (!options.isBaseLayer) ) {
                this.isBaseLayer = false;
            } 
            
            // jpegs can never be transparent, so intelligently switch the 
            //  format, depending on the browser's capabilities
            if (this.params.FORMAT == "image/jpeg") {
                this.params.FORMAT = OpenLayers.Util.alphaHack() ? "image/gif"
                                                                 : "image/png";
            }
        }

    },    

    /**
     * Method: destroy
     * Destroy this layer
     */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);  
    },

    
    /**
     * Method: clone
     * Create a clone of this layer
     *
     * Returns:
     * {<OpenLayers.Layer.WMS>} An exact clone of this layer
     */
    clone: function (obj) {
        
        if (obj == null) {
            obj = new OpenLayers.Layer.WMS(this.name,
                                           this.url,
                                           this.params,
                                           this.getOptions());
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },    
    
    /**
     * APIMethod: reverseAxisOrder
     * Returns true if the axis order is reversed for the WMS version and
     * projection of the layer.
     * 
     * Returns:
     * {Boolean} true if the axis order is reversed, false otherwise.
     */
    reverseAxisOrder: function() {
        return (parseFloat(this.params.VERSION) >= 1.3 && 
            !!this.yx[this.map.getProjectionObject().getCode()]);
    },
    
    /**
     * Method: getURL
     * Return a GetMap query string for this layer
     *
     * Parameters:
     * bounds - {<OpenLayers.Bounds>} A bounds representing the bbox for the
     *                                request.
     *
     * Returns:
     * {String} A string with the layer's url and parameters and also the
     *          passed-in bounds and appropriate tile size specified as 
     *          parameters.
     */
    getURL: function (bounds) {
        bounds = this.adjustBounds(bounds);
        
        var imageSize = this.getImageSize();
        var newParams = {};
        // WMS 1.3 introduced axis order
        var reverseAxisOrder = this.reverseAxisOrder();
        newParams.BBOX = this.encodeBBOX ?
            bounds.toBBOX(null, reverseAxisOrder) :
            bounds.toArray(reverseAxisOrder);
        newParams.WIDTH = imageSize.w;
        newParams.HEIGHT = imageSize.h;
        var requestString = this.getFullRequestString(newParams);
        return requestString;
    },

    /**
     * APIMethod: mergeNewParams
     * Catch changeParams and uppercase the new params to be merged in
     *     before calling changeParams on the super class.
     * 
     *     Once params have been changed, the tiles will be reloaded with
     *     the new parameters.
     * 
     * Parameters:
     * newParams - {Object} Hashtable of new params to use
     */
    mergeNewParams:function(newParams) {
        var upperParams = OpenLayers.Util.upperCaseObject(newParams);
        var newArguments = [upperParams];
        return OpenLayers.Layer.Grid.prototype.mergeNewParams.apply(this, 
                                                             newArguments);
    },

    /** 
     * APIMethod: getFullRequestString
     * Combine the layer's url with its params and these newParams. 
     *   
     *     Add the SRS parameter from projection -- this is probably
     *     more eloquently done via a setProjection() method, but this 
     *     works for now and always.
     *
     * Parameters:
     * newParams - {Object}
     * altUrl - {String} Use this as the url instead of the layer's url
     * 
     * Returns:
     * {String} 
     */
    getFullRequestString:function(newParams, altUrl) {
        var mapProjection = this.map.getProjectionObject();
        var projectionCode = this.projection && this.projection.equals(mapProjection) ?
            this.projection.getCode() :
            mapProjection.getCode();
        var value = (projectionCode == "none") ? null : projectionCode;
        if (parseFloat(this.params.VERSION) >= 1.3) {
            this.params.CRS = value;
        } else {
            this.params.SRS = value;
        }
        
        if (typeof this.params.TRANSPARENT == "boolean") {
            newParams.TRANSPARENT = this.params.TRANSPARENT ? "TRUE" : "FALSE";
        }

        return OpenLayers.Layer.Grid.prototype.getFullRequestString.apply(
                                                    this, arguments);
    },

    /**
     * @property {String} CLASS_NAME
     * @static  
     */
    CLASS_NAME: "OpenLayers.Layer.SnappyWMS"
}));
/**
 * 
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.WfsLayerPlugin', function() {
	this.mapModule = null;
	this.pluginName = null;
	this._sandbox = null;
	this._map = null;
	this._supportedFormats = {};
}, {
	__name : 'WfsLayerPlugin',

	getName : function() {
		return this.pluginName;
	},
	getMapModule : function() {
		return this.mapModule;
	},
	setMapModule : function(mapModule) {
		this.mapModule = mapModule;
		this.pluginName = mapModule.getName() + this.__name;
	},
	init : function(sandbox) {
	},
	register : function() {
		this.getMapModule().setLayerPlugin('wfslayer', this);
	},
	unregister : function() {
		this.getMapModule().setLayerPlugin('wfslayer', null);
	},
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		this._map = this.getMapModule().getMap();

		sandbox.register(this);
		for (p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}
//		this.updateWfsImages(this.getName());
//		this.redrawWfsLayers();
	},
	stopPlugin : function(sandbox) {

		for (p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		sandbox.unregister(this);

		this._map = null;
		this._sandbox = null;
	},
	/*
	 * @method start called from sandbox
	 */
	start : function(sandbox) {
	},
	/**
	 * @method stop called from sandbox
	 * 
	 */
	stop : function(sandbox) {
	},
	eventHandlers : {
		'AfterMapMoveEvent' : function(event) {
			var creator = this._sandbox.getObjectCreator(event);
			this._sandbox
					.printDebug("[WfsLayerPlugin] got AfterMapMoveEvent from "
							+ creator);
			this.afterAfterMapMoveEvent(event);
		},
		'AfterMapLayerAddEvent' : function(event) {
			this.afterMapLayerAddEvent(event);
		},
		'AfterMapLayerRemoveEvent' : function(event) {
			this.afterMapLayerRemoveEvent(event);
		},
		'AfterWfsGetFeaturesPngImageForMapEvent' : function(event) {
			this.afterWfsGetFeaturesPngImageForMapEvent(event);
		},
		'AfterHighlightWFSFeatureRowEvent' : function(event) {
			this.handleAfterHighlightWFSFeatureRowEvent(event);
		},
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			this.afterChangeMapLayerOpacityEvent(event);
		},
		'AfterDimMapLayerEvent' : function(event) {
			this.handleAfterDimMapLayerEvent(event);
		}

	},

	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [ event ]);
	},
	/**
	 * 
	 */
	preselectLayers : function(layers) {

		var sandbox = this._sandbox;

		for ( var i = 0; i < layers.length; i++) {
			var layer = layers[i];
			var layerId = layer.getId();

			if (!layer.isLayerOfType('WFS')) {
				continue;
			}

			sandbox.printDebug("[WfsLayerPlugin] preselecting " + layerId);
			this.addMapLayerToMap(layer, true, layer.isBaseLayer());
		}
	},

	afterChangeMapLayerOpacityEvent : function(event) {
		var layer = event.getMapLayer();
		
		if (!layer.isLayerOfType('WFS')) {
			return;
		}
		//var wfsReqExp = new RegExp('wfs_layer_' + layer.getId() + '_*', 'i');
		var layers = this.getOLMapLayers(layer); //_map.getLayersByName(wfsReqExp);
		for ( var i = 0; i < layers.length; i++) {
			layers[i].setOpacity(layer.getOpacity() / 100);
		
		}
	},
	
	/***************************************************************************
	 * Handle AfterDimMapLayerEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	handleAfterDimMapLayerEvent : function(event) {
		var layer = event.getMapLayer();

		if (layer.isLayerOfType('WFS')) {
			/** remove higlighed wfs layer from map */
			var wfsReqExp = new RegExp('wfs_layer_' + layer
					.getId() + '_HIGHLIGHTED_FEATURE*', 'i');
			var layers = this._map.getLayersByName(wfsReqExp);
			for ( var i = 0; i < layers.length; i++) {
				layers[i].destroy();
			}
		}
	},

	/***************************************************************************
	 * Handle AfterMapLaeyrAddEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	afterMapLayerAddEvent : function(event) {
		this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(),
				event.isBasemap());
//		this.updateWfsImages(this.getName());
	},
	/**
	 * primitive for adding layer to this map
	 */
	addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
	},
	/***************************************************************************
	 * Handle AfterMapLayerRemoveEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	afterMapLayerRemoveEvent : function(event) {
		var layer = event.getMapLayer();

		this.removeMapLayerFromMap(layer);
	},
	removeMapLayerFromMap : function(layer) {

		if (!layer.isLayerOfType('WFS')) {
			return;
		}

		//var wfsReqExp = new RegExp('wfs_layer_' + layer.getId() + '_*', 'i');
		var removeLayers = this.getOLMapLayers(layer); //_map.getLayersByName(wfsReqExp);
		for ( var i = 0; i < removeLayers.length; i++) {
			removeLayers[i].destroy();
		}
	},
	getOLMapLayers : function(layer) {

		if (layer && !layer.isLayerOfType('WFS')) {
			return;
		}
		var layerPart = '';
		if(layer) {
			layerPart = '_' + layer.getId();
		}

		var wfsReqExp = new RegExp('wfs_layer' + layerPart + '_*', 'i');
		return this._map.getLayersByName(wfsReqExp);
	},
	/***************************************************************************
	 * Handle AfterWfsGetFeaturesPngImageForMapEvent
	 * 
	 * @param {Oskari.mapframework.event.common.AfterWfsGetFeaturesPngImageForMapEvent}
	 *            event
	 */
	afterWfsGetFeaturesPngImageForMapEvent : function(event) {
		var imageUrl = event.getImageUrl();
		var imageBbox = event.getBbox();
		var layer = event.getMapLayer();
		
		var boundsObj = null;
		if (imageBbox.bounds && imageBbox.bounds.left && imageBbox.bounds.right
				&& imageBbox.bounds.top && imageBbox.bounds.bottom) {
			boundsObj = new OpenLayers.Bounds(imageBbox.bounds.left,
					imageBbox.bounds.bottom, imageBbox.bounds.right,
					imageBbox.bounds.top);
		} else if (imageBbox.left && imageBbox.right && imageBbox.top
				&& imageBbox.bottom) {
			boundsObj = new OpenLayers.Bounds(imageBbox.left, imageBbox.bottom,
					imageBbox.right, imageBbox.top);
		}

		/** Safety checks */
		if (!(imageUrl && layer && boundsObj)) {
			// alert("no bounds");
			// console.dir(event);
			return;
		}

		var layerScales = this.mapModule.calculateLayerScales(layer
				.getMaxScale(), layer.getMinScale());

		var layerIndex = null;

		/** remove old wfs layers from map */
		var removeLayers = this._map.getLayersByName(event
				.getRequestedLayerName());
		for ( var i = 0; i < removeLayers.length; i++) {
			layerIndex = this._map.getLayerIndex(removeLayers[0]);
			removeLayers[0].destroy();
		}

		/** Here checks at layer is selected */
		if (this._sandbox.isLayerAlreadySelected(layer.getId())) {

			var layerName = event.getRequestedLayerName();

			var ols = new OpenLayers.Size(256, 256);

			var wfsMapImageLayer = new OpenLayers.Layer.Image(layerName,
					imageUrl, boundsObj, ols, {
						scales : layerScales,
						transparent : true,
						format : "image/png",
						isBaseLayer : false,
						displayInLayerSwitcher : true,
						visibility : true,
						buffer : 0
					});

			// var mapModule = this.getMapModule();

			this.mapModule.attachLoadingStatusToLayer(wfsMapImageLayer, layer);

			wfsMapImageLayer.opacity = layer.getOpacity() / 100;

			this._map.addLayer(wfsMapImageLayer);
			wfsMapImageLayer.setVisibility(true);
			wfsMapImageLayer.redraw(true);

		}

		var layers = Oskari.$().sandbox.findAllSelectedMapLayers();
		var opLayersLength = this._map.layers.length;

		var changeLayer = this._map.getLayersByName('Markers');
		if (changeLayer.length > 0) {
			this._map.setLayerIndex(changeLayer[0], opLayersLength);
			opLayersLength--;
		}

		if (layerIndex !== null && wfsMapImageLayer !== null) {
			this._map.setLayerIndex(wfsMapImageLayer, layerIndex);
		}

		var wfsReqExp2 = new RegExp(
				'wfs_layer_' + layer.getId() + '_WFS_LAYER_IMAGE*', 'i');
		var lastWfsLayer = this._map.getLayersByName(wfsReqExp2);
		if (lastWfsLayer.length > 0) {
			var lastWfsLayerIndex = this._map
					.getLayerIndex(lastWfsLayer[lastWfsLayer.length - 1]);

			var changeLayer2 = this._map.getLayersByName('wfs_layer_' + layer
					.getId() + '_HIGHLIGHTED_FEATURE');
			if (changeLayer2.length > 0) {
				this._map.setLayerIndex(changeLayer2[0], lastWfsLayerIndex);
			}
		}

	},
	/***************************************************************************
	 * Handle AfterHighlightWFSFeatureRowEvent
	 * 
	 * @param {Object}
	 *            event
	 */
	handleAfterHighlightWFSFeatureRowEvent : function(event) {
		var selectedFeatureIds = event.getWfsFeatureIds();
		// var moduleName = this.getName();
	if (selectedFeatureIds.length == 0) {
		if (!this._sandbox.isCtrlKeyDown()) {
			var layer = event.getMapLayer();
			if (layer.isLayerOfType('WFS')) {
				/** remove higlighed wfs layer from map */
				var wfsReqExp = new RegExp(
						'wfs_layer_' + layer.getId() + '_HIGHLIGHTED_FEATURE*',
						'i');
				var layers = this._map.getLayersByName(wfsReqExp);
				for ( var i = 0; i < layers.length; i++) {
					layers[i].destroy();
				}
			}
		}
	}
},
/* ******************************************************************************
 * Handle AfterRemoveHighlightMapLayerEvent
 * 
 * @param {Object}
 *            event
 */

removeHighlightOnMapLayer : function() {
	var wfsReqExp = new RegExp('_HIGHLIGHTED_FEATURE*', 'i');
	var layers = this._map.getLayersByName(wfsReqExp);
	for ( var i = 0; i < layers.length; i++) {
		layers[i].destroy();
	}
},

updateWfsImages : function(creator) {

	var layers = Oskari.$().sandbox.findAllSelectedMapLayers();
	// request updates for map tiles
	for ( var i = 0; i < layers.length; i++) {
        if(layers[i].isInScale() && layers[i].isLayerOfType('WFS')) {
            this.doWfsLayerRelatedQueries(/*creator,*/ layers[i]);
        }
	}
},

    /**
     * Generates all WFS related queries
     *
     * @param {Object}
     *            mapLayer
     */
    doWfsLayerRelatedQueries : function(mapLayer) {

        if(!mapLayer.isInScale()) {
            return;
        }
        var map = this._sandbox.getMap();
        var bbox = map.getBbox();
        var ogcSearchService = this._sandbox.getService('Oskari.mapframework.service.OgcSearchService');

        var mapWidth = map.getWidth();
        var mapHeight = map.getHeight();
        
        ogcSearchService.scheduleWFSMapLayerUpdate(mapLayer, bbox, mapWidth, mapHeight, this.getName());
        ogcSearchService.startPollers();
    },
/*redrawWfsLayers : function() {
		var wfsLayers = this.getOLMapLayers();
		for ( var i = 0; i < wfsLayers.length; i++) {
			wfsLayers[i].redraw(true);
		}
},*/
afterAfterMapMoveEvent : function(event) {
	this.updateWfsImages(this.getName());
	
	this.removeHighlightOnMapLayer();
}
}, {
	'protocol' : [ "Oskari.mapframework.module.Module",
			"Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
/**
 * @class Oskari.mapframework.mapmodule.VectorLayerPlugin
 */
Oskari.clazz
		.define(
				'Oskari.mapframework.mapmodule.VectorLayerPlugin',
				function() {
					this.mapModule = null;
					this.pluginName = null;
					this._sandbox = null;
					this._map = null;
					this._supportedFormats = {};
					this._sldFormat = new OpenLayers.Format.SLD( {
						multipleSymbolizers : false,
						namedLayersAsArray : true
					});
				},

				{
					__name : 'VectorLayerPlugin',

					getName : function() {
						return this.pluginName;
					},

					getMapModule : function() {
						return this.mapModule;
					},
					setMapModule : function(mapModule) {
						this.mapModule = mapModule;
						this.pluginName = mapModule.getName() + this.__name;

					},

					register : function() {
						this.getMapModule().setLayerPlugin('vectorlayer',this);
					},
					unregister : function() {
						this.getMapModule().setLayerPlugin('vectorlayer',null);
					},

					init : function(sandbox) {
					},
					startPlugin : function(sandbox) {
						this._sandbox = sandbox;
						this._map = this.getMapModule().getMap();

						this.registerVectorFormats();

						sandbox.register(this);
						for (p in this.eventHandlers) {
							sandbox.registerForEventByName(this, p);
						}
					},
					stopPlugin : function(sandbox) {

						for (p in this.eventHandlers) {
							sandbox.unregisterFromEventByName(this, p);
						}

						sandbox.unregister(this);

						this._map = null;
						this._sandbox = null;
					},

					   /* @method start 
                     * called from sandbox
                     */
                    start: function(sandbox) {
                    },
                    /**
                     * @method stop
                     * called from sandbox
                     * 
                     */
                    stop: function(sandbox) {
                    },
                    
					
					eventHandlers : {
						'AfterMapLayerAddEvent' : function(event) {
							this.afterMapLayerAddEvent(event);
						},
						'AfterMapLayerRemoveEvent' : function(event) {
							this.afterMapLayerRemoveEvent(event);
						},
						'FeaturesAvailableEvent' : function(event) {
							this.handleFeaturesAvailableEvent(event);
						}
					},

					onEvent : function(event) {
						return this.eventHandlers[event.getName()].apply(this,
								[ event ]);
					},

					/**
					 * 
					 */
					preselectLayers: function(layers)  {
						var sandbox = this._sandbox;
						for ( var i = 0 ; i < layers.length ; i++) {
							var layer = layers[i];
							var layerId = layer.getId();
							
							
							if (!layer.isLayerOfType('VECTOR')) 
								continue;
							
							sandbox.printDebug("preselecting " + layerId);
							this.addMapLayerToMap(layer,true,layer.isBaseLayer());
						}

					},

					
					/***********************************************************
					 * Handle AfterMapLaeyrAddEvent
					 * 
					 * @param {Object}
					 *            event
					 */
					afterMapLayerAddEvent : function(event) {
						this.addMapLayerToMap(event.getMapLayer(), event
								.getKeepLayersOrder(), event.isBasemap());
					},

					/**
					 * adds vector format to props of known formats
					 */
					registerVectorFormat : function(mimeType, formatImpl) {
						this._supportedFormats[mimeType] = formatImpl;
					},

					/**
					 * registers default vector formats
					 */
					registerVectorFormats : function() {
						this.registerVectorFormat("application/json",
								new OpenLayers.Format.GeoJSON( {}));
						this.registerVectorFormat(
								"application/nlsfi-x-openlayers-feature",
								new function() {
									this.read = function(data) {
										return data;
									};
								});
					},

					/**
					 * primitive for adding layer to this map
					 */
					addMapLayerToMap : function(layer, keepLayerOnTop,
							isBaseMap) {

						if (!layer.isLayerOfType('VECTOR'))
							return;

						var markerLayer = this._map.getLayersByName("Markers");
						this._map.removeLayer(markerLayer[0], false);

//						var layerScales = this.getMapModule().calculateLayerScales(layer
//								.getMaxScale(), layer.getMinScale());

						var styleMap = new OpenLayers.StyleMap();
						var layerOpts = {
							styleMap : styleMap
						};
						var sldSpec = layer.getStyledLayerDescriptor();

						if (sldSpec) {
							this._sandbox.printDebug(sldSpec);
							var styleInfo = this._sldFormat.read(sldSpec);

							window.styleInfo = styleInfo;
							var styles = styleInfo.namedLayers[0].userStyles;

							var style = styles[0];
							// if( style.isDefault) {
							styleMap.styles["default"] = style;
							// }
						}

						var openLayer = new OpenLayers.Layer.Vector(
								'layer_' + layer.getId(), layerOpts);

						openLayer.opacity = layer.getOpacity() / 100;

						this._map.addLayer(openLayer);

						this._sandbox
								.printDebug("#!#! CREATED VECTOR / OPENLAYER.LAYER.VECTOR for "
										+ layer.getId());

						if (keepLayerOnTop) {
							this._map.setLayerIndex(openLayer,
									this._map.layers.length);
						} else {
							this._map.setLayerIndex(openLayer, 0);
						}

						this._map.addLayer(markerLayer[0]);

					},
					/***********************************************************
					 * Handle AfterMapLayerRemoveEvent
					 * 
					 * @param {Object}
					 *            event
					 */
					afterMapLayerRemoveEvent : function(event) {
						var layer = event.getMapLayer();

						this.removeMapLayerFromMap(layer);
					},

					removeMapLayerFromMap : function(layer) {

						if (!layer.isLayerOfType('VECTOR'))
							return;

						var remLayer = this._map
								.getLayersByName('layer_' + layer.getId());
						/* This should free all memory */
						remLayer[0].destroy();

					},
    				getOLMapLayers : function(layer) {

						if (!layer.isLayerOfType('VECTOR')) {
							return;
						}

						return this._map
								.getLayersByName('layer_' + layer.getId());
					},
					/**
					 * 
					 */
					handleFeaturesAvailableEvent : function(event) {
						var layer = event.getMapLayer();

						var mimeType = event.getMimeType();
						var features = event.getFeatures();
//						var projCode = event.getProjCode();
						var op = event.getOp();

						var mapLayer = this._map
								.getLayersByName('layer_' + layer.getId())[0];
						if (!mapLayer) {
							return;
						}

						if (op && op == 'replace') {
							mapLayer.removeFeatures(mapLayer.features);
						}

						var format = this._supportedFormats[mimeType];

						if (!format) {
							return;
						}

						var fc = format.read(features);

						mapLayer.addFeatures(fc);
					}

				},
				{
					'protocol' : [ "Oskari.mapframework.module.Module",
							"Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
				});
Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.ToolSelectionRequest', function(toolId) {
    this._toolId = toolId;
    this._creator = null;
}, {
    tools : {
        navigate : 'map_control_navigate_tool',
        previous : 'map_control_tool_prev',
        next : 'map_control_tool_prev',
        select : 'map_control_select_tool',
        zoom : 'map_control_zoom_tool',
        draw_area : 'map_control_draw_area_tool',
        measure : 'map_control_measure_tool',
        measure_area : 'map_control_measure_area_tool',
        info : 'map_control_show_info_tool'
    },
    __name : "ToolSelectionRequest",
    getName : function() {
        return this.__name;
    },
    getToolId : function() {
        return this._toolId;
    },
    setToolId : function(toolId) {
        this._toolId = toolId;
    },
    getNamespace : function() {
        if(this._toolId.indexOf('.') == -1) {
            return '';
        }
        // This should basically be the this._name of the sender
        return this._toolId.substring(0, this._toolId.lastIndexOf('.'));
    },
    getToolName : function() {
        if(this._toolId.indexOf('.') == -1) {
            return this._toolId;
        }
        return this._toolId.substring(this._toolId.lastIndexOf('.'));
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
Oskari.clazz.define('Oskari.mapframework.mapmodule.ToolSelectionHandler', function(sandbox, controlsPlugin) {

    this.sandbox = sandbox;
    this.controlsPlugin = controlsPlugin;
}, {
    __name : 'ToolSelectionHandler',
    getName : function() {
        return this.__name;
    },
    init : function(sandbox) {},
    handleRequest : function(core, request) {
        var toolId = request.getToolId();
        var namespace = request.getNamespace();
        var toolName = request.getToolName();

        // TODO: get rid of magic strings!
        if(toolName != 'map_control_zoom_tool') {
            this.controlsPlugin._zoomBoxTool.deactivate();
        }
        if(toolName != 'map_control_measure_tool') {
            this.controlsPlugin._measureControls.line.deactivate();
        }
        if(toolName != 'map_control_measure_area_tool') {
            this.controlsPlugin._measureControls.area.deactivate();
        }

        if(toolName == 'map_control_tool_prev') {
            // custom history (TODO: more testing needed + do this with request instead of findRegisteredModuleInstance)
            var stateHandler = this.sandbox.findRegisteredModuleInstance('StateHandler');
            if(stateHandler) {
                stateHandler.historyMovePrevious();
            }
            
        } else if(toolName == 'map_control_tool_next') {
            // custom history (TODO: more testing needed + do this with request instead of findRegisteredModuleInstance)
            var stateHandler = this.sandbox.findRegisteredModuleInstance('StateHandler');
            if(stateHandler) {
                stateHandler.historyMoveNext();
            } 
        } else if(toolName == 'map_control_select_tool') {
            // clear selected area
           var slp = this.sandbox.findRegisteredModuleInstance('SketchLayerPlugin'); 
            if (slp) { slp.clearBbox(); }
        } else if(toolName == 'map_control_zoom_tool') {
            this.controlsPlugin._zoomBoxTool.activate();
        } else if(toolName == 'map_control_measure_tool') {
            this.controlsPlugin._measureControls.line.activate();
        } else if(toolName == 'map_control_measure_area_tool') {
            this.controlsPlugin._measureControls.area.activate();
        }

        var e = this.sandbox.getEventBuilder('ToolSelectedEvent')(toolId);
        e.setOrigin(this.getName());
        this.sandbox.notifyAll(e);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.request.MapLayerUpdateRequest', 
    function(layerId, forced) {
    this._layerId = layerId;
    this._forced = forced;
}, {
    __name : "MapModulePlugin.MapLayerUpdateRequest",
    getName : function() {
        return this.__name;
    },
    getLayerId : function() {
        return this._layerId;
    },
    isForced : function() {
        // check for null
        if(this._forced) {
            return this._forced;
        }
        return false;
    }

}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.MapLayerUpdateRequestHandler', function(sandbox, mapModule) {

    this.sandbox = sandbox;
    this.mapModule = mapModule;
}, {
    handleRequest : function(core, request) {
        var layerId = request.getLayerId();
        var forced = request.isForced();
        var olLayerList = this.mapModule.getOLMapLayers(layerId);
        var count = 0;
        if(olLayerList) {
        	count = olLayerList.length;
        	// found openlayers layer -> do update
        	for(var i=0; i < olLayerList.length; ++i) {
        		olLayerList[i].redraw(forced);
        	}
        }
        
        this.sandbox.printDebug("[MapLayerUpdateRequestHandler] update layer " + layerId + ", found " + count);
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.MapMoveRequestHandler', function(sandbox, mapModule) {

    this.sandbox = sandbox;
    this.mapModule = mapModule;
}, {
    handleRequest : function(core, request) {
    	
        var longitude = request.getCenterX();
        var latitude = request.getCenterY();
        var marker = request.getMarker();
        var zoom = request.getZoom();
        
    	var lonlat = new OpenLayers.LonLat(longitude, latitude);
        this.mapModule.moveMapToLanLot(lonlat);
        // if zoom=0 -> if(zoom) is determined as false...
        if(zoom || zoom === 0) {
        	if(zoom.CLASS_NAME === 'OpenLayers.Bounds') {
    			this.mapModule._map.zoomToExtent(zoom);
        	}
        	else {
    			this.mapModule._map.zoomTo(zoom);
        	}
        }
    	this.mapModule._updateDomain();
    	if(marker) {
    		this.mapModule._drawMarker();
    	}
    	
    	this.mapModule.notifyMoveEnd();
        
        this.sandbox.printDebug("[MapMoveRequestHandler] map moved");
    }
}, {
    protocol : ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.event.MapClickedEvent',
    function(lonlat, mouseX, mouseY) {
        this._lonlat = lonlat;
        this._mouseX = mouseX;
        this._mouseY = mouseY;
}, {
    __name : "MapClickedEvent",
    getName : function() {
        return this.__name;
    },
    getLonLat : function() {
        return this._lonlat;
    },
    getMouseX : function() {
        return this._mouseX;
    },
    getMouseY : function() {
        return this._mouseY;
    }
}, {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule-plugin.event.EscPressedEvent',
    function() {
}, {
    __name : "EscPressedEvent",
    getName : function() {
        return this.__name;
    }
}, {
    'protocol' : [ 'Oskari.mapframework.event.Event' ]
});
Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.request.ClearHistoryRequest', 
    function() {
    this._creator = null;
}, {
    __name : "ClearHistoryRequest",
    getName : function() {
        return this.__name;
    }
}, {
    'protocol' : ['Oskari.mapframework.request.Request']
});
Oskari.clazz.define('Oskari.mapframework.mapmodule-plugin.controls.ClearHistoryHandler',
function(sandbox, mapModule) {
    this.mapModule = mapModule;
    this.sandbox = sandbox;
},
{
    __name: 'ClearHistoryHandler',
    getName: function() {
        return this.__name;
    },
    init: function(sandbox) {},
    handleRequest: function(core, request) {
        this.mapModule.clearNavigationHistory();
    }
},
{
    protocol: ['Oskari.mapframework.core.RequestHandler']
});
/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.__templates = {};
    this.__elements = {};
    this.__parent = null;
    this._slider
    this._zoombar_messages = {};
    this._suppressEvents = false;
    this._conf = config;
}, {
    /**
     * @static
     * @property __name
     */
    __name : 'Portti2Zoombar',

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method init
     * implements Module protocol init method - declares popup templates
     */
    init : function() {
        var me = this;
        // templates
        this.__templates['zoombar'] = jQuery('<div class="mapplugin pzbDiv" title="Koko Suomi">' + 
            '<div class="pzbDiv-plus"></div>' + 
            '<input type=\'hidden\' />' + 
            '<div class="slider"></div>' + 
            '<div class="pzbDiv-minus"></div>' + 
        '</div>');
    },
    /**
     * @method register
     * mapmodule.Plugin protocol method - does nothing atm
     */
    register : function() {

    },
    /**
     * @method unregister
     * mapmodule.Plugin protocol method - does nothing atm
     */
    unregister : function() {
    },
    /**
     * @method startPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Sets sandbox and registers self to sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);

        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
        this.draw();
        this.setZoombarValue(this._map.getZoom());
    },
    /**
     * @method draw
     *
     * SimpleDiv
     */
    draw : function() {
        var me = this;
        if(!me.__parent) {
            me.__parent = this._map.div;
        }
        if(!me.__elements['zoombarSlider']) {
            me.__elements['zoombarSlider'] = me.__templates['zoombar'].clone();
        }

        var inputId = 'pzb-input-' + this.getName();
        var sliderId = 'pzb-slider-' + this.getName();
        me.__elements['zoombarSlider'].find('input').attr('id', inputId);
        me.__elements['zoombarSlider'].find('div.slider').attr('id', sliderId);
        jQuery(me.__parent).append(me.__elements['zoombarSlider']);
        me._slider = new Slider({
            min : 0,
            max : 12,
            value : 0,
            direction : 'y'
        }).insertTo(sliderId).assignTo(inputId);

        me._slider.level.hide();

        var tooltips = me.getMapModule().getLocalization('zoombar_tooltip');

        me._slider.on('change', function(event) {
            // update tooltip
            var tooltip = tooltips['zoomLvl-' + event.value];
            if(tooltip) {
                me.__elements['zoombarSlider'].attr('title', tooltip);
            }
            // zoom map if not suppressed
            if(!this._suppressEvents) {
                me.getMapModule().zoomTo(event.value);
            }
        });
        var plus = me.__elements['zoombarSlider'].find('.pzbDiv-plus');
        plus.bind('click', function(event) {
            if(me._slider.getValue() < 12) {
                me.getMapModule().zoomTo(me._slider.getValue() + 1);
            }
        });
        var minus = me.__elements['zoombarSlider'].find('.pzbDiv-minus');
        minus.bind('click', function(event) {
            if(me._slider.getValue() > 0) {
                me.getMapModule().zoomTo(me._slider.getValue() - 1);
            }
        });
        // override default location if configured
        if(this._conf && this._conf.location) {
            // clear possible opposite position with 'auto' and set the one in config
            if(this._conf.location.top) {
                me.__elements['zoombarSlider'].css('bottom', 'auto');
                me.__elements['zoombarSlider'].css('top', this._conf.location.top);
            }
            if(this._conf.location.left) {
                me.__elements['zoombarSlider'].css('right', 'auto');
                me.__elements['zoombarSlider'].css('left', this._conf.location.left);
            }
            if(this._conf.location.right) {
                me.__elements['zoombarSlider'].css('left', 'auto');
                me.__elements['zoombarSlider'].css('right', this._conf.location.right);
            }
            if(this._conf.location.bottom) {
                me.__elements['zoombarSlider'].css('top', 'auto');
                me.__elements['zoombarSlider'].css('bottom', this._conf.location.bottom);
            }
        }
    },
    setZoombarValue : function(value) {
        var me = this;
        if(me._slider) {
            // disable events in "onChange"
            this._suppressEvents = true;
            me._slider.setValue(value);
            this._suppressEvents = false;
        }
    },
    /**
     * @method stopPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox
     */
    stopPlugin : function(sandbox) {

        if(this.__elements['zoombarSlider']) {
            this.__elements['zoombarSlider'].remove();
            this._slider.remove();
        }
        sandbox.unregister(this);

        //this._map = null;
        this._sandbox = null;
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapMoveEvent' : function(event) {
            var me = this;
            me.setZoombarValue(event.getZoom());
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method start
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    stop : function(sandbox) {
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.PanButtons
 * 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.PanButtons', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.__templates ={};
    this.__elements = {};
    this.__parent = null;
   
}, {
	/**
	 * @static
	 * @property __name
	 */
    __name : 'PanButtons',

	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
	/**
	 * @method init
	 * implements Module protocol init method - declares pan buttons templates
	 */
    init : function() {
        var me = this;
			
		// templates
		this.__templates['pan'] = 
        jQuery('<div class="panbuttonDiv">'+ 
        	   '<div>' +
        	   '  <img class="panbuttonDivImg" src="../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/default.png" usemap="#panbuttons">'+
        	   '    <map name="panbuttons">'+
        	   '      <area shape="circle" class="panbuttons_center" coords="45,45,20" href="#">'+ // center
        	   '      <area shape="polygon" class="panbuttons_left" coords="13,20,25,30,20,45,27,65,13,70,5,45" href="#">'+ // left
        	   '      <area shape="polygon" class="panbuttons_up" coords="30,8,45,4,60,8,60,23,45,20,30,23" href="#">'+ // up
        	   '      <area shape="polygon" class="panbuttons_right" coords="79,20,67,30,72,45,65,65,79,70,87,45" href="#">'+ //right
        	   '      <area shape="polygon" class="panbuttons_down" coords="30,82,45,86,60,82,60,68,45,70,30,68" href="#">'+ // down
        	   '    </map>'+ 
        	   '  </img>' +
        	   '</div>' +
        	   '</div>');
    },
    
    
    /**
     * @method register
     * mapmodule.Plugin protocol method - does nothing atm
     */
    register : function() {

    },
    /**
     * @method unregister
     * mapmodule.Plugin protocol method - does nothing atm
     */
    unregister : function() {
    },
    /**
     * @method startPlugin
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Sets sandbox and registers self to sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
        
        for(p in this.eventHandlers) {
			sandbox.registerForEventByName(this, p);
		}
        this.draw();
    },  
        /**
     * @method draw
     * 
     * SimpleDiv
     */
    draw : function() {
        var me = this;
        if (!me.__parent) {
            me.__parent = this._map.div;
        }
        if (!me.__elements['panbuttons']) {
            me.__elements['panbuttons'] = 
                me.__templates['pan'].clone();
        }
        
        
        jQuery(me.__parent).append(me.__elements['panbuttons']);
        
        var panbuttonDivImg = me.__elements['panbuttons'].find('.panbuttonDivImg');
        
        var center = me.__elements['panbuttons'].find('.panbuttons_center');
        
        center.bind('mouseover', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/root.png");
        });
        center.bind('mouseout', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/default.png");
        });
        center.bind('click', function(event){
        	var rb = me.getMapModule().getSandbox().getRequestBuilder('StateHandler.SetStateRequest');
            if(rb) {
            	me.getMapModule().getSandbox().request(me, rb());
            }
        });
        
        
        var left = me.__elements['panbuttons'].find('.panbuttons_left');
        left.bind('mouseover', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/left.png");
        });
        left.bind('mouseout', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/default.png");
        });
        left.bind('click', function(event){
        	me.getMapModule().panMapByPixels(-100,0, false, true);
        });
        
        var right = me.__elements['panbuttons'].find('.panbuttons_right');
        right.bind('mouseover', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/right.png");
        });
        right.bind('mouseout', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/default.png");
        });
        right.bind('click', function(event){
        	me.getMapModule().panMapByPixels(100,0, false, true);
        });
        
        var top = me.__elements['panbuttons'].find('.panbuttons_up');
        top.bind('mouseover', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/up.png");
        });
        top.bind('mouseout', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/default.png");
        });
        top.bind('click', function(event){
        	me.getMapModule().panMapByPixels(0,-100, false, true);
        });
        
        var bottom = me.__elements['panbuttons'].find('.panbuttons_down');
        bottom.bind('mouseover', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/down.png");
        });
        bottom.bind('mouseout', function(event){
        	panbuttonDivImg.attr('src',"../../resources/framework/bundle/mapmodule-plugin/plugin/panbuttons/images/default.png");
        });
        bottom.bind('click', function(event){
        	me.getMapModule().panMapByPixels(0,100, false, true);
        });
        
        
    },
    
    /**
     * @method stopPlugin
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * mapmodule.Plugin protocol method.
     * Unregisters self from sandbox
     */
    stopPlugin : function(sandbox) {

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
	onEvent : function(event) {
		return this.eventHandlers[event.getName()].apply(this, [event]);
	},
    /**
     * @method start
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * Module protocol method - does nothing atm
     */
    stop : function(sandbox) {
    }
}, {
	/**
	 * @property {String[]} protocol
	 * @static 
	 */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
/**
 * @class Oskari.mapframework.bundle.PluginMapModuleBundleInstance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.PluginMapModuleBundleInstance", function(b) {
	this.name = 'mapmodule';
	this.mediator = null;
	this.sandbox = null;
	this.conf = null;

	this.impl = null;

	this.facade = null;

	this.ui = null;
},
/*
 * prototype
 */
{

	/**
	 * start bundle instance
	 *
	 */
	"start" : function() {

		if(this.mediator.getState() == "started")
			return;

		this.libs = {
			ext : Oskari.$("Ext")
		};

		var facade = Oskari.$('UI.facade');
		this.facade = facade;

		var sandbox = facade.getSandbox();
		this.sandbox = sandbox;

		var conf = Oskari.$("startup");

		this.conf = conf;

		var showIndexMap = conf.mapConfigurations.index_map;
		var showZoomBar = conf.mapConfigurations.zoom_bar;
		var showScaleBar = conf.mapConfigurations.scala_bar;
		var allowMapMovements = conf.mapConfigurations.pan;

		var impl = Oskari.clazz.create('Oskari.mapframework.ui.module.common.MapModule', "Main", showIndexMap, showZoomBar, showScaleBar, allowMapMovements);
		// impl.setOpt('createTilesGrid', false);
		this.impl = impl;

		var pnl = this.createMapPanel();
		this._panel = pnl;

		var def = this.facade.appendExtensionModule(this.impl, this.name, {}, this, 'Center', {
			'fi' : {
				title : ''
			},
			'sv' : {
				title : '?'
			},
			'en' : {
				title : ''
			}

		}, pnl);
		this.def = def;

		/**
		 * plugins
		 */
		var plugins = [];
		plugins.push('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WmsLayerPlugin');
		//plugins.push('Oskari.mapframework.mapmodule.SketchLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.MarkersPlugin');
		plugins.push('Oskari.mapframework.mapmodule.VectorLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.TilesGridPlugin');
		plugins.push('Oskari.mapframework.mapmodule.ControlsPlugin');
		plugins.push('Oskari.mapframework.mapmodule.WfsLayerPlugin');
		plugins.push('Oskari.mapframework.mapmodule.GetInfoPlugin');

		for(var i = 0; i < plugins.length; i++) {
			var plugin = Oskari.clazz.create(plugins[i]);
			impl.registerPlugin(plugin);
		}

		var mapster = this.createMapContainer(this.impl.getMap());
		this._mapster = mapster;
		pnl.add(mapster);

		facade.registerPart('Mapster', this._mapster);

		// call real modules start 
		this.impl.start(sandbox);
		this.mediator.setState("started");
		return this;
	},
	/**
	 * creates (Ext) map panel
	 */
	createMapPanel : function() {
		var xt = this.libs.ext;
		var pnl = xt.create('Ext.Panel', {
			region : 'center',
			layout : 'fit',
			items : []
		});

		return pnl;

	},
	createMapContainer : function(map) {
		var xt = this.libs.ext;
		var mapster = xt.createWidget('nlsfimappanel', {
			olmap : map,
			layout : 'absolute'
		});

		return mapster;
	},
	/**
	 * notifications from bundle manager
	 */
	"update" : function(manager, b, bi, info) {
		manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
	},
	/**
	 * stop bundle instance
	 */
	"stop" : function() {

		this.impl.stop();

		this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
		this.def = null;

		this.mediator.setState("stopped");

		return this;
	},
	getName : function() {
		return this.__name;
	},
	__name : "Oskari.mapframework.bundle.PluginMapModuleBundleInstance"

}, {
	"protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});
