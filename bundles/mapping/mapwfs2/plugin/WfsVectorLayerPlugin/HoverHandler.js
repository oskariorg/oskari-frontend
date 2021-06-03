import { LAYER_HOVER, FTR_PROPERTY_ID, LAYER_ID } from '../../../mapmodule/domain/constants';
import { hoverStyleGenerator } from './util/style';

export class HoverHandler {
    constructor (ftrIdPropertyKey) {
        this.hoverLayers = {};
        this.state = {};
        this.property = ftrIdPropertyKey || FTR_PROPERTY_ID;
        // The same handler instance manages myplaces, userlayers and wfslayers
        // The handler is notified when user hovers the map and doesn't hit a layer of managed type.
        // Hence, the handler is called several times on map hover.
        // Clear hover after there is no hit on any of the managed layer types.
        this.clearHoverThreshold = 10;
        this.noHitsCounter = 0;
    }

    /**
     * @method onMapHover VectorFeatureService handler impl method
     * Handles feature highlighting on map hover.
     *
     * @param { Oskari.mapframework.event.common.MouseHoverEvent } event
     * @param { olRenderFeature } feature
     * @param { olVectorTileLayer } layer
     */
    onMapHover (event, feature, layer) {
        if (!feature) {
            if (this.noHitsCounter > this.clearHoverThreshold) {
                this.clearHover();
                return;
            }
            this.noHitsCounter++;
            return;
        }
        this.noHitsCounter = 0;
        if (this._featureOrIdEqualsCurrent(feature)) {
            return;
        }
        if (this.state.feature && this.state.layer) {
            this.state.layer.getSource().removeFeature(this.state.feature);
        }
        if (feature && layer) {
            const hoverLayer = this.hoverLayers[layer.get(LAYER_ID)];
            if (!hoverLayer) {
                return;
            }
            hoverLayer.getSource().addFeature(feature);
            this.state = {
                feature,
                layer
            };
        }
    }

    addHoverLayer (styleFactory, layer, olLayer) {
        olLayer.setStyle(hoverStyleGenerator(styleFactory, layer));
        this.hoverLayers[layer.getId()] = olLayer;
    }

    clearHover () {
        Object.values(this.hoverLayers).forEach(l => l.getSource().clear());
        this.state = {};
        this.noHitsCounter = 0;
    }

    _featureOrIdEqualsCurrent (feature) {
        if (!this.feature) {
            return false;
        }
        const idProp = this.property;
        return this.feature === feature || this.feature.get(idProp) === feature.get(idProp);
    }

    /**
     * @method onLayerRequest VectorFeatureService handler impl method
     * Handles VectorLayerRequest to update hover tooltip and feature style.
     * Other request options are not currently supported.
     *
     * @param { Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest } request
     * @param { Oskari.mapframework.domain.AbstractLayer|VectorTileLayer } layer
     */
    onLayerRequest (request, layer) {
        const options = request.getOptions();
        if (options.hover) {
            layer.setHoverOptions(options.hover);
            const olLayer = this.hoverLayers(layer.getId());
            if (olLayer) {
                olLayer.setStyle(hoverStyleGenerator(styleFactory, layer));
            }
        }
    }
}
