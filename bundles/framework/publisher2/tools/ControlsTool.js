import { AbstractPublisherTool } from './AbstractPublisherTool';

class ControlsTool extends AbstractPublisherTool {
    getIndex () {
        return 5;
    }
    getTool () {
        return {
            id: 'Oskari.mapframework.mapmodule.ControlsPlugin',
            title: 'ControlsPlugin',
            config: this.state.pluginConfig || {},
            hasNoPlugin: true
        };
    }
    init (data) {
        const plugin = this.findPluginFromInitData(data);
        if (plugin) {
            var hasConfig = typeof plugin.config === 'object';
            if (hasConfig) {
                this.storePluginConf(plugin.config);
            }
            // enabled if either no config OR has config with false flag
            this.setEnabled(!hasConfig || (hasConfig && plugin.config.keyboardControls !== false));
        }
    }
    // override since we want to use the instance we currently have, not create a new one
    setEnabled (enabled) {
        const changed = super.setEnabled(enabled);
        if (!changed) {
            return;
        }
        this.allowPanning(!!enabled);
    }
    getPlugin () {
        // always use the instance on map, not a new copy
        return this.getMapmodule().getPluginInstances('ControlsPlugin');
    }
    allowPanning (enabled) {
        if (!enabled) {
            this.getSandbox().postRequestByName('DisableMapKeyboardMovementRequest', []);
            this.getSandbox().postRequestByName('DisableMapMouseMovementRequest', []);
        } else {
            this.getSandbox().postRequestByName('EnableMapKeyboardMovementRequest', []);
            this.getSandbox().postRequestByName('EnableMapMouseMovementRequest', []);
        }
    }
    getValues () {
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
    getConfig () {
        // NOTE! returning null when isEnabled() is ON PURPOSE!
        // Usually this is reversed
        if (this.isEnabled()) {
            return null;
        }
        // In this one we want to have the plugin always present but we configure it to disable controls
        return {
            keyboardControls: false,
            mouseControls: false
        };
    }
    stop () {
        super.stop();
        // resume panning on map
        this.allowPanning(true);
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.ControlsTool',
    ControlsTool,
    {
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
