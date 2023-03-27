/**
 * Base-class for plugin based map tools for publisher bundle
 * @param  {Oskari.Sandbox} sandbox
 * @param  {Oskari.mapframework.ui.module.common.MapModule} mapmodule
 * @param  {Object} localization Localization under publisher.BasicView
 */
Oskari.clazz.define('Oskari.mapframework.publisher.tool.AbstractPluginTool', function (sandbox, mapmodule, localization = {}) {
    this.__index = 0;
    this.__sandbox = sandbox;
    this.__mapmodule = mapmodule;
    this.__loc = localization[this.group];
    this.__plugin = null;
    this.__tool = null;
    this.state = {
        // This variable is used to save tool state (is checked) and if it's true then we get tool json when saving published map.
        enabled: false,
        pluginConfig: null
    };
}, {
    // override to change group
    group: 'maptools',
    // 'bottom left', 'bottom right' etc
    allowedLocations: ['*'],
    // default location in lefthanded / righthanded layouts. Override.
    lefthanded: '',
    righthanded: '',
    // List of plugin classes that can reside in same container(?) like 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin'
    allowedSiblings: ['*'],

    /**
    * Initialize tool
    * Override if tool is not mapfull plugin
    * @method init
    * @public
    */
    init: function (data) {
        const plugin = this.findPluginFromInitData(data);
        if (plugin) {
            this.storePluginConf(plugin.config);
            this.setEnabled(true);
        }
    },
    findPluginFromInitData: function (data) {
        const toolId = this.getTool().id;
        return data?.configuration?.mapfull?.conf?.plugins?.find(plugin => toolId === plugin.id);
    },
    storePluginConf: function (conf) {
        this.state.pluginConfig = conf || {};
    },
    getSandbox: function () {
        return this.__sandbox;
    },
    getMapmodule: function () {
        return this.__mapmodule;
    },
    /**
     * If the tool requires space for the UI next to the map return the required height/width
     * @return {Object} object with keys height and width used for map size calculation
     */
    getAdditionalSize: function () {
        return {
            height: 0,
            width: 0
        };
    },
    /**
    * Get tool object.
    * @method getTool
    * @rivate
    *
    * @returns {Object} tool
    */
    getTool: function () {
        // override
    },
    /**
    * Set enabled.
    * @method setEnabled
    * @public
    *
    * @param {Boolean} enabled is tool enabled or not
    */
    setEnabled: function (enabled) {
        var tool = this.getTool();

        // state actually hasn't changed -> do nothing
        if (this.isEnabled() === enabled) {
            return;
        }
        if (!enabled) {
            this.stop()
        } else if (tool.hasNoPlugin !== true) {
            let plugin = this.getPlugin();
            if (!plugin) {
                plugin = Oskari.clazz.create(tool.id, tool.config);
                this.__plugin = plugin;
            }
            this.getMapmodule().registerPlugin(plugin);
            plugin.startPlugin(this.getSandbox());
        }
        // Stop checks if we are already disabled so toggle the value after
        this.state.enabled = enabled;
        this._setEnabledImpl(enabled);
        // notify publisher tool layout panel in case tool placement dragging needs to be toggled
        var event = Oskari.eventBuilder('Publisher2.ToolEnabledChangedEvent')(this);
        this.getSandbox().notifyAll(event);
    },
    /**
     * @method _setEnabledImpl
     * override if needed.
     */
    _setEnabledImpl: function () {},

    isEnabled: function () {
        return !!this.state.enabled;
    },

    /**
    * Get extra options.
    * @method getExtraOptions
    * @public
    *
    * @returns {Object} jQuery element
    */
    getExtraOptions: function () {
        return null;
    },
    /**
    * Get title.
    * @method getTitle
    * @public
    *
    * @returns {String} tool title
    */
    getTitle: function () {
        return this.__loc[this.getTool().title];
    },
    /**
    * Is displayed. We can use this to tell when tool is displayed.
    * For example if stats layers are added to map when opening publisher we can tell at then this tool need to be shown (ShowStatsTableTool).
    * Is there is no stats layer then not show the tool.
    *
    * @method isDisplayed
    * @public
    *
    * @returns {Boolean} is tool displayed
    */
    isDisplayed: function () {
        return true;
    },
    /**
    * Is this tool available.
    * @method isDisabled
    * @public
    *
    * @returns {Boolean} is tool disabled
    */
    isDisabled: function (data) {
        return false;
    },

    /**
    * Get group
    * @method getGroup
    * @public
    *
    * @returns {String} group id
    */
    getGroup: function () {
        return this.group;
    },
    /**
    * Get index
    * @method getIndex
    * @public
    *
    * @returns {Integer} index
    */
    getIndex: function () {
        return this.index;
    },
    /**
    * Get allowed locations
    * @method getAllowedLocations
    * @public
    *
    * @returns {Object} allowed locations array
    */
    getAllowedLocations: function () {
        return this.allowedLocations;
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        // override
    },
    /**
    * Get plugin.
    * @method getPlugin
    * @public
    *
    * @returns {Object} the tool's plugin
    */
    getPlugin: function () {
        return this.__plugin;
    },
    /**
    * Validate tool.
    *
    * @returns {Object} errors object
    */
    validate: function () {
        // always valid
        return true;
    },
    /**
     * @method _stopImpl
     * override if needed.
     */
    _stopImpl: function () {},
    /**
    * Stop tool.
    * @method stop
    * @public
    */
    stop: function () {
        if (!this.isEnabled()) {
            return;
        }
        var tool = this.getTool();
        this._stopImpl();
        if (tool.hasNoPlugin !== true) {
            const plugin = this.getPlugin();
            if (!plugin) {
                return;
            }
            if (this.getSandbox()) {
                plugin.stopPlugin(this.getSandbox());
            }
            this.getMapmodule().unregisterPlugin(plugin);
            this.__plugin = null;
        }
    }
});
