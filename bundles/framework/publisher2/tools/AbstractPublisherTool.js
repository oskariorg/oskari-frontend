
export class AbstractPublisherTool {
    constructor (sandbox, mapmodule, localization = {}) {
        // override to change group (tool panel is created for each unique group)
        this.group = 'maptools';
        // index defines order in which the tools are listed on the group panel
        this.index = 0;
        // '*' means any, can be restricted to 'bottom left', 'bottom right' etc
        this.allowedLocations = ['*'];
        // List of plugin classes that can reside in same container like 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin'
        // '*' means no restrictions
        this.allowedSiblings = ['*'];
        // boilerplate
        this.__sandbox = sandbox;
        this.__mapmodule = mapmodule;
        this.__plugin = null;
        this.state = {
            // This variable is used to save tool state (is checked) and if it's true then we get tool json when saving published map.
            enabled: false,
            pluginConfig: null
        };
        this.__loc = localization[this.group];
    }

    init (data) {
        const plugin = this.findPluginFromInitData(data);
        if (plugin) {
            this.storePluginConf(plugin.config);
            this.setEnabled(true);
        }
    }
    
    // override per tool
    getTool () {
        return {
            id: 'N/A',
            title: 'N/A',
            config: this.state.pluginConfig || {}
        };
    }
    // deprecated - new (React based) tools should use getTool().title instead
    getTitle () {
        return this.__loc[this.getTool().title];
    }
    getGroup () {
        return this.group;
    }
    getIndex () {
        return this.index;
    }

    findPluginFromInitData (data) {
        const toolId = this.getTool().id;
        // assume it's in mapfull bundles plugins array as most of the default tools are stored there
        return data?.configuration?.mapfull?.conf?.plugins?.find(plugin => toolId === plugin.id);
    }
    storePluginConf (conf) {
        this.state.pluginConfig = conf || {};
    }
    setEnabled (enabled) {
        var tool = this.getTool();

        // state actually hasn't changed -> do nothing
        if (this.isEnabled() === enabled) {
            return false;
        }
        if (!enabled) {
            this.stop();
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
        // notify publisher tool layout panel in case tool placement dragging needs to be toggled
        var event = Oskari.eventBuilder('Publisher2.ToolEnabledChangedEvent')(this);
        this.getSandbox().notifyAll(event);
        return true;
    }

    isEnabled () {
        return !!this.state.enabled;
    }
    getValues () {
        // override
        return null;
    }
    stop () {
        if (!this.isEnabled()) {
            return;
        }
        var tool = this.getTool();
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
    isDisplayed () {
        return true;
    }
    /**
    * Is this tool available.
    * @method isDisabled
    * @public
    *
    * @returns {Boolean} is tool disabled
    */
    isDisabled (data) {
        return false;
    }
    validate () {
        // always valid by default
        // could return false if there's something wrong that should require stopping the user from saving
        return true;
    }

    getPlugin () {
        return this.__plugin;
    }
    getSandbox () {
        return this.__sandbox;
    }
    getMapmodule () {
        return this.__mapmodule;
    }
    getAllowedLocations () {
        return this.allowedLocations;
    }
    // old tools return jQuery object that renders the extra options for this tool
    getExtraOptions () {
        return null;
    }
};


/*
Make base class discoverable through Oskari.clazz.get('Oskari.publisher.AbstractPublisherTool')

Usage:

const AbstractPublisherTool = Oskari.clazz.get('Oskari.publisher.AbstractPublisherTool')
class MyTool extends AbstractPublisherTool {
    // TODO: impl specifics for tool
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.MyTool',
    MyTool,
    {
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
 */
Oskari.clazz.defineES('Oskari.publisher.AbstractPublisherTool', AbstractPublisherTool);
