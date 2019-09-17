import olOverlay from 'ol/Overlay';
import olFormatGeoJSON from 'ol/format/GeoJSON';
import olFeature from 'ol/Feature';
import olRenderFeature from 'ol/render/Feature';
import { fromExtent } from 'ol/geom/Polygon';
import {
    LAYER_ID, LAYER_HOVER, LAYER_TYPE, FTR_PROPERTY_ID,
    SERVICE_HOVER, SERVICE_CLICK, SERVICE_LAYER_REQUEST
} from '../domain/constants';

/**
 * @class Oskari.mapframework.service.VectorFeatureService
 *
 * Handles map click and hover on VectorFeatures.
 * Handles layer configuration requests.
 */
Oskari.clazz.defineES('Oskari.mapframework.service.VectorFeatureService',
    class VectorFeatureService {
        constructor (sandbox, olMap) {
            this.__name = 'VectorFeatureService';
            this.__qname = 'Oskari.mapframework.service.VectorFeatureService';
            this._sandbox = sandbox;
            this._tooltipOverlay = null;
            this._map = olMap;
            this._featureFormatter = new olFormatGeoJSON();
            this._tooltipState = {
                feature: null
            };
            this.layerTypeHandlers = {};
            this.defaultHandlers = {};
            this._registerEventHandlers();
        }

        /**
         * @method _registerEventHandlers
         * Registers as handler for click and hover events.
         */
        _registerEventHandlers () {
            this._sandbox.registerForEventByName(this, 'MouseHoverEvent');
            this._sandbox.registerForEventByName(this, 'MapClickedEvent');
        }

        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName () {
            return this.__qname;
        }

        /**
         * @method getName
         * @return {String} service name
         */
        getName () {
            return this.__name;
        }

        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox () {
            return this._sandbox;
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
                    element: overlayDiv
                });
                this._map.addOverlay(this._tooltipOverlay);
            }
            return this._tooltipOverlay;
        }

        /**
         * @method registerLayerType
         *
         * Registers layer type so layers of the type receive click and hover events and layer requests.
         * Performs common tasks on events. For ex. displaying tooltip and dispatching feature click events.
         *
         * @param { String} layerType
         * @param {Object} handlerImpl Object that contains handler functions onMapClicked, onMapHover or onLayerRequest | optional
         * @param {Array<String>} defaultHandlerDef Array of handler types ("click", "hover", "layerRequest")
         *  to be used as default handlers | optional
         */
        registerLayerType (layerType, handlerImpl, defaultHandlerDef) {
            if (!layerType) {
                return;
            }
            let layerTypeHandlers = this.layerTypeHandlers[layerType];
            if (!layerTypeHandlers) {
                layerTypeHandlers = {};
                this.layerTypeHandlers[layerType] = layerTypeHandlers;
            }
            if (handlerImpl) {
                if (typeof handlerImpl.onMapClicked === 'function') {
                    layerTypeHandlers[SERVICE_CLICK] = handlerImpl.onMapClicked.bind(handlerImpl);
                }
                if (typeof handlerImpl.onMapHover === 'function') {
                    layerTypeHandlers[SERVICE_HOVER] = handlerImpl.onMapHover.bind(handlerImpl);
                }
                if (typeof handlerImpl.onLayerRequest === 'function') {
                    layerTypeHandlers[SERVICE_LAYER_REQUEST] = handlerImpl.onLayerRequest.bind(handlerImpl);
                }
                if (Array.isArray(defaultHandlerDef)) {
                    defaultHandlerDef.forEach(handlerType => {
                        this.defaultHandlers[handlerType] = layerTypeHandlers[handlerType];
                    });
                }
            }
        }

        /**
         * @method _getRegisteredHandler
         * @param {String} layerType
         * @param {String} handlerType
         * @returns Registered handler function for layer type or null
         */
        _getRegisteredHandler (layerType, handlerType) {
            if (layerType && handlerType) {
                const layerTypeHandlers = this.layerTypeHandlers[layerType];
                const handler = layerTypeHandlers ? layerTypeHandlers[handlerType] : null;
                if (typeof handler === 'function') {
                    return handler;
                }
            }
        }
        /**
         * @method _getDefaultHandler
         * @param {String} handlerType
         * @returns Default handler function for handlerType or null
         */
        _getDefaultHandler (handlerType) {
            if (handlerType) {
                const handler = this.defaultHandlers[handlerType];
                if (typeof handler === 'function') {
                    return handler;
                }
            }
        }
        /**
         * @method handleVectorLayerRequest
         * Passes the request to a proper layer handler
         *
         * @param {Oskari.mapframework.bundle.mapmodule.request.VectorLayerRequest} request
         */
        handleVectorLayerRequest (request) {
            const layerId = request.getOptions().layerId;
            const defaultHandler = this._getDefaultHandler(SERVICE_LAYER_REQUEST);
            if (!layerId) {
                if (defaultHandler) {
                    defaultHandler(request);
                }
                return;
            }
            const mapLayerService = this.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                const layer = mapLayerService.findMapLayer(layerId);
                const handler = layer ? this._getRegisteredHandler(layer.getLayerType(), SERVICE_LAYER_REQUEST) : defaultHandler;
                if (handler) {
                    handler(request, layer);
                }
            }
        }

        /**
         * @method _onlyRegisteredTypesFilter
         * Filter function to filter only registered layer types
         * @param {olLayer} layer
         * @return {boolean} true if layer's type is registered.
         */
        _onlyRegisteredTypesFilter (layer) {
            const layerType = layer.get(LAYER_TYPE);
            return layerType && !!this.layerTypeHandlers[layerType];
        }

        /**
         * @method _getTopmostFeatureAndLayer
         * @param {Oskari.mapframework.event.common.MouseHoverEvent} event
         * @return {Object} Object containing the topmost feature and it's layer on the mouse location.
         * An empty object if features were not found.
         */
        _getTopmostFeatureAndLayer (event) {
            const pixel = [event.getPageX(), event.getPageY()];
            const featureHitCb = (feature, layer) => ({ feature, layer });
            const ftrAndLyr = this._map.forEachFeatureAtPixel(pixel, featureHitCb, this._onlyRegisteredTypesFilter);
            return ftrAndLyr || {};
        }

        /**
         * @method _getTooltipContent
         * @param {Array} contentOptions
         * @param {olFeature | olRenderFeature} feature
         * @return {String} html content for tooltip or null
         */
        _getTooltipContent (contentOptions, feature) {
            if (contentOptions) {
                if (Array.isArray(contentOptions)) {
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
                }
            }
            return null;
        }

        /**
         * @method _updateTooltipPosition
         * Updates tooltip overlay's position.
         *
         * @param {Number} pageX
         * @param {Number} pageY
         * @param {Number} lon
         * @param {Number} lat
         */
        _updateTooltipPosition (pageX, pageY, lon, lat) {
            let mapDiv = this._map.getTarget();
            mapDiv = typeof mapDiv === 'string' ? jQuery('#' + mapDiv) : jQuery(mapDiv);
            const tooltip = jQuery(this.getTooltipOverlay().getElement());
            const margin = 20;
            const positioningY = pageY > (tooltip.outerHeight() || 100) + margin ? 'bottom' : 'top';
            const positioningX = pageX + (tooltip.outerWidth() || 200) + margin < mapDiv.width() ? 'left' : 'right';
            const positioning = positioningY + '-' + positioningX;
            this.getTooltipOverlay().setPositioning(positioning);
            this.getTooltipOverlay().setPosition([lon, lat]);
        }

        /**
         * @method _updateTooltipContent
         * Updates tooltip with feature's data or hides it if content is empty.
         *
         * @param {String} contentOptions
         * @param {olFeature | olRenderFeature} feature
         */
        _updateTooltipContent (contentOptions, feature) {
            const tooltip = jQuery(this.getTooltipOverlay().getElement());
            const content = this._getTooltipContent(contentOptions, feature);
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

        /**
         * @method _updateTooltip
         * Updates tooltip's content and position
         *
         * @param {Oskari.mapframework.event.common.MouseHoverEvent} event
         * @param {Object} contentOptions
         * @param {olFeature | olRenderFeature} feature
         */
        _updateTooltip (event, contentOptions, feature) {
            const tooltip = jQuery(this.getTooltipOverlay().getElement());
            if (contentOptions) {
                if (this._tooltipState.feature !== feature) {
                    this._updateTooltipContent(contentOptions, feature);
                }
                if (!tooltip.is(':empty')) {
                    this._updateTooltipPosition(event.getPageX(), event.getPageY(), event.getLon(), event.getLat());
                }
            } else {
                this._clearTooltip();
            }
        }
        /**
         * @method _onMapHover
         * Finds the topmost feature from the layers controlled by the service and handles hover tooltip for the feature.
         * Calls registered hover handlers for further styling of the layers.
         *
         * @param {Oskari.mapframework.event.common.MouseHoverEvent} event
         */
        _onMapHover (event) {
            // don't hover while drawing
            if (event.isDrawing()) {
                return;
            }
            const { feature, layer } = this._getTopmostFeatureAndLayer(event);

            // No feature hits for these layer types. Call hover handlers without feature or layer.
            Object.keys(this.layerTypeHandlers).forEach(layerType => {
                const handler = this._getRegisteredHandler(layerType, SERVICE_HOVER);
                const featureHit = feature && layer && layer.get(LAYER_TYPE) === layerType;
                if (!featureHit && handler) {
                    handler(event);
                }
            });

            if (feature && layer) {
                const layerType = layer.get(LAYER_TYPE);
                const hoverOptions = layer.get(LAYER_HOVER);
                const contentOptions = hoverOptions ? hoverOptions.content : null;
                this._updateTooltip(event, contentOptions, feature);
                const handler = this._getRegisteredHandler(layerType, SERVICE_HOVER);
                if (handler) {
                    handler(event, feature, layer);
                }
            } else {
                this._clearTooltip();
            }
        }

        /**
         * @method _getGeojson
         *
         * Returns geojson for feature.
         * If the feature is read-only (olRenderFeature), creates a geojson of the feature's extent.
         *
         * @param {olFeature | olRenderFeature} feature
         * @return geojson
         */
        _getGeojson (feature) {
            if (feature instanceof olRenderFeature) {
                const polygon = fromExtent(feature.getExtent());
                const ftr = new olFeature(polygon);
                ftr.setProperties(feature.getProperties());
                return this._featureFormatter.writeFeaturesObject([ftr]);
            } else {
                return this._featureFormatter.writeFeaturesObject([feature]);
            }
        }

        /**
         *  @method _onMapClicked
         * Find features from the layers controlled by the service and handle clicks for all those features.
         * Calls registered click handlers.
         *
         * @param {Oskari.mapframework.bundle.mapmodule.event.MapClickedEvent} event
         */
        _onMapClicked (event) {
            const me = this;
            let clickHits = [];
            me._map.forEachFeatureAtPixel([event.getMouseX(), event.getMouseY()], (feature, layer) => {
                if (!layer) {
                    return;
                }
                const layerType = layer.get(LAYER_TYPE);
                const isRegisteredLayerType = layerType && me.layerTypeHandlers[layerType];
                if (isRegisteredLayerType) {
                    const handler = me._getRegisteredHandler(layerType, SERVICE_CLICK);
                    if (handler) {
                        handler(event, feature, layer);
                    }
                    clickHits.push({ feature, layer });
                }
            });
            if (clickHits.length > 0) {
                const clickEvent = Oskari.eventBuilder('FeatureEvent')().setOpClick();
                clickHits.forEach(obj => {
                    const { feature, layer } = obj;
                    const geojson = me._getGeojson(feature, layer);
                    const propertyId = feature.get(FTR_PROPERTY_ID);
                    const layerId = layer.get(LAYER_ID);
                    clickEvent.addFeature(propertyId, geojson, layerId);
                });
                me.getSandbox().notifyAll(clickEvent);
            }
        }
        /**
         * @public @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded* if not.
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent (event) {
            switch (event.getName()) {
            case 'MouseHoverEvent':
                this._onMapHover(event); break;
            case 'MapClickedEvent':
                this._onMapClicked(event); break;
            }
        }
    }
    , {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    }
);
