import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';
import { MyLocationComponent } from './MyLocationComponent';
import { MyLocationToolHandler } from './MyLocationHandler';

class MyLocationTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.group = 'additional';
        this.handler = new MyLocationToolHandler(this);
    };

    init (data) {
        super.init(data);
        const config = this.state?.pluginConfig || {};
        this.handler.init(config);
    }

    getComponent () {
        return {
            component: MyLocationComponent,
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
            id: 'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
            title: Oskari.getMsg('MapModule', 'publisherTools.MyLocationPlugin.toolLabel'),
            config: this.state?.pluginConfig || {}
        };
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const pluginConfig = this.getPlugin().getConfig() || {};
        // update extras
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
Oskari.clazz.defineES('Oskari.publisher.MyLocationTool',
    MyLocationTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { MyLocationTool };
