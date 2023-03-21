import { MapLegendTool } from './MapLegendTool';
import { MapLegendHandler } from './MapLegendHandler';

Oskari.clazz.define('Oskari.mapframework.publisher.tool.MapLegend',
    function () {
        this.handler = null;
    }, {
        group: 'layers',
        bundleName: 'maplegend',
        getComponent: function () {
            return {
                component: MapLegendTool,
                handler: this.handler
            };
        },
        getTool: function () {
            return {
                id: 'Oskari.mapframework.bundle.maplegend.plugin.MapLegendPlugin',
                title: 'MapLegend',
                config: this.state.pluginConfig || {}
            };
        },
        /**
         * Initialise tool
         * @method init
         */
        init: function (data) {
            const myData = data?.configuration[this.bundleName];
            const enabled = !!myData;
            this.handler = new MapLegendHandler(enabled, this);
            if (enabled) {
                this.storePluginConf(myData.conf);
                this.setEnabled(true);
            }
        },
        isDisabled: function () {
            return !this.getSandbox().findAllSelectedMapLayers().some(l => l.getLegendImage());
        },
        /**
         * Get values.
         * @method getValues
         * @public
         *
         * @returns {Object} tool value object
         */
        getValues: function () {
            if (!this.isEnabled()) {
                return null;
            }
            return {
                [this.bundleName]: {
                    conf: this.getPlugin().getConfig()
                }
            };
        }
    }, {
        'extend': ['Oskari.mapframework.publisher.tool.AbstractPluginTool'],
        'protocol': ['Oskari.mapframework.publisher.LayerTool']
    });
