export class LayerGroup {
    constructor (id, groupMethod, title, parentId, groups) {
        this.id = id;
        this.groupMethod = groupMethod;
        this.name = title;
        this.layers = [];
        this.parentId = parentId || null;
        this.groups = groups || [];
        this.searchIndex = {};
        this.tools = [];
    }

    getParentId () {
        return this.parentId;
    }
    setParentId (parentId) {
        this.parentId = parentId;
    }
    getGroups () {
        return this.groups;
    }
    setGroups (newGroups) {
        this.groups = newGroups;
    }
    /**
     * @method getId
     * @return {String}
     */
    getId () {
        return this.id;
    }
    /**
     * @return {Boolean}
     */
    isEditable () {
        return this.id > 0;
    }
    /**
     * @method getGroupMethod
     * @return {String}
     */
    getGroupMethod () {
        return this.groupMethod;
    }
    /**
     * @method setTitle
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
        return this.name || '';
    }
    /**
     * @method addLayer
     * @param {Layer} layer
     */
    addLayer (layer) {
        if (this.searchIndex[layer.getId()]) {
            // Tried adding the same layer again
            return;
        }
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
    setLayers (newLayers = []) {
        this.layers = [];
        this.searchIndex = {};
        newLayers.forEach(layer => this.addLayer(layer));
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
        const clone = new LayerGroup(this.id, this.groupMethod, this.name);
        clone.layers = [...this.layers];
        clone.groups = [...this.groups];
        clone.searchIndex = { ...this.searchIndex };
        clone.tools = [...this.tools];
        return clone;
    }
};
