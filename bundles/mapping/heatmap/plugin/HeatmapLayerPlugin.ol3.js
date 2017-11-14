/**
 * @class Oskari.mapframework.heatmap.HeatmapLayerPlugin
 * Provides functionality to draw Heatmap layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.heatmap.HeatmapLayerPlugin',
    function () {
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
            var me = this,
            	layerIdPrefix = 'layer_',
            	key;

            // default params and options
            var defaultParams = {
                    LAYERS: layer.getLayerName(),
                    TRANSPARENT: true,
                    ID: layer.getId(),
                    STYLES: layer.getCurrentStyle().getName(),
                    FORMAT: 'image/png',
                    SLD_BODY : this.__getSLD(layer),
                },
                layerParams = layer.getParams(),
                layerOptions = layer.getOptions();
                layerAttributes = layer.getAttributes() || undefined;

            if (layer.getMaxScale() || layer.getMinScale()) {
                // use resolutions instead of scales to minimize chance of transformation errors
                var layerResolutions = this.getMapModule().calculateLayerResolutions(layer.getMaxScale(), layer.getMinScale());
                defaultOptions.resolutions = layerResolutions;
            }
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
                    if (layerAttributes.reverseXY[projectionCode]) {
                        reverseProjection = this._createReverseProjection(projection);
                    }
            }

            var wmsSource = new ol.source.ImageWMS({
                id:layerIdPrefix + layer.getId(),
                url: layer.getLayerUrls()[0],
                params: defaultParams
            });
            // ol.layer.Tile or ol.layer.Image for wms
            var openlayer = new ol.layer.Image({
                title: layerIdPrefix + layer.getId(),
                source: wmsSource,
                projection: reverseProjection ? reverseProjection : undefined,
                opacity: layer.getOpacity() / 100,
                visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
            });

            var params = openlayer.getSource().getParams();

            this.getMapModule().addLayer(openlayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), openlayer);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );
        },
        updateLayerParams: function (layer, forced, params) {
            var params = params || {};
            params.SLD_BODY = this.__getSLD(layer);

            var updateLayer = this.getOLMapLayers( layer.getId() );
            updateLayer.forEach( function ( layer ) {
                layer.getSource().updateParams( params );
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