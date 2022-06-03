export class Tool {
    constructor (name, component) {
        this._name = name;
        this._component = component;
        this._callback = () => {};
        this._tooltip = null;
        this._types = [];
    }

    getName () {
        return this._name;
    }

    setName (name) {
        this._name = name;
    }

    getComponent () {
        return this._component;
    }

    setComponent (component) {
        this._component = component;
    }

    getTooltip () {
        return this._tooltip;
    }

    setTooltip (tooltip) {
        this._tooltip = tooltip;
    }

    getCallback () {
        return this._callback;
    }

    setCallback (callback) {
        this._callback = callback;
    }

    getTypes () {
        return this._types;
    }

    setTypes (types) {
        this._types = types;
    }
}
