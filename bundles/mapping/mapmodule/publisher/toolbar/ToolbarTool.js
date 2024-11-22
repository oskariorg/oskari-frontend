import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';
import { ToolbarToolComponent } from './ToolbarToolComponent';
import { ToolbarToolHandler } from './ToolbarToolHandler';
class ToolbarTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 20;
        this.group = 'reactTools';
        this.handler = new ToolbarToolHandler(this);
    }

    init (data) {
        super.init(data);
        const buttons = this.state?.pluginConfig?.buttons;
        if (!buttons) {
            return;
        }

        const handlerConfig = {
            history_forward: false,
            history_back: false,
            measureline: false,
            measurearea: false
        };

        const plugin = this.getPlugin();
        buttons.forEach((key) => { handlerConfig[key] = true; plugin.addToolButton(key); });
        this.handler.init(handlerConfig);
    }

    getTool () {
        const state = this.handler.getState();
        const buttons = Object.keys(state).filter((key) => !!state[key]);
        return {
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
            title: Oskari.getMsg('MapModule', 'publisherTools.PublisherToolbarPlugin.toolLabel'),
            config: {
                ...(this.state.pluginConfig || {}),
                toolbarId: 'PublisherToolbar',
                buttons: buttons || {}
            }
        };
    }

    getComponent () {
        return {
            component: ToolbarToolComponent,
            handler: this.handler
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
        if (!this.isEnabled()) {
            return null;
        }

        const buttons = [];
        const state = this.handler.getState();
        for (const toolName in state) {
            if (state[toolName]) {
                buttons.push(toolName);
            }
        }

        const pluginConfig = this.getPlugin().getConfig();
        pluginConfig.buttons = buttons;

        const retValue = {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{ id: this.getTool().id, config: pluginConfig }]
                    }
                },
                toolbar: {
                    conf: {
                        history: false,
                        basictools: false,
                        viewtools: false
                    }
                }
            }
        };
        return retValue;
    }

    hasActiveTools () {
        const state = this.handler.getState();
        return Object.keys(state)
            .some(toolName => state[toolName] === true);
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.ToolbarTool',
    ToolbarTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { ToolbarTool };
