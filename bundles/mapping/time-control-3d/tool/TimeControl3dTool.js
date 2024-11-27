import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';

class TimeControl3dTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 180;
        this.group = 'tools';
        this.lefthanded = 'top left';
        this.righthanded = 'top right';
        this.groupedSiblings = true;
    };

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool () {
        return {
            id: 'Oskari.mapping.time-control-3d.TimeControl3dPlugin',
            title: Oskari.getMsg('TimeControl3d', 'publisher.toolLabel'),
            config: this.state?.pluginConfig || {}
        };
    }

    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues () {
        if (this.state.enabled) {
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                        }
                    }
                }
            };
        } else {
            return null;
        }
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.TimeControl3dTool',
    TimeControl3dTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { TimeControl3dTool };
