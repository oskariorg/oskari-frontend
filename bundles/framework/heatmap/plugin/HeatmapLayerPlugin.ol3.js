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
            mapLayer = this.getLayersByName('layer_' + layer.getId());
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

            this.getMapModule().addLayer(openlayer, false);
            this.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for ' + layer.getId()
            );
            //setAt or use setZIndex() for the layer
            if (keepLayerOnTop) {
                this.getMap().getLayers().setAt(this.getMapModule().getLayers().length, openlayer);
            } else {
                this.getMap().getLayers().setAt(0, openlayer);
            }
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
            var me = this;
            if ( !layer.isLayerOfType( this.TYPE ) ) {
                return;
            }
            var remLayer;
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var i;
                if (layer.getSubLayers().length > 0) {
                    for (i = 0; i < layer.getSubLayers().length; i += 1 ) {
                        var subtmp = layer.getSubLayers()[i];
                        remLayer = this.getLayersByName( 'basemap_' + subtmp.getId() );
                        if ( remLayer ) {
                            remLayer.forEach( function  (layer ) {
                                me.getMapModule().removeLayer( layer );
                            });
                        }
                    }
                } else {
                    remLayer = this.getLayersByName( 'layer_' + layer.getId() );
                    remLayer.forEach( function  (layer ) {
                        me.getMapModule().removeLayer( layer );
                    });       
                }
            } else {
                remLayer = this.getLayersByName( 'layer_' + layer.getId() );
                remLayer.forEach( function  (layer ) {
                    me.getMapModule().removeLayer( layer );
                });
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

            return this.getLayersByName('layer_' + layer.getId());
        },
        getLayersByName: function (name) {
            var layers = this.getMapModule().getLayers();
            var foundLayers = [];
            for ( var i = 0; i < layers.length; i++ ) {
                if( layers[i].get("title") === name ) {
                    foundLayers.push(layers[i]);
                }
            }
            return foundLayers;
        },
        updateLayerParams: function (layer, forced, params) {
            debugger;
            var params = params || {};
            params.SLD_BODY = this.__getSLD(layer);
            
            var updateLayer = this.getLayersByName('layer_'+ layer.getId() );
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