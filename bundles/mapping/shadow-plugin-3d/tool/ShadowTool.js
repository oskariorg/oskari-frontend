Oskari.clazz.define('Oskari.mapping.bundle.shadowplugin3d.tool.ShadowTool',
    function () {
    }, {
        index: 2,
        allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
        lefthanded: 'top left',
        righthanded: 'top right',
        allowedSiblings: [],
        groupedSiblings: true,
        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            return {
                id: 'Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin',
                title: 'ShadowTool',
                config: {}
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
            if (this.state.enabled) {
                return {
                    configuration: {
                        mapfull: {
                            conf: {
                                plugins: [{ id: this.getTool().id, config: this.getPlugin().getConfig() }]
                            }
                        }
                    }
                };
            } else {
                return null;
            }
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
