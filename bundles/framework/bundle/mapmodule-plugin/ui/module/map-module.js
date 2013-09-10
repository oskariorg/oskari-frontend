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
        resolutions : [2000, 1000, 500, 200, 100, 50, 20, 10, 4, 2, 1, 0.5, 0.25],
        srsName : 'EPSG:3067',
        units : 'm'
    };
    // override defaults
    if(options) {
        for(var key in options) {
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
    /**
     * @method getImageUrl
     * Returns a base url for plugins to show. Can be set in constructor and
     * defaults to "/Oskari/resources" if not set.
     * @return {String}
     */
    getImageUrl : function() {
        if(!this._imageUrl) {
            // default if not set
            return "/Oskari/resources";
        }
        return this._imageUrl;
    },
    /**
     * @method getControls
     * Returns map controls - storage for controls by id. See getMapControl for getting single control.
     * @return {Object} contains control names as keys and control
     *      objects as values
     */
    getControls : function() {
        return this._controls;
    },
    /**
     * @method getMapControl
     * Returns a single map control that matches the given id/name.
     *  See getControls for getting all controls.
     * @param {String} id name of the map control
     * @return {OpenLayers.Control} control matching the id or undefined if not found
     */
    getMapControl : function(id) {
        return this._controls[id];
    },
    /**
     * @method addMapControl
     * Adds a control to the map and saves a reference so the control
     * can be accessed with getControls/getMapControl.
     * @param {String} id control id/name
     * @param {OpenLayers.Control} ctl
     */
    addMapControl : function(id, ctl) {
        this._controls[id] = ctl;
        this._map.addControl(ctl);
    },
    /**
     * @method removeMapControl
     * Removes a control from the map matching the given id/name and
     * also removes it from references gotten by getControls()
     * @param {String} id control id/name
     */
    removeMapControl : function(id) {
        this._map.removeControl(this._controls[id]);
        this._controls[id] = null;
        delete this._controls[id];
    },
    /**
     * @method setLayerPlugin
     * Adds a plugin to the map that is responsible for rendering maplayers on the map. Other types of
     * plugins doesn't need to be registered like this.
     * Saves a reference so the plugin so it can be accessed with getLayerPlugins/getLayerPlugin.
     *
     * The plugin handling rendering a layer is responsible for calling this method and registering
     * itself as a layersplugin.
     *
     * @param {String} id plugin id/name
     * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plug
     */
    setLayerPlugin : function(id, plug) {
        this._layerPlugins[id] = plug;
    },
    /**
     * @method getLayerPlugin
     * Returns a single map layer plugin that matches the given id
     * See getLayerPlugins for getting all plugins.
     * See setLayerPlugin for more about layerplugins.
     * @return {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin matching the id or undefined if not found
     */
    getLayerPlugin : function(id) {
        return this._layerPlugins[id];
    },
    /**
     * @method getControls
     * Returns plugins that have been registered as layer plugins. See setLayerPlugin for more about layerplugins.
     * See getLayerPlugin for getting single plugin.
     * @return {Object} contains plugin ids keys and plugin objects as values
     */
    getLayerPlugins : function() {
        return this._layerPlugins;
    },
    /**
     * @method clearNavigationHistory
     * Clears the internal OpenLayers.Control.NavigationHistory
     * history.
     */
    clearNavigationHistory : function() {
        this._navigationHistoryTool.clear();
    },

    /**
     * @method getName
     * @return {String} the name for the component
     */
    getName : function() {
        return this._id + "MapModule";
    },
    /**
     * @method getSandbox
     * Returns reference to Oskari sandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
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
     * @param {Boolean} force (optional) true to force reload for localization data
     * @return {String/Object} returns single localization string or
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
     */
    getLocalization : function(key, force) {
        if(!this._localization || force === true) {
            this._localization = Oskari.getLocalization('MapModule');
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },

    /**
     * @method init
     * Implements Module protocol init method. Creates the OpenLayers Map.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * @return {OpenLayers.Map}
     */
    init : function(sandbox) {

        sandbox.printDebug("Initializing map module...#############################################");

        this._sandbox = sandbox;

        if (this._sandbox) {
            // set srsName to Oskari.mapframework.domain.Map
            this._sandbox.getMap().setSrsName(this._options.srsName);
        }


        // register events & requesthandlers
        // TODO: should these be in start-method?
        for(p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        this.requestHandlers = {
            mapLayerUpdateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler', sandbox, this),
            mapMoveRequestHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMoveRequestHandler', sandbox, this),
            clearHistoryHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.controls.ClearHistoryHandler', sandbox, this)
        };
        sandbox.addRequestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
        sandbox.addRequestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);
        sandbox.addRequestHandler('ClearHistoryRequest', this.requestHandlers.clearHistoryHandler);

        this._createMap();
        // changed to resolutions based map zoom levels
        // -> calculate scales array for backward compatibility
        for(var i = 0; i < this._options.resolutions.length; ++i) {

            var calculatedScale = OpenLayers.Util.getScaleFromResolution(this._options.resolutions[i], this._map.units);
            // rounding off the resolution to scale calculation
            calculatedScale = calculatedScale * 100000000;
            calculatedScale = Math.round(calculatedScale);
            calculatedScale = calculatedScale / 100000000;
            this._mapScales.push(calculatedScale);
        }
        this._createBaseLayer();

        this.addMapControl('navigationHistoryTool', this._navigationHistoryTool);
        this.getMapControl('navigationHistoryTool').activate();

        return this._map;
    },

    /**
     * @method getPluginInstances
     * Returns object containing plugins that have been registered to the map.
     * @return {Object} contains plugin ids as keys and plugin objects as values
     */
    getPluginInstances : function() {
        return this._pluginInstances;
    },
    /**
     * @method getPluginInstance
     * Returns plugin with given name if it registered on the map
     * @param {String} pluginName name of the plugin to get
     * @return {Oskari.mapframework.ui.module.common.mapmodule.Plugin}
     */
    getPluginInstance : function(pluginName) {
        return this._pluginInstances[this.getName() + pluginName];
    },
    /**
     * @method isPluginActivated
     * Checks if a plugin matching the given name is registered to the map
     * @param {String} pluginName name of the plugin to check
     * @return {Boolean} true if a plugin with given name is registered to the map
     */
    isPluginActivated : function(pluginName) {
        var plugin = this._pluginInstances[this.getName() + pluginName];
        if(plugin) {
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
    registerPlugin : function(plugin) {
        var sandbox = this._sandbox;
        plugin.setMapModule(this);
        var pluginName = plugin.getName();
        sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
        plugin.register();
        this._pluginInstances[pluginName] = plugin;
    },
    /**
     * @method unregisterPlugin
     * Unregisters the given plugin from this map module. Sets the mapmodule reference on the plugin
     * to <null> and calls plugins unregister method. Removes the reference to the plugin from
     * getPluginInstances().
     * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
     */
    unregisterPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();
        sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
        plugin.unregister();
        this._pluginInstances[pluginName] = undefined;
        plugin.setMapModule(null);
        delete this._pluginInstances[pluginName];
    },
    /**
     * @method startPlugin
     * Starts the given plugin by calling its startPlugin() method.
     * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
     */
    startPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();

        sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.startPlugin(sandbox);
    },
    /**
     * @method stopPlugin
     * Stops the given plugin by calling its stopPlugin() method.
     * @param {Oskari.mapframework.ui.module.common.mapmodule.Plugin} plugin
     */
    stopPlugin : function(plugin) {
        var sandbox = this._sandbox;
        var pluginName = plugin.getName();

        sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
        plugin.stopPlugin(sandbox);
    },
    /**
     * @method startPlugin
     * Starts all registered plugins (see getPluginInstances() and registerPlugin()) by
     * calling its startPlugin() method.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    startPlugins : function(sandbox) {
        for(var pluginName in this._pluginInstances) {
            sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            this._pluginInstances[pluginName].startPlugin(sandbox);
        }
    },
    /**
     * @method stopPlugins
     * Stops all registered plugins (see getPluginInstances() and registerPlugin()) by
     * calling its stopPlugin() method.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stopPlugins : function(sandbox) {
        for(var pluginName in this._pluginInstances) {
            sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            this._pluginInstances[pluginName].stopPlugin(sandbox);
        }
    },
    /**
     * @method getStealth
     * Returns boolean true if map is in "stealth mode". Stealth mode means that the map doesn't send events
     * and doesn't update the map domain object in sandbox
     * @return {Boolean}
     */
    getStealth : function() {
        return this._stealth;
    },
    /**
     * @method setStealth
     * Enables/disables the maps "stealth mode". Stealth mode means that the map doesn't send events
     * and doesn't update the map domain object in sandbox
     * @param {Boolean} bln true to enable stealth mode
     */
    setStealth : function(bln) {
        this._stealth = (bln == true);
    },
    /**
     * @method notifyAll
     * Calls sandbox.notifyAll with the parameters if stealth mode is not enabled
     * @param {Oskari.mapframework.event.Event} event - event to send
     * @param {Boolean} retainEvent true to not send event but only print debug which modules are listening, usually left undefined (optional)
     */
    notifyAll : function(event, retainEvent) {
        // propably not called anymore?
        if(this._stealth) {
            return;
        }

        this._sandbox.notifyAll(event, retainEvent);
    },
    /**
     * @method getMap
     * Returns a reference to the actual OpenLayers implementation
     * @return {OpenLayers.Map}
     */
    getMap : function() {
        return this._map;
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
     * @method transformCoordinates
     * Transforms coordinates from given projection to the maps projectino.
     * @param {OpenLayers.LonLat} pLonlat
     * @param {String} srs projection for given lonlat params like "EPSG:4326"
     * @return {OpenLayers.LonLat} transformed coordinates
     */
    transformCoordinates : function(pLonlat, srs) {
        return pLonlat.transform(
            new OpenLayers.Projection(srs),
            this.getMap().getProjectionObject()
        );
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
        if(this._options!=null && this._options.maxExtent !=null
        		&& this._options.maxExtent.left != null && this._options.maxExtent.bottom != null
        		&& this._options.maxExtent.right != null && this._options.maxExtent.top != null){
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
        if(zoomAdjust) {
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
        if(suppressEnd !== true) {
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
        this._map.zoomToScale(scale,isClosest);
        this._updateDomain();
        if(suppressEnd !== true) {
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
    centerMap: function(lonlat,zoom, suppressEnd) {
        // TODO: openlayers has isValidLonLat(); maybe use it here
    	this._map.setCenter(lonlat,zoom,false);
    	this._updateDomain();
    	if(suppressEnd !== true) {
            this.notifyMoveEnd();
        }
    },
    /**
     * @method zoomIn
     * Adjusts the zoom level by one
     */
    zoomIn : function() {
        this.adjustZoomLevel(1);
    },
    /**
     * @method zoomOut
     * Adjusts the zoom level by minus one
     */
    zoomOut : function() {
        this.adjustZoomLevel(-1);
    },
    /**
     * @method zoomTo
     * Sets the zoom level to given value
     * @param {Number} zoomLevel the new zoom level
     */
    zoomTo : function(zoomLevel) {
        this.setZoomLevel(zoomLevel, false);
    },
    /**
     * @method panMapEast
     * Pans the map toward east by 3/4 of the map width
     */
    panMapEast : function() {
        var size = this._map.getSize();
        this.panMapByPixels(0.75 * size.w, 0);
    },
    /**
     * @method panMapWest
     * Pans the map toward west by 3/4 of the map width
     */
    panMapWest : function() {
        var size = this._map.getSize();
        this.panMapByPixels(-0.75 * size.w, 0);
    },
    /**
     * @method panMapNorth
     * Pans the map toward north by 3/4 of the map height
     */
    panMapNorth : function() {
        var size = this._map.getSize();
        this.panMapByPixels(0, -0.75 * size.h);
    },
    /**
     * @method panMapSouth
     * Pans the map toward south by 3/4 of the map height
     */
    panMapSouth : function() {
        var size = this._map.getSize();
        this.panMapByPixels(0, 0.75 * size.h);
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
    panMapByPixels : function(pX, pY, suppressStart, suppressEnd,isDrag) {
        // usually programmatically for gfi centering
        this._map.pan(pX, pY,{dragging: (isDrag?true:false), animate: false});

        this._updateDomain();
        // send note about map change
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
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
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
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
    /**
     * @method isValidLonLat
     * Checks that latitude is between 8 200 000 <> 6 250 000 and
     * that longitude is between 0 <> 1 350 000
     * @param {Number} lon longitude to check
     * @param {Number} lat latitude to check
     * @return {Boolean} true if coordinates are in said boundaries
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
        if(suppressStart !== true) {
            this.notifyStartMove();
        }
        if(suppressEnd !== true) {
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
        if(suppressEvent !== true) {
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
        if(newZoomLevel == this._map.getZoom()) {
        	// do nothing if requested zoom is same as current
        	return;
        }
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

        if(requestedZoomLevel >= 0 && requestedZoomLevel <= this._map.getNumZoomLevels()) {
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
    /**
     * @method notifyMoveEnd
     * Notify other components that the map has moved. Sends a AfterMapMoveEvent and updates the
     * sandbox map domain object with the current map properties.
     * Ignores the call if map is in stealth mode. Plugins should use this to notify other components
     * if they move the map through OpenLayers reference. All map movement methods implemented in mapmodule
     * (this class) calls this automatically if not stated otherwise in API documentation.
     */
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
     * @method calculateLayerScales
     * Calculate a subset of maps scales array that matches the given boundaries.
     * If boundaries are not defined, returns all possible scales.
     * @param {Number} maxScale maximum scale boundary (optional)
     * @param {Number} minScale minimum scale boundary (optional)
     * @return {Number[]} calculated mapscales that are within given bounds
     */
    calculateLayerScales : function(maxScale, minScale) {
        var layerScales = [];
        for(var i = 0; i < this._mapScales.length; i++) {
            if((!minScale || minScale >= this._mapScales[i]) &&
               (!maxScale || maxScale <= this._mapScales[i])) {
                    layerScales.push(this._mapScales[i]);
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
    calculateLayerResolutions : function(maxScale, minScale) {
        var layerResolutions = [];
        for(var i = 0; i < this._mapScales.length; i++) {
            if((!minScale || minScale >= this._mapScales[i]) &&
               (!maxScale || maxScale <= this._mapScales[i])) {
                    // resolutions are in the same order as scales so just use them
                    layerResolutions.push(this._options.resolutions[i]);
               }
        }
        return layerResolutions;
    },
    /**
     * @method getClosestZoomLevel
     * Calculate closest zoom level given the given boundaries.
     * If map is zoomed too close -> returns the closest zoom level level possible within given bounds
     * If map is zoomed too far out -> returns the furthest zoom level possible within given bounds
     * If the boundaries are within current zoomlevel or undefined, returns the current zoomLevel
     * @param {Number} maxScale maximum scale boundary (optional)
     * @param {Number} minScale minimum scale boundary (optional)
     * @return {Number} zoomLevel (0-12)
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
    /**
     * @method start
     * implements BundleInstance protocol start method
     * Starts the plugins registered on the map and adds
     * selected layers on the map if layers were selected before
     * mapmodule was registered to listen to these events.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    start : function(sandbox) {

        if(this.started) {
            return;
        }

        sandbox.printDebug("Starting " + this.getName());

        this.startPlugins(sandbox);
        this.updateCurrentState();
        this.started = true;
    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method
     * Stops the plugins registered on the map.
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     */
    stop : function(sandbox) {

        if(!this.started) {
            return;
        }

        this.stopPlugins(sandbox);
        this.started = false;
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
        if(markerLayer) {
            for(var i = 0; i < markerLayer.length; i++) {
                if(markerLayer[i]) {
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
     * @property eventHandlers
     * @static
     */
    eventHandlers : {
        'SearchClearedEvent' : function(event) {
            this._removeMarkers();
        }
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        var handler = this.eventHandlers[event.getName()];
        if(!handler) {
            return;
        }

        return handler.apply(this, [event]);
    },
    /**
     * @method getOLMapLayers
     * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
     * Internally calls getOLMapLayers() on all registered layersplugins.
     * @param {String} layerId
     * @return {OpenLayers.Layer[]}
     */
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

        for(p in lps) {
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
    changeCssClasses: function(classToAdd, removeClassRegex, elements) {
        var i, j, el;

        for (var i = 0; i < elements.length; i++) {
            el = elements[i];

            el.removeClass(function(i, classes) {
                var removeThese = '',
                    classNames = classes.split(' ');

                // Check if there are any old font classes.
                for (var j = 0; j < classNames.length; ++j) {
                    if(removeClassRegex.test(classNames[j])) {
                        removeThese += classNames[j] + ' ';
                    }
                }

                // Return the class names to be removed.
                return removeThese;
            });

            // Add the new font as a CSS class.
            el.addClass(classToAdd);
        }
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});
