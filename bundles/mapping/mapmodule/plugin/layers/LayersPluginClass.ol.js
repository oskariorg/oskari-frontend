import olFormatWKT from 'ol/format/WKT';
import { Messaging } from 'oskari-ui/util';

const WKT_READER = new olFormatWKT();
const AbstractMapModulePlugin = Oskari.clazz.get('Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin');
const LAYER_WKT_STATUS = {};

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
        // visibility checks are cpu intensive so only make them when the map has
        // stopped moving
        // after map move stopped -> activate a timer that will
        // do the check after _visibilityPollingInterval milliseconds
        this._visibilityPollingInterval = 750;
        this._visibilityCheckOrder = 0;
        this._previousTimer = null;
    }
    _createEventHandlers () {
        var me = this;

        return {
            MapMoveStartEvent: function () {
            // clear out any previous visibility check when user starts to move
            // map
            // not always sent f.ex. when moving with keyboard so do this in
            // AfterMapMoveEvent also
                me._visibilityCheckOrder += 1;
                if (me._previousTimer) {
                    clearTimeout(me._previousTimer);
                    me._previousTimer = null;
                }
            },
            AfterMapMoveEvent: function () {
                me._scheduleVisiblityCheck();
            },
            AfterMapLayerAddEvent: function (event) {
            // parse geom if available
                me._parseGeometryForLayer(event.getMapLayer());
                me._scheduleVisiblityCheck();
            }
        };
    }

    _createRequestHandlers () {
        var me = this;
        var sandbox = me.getSandbox();

        return {
            'MapModulePlugin.MapLayerVisibilityRequest': Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler',
                sandbox,
                me
            ),
            'MapModulePlugin.MapMoveByLayerContentRequest': Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler',
                sandbox,
                me
            )
        };
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
    _parseGeometryForLayer (layer) {
        // parse geometry if available
        const layerId = layer.getId();
        if (LAYER_WKT_STATUS[layerId] === true) {
            // already loading or loaded/handled
            return;
        }
        // set a flag to notify the layer WKT is loading/loaded/handled and we don't need to try again
        LAYER_WKT_STATUS[layerId] = true;
        if (typeof layer.getGeometry !== 'function') {
            // layer type doesn't support this
            return;
        }
        if (layer.getGeometry().length > 0) {
            // already parsed, no need to parse again
            return;
        }
        this.__getLayerCoverageWKT(layer, coverageWKT => {
            if (!coverageWKT) {
                return;
            }
            const geometry = WKT_READER.readGeometry(coverageWKT);
            if (geometry) {
                layer.setGeometryWKT(coverageWKT);
                layer.setGeometry([geometry]);
            }
        });
    }
    /**
     * Fetches WKT from server if required
     * @param {AbstractLayer} layer layer to get WKT for
     * @param {Function} callback gets the wkt as parameter or undefined if it's not available
     * @returns callback is used for return value
     */
    __getLayerCoverageWKT (layer, callback) {
        if (typeof layer.getGeometryWKT === 'function' && layer.getGeometryWKT()) {
            // we didn't load it but the layer has WKT present -> use it.
            // userlayers, analysis etc might do this
            callback(layer.getGeometryWKT());
            return;
        }
        const layerId = layer.getId();
        if (isNaN(layerId)) {
            // only layers that have numeric ids can have reasonable coverage WKT response for DescribeLayer
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
            callback(json.coverage);
        }).catch(error => {
            // reset flag to try again later
            LAYER_WKT_STATUS[layerId] = false;
            Oskari.log('WKT download').warn(error);
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
        var geometries = layer.getGeometry();
        if (!geometries) {
            return true;
        }

        if (geometries.length === 0) {
            return true;
        }

        var viewBounds = this.getMapModule().getCurrentExtent();
        var olExtent = [viewBounds.left, viewBounds.bottom, viewBounds.right, viewBounds.top];
        if (geometries[0].intersectsExtent(olExtent)) {
            return true;
        }
        return false;
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
        var me = this;
        if (this._previousTimer) {
            clearTimeout(this._previousTimer);
            this._previousTimer = null;
        }
        this._visibilityCheckOrder++;
        this._previousTimer = setTimeout(function () {
            me._checkLayersVisibility(me._visibilityCheckOrder);
        }, this._visibilityPollingInterval);
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
        var layers = this._sandbox.findAllSelectedMapLayers();
        var i;
        var layer;
        for (i = 0; i < layers.length; ++i) {
            layer = layers[i];
            if (layer.isVisible()) {
                this.handleMapLayerVisibility(layer);
            }
        }
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
        var scale = this.getMapModule().getMapScale();
        return layer.isInScale(scale);
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
        var scaleOk = layer.isVisible();
        var geometryMatch = layer.isVisible();
        var triggerChange = (isRequest === true);
        // if layer is visible check actual values
        if (layer.isVisible()) {
            scaleOk = this._isInScale(layer);
            geometryMatch = this.isInGeometry(layer);
        }
        // setup openlayers visibility
        // NOTE: DO NOT CHANGE visibility in internal layer object (it will
        // change in UI also)
        // this is for optimization purposes
        var mapLayers = this.getMapModule().getOLMapLayers(layer.getId());
        if (!mapLayers || !mapLayers.length) {
            if (triggerChange) {
                this.notifyLayerVisibilityChanged(layer, scaleOk, geometryMatch);
            }
            return;
        }
        if (scaleOk && geometryMatch && layer.isVisible()) {
        // show non-baselayer if in scale, in geometry and layer visible
            mapLayers.forEach(function (mapLayer) {
                if (!mapLayer.getVisible()) {
                    mapLayer.setVisible(true);
                    triggerChange = true;
                }
            });
        } else {
        // otherwise hide non-baselayer
            mapLayers.forEach(function (mapLayer) {
                if (mapLayer.getVisible()) {
                    mapLayer.setVisible(false);
                    triggerChange = true;
                }
            });
        }
        if (triggerChange) {
            this.notifyLayerVisibilityChanged(layer, scaleOk, geometryMatch);
        }
    }
    notifyLayerVisibilityChanged (layer, inScale, geometryMatch) {
        var event = Oskari.eventBuilder('MapLayerVisibilityChangedEvent')(layer, inScale, geometryMatch);
        this._sandbox.notifyAll(event);
    }
}
