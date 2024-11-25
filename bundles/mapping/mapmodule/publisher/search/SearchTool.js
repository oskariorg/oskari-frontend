import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';
class SearchTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 10;
        this.group = 'tools';
    }

    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
            title: Oskari.getMsg('MapModule', 'publisherTools.SearchPlugin.toolLabel'),
            config: this.state?.pluginConfig || {}
        };
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
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.SearchTool',
    SearchTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { SearchTool };
