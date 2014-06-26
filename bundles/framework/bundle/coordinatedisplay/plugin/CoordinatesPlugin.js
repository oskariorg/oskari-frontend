/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin
 * Provides a coordinate display for map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */

    function (config, locale) {
        this._locale = locale;
        this._element = null;
        this._clazz = 'Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin';
        this._defaultLocation = 'top right';
        this._index = 4;
        this._name = 'CoordinatesPlugin';
    }, {
        /**
         * @method _createControlElement
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createControlElement: function () {
            var me = this,
                sandbox = me._sandbox,
                crsText = me._locale.crs[me.getMapModule().getProjection()],
                el = jQuery('<div class="mapplugin coordinates">' +
                    ' <div class="cbSpansWrapper">' +
                    ' <div class="cbRow">' +
                    '  <div class="cbCrsLabel">' + crsText + '</div>' +
                    ' </div>' +
                    ' <div class="cbRow">' +
                    '  <div class="cbLabel cbLabelN" axis="lat">' + me._locale.compass.N + '</div>' +
                    '  <div class="cbValue" axis="lat"></div>' +
                    ' </div>' +
                    '  <br clear="both">' +
                    ' <div class="cbRow">' +
                    '  <div class="cbLabel cbLabelE" axis="lon">' + me._locale.compass.E + '</div>' +
                    '  <div class="cbValue" axis="lon"></div>' +
                    ' </div>' +
                    ' </div>' +
                    '</div>');

            el.mousedown(function (event) {
                event.stopPropagation();
            });
            // Store coordinate value elements so we can update them fast
            me._spanLat = el.find('.cbValue[axis="lat"]')[0];
            me._spanLon = el.find('.cbValue[axis="lon"]')[0];
            return el;
        },
        /**
         * @method _refresh
         * @param {Object} data contains lat/lon information to show on UI
         * Updates the given coordinates to the UI
         */
        refresh: function (data) {
            var me = this;
            if (!data || !data.latlon) {
                // update with map coordinates if coordinates not given
                var map = me._sandbox.getMap();
                data = {
                    'latlon': {
                        'lat': Math.floor(map.getY()),
                        'lon': Math.floor(map.getX())
                    }
                };
            }
            if (me._spanLat && me._spanLon) {
                me._spanLat.innerHTML = Math.floor(data.latlon.lat);
                me._spanLon.innerHTML = Math.floor(data.latlon.lon);
            }
        },

        _createEventHandlers: function () {
            return {
                /**
                 * @method MouseHoverEvent
                 * See PorttiMouse.notifyHover
                 */
                'MouseHoverEvent': function (event) {
                    this.refresh({
                        'latlon': {
                            'lat': Math.floor(event.getLat()),
                            'lon': Math.floor(event.getLon())
                        }
                    });
                },
                /**
                 * @method AfterMapMoveEvent
                 * Shows map center coordinates after map move
                 */
                'AfterMapMoveEvent': function (event) {
                    this.refresh();
                }
            };
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });
