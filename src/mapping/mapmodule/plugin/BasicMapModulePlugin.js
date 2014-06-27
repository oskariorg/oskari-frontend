/**
 * @class Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (config) {
        this._config = config;
        this._enabled = true;
        this._visible = true;
    }, {
        /**
         * @method _startPluginImpl
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox. Constructs the plugin UI and displays it.
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        _startPluginImpl: function (sandbox) {
            var me = this;
            me._element = me._createControlElement();
            me._ctl = me._createControlAdapter(me._element);
            if (me._ctl) {
                me.getMapModule().addMapControl(me._pluginName, me._ctl);
            }
            // Set initial UI values
            me.refresh();
            // There's a possibility these were set before the plugin was started.
            me.setEnabled(me._enabled);
            me.setVisible(me._visible);
            if (me._element) {
                me._element.attr("data-clazz", me.getClazz());
            }
            me.getMapModule().setMapControlPlugin(
                me._element,
                me.getLocation(),
                me.getIndex()
            );
        },

        /**
         * @method _stopPluginImpl
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         */
        _stopPluginImpl: function (sandbox) {
            var me = this,
                mapModule = me.getMapModule();
            // Destroy control adapter if it exists
            if (me._ctl) {
                mapModule.removeMapControl(me._pluginName, me._ctl);
                me._ctl = null;
            }

            me._destroyControlElement();

            if (me._element) {
                mapModule.removeMapControlPlugin(me._element, this.inLayerToolsEditMode());
                me._element = null;
            }
        },

        /**
         * @method getClazz
         * @return {String} Plugin class
         */
        getClazz: function () {
            var clazz = this._clazz;
            // Throw a fit if clazz is not set, it'd probably break things.
            if (clazz === null || clazz === undefined || clazz.length < 1) {
                throw "No clazz provided for " + this.getName() + "!";
            }
            return clazz;
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
         * @method getIndex Returns the plugin's preferred position in the container
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
            this.refresh();
        },

        /**
         * @method _refresh Called after a configuration change. Implement if needed.
         */
        refresh: function () {},

        /**
         * @method getLocation Gets the plugin's location from its config
         * @return {String}    Plugin's location
         */
        getLocation: function () {
            var ret = this._defaultLocation;
            if (this._config && this._config.location) {
                ret = this._config.location.classes;
            }
            return ret;
        },

        /**
         * @method setLocation      Set the plugin's location
         * @param {String} location Location
         */
        setLocation: function (location) {
            var me = this,
                el = me.getElement();
            if (!me._config) {
                me._config = {};
            }
            if (!me._config.location) {
                me._config.location = {};
            }
            me._config.location.classes = location;
            if (el) {
                me.getMapModule().setMapControlPlugin(el, location, me.getIndex());
            }
        },

        /**
         * @method setColorScheme      Set the plugin's color scheme. Implement if needed. This will be deprecated if/when we move this to a map-level property
         * @param {Object} colorScheme Magical object with some colors and classes and whatnot...
         */
        _setColorScheme: function (colorScheme) {},

        /**
         * @method setFont      Set the plugin's font. Implement if needed. This will be deprecated if/when we move this to a map-level property
         * @param {String} font Font ID
         */
        _setFont: function (font) {},

        /**
         * @method setStyle Set the plugin's style. Implement if needed. This will be deprecated if/when we move this to a map-level property
         * @param {Object} style Magical object with some widths and whatnot...
         */
        _setStyle: function (style) {},

        /**
         * @method hasUI
         * This plugin has an UI so always returns true
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },

        /**
         * @method _destroyControlElement
         * @return {jQuery} Plugin jQuery element
         */
        _createControlElement: function () {},
        /**
         * @method _destroyControlElement
         * Called before _element is destroyed. Implement if needed.
         */
        _destroyControlElement: function () {},

        /**
         * @method _createControlAdapter
         * @return {Object} Control adapter object or null if none
         */
        _createControlAdapter: function (el) {
            /* this._el.get()[0] */
        },
        /**
         * @method _toggleControls
         * Enable/disable plugin controls. Used in map layout edit mode.
         * @param {Boolean} enable Should the controls be enabled or disabled.
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
         * @method setVisible
         * Set the plugin UI's visibility
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
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
        "extend": ["Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin"]
    });
