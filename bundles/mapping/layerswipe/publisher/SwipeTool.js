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
        const configuration = data?.configuration?.layerswipe?.conf;
        // restore state to handler -> passing init data to it
        this.handler.init(configuration);
        if (configuration) {
            this.storePluginConf(configuration);
            this.setEnabled(true);
        }
    }
    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const value = {
            configuration: {
                layerswipe: {
                    conf: this.getPlugin().getConfig()
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
