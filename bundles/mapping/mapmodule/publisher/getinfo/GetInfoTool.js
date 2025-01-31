import { AbstractPublisherTool } from '../../../../framework/publisher2/tools/AbstractPublisherTool';
import { GetInfoToolComponent } from './GetInfoToolComponent';
import { GetInfoToolHandler } from './GetInfoToolHandler';

const GETINFO_TOOL_ID = 'Oskari.mapframework.mapmodule.GetInfoPlugin';
class GetInfoTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 141;
        this.group = 'tools';
        this.handler = new GetInfoToolHandler(this);
    }

    getTool () {
        const config = {
            ...this.state?.pluginConfig,
            ignoredLayerTypes: ['WFS'],
            infoBox: false
        };

        return {
            id: GETINFO_TOOL_ID,
            title: Oskari.getMsg('Publisher2', 'BasicView.maptools.GetInfoPlugin'),
            config
        };
    }

    getComponent () {
        return {
            component: GetInfoToolComponent,
            handler: this.handler
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
    };
};

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.GetInfoTool',
    GetInfoTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { GetInfoTool };
