/**
 * Provides functionality to draw MyPlaces layers on the map
 *
 * @class Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
    }, {
        _clazz : 'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin',
        __name : 'MyPlacesLayerPlugin',
        /** @static @property layertype type of layers this plugin handles */
        layertype: 'myplaces',

        getLayerTypeSelector : function() {
            return this.layertype;
        },
        /**
         * Interface method for the module protocol.
         *
         * @private @method _initImpl
         *
         *
         */
        _initImpl: function () {
            // register domain builder
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );
            if (!mapLayerService) {
                return;
            }
            mapLayerService.registerLayerModel(
                this.layertype,
                'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer'
            );
            layerModelBuilder = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder',
                this.getSandbox()
            );
            mapLayerService.registerLayerModelBuilder(this.layertype,
                layerModelBuilder
            );
        },
        /**
         * Adds a single MyPlaces layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var openLayerId = 'layer_' + layer.getId(),
                map = this.getMapModule();
            var openlayer = new ol.layer.Image({
                source: new ol.source.ImageWMS({
                    url: layer.getWmsUrl(),
                    params: {
                        'LAYERS': layer.getWmsName(),
                        'FORMAT': 'image/png'
                    },
                    crossOrigin: layer.getAttributes('crossOrigin')
                }),
                visible: layer.isInScale(map.getMapScale()) && layer.isVisible(),
                opacity: layer.getOpacity() / 100

            });
            //minresolution === maxscale and vice versa...
            if(layer.getMaxScale() && layer.getMaxScale() !== -1) {
                openlayer.setMinResolution(map.getResolutionForScale(layer.getMaxScale()));
            }
            if(layer.getMinScale() && layer.getMinScale() !== -1) {
                var maxResolution = map.getResolutionForScale(layer.getMinScale());
                if(maxResolution !== map.getResolutionArray()[0]) {
                    // ol3 maxReso is exclusive so don't set if it's the map max resolution
                    openlayer.setMaxResolution(maxResolution);
                }
            }

            this._registerLayerEvents(openlayer, layer);
        
            map.addLayer(openlayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), openlayer);

            Oskari.log('Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin').debug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for MyPlacesLayer ' +
                layer.getId()
            );
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
         _registerLayerEvents: function(layer, oskariLayer){
            var me = this,
                source = layer.getSource();

            source.on('imageloadstart', function(){
                me.getMapModule().loadingState(oskariLayer.getId(), true);
            });

            source.on('imageloadend', function() {
                me.getMapModule().loadingState(oskariLayer.getId(), false);
            });

            source.on('imageloaderror', function() {
                me.getMapModule().loadingState(oskariLayer.getId(), null, true );
            });
        
       }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
