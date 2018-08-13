Oskari.clazz.define('Oskari.mapframework.publisher.tool.ControlsTool',
    function () {
    }, {
        index: 5,
        pluginName: 'ControlsPlugin',
        setEnabled: function (enabled) {
            var me = this;
            var tool = me.getTool();
            var sandbox = me.__sandbox;

            if (me.state.enabled !== undefined && me.state.enabled !== null && enabled === me.state.enabled) {
                return;
            }
            me.state.enabled = enabled;

            if (!me.__plugin && enabled) {
                me.__plugin = Oskari.clazz.create(tool.id, tool.config);
                me.__mapmodule.registerPlugin(me.__plugin);
            }

            if (enabled === true && !me.__started) {
                me.__plugin.startPlugin(me.__sandbox);
                me.__started = true;
            }
        },
        getInstance: function () {
            return Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule').getPluginInstances(this.pluginName);
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
        }
}, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.Tool']
});
