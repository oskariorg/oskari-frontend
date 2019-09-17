import olLayerImage from 'ol/layer/Image';
import olSourceImageWMS from 'ol/source/ImageWMS';

/**
 * @class Oskari.mapframework.heatmap.HeatmapLayerPlugin
 * Provides functionality to draw Heatmap layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.heatmap.HeatmapLayerPlugin',
    function () {
        this._log = Oskari.log('HeatmapLayerPlugin');
    }, {
        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var layerIdPrefix = 'layer_',
                key;

            // default params and options
            var defaultParams = {
                    LAYERS: layer.getLayerName(),
                    TRANSPARENT: true,
                    ID: layer.getId(),
                    STYLES: layer.getCurrentStyle().getName(),
                    FORMAT: 'image/png',
                    SLD_BODY: this.__getSLD(layer)
                },
                layerParams = layer.getParams(),
                layerAttributes = layer.getAttributes() || undefined;

            // override default params and options from layer
            for (key in layerParams) {
                if (layerParams.hasOwnProperty(key)) {
                    defaultParams[key] = layerParams[key];
                }
            }
            var projection = this.getMapModule().getProjection(),
                reverseProjection;

            if (layerAttributes && layerAttributes.reverseXY && (typeof layerAttributes.reverseXY === 'object')) {
                // use reverse coordinate order for this layer!
                if (layerAttributes.reverseXY[projection]) {
                    reverseProjection = this._createReverseProjection(projection);
                }
            }

            var wmsSource = new olSourceImageWMS({
                id: layerIdPrefix + layer.getId(),
                url: layer.getLayerUrls()[0],
                params: defaultParams
            });
            // olLayerTile or olLayerImage for wms
            var openlayer = new olLayerImage({
                title: layerIdPrefix + layer.getId(),
                source: wmsSource,
                projection: reverseProjection || undefined,
                opacity: layer.getOpacity() / 100,
                visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible()
            });

            this.getMapModule().addLayer(openlayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), openlayer);
            this._log.debug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );
        },
        updateLayerParams: function (layer, forced, params) {
            params = params || {};
            params.SLD_BODY = this.__getSLD(layer);

            var updateLayer = this.getOLMapLayers(layer.getId());
            updateLayer.forEach(function (layer) {
                layer.getSource().updateParams(params);
            });
        }
    },
    {
        'extend': ['Oskari.mapframework.heatmap.AbstractHeatmapPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
