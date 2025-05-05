import { processFeatureProperties } from './util/props';
import { WFS_ID_KEY, WFS_FTR_ID_KEY } from '../../../mapmodule/domain/constants';
import { getFilterAlternativesAsArray, filterFeaturesByAttribute } from '../../../mapmodule/util/vectorfeatures/filter';

const getFeatureId = (feature) => feature.id || feature.properties[WFS_ID_KEY] || feature.properties[WFS_FTR_ID_KEY];
export class ReqEventHandler {
    constructor (sandbox) {
        this.sandbox = sandbox;
        this.isClickResponsive = true;
    }

    createEventHandlers (plugin) {
        const me = this;
        const getSelectedLayer = (layerId) => this.sandbox.getMap().getSelectedLayer(layerId);
        const getSelectionService = () => this.sandbox.getService('Oskari.mapframework.service.VectorFeatureSelectionService');
        return {
            MapClickedEvent: (event) => {
                if (!me.isClickResponsive) {
                    return;
                }
                const hits = plugin.getMapModule().getFeaturesAtPixel(event.getMouseX(), event.getMouseY(), event.isTouchEvent());
                const keepPrevious = event.getParams().ctrlKeyDown;
                const modifySelectionOpts = {};
                const getSelectionOptsForLayer = layer => {
                    let selectionOpts = modifySelectionOpts[layer.getId()];
                    if (!selectionOpts) {
                        selectionOpts = { layer, features: [] };
                        modifySelectionOpts[layer.getId()] = selectionOpts;
                    }
                    return selectionOpts;
                };
                hits.forEach(({ featureProperties, layerId, feature }) => {
                    const layer = getSelectedLayer(layerId);
                    if (!layer || !plugin.isLayerSupported(layer)) {
                        return;
                    }
                    if (keepPrevious) {
                        getSelectionOptsForLayer(layer).features.push(feature);
                    } else {
                        plugin.notify('GetInfoResultEvent', {
                            layerId,
                            features: [processFeatureProperties(featureProperties, true)],
                            lonlat: event.getLonLat()
                        });
                    }
                });
                if (keepPrevious) {
                    const service = getSelectionService();
                    if (service) {
                        Object.keys(modifySelectionOpts).forEach(layerId => {
                            modifySelectionOpts[layerId].features
                                .map(feat => feat.getId())
                                .forEach(featureId => service.toggleFeatureSelection(layerId, featureId));
                        });
                    }
                }
            },
            WFSSetFilter: (event) => {
                const service = getSelectionService();
                if (!service) {
                    return;
                }
                const keepPrevious = Oskari.ctrlKeyDown();
                const featureCollection = event.getGeoJson();
                const filterFeature = featureCollection.features[0];
                if (['Polygon', 'MultiPolygon'].indexOf(filterFeature.geometry.type) >= 0 && typeof filterFeature.properties.area !== 'number') {
                    return;
                }
                let targetLayers;
                if (event.selectFromAllLayers()) {
                    targetLayers = plugin.getAllLayerIds();
                } else {
                    const layerId = plugin.WFSLayerService.getTopWFSLayer();
                    targetLayers = layerId ? [layerId] : [];
                }
                const featuresResult = plugin.getFeatures({
                    geometry: filterFeature.geometry
                }, {
                    layers: targetLayers
                });
                Object.keys(featuresResult).forEach(layerId => {
                    const layerFeatures = featuresResult[layerId].features || [];
                    const selectedFeatureIds = layerFeatures.map(getFeatureId);

                    if (keepPrevious) {
                        selectedFeatureIds.forEach(id => service.addSelectedFeature(layerId, id));
                    } else {
                        service.setSelectedFeatureIds(layerId, selectedFeatureIds);
                    }
                });
            },
            WFSSetPropertyFilter: event => {
                if (!event.getFilters() || event.getFilters().filters.length === 0) {
                    return;
                }
                const service = getSelectionService();
                if (!service) {
                    return;
                }
                const layerId = event.getLayerId();
                const featuresResult = plugin.getFeatures(null, { layers: [layerId] });
                const records = featuresResult[layerId].features || [];
                if (!records.length) {
                    return;
                }
                const filteredIds = new Set();
                // filters is an object with key "filters" that we actually want to process...
                const { filters = [] } = event.getFilters();
                const alternatives = getFilterAlternativesAsArray(filters);
                alternatives.forEach(attributeFilters => {
                    let filteredList = records;
                    attributeFilters.forEach(filter => {
                        filteredList = filterFeaturesByAttribute(filteredList, filter);
                    });
                    filteredList
                        .map(getFeatureId)
                        .filter(id => !!id)
                        .forEach(id => filteredIds.add(id));
                });
                service.setSelectedFeatureIds(layerId, [...filteredIds]);
            }
        };
    }

    createRequestHandlers () {
        return {
            'WfsLayerPlugin.ActivateHighlightRequest': this
        };
    }

    // handle WfsLayerPlugin.ActivateHighlightRequest
    handleRequest (oskariCore, request) {
        this.isClickResponsive = request.isEnabled();
    }
}
