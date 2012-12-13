/**
 * @class Oskari.mapframework.bundle.mappublished.GeoLocationPlugin
 * Tries to 
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.GeoLocationPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._locationIsSet = false;
}, {
    /** @static @property __name plugin name */
    __name : 'GeoLocationPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        if(mapModule) {
            this.pluginName = mapModule.getName() + this.__name;
        }
    },
    /**
     * @method hasUI
     * @return {Boolean} true
     * This plugin has an UI so always returns true
     */
    hasUI : function() {
        return true;
    },
    /**
     * @method init
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
    },
    /**
     * @method register
     * Interface method for the plugin protocol
     */
    register : function() {

    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     */
    unregister : function() {

    },
    /**
     * @method startPlugin
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        this._setupLocation();
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

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
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
    },

	/** 
	 * @method onEvent
	 * @param {Oskari.mapframework.event.Event} event a Oskari event object
	 * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
	 */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method hasSetLocation
     * Returns a flag if the location has been set with this plugin
     * @return {Boolean}
     */
    hasSetLocation : function() {
        return this._locationIsSet;
    },
    /**
     * @method _setupLocation
     * @private
     * Tries to get the geolocation from browser and move the map to the location
     */
    _setupLocation : function() {
        var me = this;
        var callback = function(lon, lat) {
            // transform coordinates from browser projection to current
            var lonlat = me.getMapModule().transformCoordinates(
                new OpenLayers.LonLat(lon, lat), "EPSG:4326");
            me.getMapModule().centerMap(lonlat, 6);
            me._locationIsSet = true;
        }
        /* 
        var showError = function(error) {
          switch(error.code)
            {
            case error.PERMISSION_DENIED:
              alert("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              alert("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              alert("The request to get user location timed out.");
              break;
            case error.UNKNOWN_ERROR:
              alert("An unknown error occurred.");
              break;
            }
          };
 */
  
        if(navigator.geolocation)
        {
            // if users just ignores/closes the browser dialog 
            // -> error handler won't be called in most browsers
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                callback(lon, lat);
            }, function(errors) {
                //ignored
            }, {
                // accept and hour long cached position
                maximumAge:3600000,
                // timeout after 6 seconds
                timeout:6000
            });
        }
        else if(geoip_latitude && geoip_longitude) {
            // if available, use http://dev.maxmind.com/geoip/javascript
            var lat = geoip_latitude();
            var lon = geoip_longitude();
            callback(lon, lat);
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
