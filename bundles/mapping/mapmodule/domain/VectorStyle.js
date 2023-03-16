import { Style } from './style';
import { VECTOR_STYLE } from './constants';
export const DEFAULT_STYLE_NAME = 'default';

export const createDefaultStyle = () => {
    const style = {
        id: -1,
        name: DEFAULT_STYLE_NAME,
        type: VECTOR_STYLE.OSKARI
    };
    return new VectorStyle(style);
};

// constructor like function for layer options styles (oskari styles only)
export const parseStylesFromOptions = (options) => {
    const { styles = {} } = options || {};
    return Object.keys(styles).map(id => {
        const { title, ...style } = styles[id];
        return new VectorStyle({ id, type: VECTOR_STYLE.OSKARI, style, name: title });
    });
};

export class VectorStyle extends Style {
    constructor ({ id, name, style, type }) {
        super(id, name); // name, title
        this._type = type;
        this._styleDef = style || {};
    }

    /* override */
    getLegend () {
        return null;
    }

    /* override */
    getTitle () {
        const title = super.getTitle();
        if (typeof title === 'undefined' || title === DEFAULT_STYLE_NAME) {
            return Oskari.getMsg('MapModule', 'styles.defaultTitle');
        }
        return title;
    }

    getType () {
        return this._type;
    }

    // backend stored styles have number id (long)
    isRuntimeStyle () {
        return typeof this.getName() === 'string';
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
