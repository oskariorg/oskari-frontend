/* eslint-disable new-cap */
import { Cluster as olCluster, Vector as olSourceVector, TileDebug as olSourceTileDebug } from 'ol/source';
import { Vector as olLayerVector, Tile as olLayerTile } from 'ol/layer';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import { tile as tileStrategyFactory } from 'ol/loadingstrategy';
import { createXYZ } from 'ol/tilegrid';

import { AbstractLayerHandler, LOADING_STATUS_VALUE } from './AbstractLayerHandler.ol';
import { RequestCounter } from './RequestCounter';

import olPoint from 'ol/geom/Point';
import olMultiPoint from 'ol/geom/MultiPoint';

import { LAYER_CLUSTER, WFS_ID_KEY } from '../../../../domain/constants';

const MAP_MOVE_THROTTLE_MS = 2000;
const OPACITY_THROTTLE_MS = 1500;

/**
 * @class VectorLayerHandler
 * LayerHandler implementation for vector layers
 */
export class VectorLayerHandler extends AbstractLayerHandler {
    constructor (layerPlugin) {
        super(layerPlugin);
        this.loadingStrategies = {};
    }

    createEventHandlers () {
        const handlers = super.createEventHandlers();
        if (this.plugin.getMapModule().getSupports3D()) {
            handlers.AfterChangeMapLayerOpacityEvent = Oskari.util.throttle(event =>
                this._updateLayerStyle(event.getMapLayer()), OPACITY_THROTTLE_MS);
            handlers.AfterMapMoveEvent = Oskari.util.throttle(() =>
                this._loadFeaturesForAllLayers(), MAP_MOVE_THROTTLE_MS);
        }
        return handlers;
    }

    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        super.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        const opacity = this.plugin.getMapModule().getSupports3D() ? 1 : layer.getOpacity() / 100;
        const renderMode = 'hybrid';
        const visible = layer.isVisible();
        const source = this._createLayerSource(layer);
        const silent = true;
        const vectorLayer = new olLayerVector({
            opacity,
            visible,
            renderMode,
            source
        });
        const olLayers = [vectorLayer];

