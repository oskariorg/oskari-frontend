Oskari.clazz.define('Oskari.mapframework.mapmodule.VectorTileLayer',
    function () {
        // passes params and options to AbstractLayer constructor automatically.
        // If this is changed to ES6 class these will need to be passed manually with super(...arguments)
        // like in https://github.com/oskariorg/oskari-frontend/pull/1260
        /* style definition for this layer */
        this.hoverOptions = null;

        /* Layer Type */
        this._layerType = 'VECTORTILE';
    }, {
        setHoverOptions (options) {
            this.hoverOptions = options;
        },
        /**
         * @method getHoverOptions
         * @return {Object} options
         */
        getHoverOptions () {
            return this.hoverOptions;
        },
        /**
         * @method getStyleDef
         * @param {String} styleName
         * @return {Object}
         */
        getStyleDef (styleName) {
            if (this._options.styles) {
                return this._options.styles[styleName];
            }
        },
        /**
         * @method getCurrentStyleDef
         * @return {Object/null}
         */
        getCurrentStyleDef () {
            if (!this._currentStyle) {
                return null;
            }
            return this.getStyleDef(this._currentStyle.getName());
        },
        /**
         * @method getExternalStyleDef
         * @param {String} styleName
         * @return {Object}
         */
        getExternalStyleDef (styleName) {
            if (this._options.externalStyles) {
                return this._options.externalStyles[styleName];
            }
        },
        /**
         * @method getCurrentExternalStyleDef
         * @return {Object/null}
         */
        getCurrentExternalStyleDef () {
            if (!this._currentStyle) {
                return null;
            }
            return this.getExternalStyleDef(this._currentStyle.getName());
        },
        /**
         * @method getTileGrid
         * @return {Object} tile grid configuration
         */
        getTileGrid () {
            return this._options.tileGrid;
        },

        isSupportedSrs (srsName) {
            if (Oskari.getSandbox().getMap().getSupports3D()) {
                return false;
            }
            if (!this._srsList || !this._srsList.length) {
                // if list is not provided, treat as supported
                return true;
            }
            return this._srsList.indexOf(srsName) !== -1;
        }
    }, {
        'extend': ['Oskari.mapframework.domain.AbstractLayer']
    });
