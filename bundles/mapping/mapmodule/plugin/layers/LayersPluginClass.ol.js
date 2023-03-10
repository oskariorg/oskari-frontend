import { Messaging } from 'oskari-ui/util';

import './request/MapLayerVisibilityRequest';
import './request/MapLayerVisibilityRequestHandler.ol';
import './event/MapLayerVisibilityChangedEvent';

import './request/MapMoveByLayerContentRequest';
import './request/MapMoveByLayerContentRequestHandler';

import olFormatWKT from 'ol/format/WKT';
import { VectorStyle } from '../../domain/VectorStyle';

const WKT_READER = new olFormatWKT();
const AbstractMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin');
const LAYER_INFO_STATUS = {};
const SUPPORTED_DELAY = 2000;
const VISIBILITY_DELAY = 750;

/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides handling for rearranging layer order and
 * controlling layer visibility. Provides information to other bundles if a layer
 * becomes visible/invisible (out of scale/out of content geometry) and request handlers
 * to move map to location/scale based on layer content. Also optimizes openlayers maplayers
 * visibility setting if it detects that content is not in the viewport.
 */
export class LayersPlugin extends AbstractMapModulePlugin {
    constructor () {
        super();
        this._clazz = 'Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin';
        this._name = 'LayersPlugin';

        this._supportedFormats = {};
        this._visibilityCheckOrder = 0;
        this._previousTimer = null;
        this._supportedTimer = null;
    }

    _createEventHandlers () {
        return {
            MapMoveStartEvent: () => {
            // clear out any previous visibility check when user starts to move map
            // not always sent f.ex. when moving with keyboard so do this in
            // AfterMapMoveEvent also
                this._visibilityCheckOrder += 1;
                if (this._previousTimer) {
                    clearTimeout(this._previousTimer);
                    this._previousTimer = null;
                }
            },
            AfterMapMoveEvent: () => {
                // visibility checks are cpu intensive so only make them when the map has stopped moving
                this._scheduleVisiblityCheck();
            },
            AfterMapLayerAddEvent: (event) => {
                this._afterMapLayerAddEvent(event);
            },
            MapLayerEvent: (event) => {
                if (event.getOperation() !== 'add') {
                    return;
                }
                this._scheduleSupportedCheck();
            }
        };
    }

