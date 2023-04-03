import { MapLayerListToolComponent } from '../view/MapLayers/MapLayerListToolComponent';
import { MapLayerListHandler } from '../handler/MapLayerListHandler';

export const LAYERLIST_ID = 'Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin';

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
                id: LAYERLIST_ID,
                title: Oskari.getMsg('Publisher2', 'BasicView.layerselection.label'),
                config: this.state.pluginConfig || {}
            };
        },
        init: function (data) {
            const plugin = this.findPluginFromInitData(data);
            if (plugin) {
                this.storePluginConf(plugin.config);
                // we need some way of restoring state to handler -> passing init data to it
                this.handler.init(plugin.config);
                this.setEnabled(true);
            }
        },
        getValues: function () {
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
        },
        _stopImpl: function () {
            this.handler.clearState();
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    });
