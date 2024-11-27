import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';

class LogoTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'tools';
        this.config = null;
    }

    init (data) {
        const plugin = this.findPluginFromInitData(data);
        if (plugin) {
            this.storePluginConf(plugin.config);
            // when we enter publisher:
            // restore saved location for plugin that is not stopped nor started
            this.getPlugin().setLocation(plugin.config?.location?.classes);
        }
    }

    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
            title: 'LogoPlugin',
            config: this.state.pluginConfig || {}
        };
    }

    // not displayed on tool panels so user can't disable it
    isDisplayed () {
        return false;
    }

    getPlugin () {
        // always use the instance on map, not a new copy
        return this.getMapmodule().getPluginInstances('LogoPlugin');
    }

    // always enabled, use the instance that is on map
    isEnabled () {
        return true;
    }

    stop () {
        // when we exit publisher:
        // move plugin back to bottom left if it was dragged during publisher
        this.getPlugin()?.setLocation('bottom left');
    }

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues () {
        const plugin = this.getPlugin();
        if (!plugin) {
            return null;
        }
        return {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{
                            id: this.getTool().id,
                            config: {
                                location: plugin.getConfig()?.location
                            }
                        }]
                    }
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.LogoTool',
    LogoTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { LogoTool };
