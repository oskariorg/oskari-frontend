/**
 * @class Oskari.mapframework.bundle.mappublished.MyLocationPlugin
 *
 * Tries to locate the user by using HTML5 GeoLocation services or tries a
 * fallback to http://dev.maxmind.com/geoip/javascript GeoIP if GeoLocation is
 * not available.
 * Centers the map on the users location if location is determined successfully.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin';
        me._defaultLocation = 'top right';
        me._index = 6;
        me._name = 'MyLocationPlugin';
    }, {
        /**
         * @private @method _createControlElement
         * Creates the DOM element that will be placed on the map
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {
            var el = jQuery(
                    '<div class="mapplugin mylocationplugin icon mylocation-rounded-dark"></div>'
                ),
                me = this;

            el.click(function () {
                me._setupLocation();
            });

            el.attr('title', me._loc.tooltip);

            return el;
        },

        /**
         * @private @method _setLayerToolsEditModeImpl
         *
         *
         */ 
        _setLayerToolsEditModeImpl: function () {
            var me = this;
            if (me.inLayerToolsEditMode()) {
                // disable icon
                me.getElement().unbind('click');
            } else {
                // enable icon
                me.getElement().click(function () {
                    me._setupLocation();
                });
            }
        },

        /**
         * @public @method refresh
         *
         *
         */
        refresh: function () {
            var me = this,
                conf = me.getConfig();

            // Change the style if in the conf
            if (conf && conf.toolStyle) {
                me.changeToolStyle(conf.toolStyle, me.getElement());
            }
        }, 

        /**
         * @public @method changeToolStyle
         * Changes the tool style of the plugin
         *
         * @param {Object} style
         * @param {jQuery} div
         *
         */
        changeToolStyle: function (style, div) {
            var me = this,
                el = div || me.getElement();

            if (!el) {
                return;
            }

            var styleClass = 'mylocation-' + (style ? style : 'rounded-dark');

            me.getMapModule().changeCssClasses(styleClass, /^mylocation-/, [el]);
        },

        /**
         * @private @method _setupLocation
         * Tries to get the geolocation from browser and move the map to the
         * location
         *
         *
         */
        _setupLocation: function () {
            var me = this,
                callback = function (lon, lat) {
                    // transform coordinates from browser projection to current
                    var mapModule = me.getMapModule(),
                        lonlat = mapModule._transformCoordinates(
                            new OpenLayers.LonLat(lon, lat),
                            'EPSG:4326'
                        ),
                        zoom = mapModule.getMap().getNumZoomLevels() - 1;

                    mapModule.centerMap(lonlat, zoom);
                };

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
                var lat = window.geoip_latitude(),
                    lon = window.geoip_longitude();

                callback(lon, lat);
            }
        }
    }, {
        extend: ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
