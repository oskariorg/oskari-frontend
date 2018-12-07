import olLayerVectorTile from 'ol/layer/VectorTile';
import {propertiesFromFeature, oskariIdKey} from './FeatureUtil';

export default class ReqEventHandler {
    constructor (sandbox) {
        this.sandbox = sandbox;
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
                const layer = plugin.findLayerByOLLayer(ftrAndLyr.layer);
                if (!layer) {
                    return;
                }
                if (event.getParams().ctrlKeyDown) {
                    plugin.WFSLayerService.setWFSFeaturesSelections(layer.getId(), [ftrAndLyr.feature.get(oskariIdKey)], false);
                    this._notify('WFSFeaturesSelectedEvent', plugin.WFSLayerService.getSelectedFeatureIds(layer.getId()), layer, false);
                } else {
                    this._notify('GetInfoResultEvent', {
                        layerId: layer.getId(),
                        features: [propertiesFromFeature(ftrAndLyr.feature)],
                        lonlat: event.getLonLat()
                    });
                }
            },
            'AfterMapMoveEvent': () => {
                plugin.getAllLayers().forEach(layer => plugin.updateLayerProperties(layer));
            }
        };
    }
    _notify (eventName, ...args) {
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
