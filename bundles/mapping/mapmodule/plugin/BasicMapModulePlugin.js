import './AbstractMapModulePlugin';
// import { AbstractMapPlugin } from './AbstractMapPlugin';
/**
 * @class Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin',

    /**
     * @static @method create called automatically on construction
     */
    function (config) {
        this._config = config;
        this._element = null;
        this._enabled = true;
        this._visible = true;
        // plugin index, override this. Smaller number = first plugin, bigger number = latest
        this._index = 1000;
    }, {
        /**
         * @method _startPluginImpl
         * mapmodule.Plugin protocol method.
         * Sets sandbox and registers self to sandbox. Constructs the plugin UI
         * and displays it.
         *
         * @param {Oskari.Sandbox} sandbox
         *
         */
        _startPluginImpl: function (sandbox) {
            var me = this;
            me.setEnabled(me._enabled);
            return me.setVisible(me._visible);
        },
        /**
         * @public @method setVisible
         * Set the plugin UI's visibility
         *
         * @param {Boolean} visible
         * Whether the UI should be visible or hidden
         *
         */
        setVisible: function (visible) {
            var notReadyToRender = false;
            var wasVisible = this._visible;
            this._visible = visible;
            if (!this.getElement() && visible) {
                notReadyToRender = this.redrawUI(this.getMapModule().getMobileMode());
            }
            // toggle element - wasVisible might not be in sync with the UI if the elements are recreated - so always hide on setVisible(false)
            if (this.getElement() && (wasVisible !== visible || !visible)) {
                this.getElement().toggle(visible);
            }
            return notReadyToRender;
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function (mapInMobileMode, forced) {
            if (!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            if (this.getElement()) {
                // ui already in place, just call refresh to allow plugin to adjust if needed
                this.refresh();
                return;
            }
            const el = this._createControlElement();
            this.addToPluginContainer(el);
        },
        addToPluginContainer: function (element) {
            // var element = this.getElement();
            if (!element) {
                // no element to place, log a warning
                return;
            }
            this.setElement(element);
            element.attr('data-clazz', this.getClazz());
            try {
                this.getMapModule().setMapControlPlugin(
                    element,
                    this.getLocation(),
                    this.getIndex()
                );
            } catch (e) {
                this.getSandbox().printWarn('"' + this.getName() + '" ', e);
            }
        },
        removeFromPluginContainer: function (element, preserve) {
            if (!element) {
                // no element to remove, log a warning
                return;
            }
            var mapModule = this.getMapModule();
            mapModule.removeMapControlPlugin(
                element,
                !!preserve
            );
            if (!preserve) {
                this._element = null;
            }
        },

        teardownUI: function () {
            // remove old element
            this.removeFromPluginContainer(this.getElement());
        },

        /**
         * @method _stopPluginImpl
         * mapmodule.Plugin protocol method.
         * Unregisters self from sandbox and removes plugins UI from screen.
         *
         * @param {Oskari.Sandbox} sandbox
         *
         */
        _stopPluginImpl: function (sandbox) {
            this.removeFromPluginContainer(this.getElement());
        },

        /**
         * @public @method getClazz
         *
         *
         * @return {string} Plugin class
         */
        getClazz: function () {
            var clazz = this._clazz;
            // Throw a fit if clazz is not set, it'd probably break things.
            if (clazz === null || clazz === undefined || clazz.length < 1) {
                throw new Error('No clazz provided for ' + this.getName() + '!');
            }
            return clazz;
        },

        /**
         * @public @method getElement
         *
         * @return {jQuery}
         * Plugin jQuery element or null/undefined if no element has been set
         */
        getElement: function () {
            // element should be created in startPlugin and only destroyed in
            // stopPlugin. I.e. don't start & stop the plugin to refresh it.
            return this._element;
        },
        setElement: function (el) {
            this._element = el;
        },

        /**
         * @public @method getIndex
         * Returns the plugin's preferred position in the container
         *
         *
         * @return {Number} Plugin's preferred position in container
         */
        getIndex: function () {
            // i.e. position
            return this._index;
        },

        /**
         * @public @method getLocation
         * Gets the plugin's location from its config
         *
         *
         * @return {string}
         * Plugin's location
         */
        getLocation: function () {
            const location = this._config?.location?.classes || this._defaultLocation;
            return location || 'top right';
        },

        /**
         * @public @method setLocation
         * Set the plugin's location
         *
         * @param {string} location
         * Location
         *
         */
        setLocation: function (location) {
            const el = this.getElement();

            if (!this._config) {
                this._config = {};
            }
            if (!this._config.location) {
                this._config.location = {};
            }

            this._config.location.classes = location;
            this.addToPluginContainer(el);
        },

        /**
         * @public @method hasUI
         * This plugin has an UI so always returns true
         *
         *
         * @return {Boolean} true
         */
        hasUI: function () {
            return true;
        },

        /**
         * @method _createControlElement
         *
         *
         * @return {jQuery}
         * Plugin jQuery element
         */
        _createControlElement: function () {},

        /**
         * @public @method setEnabled
         * Enable/Disable plugin controls.
         *
         * @param {Boolean} enable
         * Whether the controls should be enabled or disabled.
         *
         */
        setEnabled: function (enabled) {
            this._enabled = enabled;
        },

        /**
         * @public @method isEnabled
         * Are the plugin's controls enabled
         *
         *
         * @return {Boolean}
         * True if plugin's tools are enabled
         */
        isEnabled: function () {
            return this._enabled;
        },

        /**
         * @public @method isVisible
         * Is the plugin's UI visible
         *
         *
         * @return {Boolean}
         * True if plugin is visible
         */
        isVisible: function () {
            return this._visible;
        },

        /** *****************************************
         * Deprecated functions for backwards compatibility.
         * Removed usage in Oskari 2.10.
         * These can be removed after/in Oskari ~2.12
         */
        getMobileDefs: function () {
            Oskari.log('BasicMapModulePlugin').deprecated('getMobileDefs');
            return {};
        },
        removeToolbarButtons: function () {
            Oskari.log('BasicMapModulePlugin').deprecated('removeToolbarButtons');
        },
        addToolbarButtons: function () {
            Oskari.log('BasicMapModulePlugin').deprecated('addToolbarButtons');
        }
    }, {
        /**
         * @static @property {String[]} protocol
         */
        protocol: [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ],
        extend: ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin']
    });
