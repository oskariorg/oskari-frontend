import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createDefaultStyle } from 'ol/style/Style';

import VectorTileModelBuilder from './VectorTileModelBuilder';
import VectorTileLayer from './VectorTileLayer';
import styleGenerator from './styleGenerator';
import mapboxStyleFunction from 'ol-mapbox-style/stylefunction';
import { LAYER_ID, LAYER_HOVER, LAYER_TYPE, FTR_PROPERTY_ID } from '../../domain/constants';

const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');

/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
Oskari.clazz.defineES('Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
    class VectorTileLayerPlugin extends AbstractMapLayerPlugin {
        constructor (config) {
            super(config);
            this.__name = 'VectorTileLayerPlugin';
            this._clazz = 'Oskari.mapframework.mapmodule.VectorTileLayerPlugin';
            this.layertype = 'vectortile';
            this.hoverState = {
                layer: null,
                propertyId: null,
                feature: null
            };
        }
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         */
        _initImpl () {
            // register domain builder
            const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                mapLayerService.registerLayerModel(this.layertype + 'layer', VectorTileLayer);
                mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', new VectorTileModelBuilder());
            }
            this.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService').registerLayerType(this.layertype, this);
        }
        /**
         * @private @method _createPluginEventHandlers
         * Called by superclass to create event handlers
         */
        _createPluginEventHandlers () {
            return {
                AfterChangeMapLayerStyleEvent (event) {
                    const oskariLayer = event.getMapLayer();
                    const olLayers = this.getOLMapLayers(oskariLayer);

                    if (olLayers && olLayers.length > 0) {
                        olLayers[0].setStyle(this._getLayerCurrentStyleFunction(oskariLayer));
                    }
                }
            };
        }
        /**
         * @private @method _getLayerCurrentStyleFunction
         * Returns OL style corresponding to layer currently selected style
         * @param {Oskari.mapframework.domain.AbstractLayer} layer
         * @return {ol/style/Style}
         */
        _getLayerCurrentStyleFunction (layer) {
            const externalStyleDef = layer.getCurrentExternalStyleDef();
            const olLayers = this.getOLMapLayers(layer.getId());
            if (externalStyleDef && olLayers.length !== 0) {
                const sourceLayerIds = externalStyleDef.layers.filter(cur => !!cur.source).map(cur => cur.id);
                return mapboxStyleFunction(olLayers[0], externalStyleDef, sourceLayerIds);
            }
            const styleDef = layer.getCurrentStyleDef();
            const hoverOptions = layer.getHoverOptions();
            const factory = this.mapModule.getStyle.bind(this.mapModule);
            return styleDef ? styleGenerator(factory, styleDef, hoverOptions, this.hoverState) : createDefaultStyle;
        }
        /**
         * Checks if the layer can be handled by this plugin
         * @method  isLayerSupported
         * @param  {Oskari.mapframework.domain.AbstractLayer} layer
         * @return {Boolean}       true if this plugin handles the type of layers
         */
        isLayerSupported (layer) {
            if (!layer) {
                return false;
            }
            return layer.isLayerOfType(this.layertype);
        }
        /**
         * @method getAttributions
         * @param  {Oskari.mapframework.domain.AbstractLayer} layer
         * @return {Array<String>} layer attributions
         */
        getAttributions (layer) {
            if (!layer) {
                return;
            }
            let { attributions } = layer.getOptions();
            if (!attributions) {
                return;
            }
            if (!Array.isArray(attributions)) {
                attributions = [attributions];
            }
            return attributions.map(obj => {
                if (typeof obj === 'string') {
                    return obj;
                }
                const { label, link } = obj;
                return link ? `<a href="${link}">${label}</a>` : label;
            });
        }
        /**
         * @method addMapLayerToMap
         * @private
         * Adds a single vector tile layer to this map
         * @param {Oskari.mapframework.domain.VectorTileLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
            const options = layer.getOptions();
            const sourceOpts = {
                format: new olFormatMVT(),
                url: layer.getLayerUrl().replace('{epsg}', this.mapModule.getProjection()),
                attributions: this.getAttributions(layer)
            };
            if (options.tileGrid) {
                sourceOpts.tileGrid = new TileGrid(options.tileGrid);
            }
            // Properties id, type and hover are being used in VectorFeatureService.
            const vectorTileLayer = new olLayerVectorTile({
                opacity: layer.getOpacity() / 100,
                renderMode: 'hybrid',
                source: new olSourceVectorTile(sourceOpts)
            });
            // Set oskari properties for vector feature service functionalities.
            const silent = true;
            vectorTileLayer.set(LAYER_ID, layer.getId(), silent);
            vectorTileLayer.set(LAYER_TYPE, layer.getLayerType(), silent);
            vectorTileLayer.set(LAYER_HOVER, layer.getHoverOptions(), silent);

            this.mapModule.addLayer(vectorTileLayer, !keepLayerOnTop);
            this.setOLMapLayers(layer.getId(), vectorTileLayer);
            vectorTileLayer.setStyle(this._getLayerCurrentStyleFunction(layer));
        }

        /**
         * @method onMapHover VectorFeatureService handler impl method
         * Handles feature highlighting on map hover.
         *
         * @param { Oskari.mapframework.event.common.MouseHoverEvent } event
         * @param { olRenderFeature } feature
         * @param { olVectorTileLayer } layer
         */
        onMapHover (event, feature, layer) {
            if (feature && layer) {
                var hoverOptions = layer.get(LAYER_HOVER);
                if (hoverOptions) {
                    const propertyId = feature.get(FTR_PROPERTY_ID);
                    if (this.hoverState.layer && this.hoverState.layer !== layer) {
                        // clear highlight from previously highlighted layer.
                        this.hoverState.propertyId = null;
                        this.hoverState.feature = null;
                        this.hoverState.layer.changed();
                        this.hoverState.layer = null;
                    }
                    if (this.hoverState.feature !== feature && hoverOptions.featureStyle) {
                        this.hoverState.propertyId = propertyId;
                        this.hoverState.feature = feature;
                        this.hoverState.layer = layer;
                        this.hoverState.layer.changed();
                    }
                }
            } else if (this.hoverState.layer) {
                // Remove feature highlighting
                this.hoverState.propertyId = null;
                this.hoverState.feature = null;
                this.hoverState.layer.changed();
                this.hoverState.layer = null;
            }
        }

        /**
         * @method onLayerRequest VectorFeatureService handler impl method
         * Handles VectorLayerRequest to update hover tooltip and feature style.
         * Other request options are not currently supported.
         *
         * @param { Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest } request
         * @param { Oskari.mapframework.domain.AbstractLayer|VectorTileLayer } layer
         */
        onLayerRequest (request, layer) {
            const options = request.getOptions();
            if (options.hover) {
                layer.setHoverOptions(options.hover);
                const olLayers = this.getOLMapLayers(layer.getId());
                if (olLayers) {
                    olLayers.forEach(lyr => {
                        lyr.set(LAYER_HOVER, layer.getHoverOptions());
                        lyr.setStyle(this._getLayerCurrentStyleFunction(layer));
                    });
                }
            }
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);
