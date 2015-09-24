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
            var me = this;
            var olMapLayers = me.getOLMapLayers(layer),
                sandbox = me.getSandbox();
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
                console.log("Error updating WMTS layer");
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


            // need to keep track of the index we should place the WMTS once capabilities have loaded
            var selectedLayers = this.getSandbox().findAllSelectedMapLayers();
            var index = _.findIndex(selectedLayers, function(selected) {
              return selected.getId() === layer.getId();
            });

            var me = this;
            var map = me.getMap();
            this.service.getCapabilitiesForLayer(layer, function(wmtsLayer) {
                    me.getSandbox().printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);
                    map.addLayer(wmtsLayer);
                    if (keepLayerOnTop) {
                        // use the index as it was when addMapLayer was called
                        // bringing layer on top causes timing errors, because of async capabilities load
                        map.setLayerIndex(wmtsLayer, index);
                    } else {
                        map.setLayerIndex(wmtsLayer, 0);
                    }
            }, function() {
                console.log("Error loading capabilitiesXML");
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

        afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                oLayer = this.getOLMapLayers(layer);

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
