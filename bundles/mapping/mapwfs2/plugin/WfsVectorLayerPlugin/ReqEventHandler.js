import { processFeatureProperties } from './util/props';
import { WFS_ID_KEY, WFS_FTR_ID_KEY } from '../../../mapmodule/domain/constants';
import { filterByAttribute, getFilterAlternativesAsArray } from './util/filter';

export class ReqEventHandler {
    constructor (sandbox) {
        this.sandbox = sandbox;
        this.isClickResponsive = true;
    }

    createEventHandlers (plugin) {
        const me = this;
        const getSelectedLayer = (layerId) => this.sandbox.getMap().getSelectedLayer(layerId);
        const getSelectedHandler = () => plugin.vectorFeatureService.getSelectedFeatureHandler();
        const getSelectionHandler = () => plugin.vectorFeatureService.getSelectionService();
        return {
            MapClickedEvent: (event) => {
                if (!me.isClickResponsive) {
                    return;
                }
                const hits = plugin.getMapModule().getFeaturesAtPixel(event.getMouseX(), event.getMouseY());
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
                /*
                if (keepPrevious) {
                    Object.values(modifySelectionOpts)
                        .forEach(({ layer, features }) => getSelectedHandler().setFeaturesSelections(layer, features, keepPrevious));
                }
                */
                if (keepPrevious) {
                    Object.keys(modifySelectionOpts).forEach(layerId => {
                        const service = getSelectionHandler();
                        modifySelectionOpts[layerId].features
                            .map(feat => feat.getId())
                            .forEach(featureId => service.toggleFeatureSelection(layerId, featureId));
                    });
                }
            },
            WFSSetFilter: (event) => {
                const keepPrevious = Oskari.ctrlKeyDown();
                const fatureCollection = event.getGeoJson();
                const filterFeature = fatureCollection.features[0];
                if (['Polygon', 'MultiPolygon'].indexOf(filterFeature.geometry.type) >= 0 && typeof filterFeature.properties.area !== 'number') {
                    return;
                }
                var targetLayers;
                if (plugin.WFSLayerService.getAnalysisWFSLayerId()) {
                    targetLayers = [plugin.WFSLayerService.getAnalysisWFSLayerId()];
                } else {
                    if (event.selectFromAllLayers()) {
                        targetLayers = plugin.getAllLayerIds();
                    } else {
                        const layerId = plugin.WFSLayerService.getTopWFSLayer();
                        targetLayers = layerId ? [layerId] : [];
                    }
                }
                targetLayers.forEach(layerId => {
                    const propsList = plugin.getPropertiesForIntersectingGeom(filterFeature.geometry, layerId);
                    const selectedFeatureIds = propsList.map(props => props[WFS_ID_KEY]);
                    //getSelectedHandler().setFeatureSelectionsByIds(layerId, propsList.map(props => props[WFS_ID_KEY]), keepPrevious);
                    if (keepPrevious) {
                        selectedFeatureIds.forEach(id => this.getVectorFeatureService().getSelectionService().addSelectedFeature(layerId, id));
                    } else {
                        this.getVectorFeatureService().getSelectionService().setSelectedFeatureIds(layerId, selectedFeatureIds);
                    }
                });
            },
            WFSSetPropertyFilter: event => {
                if (!event.getFilters() || event.getFilters().filters.length === 0) {
                    return;
                }
                const layerId = event.getLayerId();
                const records = plugin.getLayerFeaturePropertiesInViewport(layerId);
                if (!records || records.length === 0) {
                    return;
                }
                const filteredIds = new Set();
                const alternatives = getFilterAlternativesAsArray(event);
                alternatives.forEach(attributeFilters => {
                    let filteredList = records;
                    attributeFilters.forEach(filter => {
                        filteredList = filterByAttribute(filter, filteredList);
                    });
                    filteredList.forEach(props => filteredIds.add(props[WFS_FTR_ID_KEY]));
                });
                //getSelectedHandler().setFeatureSelectionsByIds(layerId, [...filteredIds], false);
                getSelectionHandler().setSelectedFeatureIds(layerId, [...filteredIds]);
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
