/**
 * @class Oskari.mapframework.heatmap.HeatmapLayerPlugin
 * Provides functionality to draw Heatmap layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.heatmap.HeatmapLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.heatmap.HeatmapLayerPlugin';
        me._name = 'HeatmapLayerPlugin';
    },
    {
        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                mapLayer;

            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' + layer.getOpacity()
            );
            mapLayer = this.getMap().getLayersByName('layer_' + layer.getId());
            if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },
        /**
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }

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

            this.getMap().addLayer(openLayer);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );

            if (keepLayerOnTop) {
                this.getMap().setLayerIndex(openLayer, this.getMap().layers.length);
            } else {
                this.getMap().setLayerIndex(openLayer, 0);
            }
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {

            if (!layer.isLayerOfType(this.TYPE)) {
                return;
            }
            var remLayer;
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var i;
                if (layer.getSubLayers().length > 0) {
                    for (i = 0; i < layer.getSubLayers().length; i += 1) {
                        var subtmp = layer.getSubLayers()[i];
                        remLayer = this.getMap().getLayersByName('basemap_' + subtmp.getId());
                        if (remLayer && remLayer[0] && remLayer[0].destroy) {
                            remLayer[0].destroy();
                        }
                    }
                } else {
                    remLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                    remLayer[0].destroy();
                }
            } else {
                remLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                /* This should free all memory */
                remLayer[0].destroy();
            }
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {

            if (!layer.isLayerOfType(this.TYPE)) {
                return null;
            }

            return this.getMap().getLayersByName('layer_' + layer.getId());
        },
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