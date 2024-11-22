import { AbstractPublisherTool } from '../../publisher2/tools/AbstractPublisherTool';
import { CoordinateToolComponent } from './CoordinateToolComponent';
import { CoordinateToolHandler } from './CoordinateToolHandler';
class CoordinateTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 120;
        this.group = 'reactTools';
        this.bundleName = 'coordinatetool';
        this.handler = new CoordinateToolHandler(this);
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

    getComponent () {
        return {
            component: CoordinateToolComponent,
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
            id: 'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
            title: Oskari.getMsg('coordinatetool', 'display.publisher.toolLabel'),
            config: {
                ...(this.state.pluginConfig || {})
            }
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

        const pluginConfig = this.getPlugin().getConfig();
        const state = this.handler.getState();
        for (const key in state) {
            if (key === 'hasSupportedProjections') {
                continue;
            };
            pluginConfig[key] = state[key];
            // Not save supportedProjections if is not checked
            if (key === 'supportedProjections' && !state[key]) {
                pluginConfig[key] = null;
                delete pluginConfig[key];
            }
            // Not save noUI if is not checked
            if (key === 'noUI' && !state[key]) {
                pluginConfig[key] = null;
                delete pluginConfig[key];
            }
        }

        const json = {
            configuration: {}
        };
        json.configuration[this.bundleName] = {
            conf: pluginConfig,
            state: {}
        };
        return json;
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.CoordinateTool',
    CoordinateTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { CoordinateTool };
