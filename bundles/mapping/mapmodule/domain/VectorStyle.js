const Style = Oskari.clazz.get('Oskari.mapframework.domain.Style');

export const DEFAULT_STYLE_NAME = 'default';

export const createDefaultStyle = () => {
    return new VectorStyle(DEFAULT_STYLE_NAME, Oskari.getMsg('MapModule', 'styles.defaultTitle'));
};

export class VectorStyle extends Style {
    constructor (name, title, type = 'normal', styleDef) {
        super();
        this._type = type; // normal, user, external
        this._featureStyle = {};
        this._optionalStyles = [];
        this._externalDef = null;
        this.setName(name);
        this.setTitle(title);
        this.parseStyleDef(styleDef);
    }

    getLegend () {
        return null;
    }

    getType () {
        return this._type;
    }

    isUserStyle () {
        return this.getType() === 'user';
    }

    isExternalStyle () {
        return this.getType() === 'external';
    }

    isRuntimeStyle () {
        return this.isUserStyle();
    }

    hasDefinitions () {
        return Object.keys(this.getFeatureStyle()).length > 0 ||
            this.getOptionalStyles().length > 0 ||
            !!this.getExternalDef();
    }

    parseStyleDef (styleDef) {
        if (!styleDef) {
            return;
        }
        if (this.isExternalStyle()) {
            this.setExternalDef({ ...styleDef });
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

        this.setFeatureStyle({ ...featureStyle });
        this.setOptionalStyles([...optionalStyles]);

        if (title) {
            this.setTitle(title);
        }
        if (!this.getTitle()) {
            const name = this.getName();
            if (name === DEFAULT_STYLE_NAME) {
                this.setTitle(Oskari.getMsg('MapModule', 'styles.defaultTitle'));
            } else {
                this.setTitle(name);
            }
        }
    }

    getFeatureStyle () {
        return this._featureStyle;
    }

    setFeatureStyle (featureStyle = {}) {
        this._featureStyle = featureStyle;
    }

    getOptionalStyles () {
        return this._optionalStyles;
    }

    setOptionalStyles (optionalStyles = []) {
        this._optionalStyles = optionalStyles;
    }

    getExternalDef () {
        return this._externalDef;
    }

    setExternalDef (styleDef) {
        this._externalDef = styleDef;
    }
}
