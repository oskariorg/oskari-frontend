import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';

/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.VectorTileLayerPlugin',

    /**
     * @static @method create called automatically on construction
     */
    function () {
        console.log('plugin start!');
    },
    {
        __name: 'VectorTileLayerPlugin',
        _clazz: 'Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
        layertype: 'vectortile',

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'vectortile',
                    'Oskari.mapframework.domain.VectorTileLayer'
                );
            }
        },
        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported: function (layer) {
            if (!layer) {
                return false;
            }
            return layer.isLayerOfType(this.layertype);
        },
        /**
         * @method addMapLayerToMap
         * @private
         * Adds a single vector tile layer to this map
         * @param {Oskari.mapframework.domain.VectorTileLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var options = layer.getOptions();
            var sourceOpts = {
                format: new olFormatMVT(),
                url: layer.getLayerUrl()
            };
            if(options.tileGrid) {
                sourceOpts.tileGrid = new TileGrid(options.tileGrid);
            }
            var vectorTileLayer = new olLayerVectorTile({
                opacity: layer.getOpacity() / 100,
                renderMode: 'hybrid',
                source: new olSourceVectorTile(sourceOpts)
            });

            this.mapModule.addLayer(vectorTileLayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), vectorTileLayer);
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin']
    }
);
