Oskari.clazz.define('Oskari.mapping.time-control-3d.TimeControl3dTool',
    function () {
    }, {
        index: 2,
        allowedLocations: ['top left', 'top right'],
        lefthanded: 'top left',
        righthanded: 'top right',
        allowedSiblings: [
            'Oskari.mapframework.bundle.featuredata2.plugin.FeaturedataPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.MyLocationPlugin',
            'Oskari.mapframework.bundle.mapmodule.plugin.PanButtons',
            'Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar',
            'Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin',
            'Oskari.mapping.cameracontrols3d.CameraControls3dPlugin',
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
                id: 'Oskari.mapping.time-control-3d.TimeControl3dPlugin',
                title: 'TimeControl3d',
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
