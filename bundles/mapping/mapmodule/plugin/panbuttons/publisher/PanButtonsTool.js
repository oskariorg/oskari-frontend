import { AbstractPublisherTool } from '../../../../../framework/publisher2/tools/AbstractPublisherTool';
import { PanButtonsComponent } from './PanButtonsComponent';
import { PanButtonsHandler } from './PanButtonsHandler';
class PanButtonsTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'additional';
        this.handler = new PanButtonsHandler(this);
    };

    init (data) {
        super.init(data);
        const config = this.state?.pluginConfig || {};
        this.handler.init(config);
    }

    getComponent () {
        return {
            component: PanButtonsComponent,
            handler: this.handler
        };
    }

    /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
            title: Oskari.getMsg('MapModule', 'publisherTools.PanButtons.toolLabel'),
            config: this.state?.pluginConfig || {}
        };
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }

        const pluginConfig = this.getPlugin().getConfig() || {};
        // add selected extraoptions to conf
        const state = this.handler.getState();
        for (const key in state) {
            if (state.hasOwnProperty(key)) {
                pluginConfig[key] = state[key];
            }
        }

        return {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{ id: this.getTool().id, config: pluginConfig }]
                    }
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.PanButtonsTool',
    PanButtonsTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { PanButtonsTool };
