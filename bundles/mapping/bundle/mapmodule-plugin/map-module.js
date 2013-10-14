/**
 * @class Oskari.mapping.mapmodule.AbstractMapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.AbstractFunc = function() {
    var name = arguments[0];
    return function() {
        throw "AbstractFuncCalled: " + name;
    }
};
Oskari.NoOpFunc = function() {
};

Oskari.clazz.define('Oskari.mapping.mapmodule.AbstractMapModule',
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
 *          bottom : 10000000,
 *          right : 10000000,
 *          top : 0
 *      },
 srsName : "EPSG:3067"
 *  }
 */
function(id, imageUrl, options) {

    this._id = id;
    this._imageUrl = imageUrl;
    this._options = options;

    this._controls = {};
    this._layerPlugins = {};

    /** @static @property {String} _projectionCode SRS projection code, defaults
     * to 'EPSG:3067' */
    this._projection = null;
    this._projectionCode = options.srsName;
    this._supportedFormats = {};

    this._map = null;

    // _mapScales are calculated based on resolutions on init
    this._mapScales = [];
    this._mapResolutions = options.resolutions;
    // arr
    this._maxExtent = options.maxExtent;
    // props: left,bottom,right, top
    this._extent = [this._maxExtent.left, this._maxExtent.bottom, this._maxExtent.right, this._maxExtent.top];
    // arr

    this._sandbox = null;
    this._stealth = false;

    this._pluginInstances = {};

    // mapcontrols assumes this to be present before init or start
    this._localization = null;

    /* array of { id: <id>, name: <name>, layer: layer, impl: layerImpl } */
    this.layerDefs = [];
    this.layerDefsById = {};
}, {
    /**
     * @method getImageUrl
     * Returns a base url for plugins to show. Can be set in constructor and
     * defaults to "/Oskari/resources" if not set.
     * @return {String}
     */
    getImageUrl : function() {
        if (!this._imageUrl) {
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
        this._addMapControlImpl(ctl);
    },
    /**
     * @method removeMapControl
     * Removes a control from the map matching the given id/name and
     * also removes it from references gotten by getControls()
     * @param {String} id control id/name
     */
    removeMapControl : function(id) {
        this._removeMapControlImpl(ctl);
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
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key, force) {
        if (!this._localization || force === true) {
            this._localization = Oskari.getLocalization('MapModule');
        }
        if (key) {
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

        sandbox.printDebug("Initializing oskari map module...#############################################");

        this._sandbox = sandbox;

        // setting options
        if (this._options) {
            if (this._options.resolutions) {
                this._mapResolutions = this._options.resolutions;
            }
            if (this._options.srsName) {
                this._projectionCode = this._options.srsName;
                // set srsName to Oskari.mapframework.domain.Map
                if (this._sandbox) {
                    this._sandbox.getMap().setSrsName(this._projectionCode);
                }
            }
        }

        // register events & requesthandlers
        // TODO: should these be in start-method?
        for (p in this.eventHandlers ) {
            sandbox.registerForEventByName(this, p);
        }

        this.requestHandlers = {
            mapLayerUpdateHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapLayerUpdateRequestHandler', sandbox, this),
            mapMoveRequestHandler : Oskari.clazz.create('Oskari.mapping.bundle.mapmodule.request.MapMoveRequestHandler', sandbox, this)
        };
        sandbox.addRequestHandler('MapModulePlugin.MapLayerUpdateRequest', this.requestHandlers.mapLayerUpdateHandler);
        sandbox.addRequestHandler('MapMoveRequest', this.requestHandlers.mapMoveRequestHandler);
        sandbox.addRequestHandler('ClearHistoryRequest', this.requestHandlers.clearHistoryHandler);

        this._createMap();
        // changed to resolutions based map zoom levels
        // -> calculate scales array for backward compatibility
        for (var i = 0; i < this._mapResolutions.length; ++i) {
            var calculatedScale = OpenLayers.Util.getScaleFromResolution(this._mapResolutions[i], 'm');
            calculatedScale = calculatedScale * 10000;
            calculatedScale = Math.round(calculatedScale);
            calculatedScale = calculatedScale / 10000;
            this._mapScales.push(calculatedScale);
        }


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
        for (var pluginName in this._pluginInstances) {
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
        for (var pluginName in this._pluginInstances) {
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
        if (this._stealth) {
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
     * @method transformCoordinates
     * Transforms coordinates from given projection to the maps projectino.
     * @param {OpenLayers.LonLat} pLonlat
     * @param {String} srs projection for given lonlat params like "EPSG:4326"
     * @return {OpenLayers.LonLat} transformed coordinates
     */
    transformCoordinates : function(pLonlat, srs) {
        return pLonlat.transform(new OpenLayers.Projection(srs), this.getMap().getProjectionObject());
    },

    /**
     * @method getProjection
     * Returns the SRS projection code for the map.
     * Currently always 'EPSG:3067'
     * @return {String}
     */
    getProjection : function() {
        return this._projectionCode;
    },
    getProjectionObject : function() {
        return this._projection;
    },
    getResolutionArray : function() {
        return this._mapResolutions;
    },
    getExtentArray : function() {
        return this._extent;
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
        var size = this.getMapSize();
        this.panMapByPixels(0.75 * size.w, 0);
    },
    /**
     * @method panMapWest
     * Pans the map toward west by 3/4 of the map width
     */
    panMapWest : function() {
        var size = this.getMapSize();
        this.panMapByPixels(-0.75 * size.w, 0);
    },
    /**
     * @method panMapNorth
     * Pans the map toward north by 3/4 of the map height
     */
    panMapNorth : function() {
        var size = this.getMapSize();
        this.panMapByPixels(0, -0.75 * size.h);
    },
    /**
     * @method panMapSouth
     * Pans the map toward south by 3/4 of the map height
     */
    panMapSouth : function() {
        var size = this.getMapSize();
        this.panMapByPixels(0, 0.75 * size.h);
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
        return this.panMapByPixels(pX, pY, suppressStart, suppressEnd);
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
        if (lat < 6250000 || lat > 8200000) {
            isOk = false;
            return isOk;
        }
        if (lon < 0 || lon > 1350000) {
            isOk = false;
        }
        return isOk;
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
        var zoomLevel = this.getZoomLevel();

        if (!minScale || !maxScale) {
            return zoomLevel;
        }

        var scale = this.getMapScale();

        if (scale < minScale) {
            // zoom out
            //for(var i = this._mapScales.length; i > zoomLevel; i--) {
            for (var i = zoomLevel; i > 0; i--) {
                if (this._mapScales[i] >= minScale) {
                    return i;
                }
            }
        } else if (scale > maxScale) {
            // zoom in
            for (var i = zoomLevel; i < this._mapScales.length; i++) {
                if (this._mapScales[i] <= maxScale) {
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

        if (this.started) {
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

        if (!this.started) {
            return;
        }

        this.stopPlugins(sandbox);
        this.started = false;
    },

    /**
     * @property eventHandlers
     * @static
     */
    eventHandlers : {
        'SearchClearedEvent' : function(event) {

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
        if (!handler) {
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
        if (!layer) {
            // not found
            return null;
        }
        var lps = this.getLayerPlugins();
        // let the actual layerplugins find the layer since the name depends on
        // type

        var results = [];

        for (var p in lps) {
            var layersPlugin = lps[p];
            // find the actual openlayers layers (can be many)
            var layerList = layersPlugin.getOLMapLayers(layer);
            if (layerList) {
                // if found -> return list
                // otherwise continue looping
                for (var l = 0; l < layerList.length; l++) {
                    results.push(layerList[l]);
                }
            }
        }
        return results.length > 0 ? results : null;
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

    /*
     * moved here to make generalization easier
     */
    getLayersByName : function(name) {
        var results = [];
        var layerDefs = this.layerDefs;
        for (var l = 0; l < layerDefs.length; l++) {

            var ldef = layerDefs[l];

            if (ldef.name.indexOf(name) != -1) {
                results.push(ldef.impl);
            }

        }

        return results;
    },

    getLayers : function() {
        return this.layerDefs;
    },

    getLayerDefs : function() {
        return this.layerDefs;
    },

    addLayer : function(layerImpl, layer, name) {
        var ldef = {
            name : name,
            id : layer.getId(),
            impl : layerImpl,
            layer : layer
        };
        this.layerDefs.push(ldef);

        this.layerDefsById[layer.getId()] = ldef;

        this._addLayerImpl(layerImpl);
    },

    removeLayer : function(layerImpl, layer, name) {

        this._removeLayerImpl(layerImpl);
        delete this.layerDefsById[layer.getId()];

        var newDefs = [];
        for (var n = 0; n < this.layerDefs.length; n++) {
            if (this.layerDefs[n].layer.getId() !== layer.getId()) {
                newDefs.push(this.layerDefs[n]);
                continue;
            }
            delete this.layerDefs[n];
        }
        this.layerDefs = newDefs;

    },

    setLayerIndex : function(layerImpl, index) {
        var layerArr = this.getLayerDefs();
        var layerIndex = this.getLayerIndex(layerImpl);
        var newLayerArr = [];
        var prevDef = layerArr[layerIndex];

        var n = 0;
        for ( n = 0; n < layerArr.length; n++) {
            if (n === index && prevDef) {
                newLayerArr.push(prevDef);
                prevDef = null;
            }
            if (!(layerArr[n].impl === layerImpl )) {
                newLayerArr.push(layerArr[n]);
            }
        }
        if (n === index && prevDef) {
            newLayerArr.push(prevDef);
        }

        this.layerDefs = newLayerArr;
        for ( n = 0; n < layerArr.length; n++) {
            this._setLayerImplIndex(layerArr[n].impl, n);
        }

    },

    getLayerIndex : function(layerImpl) {
        var layerArr = this.getLayerDefs();

        for (var n = 0; n < layerArr.length; n++) {
            if (layerArr[n].impl === layerImpl) {
                return n;
            }
        }
        return -1;

    },

    getMapScale : function() {
        var size = this.getMapSize();
        var extent = this.getMapExtent();
        var res = (extent[2] - extent[0] ) / size[0];
        return OpenLayers.Util.getScaleFromResolution(res, 'm');

    },

    getMapSize : function() {
        var mapContainer = jQuery(this._map.getContainer());
        return [mapContainer.width(), mapContainer.height()];
    },
    getMapExtent : function() {
        var bounds = this._map.getBounds();
        var bsw = bounds.getSouthWest();
        var sw = this._map2Crs(bsw.lng, bsw.lat);
        var bne = bounds.getNorthEast();
        var ne = this._map2Crs(bne.lng, bsw.lat);
        return [sw.x, sw.y, ne.x, ne.y];
    },

    _crs2Map : Oskari.AbstractFunc("_crs2Map"),
    _map2Crs : Oskari.AbstractFunc("_map2Crs"),

    updateSize : Oskari.AbstractFunc("updateSize"),

    /**
     * @method createMap
     * @private
     * Creates the OpenLayers.Map object
     * @return {OpenLayers.Map}
     */
    _createMap : Oskari.AbstractFunc("_createMap"),

    /**
     * @method moveMapToLanLot
     * Moves the map to the given position.
     * NOTE! Doesn't send an event if zoom level is not changed.
     * Call notifyMoveEnd() afterwards to notify other components about changed state.
     * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
     * @param {Number} zoomAdjust relative change to the zoom level f.ex -1 (optional)
     * @param {Boolean} pIsDragging true if the user is dragging the map to a new location currently (optional)
     */
    moveMapToLanLot : Oskari.AbstractFunc("moveMapToLanLot"),
    /**
     * @method panMapToLonLat
     * Pans the map to the given position.
     * @param {OpenLayers.LonLat} lonlat coordinates to pan the map to
     * @param {Boolean} suppressEnd true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    panMapToLonLat : Oskari.AbstractFunc("moveMapToLanLot"),
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
    zoomToScale : Oskari.AbstractFunc("zoomToScale"),
    /**
     * @method centerMap
     * Moves the map to the given position and zoomlevel.
     * @param {OpenLayers.LonLat} lonlat coordinates to move the map to
     * @param {Number} zoomLevel absolute zoomlevel to set the map to
     * @param {Boolean} suppressEnd true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    centerMap : Oskari.AbstractFunc("centerMap"),
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
    panMapByPixels : Oskari.AbstractFunc("panMapByPixels"),

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
    centerMapByPixels : Oskari.AbstractFunc("centerMapByPixels"),

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
    zoomToExtent : Oskari.AbstractFunc("zoomToExtent"),

    /**
     * @method setZoomLevel
     * Sets the maps zoom level to given absolute number
     * @param {Number} newZoomLevel absolute zoom level (0-12)
     * @param {Boolean} suppressEvent true to NOT send an event about the map move
     *  (other components wont know that the map has moved, only use when chaining moves and
     *     wanting to notify at end of the chain for performance reasons or similar) (optional)
     */
    setZoomLevel : Oskari.AbstractFunc("setZoomLevel"),

    /**
     * @method getZoomLevel
     * gets the maps zoom level to given absolute number
     * @return {Number} newZoomLevel absolute zoom level (0-12)
     */
    getZoomLevel : Oskari.AbstractFunc("getZoomLevel"),

    /**
     * @method _updateDomain
     * @private
     * Updates the sandbox map domain object with the current map properties.
     * Ignores the call if map is in stealth mode.
     */
    _updateDomain : Oskari.AbstractFunc("_updateDomain"),

    _addLayerImpl : Oskari.AbstractFunc("_addLayerImpl(layerImpl)"),

    _setLayerImplIndex : Oskari.AbstractFunc("_setLayerImplIndex(layerImpl,n)"),

    _removeLayerImpl : Oskari.AbstractFunc("_removeLayerImpl(layerImpl)"),

    getMapSize : Oskari.AbstractFunc("getMapSize"),
    getMapExtent : Oskari.AbstractFunc("getMapExtent"),

    _setLayerImplVisible : Oskari.AbstractFunc("_setLayerImplVisible"),

    _setLayerImplOpacity : Oskari.AbstractFunc("_setLayerImplOpacity"),

    /**
     * @method calculateLayerScales
     * Calculate a subset of maps scales array that matches the given boundaries.
     * If boundaries are not defined, returns all possible scales.
     * @param {Number} maxScale maximum scale boundary (optional)
     * @param {Number} minScale minimum scale boundary (optional)
     * @return {Number[]} calculated mapscales that are within given bounds
     */
    calculateLayerMinMaxResolutions : function(maxScale, minScale) {
        var minScaleZoom = undefined;
        var maxScaleZoom = undefined;
        for (var i = 0; i < this._mapScales.length; i++) {
            if ((!minScale || minScale >= this._mapScales[i]) && (!maxScale || maxScale <= this._mapScales[i])) {
                if (minScaleZoom === undefined) {
                    minScaleZoom = i;
                }
                maxScaleZoom = i;
            }
        }
        return {
            min : minScaleZoom,
            max : maxScaleZoom
        };
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
        for (var i = 0; i < this._mapScales.length; i++) {
            if ((!minScale || minScale >= this._mapScales[i]) && (!maxScale || maxScale <= this._mapScales[i])) {
                layerScales.push(this._mapScales[i]);
            }
        }
        return layerScales;
    },

    adjustZoomLevel : Oskari.AbstractFunc("adjustZoomLevel(amount, suppressEvent)"),

    notifyMoveEnd : function() {
    },

    _addMapControlImpl : function(ctl) {

    },

    _removeMapControlImpl : function(ctl) {

    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});
