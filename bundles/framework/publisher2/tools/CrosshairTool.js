Oskari.clazz.define('Oskari.mapframework.publisher.tool.CrosshairTool',
    function () {
    }, {
        getName: function () {
            return 'Oskari.mapframework.publisher.tool.CrosshairTool';
        },
        /**
        * Get tool object.
        * @method getTool
        *
        * @returns {Object} tool description
        */
        getTool: function () {
            return {
                id: 'Oskari.mapframework.publisher.tool.CrosshairTool',
                title: 'CrosshairTool',
                config: this.state.pluginConfig || {},
                hasNoPlugin: true
            };
        },
        init: function (data) {
            if (Oskari.util.keyExists(data, 'configuration.mapfull.conf.mapOptions.crosshair')) {
                this.setEnabled(!!data?.configuration?.mapfull?.conf?.mapOptions?.crosshair);
            }
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
                            mapOptions: {
                                crosshair: true
                            }
                        }
                    }
                }
            };
        },
        _setEnabledImpl: function (enabled) {
            const mapModule = this.getMapmodule();
            if (mapModule) {
                mapModule.toggleCrosshair(enabled);
            }
        },
        _stopImpl: function () {
            const mapModule = this.getMapmodule();
            if (mapModule) {
                mapModule.toggleCrosshair(false);
            }
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
