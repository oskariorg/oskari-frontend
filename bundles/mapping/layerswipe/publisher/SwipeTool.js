import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';
import { SwipeToolComponent } from './SwipeToolComponent';

export const SWIPE_ID = 'Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin';

class SwipeTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 40;
        this.group = 'tools';
    }

    getTool () {
        return {
            id: SWIPE_ID,
            title: Oskari.getMsg('LayerSwipe', 'tool.label'),
            config: this.state.pluginConfig || {}
        };
    }

    getHandler () {
        return this.getSandbox().findRegisteredModuleInstance('LayerSwipe')?.getHandler();
    }

    getComponent () {
        const handler = this.getHandler();
        if (!handler) {
            return {};
        }
        return {
            component: SwipeToolComponent,
            handler
        };
    }

    init (data) {
        const { state, conf } = data?.configuration?.layerswipe || {};
        const { active = false } = state || {};
        const handler = this.getHandler();
        // Store config before setEnable because it creates plugin which requires config
        this.storePluginConf(conf);
        handler?.setHideUI(!!conf?.noUI);
        handler.setActive(active);
        if (conf || active) {
            this.setEnabled(true);
        }
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const config = this.getPlugin()?.getConfig() || {};
        const { active = false, noUI = false } = this.getHandler()?.getState() || {};
        return {
            configuration: {
                layerswipe: {
                    conf: { ...config, noUI },
                    state: {
                        active
                    }
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.SwipeTool',
    SwipeTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);
