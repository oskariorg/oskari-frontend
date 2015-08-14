/**
 * @class Oskari.mapframework.sandbox.Sandbox.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari sandbox as they
 * were in the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'map-layer-methods', {
    
    /**
     * @method findMapLayerFromAllAvailable
     * Finds map layer from all available. Uses Oskari.mapframework.service.MapLayerService.
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromAllAvailable : function(id) {
        var layer = this._core.findMapLayerFromAllAvailable(id);
        return layer;
    },

    /**
     * @method findAllSelectedMapLayers
     * Returns all currently selected map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    findAllSelectedMapLayers : function() {
        var layersList = this._core.getAllSelectedLayers();
        // copy the array so changing it wont change the core data
        return layersList.slice(0);
    },

    /**
     * @method findMapLayerFromSelectedMapLayers
     * Returns the layer domain object matching the id if it is added to map
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromSelectedMapLayers : function(layerId) {
        var layer = this._core.findMapLayerFromSelectedMapLayers(layerId);
        return layer;
    },

    /**
     * @method isLayerAlreadySelected
     * Checks if the layer matching the id is added to map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is added to map
     */
    isLayerAlreadySelected : function(id) {
        return this._core.isLayerAlreadySelected(id);
    },

    /**
     * @method findAllHighlightedLayers
     * Returns all currently highlighted map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    findAllHighlightedLayers : function() {
        var layer = this._core.getAllHighlightedMapLayers();
        return layer;
    },

    /**
     * @method isMapLayerHighLighted
     * Checks if the layer matching the id is highlighted on the map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is highlighted
     */
    isMapLayerHighLighted : function(id) {
        var highlighted = this.findAllHighlightedLayers();
        for (var i = 0; i < highlighted.length; i++) {
            if (highlighted[i].getId() == id) {
                return true;
            }
        }
        return false;
    },

    /**
     * @method allowMultipleHighlightLayers
     * Allow multiple layers to be highlighted at once
     *
     * @param {Boolean} allow - true to allow, false to restrict to one highlight at a time
     */
    allowMultipleHighlightLayers : function(allow) {
        this._core.allowMultipleHighlightLayers(allow);
    }
});
