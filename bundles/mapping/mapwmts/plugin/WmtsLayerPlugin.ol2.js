/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    function () {
        var me = this;

        me._clazz = 'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin';
        me._name = 'WmtsLayerPlugin';
        me._supportedFormats = {};
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
                //TODO: signal failure - no map layer service
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
                MapLayerEvent: function(event) {
                    var op = event.getOperation(),
                        layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());

                    if(!layer || !layer.isLayerOfType('WMTS')) {
                        return;
                    }
                    if (layer && op === 'update') {
                        //Maplayer updated -> url might have changed (case forceProxy). Update that.
                        me._replaceMapLayer(layer);
                    }
                },
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
         * Replaces a layer on the map with a layer created with an updated config. If layer hasn't been added to map nothing is done.
         * @param {Oskari layerconfig} layer
         *
         */
        _replaceMapLayer: function(layer) {
            var me = this,
                olMapLayers = me.getOLMapLayers(layer);

            if (!olMapLayers || olMapLayers.length === 0) {
                return;
            }

            //layer added to map -> recreate with the new config
            var olMapLayer = olMapLayers[0];
            var oldLayerIndex = this._map.getLayerIndex(olMapLayer);
            var map = this.getMap();

            this.service.getCapabilitiesForLayer(layer, function(wmtsLayer) {
                map.removeLayer(olMapLayer);
                map.addLayer(wmtsLayer);
                map.setLayerIndex(wmtsLayer, oldLayerIndex);
            }, function() {
            });
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL2 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
         _registerLayerEvents: function(layer, oskariLayer){
           var me = this;

           layer.events.register("tileloadstart", layer, function(){
             me.getMapModule().loadingState( oskariLayer.getId(), true);
           });

           layer.events.register("tileloaded", layer, function(){
             me.getMapModule().loadingState( oskariLayer.getId(), false);
           });

          layer.events.register("tileerror", layer, function(){
            me.getMapModule().loadingState( oskariLayer.getId(), null, true );
         });
         },
        /**
         *
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];

                if (layer.isLayerOfType('WMTS')) {
                    sandbox.printDebug('preselecting ' + layer.getId());
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }
        },

        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMTS')) {
                return;
            }
            var me = this;
            var map = me.getMap();
            // Add placeholder for the layer
            var wmtsHolderLayer = this._getPlaceHolderWmtsLayer(layer);
            map.addLayer(wmtsHolderLayer);
            index = map.layers.length;
                this.service.getCapabilitiesForLayer(layer, function(wmtsLayer) {
                    me.getSandbox().printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);
                    // Get the reserved current index for wmts layer
                    var holderLayerIndex = map.getLayerIndex(wmtsHolderLayer);
                    map.removeLayer(wmtsHolderLayer);
                    me._registerLayerEvents(wmtsLayer, layer);
                    map.addLayer(wmtsLayer);
                    if (keepLayerOnTop) {
                        // use the placeholder layer index for valid layer order because of async add
                        map.setLayerIndex(wmtsLayer, holderLayerIndex);
                    } else {
                        map.setLayerIndex(wmtsLayer, 0);
                    }
            }, function() {
            });
        },

        __getLayerName : function(layer) {
            var name = 'layer_' + layer.getId();
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                name = 'basemap_' + layer.getId();
            }
            // removing all dots (they cause problems on OL)
            return name.split('.').join('');
        },

        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType('WMTS')) {
                return null;
            }
            return this._map.getLayersByName(this.__getLayerName(layer));
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

        removeMapLayerFromMap: function (layer) {
            var oLayer = this.getOLMapLayers(layer);

            if (oLayer && oLayer[0]) {
                oLayer[0].destroy();
            }
        },


        //in case of wmts layer timing issues the request is tried a couple of times. Use the counter to prevent trying again til the end of time.
        afterChangeOpacityRetryCounter: {},
        afterChangeMapLayerOpacityEvent: function (event) {
            var me = this;
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer);

            if (layer && layer.isLayerOfType('WMTS') && (!oLayer || oLayer.length === 0)) {
                if (!me.afterChangeOpacityRetryCounter[layer.getId()]) {
                    me.afterChangeOpacityRetryCounter[layer.getId()] = 0;
                }
                if (me.afterChangeOpacityRetryCounter[layer.getId()]++ < 10) {
                    window.setTimeout(function() {
                        me.afterChangeMapLayerOpacityEvent(event);
                    }, 500);
                }
            } else {
                me.afterChangeOpacityRetryCounter[layer.getId()] = 0;
            }
            if (oLayer && oLayer[0]) {
                oLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        },

        /***********************************************************
         * Handle AfterChangeMapLayerStyleEvent
         *
         * @param {Object}
         *            event
         */
        afterChangeMapLayerStyleEvent: function (event) {
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer),
                newStyle = layer.getCurrentStyle().getName();

            if (oLayer && oLayer[0]) {
                // only works for layers with requestEncoding = 'KVP'
                oLayer[0].mergeNewParams({
                    style: newStyle
                });
            }
        },
        /**
         * Reserves correct position for wmts layer, which will be added async later
         * This layer is removed, when the finalized wmts layer will be added
         * @param layer
         * @returns {*}
         * @private
         */
        _getPlaceHolderWmtsLayer: function (layer) {

            var layerHolder = new OpenLayers.Layer.Vector('layer_' + layer.getId(),{
                visibility: false
            });
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
