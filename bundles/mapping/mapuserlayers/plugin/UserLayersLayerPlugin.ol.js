import olLayerImage from 'ol/layer/Image';
import olSourceImageWMS from 'ol/source/ImageWMS';
import { getZoomLevelHelper } from '../../mapmodule/util/scale';

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
    function (config) {
        this._config = config;
        this._log = Oskari.log(this.getName());
    }, {
        __name: 'UserLayersLayerPlugin',
        _clazz: 'Oskari.mapframework.bundle.myplacesimport.plugin.UserLayersLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype: 'userlayer',

        getLayerTypeSelector: function () {
            return this.layertype;
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            const layerClass = 'Oskari.mapframework.bundle.myplacesimport.domain.UserLayer';
            const { clusteringDistance } = this._config;
            const modelBuilderClass = 'Oskari.mapframework.bundle.myplacesimport.domain.UserLayerModelBuilder';
            const layerModelBuilder = Oskari.clazz.create(modelBuilderClass, this.getSandbox(), clusteringDistance);

            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            if (typeof wfsPlugin.registerLayerType === 'function') {
                // Let wfs plugin handle this layertype
                wfsPlugin.registerLayerType(this.layertype, layerClass, layerModelBuilder);
                this.unregister();
                return;
            }
            // register domain builder
            const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (!mapLayerService) {
                return;
            }
            mapLayerService.registerLayerModel(this.layertype, layerClass);
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);
        },

        /**
         * Adds a single user layer to the map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapuserlayer.domain.Userlayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this;
            // assume layer id is userlayer_[actual id]
            var layerId = layer.getId().split('_').pop();
            var imgUrl = (layer.getLayerUrls()[0] + layerId).replace(/&amp;/g, '&');

            var map = this.getMapModule();
            var model = {
                source: new olSourceImageWMS({
                    url: imgUrl,
                    params: {
                        'LAYERS': layer.getRenderingElement(),
                        'FORMAT': 'image/png',
                        // Avoid AxisOrder issues by not using WMS 1.3.0
                        'VERSION': '1.1.1'
                    },
                    crossOrigin: layer.getAttributes('crossOrigin')
                }),
                visible: layer.isInScale(map.getMapScale()) && layer.isVisible(),
                opacity: layer.getOpacity() / 100
            };
            var openlayer = new olLayerImage(model);
            const zoomLevelHelper = getZoomLevelHelper(map.getScaleArray());
            // Set min max zoom levels that layer should be visible in
            zoomLevelHelper.setOLZoomLimits(openlayer, layer.getMinScale(), layer.getMaxScale());

            me._registerLayerEvents(openlayer, layer);
            map.addLayer(openlayer, !keepLayerOnTop);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openlayer);

            me._log.debug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for UserLayer ' +
                layer.getId()
            );
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function (layer, oskariLayer) {
            const mapModule = this.getMapModule();
            const source = layer.getSource();
            const layerId = oskariLayer.getId();

            source.on('imageloadstart', function () {
                mapModule.loadingState(layerId, true);
            });

            source.on('imageloadend', function () {
                mapModule.loadingState(layerId, false);
            });

            source.on('imageloaderror', function () {
                mapModule.loadingState(layerId, null, true);
            });
        },
        /**
         * Called when layer details are updated (for example by the admin functionality)
         * @param {Oskari.mapframework.domain.AbstractLayer} layer new layer details
         */
        _updateLayer: function (layer) {
            if (!this.isLayerSupported(layer)) {
                return;
            }
            const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
            const layersImpls = this.getOLMapLayers(layer.getId()) || [];
            layersImpls.forEach(olLayer => {
                // Update min max Resolutions
                zoomLevelHelper.setOLZoomLimits(olLayer, layer.getMinScale(), layer.getMaxScale());
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
