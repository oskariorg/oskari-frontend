import { Messaging } from 'oskari-ui/util';

import './request/MapLayerVisibilityRequest';
import './request/MapLayerVisibilityRequestHandler.ol';
import './event/MapLayerVisibilityChangedEvent';

import './request/MapMoveByLayerContentRequest';
import './request/MapMoveByLayerContentRequestHandler';

import olFormatWKT from 'ol/format/WKT';
import { CoverageHelper } from './coveragetool/CoverageHelper';

const WKT_READER = new olFormatWKT();
const AbstractMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin');
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
        this.coverageHelper = new CoverageHelper();
        this.initCoverageToolPlugin();
    }

    initCoverageToolPlugin() {
        this.coverageToolPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.plugin.CoverageToolPlugin');
        const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
        mapModule.registerPlugin(this.coverageToolPlugin);
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
        const { unsupported } = event.getMapLayer().getVisibilityInfo();
        if (unsupported) {
            Messaging.warn({
                content: unsupported.getDescription(),
                duration: 5
            });
        }
    }

    /**
     * @method handleDescribeLayer
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
    handleDescribeLayer (layer, info) {
        const { coverage } = info;
        // already parsed
        const hasGeometry = layer.getGeometry().length > 0;
        if (!hasGeometry && coverage) {
            const geometry = WKT_READER.readGeometry(coverage);
            if (geometry) {
                layer.setGeometryWKT(coverage);
                layer.setGeometry([geometry]);
                this.coverageHelper.addCoverageTool(layer);
            }
        }
        // set visibility info
        const inScale = this._isInScale(layer);
        const geometryMatch = this.isInGeometry(layer);
        layer.updateVisibilityInfo({ inScale, geometryMatch });
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
     * @param {boolean} isRequest triggered by a request
     */
    _checkLayersVisibility (orderNumber, isRequest) {
        if (orderNumber !== this._visibilityCheckOrder) {
            return;
        }
        this._sandbox.findAllSelectedMapLayers().forEach(layer => {
            if (layer.isVisible()) {
                this.handleMapLayerVisibility(layer, isRequest);
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
