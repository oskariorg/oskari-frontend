/**
 * @class Oskari.mapframework.ui.module.common.MapModule
 *
 * Provides map functionality/Wraps actual map implementation (Openlayers).
 * Currently hardcoded at 13 zoomlevels (0-12) and SRS projection code 'EPSG:3067'.
 * There are plans to make these more configurable in the future.
 *
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapmodule
 */
Oskari.clazz.define('Oskari.leaflet.ui.module.common.MapModule',
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
 *		maxExtent : {
 *			left : 0,
 *			bottom : 10000000,
 *			right : 10000000,
 *			top : 0
 *		},
 srsName : "EPSG:3067"
 *	}
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

    },
    /**
     * @method removeMapControl
     * Removes a control from the map matching the given id/name and
     * also removes it from references gotten by getControls()
     * @param {String} id control id/name
     */
    removeMapControl : function(id) {

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
     * 		JSON object for complete data depending on localization
     * 		structure and if parameter key is given
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

        sandbox.printDebug("Initializing leaflet map module...#############################################");

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
            mapMoveRequestHandler : Oskari.clazz.create('Oskari.leaflet.bundle.mapmodule.request.MapMoveRequestHandler', sandbox, this)
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

        this._createBaseLayer();

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

        var maxExtent = this._maxExtent;
        var extent = this._extent;

        L.CRS.proj4js = ( function() {
                var createProjection = function(code, def, /*L.Transformation*/transformation) {
                    if ( typeof (def) !== 'undefined') {
                        Proj4js.defs[code] = def;
                    }
                    var proj = new Proj4js.Proj(code);

                    return {
                        project : function(latlng) {
                            var point = new L.Point(latlng.lng, latlng.lat);
                            return Proj4js.transform(Proj4js.WGS84, proj, point);
                        },

                        unproject : function(point, unbounded) {
                            var point2 = Proj4js.transform(proj, Proj4js.WGS84, point.clone());
                            return new L.LatLng(point2.y, point2.x, unbounded);
                        }
                    };
                };

                return function(code, def, transformation) {
                    return L.Util.extend({}, L.CRS, {
                        code : code,
                        transformation : transformation ? transformation : new L.Transformation(1, 0, -1, 0),
                        projection : createProjection(code, def)
                    });
                };
            }());

        /* TODO support others as well */
        console.log("WARNING: EPSG:3067 hard coded temporarily");
        var crs = L.CRS.proj4js('EPSG:3067', '+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs', new L.Transformation(1, 548576.0, -1, 8388608));

        crs.scale = function(zoom) {
            return 1 / resolutions[zoom];
            //    return 1 / ( 8192 / Math.pow(2, zoom) );
        };

        this._projection = crs;

        var resolutions = this._mapResolutions;

        var map = L.map('mapdiv', {
            crs : crs,
            scale : function(zoom) {
                //  return 1 / ( 8192 / Math.pow(2, zoom) );
                return 1 / resolutions[zoom];
            },
            center : [65.53425, 24.86703333],
            zoom : 2,
            continuousWorld : true,
            trackResize: true
        });

        var me = this;

        map.on('moveend', function(e) {
            //

            var extent = me.getMapExtent();
            var center = map.getCenter();
            var zoom = map.getZoom();
            var lonlat = me._map2Crs(center.lng, center.lat);
            console.log("MOVEEND", e, extent, center, zoom, lonlat);

            me._updateDomain();
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
     * @method createBaseLayer
     * Creates a dummy base layer and adds it to the map. Nothing to do with Oskari maplayers really.
     * @private
     */
    _createBaseLayer : function() {

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
        var mapLatLon = this._crs2Map(lonlat.lon, lonlat.lat);
        this._map.setView(mapLatLon);

        if (zoomAdjust) {
            this.adjustZoomLevel(zoomAdjust, true);
        }
        /* (function() {
         var bern = [530455.942,6754125.183];
         var duration = 2000;
         var start = +new Date();
         var pan = ol.animation.pan({
         duration: duration,
         source: view.getCenter(),
         start: start
         });
         var bounce = ol.animation.bounce({
         duration: duration,
         resolution: 4 * view.getResolution(),
         start: start
         });
         map.beforeRender(pan, bounce);
         view.setCenter(bern);
         })()
         */

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
        var mapLatLon = this._crs2Map(lonlat.lon, lonlat.lat);
        this._map.setView(mapLatLon);
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
        var mapLatLon = this._crs2Map(lonlat.lon, lonlat.lat);
        this._map.setView(mapLatLon, zoom || this._map.getZoom());

        this._updateDomain();
        if (suppressEnd !== true) {
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

        console.log("NYI: panMapByPixels", arguments);
        /*

         this._updateDomain();
         // send note about map change
         if (suppressStart !== true) {
         this.notifyStartMove();
         }
         if (suppressEnd !== true) {
         this.notifyMoveEnd();
         }

         */
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
        
        var sw = this._crs2Map(bounds.left,bounds.bottom);
        var ne = this._crs2Map(bounds.right,bounds.top);
        var mapBounds = new L.LatLngBounds(sw,ne); 
        
        this._map.fitBounds(mapBounds);

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
        /*var requestedZoomLevel = this._getNewZoomLevel(amount);

         this._map.zoomTo(requestedZoomLevel);*/
        var delta = amount;
        var currZoom = this._map.getZoom();
        this._map.setZoom(currZoom + delta);

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
        if (newZoomLevel == this._map.getZoom()) {
            // do nothing if requested zoom is same as current
            return;
        }
        if (newZoomLevel < 0 || newZoomLevel > this._map.getNumZoomLevels) {
            newZoomLevel = this._map.getZoom();
        }
        this._map.setZoom(newZoomLevel);
        this._updateDomain();
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
    notifyMoveEnd : function() {
        /*if (this.getStealth()) {
         // ignore if in "stealth mode"
         return;
         }
         var sandbox = this._sandbox;
         sandbox.getMap().setMoving(false);

         var lonlat = this._map.getCenter();
         this._updateDomain();
         var scale = this.getMapScale();
         var zoom = this._map.getZoom();
         var evt = sandbox.getEventBuilder('AfterMapMoveEvent')(lonlat[0], lonlat[0], zoom, false, scale);
         sandbox.notifyAll(evt);
         */
        var sandbox = this._sandbox;
        sandbox.printDebug("notifyMoveEnd CALLED BUT will not send");
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
        var latlng = this._map.getCenter();
        var lonlat = this._map2Crs(latlng.lng,latlng.lat);
        
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
                if( minScaleZoom === undefined ) {
                    minScaleZoom = i; 
                }
                maxScaleZoom = i; 
            }
        }
        return { min: minScaleZoom, max: maxScaleZoom };
    },
    /**
     * @method calculateLayerScales
     * Calculate closest zoom level given the given boundaries.
     * If map is zoomed too close -> returns the closest zoom level level possible within given bounds
     * If map is zoomed too far out -> returns the furthest zoom level possible within given bounds
     * If the boundaries are within current zoomlevel or undefined, returns the current zoomLevel
     * @param {Number} maxScale maximum scale boundary (optional)
     * @param {Number} minScale minimum scale boundary (optional)
     * @return {Number} zoomLevel (0-12)
     */
    getClosestZoomLevel : function(maxScale, minScale) {
        var zoomLevel = this._map.getView().getZoom();

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
        for (var p in lps) {
            var layersPlugin = lps[p];
            // find the actual openlayers layers (can be many)
            var layerList = layersPlugin.getOLMapLayers(layer);
            if (layerList) {
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

        this._map.addLayer(layerImpl);
    },

    removeLayer : function(layerImpl, layer, name) {

        this._map.removeLayer(layerImpl);
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
        /*var layerColl = this._map.getLayers();
        var layerIndex = this.getLayerIndex(layerImpl);

        
        
        if (index === layerIndex) {
            return
        } else if (index === layerColl.getLength()) {
           
            layerColl.removeAt(layerIndex);
            layerColl.insertAt(index, layerImpl);
        } else if (layerIndex < index) {
           
            layerColl.removeAt(layerIndex);
            layerColl.insertAt(index - 1, layerImpl);

        } else {
            layerColl.removeAt(layerIndex);
            layerColl.insertAt(index, layerImpl);
        }
        */
    },

    getLayerIndex : function(layerImpl) {
        /*var layerColl = this._map.getLayers();
        var layerArr = layerColl.getArray();

        for (var n = 0; n < layerArr.length; n++) {
            if (layerArr[n] === layerImpl) {
                return n;
            }
        }*/
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

    _crs2Map : function(x, y) {
        return this._projection.projection.unproject(new L.Point(x, y));
    },
    _map2Crs : function(x, y) {
        return this._projection.projection.project(new L.LatLng(y, x));
    }
}, {
    /**
     * @property {String[]} protocol
     * @static
     */
    'protocol' : ['Oskari.mapframework.module.Module']
});
