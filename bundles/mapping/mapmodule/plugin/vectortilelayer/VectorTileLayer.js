import { createDefaultStyle, DEFAULT_STYLE_NAME } from '../../domain/VectorStyle';
Oskari.clazz.define('Oskari.mapframework.mapmodule.VectorTileLayer',
    function () {
        // passes params and options to AbstractLayer constructor automatically.
        // If this is changed to ES6 class these will need to be passed manually with super(...arguments)
        // like in https://github.com/oskariorg/oskari-frontend/pull/1260
        /* style definition for this layer */
        this.hoverOptions = null;
        this._geometryType = null;

        /* Layer Type */
        this._layerType = 'VECTORTILE';
    }, {
        /* override */
        // AbstractLayer selectStyle creates empty if style isn't found
        _createEmptyStyle: function () {
            return createDefaultStyle();
        },
        getClusteringDistance () {},

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
        removeStyle (name) {
            const styles = this.getStyles();
            const index = styles.findIndex(s => s.getName() === name);
            if (index !== -1) {
                styles.splice(index, 1);
            }
            // Remove style from layer if active.
            const current = this.getCurrentStyle().getName();
            const sb = Oskari.getSandbox();
            if (current === name) {
                sb.postRequestByName('ChangeMapLayerStyleRequest', [this.getId(), DEFAULT_STYLE_NAME]);
            } else {
                // Only notify to update list of styles in selected layers.
                const event = Oskari.eventBuilder('MapLayerEvent')(this.getId(), 'update');
                sb.notifyAll(event);
            }
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
        },
        setGeometryType (type) {
            this._geometryType = type;
        },
        getGeometryType () {
            return this._geometryType || this.getAttributes('geometryType');
        }
    }, {
        extend: ['Oskari.mapframework.domain.AbstractLayer']
    });
