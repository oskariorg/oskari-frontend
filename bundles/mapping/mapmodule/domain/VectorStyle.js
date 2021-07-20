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
        this.setName(name);
        this.setTitle(title);
        this.initDefinition(styleDef);
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

    hasDefinition () {
        return Object.keys(this.getFeatureStyle()).length > 0 ||
            this.getOptionalStyles().length > 0 ||
            Object.keys(this.getDefinition()).length > 0;
    }

    getDefinition () {
        return this.definition || {};
    }

    setDefinition (styleDef) {
        this.definition = styleDef;
    }

    initDefinition (styleDef) {
        if (!styleDef) {
            return;
        }
        if (this.isExternalStyle()) {
            this.definition = styleDef;
            return;
        }
        // Parse Oskari style to fetureStyle and optionalStyles
        let { featureStyle = {}, optionalStyles = [], title } = styleDef;
        // Bypass possible layer definitions
        Object.values(styleDef).forEach(val => {
            if (val.hasOwnProperty('featureStyle')) {
                featureStyle = val.featureStyle;
            }
            if (val.hasOwnProperty('optionalStyles')) {
                optionalStyles = val.optionalStyles;
            }
            if (val.hasOwnProperty('title')) {
                title = val.title;
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
}
