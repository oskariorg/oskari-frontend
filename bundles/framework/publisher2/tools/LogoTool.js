Oskari.clazz.define('Oskari.mapframework.publisher.tool.LogoTool',
    function () {
    }, {
        index: 1,
        lefthanded: 'bottom left',
        righthanded: 'bottom right',

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
            this.getPlugin().setLocation('bottom left');
        },
        /**
        * Get values.
        * @method getValues
        * @public
        *
        * @returns {Object} tool value object
        */
        getValues: function () {
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                        }
                    }
                }
            };
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
