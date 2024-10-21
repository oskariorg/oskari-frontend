import { AbstractPublisherTool } from '../../../../../framework/publisher2/tools/AbstractPublisherTool';
import { PanButtonsComponent } from './PanButtonsComponent';
import { PanButtonsHandler } from './PanButtonsHandler';
class PanButtonsTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'additional';
        this.config = null;
        this.handler = new PanButtonsHandler(this);
    };

    init (data) {
        const plugin = this.findPluginFromInitData(data);
        // restore state to handler -> passing init data to it
        this.setEnabled(!!plugin);

        if (plugin?.config) {
            this.handler.init(plugin.config);
        }
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
            config: this.handler?.getState() || {}
        };
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }

        const pluginConfig = this.getPlugin().config || {};
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
