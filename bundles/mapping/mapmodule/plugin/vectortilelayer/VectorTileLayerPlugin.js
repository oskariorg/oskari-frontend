import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import olStyleStyle from 'ol/style/Style';

const invisible = new olStyleStyle();

/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.mapmodule.VectorTileLayerPlugin',

    /**
     * @static @method create called automatically on construction
     */
    function () {
        console.log('plugin start!');
    },
    {
        __name: 'VectorTileLayerPlugin',
        _clazz: 'Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
        layertype: 'vectortile',

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl() {
            // register domain builder
            const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'vectortile',
                    'Oskari.mapframework.domain.VectorTileLayer'
                );
            }
        },
        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer}  layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported(layer) {
            if (!layer) {
                return false;
            }
            return layer.isLayerOfType(this.layertype);
        },
        /**
         * @method addMapLayerToMap
         * @private
         * Adds a single vector tile layer to this map
         * @param {Oskari.mapframework.domain.VectorTileLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap(layer, keepLayerOnTop, isBaseMap) {
            const options = layer.getOptions();
            const sourceOpts = {
                format: new olFormatMVT(),
                url: layer.getLayerUrl().replace('{epsg}', this.mapModule.getProjection())
            };
            if(options.tileGrid) {
                sourceOpts.tileGrid = new TileGrid(options.tileGrid);
            }
            const layerOpts = {
                opacity: layer.getOpacity() / 100,
                renderMode: 'hybrid',
                source: new olSourceVectorTile(sourceOpts)
            };
            if (options.style && options.style.default) {
                layerOpts.style = this._generateStyleFunction(options.style.default);
            }
            const vectorTileLayer = new olLayerVectorTile(layerOpts);

            this.mapModule.addLayer(vectorTileLayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), vectorTileLayer);
        },
        _generateStyleFunction(styleDef) {
            const styleCache = {};
            Object.keys(styleDef).forEach((layerName) => {
                const styles = {};
                const layerStyleDef = styleDef[layerName];
                const featureStyle = layerStyleDef.featureStyle;
                if (featureStyle) {
                    styles.base = this.mapModule.getStyle(featureStyle);
                }
                const optionalStyles = layerStyleDef.optionalStyles;
                if (optionalStyles) {
                    styles.optional = optionalStyles.map((optionalDef) => {
                        return {
                            key: optionalDef.property.key,
                            value: optionalDef.property.value,
                            style: this.mapModule.getStyle(Object.assign({}, featureStyle, optionalDef))
                        }
                    });
                }
                styleCache[layerName] = styles;
            })
            return (feature, resolution) => {
                var styles = styleCache[feature.get('layer')];
                if (!styles) {
                    return invisible;
                }
                if (styles.optional) {
                    var found = styles.optional.find((op) => {
                        return feature.get(op.key) === op.value;
                    });
                    if (found) {
                        return found.style;
                    }
                }
                if (styles.base) {
                    return styles.base;
                }
                return invisible;
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin'],
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin']
    }
);
