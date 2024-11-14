import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';
import { MapRotatorToolHandler } from './MapRotatorToolHandler';
import { MapRotatorToolComponent } from './MapRotatorToolComponent';

class MapRotatorTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 1;
        this.bundleName = 'maprotator';
        this.group = 'additional';
        this.handler = new MapRotatorToolHandler(this);
    }

    init (data) {
        if (!data || !data.configuration[this.bundleName]) {
            // new publication and no saved config but ther is a toolconfig -> init with that.
            if (this.toolConfig) {
                this.handler.init(this.toolConfig);
            }
            return;
        }

        // saved configuration -> restore.
        const conf = data.configuration[this.bundleName].conf || {};
        this.handler.init(conf);
        this.storePluginConf(conf);
        this.setEnabled(true);
    }

    isDisplayed () {
        // shouldn't be shown if bundle is not started
        // otherwise results in js errors
        return !!this.getMapRotatorInstance();
    }

    getMapRotatorInstance () {
        return this.getSandbox().findRegisteredModuleInstance(this.bundleName);
    }

    getTool () {
        return {
            id: 'Oskari.mapping.maprotator.MapRotatorPlugin',
            title: Oskari.getMsg('maprotator', 'title'),
            config: this.state.pluginConfig || {}
        };
    }

    getComponent () {
        return {
            component: MapRotatorToolComponent,
            handler: this.handler
        };
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const pluginConfig = this.state.pluginConfig;
        const json = {
            configuration: {}
        };
        json.configuration[this.bundleName] = {
            conf: pluginConfig,
            state: this.getMapRotatorInstance().getState()
        };
        return json;
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.MapRotatorTool',
    MapRotatorTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { MapRotatorTool };