    _createRequestHandlers () {
        const sandbox = this.getSandbox();
        return {
            'MapModulePlugin.MapLayerVisibilityRequest': Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler',
                sandbox,
                this
            ),
            'MapModulePlugin.MapMoveByLayerContentRequest': Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler',
                sandbox,
                this
            )
        };
    }

    _afterMapLayerAddEvent (event) {
        const layer = event.getMapLayer();
        // TODO: should this be loaded in abstractlayerplugin before adding ol layers to map
        this._loadLayerInfo(layer);

        const { unsupported } = layer.getVisibilityInfo();
        if (unsupported) {
            Messaging.warn({
                content: unsupported.getDescription(),
                duration: 5
            });
        }
    }

    /**
     * @method _parseGeometryForLayer
     * @private
     *
     * If layer.getGeometry() is empty, tries to parse layer.getGeometryWKT()
     * and set parsed geometry to the layer
     *
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer for which to parse geometry
     *
     */
    _loadLayerInfo (layer) {
        // parse geometry if available
        const layerId = layer.getId();
        if (LAYER_INFO_STATUS[layerId] === true) {
            // already loading or loaded/handled
            return;
        }
        // set a flag to notify the layer is loading/loaded/handled and we don't need to try again
        LAYER_INFO_STATUS[layerId] = true;
        // TODO: use common way to check if layer is 'normal' oskari layer
        if (typeof layer.getGeometry !== 'function') {
            // layer type doesn't support this
            return;
        }
        this.__getDescribeLayer(layer, info => {
            const { coverage, vectorStyles } = info;
            if (coverage) {
                const geometry = WKT_READER.readGeometry(coverage);
                if (geometry) {
                    layer.setGeometryWKT(coverage);
                    layer.setGeometry([geometry]);
                    // NOTE: this is used only AfterMapLayerAddEvent
                    // so we can update geometryMatch here
                    this.handleMapLayerVisibility(layer);
                }
            }
            if (Array.isArray(vectorStyles)) {
                // if users own styles are listed in mydata are them added to layers also
                // layer addstyle should ignore already added style
                vectorStyles.map(s => new VectorStyle(s)).forEach(s => layer.addStyle(s));
                // TODO: getCurrentStyle calls selectStyle('') if selectstyle hasn't been called
                // and selectStyle fallbacks first or empty style if style isn't found
                // maybe functions have to be overridden in AbstractVectorLayer (async)
                layer.selectStyle(layer._currentStyle);
                // this.getSandbox().postRequestByName('ChangeMapLayerStyleRequest', [layerId, layer._currentStyle]);
                const event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
                this.getSandbox().notifyAll(event);
            }
        });
    }

    /**
     * Fetches WKT from server if required
     * @param {AbstractLayer} layer layer to get WKT for
     * @param {Function} callback gets the wkt as parameter or undefined if it's not available
     * @returns callback is used for return value
     */
    __getDescribeLayer(layer, callback) {
        const layerId = layer.getId();
        if (isNaN(layerId)) {
            // only layers that have numeric ids can have reasonable response for DescribeLayer
            callback();
            return;
        }
        const url = Oskari.urls.getRoute('DescribeLayer', {
            id: layerId,
            lang: Oskari.getLang(),
            srs: this.getMapModule().getProjection()
        });

        fetch(url).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            callback(json);
        }).catch(error => {
            // reset flag to try again later
            LAYER_INFO_STATUS[layerId] = false;
            Oskari.log('DescribeLayer download').warn(error);
            callback();
        });
    }

    /**
     * @method isInGeometry
     * If the given layer has geometry, checks if it is visible in the maps viewport.
     * If layer doesn't have geometry, returns always true since then we can't
     * determine this.
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check against
     * @return {Boolean} true if geometry is visible or cant determine if it isnt
     */
    isInGeometry (layer) {
        const geometries = layer.getGeometry() || [];
        if (geometries.length === 0) {
            return true;
        }
        const viewBounds = this.getMapModule().getCurrentExtent();
        const olExtent = [viewBounds.left, viewBounds.bottom, viewBounds.right, viewBounds.top];
        return geometries[0].intersectsExtent(olExtent);
    }

    /**
     * @method getGeometryCenter
     *
     * @param {ol/geom/Geometry} geometry
     * @return {Object} centroid
     */
    getGeometryCenter (geometry) {
        if (geometry.getType() === 'Point') {
            var point = geometry.getCoordinates();
            return { lon: point[0], lat: point[1] };
        } else if (geometry.getType() === 'Polygon') {
            var extent = geometry.getExtent();
            return {
                lon: extent[0] + (extent[2] - extent[0]) / 2,
                lat: extent[1] + (extent[3] - extent[1]) / 2
            };
        } else {
        //
        }
    }

    /**
     * @method getGeometryBounds
     *
     * @param {ol/geom/Geometry} geometry
     * @return {Object} like OpenLayers bounds
     */
    getGeometryBounds (geometry) {
        var extent = geometry.getExtent();
        return {
            left: extent[0],
            bottom: extent[1],
            right: extent[2],
            top: extent[3]
        };
    }

    /**
     * @method _scheduleVisiblityCheck
     * @private
     * Schedules a visibility check on selected layers. After given timeout
     * calls  _checkLayersVisibility()
     */
    _scheduleVisiblityCheck () {
        const me = this;
        if (this._previousTimer) {
            clearTimeout(this._previousTimer);
            this._previousTimer = null;
        }
        this._visibilityCheckOrder++;
        this._previousTimer = setTimeout(function () {
            me._checkLayersVisibility(me._visibilityCheckOrder);
        }, VISIBILITY_DELAY);
    }

    _scheduleSupportedCheck () {
        if (this._supportedTimer) {
            clearTimeout(this._supportedTimer);
            this._supportedTimer = null;
        }
        this._supportedTimer = setTimeout(() => {
            this._checkSupportedLayers();
        }, SUPPORTED_DELAY);
    }

    _checkSupportedLayers () {
        const sb = this.getSandbox();
        const layers = sb.getService('Oskari.mapframework.service.MapLayerService').getAllLayers();
        const map = sb.getMap();

        layers.forEach(layer => {
            const unsupported = map.getMostSevereUnsupportedLayerReason(layer);
            layer.updateVisibilityInfo({ unsupported });
        });
    }

    /**
     * @method _checkLayersVisibility
     * @private
     * Loops through selected layers and notifies other modules about visibility
     * changes
     * @param {Number} orderNumber checks orderNumber against
     * #_visibilityCheckOrder
     *      to see if this is the latest check, if not - does nothing
     */
    _checkLayersVisibility (orderNumber) {
        if (orderNumber !== this._visibilityCheckOrder) {
            return;
        }
        this._sandbox.findAllSelectedMapLayers().forEach(layer => {
            if (layer.isVisible()) {
                this.handleMapLayerVisibility(layer);
            }
        });
        this._visibilityCheckScheduled = false;
    }

    /**
     * @method _isInScale
     * @private
     * Checks if the maps scale is in the given maplayers scale range
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check scale against
     * @return {Boolean} true maplayer is visible in current zoomlevel
     */
    _isInScale (layer) {
        const scale = this.getMapModule().getMapScale();
        return layer.isInScale(scale);
    }

    _isLayerImplVisible (olLayer) {
        return olLayer.getVisible();
    }

    _setLayerImplVisible (olLayer, visible) {
        olLayer.setVisible(visible);
    }

    /**
     * @method handleMapLayerVisibility
     * Checks layer's visibility (visible, inScale, inGeometry) and sets ol layers' visibilities.
     * notifies bundles about visibility changes by sending MapLayerVisibilityChangedEvent.
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check against
     * @param {Boolean} isRequest if MapLayerVisibilityRequest, then trigger always change because layer's visibility has changed
    */
    handleMapLayerVisibility (layer, isRequest) {
        const visible = layer.isVisible();
        let triggerChange = isRequest === true;

        // check actual values only for visible layer
        const inScale = visible ? this._isInScale(layer) : false;
        const geometryMatch = visible ? this.isInGeometry(layer) : false;

        // setup maplayers visibility (optimization purposes)
        // NOTE: DO NOT CHANGE layer's visibility here
        const olLayers = this.getMapModule().getOLMapLayers(layer.getId()) || [];
        const shouldBeVisible = visible && inScale && geometryMatch;
        olLayers.forEach(ol => {
            if (this._isLayerImplVisible(ol) !== shouldBeVisible) {
                this._setLayerImplVisible(ol, shouldBeVisible);
                triggerChange = true;
            }
        });

        if (triggerChange) {
            layer.updateVisibilityInfo({ inScale, geometryMatch });
            const event = Oskari.eventBuilder('MapLayerVisibilityChangedEvent')(layer, inScale, geometryMatch);
            this._sandbox.notifyAll(event);
        }
    }
}
