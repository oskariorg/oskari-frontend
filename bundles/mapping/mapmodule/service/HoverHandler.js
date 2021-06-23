import { LAYER_HOVER, FTR_PROPERTY_ID, LAYER_ID } from '../domain/constants';
import { getStyleForGeometry } from '../../mapwfs2/plugin/WfsVectorLayerPlugin/util/style'; // TODO
import olOverlay from 'ol/Overlay';
import { Vector as olLayerVector } from 'ol/layer';
import { Vector as olSourceVector } from 'ol/source';

export class HoverHandler {
    constructor (ftrIdPropertyKey) {
        this.olLayers = {};
        this.state = {};
        this.property = ftrIdPropertyKey || FTR_PROPERTY_ID;
        this.styleFactory = null;
        this._tooltipContents = {};
        this._tooltipOverlay = null;
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
     * @param { olVectorTileLayer } olLayer
     */
    onFeatureHover (event, feature, olLayer) {
        if (!feature) {
            // TODO: is this needed?
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
        if (feature && olLayer) {
            const layerId = olLayer.get(LAYER_ID);
            const layer = this.olLayers[layerId];
            if (!layer) {
                return;
            }
            layer.getSource().addFeature(feature);
            this.updateTooltipContent(layerId, feature);
            this.state = {
                feature,
                layer
            };
        }
    }

    onMapHover (event) {
        this._updateTooltipPosition(event);
    }

    createHoverLayer (layer) {
        const olLayer = new olLayerVector({
            opacity: layer.getOpacity(),
            visible: layer.isVisible(),
            source: new olSourceVector()
        });
        olLayer.set(LAYER_HOVER, true, true);
        olLayer.setStyle(this._styleGenerator(layer));
        this.olLayers[layer.getId()] = olLayer;
        this.setTooltipContent(layer);
        return olLayer;
    }

    setTooltipContent (layer) {
        const options = layer.getHoverOptions();
        if (!options || !Array.isArray(options.content)) {
            return;
        }
        this._tooltipContents[layer.getId()] = options.content;
    }

    _styleGenerator (layer) {
        const opts = layer.getHoverOptions();
        // TODO: register layer type default styles to inherit
        if (opts && opts.featureStyle) {
            let hoverDef = opts.featureStyle;
            if (hoverDef.inherit === true) {
                const styleDef = layer.getCurrentStyleDef();
                const featureStyle = styleDef ? styleDef.featureStyle : {};
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
    }

    clearHover () {
        Object.values(this.olLayers).forEach(l => l.getSource().clear());
        // this._clearTooltip(); TODO: how to handle vector & others
        this.state = {};
        this.noHitsCounter = 0;
    }

    _featureOrIdEqualsCurrent (feature) {
        const { feature: current } = this.state;
        if (!current) {
            return false;
        }
        const idProp = this.property;
        return current === feature || current.get(idProp) === feature.get(idProp);
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

    /**
    * @method getTooltipOverlay
    * Get common tooltip overlay.
    *
    * @return {olOverlay}
    */
    getTooltipOverlay () {
        if (!this._tooltipOverlay) {
            const overlayDiv = document.createElement('div');
            overlayDiv.className = 'feature-hover-overlay';
            this._tooltipOverlay = new olOverlay({
                element: overlayDiv,
                offset: [10, -10],
                stopEvent: false
            });
            const mapmodule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
            mapmodule.getMap().addOverlay(this._tooltipOverlay);
        }
        return this._tooltipOverlay;
    }

    /**
     * @method _getTooltipContent
     * @param {Number | } contentOptions
     * @param {olFeature | olRenderFeature} feature
     * @return {String} html content for tooltip or null
     */
    _getTooltipContent (layerId, feature) {
        const contentOptions = this._tooltipContents[layerId];
        if (!contentOptions) {
            return null;
        }
        let content = '';
        contentOptions.forEach(function (entry) {
            let key = entry.key;
            if (typeof key === 'undefined' && entry.keyProperty) {
                key = feature.get(entry.keyProperty);
            }
            if (typeof key !== 'undefined') {
                content += '<div>' + key;
                if (entry.valueProperty) {
                    content += ': ';
                    const value = feature.get(entry.valueProperty);
                    if (typeof value !== 'undefined') {
                        content += value;
                    }
                }
                content += '</div>';
            }
        });
        if (content) {
            return content;
        }
        return null;
    }

    /**
     * @method _updateTooltipPosition
     * Updates tooltip overlay's position.
     *
     */
    _updateTooltipPosition (event) {
        const mapWidth = Oskari.getSandbox().getMap().getWidth();
        const tooltip = jQuery(this.getTooltipOverlay().getElement());
        const margin = 20;
        const positioningY = event.getPageY() > (tooltip.outerHeight() || 100) + margin ? 'bottom' : 'top';
        const positioningX = event.getPageX() + (tooltip.outerWidth() || 200) + margin < mapWidth ? 'left' : 'right';
        const positioning = positioningY + '-' + positioningX;
        this.getTooltipOverlay().setPositioning(positioning);
        this.getTooltipOverlay().setPosition([event.getLon(), event.getLat()]);
    }

    /**
     * @method updateTooltipContent
     * Updates tooltip with feature's data or hides it if content is empty.
     *
     * @param {Numbed | String} layerId
     * @param {olFeature | olRenderFeature} feature
     */
    updateTooltipContent (layerId, feature) {
        const tooltip = jQuery(this.getTooltipOverlay().getElement());
        const content = this._getTooltipContent(layerId, feature);
        if (content) {
            tooltip.html(content);
            tooltip.css('display', '');
        } else {
            tooltip.empty();
            tooltip.css('display', 'none');
        }
    }

    /**
     * @method _clearTooltip
     * Clears tooltip's content and hides it.
     */
    _clearTooltip () {
        const tooltip = jQuery(this.getTooltipOverlay().getElement());
        tooltip.empty();
        tooltip.css('display', 'none');
    }
}
