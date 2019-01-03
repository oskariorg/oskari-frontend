import olLayerVectorTile from 'ol/layer/VectorTile';
import {propsAsArray, WFS_ID_KEY, WFS_FTR_ID_KEY} from './propertyArrayUtils';

export default class ReqEventHandler {
    constructor (sandbox) {
        this.sandbox = sandbox;
        this.isClickResponsive = true;
    }
    createEventHandlers (plugin) {
        const modifySelection = (layer, featureIds, keepPrevious) => {
            plugin.WFSLayerService.setWFSFeaturesSelections(layer.getId(), featureIds, !keepPrevious);
            this.notify('WFSFeaturesSelectedEvent', plugin.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, false);
        };
        const getSelectedLayer = (layerId) => this.sandbox.getMap().getSelectedLayer(layerId);

        const filterOperators = {
            '=': (a, b) => a === b,
            '~=': (a, b) => Oskari.util.stringLike(a, b),
            '≠': (a, b) => a !== b,
            '~≠': (a, b) => !Oskari.util.stringLike(a, b),
            '>': (a, b) => a > b,
            '<': (a, b) => a < b,
            '≥': (a, b) => a <= b,
            '≤': (a, b) => a <= b
        };
        const filterByAttribute = (filter, recordList, fields) => {
            const filterIndex = fields.indexOf(filter.attribute);
            if (filterIndex === -1) {
                return recordList;
            }
            const filteredList = recordList.filter(ftrData => {
                let val = ftrData[filterIndex];
                if (typeof val === 'undefined' || val === null) {
                    return false;
                }
                const isNumType = typeof val === 'number';
                const filterValNum = Number(filter.value);
                let filterVal = isNumType && !isNaN(filterValNum) ? filterValNum : filter.value;
                if (!isNumType && !filter.caseSensitive) {
                    val = val.toUpperCase();
                    filterVal = filterVal.toUpperCase();
                }
                return filterOperators[filter.operator](val, filterVal);
            });
            return filteredList;
        };
        const orderFilterOperations = filters => {
            const filterOrder = [[]];
            let attributeFilters = filterOrder[0];
            filters.forEach(filter => {
                if (filter.attribute) {
                    attributeFilters.push(filter);
                }
                if (!filter.boolean) {
                    return;
                }
                if (filter.boolean === 'AND') {
                    attributeFilters.push(filter);
                } else if (filter.boolean === 'OR') {
                    attributeFilters = [];
                    filterOrder.push(attributeFilters);
                }
            });
            return filterOrder;
        };

        const me = this;
        return {
            'WFSFeaturesSelectedEvent': (event) => {
                plugin._updateLayerStyle(event.getMapLayer());
            },
            'MapClickedEvent': (event) => {
                if (!me.isClickResponsive) {
                    return;
                }
                const ftrAndLyr = plugin.getMap().forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], (feature, layer) => ({feature, layer}));
                if (!ftrAndLyr || !(ftrAndLyr.layer instanceof olLayerVectorTile)) {
                    return;
                }
                const layer = plugin.findLayerByOLLayer(ftrAndLyr.layer);
                if (!layer) {
                    return;
                }
                const keepPrevious = event.getParams().ctrlKeyDown;
                if (keepPrevious) {
                    modifySelection(layer, [ftrAndLyr.feature.get(WFS_ID_KEY)], keepPrevious);
                } else {
                    me.notify('GetInfoResultEvent', {
                        layerId: layer.getId(),
                        features: [propsAsArray(ftrAndLyr.feature.getProperties())],
                        lonlat: event.getLonLat()
                    });
                }
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
                let filteredIds = [];
                // handle filter order (AND/OR)
                const filterOrder = orderFilterOperations(event.getFilters().filters);
                filterOrder.forEach(attributeFilters => {
                    let filteredList = records;
                    attributeFilters.forEach(filter => {
                        filteredList = filterByAttribute(filter, filteredList, fields);
                    });
                    filteredIds = filteredIds.concat(filteredList.map(props => props[idIndex]));
                });
                // Remove duplicates
                filteredIds = filteredIds.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
                modifySelection(layer, filteredIds, false);
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
            'WfsLayerPlugin.ActivateHighlightRequest': this
        };
    }
    // handle WfsLayerPlugin.ActivateHighlightRequest
    handleRequest (oskariCore, request) {
        this.isClickResponsive = request.isEnabled();
    }
}
