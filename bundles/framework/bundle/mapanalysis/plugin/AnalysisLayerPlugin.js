/**
 * @class Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin
 * Provides functionality to draw Analysis layers on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        this.mapModule = null;
        this.pluginName = null;
        this.wfsLayerPlugin = null;
        this._sandbox = null;
        this._map = null;
        this._supportedFormats = {};
        this.config = config;
        this.ajaxUrl = null;
        if (config && config.ajaxUrl) {
            this.ajaxUrl = config.ajaxUrl;
        }
    }, {
        /** @static @property __name plugin name */
        __name: 'AnalysisLayerPlugin',

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'ANALYSIS',

        /**
         * @method getName
         * @return {String} plugin name
         */
        getName: function () {
            return this.pluginName;
        },
        /**
         * @method getMapModule
         * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        getMapModule: function () {
            return this.mapModule;
        },
        /**
         * @method setMapModule
         * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
         * module
         */
        setMapModule: function (mapModule) {
            this.mapModule = mapModule;
            this.pluginName = mapModule.getName() + this.__name;
        },
        /**
         * @method hasUI
         * This plugin doesn't have an UI that we would want to ever hide so always returns false
         * @return {Boolean}
         */
        hasUI: function () {
            return false;
        },
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
         * @method init
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        init: function (sandbox) {

            var sandboxName = (this.config ? this.config.sandbox : null) || 'sandbox';
            var sbx = Oskari.getSandbox(sandboxName);

            // register domain builder
            var mapLayerService = sbx.getService('Oskari.mapframework.service.MapLayerService');
            if (mapLayerService) {
                mapLayerService.registerLayerModel('analysislayer', 'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer');

                var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder', sbx);
                mapLayerService.registerLayerModelBuilder('analysislayer', layerModelBuilder);
            }

            this.wfsLayerPlugin = sbx.findRegisteredModuleInstance('MainMapModuleWfsLayerPlugin');


        },
        /**
         * @method startPlugin
         * Interface method for the plugin protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        startPlugin: function (sandbox) {
            this._sandbox = sandbox;
            this._map = this.getMapModule().getMap();

            sandbox.register(this);
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
            if (!this.ajaxUrl) {
                this.ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetAnalysis?';
            }

        },
        /**
         * @method stopPlugin
         * Interface method for the plugin protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stopPlugin: function (sandbox) {
            var p;
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }

            sandbox.unregister(this);

            this._map = null;
            this._sandbox = null;
        },
        /**
         * @method start
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        start: function (sandbox) {},
        /**
         * @method stop
         * Interface method for the module protocol
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        stop: function (sandbox) {},
        /**
         * @static
         * @property eventHandlers
         */
        eventHandlers: {
            /**
             * @method AfterMapMoveEvent
             * @param {Object} event
             */
            "AfterMapMoveEvent": function (event) {
                // tk  this.wfsLayerPlugin.mapMoveHandler();
            },

            /**
             * @method WFSFeaturesSelectedEvent
             * @param {Object} event
             */
            'WFSFeaturesSelectedEvent': function (event) {
                // tk  this.wfsLayerPlugin.featuresSelectedHandler(event);
            },

            /**
             * @method MapClickedEvent
             * @param {Object} event
             */
            'MapClickedEvent': function (event) {
                // tk this.wfsLayerPlugin.mapClickedHandler(event);
            },

            /**
             * @method GetInfoResultEvent
             * @param {Object} event
             */
            'GetInfoResultEvent': function (event) {
                // tk this.wfsLayerPlugin.getInfoResultHandler(event);
            },

            /**
             * @method AfterChangeMapLayerStyleEvent
             * @param {Object} event
             */
            'AfterChangeMapLayerStyleEvent': function (event) {
                // tk  this.wfsLayerPlugin.changeMapLayerStyleHandler(event);
            },

            /**
             * @method MapLayerVisibilityChangedEvent
             * @param {Object} event
             */
            'MapLayerVisibilityChangedEvent': function (event) {
                this._mapLayerVisibilityChangeEvent(event);
            },
            /**
             * @method MapSizeChangedEvent
             * @param {Object} event
             */
            'MapSizeChangedEvent': function (event) {
                // tk this.wfsLayerPlugin.mapSizeChangedHandler(event);
            },

            /**
             * @method WFSSetFilter
             * @param {Object} event
             */
            'WFSSetFilter': function (event) {
                // tk this.wfsLayerPlugin.setFilterHandler(event);
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this._afterMapLayerRemoveEvent(event);
                // tk  this.wfsLayerPlugin.mapLayerRemoveHandler(event);
            },
            'AfterChangeMapLayerOpacityEvent': function (event) {
                this._afterChangeMapLayerOpacityEvent(event);
                //this.wfsLayerPlugin.afterChangeMapLayerOpacityEvent(event);
            },
            'MapAnalysis.AnalysisVisualizationChangeEvent': function (event) {
                this._afterAnalysisVisualizationChangeEvent(event);
            }
        },

        /**
         * @method onEvent
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         */
        onEvent: function (event) {
            return this.eventHandlers[event.getName()].apply(this, [event]);
        },
        /**
         * @method preselectLayers
         * Adds given analysis layers to map if of type WFS
         * @param {Oskari.mapframework.domain.WfsLayer[]} layers
         */
        preselectLayers: function (layers) {

            var sandbox = this._sandbox,
                i,
                layer,
                layerId;
            for (i = 0; i < layers.length; i++) {
                layer = layers[i];
                layerId = layer.getId();

                if (!layer.isLayerOfType(this._layerType)) {
                    continue;
                }

                sandbox.printDebug("preselecting " + layerId);
                this.addMapLayerToMap(layer, true, layer.isBaseLayer());
            }

        },
        addMapLayerToMap: function(layer, keepLayerOnTop, isBaseMap) {
            this.addMapLayerToMap(layer, keepLayerOnTop, isBaseMap);
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

            var me = this;

            var openLayerId = 'layer_' + layer.getId();
            var imgUrl = layer.getWpsUrl() + 'wpsLayerId=' + layer.getWpsLayerId();
            var layerScales = this.getMapModule()
                .calculateLayerScales(layer.getMaxScale(), layer.getMinScale());

            var openLayer = new OpenLayers.Layer.WMS(openLayerId, imgUrl, {
                layers: layer.getWpsName(),
                transparent: true,
                format: "image/png"
            }, {
                scales: layerScales,
                isBaseLayer: false,
                displayInLayerSwitcher: false,
                visibility: true,
                singleTile: true,
                buffer: 0
            });


            openLayer.opacity = layer.getOpacity() / 100;

            this._map.addLayer(openLayer);

            this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for AnalysisLayer " + layer.getId());

            if (keepLayerOnTop) {
                this._map.setLayerIndex(openLayer, this._map.layers.length);
            } else {
                this._map.setLayerIndex(openLayer, 0);
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

            var mapLayer = this.getOLMapLayers(layer);
            /* This should free all memory */
            mapLayer[0].destroy();
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

            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this.getOLMapLayers(layer);
            if (mapLayer && mapLayer.length > 0 && mapLayer[0] !== null && mapLayer[0] !== undefined) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },

        _afterAnalysisVisualizationChangeEvent: function (event) {
            var layer = event.getLayer();
            var params = event.getParams();
            var mapLayer = this.getOLMapLayers(layer);
            // TODO: add handling

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

            var mapLayer = this.getOLMapLayers(layer);
            if (mapLayer && mapLayer.length > 0 && mapLayer[0] !== null && mapLayer[0] !== undefined) {
                mapLayer[0].setVisibility(layer.isVisible());
            }

        }

    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
    });