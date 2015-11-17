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
        this._layers = {};
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
                sandbox = this.getSandbox(),
                openLayerId = 'layer_' + layer.getId(),
                imgUrl = layer.getWpsUrl() + layer.getWpsLayerId(),
                layerScales = this.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),

                wms = {
                    'URL' : imgUrl,
                    'LAYERS' : layer.getWpsName(),
                    'FORMAT' : 'image/png'
                },

                openlayer = new ol.layer.Tile({
                    source : new ol.source.TileWMS({
                        url : wms.URL,
                        params : {
                            'LAYERS' : wms.LAYERS,
                            'FORMAT' : wms.FORMAT
                        }
                    }),
                    id: layer.getId(),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(me.getSandbox().getMap().getScale()) && layer.isVisible(),
                    singleTile: true,
                    styles: layer.getOverrideSld(),
                    buffer: 0
                });

            openlayer.opacity = layer.getOpacity() / 100;

            this.getMapModule().addLayer(openlayer, layer, layer.getName());

            this._layers[layer.getId()] = openlayer;

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for AnalysisLayer ' +
                layer.getId()
            );

            if (keepLayerOnTop) {
                me.getMapModule().setLayerIndex(openlayer, me.getMap().getLayers().getArray().length);
            } else {
                me.getMapModule().setLayerIndex(openlayer, 0);
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
            if (!layer.isLayerOfType('ANALYSIS') || !this._layers[layer.getId()]) {
                return;
            }
            var analysisLayer = this._layers[layer.getId()];
            this.getMapModule().removeLayer(analysisLayer, layer);
            delete this._layers[layer.getId()];
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
            if(!this._layers[layer.getId()]) {
                return null;
            }
            // only single layer/id, wrap it in an array
            return [this._layers[layer.getId()]];
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
            var olLayers = this.getOLMapLayers(layer);
            _.each(olLayers, function(ol) {
                ol.setOpacity(layer.getOpacity() / 100);
            });
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

            var olLayers = this.getOLMapLayers(layer);

            _.each(olLayers, function(ol) {
                ol.setVisible(layer.isVisible());
            });
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