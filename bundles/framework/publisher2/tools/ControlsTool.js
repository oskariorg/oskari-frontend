Oskari.clazz.define('Oskari.mapframework.publisher.tool.ControlsTool',
    function () {
    }, {
        index: 5,
        pluginName: 'ControlsPlugin',
        init: function (pdata) {
            var me = this;
            var data = pdata;
            if (Oskari.util.keyExists(data, 'configuration.mapfull.conf.plugins')) {
                data.configuration.mapfull.conf.plugins.forEach(function (plugin) {
                    if (me.getTool().id === plugin.id) {
                        var hasConfig = typeof plugin.config === 'object';
                        // enabled if either no config OR has config with false flag
                        me.setEnabled(!hasConfig || (hasConfig && plugin.config.keyboardControls !== false));
                    }
                });
            }
        },
        setEnabled: function (enabled) {
            this.state.enabled = !!enabled;
            this.allowPanning(this.state.enabled);
        },
        getTool: function () {
            return {
                id: 'Oskari.mapframework.mapmodule.ControlsPlugin',
                title: 'ControlsPlugin',
                config: {}
            };
        },
        getConfig: function () {
            var config = null;
            if (!this.state.enabled) {
                config = {
                    keyboardControls: false,
                    mouseControls: false
                };
            }
            return config;
        },
        allowPanning: function (enabled) {
            if (!enabled) {
                this.getSandbox().postRequestByName('DisableMapKeyboardMovementRequest', []);
                this.getSandbox().postRequestByName('DisableMapMouseMovementRequest', []);
            } else {
                this.getSandbox().postRequestByName('EnableMapKeyboardMovementRequest', []);
                this.getSandbox().postRequestByName('EnableMapMouseMovementRequest', []);
            }
        },
        getValues: function () {
            return {
                configuration: {
                    mapfull: {
                        conf: {
                            plugins: [{ id: this.getTool().id, config: this.getConfig() }]
                        }
                    }
                }
            };
        },
        stop: function () {
            this.allowPanning(true);
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
    });
