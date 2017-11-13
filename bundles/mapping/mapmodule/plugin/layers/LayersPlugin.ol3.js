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
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        var me = this;
        me._clazz =
            'Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin';
        me._name = 'LayersPlugin';

        this._supportedFormats = {};
        // visibility checks are cpu intensive so only make them when the map has
        // stopped moving
        // after map move stopped -> activate a timer that will
        // do the check after _visibilityPollingInterval milliseconds
        this._visibilityPollingInterval = 1500;
        this._visibilityCheckOrder = 0;
        this._previousTimer = null;
    }, {
    _createEventHandlers: function () {
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
    },

    _createRequestHandlers: function () {
        var me = this,
            sandbox = me.getSandbox();

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
    },

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
    _parseGeometryForLayer : function(layer) {
        // parse geometry if available
        if(layer.getGeometry && layer.getGeometry().length === 0) {
            var layerWKTGeom = layer.getGeometryWKT();
            if(!layerWKTGeom) {
                // no wkt, dont parse
                return;
            }

            var wkt = new ol.format.WKT();
            var geometry = wkt.readGeometry(layerWKTGeom);

            if (geometry) {
                layer.setGeometry([geometry]);
            }
        }
    },

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
    isInGeometry : function(layer) {
        var geometries = layer.getGeometry();
        if(!geometries) {
            return true;
        }

        if (geometries.length === 0) {
            return true;
        }

        var viewBounds = this.getMapModule().getCurrentExtent();
        var ol3Extent = [viewBounds.left, viewBounds.bottom, viewBounds.right, viewBounds.top];
        if(geometries[0].intersectsExtent(ol3Extent)) {
            return true;
        }
        return false;
    },
    /**
     * @method getGeometryCenter
     *
     * @param {ol.geom.Geometry} geometry
     * @return {Object} centroid
     */
    getGeometryCenter: function (geometry) {
        if (geometry.getType()==="Point") {
            var point = geometry.getCoordinates();
            return {lon: point[0], lat: point[1]};
        } else if (geometry.getType()==="Polygon"){
            var extent = geometry.getExtent();
            return {
                lon: extent[0] + (extent[2]-extent[0])/2,
                lat: extent[1] + (extent[3]-extent[1])/2
            };
        } else {
            //
        }
    },
    /**
     * @method getGeometryBounds
     *
     * @param {ol.geom.Geometry} geometry
     * @return {Object} like OpenLayers bounds
     */
    getGeometryBounds: function (geometry) {
        var extent = geometry.getExtent();
        return {
            left: extent[0],
            bottom: extent[1],
            right: extent[2],
            top: extent[3]
        };
    },
    /**
     * @method _scheduleVisiblityCheck
     * @private
     * Schedules a visibility check on selected layers. After given timeout
     * calls  _checkLayersVisibility()
     */
    _scheduleVisiblityCheck: function () {
        var me = this;
        if (this._previousTimer) {
            clearTimeout(this._previousTimer);
            this._previousTimer = null;
        }
        this._visibilityCheckOrder++;
        this._previousTimer = setTimeout(function () {
            me._checkLayersVisibility(me._visibilityCheckOrder);
        }, this._visibilityPollingInterval);
    },
    /**
     * @method _checkLayersVisibility
     * @private
     * Loops through selected layers and notifies other modules about visibility
     * changes
     * @param {Number} orderNumber checks orderNumber against
     * #_visibilityCheckOrder
     *      to see if this is the latest check, if not - does nothing
     */
    _checkLayersVisibility: function (orderNumber) {
        if (orderNumber !== this._visibilityCheckOrder) {
            return;
        }
        var layers = this._sandbox.findAllSelectedMapLayers(),
            i,
            layer;
        for (i = 0; i < layers.length; ++i) {
            layer = layers[i];

            if (layer.isVisible()) {
                this.notifyLayerVisibilityChanged(layer);
            }
        }
        this._visibilityCheckScheduled = false;
    },
    /**
     * @method _isInScale
     * @private
     * Checks if the maps scale is in the given maplayers scale range
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check scale against
     * @return {Boolean} true maplayer is visible in current zoomlevel
     */
    _isInScale: function (layer) {
        var scale = this.getMapModule().getMapScale();
        return layer.isInScale(scale);
    },
    /**
     * @method notifyLayerVisibilityChanged
     * Notifies bundles about layer visibility changes by sending MapLayerVisibilityChangedEvent.
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check against
     */
    notifyLayerVisibilityChanged : function(layer) {
        var scaleOk = layer.isVisible();
        var geometryMatch = layer.isVisible();
        // if layer is visible check actual values
        if(layer.isVisible()) {
            scaleOk = this._isInScale(layer);
            geometryMatch = this.isInGeometry(layer);
        }
        // setup openlayers visibility
        // NOTE: DO NOT CHANGE visibility in internal layer object (it will
        // change in UI also)
        // this is for optimization purposes
        var mapModule = this.getMapModule(),
            mapLayers = mapModule.getOLMapLayers(layer.getId()),
            mapLayer = mapLayers.length ? mapLayers[0] : null;

        if(scaleOk && geometryMatch && layer.isVisible()) {
            // show non-baselayer if in scale, in geometry and layer visible
            if (mapLayer && !mapLayer.getVisible()) {
                mapLayer.setVisible(true);
            }
        } else {
            // otherwise hide non-baselayer
            if (mapLayer && mapLayer.getVisible()) {
                mapLayer.setVisible(false);
            }
        }
        var event = this._sandbox.getEventBuilder('MapLayerVisibilityChangedEvent')(layer, scaleOk, geometryMatch);
        this._sandbox.notifyAll(event);
    }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.AbstractMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    });
