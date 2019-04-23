/* eslint-disable new-cap */
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import olTileGrid from 'ol/tilegrid/TileGrid';
import olTileState from 'ol/TileState';
import { FeatureExposingMVTSource } from './MvtLayerHandler/FeatureExposingMVTSource';
import { WFS_ID_KEY, getFieldsAndPropsArrays } from '../util/props';
import { AbstractLayerHandler } from './AbstractLayerHandler.ol';

const FEATURE_DATA_UPDATE_THROTTLE = 1000;

/**
 * @class MvtLayerHandler
 * LayerHandler implementation for MVT layers
 */
export class MvtLayerHandler extends AbstractLayerHandler {
    constructor (layerPlugin) {
        super(layerPlugin);
        this._log = Oskari.log('WfsMvtLayerPlugin');
        this.localization = Oskari.getMsg.bind(null, 'MapWfs2');
        this.throttledUpdates = new Map();
        this._setupTileGrid(layerPlugin.getConfig());
    }
    _setupTileGrid (config) {
        if (!config) {
            return;
        }
        const { origin, resolutions, tileSize } = config;
        if (!origin || !resolutions || !tileSize) {
            return;
        }
        this.tileGrid = {
            origin,
            resolutions,
            tileSize: [tileSize, tileSize]
        };
    }
    getStyleFunction (layer, styleFunction, selectedIds) {
        if (!selectedIds.size) {
            return styleFunction;
        }
        return (feature, resolution) => {
            const isSelected = selectedIds.has(feature.get(WFS_ID_KEY));
            return styleFunction(feature, resolution, isSelected);
        };
    }
    updateLayerProperties (layer, source = this._sourceFromLayer(layer)) {
        if (this.throttledUpdates.has(layer.getId())) {
            const throttledUpdate = this.throttledUpdates.get(layer.getId());
            throttledUpdate();
            return;
        }
        const update = () => this._updateLayerProperties(layer, source);
        const throttledUpdate = Oskari.util.throttle(update, FEATURE_DATA_UPDATE_THROTTLE, { leading: false });
        this.throttledUpdates.set(layer.getId(), throttledUpdate);
        throttledUpdate();
    }
    _updateLayerProperties (layer, source) {
        if (!layer.isVisible()) {
            layer.setActiveFeatures([]);
            layer.setFields([]);
            this.plugin.notify('WFSPropertiesEvent', layer, layer.getLocales(), []);
            return;
        }
        const { left, bottom, right, top } = this.plugin.getSandbox().getMap().getBbox();
        const propsList = source.getFeaturePropsInExtent([left, bottom, right, top]);
        const { fields, properties } = getFieldsAndPropsArrays(propsList);
        layer.setActiveFeatures(properties);
        // Update fields and locales only if fields is not empty and it has changed
        if (fields && fields.length > 0 && !Oskari.util.arraysEqual(layer.getFields(), fields)) {
            layer.setFields(fields);
            this.plugin.setLayerLocales(layer);
        }
        this.plugin.notify('WFSPropertiesEvent', layer, layer.getLocales(), fields);
    }
    /**
     * Returns source corresponding to given layer
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol/source/VectorTile}
     */
    _sourceFromLayer (layer) {
        return this.plugin.getOLMapLayers(layer.getId())[0].getSource();
    }
    createSource (layer, options) {
        const source = new FeatureExposingMVTSource(options);
        source.on('tileloadend', ({ tile }) => {
            if (tile.getState() === olTileState.ERROR) {
                return;
            }
            this.updateLayerProperties(layer, source);
        });
        return source;
    }

    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        super.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        const sourceOpts = {
            format: new olFormatMVT(),
            projection: this.plugin.getMap().getView().getProjection(),
            url: layer.getLayerUrl().replace('{epsg}', this.plugin.getMapModule().getProjection())
        };
        if (this.tileGrid) {
            sourceOpts.tileGrid = new olTileGrid(this.tileGrid);
        }

        // Properties id, type and hover are being used in VectorFeatureService.
        const source = this.createSource(layer, sourceOpts);
        const vectorTileLayer = new olLayerVectorTile({
            opacity: layer.getOpacity() / 100,
            visible: layer.isVisible(),
            renderMode: 'hybrid',
            source
        });
        this.plugin.getMapModule().addLayer(vectorTileLayer, !keepLayerOnTop);
        this.plugin.setOLMapLayers(layer.getId(), vectorTileLayer);
        this._registerLayerEvents(layer.getId(), source);
        return vectorTileLayer;
    }
    /**
     * Adds event listeners to ol-layers
     * @param {string|number} layerId
     * @param {ol/source/VectorTile} oskariLayer
     *
     */
    _registerLayerEvents (layerId, source) {
        source.on('tileloadstart', () => this.plugin.getMapModule().loadingState(layerId, true));
        source.on('tileloadend', () => this.plugin.getMapModule().loadingState(layerId, false));
        source.on('tileloaderror', () => this.plugin.getMapModule().loadingState(layerId, null, true));
    }
}
