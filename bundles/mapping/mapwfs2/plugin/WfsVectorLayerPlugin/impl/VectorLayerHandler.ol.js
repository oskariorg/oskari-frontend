/* eslint-disable new-cap */
import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';

import { AbstractLayerHandler } from './AbstractLayerHandler.ol';
import { applyOpacity } from '../util/style';
import { WFS_ID_KEY } from '../util/props';

const MAP_MOVE_THROTTLE_MS = 2000;
const OPACITY_THROTTLE_MS = 1500;

/**
 * @class VectorLayerHandler
 * LayerHandler implementation for vector layers
 */
export class VectorLayerHandler extends AbstractLayerHandler {
    createEventHandlers () {
        const handlers = super.createEventHandlers();
        handlers['AfterMapMoveEvent'] = Oskari.util.throttle(() =>
            this._loadFeaturesForAllLayers(), MAP_MOVE_THROTTLE_MS);

        if (this.plugin.getMapModule().has3DSupport()) {
            handlers['AfterChangeMapLayerOpacityEvent'] = Oskari.util.throttle(event =>
                this._updateLayerStyle(event.getMapLayer()), OPACITY_THROTTLE_MS);
        }
        return handlers;
    }
    getStyleFunction (layer, styleFunction, selectedIds) {
        return (feature, resolution) => {
            const isSelected = selectedIds.has(feature.get(WFS_ID_KEY));
            const style = styleFunction(feature, resolution, isSelected);
            if (!this.plugin.getMapModule().has3DSupport()) {
                return style;
            }
            return applyOpacity(style, layer.getOpacity());
        };
    }
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        super.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
        const opacity = this.plugin.getMapModule().has3DSupport() ? 1 : layer.getOpacity() / 100;
        const source = this._getLayerSource(layer);
        const vectorLayer = new olLayerVector({
            opacity,
            visible: layer.isVisible(),
            renderMode: 'image',
            source
        });
        this.plugin.getMapModule().addLayer(vectorLayer, !keepLayerOnTop);
        this.plugin.setOLMapLayers(layer.getId(), vectorLayer);
        this._loadFeaturesForLayer(layer);
        return vectorLayer;
    }
    /**
     * @private
     * @method _getLayerSource To get an ol vector source for the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol.source.Vector} vector layer source
     */
    _getLayerSource (layer) {
        var source = new olSourceVector({
            format: new olFormatGeoJSON(),
            url: Oskari.urls.getRoute('GetWFSFeatures'),
            projection: this.plugin.getMap().getView().getProjection(), // OL projection object
            strategy: bboxStrategy
        });
        source.setLoader(this._getFeatureLoader(layer, source));
        return source;
    }
    /**
     * @private
     * @method _getFeatureLoader To get an ol loader impl for the layer.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {ol.source.Vector} source
     * @return {function} loader function for the layer
     */
    _getFeatureLoader (layer, source) {
        return (extent, resolution, projection) => {
            this.plugin.getMapModule().loadingState(layer.getId(), true);
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
                    source.addFeatures(source.getFormat().readFeatures(resp));
                    this.plugin.getMapModule().loadingState(layer.getId(), false);
                },
                error: () => {
                    source.removeLoadedExtent(extent);
                    this.plugin.getMapModule().loadingState(layer.getId(), null, true);
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
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
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
        olLayers[0].getSource().loadFeatures(extent, resolution, projection);
    }
    updateLayerProperties (layer, source = this._getSourceForLayer(layer)) {
        /*

        TODO: Fix feature _oid property for geojson

        const {left, bottom, right, top} = this.plugin.getSandbox().getMap().getBbox();
        const features = source.getFeaturesInExtent([left, bottom, right, top]);
        const propsList = features.map(ftr => ftr.getProperties());
        const {fields, properties} = getFieldsAndPropsArrays(propsList);
        layer.setActiveFeatures(properties);
        // Update fields and locales only if fields is not empty and it has changed
        if (fields && fields.length > 0 && !Oskari.util.arraysEqual(layer.getFields(), fields)) {
            layer.setFields(fields);
            this.plugin.setLayerLocales(layer);
        }
        this.plugin.notify('WFSPropertiesEvent', layer, layer.getLocales(), fields);
        */
    }
    _getSourceForLayer (oskariLayer) {
        const olLayers = this.plugin.getOLMapLayers(oskariLayer);
        if (olLayers && olLayers.length > 0) {
            return olLayers[0].getSource();
        }
    }
};
