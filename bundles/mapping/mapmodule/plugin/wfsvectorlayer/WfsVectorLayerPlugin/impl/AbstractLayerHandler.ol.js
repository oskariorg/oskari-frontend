import { Cluster as olCluster } from 'ol/source';
import { filterFeaturesByAttribute, filterFeaturesByGeometry } from '../../../../util/vectorfeatures/filter';
import { getFeatureAsGeojson } from '../../../../util/vectorfeatures/jsonHelper';
import { getZoomLevelHelper } from '../../../../util/scale';
import { SelectionHelper } from './SelectionHelper';

const LOADING_STATUS_VALUE = {
    COMPLETE: 'complete',
    LOADING: 'loading',
    ERROR: 'error'
};
export { LOADING_STATUS_VALUE };

export class AbstractLayerHandler {
    constructor (layerPlugin) {
        this.plugin = layerPlugin;
        this.layerIds = [];
        this.throttledUpdates = new Map();
        this._log = Oskari.log('Oskari.mapping.mapmodule.AbstractLayerHandler');
        this.sb = Oskari.getSandbox();

        this.loadingTimers = new Map();
        this.timerDelayInMillis = 60000;
        this.selectionHelper = new SelectionHelper(layerPlugin);
    }

    /**
     * @method addMapLayerToMap Adds wfs layer to map
     * Implementing classes should call this function by super.addMapLayerToMap()
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        this.layerIds.push(layer.getId());
    }

    /**
     * @method createEventHandlers Creates layer handler specific event handlers
     */
    createEventHandlers () {
        return {
            AfterChangeMapLayerStyleEvent: event => this._updateLayerStyle(event.getMapLayer()),
            AfterChangeMapLayerOpacityEvent: event => this._updateLayerOpacity(event.getMapLayer()),
            MapLayerVisibilityChangedEvent: event => this._updateLayerStyle(event.getMapLayer()),
            WFSFeaturesSelectedEvent: event => this._updateSelection(event.getMapLayer(), event.getWfsFeatureIds())
        };
    }

    /**
     * @method getLayerStyleFunction
     * Returns OL style corresponding to the layer's selected style
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {function} styleFunction
     * @param {[number|string]} selectedIds
     * @return {function} style function for the layer
     */
    getStyleFunction (layer, styleFunction, selectedIds) {
        this._log.debug('TODO: getStyleFunction() not implemented on LayerHandler');
    }

    /**
     * @method refreshLayer forces feature update on layer
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    refreshLayer (layer) {
        this._log.debug('TODO: refreshLayer() not implemented on LayerHandler');
    }

    getFeaturesWithFilter (layerId, geojson = {}) {
        const features = this._getFeaturesInViewport(layerId);
        if (!features.length) {
            return [];
        }
        let geojsonFeatures = features.map(feat => getFeatureAsGeojson(feat));
        if (geojson && geojson.geometry) {
            geojsonFeatures = filterFeaturesByGeometry(geojsonFeatures, geojson.geometry);
        }
        if (geojson && geojson.properties) {
            geojsonFeatures = filterFeaturesByAttribute(geojsonFeatures, geojson.properties);
        }
        return geojsonFeatures;
    }

    _getFeaturesInViewport (layerId) {
        const source = this._getLayerSource(layerId);
        if (!source) {
            return [];
        }
        const { left, bottom, right, top } = this.plugin.getSandbox().getMap().getBbox();
        const extent = [left, bottom, right, top];
        return source.getFeaturesInExtent(extent) || [];
    }

    /**
     * Returns source corresponding to given layer
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer or layerId
     * @return {ol/source/VectorTile}
     */
    _getLayerSource (layer) {
        const olLayers = this.plugin.getOLMapLayers(layer) || [];
        const mainLayer = olLayers.length ? olLayers[0] : null;
        if (!mainLayer) {
            return;
        }
        let source = mainLayer.getSource();
        if (source instanceof olCluster) {
            // Get wrapped vector source
            source = source.getSource();
        }
        return source;
    }

    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _updateLayerStyle (layer) {
        if (!this.layerIds.includes(layer.getId())) {
            return;
        }
        this.plugin.updateLayerStyle(layer);
        this.selectionHelper.updateSelectionStyles(layer);
    }

    _updateSelection (layer, featureIds) {
        if (!this.layerIds.includes(layer.getId())) {
            return;
        }
        this.selectionHelper.updateSelection(layer, featureIds);
    }

    /**
     * @private @method _updateLayerOpacity
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _updateLayerOpacity (layer) {
        if (!this.layerIds.includes(layer.getId())) {
            return;
        }
        const olLayers = this.plugin.getOLMapLayers(layer);
        if (!olLayers || olLayers.length === 0) {
            return;
        }
        olLayers[0].setOpacity(layer.getOpacity() / 100);
    }

    applyZoomBounds (layerDef, layerImpl) {
        const mapModule = this.plugin.getMapModule();
        const zoomLevelHelper = getZoomLevelHelper(mapModule.getScaleArray());
        zoomLevelHelper.setOLZoomLimits(layerImpl, layerDef.getMinScale(), layerDef.getMaxScale());
    }

    sendWFSStatusChangedEvent (layerId, status) {
        const loadEvent = Oskari.eventBuilder('WFSStatusChangedEvent')(layerId);
        loadEvent.setRequestType(loadEvent.type.image);
        this._setLoadingStatusToEvent(loadEvent, status);
        this.sb.notifyAll(loadEvent);
    }

    _setLoadingStatusToEvent (loadEvent, status) {
        switch (status) {
        case LOADING_STATUS_VALUE.LOADING:
            loadEvent.setStatus(loadEvent.status.loading);
            break;
        case LOADING_STATUS_VALUE.COMPLETE:
            loadEvent.setStatus(loadEvent.status.complete);
            break;
        case LOADING_STATUS_VALUE.ERROR:
            loadEvent.setStatus(loadEvent.status.error);
            break;
        default:
            Oskari.log(this.getName()).error('Unsupported status: ' + status);
        }
    }

    /**
     * @method tileLoadingStateChanged
     * @param layerId
     * @param {RequestCounter} counter
     */
    tileLoadingStateChanged (layerId, counter) {
        if (counter.getLastStatusUpdate() === LOADING_STATUS_VALUE.LOADING) {
            this.plugin.getMapModule().loadingState(layerId, true);
            if (counter.isFirstPending()) {
                this.sendWFSStatusChangedEvent(layerId, LOADING_STATUS_VALUE.LOADING);
                this._setTimer(layerId, counter);
            }
            return;
        }
        if (counter.getLastStatusUpdate() === LOADING_STATUS_VALUE.ERROR) {
            this.plugin.getMapModule().loadingState(layerId, null, true);
        } else if (counter.getLastStatusUpdate() === LOADING_STATUS_VALUE.COMPLETE) {
            this.plugin.getMapModule().loadingState(layerId, false);
        }
        const loadingStatus = counter.getFinishedStatus();
        if (!loadingStatus) {
            return;
        }
        this._resetTimer(layerId);
        this.sendWFSStatusChangedEvent(layerId, loadingStatus);
        counter.reset();
    }

    _setTimer (layerId, counter) {
        this._resetTimer(layerId);
        this.loadingTimers.set(layerId, setTimeout(() => {
            if (counter.isPending()) {
                this.sendWFSStatusChangedEvent(layerId, LOADING_STATUS_VALUE.ERROR);
                counter.reset();
            }
        }, this.timerDelayInMillis));
    }

    _resetTimer (layerId) {
        if (this.loadingTimers.get(layerId)) {
            clearTimeout(this.loadingTimers.get(layerId));
        }
    }
}
