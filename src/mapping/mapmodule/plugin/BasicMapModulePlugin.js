/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.BaseUserInterfacePlugin
 *
 * Interface definition for map plugins that have a UI.
 * TODO:
 *     - split into base and ui versions, ui version extending the base version
 *     - add hide when in mode (boolean that's checked in an eventhandler, we'll have to add some sort of a merge for the handlers...)
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.BaseUserInterfacePlugin',
    /**
     * @method create called automatically on construction
     * @static
     *
     * Always extend this class, never use as is.
     */

    function () {
        throw "Oskari.mapframework.ui.module.common.mapmodule.UserInterfacePlugin should not be instantiated";
    }, {
        _clazz: null,
        _config: null,
        _element: null,
        _enabled: true,
        _eventHandlers: [],
        _index: null,
        _map: null,
        _mapModule: null,
        _pluginName: null,
        _sandbox: null,
        _visible: true,

        /**
         * @method getName
         * @return {String} module name
         */
        getName: function () {
            // Throw a fit if name is not set, it'd probably break things.
            if (this._pluginName === null || this._pluginName === undefined) {
                throw "No name provided!";
            }
            return this._pluginName;
        },
        /**
         * @method getMapModule
         * Returns reference to map module this plugin is registered to
         * @return {Oskari.mapframework.ui.module.common.MapModule}
         */
        getMapModule: function () {
            // Throw a fit if mapmodule is not set, it'd probably break things.
            if (this._mapModule === null || this._mapModule === undefined) {
                throw "No mapmodule provided!";
            }
            return this._mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this._mapModule = mapModule;
            if (mapModule) {
                this._map = mapModule.getMap();
                this._pluginName = mapModule.getName() + this.__name;
            }
        },

        /**
         * @method getMap
         * @return {OpenLayers.Map} reference to map implementation
         */
        getMap: function () {
            return this._map;
        },

        /**
         * @method register
         * Interface method for the module protocol
         */
        register: function () {},

        /**
         * @method unregister
         * Interface method for the module protocol
         */
        unregister: function () {},

        /**
         * @method getClazz
         * @return {String} Plugin class
         */
        getClazz: function () {
            // Throw a fit if clazz is not set, it'd probably break things.
            if (this._clazz === null || this._clazz === undefined) {
                throw "No clazz provided for " + this.getName() + "!";
            }
            return this._clazz;
        },

        /**
         * @method getElement
         * @return {jQuery} Plugin jQuery element or null/undefined if no element has been set
         */
        getElement: function () {
            // element should be created in startPlugin and only destroyed in stopPlugin
            // i.e. don't start & stop the plugin to refresh it.
            return this._element;
        },

        /**
         * @method getIndex Returs the plugin's preferred position in the container
         * @return {Number} Plugin's preferred position in container
         */
        getIndex: function () {
            // i.e. position
            return this._index;
        },

        /**
         * @method getConfig Gets the plugin's config
         * @return {Object}  Plugin's configuration (a clone, use setConfig if you want to change the plugin's config)
         */
        getConfig: function () {
            // use this when saving published map so we won't have to keep a separate copy in the publisher
            var ret = {};
            if (this._config) {
                // return a clone so people won't muck about with the config...
                return jQuery.extend(true, ret, this._config);
            }
            return ret;
        },

        /**
         * @method setConfig       Sets the plugin's config
         * @param  {Object} config Config
         */
        setConfig: function (config) {
            this._config = config;
            // take new conf to use
            this._refresh();
        },

        /**
         * @method _refresh Called after a configuration change. Implement if needed.
         */
        _refresh: function () {},

        /**
         * @method getLocation Gets the plugin's location from its config
         * @return {String}    Plugin's location
         */
        getLocation: function () {
            var ret = null;
            if (this._config.location) {
                ret = this._config.location.classes;
            }
            return ret;
        },

        /**
         * @method setLocation      Set the plugin's location
         * @param {String} location Location
         */
        setLocation: function (location) {
            var me = this;
            if (!me._config) {
                me._config = {};
            }
            if (!me._config.location) {
                me._config.location = {};
            }
            me._config.location.classes = location;
            if (me.getElement()) {
                me.getMapModule().setMapControlPlugin(me.getElement(), location, me.getIndex());
            }
        },

        /**
         * @method setColorScheme      Set the plugin's color scheme. Implement if needed. This will be deprecated if/when we move this to a map-level property
         * @param {Object} colorScheme Magical object with some colors and classes and whatnot...
         */
        setColorScheme: function (colorScheme) {},

        /**
         * @method setFont      Set the plugin's font. Implement if needed. This will be deprecated if/when we move this to a map-level property
         * @param {String} font Font ID
         */
        setFont: function (font) {},

        /**
         * @method setStyle Set the plugin's style. Implement if needed. This will be deprecated if/when we move this to a map-level property
         * @param {Object} style Magical object with some widths and whatnot...
         */
        setStyle: function (style) {},

        startPlugin: function (sandbox) {
            // start plugin: create UI etc, register listeners etc.
            var me = this,
                eventHandler,
                element;

            me._sandbox = sandbox || me.getMapModule().getSandbox();
            me._sandbox.register(me);
            for (eventHandler in me._eventHandlers) {
                if (me._eventHandlers.hasOwnProperty(eventHandler)) {
                    me._sandbox.registerForEventByName(me, eventHandler);
                }
            }
            me._create();
            // There's a possibility these were set before the plugin was started.
            me.setEnabled(me._enabled);
            me.setVisible(me._visible);
            element = me.getElement();
            if (element) {
                element.attr("data-clazz", me.getClazz());
            }
        },

        stopPlugin: function () {
            // stop plugin: destroy UI, unregister listeners etc.
            var me = this,
                eventHandler;

            for (eventHandler in me._eventHandlers) {
                if (me._eventHandlers.hasOwnProperty(eventHandler)) {
                    me._sandbox.unregisterFromEventByName(me, eventHandler);
                }
            }
            me._sandbox.unregister(me);
            me._map = null;
            me._sandbox = null;
            me._destroy();
            if (me._element) {
                me._element.remove();
                me._element = null;
            }
        },
        /**
         * @method _create Called at the end of startPlugin, you can use this to create your UI etc. Note that startPlugin adds data-clazz to the DOM element if available.
         */
        _create: function () {
            // implement if needed
            // create UI, add listeners etc.
        },

        /**
         * @method _destroy Called at the end of stopPlugin, you can use this to destroy your UI etc. Note that stopPlugin takes care of destroying the DOM element.
         */
        _destroy: function () {
            // implement if needed
            // remove listeners etc, element is removed in stopPlugin after this
        },

        init: function () {
            // done once on instantiation?, parse templates and such?
        },

        start: function () {},

        stop: function () {},

        hasUI: function () {
            // TODO all of these have an UI, split this into a UI-less superclass if need be.
            return true;
        },

        /**
         * @method _toggleControls Enable/disable plugin controls. Used in map layout edit mode.
         * @param {Boolean} enable Whether the controls should be enabled or disabled.
         */
        _toggleUIControls: function (enable) {
            // implement if needed... don't trust this._enabled, set the state even if enable === this._enabled
        },

        /**
         * @method setEnabled      Enable/Disable plugin controls.
         * @param {Boolean} enable Whether the controls should be enabled or disabled.
         */
        setEnabled: function (enabled) {
            // toggle controls
            this._toggleUIControls(enabled);
            this._enabled = enabled;
        },

        /**
         * @method getEnabled Are the plugin's controls enabled
         * @return {Boolean}  True if plugin's tools are enabled
         */
        getEnabled: function () {
            return this._enabled;
        },

        /**
         * @method setVisible       Set the plugin UI's visibility
         * @param {Boolean} visible Whether the UI should be visible or hidden
         */
        setVisible: function (visible) {
            // toggle element
            if (this._element) {
                this._element.toggle(visible);
            }
            this._visible = visible;
        },

        /**
         * @method getVisible Is the plugin's UI visible
         * @return {Boolean}  True if plugin is visible
         */
        getVisible: function () {
            return this._visible;
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event an Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var handler = this._eventHandlers[event.getName()];
            if (handler) {
                return handler.apply(this, [event]);
            }
        }
    });
