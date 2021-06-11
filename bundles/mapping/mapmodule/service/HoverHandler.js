import { LAYER_HOVER, FTR_PROPERTY_ID, LAYER_ID } from '../domain/constants';
import { getStyleForGeometry } from '../../mapwfs2/plugin/WfsVectorLayerPlugin/util/style';

export class HoverHandler {
    constructor (ftrIdPropertyKey) {
        this.olLayers = {};
        this.state = {};
        this.property = ftrIdPropertyKey || FTR_PROPERTY_ID;
        this.styleFactory = null;
        // The same handler instance manages myplaces, userlayers and wfslayers
        // The handler is notified when user hovers the map and doesn't hit a layer of managed type.
        // Hence, the handler is called several times on map hover.
        // Clear hover after there is no hit on any of the managed layer types.
        this.clearHoverThreshold = 10;
        this.noHitsCounter = 0;
        this._initBindings();
    }

    _initBindings () {
        const mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        mapmodule.getMap().getViewport().addEventListener('mouseout', evt => {
            this.clearHover();
        }, false);
        this.styleFactory = mapmodule.getGeomTypedStyles.bind(mapmodule);
    }

    /**
     * @method onMapHover VectorFeatureService handler impl method
     * Handles feature highlighting on map hover.
     *
     * @param { Oskari.mapframework.event.common.MouseHoverEvent } event
     * @param { olRenderFeature } feature
     * @param { olVectorTileLayer } layer
     */
    onMapHover (event, feature, vectorLayer) {
        // const contentOptions = hoverOptions ? hoverOptions.content : null;
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
        if (feature && vectorLayer) {
            const layer = this.olLayers[vectorLayer.get(LAYER_ID)];
            if (!layer) {
                return;
            }
            layer.getSource().addFeature(feature);
            this.state = {
                feature,
                layer
            };
        }
    }

    addLayer (layer, olLayer) {
        olLayer.setStyle(this.styleGenerator(layer));
        this.olLayers[layer.getId()] = olLayer;
    }

    styleGenerator (layer) {
        const opts = layer.getHoverOptions();
        if (opts && opts.featureStyle) {
            let hoverDef = opts.featureStyle;
            if (hoverDef.inherit === true) {
                const { featureStyle = {} } = layer.getCurrentStyleDef();
                // TODO: does featureStyle contain default style or only overriding definitions
                hoverDef = jQuery.extend(true, {}, featureStyle, hoverDef);
            }
            // TODO: if layer contains only one geometry type return olStyle (hoverDef) instead of function
            const styleDef = this.styleFactory(hoverDef);
            return feature => {
                return getStyleForGeometry(feature.getGeometry(), styleDef);
            };
        }
        return null;
    };

    clearHover () {
        Object.values(this.olLayers).forEach(l => l.getSource().clear());
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
            const olLayer = this.olLayers(layer.getId());
            if (olLayer) {
                olLayer.setStyle(this.styleGenerator(layer));
            }
        }
    }
}
