import { AbstractPublisherTool } from './AbstractPublisherTool';
import { MapLayerListToolComponent } from '../view/MapLayers/MapLayerListToolComponent';
import { MapLayerListHandler } from '../handler/MapLayerListHandler';

export const LAYERLIST_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';

class MapLayerListTool extends AbstractPublisherTool {
    constructor (...args) {
        super(...args);
        this.index = 5;
        this.group = 'layers';
        this.handler = new MapLayerListHandler(this);
    }
    getTool () {
        return {
            id: LAYERLIST_ID,
            title: Oskari.getMsg('Publisher2', 'BasicView.layerselection.label'),
            config: this.state.pluginConfig || {}
        };
    }
    getComponent () {
        return {
            component: MapLayerListToolComponent,
            handler: this.handler
        };
    }
    init (data) {
        super.init(data);
        // restore state to handler -> passing init data to it
        this.handler.init(this.getTool().config);
    }
    getValues () {
        if (!this.isEnabled()) {
            return null;
        }
        const pluginConfig = this.getPlugin().getConfig();
        const value = {
            configuration: {
                mapfull: {
                    conf: {
                        plugins: [{ id: this.getTool().id, config: pluginConfig }]
                    }
                }
            }
        };
        if (pluginConfig.showMetadata) {
            // we need to add metadataflyout bundle as well for links to work properly
            value.configuration.metadataflyout = {};
        }
        return value;
    }
    stop () {
        super.stop();
        this.handler.clearState();
    }
}

// Attach protocol to make this discoverable by Oskari publisher
Oskari.clazz.defineES('Oskari.publisher.MapLayerListTool',
    MapLayerListTool,
    {
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    }
);
