Oskari.clazz.define('Oskari.mapframework.publisher.tool.ControlsTool',
    function () {
    }, {
        index: 5,
        pluginName: 'ControlsPlugin',
        init: function (data) {
            const plugin = this.findPluginFromInitData(data);
            if (plugin) {
                var hasConfig = typeof plugin.config === 'object';
                if (hasConfig) {
                    this.storePluginConf(plugin.config);
                }
                // enabled if either no config OR has config with false flag
                this.setEnabled(!hasConfig || (hasConfig && plugin.config.keyboardControls !== false));
            }
        },
        // override since we want to use the instance we currently have, not create a new one
        setEnabled: function (enabled) {
            // state actually hasn't changed -> do nothing
            if (this.isEnabled() === enabled) {
                return;
            }
            this.state.enabled = enabled;
            this.allowPanning(!!enabled);

            var event = Oskari.eventBuilder('Publisher2.ToolEnabledChangedEvent')(this);
            this.getSandbox().notifyAll(event);
        },
        getTool: function () {
            return {
                id: 'Oskari.mapframework.mapmodule.ControlsPlugin',
                title: 'ControlsPlugin',
                config: this.state.pluginConfig || {}
            };
        },
        getPlugin: function () {
            // always use the instance on map, not a new copy
            return this.getMapmodule().getPluginInstances('ControlsPlugin');
        },
        getConfig: function () {
            // NOTE! isEnabled returning null is ON PURPOSE!
            // Usually this is reversed
            if (this.isEnabled()) {
                return null;
            }
            // In this one we want to have the plugin always present but we configure it to disable controls
            return {
                keyboardControls: false,
                mouseControls: false
            };
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
