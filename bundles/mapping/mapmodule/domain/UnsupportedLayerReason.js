export class UnsupportedLayerReason {
    constructor (id, severity) {
        this._id = id || 'default';
        this._severity = severity || UnsupportedLayerReason.WARNING;
    }
    setId (id) {
        this._id = id;
    }
    getId () {
        return this._id;
    }
    setSeverity (level) {
        this._severity = level;
    }
    getSeverity () {
        return this._severity;
    }
    setDescription (desc) {
        this._description = desc;
    }
    getDescription () {
        if (!this._description) {
            this._description = Oskari.getMsg('MapModule', 'unsupported-layer');
        }
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
    setLayerCheckFunction (check) {
        this._layerCheck = check;
    }
    /**
     * @method isLayerSupported     *
     * For checking wether layer is supported in current map view or not.
     * @return function that receives layer as param and should return boolean or `UnsupportedLayerReason` if layer is not supported.
     */
    getLayerCheckFunction () {
        if (!this._layerCheck) {
            this._layerCheck = () => true;
        }
        return this._layerCheck;
    }
}

// Severity levels
UnsupportedLayerReason.INFO = 10;
UnsupportedLayerReason.WARNING = 100;
UnsupportedLayerReason.FATAL = 1000;

Oskari.clazz.defineES('Oskari.mapframework.domain.UnsupportedLayerReason', UnsupportedLayerReason);
