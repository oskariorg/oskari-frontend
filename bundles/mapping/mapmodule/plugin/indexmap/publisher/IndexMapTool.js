import { AbstractPublisherTool } from '../../../../../framework/publisher2/tools/AbstractPublisherTool';

class IndexMapTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'additional';
        this.config = null;
    }

    init (data) {
        const plugin = this.findPluginFromInitData(data);
        if (plugin) {
            // restore saved location for plugin that is not stopped nor started
            this.getPlugin().setLocation(plugin.config?.location?.classes);
        };
    }

    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
            title: 'IndexMapPlugin',
            config: this.state.pluginConfig || {}
        };
    }

    isDisplayed () {
        // not shown on 3d maps
        return !Oskari.getSandbox().getMap().getSupports3D();
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        return {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                    }
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.IndexMapTool',
    IndexMapTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { IndexMapTool };
