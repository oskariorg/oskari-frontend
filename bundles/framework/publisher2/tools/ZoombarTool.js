Oskari.clazz.define('Oskari.mapframework.publisher.tool.ZoombarTool',
    function () {
    }, {
        index: 3,
        allowedLocations: ['top left', 'top right', 'bottom left', 'bottom right'],
        lefthanded: 'top left',
        righthanded: 'top right',
        allowedSiblings: [
            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
            'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin',
            'Oskari.mapping.bundle.shadowplugin3d.plugin.ShadowingPlugin',
            'Oskari.mapping.maprotator.MapRotatorPlugin'
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
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
                title: 'Portti2Zoombar',
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
