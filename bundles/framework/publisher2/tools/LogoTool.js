Oskari.clazz.define('Oskari.mapframework.publisher.tool.LogoTool',
    function () {
    }, {
        index: 1,

        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
                title: 'LogoPlugin',
                config: this.state.pluginConfig || {}
            };
        },
        init: function (data) {
            const plugin = this.findPluginFromInitData(data);
            if (plugin) {
                this.storePluginConf(plugin.config);
                // when we enter publisher:
                // restore saved location for plugin that is not stopped nor started
                this.getPlugin().setLocation(plugin.config?.location?.classes);
            }
        },
        // not displayed on tool panels so user can't disable it
        isDisplayed: function () {
            return false;
        },
        getPlugin: function () {
            // always use the instance on map, not a new copy
            return this.getMapmodule().getPluginInstances('LogoPlugin');
        },
        // always enabled, use the instance that is on map
        isEnabled: function () {
            return true;
        },
        stop: function () {
            // when we exit publisher:
            // move plugin back to bottom left if it was dragged during publisher
            this.getPlugin()?.setLocation('bottom left');
        },
        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            const plugin = this.getPlugin();
            if (!plugin) {
                return null;
            }
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{
                                id: this.getTool().id,
                                config: {
                                    location: plugin.getConfig()?.location
                                }
                            }]
                        }
                    }
                }
            };
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
