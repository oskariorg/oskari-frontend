import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';

const SCALEBAR_TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin';
class ScaleBarTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'additional';
    }

    getTool () {
        return {
            id: SCALEBAR_TOOL_ID,
            title: Oskari.getMsg('MapModule', 'publisherTools.ScaleBarPlugin'),
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
Oskari.clazz.defineES('Oskari.publisher.ScalebarTool',
    ScaleBarTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { ScaleBarTool };
