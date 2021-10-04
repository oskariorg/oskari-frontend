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
