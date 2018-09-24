/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.VectorTileLayerPlugin',

    /**
     * @static @method create called automatically on construction
     */
    function () {
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
                    'vectortilelayer',
                    'Oskari.mapframework.domain.VectorTileLayer'
                );
                this._extendCesium3DTileset();
            }
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
