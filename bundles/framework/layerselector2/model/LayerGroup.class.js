export class LayerGroup {
    constructor (title) {
        this.name = title;
        this.layers = [];
        this.searchIndex = {};
        this.tools = [];
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
     * @method addTool
     * @param {Oskari.mapframework.domain.Tool} tool
     */
    setTools (tools) {
        this.tools = tools;
    }

    getTools () {
        return this.tools;
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
    clone () {
        const clone = new LayerGroup(this.name);
        clone.layers = [...this.layers];
        clone.searchIndex = { ...this.searchIndex };
        clone.tools = [ ...this.tools ];
        return clone;
    }
};
