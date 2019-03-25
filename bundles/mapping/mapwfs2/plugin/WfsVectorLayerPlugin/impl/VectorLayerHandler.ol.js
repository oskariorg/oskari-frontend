/* eslint-disable new-cap */
import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';

import { applyOpacity, selectedStyle } from '../util/style';
import { WFS_ID_KEY } from '../util/props';

const MAP_MOVE_THROTTLE_MS = 2000;
const OPACITY_THROTTLE_MS = 1500;

export class VectorLayerHandler {
    constructor (layerPlugin) {
        this.plugin = layerPlugin;
    }
    createEventHandlers () {
        const updateStyle = event => this._updateLayerStyle(event.getMapLayer());

        const throttleLoadFeatures = Oskari.util.throttle(
            this._loadFeaturesForAllLayers, MAP_MOVE_THROTTLE_MS);

        const throttleUpdateStyle = Oskari.util.throttle(
            event => updateStyle(event), OPACITY_THROTTLE_MS);

        const handlers = {
            AfterMapMoveEvent: throttleLoadFeatures,
            AfterChangeMapLayerStyleEvent: updateStyle,
            AfterChangeMapLayerOpacityEvent: throttleUpdateStyle
        };
        return handlers;
    }
    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} oskariLayer
     */
    _updateLayerStyle (oskariLayer) {
        if (!this.isLayerSupported(oskariLayer)) {
            return;
        }
        const olLayers = this.plugin.getOLMapLayers(oskariLayer);

        if (olLayers && olLayers.length > 0) {
            const lyr = olLayers[0];
            lyr.setStyle(this.plugin.getCurrentStyleFunction(oskariLayer));
            // Trigger features changed to synchronize 3D view
            lyr.getSource().getFeatures().forEach(ftr => ftr.changed());
        }
    }
    /**
     * @private @method getLayerStyleFunction
     * Returns OL style corresponding to layer currently selected style
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {function} styleFunction
     * @param {[number|string]} selectedIds
     * @return {function} style function for the layer
     */
    getStyleFunction (layer, styleFunction, selectedIds) {
        return (feature, resolution) => {
            if (selectedIds.has(feature.get(WFS_ID_KEY))) {
                return applyOpacity(selectedStyle(feature, resolution), layer.getOpacity());
            }
            return styleFunction(feature, resolution);
        };
    }
    /**
     * @method addMapLayerToMap Adds wfs layer to map
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        const source = this._getLayerSource(layer);
        const vectorLayer = new olLayerVector({
            source,
            renderMode: 'image'
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
            projection: this.layerPlugin.getMap().getView().getProjection(), // OL projection object
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
                },
                error: () => {
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
        this._sandbox.findAllSelectedMapLayers()
            .filter(lyr => this.isLayerSupported(lyr))
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
};
