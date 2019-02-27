import olSourceVector from 'ol/source/Vector';
import olLayerVector from 'ol/layer/Vector';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import olStyle from 'ol/style/Style';
import olStroke from 'ol/style/Stroke';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';

import ReqEventHandler from './components/ReqEventHandler';
import { selectedStyle } from './components/defaultStyle';
import { styleGenerator, applyOpacity, getCustomStyleEditor, applyEditorStyle } from './components/styleUtils';
import { WFS_ID_KEY } from './components/propertyArrayUtils';

import { LAYER_ID, LAYER_HOVER, LAYER_TYPE, FTR_PROPERTY_ID } from '../../mapmodule/domain/constants';

const WfsLayerModelBuilder = Oskari.clazz.get('Oskari.mapframework.bundle.mapwfs2.domain.WfsLayerModelBuilder');
const AbstractMapLayerPlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.AbstractMapLayerPlugin');

const MAP_MOVE_THROTTLE_MS = 2000;

/**
 * @class Oskari.mapframework.mapmodule.VectorTileLayerPlugin
 * Provides functionality to draw vector tile layers on the map
 */
class WfsVectorLayerPlugin extends AbstractMapLayerPlugin {
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
        const sandbox = this.getSandbox();
        // register domain builder
        const mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if (mapLayerService) {
            mapLayerService.registerLayerModel(this.layertype + 'layer', this._getLayerModelClass());
            mapLayerService.registerLayerModelBuilder(this.layertype + 'layer', this._getModelBuilder());
        }

        this.WFSLayerService = Oskari.clazz.create('Oskari.mapframework.bundle.mapwfs2.service.WFSLayerService', sandbox);
        sandbox.registerService(this.WFSLayerService);
        this.reqEventHandler = new ReqEventHandler(sandbox);

        this._visualizationForm = Oskari.clazz.create('Oskari.userinterface.component.VisualizationForm');
        sandbox.getService('Oskari.mapframework.service.VectorFeatureService').registerLayerType(this.layertype, this);
    }
    /**
     * Override, see superclass
     */
    _getLayerModelClass () {
        return 'Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer';
    }
    _getModelBuilder () {
        return new WfsLayerModelBuilder(this.getSandbox());
    }
    _createPluginEventHandlers () {
        const handlers = {
            AfterMapMoveEvent: Oskari.util.throttle(this._loadFeaturesForAllLayers, MAP_MOVE_THROTTLE_MS),
            AfterChangeMapLayerStyleEvent: event => {
                const oskariLayer = event.getMapLayer();
                this._updateLayerStyle(oskariLayer);
            }
        };
        return {
            ...this.reqEventHandler.createEventHandlers(this),
            ...handlers
        };
    }
    _createRequestHandlers () {
        const me = this;
        const throttledStyleUpdate = Oskari.util.throttle(lyr => this._updateLayerStyle(lyr), 2000);
        return {
            ...this.reqEventHandler.createRequestHandlers(this),
            ChangeMapLayerOpacityRequest: {
                handleRequest (core, request) {
                    const oskariLayer = me._sandbox.findAllSelectedMapLayers()
                        .find(lyr => lyr.getId() === request.getMapLayerId());
                    if (oskariLayer && me.isLayerSupported(oskariLayer)) {
                        oskariLayer.setOpacity(request.getOpacity());
                        throttledStyleUpdate(oskariLayer);
                    }
                }
            }
        };
    }
    getCustomStyleEditorForm (layer) {
        return getCustomStyleEditor(layer, this._visualizationForm);
    }
    applyEditorStyle (layer) {
        applyEditorStyle(layer, this._visualizationForm);
    }
    /**
     * @private @method _updateLayerStyle
     * @param {Oskari.mapframework.mapmodule.VectorTileLayer} oskariLayer
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
     * @param {Oskari.mapframework.domain.AbstractLayer} layer
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
     * @method addMapLayerToMap
     * @private
     * Adds a single vector tile layer to this map
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    addMapLayerToMap (layer, keepLayerOnTop, isBaseMap) {
        const source = this._getLayerSource(layer);
        const style = new olStyle({
            stroke: new olStroke({
                color: 'rgba(255, 0, 255, 1.0)',
                width: 2
            })
        });
        const vectorLayer = new olLayerVector({
            source,
            style,
            renderMode: 'image'
        });
        // Set oskari properties for vector feature service functionalities.
        const silent = true;
        vectorLayer.set(LAYER_ID, layer.getId(), silent);
        vectorLayer.set(LAYER_TYPE, layer.getLayerType(), silent);
        vectorLayer.set(LAYER_HOVER, layer.getHoverOptions(), silent);

        this.mapModule.addLayer(vectorLayer, !keepLayerOnTop);
        this.setOLMapLayers(layer.getId(), vectorLayer);
        vectorLayer.setStyle(style);
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
        // Must be called manually
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

    _loadFeaturesForAllLayers () {
        const mapView = this.mapModule.getMap().getView();
        const extent = mapView.calculateExtent();
        const resolution = mapView.getResolution();
        const projection = mapView.getProjection();
        // Trigger load for wfs layers.
        this._sandbox.findAllSelectedMapLayers()
            .filter(lyr => this.isLayerSupported(lyr))
            .forEach(lyr => this._loadFeaturesForLayer(lyr, extent, resolution, projection));
    }

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
