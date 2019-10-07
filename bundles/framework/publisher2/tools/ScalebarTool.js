Oskari.clazz.define('Oskari.mapframework.publisher.tool.ScalebarTool',
    function () {
    }, {
        index: 0,
        allowedLocations: ['bottom left', 'bottom right'],
        lefthanded: 'bottom left',
        righthanded: 'bottom right',
        allowedSiblings: [
            'Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.LogoPlugin',
            'Oskari.statistics.statsgrid.ClassificationPlugin'
        ],
        groupedSiblings: false,

        /**
        * Get tool object.
        * @method getTool
        * @private
        *
        * @returns {Object} tool
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin',
                title: 'ScaleBarPlugin',
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
