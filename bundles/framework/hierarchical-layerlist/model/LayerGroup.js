Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup',

/**
 * @method create called automatically on construction
 * @static
 */

function (group, mapLayerService) {
    //FIXME: Get locale from somewhere?
    this.name = group.name.fi;
    this.id = group.id;
    this.layers = [];
    var me =this;
    this.searchIndex = {};
    group.layers.forEach(function(layer){
        me.addLayer(mapLayerService.createMapLayer(layer));
    });
}, {
    /**
     * @method setId
     * @param {String} value
     */
    setTitle: function (value) {
        this.name = value;
    },
    /**
     * @method getTitle
     * @return {String}
     */
    getTitle: function () {
        return this.name;
    },
    /**
     * @method setId
     * @param {String} value
     */
    setId: function (value) {
        this.id = value;
    },
    /**
     * @method getId
     * @return {String}
     */
    getId: function () {
        return this.id;
    },
    /**
     * @method addLayer
     * @param {Layer} layer
     */
    addLayer: function (layer) {
        if(layer && layer.getId() !== null) {
            this.layers.push(layer);
            this.searchIndex[layer.getId()] = this._getSearchIndex(layer);
        }
    },
    /**
     * @method getLayers
     * @return {Layer[]}
     */
    getLayers: function () {
        return this.layers;
    },
    _getSearchIndex: function (layer) {
        var val = layer.getName() + ' ' +
            layer.getInspireName() + ' ' +
            layer.getOrganizationName();
        // TODO: maybe filter out undefined texts
        return val.toLowerCase();
    },
    matchesKeyword: function (layerId, keyword) {
        var searchableIndex = this.searchIndex[layerId];
        return searchableIndex.indexOf(keyword.toLowerCase()) !== -1;
    }
});
