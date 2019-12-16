Oskari.clazz.define('Oskari.mapping.cameracontrols3d.CameraControls3dTool',
    function () {
    }, {
        index: 3,
        allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
        lefthanded: 'top left',
        righthanded: 'top right',
        allowedSiblings: [
            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons'
        ],

        groupedSiblings: true,

        /**
    * Get tool object.
    * @method getTool
    *
    * @returns {Object} tool description
    */
        getTool: function () {
            return {
                id: 'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin',
                title: 'CameraControls3d',
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
        },
        /**
        * Stop tool.
        * @method stop
        * @public
        */
        stop: function () {
            this.__started = false;
            if (!this.__plugin) {
                return;
            }
            if (this.getSandbox()) {
                this.__plugin.stopPlugin(this.getSandbox());
            }
            this.__mapmodule.unregisterPlugin(this.__plugin);
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
