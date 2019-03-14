export class LayerGroup {
    constructor (title) {
        this.name = title;
        this.layers = [];
        this.searchIndex = {};
    }
    /**
     * @method setId
     * @param {String} name
     */
    setTitle (name) {
        this.name = name;
    }
    /**
     * @method getTitle
     * @return {String}
     */
    getTitle () {
        return this.name;
    }
    /**
     * @method addLayer
     * @param {Layer} layer
     */
    addLayer (layer) {
        this.layers.push(layer);
        this.searchIndex[layer.getId()] = this._getSearchIndex(layer);
    }
    /**
     * @method getLayers
     * @return {Layer[]}
     */
    getLayers () {
        return this.layers;
    }
    _getSearchIndex (layer) {
        var val = layer.getName() + ' ' +
            layer.getInspireName() + ' ' +
            layer.getOrganizationName();
        // TODO: maybe filter out undefined texts
        return val.toLowerCase();
    }
    matchesKeyword (layerId, keyword) {
        var searchableIndex = this.searchIndex[layerId];
        return searchableIndex.indexOf(keyword.toLowerCase()) !== -1;
    }
};