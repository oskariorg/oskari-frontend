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
                    layers: layer.getLayerName(),
                    transparent: true,
                    id: layer.getId(),
                    styles: layer.getCurrentStyle().getName(),
                    format: 'image/png',
                    SLD_BODY : this.__getSLD(layer)
                },
                defaultOptions = {
                    singleTile : true,
                    layerId: layer.getLayerName(),
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visibility: true,
                    buffer: 0
                },
                layerParams = layer.getParams(),
                layerOptions = layer.getOptions();
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
            for (key in layerOptions) {
                if (layerOptions.hasOwnProperty(key)) {
                    defaultOptions[key] = layerOptions[key];
                }
            }

            var openLayer = new OpenLayers.Layer.WMS(layerIdPrefix + layer.getId(), layer.getLayerUrls(), defaultParams, defaultOptions);
            openLayer.opacity = layer.getOpacity() / 100;

            // hackish way of hooking into layers redraw calls
            var original = openLayer.redraw;
            openLayer.redraw = function() {
            	// mergeNewParams triggers a new redraw so we need to use
            	// a flag variable to detect if we should redraw or calculate new SLD
            	if(this.____oskariFlagSLD === true) {
            		this.____oskariFlagSLD = false;
            		return original.apply(this, arguments);
            	}
        		this.____oskariFlagSLD = true;
                openLayer.mergeNewParams({
                    SLD_BODY : me.__getSLD(layer)
                });
            }
            // /hack

            this.getMap().addLayer(openLayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), openLayer);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );
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