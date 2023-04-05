import { AbstractPublisherTool } from './AbstractPublisherTool';

class CrosshairTool extends AbstractPublisherTool {
    getTool () {
        return {
            id: 'Oskari.mapframework.publisher.tool.CrosshairTool',
            title: 'CrosshairTool',
            config: this.state.pluginConfig || {},
            hasNoPlugin: true
        };
    }
    init (data) {
        if (Oskari.util.keyExists(data, 'configuration.mapfull.conf.mapOptions.crosshair')) {
            this.setEnabled(!!data?.configuration?.mapfull?.conf?.mapOptions?.crosshair);
        }
    }
    // override since we want to use the instance we currently have, not create a new one
    setEnabled (enabled) {
        const changed = super.setEnabled(enabled);
        if (!changed) {
            return;
        }
        const mapModule = this.getMapmodule();
        if (mapModule) {
            mapModule.toggleCrosshair(enabled);
        }
    }
    getValues () {
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
    }
    stop () {
        super.stop();
        // remove crosshair from map
        const mapModule = this.getMapmodule();
        if (mapModule) {
            mapModule.toggleCrosshair(false);
        }
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.CrosshairTool',
    CrosshairTool,
    {
        'protocol': ['Oskari.mapframework.publisher.Tool']
    }
);
