Oskari.clazz.define('Oskari.mapframework.publisher.tool.SearchTool',
    function () {
    }, {
        index: 4,
        lefthanded: 'top right',
        righthanded: 'top left',

        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin',
                title: 'SearchPlugin',
                config: this.state.pluginConfig || {}
            };
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
