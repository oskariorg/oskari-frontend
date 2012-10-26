
Oskari.clazz.define('Oskari.mapframework.bundle.layerselector2.model.LayerGroup', 

/**
 * @method create called automatically on construction
 * @static
 */
function(title) {
    this.name = title; 
    this.layers = [];
    this.searchIndex = {};
}, {
    /**
     * @method setId 
     * @param {String} value
     */
    setTitle : function(value) {
        this.name = value;
    },
    /**
     * @method getTitle 
     * @return {String}
     */
    getTitle : function() {
        return this.name;
    },
    /**
     * @method addLayer 
     * @param {Layer} layer
     */
    addLayer : function(layer) {
        this.layers.push(layer);
        this.searchIndex[layer.getId()] = this._getSearchIndex(layer);
    },
    /**
     * @method getLayers 
     * @return {Layer[]}
     */
    getLayers : function() {
        return this.layers;
    },
    _getSearchIndex : function(layer) {
        var val = layer.getName().toLowerCase() +  ' ' + 
            layer.getInspireName().toLowerCase() +  ' ' +
            layer.getOrganizationName().toLowerCase();
        return val;
    },
    matchesKeyword : function(layerId, keyword) {
        var searchableIndex = this.searchIndex[layerId];
        return searchableIndex.indexOf(keyword) != -1;
    }
});
