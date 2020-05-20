import olLayerImage from 'ol/layer/Image';
import olSourceImageWMS from 'ol/source/ImageWMS';
import { getZoomLevelHelper } from '../../mapmodule/util/scale';

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
    function (config) {
        this._config = config;
    }, {
        _clazz: 'Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin',
        __name: 'MyPlacesLayerPlugin',
        /** @static @property layertype type of layers this plugin handles */
        layertype: 'myplaces',

        getLayerTypeSelector: function () {
            return this.layertype;
        },
        /**
         * Interface method for the module protocol.
         * @private @method _initImpl
         */
        _initImpl: function () {
            const layerClass = 'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer';
            const modelBuilderClass = 'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder';
            const layerModelBuilder = Oskari.clazz.create(modelBuilderClass, this.getSandbox());

            const wfsPlugin = this.getMapModule().getLayerPlugins('wfs');
            if (typeof wfsPlugin.registerLayerType === 'function') {
                // Let wfs plugin handle this layertype
                const me = this;
                const eventHandlers = {
                    'MyPlaces.MyPlacesChangedEvent': event => {
                        wfsPlugin.refreshLayersOfType(me.layertype);
                    }
                };
                wfsPlugin.registerLayerType(this.layertype, layerClass, layerModelBuilder, eventHandlers);
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
         * Adds a single MyPlaces layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var map = this.getMapModule();
            var openlayer = new olLayerImage({
                source: new olSourceImageWMS({
                    url: layer.getWmsUrl(),
                    params: {
                        'LAYERS': layer.getWmsName(),
                        'FORMAT': 'image/png',
                        // Avoid AxisOrder issues by not using WMS 1.3.0
                        'VERSION': '1.1.1'
                    },
                    crossOrigin: layer.getAttributes('crossOrigin')
                }),
                visible: layer.isInScale(map.getMapScale()) && layer.isVisible(),
                opacity: layer.getOpacity() / 100

            });
            const zoomLevelHelper = getZoomLevelHelper(map.getScaleArray());
            // Set min max zoom levels that layer should be visible in
            zoomLevelHelper.setOLZoomLimits(openlayer, layer.getMinScale(), layer.getMaxScale());

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
