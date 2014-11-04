/**
 * @class Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (config) {
        var me = this;

        me._clazz =
            'Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin';
        me._name = 'ArcGisLayerPlugin';

        me._layer = {};
    }, {

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'arcgis',

        /**
         * @method register
         * Interface method for the plugin protocol.
         * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
         */
        register: function () {
            this.getMapModule().setLayerPlugin('arcgislayer', this);
        },
        /**
         * @method unregister
         * Interface method for the plugin protocol
         * Unregisters self from mapmodules layerPlugins
         */
        unregister: function () {
            this.getMapModule().setLayerPlugin('arcgislayer', null);
        },
        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         *
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         *          reference to application sandbox
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService(
                'Oskari.mapframework.service.MapLayerService'
            );
            if (mapLayerService) {
                mapLayerService.registerLayerModel(
                    'arcgislayer',
                    'Oskari.arcgis.bundle.maparcgis.domain.ArcGisLayer'
                );
            }
        },

        _createEventHandlers: function () {
            return {
                AfterMapLayerRemoveEvent: function (event) {
                    this._afterMapLayerRemoveEvent(event);
                },
                AfterChangeMapLayerOpacityEvent: function (event) {
                    this._afterChangeMapLayerOpacityEvent(event);
                },
                AfterChangeMapLayerStyleEvent: function (event) {
                    //this._afterChangeMapLayerStyleEvent(event);
                },
                AfterMapMoveEvent: function (event) {
                    this._afterMapMoveEvent(event);
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

                if (layer.isLayerOfType(this._layerType)) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
                }
            }

        },

        /**
         * Handle _afterMapMoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
         *            event
         */
        _afterMapMoveEvent: function (event) {
            //TODO: not an excellent solution, but close enough
            var id;
            for (id in this._layer) {
                if (this._layer.hasOwnProperty(id)) {
                    this._layer[id].redraw();
                }
            }
        },
        /**
         * Adds a single ArcGis layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.arcgis.domain.ArcGisLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this;

            if (!layer.isLayerOfType(me._layerType)) {
                return;
            }

            var jsonp = new OpenLayers.Protocol.Script();
            jsonp.createRequest(layer.getLayerUrls()[0], {
                f: 'json',
                pretty: 'true'
            }, function initMap(layerInfo) {
                //TODO: this fixing 3 errors
                layerInfo.spatialReference.wkid = me.getMap().projection.substr(
                    me.getMap().projection.indexOf(':') + 1
                );
                var openLayer = new OpenLayers.Layer.ArcGISCache(
                    'arcgislayer_' + layer.getId(),
                    layer.getLayerUrls()[0],
                    {
                        layerInfo: layerInfo,
                        // OpenLayers.Layer.ArcGISCache defaults to baselayer
                        // if left as is -> Oskari layer ordering doesn't work correctly
                        isBaseLayer: false
                    }
                );

                me._layer[layer.getId()] = openLayer;

                openLayer.opacity = layer.getOpacity() / 100;
                me.getMap().addLayer(openLayer);

                if (keepLayerOnTop) {
                    me.getMap().setLayerIndex(
                        openLayer,
                        me.getMap().layers.length
                    );
                } else {
                    me.getMap().setLayerIndex(openLayer, 0);
                }
            });

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.ArcGis for ArcGisLayer ' +
                layer.getId()
            );
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
         * @param {Oskari.arcgis.domain.ArcGisLayer} layer
         */
        _removeMapLayerFromMap: function (layer) {
            /* This should free all memory */
            this._layer[layer.getId()].destroy();
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.arcgis.domain.ArcGisLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType(this._layerType)) {
                return null;
            }

            return [this._layer[layer.getId()]];
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
            if (this._layer[layer.getId()] !== null && this._layer[layer.getId()] !== undefined) {
                this._layer[layer.getId()].setOpacity(layer.getOpacity() / 100);
            }
        },
        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent: function (event) {
            var layer = event.getMapLayer();
            //TODO: not implemented yet
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