Oskari.clazz.define('Oskari.mapframework.publisher.tool.IndexMapTool',
    function () {
    }, {
        index: 1,
        lefthanded: 'bottom right',
        righthanded: 'bottom left',

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
        * Is displayed.
        * @method isDisplayed
        * @public
        *
        * @returns {Boolean} is tool displayed
        */
        isDisplayed: function () {
            return !Oskari.getSandbox().getMap().getSupports3D();
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
