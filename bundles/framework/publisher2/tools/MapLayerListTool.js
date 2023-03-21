import { MapLayerListToolComponent } from '../view/MapLayers/MapLayerListToolComponent';
import { MapLayerListHandler } from '../handler/MapLayerListHandler';

Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapLayerListTool',
    function () {
        this.handler = new MapLayerListHandler(this);
    }, {
        index: 5,
        group: 'layers',
        getComponent: function () {
            return {
                component: MapLayerListToolComponent,
                handler: this.handler
            };
        },
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin',
                title: 'LayerSelectionPlugin',
                config: this.state.pluginConfig || {}
            };
        },
        _stopImpl: function () {
            this.handler.clearState();
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    });
