import { LAYER_HOVER, FTR_PROPERTY_ID } from '../../../mapmodule/domain/constants';

export class HoverHandler {
    constructor (ftrIdPropertyKey) {
        this.layer = null;
        this.feature = null;
        this.property = ftrIdPropertyKey || FTR_PROPERTY_ID;
        // The same handler instance manages myplaces, userlayers and wfslayers
        // The handler is notified when user hovers the map and doesn't hit a layer of managed type.
        // Hence, the handler is called several times on map hover.
        // Clear hover after there is no hit on any of the managed layer types.
        this.clearHoverThreshold = 10;
        this.noHitsCounter = 0;
    }
    isHovered (feature) {
        if (!feature || !this.feature) {
            return false;
        }
        return feature.get(this.property) === this.feature.get(this.property);
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
                this._clearHover();
                return;
            }
            this.noHitsCounter++;
            return;
        }
        this.noHitsCounter = 0;
        if (this._featureOrIdEqualsCurrent(feature)) {
            return;
        }
        const previousLayer = this.layer;
        this.feature = feature;
        this.layer = layer;
        // update previously hovered layer
        if (previousLayer) {
            previousLayer.changed();
        }
        // update currently hovered layer
        if (this.layer && this.layer !== previousLayer) {
            this.layer.changed();
        }
    }

    _clearHover () {
        if (!this.layer) {
            return;
        }
        this.feature = null;
        this.layer.changed();
        this.layer = null;
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
            const olLayers = this.getOLMapLayers(layer.getId());
            if (olLayers) {
                olLayers.forEach(lyr => {
                    lyr.set(LAYER_HOVER, layer.getHoverOptions());
                    lyr.setStyle(this._getLayerCurrentStyleFunction(layer));
                });
            }
        }
    }
}
