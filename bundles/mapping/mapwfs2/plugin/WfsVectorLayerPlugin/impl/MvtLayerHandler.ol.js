/* eslint-disable new-cap */
import olLayerVectorTile from 'ol/layer/VectorTile';
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

        this.counters = new Map();
        this.countersWithInitialValue = {
            started: 0,
            success: 0,
            error: 0
        };

        this.timers = new Map();
        this.timerDelayInMillis = 60000;
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
        const vectorTileLayer = new olLayerVectorTile({
            opacity: layer.getOpacity() / 100,
            visible: layer.isVisible(),
            renderMode: 'hybrid',
            source
        });
        this.plugin.getMapModule().addLayer(vectorTileLayer, !keepLayerOnTop);
        this.plugin.setOLMapLayers(layer.getId(), vectorTileLayer);

        this._initializeCountersForLayer(layer.getId());
        this._registerLayerEvents(layer.getId(), source);

        return vectorTileLayer;
    }

    refreshLayer (layer) {
        const source = this._getLayerSource(layer);
        source.tileCache.expireCache({});
        source.tileCache.clear();
        source.clear();
        source.refresh();
    }

    _initializeCountersForLayer (layerId) {
        this.counters.set(layerId, { ...this.countersWithInitialValue });
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
        source.on('tileloadstart', () => {
            const tileCounter = this.counters.get(layerId);
            tileCounter.started++;
            this.plugin.getMapModule().loadingState(layerId, true);
            this._sendWFSStatusChangedEvent(layerId, tileCounter, 'tileloadstart');
        });
        source.on('tileloadend', () => {
            const tileCounter = this.counters.get(layerId);
            tileCounter.success++;
            this.plugin.getMapModule().loadingState(layerId, false);
            this._sendWFSStatusChangedEvent(layerId, tileCounter, 'tileloadend');
        });
        source.on('tileloaderror', () => {
            const tileCounter = this.counters.get(layerId);
            tileCounter.error++;
            this.plugin.getMapModule().loadingState(layerId, null, true);
            this._sendWFSStatusChangedEvent(layerId, tileCounter, 'tileloaderror');
        });
    }

    _sendWFSStatusChangedEvent (layerId, tileCounter, tileLoadStatusEvent) {
        switch (tileLoadStatusEvent) {
        case 'tileloadstart':

            if (tileCounter.started === 1) {
                super.sendWFSStatusChangedEvent(layerId, 'loading');
                this._setTimer(layerId, tileCounter);
            }
            break;
        case 'tileloadend':
        case 'tileloaderror':

            if (this._tileLoadingsFailed(tileCounter)) {
                this._resetTimer(layerId);
                super.sendWFSStatusChangedEvent(layerId, 'error');
                this._resetCounter(tileCounter);
            } else if (this._tileLoadingsAreDone(tileCounter)) {
                this._resetTimer(layerId);
                super.sendWFSStatusChangedEvent(layerId, 'complete');
                this._resetCounter(tileCounter);
            }
            break;
        default:
            Oskari.log(this.getName()).error('Unsupported tileLoadStatusEvent: ' + tileLoadStatusEvent);
        }
    }

    _tileLoadingsFailed (tileCounter) {
        return tileCounter.error >= tileCounter.started;
    }

    _tileLoadingsAreDone (tileCounter) {
        return tileCounter.success + tileCounter.error >= tileCounter.started;
    }

    _tileLoadingInProgress (tileCounter) {
        return tileCounter.started > tileCounter.success + tileCounter.error;
    }

    _resetCounter (tileCounter) {
        tileCounter.error = 0;
        tileCounter.success = 0;
        tileCounter.started = 0;
    }

    _setTimer (layerId, tileCounter) {
        this._resetTimer(layerId);
        this.timers.set(layerId, setTimeout(() => {
            if (this._tileLoadingInProgress(tileCounter)) {
                super.sendWFSStatusChangedEvent(layerId, 'error');
            }
        }, this.timerDelayInMillis));
    }

    _resetTimer (layerId) {
        if (this.timers.get(layerId)) {
            clearTimeout(this.timers.get(layerId));
        }
    }
}
