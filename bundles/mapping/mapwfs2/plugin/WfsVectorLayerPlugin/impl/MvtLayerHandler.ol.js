/* eslint-disable new-cap */
import olLayerVectorTile from 'ol/layer/VectorTile';
import olLayerTile from 'ol/layer/Tile';
import olSourceTileDebug from 'ol/source/TileDebug';
import olFormatMVT from 'ol/format/MVT';
import olTileGrid from 'ol/tilegrid/TileGrid';
import olSourceVectorTile from 'ol/source/VectorTile';
import { getMVTFeaturesInExtent } from '../../../../mapmodule/util/vectorfeatures/mvtHelper';
import { WFS_ID_KEY } from '../../../../mapmodule/domain/constants';
import { AbstractLayerHandler, LOADING_STATUS_VALUE } from './AbstractLayerHandler.ol';
import { RequestCounter } from './RequestCounter';

/**
 * @class MvtLayerHandler
 * LayerHandler implementation for MVT layers
 */
export class MvtLayerHandler extends AbstractLayerHandler {
    constructor (layerPlugin) {
        super(layerPlugin);
        this._log = Oskari.log('WfsMvtLayerPlugin');
        const config = layerPlugin.getConfig();
        if (!config) {
            return;
        }
        this.minZoomLevel = this._getMinZoom(config);
        this._setupTileGrid(config);
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
        const source = new olSourceVectorTile(sourceOpts);
        const vectorTileLayer = new olLayerVectorTile({
            opacity: layer.getOpacity() / 100,
            visible: layer.isVisible(),
            renderMode: 'hybrid',
            source
        });

        this._registerLayerEvents(layer.getId(), source);
        const hoverLayer = this.plugin.vectorFeatureService.registerHoverLayer(layer, source);
        const olLayers = [vectorTileLayer, hoverLayer];
        this.plugin.setOLMapLayers(layer.getId(), olLayers);
        return olLayers;
    }

    _getFeaturesInViewport (layerId) {
        const source = this._getLayerSource(layerId);
        if (!source) {
            return [];
        }
        const { left, bottom, right, top } = this.plugin.getSandbox().getMap().getBbox();
        const extent = [left, bottom, right, top];
        return getMVTFeaturesInExtent(source, extent, WFS_ID_KEY) || [];
    }

    _getMinZoom (config) {
        if (!config.minZoomLevel || !Array.isArray(config.resolutions)) return 0;
        const minResolution = config.resolutions[config.minZoomLevel];
        const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        const mapResolutions = mapModule.getResolutionArray();
        for (let z = 1; z < mapResolutions.length; z++) {
            const curr = mapResolutions[z];
            if (curr === minResolution) {
                return z;
            }
            if (curr < minResolution) {
                const dcurr = Math.abs(curr - minResolution);
                const dprev = Math.abs(mapResolutions[z - 1] - minResolution);
                return dcurr < dprev ? z : z - 1;
            }
        }
        return mapResolutions.length - 1;
    }

    refreshLayer (layer) {
        const source = this._getLayerSource(layer);
        source.tileCache.expireCache({});
        source.tileCache.clear();
        source.clear();
        source.refresh();
        this._log.warn('Server caches MVT-rendered tiles, use GeoJSON for layers that need to be updated at runtime or add a way to update cache on server.');
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

    /**
     * @method _createDebugLayer Helper for debugging purposes.
     * Use from console. Set breakpoint when new olSourceVectorTile() is called
     *  and add desired layer to map.
     *
     * Like so:
     * Set breakpoint on "const source = new olSourceVectorTile(options);"
     * Call this._createDebugLayer(source)
     * @param {ol.source.TileDebug} source layer source
     */
    _createDebugLayer (source) {
        this.plugin.getMapModule().getMap().addLayer(new olLayerTile({
            source: new olSourceTileDebug({
                projection: this.plugin.getMapModule().getMap().getView().getProjection(),
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
        const counter = new RequestCounter();
        source.on('tileloadstart', () => {
            counter.update(LOADING_STATUS_VALUE.LOADING);
            this.tileLoadingStateChanged(layerId, counter);
        });
        source.on('tileloadend', () => {
            counter.update(LOADING_STATUS_VALUE.COMPLETE);
            this.tileLoadingStateChanged(layerId, counter);
        });
        source.on('tileloaderror', () => {
            counter.update(LOADING_STATUS_VALUE.ERROR);
            this.tileLoadingStateChanged(layerId, counter);
        });
    }
}
