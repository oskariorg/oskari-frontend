/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin
 * Provides scalebar functionality for map
 * See http://www.oskari.org/trac/wiki/DocumentationBundleMapModulePluginScaleBar
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function (conf) {
        var me = this;
        me.conf = conf;
        me.mapModule = null;
        me.pluginName = null;
        me._sandbox = null;
        me._map = null;
        me._scalebar = null;
    }, {
        /** @static @property __name plugin name */
        __name: 'ScaleBarPlugin',

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
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },
        /**
         * @method init
         * Interface method for the module protocol.
         * Initializes the OpenLayers.Control.ScaleLine
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {
            this._scalebar = new OpenLayers.Control.ScaleLine();
        },
        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {

        },
        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {

        },

        setScaleBarLocation: function (location, scaleBarContainer) {
            // override default location if configured
            if (location) {
                if (location.top) {
                    scaleBarContainer.css('bottom', 'auto');
                    scaleBarContainer.css('top', location.top);
                }
                if (location.left) {
                    scaleBarContainer.css('right', 'auto');
                    scaleBarContainer.css('left', location.left);
                }
                if (location.right) {
                    scaleBarContainer.css('left', 'auto');
                    scaleBarContainer.css('right', location.right);
                }
                if (location.bottom) {
                    scaleBarContainer.css('top', 'auto');
                    scaleBarContainer.css('bottom', location.bottom);
                }
                if (location.classes) {
                    scaleBarContainer.removeClass('top left bottom right center').addClass(location.classes);
                }
            }
        },

        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         * Adds the scalebar to the map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            var me = this,
                p;
            me._sandbox = sandbox;
            me._map = me.getMapModule().getMap();

            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            me.getMapModule().addMapControl('scaleBar', me._scalebar);

            if (me.conf && me.conf.location) {
                console.log(me._scalebar);
                // FIXME: it's a tad ugly to fetch the div from scalebar's innards... alas, OL doesn't allow us to add classes trough its API
                me.setScaleBarLocation(me.conf.location, jQuery(me._scalebar.div));
            }
        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol.
         * Removes the scalebar from map controls.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var me = this,
                p;
            me.getMapModule().removeMapControl('scaleBar');

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }

            sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
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
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            'AfterMapMoveEvent': function (event) {
                if (this._scalebar) {
                    this._scalebar.update();
                }
            }
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
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