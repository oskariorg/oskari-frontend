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
                title: Oskari.getMsg('Publisher2', 'BasicView.layerselection.label'),
                config: this.state.pluginConfig || {}
            };
        },
        _setEnabledImpl: function (enabled) {
            this.handler.setShowLayerSelection(enabled, true);
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
