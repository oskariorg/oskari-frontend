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
            // doesn't actually map to anything real, just need this in order to not break stuff in publisher
                id: 'Oskari.mapframework.publisher.tool.CrosshairTool',
                title: 'CrosshairTool',
                config: this.state.pluginConfig || {}
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
        // override since it's not really a plugin but a method on mapmodule
        setEnabled: function (enabled) {
            const mapModule = this.getMapmodule();
            if (mapModule) {
                mapModule.toggleCrosshair(enabled);
            }
            this.state.enabled = !!enabled;
        },
        stop: function () {
            // remove crosshair when exiting
            this.setEnabled(false);
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
