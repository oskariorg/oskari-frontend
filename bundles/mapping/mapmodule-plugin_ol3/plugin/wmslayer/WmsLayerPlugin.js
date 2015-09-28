/**
 * @class Oskari.mapframework.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.WmsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     *
     *
     */
    function () {
        var me = this;

        me._clazz =
            'Oskari.mapframework.mapmodule.WmsLayerPlugin';
        me._name = 'WmsLayerPlugin';

        me._supportedFormats = {};
    },
    {
        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('wmslayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('wmslayer', null);
        },

        _createEventHandlers: function () {
            return {
                MapLayerEvent: function(event) {
                    var op = event.getOperation(),
                        layer = this.getSandbox().findMapLayerFromSelectedMapLayers(event.getLayerId());

                    if (op === 'update' && layer && layer.isLayerOfType('WMS')) {
                        this._updateLayer(layer);
                    }
                },
                AfterMapLayerRemoveEvent: function (event) {
                    this._afterMapLayerRemoveEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    this._afterChangeMapLayerOpacityEvent(event);
                },
                AfterChangeMapLayerStyleEvent: function (event) {
                    this._afterChangeMapLayerStyleEvent(event);
                }
            };
        },

        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS
         * @param {Oskari.mapframework.domain.WmsLayer[]} layers
         */
        preselectLayers: function (layers) {
            var sandbox = this.getSandbox(),
                i,
                layer,
                layerId;

            for (i = 0; i < layers.length; i += 1) {
                layer = layers[i];
                layerId = layer.getId();

                if (layer.isLayerOfType('WMS')) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

        },

        /**
         * @method _addMapLayerToMap
         * @private
         * Adds a single WMS layer to this map
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMS')) {
                return;
            }

            var layers = [], layerIdPrefix = 'layer_';
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap == true) && (layer.getSubLayers().length > 0)) {
                // replace layers with sublayers
                layers = layer.getSubLayers();
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            // loop all layers and add these on the map
            for (var i = 0, ilen = layers.length; i < ilen; i++) {
                var _layer = layers[i];
                var layerScales = this.getMapModule().calculateLayerScales(_layer.getMaxScale(), _layer.getMinScale());

                var wms = {
                    'URL' : _layer.getWmsUrls()[0],
                    'LAYERS' : _layer.getWmsName(),
                    'FORMAT' : 'image/png'
                };

                var layerImpl = new ol.layer.Tile({
                    source : new ol.source.TileWMS({
                        url : wms.URL,
                        //crossOrigin : 'anonymous',
                        params : {
                            'LAYERS' : wms.LAYERS,
                            'FORMAT' : wms.FORMAT
                        }
                    })
                });

                this.mapModule.addLayer(layerImpl, _layer, layerIdPrefix + _layer.getId());

                this._sandbox.printDebug("#!#! CREATED ol.layer.TileLayer for " + _layer.getId());

                if (keepLayerOnTop) {
                    // This might not be completly correct. We assume keepLayerOnTop means put this layer at the bottom as a faked baselayer.
                    this.mapModule.setLayerIndex(layerImpl, this.mapModule.getLayers().length);
                } else {
                    this.mapModule.setLayerIndex(layerImpl, 0);
                }
            }

        },

        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap : function(layer) {

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = "";
                if (layer.getSubLayers().length > 0) {
                    for (var i = 0; i < layer.getSubLayers().length; i++) {
                        var subtmp = layer.getSubLayers()[i];
                        var name = 'basemap_' + subtmp.getId();
                        var remLayer = this.mapModule.getLayersByName(name);
                        if (remLayer && remLayer[0]) {
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
        _afterChangeMapLayerOpacityEvent : function(event) {
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
                var mapLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
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
        _afterChangeMapLayerStyleEvent : function(event) {
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
        },

        getLayerTypeIdentifier : function() {
            return 'wmslayer';
        },
        getLayerTypeSelector : function() {
            return 'WMS';
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
        "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"]
    }

);