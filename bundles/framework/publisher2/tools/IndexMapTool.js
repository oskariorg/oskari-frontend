import { AbstractPublisherTool } from './AbstractPublisherTool';

class IndexMapTool extends AbstractPublisherTool {
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
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
