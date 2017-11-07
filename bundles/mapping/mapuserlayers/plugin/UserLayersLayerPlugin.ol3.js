/**
 * @class Oskari.mapframework.bundle.myplacesimport.plugin.MyLayersLayerPlugin
 * Provides functionality to draw user layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
    }, {
        __name : 'UserLayersLayerPlugin',
        _clazz : 'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype : 'userlayer',

        getLayerTypeSelector : function() {
            return this.layertype;
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (!mapLayerService) {
                return;
            }

            mapLayerService.registerLayerModel(this.layertype,
                'Oskari.mapframework.bundle.myplacesimport.domain.UserLayer');

            var layerModelBuilder = Oskari.clazz.create(
                'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder',
                this.getSandbox()
            );
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);
        },

        /**
         * Adds a single user layer to the map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.Userlayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this;
            var layerId = _.last(layer.getId().split('_'));
            var imgUrl = (layer.getLayerUrls()[0] + layerId).replace(/&amp;/g, '&');

            var sandbox = this.getSandbox();
            var map = this.getMapModule();
            var model = {
                source: new ol.source.ImageWMS({
                    url: imgUrl,
                    params: {
                        'LAYERS': layer.getRenderingElement(),
                        'FORMAT': 'image/png'
                    },
                    crossOrigin : layer.getAttributes('crossOrigin')
                }),
                visible: layer.isInScale(map.getMapScale()) && layer.isVisible(),
                opacity: layer.getOpacity() / 100
            };
            //minresolution === maxscale and vice versa...
            if(layer.getMaxScale() && layer.getMaxScale() !== -1) {
                model.minResolution = map.getResolutionForScale(layer.getMaxScale());
            }
            if(layer.getMinScale() && layer.getMinScale() !== -1) {
                var maxResolution = map.getResolutionForScale(layer.getMinScale());
                if(maxResolution !== map.getResolutionArray()[0]) {
                    // ol3 maxReso is exclusive so don't set if it's the map max resolution
                    model.maxResolution = maxResolution;
                }
            }

            var openlayer = new ol.layer.Image(model);
            me._registerLayerEvents(openlayer, layer);
            map.addLayer(openlayer, !keepLayerOnTop);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for UserLayer ' +
                layer.getId()
            );
            //move and zoom map to layer extent
            sandbox.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest',[layer.getId(), true]);
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function(layer, oskariLayer){
            var me = this;
            var source = layer.getSource();

            source.on('imageloadstart', function() {
                me.getMapModule().loadingState( oskariLayer.getId(), true);
            });

            source.on('imageloadend', function() {
                me.getMapModule().loadingState( oskariLayer.getId(), false);
            });

            source.on('imageloaderror', function() {
                me.getMapModule().loadingState( oskariLayer.getId(), null, true );
            });
        }

    }, {
        'extend': ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
