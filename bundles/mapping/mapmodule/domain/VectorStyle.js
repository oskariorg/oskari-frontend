import { Style } from './style';
import { VECTOR_STYLE } from './constants';
export const DEFAULT_STYLE_NAME = 'default';
export const RUNTIME_PREFIX = 's_';

export const createDefaultStyle = (name) => {
    const style = {
        id: name || DEFAULT_STYLE_NAME,
        type: VECTOR_STYLE.OSKARI
    };
    return new VectorStyle(style);
};

export class VectorStyle extends Style {
    constructor ({ id, name: title, style, type }) {
        const name = id.toString();
        super(name, title);
        this._type = type || VECTOR_STYLE.OSKARI;
        this._styleDef = style || {};
    }

    /* override */
    getLegend () {
        return null;
    }

    /* override */
    getTitle () {
        const title = super.getTitle();
        if (!title || title === DEFAULT_STYLE_NAME) {
            return Oskari.getMsg('MapModule', 'styles.defaultTitle');
        }
        return title;
    }

    getType () {
        return this._type;
    }

    isRuntimeStyle () {
        const name = this.getName() || '';
        return name.startsWith(RUNTIME_PREFIX);
    }

    hasDefinitions () {
        return Object.keys(this.getFeatureStyle()).length > 0 ||
            this.getOptionalStyles().length > 0;
    }

    getFeatureStyle () {
        if (this.getType() === VECTOR_STYLE.OSKARI) {
            return this._styleDef.featureStyle || {};
        }
        return this._styleDef;
    }

    getOptionalStyles () {
        if (this.getType() === VECTOR_STYLE.OSKARI) {
            return this._styleDef.optionalStyles || [];
        }
        // only oskari style has optional styles
        return [];
    }

    setStyleDef (styleDef) {
        this._styleDef = styleDef;
    }
}
