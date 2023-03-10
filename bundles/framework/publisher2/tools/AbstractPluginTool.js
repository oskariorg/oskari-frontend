/**
 * Base-class for plugin based map tools for publisher bundle
 * @param  {Oskari.Sandbox} sandbox
 * @param  {Oskari.mapframework.ui.module.common.MapModule} mapmodule
 * @param  {Object} localization Localization under publisher.BasicView
 */
Oskari.clazz.define('Oskari.mapframework.publisher.tool.AbstractPluginTool', function (sandbox, mapmodule, localization) {
    this.__index = 0;
    this.__sandbox = sandbox;
    this.__mapmodule = mapmodule;
    this.__loc = localization[this.group];
    this.__plugin = null;
    this.__tool = null;
    // This is used to watch tool plugin start/stop changes. If plugin is started then change this value to true, if stopped then change to false.
    // If tool plugin is started then we can call stop plugin if unchecking this tools (otherwise we get error when sopping plugin).
    this.__started = false;
    this.state = {
        // This variable is used to save tool state (is checked) and if it's true then we get tool json when saving published map.
        enabled: false,
        mode: null
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
    // ??
    groupedSiblings: false,

    /**
    * Initialize tool
    * Override if tool is not mapfull plugin
    * @method init
    * @public
    */
    init: function (pdata) {
        var me = this;
        var data = pdata;

        if (Oskari.util.keyExists(data, 'configuration.mapfull.conf.plugins')) {
            data.configuration.mapfull.conf.plugins.forEach(function (plugin) {
                if (me.getTool().id === plugin.id) {
                    me.setEnabled(true);
                }
            });
        }
    },
    getSandbox: function () {
        return this.__sandbox;
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
        this.state.enabled = enabled;
        if (!this.__plugin && enabled) {
            this.__plugin = Oskari.clazz.create(tool.id, tool.config);
            this.__mapmodule.registerPlugin(this.__plugin);
        }

        if (enabled) {
            this.__plugin.startPlugin(this.__sandbox);
            this.__started = true;
        } else {
            this.stop();
        }
        this._setEnabledImpl(enabled);
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
    * Is started.
    * @method isStarted
    * @public
    *
    * @returns {Boolean} is the tool started.
    */
    isStarted: function () {
        return this.__started;
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
    * Stop tool.
    * @method stop
    * @public
    */
    stop: function () {
        // TODO: do we really need started as an additional flag?
        if (!this.__started) {
            return;
        }
        this.__started = false;
        const plugin = this.getPlugin();
        if (!plugin) {
            return;
        }
        if (this.getSandbox()) {
            plugin.stopPlugin(this.getSandbox());
        }
        this.__mapmodule.unregisterPlugin(plugin);
        this.__plugin = null;
    }
});
