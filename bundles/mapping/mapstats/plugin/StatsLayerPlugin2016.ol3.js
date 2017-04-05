/**
 * @class Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapstats.plugin.StatsLayerPlugin',

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

            var me = this;

            var openlayer = this.__createLayer(layer);
            // this is used for statslayer to create a copied layer as indexmap
            // as using it directly results in weird behavior:
            // - the normal map not refreshing on move after indexmap is opened
            // - in some cases indexmap + normal map going to an infinite update-loop when zooming out
            openlayer.createIndexMapLayer = function() {
                return me.__createLayer(layer);
            };
            this.getMapModule().addLayer(openlayer, !keepLayerOnTop);

            me.getSandbox().printDebug('#!#! CREATED OPENLAYER.LAYER.WMS for StatsLayer ' + layer.getId());

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);
            this.renderActiveIndicator();
        },
        __createLayer: function(layer) {
            var me = this;
            var openlayer = new ol.layer.Image({
                    source: new ol.source.ImageWMS({
                        url: me.ajaxUrl + '&LAYERID=' + layer.getId(),
                        params: {
                            'LAYERS': layer.getLayerName(),
                            'FORMAT': 'image/png'
                        },
                        //crossOrigin : 'anonymous',
                        crossOrigin : layer.getAttributes('crossOrigin')
                    }),
                    visible: layer.isInScale(me.getSandbox().getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });

            openlayer.setOpacity(layer.getOpacity() / 100);

            // Set min max Resolutions
            if (layer.getMaxScale() && layer.getMaxScale() !== -1 ) {
                openlayer.setMinResolution(this.getMapModule().getResolutionForScale(layer.getMaxScale()));
            }
            // No definition, if scale is greater than max resolution scale
            if (layer.getMinScale()  && layer.getMinScale() !== -1 && (layer.getMinScale() < this.getMapModule().getScaleArray()[0] )) {
                openlayer.setMaxResolution(this.getMapModule().getResolutionForScale(layer.getMinScale()));
            }
            return openlayer;
        },
        __updateLayerParams : function(layer, params) {
            layer.getSource().updateParams(params);
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