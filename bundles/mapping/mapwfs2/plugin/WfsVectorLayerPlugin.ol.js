import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';

import { selectedStyle } from './components/defaultStyle';
import { styleGenerator, applyOpacity } from './components/styleUtils';
import { WFS_ID_KEY } from './components/propertyArrayUtils';
import VectorPluginMixin from './VectorPluginMixin.ol';
import { LAYER_ID, LAYER_HOVER, LAYER_TYPE, FTR_PROPERTY_ID } from '../../mapmodule/domain/constants';

const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');
const MAP_MOVE_THROTTLE_MS = 2000;
const OPACITY_SLIDER_THROTTLE_MS = 2000;

class WfsVectorLayerPlugin extends VectorPluginMixin(AbstractMapLayerPlugin) {
    constructor (config) {
        super(config);
        this.__name = 'WfsVectorLayerPlugin';
        this._clazz = 'Oskari.wfsvector.WfsVectorLayerPlugin';
        this.layertype = 'wfs';
        this.hoverState = {
            layer: null,
            feature: null,
            property: FTR_PROPERTY_ID
        };
    }
    /**
     * @private @method _initImpl
     * Interface method for the module protocol.
     */
    _initImpl () {
        super._initImpl();
        this.getSandbox().getService('Oskari.mapframework.service.VectorFeatureService')
            .registerLayerType(this.layertype, this);
    }
    _createPluginEventHandlers () {
        const AfterMapMoveEvent = Oskari.util.throttle(this._loadFeaturesForAllLayers, MAP_MOVE_THROTTLE_MS);
        const handlers = {
            ...super._createPluginEventHandlers(),
            AfterMapMoveEvent,
            AfterChangeMapLayerStyleEvent (event) {
                const oskariLayer = event.getMapLayer();
                this._updateLayerStyle(oskariLayer);
            }
        };
        return handlers;
    }
    _createRequestHandlers () {
        const updateStyle = Oskari.util.throttle(
            lyr => this._updateLayerStyle(lyr), OPACITY_SLIDER_THROTTLE_MS);
        // Throttle opacity change on slider move to keep the ui alive.
        const handleOpacityChange = (core, request) => {
            const oskariLayer = this.getSandbox().getMap().getSelectedLayer(request.getMapLayerId());
            if (oskariLayer && this.isLayerSupported(oskariLayer)) {
                oskariLayer.setOpacity(request.getOpacity());
                updateStyle(oskariLayer);
            }
        };
        const handlers = {
            ...super._createRequestHandlers(),
            ChangeMapLayerOpacityRequest: {
                handleRequest: handleOpacityChange
            }
        };
        return handlers;
    }
    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} oskariLayer
     */
    _updateLayerStyle (oskariLayer) {
        const olLayers = this.getOLMapLayers(oskariLayer);

        if (olLayers && olLayers.length > 0) {
            const lyr = olLayers[0];
            lyr.setStyle(this._getLayerCurrentStyleFunction(oskariLayer));
            // Trigger features changed to synchronize 3D view
            lyr.getSource().getFeatures().forEach(ftr => ftr.changed());
        }
    }
    /**
     * @private @method _getLayerCurrentStyleFunction
     * Returns OL style corresponding to layer currently selected style
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @return {ol/style/Style}
     */
    _getLayerCurrentStyleFunction (layer) {
        const factory = this.mapModule.getStyle.bind(this.mapModule);
        const styleFunction = styleGenerator(factory, layer, this.hoverState);
        const selectedIds = new Set(this.WFSLayerService.getSelectedFeatureIds(layer.getId()));

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
        // Set oskari properties for vector feature service functionalities.
        const silent = true;
        vectorLayer.set(LAYER_ID, layer.getId(), silent);
        vectorLayer.set(LAYER_TYPE, layer.getLayerType(), silent);
        vectorLayer.set(LAYER_HOVER, layer.getHoverOptions(), silent);

        this.mapModule.addLayer(vectorLayer, !keepLayerOnTop);
        this.setOLMapLayers(layer.getId(), vectorLayer);
        this._loadFeaturesForLayer(layer);
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
            projection: this.getMap().getView().getProjection(), // OL projection object
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
        const mapView = this.mapModule.getMap().getView();
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
            const mapView = this.mapModule.getMap().getView();
            extent = mapView.calculateExtent();
            resolution = mapView.getResolution();
            projection = mapView.getProjection();
        }
        const olLayers = this.getOLMapLayers(lyr.getId());
        if (olLayers.length === 0) {
            return;
        }
        olLayers[0].getSource().loadFeatures(extent, resolution, projection);
    }
};

Oskari.clazz.defineES('Oskari.wfsvector.WfsVectorLayerPlugin', WfsVectorLayerPlugin,
    {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.module.Module', 'Oskari.mapframework.ui.module.common.mapmodule.Plugin']
    }
);

export default WfsVectorLayerPlugin;
