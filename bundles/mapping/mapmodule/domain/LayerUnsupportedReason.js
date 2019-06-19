export class LayerUnsupportedReason {
    constructor (description, actionText, action) {
        this._description = description || Oskari.getMsg('MapModule', 'unsupported-layer');
        this._actionText = actionText;
        this._action = action;
    }
    setDescription (desc) {
        this._description = desc;
    }
    getDescription () {
        return this._description;
    }
    setAction (action) {
        this._action = action;
    }
    getAction () {
        return this._action;
    }
    setActionText (text) {
        this._actionText = text;
    }
    getActionText () {
        return this._actionText;
    }
}
Oskari.clazz.defineES('Oskari.mapframework.domain.LayerUnsupportedReason', LayerUnsupportedReason);

export const SRS = 'srs';
