/* eslint-disable new-cap */
import olLayerVectorTile from 'ol/layer/VectorTile';
import olLayerTile from 'ol/layer/Tile';
import olSourceTileDebug from 'ol/source/TileDebug';
import olFormatMVT from 'ol/format/MVT';
import olTileGrid from 'ol/tilegrid/TileGrid';
import olTileState from 'ol/TileState';
import { FeatureExposingMVTSource } from './MvtLayerHandler/FeatureExposingMVTSource';
import { WFS_ID_KEY } from '../util/props';
import { AbstractLayerHandler } from './AbstractLayerHandler.ol';

/**
 * @class MvtLayerHandler
 * LayerHandler implementation for MVT layers
 */
export class MvtLayerHandler extends AbstractLayerHandler {
    constructor (layerPlugin) {
        super(layerPlugin);
        this._log = Oskari.log('WfsMvtLayerPlugin');
        this.localization = Oskari.getMsg.bind(null, 'MapWfs2');
        const config = layerPlugin.getConfig();
        if (!config) {
            return;
        }
        this.minZoomLevel = config.minZoomLevel;
        this._setupTileGrid(config);
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
        const layerMinScale = layer.getMinScale() && layer.getMinScale() > 0 ? layer.getMinScale() : undefined;
        const mvtMinScale = this._getMinScale();
        if (mvtMinScale && (!layerMinScale || layerMinScale > mvtMinScale)) {
            layer.setMinScale(mvtMinScale);
        }
        const source = this._createLayerSource(layer, sourceOpts);
        this._createDebugLayer(source);
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
    _setupTileGrid (config) {
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
    _createLayerSource (layer, options) {
        const source = new FeatureExposingMVTSource(options);
        source.on('tileloadend', ({ tile }) => {
            if (tile.getState() === olTileState.ERROR) {
                return;
            }
            this.updateLayerProperties(layer, source);
        });
        return source;
    }
    _createDebugLayer (source) {
        this.plugin.getMapModule().getMap().addLayer(new olLayerTile({
            source: new olSourceTileDebug({
                projection: 'EPSG:3857',
                tileGrid: source.getTileGrid()
            })
        }));
    }
    _getMinScale () {
        if (!this.minZoomLevel) {
            return;
        }
        if (this.minZoomLevel > this.plugin.getMapModule().getScaleArray().length - 1) {
            return;
        }
        const zoomLevelScale = this.plugin.getMapModule().getScaleArray()[this.minZoomLevel];
        // Min scale is exclusive on layer visibility.
        // Add +1 to make a layer visible at the zoom level.
        return zoomLevelScale + 1;
    }
    /**
     * Adds event listeners to ol-layers
     * @param {string|number} layerId
     * @param {ol/source/VectorTile} oskariLayer
     */
    _registerLayerEvents (layerId, source) {
        source.on('tileloadstart', () => this.plugin.getMapModule().loadingState(layerId, true));
        source.on('tileloadend', () => this.plugin.getMapModule().loadingState(layerId, false));
        source.on('tileloaderror', () => this.plugin.getMapModule().loadingState(layerId, null, true));
    }
}
