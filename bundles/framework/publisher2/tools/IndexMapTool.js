Oskari.clazz.define('Oskari.mapframework.publisher.tool.IndexMapTool',
    function () {
    }, {
        index: 1,
        allowedLocations: ['bottom left', 'bottom right'],
        lefthanded: 'bottom right',
        righthanded: 'bottom left',
        allowedSiblings: [
            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
            'Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin'
        ],

        groupedSiblings: false,

        /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
                title: 'IndexMapPlugin',
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
            var me = this;

            if (me.state.enabled) {
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
