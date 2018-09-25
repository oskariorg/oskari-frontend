const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');

export default class VectorTileLayer extends AbstractLayer {
    constructor(params, options) {
        super(params, options);
        /* style definition for this layer */
        this.hoverOptions = null;

        /* Layer Type */
        this._layerType = 'VECTORTILE';
    }
    setHoverOptions(options) {
        this.hoverOptions = options;
    }
    /**
     * @method getHoverOptions
     * @return {Object} options
     */
    getHoverOptions() {
        return this.hoverOptions;
    }
    /**
     * @method getStyleDef
     * @param {String} styleName
     * @return {Object}
     */
    getStyleDef(styleName) {
        if (this._options.styles) {
            return this._options.styles[styleName];
        }
    }
    /**
     * @method getCurrentStyleDef
     * @return {Object}
     */
    getCurrentStyleDef() {
        return this.getStyleDef(this._currentStyle.getName());
    }
}