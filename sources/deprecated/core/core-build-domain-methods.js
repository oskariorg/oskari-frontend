/**
 * @class Oskari.mapframework.core.Core.domainMethods
 *
 * This category class adds domain object methods to Oskari core as they were in
 * the class itself.
 * @deprecated
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'build-domain-methods', {

    /**
     * @method createMapLayerDomain
     * Creates maplayer domain objects from given JSON and adds
     * them to Oskari.mapframework.service.MapLayerService
     *
     * @param {Object[]} allLayersJson JSON array presentation of map layers
     * @deprecated
     */
    _createMapLayerDomain : function(allLayersJson) {
        if (!allLayersJson || !allLayersJson.layers) {
            return;
        }

        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var allLayers = allLayersJson.layers;
        for (var i = 0; i < allLayers.length; i++) {
            var mapLayer = mapLayerService.createMapLayer(allLayers[i]);
            mapLayerService.addLayer(mapLayer, true);
        }
    }
});
