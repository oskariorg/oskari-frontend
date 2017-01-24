/**
 * @class Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin
 */
Oskari.clazz.define('Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin',

    /**
     * @static @method create called automatically on construction
     */
    function (config) {
        this._config = config;
        this._ctl = null;
        this._element = null;
        this._enabled = true;
        this._visible = true;
        // plugin index, override this. Smaller number = first plugin, bigger number = latest
        this._index = 1000;

        this._mobileDefs = null;
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
            var toolbarNotReady = false;
            var wasVisible = this._visible;
            this._visible = visible;
            if(!this.getElement() && visible) {
                toolbarNotReady = this.redrawUI(this.getMapModule().getMobileMode());
            }
            // toggle element
            if (this.getElement() && wasVisible !== visible) {
                this.getElement().toggle(visible);
            }
            return toolbarNotReady;
        },
        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public createPluginUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            if(!this.isVisible()) {
                // no point in drawing the ui if we are not visible
                return;
            }
            var me = this;
            var sandbox = me.getSandbox();
            if(this.getElement()) {
                // ui already in place no need to do anything, override in plugins to do responsive
                return;
            }
            me._element = me._createControlElement();
            this.addToPluginContainer(me._element);
        },
        addToPluginContainer : function(element) {
            //var element = this.getElement();
            if(!element) {
                // no element to place, log a warning
                return;
            }
            this._element = element;
            element.attr('data-clazz', this.getClazz());
            try{
                this.getMapModule().setMapControlPlugin(
                    element,
                    this.getLocation(),
                    this.getIndex()
                );
            } catch(e){
                this.getSandbox().printWarn('"' + this.getName() + '" ', e);
            }
        },
        removeFromPluginContainer : function(element, preserve) {
            if(!element) {
                // no element to remove, log a warning
                return;
            }
            var mapModule = this.getMapModule();
            mapModule.removeMapControlPlugin(
                element,
                this.inLayerToolsEditMode(),
                !!preserve
            );
            if(!preserve) {
                this._element = null;
            }
        },

        teardownUI : function() {
            //remove old element
            this.removeFromPluginContainer(this.getElement());
        },
        getMobileDefs : function() {
            return this._mobileDefs || {};
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
                throw 'No clazz provided for ' + this.getName() + '!';
            }
            return clazz;
        },

        /**
         * @public @method getElement
         *
         *
         * @return {jQuery}
         * Plugin jQuery element or null/undefined if no element has been set
         */
        getElement: function () {
            // element should be created in startPlugin and only destroyed in
            // stopPlugin. I.e. don't start & stop the plugin to refresh it.
            return this._element;
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
            var ret = this._defaultLocation;
            if (this._config && this._config.location && this._config.location.classes) {
                ret = this._config.location.classes;
            }
            return ret;
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
            var me = this,
                el = me.getElement();

            if (!me._config) {
                me._config = {};
            }
            if (!me._config.location) {
                me._config.location = {};
            }

            me._config.location.classes = location;
            this.addToPluginContainer(el);
        },

        /**
         * @method setColorScheme
         * Set the plugin's color scheme. Implement if needed.
         * This will be deprecated if/when we move this to a map-level property.
         *
         * @param {Object} colorScheme
         * Magical object with some colors and classes and whatnot...
         *
         */
        _setColorScheme: function (colorScheme) {},

        /**
         * @method setFont
         * Set the plugin's font. Implement if needed.
         * This will be deprecated if/when we move this to a map-level property.
         *
         * @param {string} font Font ID
         *
         */
        _setFont: function (font) {},

        /**
         * @method setStyle Set the plugin's style. Implement if needed.
         * This will be deprecated if/when we move this to a map-level property.
         *
         * @param {Object} style Magical object with some widths and whatnot...
         *
         */
        _setStyle: function (style) {},

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
         * @method _destroyControlElement
         * Called before _element is destroyed. Implement if needed.
         *
         *
         */
        _destroyControlElement: function () {},

        /**
         * @method _toggleControls
         * Enable/disable plugin controls. Used in map layout edit mode.
         *
         * @param {Boolean} enable Should the controls be enabled or disabled.
         *
         */
        _toggleUIControls: function (enable) {
            // implement if needed... don't trust this._enabled, set the state
            // even if enable === this._enabled
        },

        /**
         * @public @method setEnabled
         * Enable/Disable plugin controls.
         *
         * @param {Boolean} enable
         * Whether the controls should be enabled or disabled.
         *
         */
        setEnabled: function (enabled) {
            // toggle controls
            this._toggleUIControls(enabled);
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
        /**
         * @public @method getToolStyleFromMapModule
         *
         * @return {Object} style object used by mapmodule or null if not available.
         */
        getToolStyleFromMapModule: function() {
            var value = this.getMapModule().getToolStyle();
            return value ? value : null;
        },
        /**
         * @public @method getToolStyleFromMapModule
         *
         * @return {String} the font used by mapmodule or null if not available.
         */
        getToolFontFromMapModule: function() {
            return this.getMapModule().getToolFont();
        },

        /**
         * Removes all the css classes which respond to given regex from all elements
         * and adds the given class to them.
         *
         * @method changeCssClasses
         * @param {String} classToAdd the css class to add to all elements.
         * @param {RegExp} removeClassRegex the regex to test against to determine which classes should be removec
         * @param {Array[jQuery]} elements The elements where the classes should be changed.
         */
        changeCssClasses: function (classToAdd, removeClassRegex, elements) {
            var i,
                j,
                el;

            for (i = 0; i < elements.length; i += 1) {
                el = elements[i];
                // FIXME build the function outside the loop
                el.removeClass(function (index, classes) {
                    var removeThese = '',
                        classNames = classes.split(' ');

                    // Check if there are any old font classes.
                    for (j = 0; j < classNames.length; j += 1) {
                        if (removeClassRegex.test(classNames[j])) {
                            removeThese += classNames[j] + ' ';
                        }
                    }

                    // Return the class names to be removed.
                    return removeThese;
                });

                // Add the new font as a CSS class.
                el.addClass(classToAdd);
            }
        },
        addToolbarButtons : function(buttons, group) {
            var me  =this;
            var sandbox = this.getSandbox();
            var toolbar = this.getMapModule().getMobileToolbar();
            var themeColors = this.getMapModule().getThemeColours();
            if(buttons && !sandbox.hasHandler('Toolbar.AddToolButtonRequest')) {
                return true;
            }
            var addToolButtonBuilder = Oskari.requestBuilder('Toolbar.AddToolButtonRequest');

            if (sandbox.hasHandler('Toolbar.AddToolButtonRequest') && addToolButtonBuilder) {
                for (var tool in buttons) {
                    var buttonConf = buttons[tool];
                    buttonConf.toolbarid = toolbar;
                    // add active color if sticky and toggleChangeIcon
                    if(buttonConf.sticky === true && buttonConf.toggleChangeIcon === true && !buttonConf.activeColor) {
                        buttonConf.activeColour =  themeColors.activeColour;
                    }
                    sandbox.request(this, addToolButtonBuilder(tool, group, buttonConf));
                }
            }
        },
        removeToolbarButtons : function(buttons, group) {
            var sandbox = this.getSandbox();
            if(!sandbox) {
                return true;
            }

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            if(buttons && !sandbox.hasHandler('Toolbar.RemoveToolButtonRequest')) {
                return true;
            }
            var removeToolButtonBuilder = Oskari.requestBuilder('Toolbar.RemoveToolButtonRequest');
            var toolbar = this.getMapModule().getMobileToolbar();
            for (var tool in buttons) {
                var buttonConf = buttons[tool];
                buttonConf.toolbarid = toolbar;
                sandbox.request(this, removeToolButtonBuilder(tool, group, toolbar));
            }
        },

        /**
         * Set a tool's mobile icon back to it's initial state after popup closing.
         */
        _resetMobileIcon: function(el, iconCls) {
            var me = this,
                restoreCls;

            el.css('background-color', '');
            el.removeClass('selected');
            el.removeClass(iconCls + '-light');
            el.removeClass(iconCls + '-dark');

            restoreCls = (Oskari.util.isDarkColor(me.getMapModule().getThemeColours().activeColour)) ? iconCls+'-light' : iconCls+'-dark';
            el.addClass(restoreCls);
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
