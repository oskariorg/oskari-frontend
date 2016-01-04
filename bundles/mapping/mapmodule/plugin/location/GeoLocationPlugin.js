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
            var me = this;
            var mapmodule = this.getMapModule();
            mapmodule.getUserLocation(function(lon, lat) {
                if(!lon || !lat) {
                    // error getting location
                    return;
                }
                mapmodule.centerMap({ lon: lon, lat : lat }, 6);
                me._locationIsSet = true;
            });
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
