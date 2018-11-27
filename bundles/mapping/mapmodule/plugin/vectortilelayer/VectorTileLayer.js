const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

export default class VectorTileLayer extends AbstractLayer {
    constructor (params, options) {
        super(params, options);
        /* style definition for this layer */
        this.hoverOptions = null;

        /* Layer Type */
        this._layerType = 'VECTORTILE';
    }
    setHoverOptions (options) {
        this.hoverOptions = options;
    }
    /**
     * @method getHoverOptions
     * @return {Object} options
     */
    getHoverOptions () {
        return this.hoverOptions;
    }
    /**
     * @method getStyleDef
     * @param {String} styleName
     * @return {Object}
     */
    getStyleDef (styleName) {
        if (this._options.styles) {
            return this._options.styles[styleName];
        }
    }
    /**
     * @method getCurrentStyleDef
     * @return {Object/null}
     */
    getCurrentStyleDef () {
        if (!this._currentStyle) {
            return null;
        }
        return this.getStyleDef(this._currentStyle.getName());
    }
    /**
     * @method getExternalStyleDef
     * @param {String} styleName
     * @return {Object}
     */
    getExternalStyleDef (styleName) {
        if (this._options.externalStyles) {
            return this._options.externalStyles[styleName];
        }
    }
    /**
     * @method getCurrentExternalStyleDef
     * @return {Object/null}
     */
    getCurrentExternalStyleDef () {
        if (!this._currentStyle) {
            return null;
        }
        return this.getExternalStyleDef(this._currentStyle.getName());
    }
}
