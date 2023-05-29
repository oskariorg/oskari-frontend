import './BingMapsLayer';

import olSourceBingMaps from 'ol/source/BingMaps';
import olLayerTile from 'ol/layer/Tile';
import { BingMapsLayerModelBuilder } from './BingMapsLayerModelBuilder';
import { getZoomLevelHelper } from '../../util/scale';

const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');
const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

class BingMapsLayerPlugin extends AbstractMapLayerPlugin {
    constructor (config) {
        super(config);
        this.__name = 'BingMapsLayerPlugin';
        this._clazz = 'Oskari.mapframework.mapmodule.BingMapsLayerPlugin';
        this.layertype = 'bingmaps';
    }
    /**
     * @private @method _initImpl
     * Interface method for the module protocol.
     */
    _initImpl () {
        // register domain builder
        const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            const composingModel = new LayerComposingModel([
                LayerComposingModel.API_KEY,
                LayerComposingModel.SRS
            ]);
            mapLayerService.registerLayerModel(this.layertype + 'layer', this._getLayerModelClass(), composingModel);
            mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', this._getModelBuilder());
        }
    }
    /**
     * @private @method _getLayerModelClass
     * Returns class to be used as mapLayerService layer model
     */
    _getLayerModelClass () {
        return 'Oskari.mapframework.mapmodule.BingMapsLayer';
    }
    /**
     * @private @method _getModelBuilder
     * Returns object to be used as mapLayerService layer model builder
     */
    _getModelBuilder () {
        return new BingMapsLayerModelBuilder();
    }
    /**
     * @private @method _createPluginEventHandlers
     * Called by superclass to create event handlers
     */
    _createPluginEventHandlers () {
        return {
            AfterChangeMapLayerStyleEvent (event) {
                this._updateLayerStyle(event.getMapLayer());
            }
        };
    }
    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.mapmodule.BingMapsLayer} oskariLayer
     */
    _updateLayerStyle (oskariLayer) {
        const olLayers = this.getOLMapLayers(oskariLayer) || [];
        if (!olLayers.length) {
            return;
        }
        const mapmodule = this.getMapModule();
        const lyrWithOldSource = olLayers[0];
        const lyrIndex = mapmodule.getMap().getLayers().getArray().indexOf(lyrWithOldSource);
        // Create a new layer with the selected style and replace the old one.
        const lyrWithNewSource = this._createOlLayer(oskariLayer);
        mapmodule.getMap().getLayers().insertAt(lyrIndex + 1, lyrWithNewSource);
        this.setOLMapLayers(oskariLayer.getId(), lyrWithNewSource);
        // Keep the old layer in the background till the new layer has had time to load.
        const removeOldLyrTimeout = 3000;
        setTimeout(() => {
            mapmodule.getMap().removeLayer(lyrWithOldSource);
        }, removeOldLyrTimeout);
    }
    /**
     * Checks if the layer can be handled by this plugin
     * @method  isLayerSupported
     * @param  {Oskari.mapframework.domain.AbstractLayer} layer
     * @return {Boolean}       true if this plugin handles the type of layers
     */
    isLayerSupported (layer) {
        if (!layer) {
            return false;
        }
        return layer.isLayerOfType(this.layertype);
    }
    /**
     * @method addMapLayerToMap
     * @private
     * @param {Oskari.mapframework.domain.BingMapsLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        const bingMapsLayer = this._createOlLayer(layer);
        this.getMapModule().addLayer(bingMapsLayer, !keepLayerOnTop);
        this.setOLMapLayers(layer.getId(), bingMapsLayer);
    }

    /**
     * @private
     * @method _createOlLayer Creates a new ol.layer.Tile layer with a Bing Maps source
     * @param {Oskari.mapframework.domain.BingMapsLayer} layer
     */
    _createOlLayer (layer) {
        const bingMapsLayer = new olLayerTile({
            opacity: layer.getOpacity() / 100,
            source: this._createSource(layer)
        });
        const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
        // Set min max zoom levels that layer should be visible in
        zoomLevelHelper.setOLZoomLimits(bingMapsLayer, layer.getMinScale(), layer.getMaxScale());
        return bingMapsLayer;
    }

    _createSource (oskariLayer) {
        const style = oskariLayer.getCurrentStyle();
        const opts = {
            key: oskariLayer.getApiKey(),
            imagerySet: style ? style.getName() : 'RoadOnDemand',
            maxZoom: 19
        };
        return new olSourceBingMaps(opts);
    }
    /**
     * Called when layer details are updated (for example by the admin functionality)
     * @param {Oskari.mapframework.domain.AbstractLayer} layer new layer details
     */
    _updateLayer (layer) {
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
}

Oskari.clazz.defineES('Oskari.mapframework.mapmodule.BingMapsLayerPlugin', BingMapsLayerPlugin,
    {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);

export { BingMapsLayerPlugin };
