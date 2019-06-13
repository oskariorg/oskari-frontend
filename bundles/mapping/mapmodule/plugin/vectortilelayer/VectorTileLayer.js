const AbstractLayer = Oskari.clazz.get('Oskari.mapframework.domain.AbstractLayer');
export class VectorTileLayer extends AbstractLayer {
    constructor () {
        super();
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
    /**
     * @method getTileGrid
     * @return {Object} tile grid configuration
     */
    getTileGrid () {
        return this._options.tileGrid;
    }
    /**
     * @method isSupported
     */
    isSupported (srsName) {
        return super.isSupported(srsName) && !Oskari.getSandbox().getMap().getSupports3D();
    }
}

Oskari.clazz.defineES('Oskari.mapframework.mapmodule.VectorTileLayer', VectorTileLayer);
