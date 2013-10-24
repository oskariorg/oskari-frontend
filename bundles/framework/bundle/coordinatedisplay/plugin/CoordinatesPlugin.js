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
        this._conf = config;
        this._locale = locale;
        this.mapModule = null;
        this.pluginName = null;
        this._sandbox = null;
        this._map = null;
        this._elements = {};
        this.__templates = {};

    }, {
        /** @static @property __name plugin name */
        __name: 'CoordinatesPlugin',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            if (mapModule) {
                this.pluginName = mapModule.getName() + this.__name;
            }
        },
        /**
         * @method hasUI
         * @return {Boolean} true
         * This plugin has an UI so always returns true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         *
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {

            this.__templates.latlondiv =
                jQuery('<div class="mapplugin cbDiv">' +
                    ' <div class="cbSpansWrapper">' +
                    ' <div class="cbRow">' +
                    '  <div class="cbCrsLabel"></div>' +
                    ' </div>' +
                    ' <div class="cbRow">' +
                    '  <div class="cbLabel cbLabelN" axis="lat"></div>' +
                    '  <div class="cbValue" axis="lat"></div>' +
                    ' </div>' +
                    '  <br clear="both">' +
                    ' <div class="cbRow">' +
                    '  <div class="cbLabel cbLabelE" axis="lon"></div>' +
                    '  <div class="cbValue" axis="lon"></div>' +
                    ' </div>' +
                    ' </div>' +
                    '</div>');
        },
        /**
         * @method register
         * Interface method for the plugin protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         */
        unregister: function () {

        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var p;
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();

            sandbox.register(this);
            this._createUI();
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
        },
        /**
         * @method stopPlugin
         *
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            if (this._elements.display) {
                this._elements.display.remove();
                delete this._elements.display;
            }

            sandbox.unregister(this);
            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @method _createUI
         * @private
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         */
        _createUI: function () {
            var me = this,
                sandbox = me._sandbox,
                parentContainer = jQuery(me._map.div), // get div where the map is rendered from openlayers
                el = me._elements.display;
            if (!me._elements.display) {
                el = me._elements.display = me.__templates.latlondiv.clone();
            }

            var crs = me._map.getProjection(),
                crsText = me._locale.crs[crs];

            el.find('.cbCrsLabel').html(crsText);
            el.find('.cbLabelN').html(me._locale.compass.N);
            el.find('.cbLabelE').html(me._locale.compass.E);
            el.mousedown(function (event) {
                event.stopPropagation();
            });
            parentContainer.append(el);
            this.update();
            el.show();
        },
        /**
         * @method update
         * @param {Object} data contains lat/lon information to show on UI
         * Updates the given coordinates to the UI
         */
        update: function (data) {
            if (!data || !data.latlon) {
                // update with map coordinates if coordinates not given
                var map = this._sandbox.getMap();
                data = {
                    'latlon': {
                        'lat': map.getY(),
                        'lon': map.getX()
                    }
                };
            }
            var me = this,
                latlon = data.latlon,
                el = me._elements.display,
                spanLat = el.find('.cbValue[axis="lat"]'),
                spanLon = el.find('.cbValue[axis="lon"]');
            if (spanLat && spanLon) {
                spanLat.text(latlon.lat);
                spanLon.text(latlon.lon);
            }
        },

        /**
         * @property {Object} eventHandlers
         * @static
         */

        eventHandlers: {
            /**
             * @method MouseHoverEvent
             * See PorttiMouse.notifyHover
             */
            'MouseHoverEvent': function (event) {
                this.update({
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
                this.update();
            }

        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });