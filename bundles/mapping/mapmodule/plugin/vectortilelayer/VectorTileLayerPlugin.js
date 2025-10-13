import './VectorTileLayer';

import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';
import { createDefaultStyle } from 'ol/style/Style';

import { VectorTileModelBuilder } from './VectorTileModelBuilder';
// eslint-disable-next-line import/no-unresolved
import { stylefunction as mapboxStyleFunction } from 'ol-mapbox-style';
import { LAYER_ID, LAYER_TYPE, FEATURE_QUERY_ERRORS, VECTOR_STYLE } from '../../domain/constants';
import { getZoomLevelHelper } from '../../util/scale';
import { getFeatureAsGeojson } from '../../util/vectorfeatures/jsonHelper';
import { getMVTFeaturesInExtent } from '../../util/vectorfeatures/mvtHelper';
import { filterFeaturesByAttribute, filterFeaturesByGeometry } from '../../util/vectorfeatures/filter';

const AbstractVectorLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractVectorLayerPlugin');
const LayerComposingModel = Oskari.clazz.get('Oskari.mapframework.domain.LayerComposingModel');

/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
class VectorTileLayerPlugin extends AbstractVectorLayerPlugin {
    constructor (config) {
        super(config);
        this.__name = 'VectorTileLayerPlugin';
        this._clazz = 'Oskari.mapframework.mapmodule.VectorTileLayerPlugin';
        this.layertype = 'vectortile';
    }

