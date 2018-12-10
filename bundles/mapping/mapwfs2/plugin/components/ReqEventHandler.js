import olLayerVectorTile from 'ol/layer/VectorTile';
import {propertiesFromFeature, oskariIdKey} from './FeatureUtil';

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

        return {
            'WFSFeaturesSelectedEvent': (event) => {
                plugin._updateLayerStyle(event.getMapLayer());
            },
            'MapClickedEvent': (event) => {
                if (!this.isClickResponsive) {
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
                    modifySelection(layer, [ftrAndLyr.feature.get(oskariIdKey)], keepPrevious);
                } else {
                    this.notify('GetInfoResultEvent', {
                        layerId: layer.getId(),
                        features: [propertiesFromFeature(ftrAndLyr.feature)],
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
                    const intersecting = OLLayer.getSource().getFeaturesIntersectingGeom(filterFeature.geometry);
                    modifySelection(layer, intersecting.map(f => f.get(oskariIdKey)), keepPrevious);
                });
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
