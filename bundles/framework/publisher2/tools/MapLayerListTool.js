import { MapLayerListToolComponent } from '../view/MapLayers/MapLayerListToolComponent';
import { MapLayerListHandler } from '../handler/MapLayerListHandler';

const TOOL_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';
Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapLayerListTool',
    function () {
        this.handler = new MapLayerListHandler(this);
    }, {
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
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    });
