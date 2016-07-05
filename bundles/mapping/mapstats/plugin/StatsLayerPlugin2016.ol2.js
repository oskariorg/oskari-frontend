/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
    }, {
        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
            if (!this.isLayerSupported(layer)) {
                return;
            }

            var me = this,
                sandbox = me.getSandbox();

            var layerScales = me.getMapModule().calculateLayerScales(
                layer.getMaxScale(),
                layer.getMinScale()
            );
            var openLayer = new OpenLayers.Layer.WMS('layer_' + layer.getId(),
                    me.ajaxUrl + '&LAYERID=' + layer.getId(),
                    {
                        layers: layer.getLayerName(),
                        transparent: true,
                        format: 'image/png'
                    },
                    {
                        scales: layerScales,
                        tileOptions: {maxGetUrlLength: 1024},
                        visibility: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                        singleTile: true,
                        buffer: 0
                    }
                );

            openLayer.opacity = layer.getOpacity() / 100;

            this.getMapModule().addLayer(openLayer, !keepLayerOnTop);

            me.getSandbox().printDebug('#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer ' + layer.getId());

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openLayer);
            this.renderActiveIndicator();
        },
        __updateLayerParams : function(layer, params) {
            layer.mergeNewParams(params);
        }
    }, {
        'extend': ['Oskari.mapping.mapstats.AbstractStatsLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });