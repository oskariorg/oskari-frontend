import { AbstractPublisherTool } from '../../../framework/publisher2/tools/AbstractPublisherTool';

const BUNDLE_ID = 'maplegend';
class MapLegendTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 10;
        this.group = 'layers';
    }

    getTool () {
        return {
            id: 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
            title: Oskari.getMsg(BUNDLE_ID, 'tool.label'),
            config: this.state.pluginConfig || {},
            disabledReason: Oskari.getMsg(BUNDLE_ID, 'noLegendsText')
        };
    }

    getComponent () {
        return {};
    }

    init (data) {
        const myData = data?.configuration[BUNDLE_ID];
        if (myData) {
            this.storePluginConf(myData.conf);
            this.setEnabled(true);
        }
    }

    isDisabled () {
        // should we filter layers with isVisibleOnMap()?
        return !this.getSandbox().findAllSelectedMapLayers().some(l => l.getLegendImage());
    }

    onLayersChanged () {
        if (this.isEnabled() && this.isDisabled()) {
            // disable if layers changed and there is no longer layers with legends on map
            this.setEnabled(false);
        }
    }

    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        return {
            configuration: {
                [BUNDLE_ID]: {
                    conf: this.getPlugin().getConfig()
                }
            }
        };
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.MapLegendTool',
    MapLegendTool,
    {
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    }
);
