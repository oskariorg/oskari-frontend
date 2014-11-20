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
         * Adds a single WMS layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            if (!layer.isLayerOfType('WMS')) {
                return;
            }

            var layers = [],
                subLayers = layer.getSubLayers(),
                layerIdPrefix = 'layer_',
                i,
                ilen;
            // insert layer or sublayers into array to handle them identically
            if (subLayers.length > 0) {
                // replace layers with sublayers
                layers = subLayers;
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            // loop all layers and add these on the map
            for (i = 0, ilen = layers.length; i < ilen; i += 1) {
                var _layer = layers[i];

                // default params and options
                var defaultParams = {
                        layers: _layer.getWmsName(),
                        transparent: true,
                        id: _layer.getId(),
                        styles: _layer.getCurrentStyle().getName(),
                        format: 'image/png'
                    },
                    defaultOptions = {
                        layerId: _layer.getWmsName(),
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: true,
                        buffer: 0
                    },
                    layerParams = _layer.getParams(),
                    layerOptions = _layer.getOptions();
                if (_layer.getMaxScale() || _layer.getMinScale()) {
                    // use resolutions instead of scales to minimize chance of transformation errors
                    var layerResolutions = this.getMapModule().calculateLayerResolutions(_layer.getMaxScale(), _layer.getMinScale());
                    defaultOptions.resolutions = layerResolutions;
                }
                // override default params and options from layer
                var key;
                for (key in layerParams) {
                    if (layerParams.hasOwnProperty(key)) {
                        defaultParams[key] = layerParams[key];
                    }
                }
                for (key in layerOptions) {
                    if (layerOptions.hasOwnProperty(key)) {
                        defaultOptions[key] = layerOptions[key];
                    }
                }

                var openLayer = new OpenLayers.Layer.WMS(layerIdPrefix + _layer.getId(), _layer.getWmsUrls(), defaultParams, defaultOptions);
                openLayer.opacity = _layer.getOpacity() / 100;

                this.getMap().addLayer(openLayer);
                this.getSandbox().printDebug(
                    '#!#! CREATED OPENLAYER.LAYER.WMS for ' + _layer.getId()
                );

                if (keepLayerOnTop) {
                    this.getMap().setLayerIndex(openLayer, this.getMap().layers.length);
                } else {
                    this.getMap().setLayerIndex(openLayer, 0);
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

            this._removeMapLayerFromMap(layer);
        },
        /**
         * @method _afterMapLayerRemoveEvent
         * Removes the layer from the map
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {

            if (!layer.isLayerOfType('WMS')) {
                return;
            }
            var remLayer;
            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = '',
                    i;
                if (layer.getSubLayers().length > 0) {
                    for (i = 0; i < layer.getSubLayers().length; i += 1) {
                        var subtmp = layer.getSubLayers()[i];
                        remLayer = this.getMap().getLayersByName('basemap_' + subtmp.getId());
                        if (remLayer && remLayer[0] && remLayer[0].destroy) {
                            remLayer[0].destroy();
                        }
                    }
                } else {
                    remLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                    remLayer[0].destroy();
                }
            } else {
                remLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                /* This should free all memory */
                remLayer[0].destroy();
            }
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {

            if (!layer.isLayerOfType('WMS')) {
                return null;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                var baseLayerId = '';
                if (layer.getSubLayers().length > 0) {
                    var olLayers = [],
                        i;
                    for (i = 0; i < layer.getSubLayers().length; i += 1) {
                        var tmpLayers = this.getMap().getLayersByName('basemap_' + layer.getSubLayers()[i].getId());
                        olLayers.push(tmpLayers[0]);
                    }
                    return olLayers;
                } else {
                    return this.getMap().getLayersByName('layer_' + layer.getId());
                }
            } else {
                return this.getMap().getLayersByName('layer_' + layer.getId());
            }
            return null;
        },
        /**
         * @method _afterChangeMapLayerOpacityEvent
         * Handle AfterChangeMapLayerOpacityEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
         *            event
         */
        _afterChangeMapLayerOpacityEvent: function (event) {
            var layer = event.getMapLayer(),
                mapLayer;

            if (!layer.isLayerOfType('WMS')) {
                return;
            }

            if (layer.isBaseLayer() || layer.isGroupLayer()) {
                if (layer.getSubLayers().length > 0) {
                    var bl;
                    for (bl = 0; bl < layer.getSubLayers().length; bl += 1) {
                        mapLayer = this.getMap().getLayersByName('basemap_' + layer.getSubLayers()[bl].getId());
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                } else {
                    mapLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                    if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
                        mapLayer[0].setOpacity(layer.getOpacity() / 100);
                    }
                }
            } else {
                this.getSandbox().printDebug(
                    'Setting Layer Opacity for ' + layer.getId() + ' to ' + layer.getOpacity()
                );
                mapLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] !== null && mapLayer[0] !== undefined) {
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
        _afterChangeMapLayerStyleEvent: function (event) {
            if (event.getMapLayer().isLayerOfType('WMS')) {
                var layer = event.getMapLayer();

                // Change selected layer style to defined style
                if (!layer.isBaseLayer()) {
                    var styledLayer = this.getMap().getLayersByName('layer_' + layer.getId());
                    if (styledLayer !== null && styledLayer !== undefined) {
                        styledLayer[0].mergeNewParams({
                            styles: layer.getCurrentStyle().getName()
                        });
                    }
                }
            }
        },

        /**
         * Updates the OpenLayers and redraws them if scales have changed.
         *
         * @method _updateLayer
         * @param  {Oskari.mapframework.domain.WmsLayer} layer
         * @return {undefined}
         */
        _updateLayer: function(layer) {
            var oLayers = this.getOLMapLayers(layer),
                subs = layer.getSubLayers(),
                layerList = subs.length ? subs : [layer],
                llen = layerList.length,
                scale = this.getMapModule().getMap().getScale(),
                i,
                newRes,
                isInScale;

            for (i = 0; i < llen; i += 1) {
                newRes = this._calculateResolutions(layerList[i]);
                isInScale = layerList[i].isInScale(scale);
                // Make sure the sub exists before mucking about with it
                if (newRes && isInScale && oLayers && oLayers[i]) {
                    oLayers[i].addOptions({
                        resolutions: newRes
                    });
                    oLayers[i].setVisibility(isInScale);
                    oLayers[i].redraw(true);
                }
            }
        },

        /**
         * Calculates the resolutions based on layer scales.
         *
         * @method _calculateResolutions
         * @param  {Oskari.mapframework.domain.WmsLayer} layer
         * @return {Array[Number]}
         */
        _calculateResolutions: function(layer) {
            var mm = this.getMapModule(),
                minScale = layer.getMinScale(),
                maxScale = layer.getMaxScale();

            if (minScale || maxScale) {
                // use resolutions instead of scales to minimiz
                // chance of transformation errors
                return mm.calculateLayerResolutions(maxScale, minScale);
            }
        }
    },
    {
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