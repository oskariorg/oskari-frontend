import { LAYER_TYPE, LAYER_HOVER, WFS_ID_KEY, FTR_PROPERTY_ID, LAYER_ID, WFS_TYPE, VECTOR_TYPE } from '../domain/constants';
import { getStyleForGeometry } from '../../mapwfs2/plugin/WfsVectorLayerPlugin/util/style'; // TODO
import olOverlay from 'ol/Overlay';
import olLayerVector from 'ol/layer/Vector';
import olLayerVectorTile from 'ol/layer/VectorTile';
import { Vector as olSourceVector } from 'ol/source';

export class HoverHandler {
    constructor (mapmodule) {
        this._mapmodule = mapmodule;
        this._vectorTileLayers = {};
        this._hoverLayer = null;
        this._styleCache = {};
        this._state = {};
        this._styleFactory = null;
        this._tooltipContents = {};
        this._tooltipOverlay = null;
        this._defaultStyles = {};
        this._initBindings();
    }

    _initBindings () {
        this._mapmodule.getMap().getViewport().addEventListener('mouseout', evt => {
            this.clearHover();
        }, false);
        this._styleFactory = this._mapmodule.getGeomTypedStyles.bind(this._mapmodule);
        const olLayer = new olLayerVector({ source: new olSourceVector() });
        olLayer.set(LAYER_HOVER, true, true);
        olLayer.setZIndex(1); // TODO: how to handle layer ordering
        this._mapmodule.addLayer(olLayer);
        this._hoverLayer = olLayer;
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
        if (!feature || !olLayer) {
            this.clearHover();
            return;
        }
        const layerType = olLayer.get(LAYER_TYPE);
        if (this._featureOrIdEqualsCurrent(feature, layerType)) {
            return;
        }
        this._clearState();
        const layerId = olLayer.get(LAYER_ID);
        this.updateTooltipContent(layerId, feature);

        // Vectorhandler updates vector layers' feature styles but tooltip is handled by hoverhandler
        if (layerType === VECTOR_TYPE) {
            return;
        }
        const layerChanged = this._state.layerId !== layerId;
        this._state = {
            feature,
            layerId
        };
        // Try first if layer has stored vectorlayer
        const vtLayer = this._vectorTileLayers[layerId];
        if (vtLayer) {
            const idProp = WFS_TYPE === layerType ? WFS_ID_KEY : FTR_PROPERTY_ID;
            this._state.renderFeatureId = feature.get(idProp);
            vtLayer.changed();
            return;
        }
        if (layerChanged) {
            const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
            this._hoverLayer.setOpacity(layer.getOpacity() / 100);
            this._hoverLayer.setStyle(this.getCachedStyle(layerId));
            this._hoverLayer.changed();
        }
        this._hoverLayer.getSource().addFeature(feature);
    }

    onMapHover (event) {
        this._updateTooltipPosition(event);
    }

    updateHoverLayer (layer, hidden) {
        const layerId = layer.getId();
        if (this._state.layerId !== layerId) {
            return;
        }
        if (hidden) {
            this.clearHover();
            return;
        }
        this._hoverLayer.setOpacity(layer.getOpacity() / 100);
    }

    // VectorTile uses lightweight and read-only RenderFeature
    // create copy with same source and hover style
    createVectorTileLayer (layer, source) {
        const olLayer = new olLayerVectorTile({ source });
        olLayer.setOpacity(layer.getOpacity());
        olLayer.setVisible(layer.isVisible());
        olLayer.set(LAYER_HOVER, true, true);
        olLayer.setStyle(this._styleGenerator(layer, true));
        olLayer.setZIndex(1);
        this._vectorTileLayers[layer.getId()] = olLayer;
        this.setTooltipContent(layer);
        return olLayer;
    }

    registerLayer (layer) {
        this._styleCache[layer.getId()] = this._styleGenerator(layer);
    }

    updateLayerStyle (layer) {
        const layerId = layer.getId();
        if (this._state.layerId === layerId) {
            this.clearHover();
            // clear layer id from state to be sure that onFeatureHover uses updated style
            this._state.layerId = null;
        }
        this.setTooltipContent(layer);
        const vectorTileLayer = this._vectorTileLayers[layerId];
        if (vectorTileLayer) {
            vectorTileLayer.setStyle(this._styleGenerator(layer, true));
            return;
        }
        if (this._styleCache[layerId]) {
            this._styleCache[layerId] = this._styleGenerator(layer);
        }
    }

    getCachedStyle (layerId) {
        return this._styleCache[layerId]; // || defaultStyle;
    }

    setTooltipContent (layer) {
        const options = layer.getHoverOptions();
        if (!options || !Array.isArray(options.content)) {
            return;
        }
        this._tooltipContents[layer.getId()] = options.content;
    }

    setDefaultStyle (layerType, styleType, styleDef) {
        const styles = this._defaultStyles[layerType] || {};
        styles[styleType] = styleDef;
        this._defaultStyles[layerType] = styles;
    }

    _styleGenerator (layer, isVectorTile) {
        const { featureStyle: layerHoverDef } = layer.getHoverOptions() || {};
        const { featureStyle: defaultFeatureStyle, hover: defaultHoverDef } = this._defaultStyles[layer.getLayerType()] || {};
        let hoverDef = layerHoverDef || defaultHoverDef;
        if (!hoverDef) {
            return null;
        }
        if (hoverDef.inherit === true) {
            const featureStyle = layer.getCurrentStyle().getFeatureStyle();
            hoverDef = jQuery.extend(true, {}, defaultFeatureStyle, featureStyle, hoverDef);
        }
        // TODO: if layer contains only one geometry type return olStyle (hoverDef) instead of function
        const olStyles = this._styleFactory(hoverDef);
        const layerType = layer.getLayerType();
        if (isVectorTile) {
            const idProp = this._getIdProperty(layerType);
            return feature => {
                if (this._state.renderFeatureId === feature.get(idProp)) {
                    return getStyleForGeometry(feature.getType(), olStyles);
                }
            };
        }
        return feature => {
            return getStyleForGeometry(feature.getGeometry(), olStyles);
        };
    }

    _clearState () {
        const layerId = this._state.layerId;
        // remove others than layerId from state
        this._state = { layerId };
        if (layerId) {
            const vtLayer = this._vectorTileLayers[layerId];
            if (vtLayer) {
                vtLayer.changed();
            } else {
                this._hoverLayer.getSource().clear(true);
            }
        }
    }

    clearHover () {
        this._clearState();
        this._clearTooltip();
    }

    _featureOrIdEqualsCurrent (feature, layerType) {
        const { feature: current } = this._state;
        if (!current) {
            return false;
        }
        const idProp = this._getIdProperty(layerType);
        return current === feature || current.get(idProp) === feature.get(idProp);
    }

    _getIdProperty (layerType) {
        return WFS_TYPE === layerType ? WFS_ID_KEY : FTR_PROPERTY_ID;
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
            this._mapmodule.getMap().addOverlay(this._tooltipOverlay);
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
