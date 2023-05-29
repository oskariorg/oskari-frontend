import { LAYER_TYPE, LAYER_HOVER, WFS_ID_KEY, FTR_PROPERTY_ID, LAYER_ID, VECTOR_TILE_TYPE, VECTOR_TYPE } from '../domain/constants';
import { getStylesForGeometry } from '../oskariStyle/generator.ol';
import olOverlay from 'ol/Overlay';
import olLayerVector from 'ol/layer/Vector';
import olLayerVectorTile from 'ol/layer/VectorTile';
import { Vector as olSourceVector } from 'ol/source';

const STROKE_ADDITION = 2;

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

        const layerChanged = this._state.layerId !== layerId;
        this._state = {
            feature,
            layerId
        };
        // Vectorhandler updates vector layers' feature styles but tooltip is handled by hoverhandler
        if (layerType === VECTOR_TYPE) {
            return;
        }
        // Try first if layer has stored vectorlayer
        const vtLayer = this._vectorTileLayers[layerId];
        if (vtLayer) {
            const idProp = this._getIdProperty(layerType);
            this._state.renderFeatureId = feature.get(idProp);
            vtLayer.changed();
            return;
        }
        if (layerChanged) {
            this.onLayerChange(layerId);
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

    onLayerChange (layerId) {
        const layer = Oskari.getSandbox().findMapLayerFromSelectedMapLayers(layerId);
        if (!layer) {
            // this happens when reseting the map state while a feature is being hovered on
            return;
        }
        const mapmodule = this._mapmodule;
        const hoverLayer = this._hoverLayer;
        const olLayers = mapmodule.getOLMapLayers(layerId);
        // assumes that first layer is main layer and others are straight over main layer
        const topLayer = olLayers[olLayers.length - 1];
        const index = mapmodule.getLayerIndex(topLayer);
        mapmodule.setLayerIndex(hoverLayer, index + 1);
        hoverLayer.setOpacity(layer.getOpacity() / 100);
        hoverLayer.setStyle(this.getCachedStyle(layerId));
        hoverLayer.changed();
    }

    // VectorTile uses lightweight and read-only RenderFeature
    // create copy with same source and hover style
    createVectorTileLayer (layer, source) {
        const olLayer = new olLayerVectorTile({ source });
        olLayer.setOpacity(layer.getOpacity());
        olLayer.setVisible(layer.isVisible());
        olLayer.set(LAYER_HOVER, true, true);
        olLayer.setStyle(this._styleGenerator(layer, true));
        this._vectorTileLayers[layer.getId()] = olLayer;
        this.setTooltipContent(layer);
        return olLayer;
    }

    registerLayer (layer) {
        this._styleCache[layer.getId()] = this._styleGenerator(layer);
    }

    removeLayer (layer) {
        const layerId = layer.getId();
        if (this._state.layerId === layerId) {
            this.clearHover(true);
        }
        delete this._styleCache[layerId];
        delete this._vectorTileLayers[layerId];
    }

    updateLayerStyle (layer) {
        const layerId = layer.getId();
        if (this._state.layerId === layerId) {
            this.clearHover(true);
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
        const options = typeof layer.getHoverOptions === 'function' ? layer.getHoverOptions() : {};
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
        const { hover: defaultHoverDef } = this._defaultStyles[layer.getLayerType()] || {};
        let hoverDef = layerHoverDef || defaultHoverDef;
        if (!hoverDef) {
            return null;
        }
        if (hoverDef.inherit === true) {
            hoverDef = this._getInheritedStyle(layer, hoverDef);
        }
        // TODO: if layer contains only one geometry type return olStyle (hoverDef) instead of function
        const olStyles = this._styleFactory(hoverDef);
        const layerType = layer.getLayerType();
        if (isVectorTile) {
            const idProp = this._getIdProperty(layerType);
            return feature => {
                if (this._state.renderFeatureId === feature.get(idProp)) {
                    return getStylesForGeometry(feature.getType(), olStyles);
                }
            };
        }
        return feature => {
            return getStylesForGeometry(feature.getGeometry(), olStyles);
        };
    }

    _getInheritedStyle (layer, hoverDef) {
        const { featureStyle: defaultFeatureStyle } = this._defaultStyles[layer.getLayerType()] || {};
        const featureStyle = layer.getCurrentStyle().getFeatureStyle();
        const base = jQuery.extend(true, {}, defaultFeatureStyle, featureStyle);
        if (Oskari.util.keyExists(base, 'stroke.width')) {
            base.stroke.width = base.stroke.width + STROKE_ADDITION;
        }
        if (Oskari.util.keyExists(base, 'stroke.area.width')) {
            base.stroke.area.width = base.stroke.area.width + STROKE_ADDITION;
        }
        return jQuery.extend(true, {}, base, hoverDef);
    }

    _clearState (clearLayerId) {
        const layerId = this._state.layerId;
        // store layerId to avoid unnecessary style updates
        this._state = clearLayerId ? {} : { layerId };
        if (layerId) {
            const vtLayer = this._vectorTileLayers[layerId];
            if (vtLayer) {
                vtLayer.changed();
            } else {
                this._hoverLayer.getSource().clear(true);
            }
        }
    }

    clearHover (clearLayerId) {
        this._clearState(clearLayerId);
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
        // WFS layer plugin handles additional layer types which uses '_oid' key but layer type isn't wfs
        // It's clearer to check layers which uses 'id' key
        return layerType === VECTOR_TILE_TYPE || layerType === VECTOR_TYPE ? FTR_PROPERTY_ID : WFS_ID_KEY;
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
