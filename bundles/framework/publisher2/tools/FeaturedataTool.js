Oskari.clazz.define('Oskari.mapframework.publisher.tool.FeaturedataTool',
function() {
}, {
    index : 9,
    // Disabled for now, need to fix config reading first allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
    allowedLocations: ['top right'],
    lefthanded: 'top right',
    righthanded: 'top right',
    allowedSiblings: [
        'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
        'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
        'Oskari.mapframework.bundle.mapmodule.plugin.PublisherToolbarPlugin',
        'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin'
    ],
    groupedSiblings : false,
    /**
    * Get tool object.
    * @method getTool
    * @private
    *
    * @returns {Object} tool
    */
    getTool: function() {
        var featureData = this.__sandbox.findRegisteredModuleInstance('FeatureData2') || null;
        return {
            id: 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
            title: 'FeaturedataPlugin',
            config: {
                instance: featureData
            }
        };
    },
    //Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
    bundleName: 'featuredata2',

    /**
     * Initialise tool
     * @method init
     */
    init: function(data) {
        var me = this;
        if (data.configuration[me.bundleName]) {
            me.setEnabled(true);
        }
    },
    /**
    * Get values.
    * @method getValues
    * @public
    *
    * @returns {Object} tool value object
    */
    getValues: function () {
        var me = this;
        if(me.state.enabled) {
            var pluginConfig = this.getPlugin().getConfig();
            pluginConfig.instance = null;
            var json = {
                configuration: {}
            };
            json.configuration[me.bundleName] = {
                conf: pluginConfig,
                state: {}
            };
            return json;
        } else {
            return null;
        }
    },
    isDisplayed: function() {
        // Check if selected layers include wfs layers
        var wfs = false,
            layers = this.__sandbox.findAllSelectedMapLayers(),
            j;
        for (j = 0; j < layers.length; ++j) {
            if (layers[j].hasFeatureData()) {
                wfs = true;
                break;
            }
        }
        return wfs;
    }
}, {
    'extend' : ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
    'protocol' : ['Oskari.mapframework.publisher.Tool']
});