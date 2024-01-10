import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';
import { SwipeToolhandler } from '../handler/SwipeToolHandler';
import { SwipeToolComponent } from './SwipeToolComponent';

export const SWIPE_ID = 'Oskari.mapframework.bundle.layerswipe.plugin.LayerSwipePlugin';

class SwipeTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 5;
        this.group = 'additional';
        this.handler = new SwipeToolhandler(this);
    }

    getTool () {
        return {
            id: SWIPE_ID,
            title: Oskari.getMsg('LayerSwipe', 'tool.label'),
            config: this.state.pluginConfig || {}
        };
    }

    getComponent () {
        return {
            component: SwipeToolComponent,
            handler: this.handler
        };
    }

    init (data) {
        const configuration = data?.configuration?.layerswipe || {};
        if (configuration?.state?.active) {
            this.setEnabled(true);
        }

        // restore state to handler -> passing init data to it
        this.handler.init(configuration);

        if (configuration.conf) {
            this.storePluginConf(configuration.conf);
            this.setEnabled(true);
            this.handler.syncState();
        }
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const { autoStart = false } = this.handler.getState();
        const value = {
            configuration: {
                layerswipe: {
                    conf: this.getPlugin()?.getConfig() || {},
                    state: {
                        active: autoStart
                    }
                }
            }
        };
        return value;
    }

    stop () {
        super.stop();
        this.handler.clearState();
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.SwipeTool',
    SwipeTool,
    {
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
