import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';

class ZoombarTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 50;
        this.group = 'tools';
    };

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
            title: Oskari.getMsg('MapModule', 'publisherTools.Zoombar.toolLabel'),
            config: this.state.pluginConfig || {}
        };
    };

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
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
    };
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.ZoombarTool',
    ZoombarTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { ZoombarTool };
