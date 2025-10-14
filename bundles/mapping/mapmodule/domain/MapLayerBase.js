export class MapLayerBase {
    constructor (id, type, name = 'N/A', created) {
        if (!id || !type) {
            throw new Error('Layer requires an id and type');
        }
        this.id = id;
        this.type = type;
        this.name = name;
        this.created = created;
        this.updated = null;
        this.metadataUuid = null;
        this.dataproviderId = null;
        this.layerType = null;
        this.groups = [];
        this._initialData = [...arguments];
    }

    /*
    static from ({ id, type, name, created, ...json }) {
        return Object.assign(new MapLayerBase(id, type, name, created), json);
    }
*/
    updateData ({ id, type, created, ...json }) {
        Object.assign(this, json);
    }

    getId () {
        return this.id;
    }

    getName () {
        return this.name;
    }

    getType () {
        return this.type;
    }

    addGroup (groupId) {
        this.groups = new Set([...this.groups, groupId]);
    }

    // can change at runtime
    setName (name) {
        this.name = name;
    }
}
