import olLayerVectorTile from 'ol/layer/VectorTile';
import {propertiesFromFeature, oskariIdKey} from './FeatureUtil';

export default class ReqEventHandler {
    constructor () {
        this.isClickResponsive = true;
    }
    createEventHandlers (plugin) {
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
                const layerId = plugin.findOlLayerId(ftrAndLyr.layer);
                if (!layerId) {
                    return;
                }
                const sandbox = plugin.getSandbox();
                const layer = sandbox.getMap().getSelectedLayer(layerId);
                if (event.getParams().ctrlKeyDown) {
                    plugin.WFSLayerService.setWFSFeaturesSelections(layer.getId(), [ftrAndLyr.feature.get(oskariIdKey)], false);
                    const featuresSelectedEvent = Oskari.eventBuilder('WFSFeaturesSelectedEvent')(plugin.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, false);
                    sandbox.notifyAll(featuresSelectedEvent);
                } else {
                    var infoEvent = Oskari.eventBuilder('GetInfoResultEvent')({
                        layerId,
                        features: [propertiesFromFeature(ftrAndLyr.feature)],
                        lonlat: event.getLonLat()
                    });
                    sandbox.notifyAll(infoEvent);
                }
            }
        };
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
