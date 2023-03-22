Oskari.clazz.define('Oskari.mapframework.publisher.tool.FeaturedataTool',
    function () {
    }, {
        index: 9,
        // Disabled for now, need to fix config reading first allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
        lefthanded: 'top right',
        righthanded: 'top right',
        /**
        * Get tool object.
        * @method getTool
        * @private
        *
        * @returns {Object} tool
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
                title: 'FeaturedataPlugin',
                config: this.state.pluginConfig || {}
            };
        },
        // Key in view config non-map-module-plugin tools (for returning the state when modifying an existing published map).
        bundleName: 'featuredata2',

        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            const { configuration = {} } = data;
            if (configuration[this.bundleName]) {
                this.storePluginConf(configuration[this.bundleName].conf);
                this.setEnabled(true);
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
        },
        isDisplayed: function () {
            // Check if selected layers include wfs layers
            return this.getSandbox()
                .findAllSelectedMapLayers()
                .some(l => l.hasFeatureData());
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
