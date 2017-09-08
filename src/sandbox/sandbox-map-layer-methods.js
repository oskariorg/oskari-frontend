/**
 * @class Oskari.Sandbox.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari sandbox as they
 * were in the class itself.
 */
Oskari.clazz.category('Oskari.Sandbox', 'map-layer-methods', {

    /**
     * @method findMapLayerFromAllAvailable
     * Finds map layer from all available. Uses Oskari.mapframework.service.MapLayerService.
     *
     * @param {String} id of the layer to get. If id is null, name is used to search the layer.
     * @param {String} name of the layer to get. Only used if id = null.
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromAllAvailable: function (id, name) {
        return this.getService('Oskari.mapframework.service.MapLayerService').findMapLayer(id);
    },

    /**
     * @method findAllSelectedMapLayers
     * Returns all currently selected map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    findAllSelectedMapLayers: function () {
        var layersList = this.getMap().getLayers();
        // copy the array so changing it wont change the core data
        return layersList.slice(0);
    },
    /**
     * @method findAllHighlightedLayers
     * Returns all currently highlighted map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    findAllHighlightedLayers: function () {
        var layersList = this.getMap().getActivatedLayers();
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
    findMapLayerFromSelectedMapLayers: function (layerId) {
        return this.getMap().getSelectedLayer(layerId);
    },

    /**
     * @method isLayerAlreadySelected
     * Checks if the layer matching the id is added to map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is added to map
     */
    isLayerAlreadySelected: function (id) {
        return this.getMap().isLayerSelected(id);
    },

    /**
     * @method isMapLayerHighLighted
     * Checks if the layer matching the id is highlighted on the map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is highlighted
     */
    isMapLayerHighLighted: function (id) {
        return this.getMap().isLayerActivated(id);
    },

    /**
     * @method allowMultipleHighlightLayers
     * Allow multiple layers to be highlighted at once
     *
     * @param {Boolean} allow - true to allow, false to restrict to one highlight at a time
     */
    allowMultipleHighlightLayers: function (allow) {
        this.getMap().allowMultipleActivatedLayers(allow);
    },

    /**
     * Calls the core to remove the map layer.
     *
     * @method removeMapLayer
     * @param  {String/Number} layerId
     * @return {undefined}
     */
    removeMapLayer: function (layerId) {
        this.getMap().removeLayer(layerId);
    }
});
