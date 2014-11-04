/**
 * @class Oskari.mapframework.bundle.mappublished.GeoLocationPlugin
 *
 * Tries to locate the user by using HTML5 GeoLocation services or tries a fallback to
 * http://dev.maxmind.com/geoip/javascript GeoIP if GeoLocation is not available.
 * Centers the map on the users location with zoom level 6 if location is determined successfully.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.GeoLocationPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.GeoLocationPlugin';
        me._name = 'GeoLocationPlugin';

        me._locationIsSet = false;
    }, {
        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol
         *
         *
         */
        _startPluginImpl: function () {
            this._setupLocation();
        },

        /**
         * @method hasSetLocation
         * Returns a flag if the location has been set with this plugin
         *
         *
         * @return {Boolean}
         */
        hasSetLocation: function () {
            return this._locationIsSet;
        },

        /**
         * @private @method _setupLocation
         * Tries to get the geolocation from browser and move the map to the location
         *
         *
         */
        _setupLocation: function () {
            var me = this,
                callback = function (lon, lat) {
                    // transform coordinates from browser projection to current
                    var lonlat = me.getMapModule().transformCoordinates(
                        new OpenLayers.LonLat(lon, lat),
                        'EPSG:4326'
                    );
                    me.getMapModule().centerMap(lonlat, 6);
                    me._locationIsSet = true;
                };
            /*
            var showError = function (error) {
                switch (error.code) {
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
            if (navigator.geolocation) {
                // if users just ignores/closes the browser dialog 
                // -> error handler won't be called in most browsers
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var lat = position.coords.latitude,
                            lon = position.coords.longitude;
                        callback(lon, lat);
                    },
                    function (errors) {
                        //ignored
                    },
                    {
                        // accept and hour long cached position
                        maximumAge: 3600000,
                        // timeout after 6 seconds
                        timeout: 6000
                    }
                );
            } else if (typeof window.geoip_latitude === 'function' &&
                typeof window.geoip_longitude === 'function') {
                // if available, use http://dev.maxmind.com/geoip/javascript
                var lat = geoip_latitude(),
                    lon = geoip_longitude();
                callback(lon, lat);
            }
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
