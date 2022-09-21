export class LayerGroup {
    constructor (id, groupMethod, title, description, parentId, groups) {
        this.id = id;
        this.groupMethod = groupMethod;
        this.name = title;
        this.description = description;
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
    setDescription (description) {
        this.description = description;
    }
    getDescription () {
        return this.description;
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
    getLayerCount () {
        return this.getGroups().reduce((prev, cur) => {
            return prev + cur.getLayerCount();
        }, this.layers.length);
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
        const searchableIndex = this.searchIndex[layerId];
        let terms = keyword;
        if (!Array.isArray(terms)) {
            terms = [terms];
        }
        return terms.every(key => searchableIndex.indexOf(key.toLowerCase()) !== -1);
    }
    clone () {
        const clone = new LayerGroup(this.id, this.groupMethod, this.name, this.description, this.parentId);
        clone.layers = [...this.layers];
        clone.groups = [...this.groups];
        clone.searchIndex = { ...this.searchIndex };
        clone.tools = [...this.tools];
        return clone;
    }
};
