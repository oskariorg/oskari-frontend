import { LAYER_HOVER, FTR_PROPERTY_ID } from '../../../mapmodule/domain/constants';

export class HoverHandler {
    constructor (ftrIdPropertyKey) {
        this.layer = null;
        this.feature = null;
        this.property = ftrIdPropertyKey || FTR_PROPERTY_ID;
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
        if (feature === this.feature) {
            return;
        }
        if (feature && this.feature && feature.get(this.property) === this.feature.get(this.property)) {
            return;
        }
        const previousLayer = this.layer;
        this.feature = feature;
        this.layer = layer;
        // update previously hovered layer
        if (previousLayer) {
            const style = (previousLayer.get(LAYER_HOVER) || {}).featureStyle;
            if (style) {
                previousLayer.changed();
            }
        }
        // update currently hovered layer
        if (this.layer && this.layer !== this.previousLayer) {
            const style = (this.layer.get(LAYER_HOVER) || {}).featureStyle;
            if (style) {
                this.layer.changed();
            }
        }
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
