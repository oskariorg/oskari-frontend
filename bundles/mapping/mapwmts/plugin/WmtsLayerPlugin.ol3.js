/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin';
        me._name = 'WmtsLayerPlugin';
        me._supportedFormats = {};
        this._layers = {};
    }, {

        register: function () {
            this.getMapModule().setLayerPlugin('WmtsLayer', this);
        },

        unregister: function () {
            this.getMapModule().setLayerPlugin('WmtsLayer', null);
        },

        _initImpl: function () {
            // register domain builder
            var layerModelBuilder,
                mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (!mapLayerService) {
                // no map layer service - TODO: signal failure
                return;
            }

            mapLayerService.registerLayerModel('wmtslayer', 'Oskari.mapframework.wmts.domain.WmtsLayer');
            layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
            mapLayerService.registerLayerModelBuilder('wmtslayer', layerModelBuilder);

            this.service = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', mapLayerService, this.getSandbox());
        },

        _createEventHandlers: function () {
            var me = this;

            return {
                AfterMapLayerRemoveEvent: function (event) {
                    me.afterMapLayerRemoveEvent(event);
                },

                AfterChangeMapLayerOpacityEvent: function (event) {
                    me.afterChangeMapLayerOpacityEvent(event);
                },

                AfterChangeMapLayerStyleEvent: function (event) {
                    me.afterChangeMapLayerStyleEvent(event);
                }
            };
        },

        /**
         *
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType('WMTS')) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }
        },

        /**
         * @method _addMapLayerToMap
         * @private
         * Adds a single Wmts layer to this map
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function(layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMTS')) {
                return;
            }

            var me = this;
            var map = me.getMap();
            var mapModule = me.getMapModule();
            var wmtsHolderLayer = this._getPlaceHolderWmtsLayer(layer);
            map.addLayer(wmtsHolderLayer);
            this.service.getCapabilitiesForLayer(layer, function(wmtsLayer) {
                    me.getSandbox().printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);
                // Get the reserved current index for wmts layer
                var holderLayerIndex = mapModule.getLayerIndex(wmtsHolderLayer);
                map.removeLayer(wmtsHolderLayer);
                wmtsLayer.setVisible(layer.isVisible());
                    if (keepLayerOnTop) {
                        // use the index as it was when addMapLayer was called
                        // bringing layer on top causes timing errors, because of async capabilities load
                        map.getLayers().insertAt(holderLayerIndex, wmtsLayer);
                    } else {
                        map.getLayers().insertAt(0, wmtsLayer);
                    }
                    me._layers[layer.getId()] = wmtsLayer;
            }, function() {
                console.log("Error loading capabilitiesXML");
            });

        },

        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType('WMTS')) {
                return null;
            }
            if(!this._layers[layer.getId()]) {
                return null;
            }
            // only single layer/id, wrap it in an array
            return [this._layers[layer.getId()]];
        },

        /***********************************************************
         * Handle AfterMapLayerRemoveEvent
         *
         * @param {Object}
         *            event
         */
        afterMapLayerRemoveEvent: function (event) {
            var layer = event.getMapLayer();

            this.removeMapLayerFromMap(layer);
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         */
        removeMapLayerFromMap: function(layer) {

            if (!layer.isLayerOfType('WMTS') || !this._layers[layer.getId()]) {
                return;
            }
            var wmtsLayer = this._layers[layer.getId()];
            this.getMapModule().removeLayer(wmtsLayer, layer);
            delete this._layers[layer.getId()];
        },
        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        afterChangeMapLayerOpacityEvent: function(event) {
            var layer = event.getMapLayer();
            var olLayers = this.getOLMapLayers(layer);
            _.each(olLayers, function(ol) {
                ol.setOpacity(layer.getOpacity() / 100);
            });
        },

        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        afterChangeMapLayerStyleEvent: function(event) {
            var layer = event.getMapLayer();

            // Change selected layer style to defined style
            var styledLayer = this.getOLMapLayers(layer);
                /*if (styledLayer != null) {
             styledLayer[0].mergeNewParams({
             styles : layer.getCurrentStyle().getName()
             });
             }*/
        },  /**
         * Reserves correct position for wmts layer, which will be added async later
         * This layer is removed, when the finalized wmts layer will be added
         * @param layer
         * @returns {*}
         * @private
         */
        _getPlaceHolderWmtsLayer: function (layer) {

            var layerHolder = new ol.layer.Vector({
                    source: new ol.source.Vector({}
                    ),
                    title: 'layer_' + layer.getId(),
                    visible: false
                }
            );

            return layerHolder;
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