        // Setup clustering
        const hasClusterDist = layer.getClusteringDistance() !== -1 && typeof layer.getClusteringDistance() !== 'undefined';
        if (this._isClusteringSupported() && hasClusterDist) {
            const clusterSource = new olCluster({
                distance: layer.getClusteringDistance(),
                source,
                geometryFunction: feature => {
                    const geom = feature.getGeometry();
                    if (geom instanceof olPoint) {
                        return geom;
                    }
                    if (geom instanceof olMultiPoint && geom.getPoints().length === 1) {
                        return geom.getPoint(0);
                    }
                    return null;
                }
            });
            const clusterLayer = new olLayerVector({
                opacity,
                visible,
                source: clusterSource
            });
            vectorLayer.on('change:opacity', () => clusterLayer.setOpacity(vectorLayer.getOpacity()));
            clusterLayer.set(LAYER_CLUSTER, true, silent);
            olLayers.push(clusterLayer);
        }
        this.plugin.vectorFeatureService.registerHoverLayer(layer);
        this.plugin.setOLMapLayers(layer.getId(), olLayers);
        if (this.plugin.getMapModule().getSupports3D()) {
            this._loadFeaturesForLayer(layer);
        }
        return olLayers;
    }

    refreshLayer (layer) {
        if (!layer) {
            return;
        }
        const olLayers = this.plugin.getOLMapLayers(layer.getId());
        olLayers.forEach(olLayer => {
            const source = olLayer.getSource();
            if (!source) {
                return;
            }
            source.refresh();
        });
        this._loadFeaturesForLayer(layer);
    }

    /**
     * @private
     * @method _createLayerSource To get an ol vector source for the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol.source.Vector} vector layer source
     */
    _createLayerSource (layer) {
        const map = this.plugin.getMapModule().getMap();
        const projection = map.getView().getProjection();
        const tileSize = (map.getSize() || [0, 0]).map(size => size > 1024 ? 1024 : size > 512 ? 512 : 256);
        const tileGrid = createXYZ({
            extent: projection.getExtent(),
            tileSize
        });
        const strategy = tileStrategyFactory(tileGrid);
        this.loadingStrategies['' + layer.getId()] = strategy;
        const source = new olSourceVector({
            format: new olFormatGeoJSON(),
            url: Oskari.urls.getRoute('GetWFSFeatures'),
            projection,
            strategy
        });
        source.setLoader(this._getFeatureLoader(layer, source));
        return source;
    }

    /**
     * @method _createDebugLayer Helper for debugging purposes.
     * Use from console. Set breakpoint to _createLayerSource and add desired layer to map.
     *
     * Like so:
     * Set breakpoint on "const tileGrid = createXYZ({ ... });"
     * Call this._createDebugLayer(source)
     * @param {ol.source.TileDebug} source layer source
     */
    _createDebugLayer (tileGrid) {
        this.plugin.getMapModule().getMap().addLayer(new olLayerTile({
            source: new olSourceTileDebug({
                projection: this.plugin.getMapModule().getMap().getView().getProjection(),
                tileGrid
            })
        }));
    }

    /**
     * @private
     * @method _getFeatureLoader To get an ol loader impl for the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {ol.source.Vector} source
     * @return {function} loader function for the layer
     */
    _getFeatureLoader (layer, source) {
        const counter = new RequestCounter();
        const updateLoadingStatus = status => {
            counter.update(status);
            this.tileLoadingStateChanged(layer.getId(), counter);
        };
        const replaceId = layer.replaceFeatureId();
        return (extent, resolution, projection) => {
            updateLoadingStatus(LOADING_STATUS_VALUE.LOADING);
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    id: layer.getId(),
                    srs: projection.getCode(),
                    bbox: extent.join(',')
                },
                url: Oskari.urls.getRoute('GetWFSFeatures'),
                success: (resp) => {
                    resp?.features?.forEach(feature => {
                        if (feature?.properties?.geometry) {
                            // Openlayers will override feature.geometry with properties.geometry if both are present
                            // https://github.com/openlayers/openlayers/blob/v7.1.0/src/ol/format/GeoJSON.js#L125-L133
                            // https://github.com/openlayers/openlayers/blob/v7.1.0/src/ol/Feature.js#L260
                            // https://github.com/openlayers/openlayers/blob/v7.1.0/src/ol/Object.js#L229
                            // so we must remove it before passing the GeoJSON to OL
                            delete feature.properties.geometry;
                        }
                    });
                    const features = source.getFormat().readFeatures(resp);
                    features.forEach(ftr => {
                        // workaround for layers which returns generated id for features.
                        // "The feature id is considered stable and may be used when requesting features or comparing identifiers returned from a remote source."
                        if (replaceId) {
                            const id = ftr.getProperties()[replaceId];
                            if (id) {
                                ftr.setId(id);
                            }
                        }
                        ftr.set(WFS_ID_KEY, ftr.getId());
                    });
                    source.addFeatures(features);
                    updateLoadingStatus(LOADING_STATUS_VALUE.COMPLETE);
                },
                error: () => {
                    updateLoadingStatus(LOADING_STATUS_VALUE.ERROR);
                    // mark failed loading so OL retries it later if map moves
                    source.removeLoadedExtent(extent);
                }
            });
        };
    }

    /**
     * @private
     * @method _loadFeaturesForAllLayers Load features to all wfs layers.
     * Uses current map view's extent.
     */
    _loadFeaturesForAllLayers () {
        const mapView = this.plugin.getMap().getView();
        const extent = mapView.calculateExtent();
        const resolution = mapView.getResolution();
        const projection = mapView.getProjection();
        Oskari.getSandbox().findAllSelectedMapLayers()
            .filter(lyr => this.layerIds.includes(lyr.getId()))
            .forEach(lyr => this._loadFeaturesForLayer(lyr, extent, resolution, projection));
    }

    /**
     * @private
     * @method _loadFeaturesForLayer Loads features to the layer.
     *
     * Uses OpenLayers internal methods.
     * Load must be called manually in stacked 3D map mode.
     * (No target container defined for 3D view)
     *
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} lyr
     * @param {ol.Extent} extent (optional)
     * @param {Number} resolution (optional)
     * @param {ol.proj.Projection} projection (optional)
     */
    _loadFeaturesForLayer (lyr, extent, resolution, projection) {
        if (!extent) {
            const mapView = this.plugin.getMap().getView();
            extent = mapView.calculateExtent();
            resolution = mapView.getResolution();
            projection = mapView.getProjection();
        }
        const olLayers = this.plugin.getOLMapLayers(lyr.getId());
        if (olLayers.length === 0) {
            return;
        }
        olLayers.forEach(olLayer => {
            if (!this._shouldLoadFeatures(olLayer, resolution)) {
                return;
            }
            const strategy = this.loadingStrategies['' + lyr.getId()];
            strategy(extent, resolution).forEach(tileExt => {
                olLayer.getSource().loadFeatures(tileExt, resolution, projection);
            });
        });
    }

    _shouldLoadFeatures (olLayer, resolution) {
        if (!olLayer.getVisible()) {
            return false;
        }
        return resolution <= olLayer.getMaxResolution() && resolution >= olLayer.getMinResolution();
    }

    _isClusteringSupported () {
        return !this.plugin.getMapModule().getSupports3D();
    }
};
