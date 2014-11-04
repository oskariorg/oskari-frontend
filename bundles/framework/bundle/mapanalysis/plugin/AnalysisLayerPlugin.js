/**
 * @class Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin
 * Provides functionality to draw Analysis layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */

    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin';
        me._name = 'AnalysisLayerPlugin';

        me.wfsLayerPlugin = null;
        me._supportedFormats = {};
        me.ajaxUrl = null;
        if (me._config && me._config.ajaxUrl) {
            me.ajaxUrl = me._config.ajaxUrl;
        }
    }, {
        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'ANALYSIS',

        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('analysislayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('analysislayer', null);
        },

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         *
         *
         */
        _initImpl: function () {
            // register domain builder
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'analysislayer',
                    'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer'
                );
                layerModelBuilder = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder',
                    this.getSandbox()
                );
                mapLayerService.registerLayerModelBuilder(
                    'analysislayer',
                    layerModelBuilder
                );
            }

            this.wfsLayerPlugin = this.getSandbox().findRegisteredModuleInstance(
                'MainMapModuleWfsLayerPlugin'
            );
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         *
         *
         */
        _startPluginImpl: function () {
            if (!this.ajaxUrl) {
                this.ajaxUrl =
                    this.getSandbox().getAjaxUrl() + 'action_route=GetAnalysis?';
            }
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                /**
                 * @method AfterMapMoveEvent
                 * @param {Object} event
                 */
                AfterMapMoveEvent: function (event) {
                    // tk  me.wfsLayerPlugin.mapMoveHandler();
                },

                /**
                 * @method WFSFeaturesSelectedEvent
                 * @param {Object} event
                 */
                WFSFeaturesSelectedEvent: function (event) {
                    // tk  me.wfsLayerPlugin.featuresSelectedHandler(event);
                },

                /**
                 * @method MapClickedEvent
                 * @param {Object} event
                 */
                MapClickedEvent: function (event) {
                    // tk me.wfsLayerPlugin.mapClickedHandler(event);
                },

                /**
                 * @method GetInfoResultEvent
                 * @param {Object} event
                 */
                GetInfoResultEvent: function (event) {
                    // tk me.wfsLayerPlugin.getInfoResultHandler(event);
                },

                /**
                 * @method AfterChangeMapLayerStyleEvent
                 * @param {Object} event
                 */
                AfterChangeMapLayerStyleEvent: function (event) {
                    // tk  me.wfsLayerPlugin.changeMapLayerStyleHandler(event);
                },

                /**
                 * @method MapLayerVisibilityChangedEvent
                 * @param {Object} event
                 */
                MapLayerVisibilityChangedEvent: function (event) {
                    me._mapLayerVisibilityChangeEvent(event);
                },
                /**
                 * @method MapSizeChangedEvent
                 * @param {Object} event
                 */
                MapSizeChangedEvent: function (event) {
                    // tk me.wfsLayerPlugin.mapSizeChangedHandler(event);
                },

                /**
                 * @method WFSSetFilter
                 * @param {Object} event
                 */
                WFSSetFilter: function (event) {
                    // tk me.wfsLayerPlugin.setFilterHandler(event);
                },
                AfterMapLayerRemoveEvent: function (event) {
                    me._afterMapLayerRemoveEvent(event);
                    // tk  me.wfsLayerPlugin.mapLayerRemoveHandler(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    me._afterChangeMapLayerOpacityEvent(event);
                    //me.wfsLayerPlugin.afterChangeMapLayerOpacityEvent(event);
                }
            };
        },

        /**
         * @method preselectLayers
         * Adds given analysis layers to map if of type WFS
         * @param {Oskari.mapframework.domain.WfsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (!layer.isLayerOfType(this._layerType)) {
                    continue;
                }

                sandbox.printDebug('preselecting ' + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }

        },

        /**
         * Adds a single Analysis layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var me = this,
                openLayerId = 'layer_' + layer.getId(),
                imgUrl = layer.getWpsUrl() + layer.getWpsLayerId(),
                layerScales = this.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),
                openLayer = new OpenLayers.Layer.WMS(
                    openLayerId,
                    imgUrl,
                    {
                        layers: layer.getWpsName(),
                        transparent: true,
                        styles: layer.getOverrideSld(),
                        format: 'image/png'
                    },
                    {
                        scales: layerScales,
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        singleTile: true,
                        buffer: 0
                    }
                );

            openLayer.opacity = layer.getOpacity() / 100;

            me.getMap().addLayer(openLayer);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for AnalysisLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                me.getMap().setLayerIndex(openLayer, me.getMap().layers.length);
            } else {
                me.getMap().setLayerIndex(openLayer, 0);
            }

            me.handleBounds(layer);
        },

        /**
         * @method handleBounds
         * @private
         *
         * Make use of the layer bounding box information to set appropriate map view
         *
         * @param
         * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
         *            layer layer for which to handle bounds
         *
         */
        handleBounds: function (layer) {
            var sandbox = this.getSandbox();

            this._parseGeometryForLayer(layer);

            var geom = layer.getGeometry();

            if ((geom === null) || (typeof geom === 'undefined') ) {
                return;
            }
            if (geom.length === 0) {
                return;
            }

            var olPolygon = geom[0],
                bounds = olPolygon.getBounds(),
                centroid = olPolygon.getCentroid(),
                epsilon = 1.0,
                rb = sandbox.getRequestBuilder('MapMoveRequest'),
                req;

            if (rb) {
                if (olPolygon.getArea() < epsilon) {
                    // zoom to level 9 if a single point
                    req = rb(centroid.x, centroid.y, 9);
                    sandbox.request(this, req);
                } else {
                    req = rb(centroid.x, centroid.y, bounds);
                    sandbox.request(this, req);
                }
            }
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
        _parseGeometryForLayer: function (layer) {
            // parse geometry if available
            if (layer.getGeometry && layer.getGeometry().length === 0) {
                var layerWKTGeom = layer.getGeometryWKT();
                if (!layerWKTGeom) {
                    // no wkt, dont parse
                    return;
                }
                // http://dev.openlayers.org/docs/files/OpenLayers/Format/WKT-js.html
                // parse to OpenLayers.Geometry.Geometry[] array ->
                // layer.setGeometry();
                var wkt = new OpenLayers.Format.WKT(),
                    features = wkt.read(layerWKTGeom);
                if (features) {
                    if (features.constructor !== Array) {
                        features = [features];
                    }
                    var geometries = [],
                        i;

                    for (i = 0; i < features.length; i += 1) {
                        geometries.push(features[i].geometry);
                    }
                    layer.setGeometry(geometries);
                } else {
                    // 'Bad WKT';
                }
            }
        },

      /**
         * @method _afterMapLayerRemoveEvent
         * Handle AfterMapLayerRemoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
         *            event
         */
        _afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }
            this._removeMapLayerFromMap(layer);
        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var mapLayer = this.getFirstOLMapLayer(layer);
            /* This should free all memory */
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.destroy();
            }
        },

        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WfsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType(this._layerType)) {
                return null;
            }

            return this._map.getLayersByName('layer_' + layer.getId());
        },

        getFirstOLMapLayer: function (layer) {
            var ls = this.getOLMapLayers(layer),
                ret = null;

            if (ls && ls.length > 0 && ls[0] !== null && ls[0] !== undefined) {
                ret = ls[0];
            }
            return ret;
        },

        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer();

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            var mapLayer = this.getFirstOLMapLayer(layer);
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.setOpacity(layer.getOpacity() / 100);
            }
        },

        /**
         * @method _mapLayerVisibilityChangedEvent
         * Handle MapLayerVisibilityChangedEvent
         * @private
         * @param {Oskari.mapframework.event.common.MapLayerVisibilityChangedEvent}
         */
        _mapLayerVisibilityChangeEvent: function (evt) {
            var layer = evt.getMapLayer();

            if (!layer.isLayerOfType(this._layerType)) {
                return;
            }

            var mapLayer = this.getFirstOLMapLayer(layer);
            if (mapLayer !== null && mapLayer !== undefined) {
                mapLayer.setVisibility(layer.isVisible());
            }
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
    }
);