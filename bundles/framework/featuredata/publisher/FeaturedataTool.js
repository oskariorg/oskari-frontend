import { AbstractPublisherTool } from '../../publisher2/tools/AbstractPublisherTool';

class FeaturedataTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 130;
        this.group = 'tools';
        this.bundleName = 'featuredata';
    }

    /**
     * Initialise tool
     * @method init
     */
    init (data) {
        const { configuration = {} } = data;
        if (configuration[this.bundleName]) {
            this.storePluginConf(configuration[this.bundleName].conf);
            // even if we have the config, we don't want to enable the tool if its not shown
            // if we enable it the plugin won't show and everything looks ok, but getValues() will
            // still return a non-null value which makes featuredata bundle to be
            // started on the embedded map even if it's not used
            this.setEnabled(this.isDisplayed(data));
        }
    }

    getComponent () {
        return {
            component: null,
            handler: null
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
            id: 'Oskari.mapframework.bundle.featuredata.plugin.FeaturedataPlugin',
            title: Oskari.getMsg('FeatureData', 'publisher.toolLabel'),
            config: this.state.pluginConfig || {}
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
        const json = {
            configuration: {}
        };
        json.configuration[this.bundleName] = {
            conf: pluginConfig,
            state: {}
        };
        return json;
    }

    isDisplayed () {
        // Check if selected layers include wfs layers
        return this.getSandbox()
            .findAllSelectedMapLayers()
            .some(l => l.hasFeatureData());
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.FeaturedataTool',
    FeaturedataTool,
    {
        protocol: ['Oskari.mapframework.publisher.Tool']
    }
);

export { FeaturedataTool };
