/**
 * @class Oskari.framework.core.Core.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari core as they were in
 * the class itself.
 * @deprecated
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-layer-methods', {

    /**
     *
     * @deprecated 
     */
    findBaselayerBySublayerIdFromAllAvailable : function(sublayerid) {
        var layer = null;
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var mapLayers = mapLayerService.getAllLayers();
        for (var i = 0; i < mapLayers.length; i++) {
            if (mapLayers[i].isBaseLayer()) {
                for (var j = 0; j < mapLayers[i].getSubLayers().length; j++) {
                    var sublayer = mapLayers[i].getSubLayers()[j];
                    if (sublayer.getId() == sublayerid) {
                        layer = mapLayers[i];
                        break;
                    }
                }
            }
            if (layer != null) {
                break;
            }
        }
        return layer;
    },
    
    /**
     * Destroy all Highlighted layers
     * @deprecated
     */
    _destroyAllHighLightedMapLayers : function() {
        var highlightedMapLayers = this.getAllHighlightedMapLayers();
        for (var i = 0; i < highlightedMapLayers.length; i++) {
            var mapLayer = highlightedMapLayers[i];
            // Notify that dim has occured
            var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
            this.dispatch(event);
        }

        this._mapLayersHighlighted = [];
    }
});
