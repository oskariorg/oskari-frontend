import olLayerVectorTile from 'ol/layer/VectorTile';
import {propsAsArray, WFS_ID_KEY, WFS_FTR_ID_KEY} from './propertyArrayUtils';
import {filterByAttribute, getFilterAlternativesAsArray} from './filterUtils';

export default class ReqEventHandler {
    constructor (sandbox) {
        this.sandbox = sandbox;
        this.isClickResponsive = true;
    }
    createEventHandlers (plugin) {
        const me = this;
        const modifySelection = (layer, featureIds, keepPrevious) => {
            plugin.WFSLayerService.setWFSFeaturesSelections(layer.getId(), featureIds, !keepPrevious);
            this.notify('WFSFeaturesSelectedEvent', plugin.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, false);
        };
        const getSelectedLayer = (layerId) => this.sandbox.getMap().getSelectedLayer(layerId);
        return {
            'WFSFeaturesSelectedEvent': (event) => {
                plugin._updateLayerStyle(event.getMapLayer());
            },
            'MapClickedEvent': (event) => {
                if (!me.isClickResponsive) {
                    return;
                }
                const hits = [];
                plugin.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], (feature, layer) => {
                    hits.push({feature, layer});
                }, {
                    layerFilter: (layer) => {
                        return layer instanceof olLayerVectorTile && plugin.findLayerByOLLayer(layer);
                    }
                });

                const keepPrevious = event.getParams().ctrlKeyDown;
                hits.forEach((ftrAndLyr) => {
                    const layer = plugin.findLayerByOLLayer(ftrAndLyr.layer);
                    if (keepPrevious) {
                        modifySelection(layer, [ftrAndLyr.feature.get(WFS_ID_KEY)], keepPrevious);
                    } else {
                        me.notify('GetInfoResultEvent', {
                            layerId: layer.getId(),
                            features: [propsAsArray(ftrAndLyr.feature.getProperties())],
                            lonlat: event.getLonLat()
                        });
                    }
                });
            },
            'AfterMapMoveEvent': () => {
                plugin.getAllLayerIds().forEach(layerId => {
                    const layer = getSelectedLayer(layerId);
                    plugin.updateLayerProperties(layer);
                });
            },
            'WFSSetFilter': (event) => {
                const keepPrevious = Oskari.ctrlKeyDown();
                const fatureCollection = event.getGeoJson();
                const filterFeature = fatureCollection.features[0];
                if (['Polygon', 'MultiPolygon'].indexOf(filterFeature.geometry.type) >= 0 && typeof filterFeature.properties.area !== 'number') {
                    return;
                }
                const targetLayers = plugin.WFSLayerService.isSelectFromAllLayers() ? plugin.getAllLayerIds() : [plugin.WFSLayerService.getTopWFSLayer()];
                targetLayers.forEach(layerId => {
                    const layer = getSelectedLayer(layerId);
                    const OLLayer = plugin.getOLMapLayers(layer)[0];
                    const propsList = OLLayer.getSource().getPropsIntersectingGeom(filterFeature.geometry);
                    modifySelection(layer, propsList.map(props => props[WFS_ID_KEY]), keepPrevious);
                });
            },
            'WFSSetPropertyFilter': event => {
                if (!event.getFilters() || event.getFilters().filters.length === 0) {
                    return;
                }
                const layer = getSelectedLayer(event.getLayerId());
                if (!layer) {
                    return;
                }
                const records = layer.getActiveFeatures();
                if (!records || records.length === 0) {
                    return;
                }
                const fields = layer.getFields();
                const idIndex = fields.indexOf(WFS_FTR_ID_KEY);
                const filteredIds = new Set();
                const alternatives = getFilterAlternativesAsArray(event);
                alternatives.forEach(attributeFilters => {
                    let filteredList = records;
                    attributeFilters.forEach(filter => {
                        filteredList = filterByAttribute(filter, filteredList, fields);
                    });
                    filteredList.forEach(props => filteredIds.add(props[idIndex]));
                });
                modifySelection(layer, [...filteredIds], false);
            }
        };
    }
    notify (eventName, ...args) {
        var builder = Oskari.eventBuilder(eventName);
        if (!builder) {
            return;
        }
        this.sandbox.notifyAll(builder.apply(null, args));
    }
    createRequestHandlers (plugin) {
        return {
            'WfsLayerPlugin.ActivateHighlightRequest': this,
            'ShowOwnStyleRequest': Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapwfs2.request.ShowOwnStyleRequestHandler',
                plugin
            )
        };
    }
    // handle WfsLayerPlugin.ActivateHighlightRequest
    handleRequest (oskariCore, request) {
        this.isClickResponsive = request.isEnabled();
    }
}
