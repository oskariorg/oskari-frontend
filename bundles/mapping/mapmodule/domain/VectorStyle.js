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

export class VectorStyle extends Style {
    constructor ({ id, name, style, type, isRuntime }) {
        super(id, name); // name, title
        this._type = type;
        this._styleDef = style || {};
        this._isRuntime = isRuntime;
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

    isRuntimeStyle () {
        return this._isRuntime === true;
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

    /* deprecated */
    parseStyleFromOptions (styleDef) {
        if (!styleDef) {
            return;
        }
        if (this.getType() !== VECTOR_STYLE.OSKARI) {
            this.setStyleDef({ ...styleDef });
            return;
        }
        // Parse Oskari style to fetureStyle and optionalStyles
        let { featureStyle = {}, optionalStyles = [], title } = styleDef;
        // Bypass possible layer definitions
        Object.keys(styleDef).forEach(key => {
            const val = styleDef[key];
            if (val.hasOwnProperty('featureStyle')) {
                featureStyle = val.featureStyle;
            }
            if (val.hasOwnProperty('optionalStyles')) {
                optionalStyles = val.optionalStyles;
            }
            if (val.hasOwnProperty('title')) {
                title = val.title;
            }
            // 3D-layers have not required featureStyle it since there hasn't been hover styles implemented yet
            //  - backwards compatibility == featureStyle is NOT REQUIRED as part of the style
            //  - consistency == style definitions ARE STORED/USED to/from featureStyle so we can use the visual style editor for WFS and 3D
            switch (key) {
            case 'fill':
                featureStyle.fill = val;
                break;
            case 'stroke':
                featureStyle.stroke = val;
                break;
            case 'image':
                featureStyle.image = val;
                break;
            case 'text':
                featureStyle.text = val;
                break;
            }
        });
        this.setStyleDef({ featureStyle, optionalStyles });

        if (title) {
            this.setTitle(title);
        }
    }
}
