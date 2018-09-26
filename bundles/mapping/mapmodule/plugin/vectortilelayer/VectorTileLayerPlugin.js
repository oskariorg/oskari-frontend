import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createDefaultStyle } from 'ol/style/Style';

import VectorTileModelBuilder from './VectorTileModelBuilder';
import VectorTileLayer from './VectorTileLayer';
import styleGenerator from './styleGenerator';

const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');
const layertype = 'vectortile';

/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
Oskari.clazz.defineES('Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
class VectorTileLayerPlugin extends AbstractMapLayerPlugin {
    constructor(config) {
        super(config);
        this.__name = 'VectorTileLayerPlugin';
        this._clazz = 'Oskari.mapframework.mapmodule.VectorTileLayerPlugin';
    }
    /**
     * @private @method _initImpl
     * Interface method for the module protocol.
     */
    _initImpl() {
        // register domain builder
        const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            mapLayerService.registerLayerModel(layertype + 'layer', VectorTileLayer);
            mapLayerService.registerLayerModelBuilder(layertype + 'layer', new VectorTileModelBuilder());
        }
    }
    /**
     * @private @method _createPluginEventHandlers
     * Called by superclass to create event handlers
     */
    _createPluginEventHandlers() {
        return {
            AfterChangeMapLayerStyleEvent(event) {
                const oskariLayer = event.getMapLayer();
                const olLayers = this.getOLMapLayers(oskariLayer);

                if (olLayers && olLayers.length > 0) {
                    olLayers[0].setStyle(this._getLayerCurrentStyleFunction(oskariLayer));
                }
            }
        };
    }
    /**
     * @private @method _getLayerCurrentStyleFunction
     * Returns OL style corresponding to layer currently selected style
     * @param {Oskari.mapframework.domain.AbstractLayer} layer
     * @return {ol/style/Style}
     */
    _getLayerCurrentStyleFunction(layer) {
        const styleDef = layer.getCurrentStyleDef();
        return styleDef ? styleGenerator(this.mapModule.getStyle.bind(this.mapModule), styleDef) : createDefaultStyle;
    }
    /**
     * Checks if the layer can be handled by this plugin
     * @method  isLayerSupported
     * @param  {Oskari.mapframework.domain.AbstractLayer} layer
     * @return {Boolean}       true if this plugin handles the type of layers
     */
    isLayerSupported(layer) {
        if (!layer) {
            return false;
        }
        return layer.isLayerOfType(layertype);
    }
    /**
     * @method addMapLayerToMap
     * @private
     * Adds a single vector tile layer to this map
     * @param {Oskari.mapframework.domain.VectorTileLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap(layer, keepLayerOnTop, isBaseMap) {
        const options = layer.getOptions();
        const sourceOpts = {
            format: new olFormatMVT(),
            url: layer.getLayerUrl().replace('{epsg}', this.mapModule.getProjection())
        };
        if (options.tileGrid) {
            sourceOpts.tileGrid = new TileGrid(options.tileGrid);
        }
        const vectorTileLayer = new olLayerVectorTile({
            opacity: layer.getOpacity() / 100,
            renderMode: 'hybrid',
            source: new olSourceVectorTile(sourceOpts),
            style: this._getLayerCurrentStyleFunction(layer)
        });

        this.mapModule.addLayer(vectorTileLayer, !keepLayerOnTop);
        this.setOLMapLayers(layer.getId(), vectorTileLayer);
    }
}, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