    /**
     * @private @method _initImpl
     * Interface method for the module protocol.
     */
    _initImpl () {
        // register domain builder
        const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            const composingModel = new LayerComposingModel([
                LayerComposingModel.ATTRIBUTIONS,
                LayerComposingModel.CREDENTIALS,
                LayerComposingModel.EXTERNAL_VECTOR_STYLES,
                LayerComposingModel.HOVER,
                LayerComposingModel.SRS,
                LayerComposingModel.VECTOR_STYLES,
                LayerComposingModel.TILE_GRID,
                LayerComposingModel.URL,
                LayerComposingModel.DECLUTTER
            ], null, [LayerComposingModel.NAME]); // common field name is not used in vectortilelayers so it is skipped on LayerComposingModel

            mapLayerService.registerLayerModel(this.layertype + 'layer', this._getLayerModelClass(), composingModel);
            mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', this._getModelBuilder());
        }
        this.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService').registerLayerType(this.layertype, this);
    }

    /**
     * @private @method _getLayerModelClass
     * Returns class to be used as mapLayerService layer model
     */
    _getLayerModelClass () {
        return 'Oskari.mapframework.mapmodule.VectorTileLayer';
    }

    /**
     * @private @method _getModelBuilder
     * Returns object to be used as mapLayerService layer model builder
     */
    _getModelBuilder () {
        return new VectorTileModelBuilder();
    }

    /**
     * @private @method _createPluginEventHandlers
     * Called by superclass to create event handlers
     */
    _createPluginEventHandlers () {
        return {
            AfterChangeMapLayerStyleEvent (event) {
                const oskariLayer = event.getMapLayer();
                this._updateLayerStyle(oskariLayer);
            }
        };
    }

    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.mapmodule.VectorTileLayer} oskariLayer
     */
    _updateLayerStyle (oskariLayer) {
        const olLayers = this.getOLMapLayers(oskariLayer);

        if (olLayers && olLayers.length > 0) {
            olLayers[0].setStyle(this._getLayerCurrentStyleFunction(oskariLayer));
        }
    }

    /**
     * @private @method _getLayerCurrentStyleFunction
     * Returns OL style corresponding to layer currently selected style
     * @param {Oskari.mapframework.domain.AbstractLayer} layer
     * @return {ol/style/Style}
     */
    _getLayerCurrentStyleFunction (layer) {
        const olLayers = this.getOLMapLayers(layer.getId());
        const style = layer.getCurrentStyle();
        if (style.getType() === VECTOR_STYLE.MAPBOX && olLayers.length !== 0) {
            const styleDef = style.getFeatureStyle();
            const sourceLayerIds = styleDef.layers.filter(cur => !!cur.source).map(cur => cur.id);
            const resolutions = [...this.getMapModule().getResolutionArray()];
            return mapboxStyleFunction(olLayers[0], styleDef, sourceLayerIds, resolutions);
        }
        return style.hasDefinitions() ? this.mapModule.getStyleForLayer(layer) : this._createDefaultStyle();
    }

    /**
     * @private @method _createDefaultStyle
     * Creates OL style or style function for default style
     * @return {ol/style/Style}
     */
    _createDefaultStyle () {
        return createDefaultStyle;
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

    getUrlParams (layer) {
        if (!layer.getParams()) {
            return null;
        }
        const params = layer.getParams();
        return Object.keys(params)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
    }

    /**
     * Override in actual plugins to returns features.
     *
     * Returns features that are currently on map filtered by given geometry and/or properties
     * {
     *   "[layer id]": {
            accuracy: 'extent',
     *      features: [{ geometry: {...}, properties: {...}}, ...]
     *   },
     *   ...
     * }
     * For features that are queried from MVT-tiles we might not be able to get the whole geometry and since it's not accurate they will
     *  only get the extent of the feature. This is marked with accuracy: 'extent' and it might not even be the whole extent if the
     *  feature continues on unloaded tiles.
     * @param {Object} geojson an object with geometry and/or properties as filter for features. Geometry defaults to current viewport.
     * @param {Object} opts additional options to narrow feature collection
     * @returns {Object} an object with layer ids as keys with an object value with key "features" for the features on that layer and optional runtime-flag
     */
    getFeatures (geojson = {}, opts = {}) {
        // console.log('getting features from ', this.getName());
        const { left, bottom, right, top } = this.getSandbox().getMap().getBbox();
        const extent = [left, bottom, right, top];
        let { layers } = opts;
        if (!layers || !layers.length) {
            layers = this.getSandbox().getMap().getLayers().map(l => l.getId());
        }
        const result = {};
        layers.forEach(layerId => {
            const layer = this.getSandbox().getMap().getSelectedLayer(layerId);
            if (!this.isLayerSupported(layer)) {
                return;
            }
            const err = this.detectErrorOnFeatureQuery(layer);
            if (err) {
                result[layerId] = {
                    error: err,
                    features: []
                };
                return;
            }
            const layerImpls = this.getOLMapLayers(layerId);
            if (!layerImpls || !layerImpls.length) {
                result[layerId] = {
                    error: FEATURE_QUERY_ERRORS.NOT_FOUND,
                    features: []
                };
                return;
            }
            const features = getMVTFeaturesInExtent(layerImpls[0], extent);
            if (!features) {
                return;
            }
            let geojsonFeatures = features.map(feat => getFeatureAsGeojson(feat));
            if (geojson.geometry) {
                geojsonFeatures = filterFeaturesByGeometry(geojsonFeatures, geojson.geometry);
            }
            if (geojson.properties) {
                geojsonFeatures = filterFeaturesByAttribute(geojsonFeatures, geojson.properties);
            }
            result[layerId] = {
                accuracy: 'extent',
                features: geojsonFeatures
            };
        });
        return result;
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
        if (!this.getSandbox().getMap().isLayerSupported(layer)) {
            return;
        }
        let url = layer.getLayerUrl().replace('{epsg}', this.mapModule.getProjection());
        const urlParams = this.getUrlParams(layer);
        if (urlParams) {
            const paramsPrefix = url.includes('?') ? '&' : '?';
            url = url + paramsPrefix + urlParams;
        }
        const sourceOpts = {
            format: new olFormatMVT(),
            url,
            projection: this.getMap().getView().getProjection(), // OL projection object
            attributions: this.getAttributions(layer)
        };
        const tileGrid = layer.getTileGrid();
        if (tileGrid) {
            sourceOpts.tileGrid = new TileGrid(tileGrid);
        }
        // options is used to store tile grid and all sorts of other flags so only get the
        //  declutter option here instead of spreading the object to layer directly
        //  className -> to get decluttered labels rendered in layer order (https://github.com/openlayers/openlayers/issues/13235)
        const { declutter, className = 'ol-layer' } = layer.getOptions() || {};
        const vectorTileLayer = new olLayerVectorTile({
            opacity: layer.getOpacity() / 100,
            visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
            renderMode: 'hybrid',
            source: this.createSource(layer, sourceOpts),
            declutter,
            className
        });

        const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
        // Set min max zoom levels that layer should be visible in
        zoomLevelHelper.setOLZoomLimits(vectorTileLayer, layer.getMinScale(), layer.getMaxScale());

        const vectorFeatureService = this.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService');
        const hoverLayer = vectorFeatureService.registerHoverLayer(layer, vectorTileLayer.getSource());
        const olLayers = [vectorTileLayer, hoverLayer];
        olLayers.forEach(olLayer => {
            // Properties id and type are being used in VectorFeatureService.
            // Set oskari properties for vector feature service functionalities.
            const silent = true;
            olLayer.set(LAYER_ID, layer.getId(), silent);
            olLayer.set(LAYER_TYPE, layer.getLayerType(), silent);
            this.mapModule.addLayer(olLayer, !keepLayerOnTop);
        });
        this.setOLMapLayers(layer.getId(), olLayers);
        vectorTileLayer.setStyle(this._getLayerCurrentStyleFunction(layer));
    }

    createSource (layer, options) {
        return new olSourceVectorTile(options);
    }

    /**
     * Called when layer details are updated (for example by the admin functionality)
     * @param {Oskari.mapframework.domain.AbstractLayer} layer new layer details
     */
    _updateLayer (layer) {
        if (!this.isLayerSupported(layer)) {
            return;
        }
        const zoomLevelHelper = getZoomLevelHelper(this.getMapModule().getScaleArray());
        const layersImpls = this.getOLMapLayers(layer.getId()) || [];
        layersImpls.forEach(olLayer => {
            // Update min max Resolutions
            zoomLevelHelper.setOLZoomLimits(olLayer, layer.getMinScale(), layer.getMaxScale());
        });
    }
}

Oskari.clazz.defineES('Oskari.mapframework.mapmodule.VectorTileLayerPlugin',
    VectorTileLayerPlugin,
    {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);

export { VectorTileLayerPlugin };
