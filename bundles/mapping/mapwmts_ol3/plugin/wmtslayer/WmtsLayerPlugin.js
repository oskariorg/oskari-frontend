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


            var me = this,
                map = me.getMap(),
                parser = new ol.format.WMTSCapabilities();

            this.service.getCapabilitiesForLayer(layer, function(wmtsLayer) {
                    me.getSandbox().printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);
                    map.addLayer(wmtsLayer);
                    if (keepLayerOnTop) {
                        mapModule.bringToTop(wmtsLayer);
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
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmtsLayer} layer
         */
        removeMapLayerFromMap: function(layer) {

            if (!layer.isLayerOfType('WMTS')) {
                return;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = "";
                if (layer.getSubLayers().length > 0) {
                    for (var i = 0; i < layer.getSubLayers().length; i++) {
                        var subtmp = layer.getSubLayers()[i];
                        var name = 'basemap_' + subtmp.getId();
                        var remLayer = this.mapModule.getLayersByName(name);
                        if (remLayer && remLayer[0] && remLayer[0].destroy) {
                            /*remLayer[0].destroy();*/
                            this.mapModule.removeLayer(remLayer[0], layer, name);
                        }
                    }
                } else {
                    var name = 'layer_' + layer.getId();
                    var remLayer = this.mapModule.getLayersByName(name)[0];
                    this.mapModule.removeLayer(remLayer, layer, name);
                }
            } else {
                var name = 'layer_' + layer.getId();
                var remLayer = this.mapModule.getLayersByName(name);
                /* This should free all memory */
                this.mapModule.removeLayer(remLayer[0], layer, name);
            }
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

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                if (layer.getSubLayers().length > 0) {
                    for (var bl = 0; bl < layer.getSubLayers().length; bl++) {
                        var mapLayer = this.mapModule.getLayersByName('basemap_' + layer
                            .getSubLayers()[bl].getId());
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                } else {
                    var mapLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
                    if (mapLayer[0] != null) {
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                }
            } else {
                this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
                var mapLayer = this._mapModule.getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        },

        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        afterChangeMapLayerStyleEvent: function(event) {
            return;
            var layer = event.getMapLayer();

            // Change selected layer style to defined style
            if (!layer.isBaseLayer()) {
                var styledLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
                /*if (styledLayer != null) {
             styledLayer[0].mergeNewParams({
             styles : layer.getCurrentStyle().getName()
             });
             }*/
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
