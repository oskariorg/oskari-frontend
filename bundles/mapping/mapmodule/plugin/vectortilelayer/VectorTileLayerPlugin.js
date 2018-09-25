import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import olStyleStyle, {createDefaultStyle} from 'ol/style/Style';

import VectorTileModelBuilder from './VectorTileModelBuilder';
import VectorTileLayer from './VectorTileLayer';

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
                mapLayerService.registerLayerModel(this.layertype, VectorTileLayer);
                mapLayerService.registerLayerModelBuilder(this.layertype, new VectorTileModelBuilder());
            }
        },
        _createPluginEventHandlers() {
            return {
                AfterChangeMapLayerStyleEvent(event) {
                    const oskariLayer = event.getMapLayer();
                    const olLayers = this.getOLMapLayers(oskariLayer);

                    if (olLayers && olLayers.length > 0) {
                        olLayers[0].setStyle(this._getLayerCurrentStyleFunction(oskariLayer));
                    }
                }
            };
        },
        _getLayerCurrentStyleFunction(layer) {
            const styleDef = layer.getCurrentStyleDef();
            return styleDef ? this._generateStyleFunction(styleDef) : createDefaultStyle;
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
            const vectorTileLayer = new olLayerVectorTile({
                opacity: layer.getOpacity() / 100,
                renderMode: 'hybrid',
                source: new olSourceVectorTile(sourceOpts),
                style: this._getLayerCurrentStyleFunction(layer)
            });

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
