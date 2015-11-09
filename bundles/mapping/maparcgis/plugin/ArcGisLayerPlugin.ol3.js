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

        me._layers = {};
    }, {

        /** @static @property _layerType type of layers this plugin handles */
        _layerType: 'arcgis',

        /** @static @property _layerType2 type of layers this plugin handles */
        _layerType2: 'arcgis93',


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
                mapLayerService.registerLayerModel(
                    'arcgis93layer',
                    'Oskari.arcgis.bundle.maparcgis.domain.ArcGis93Layer'
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
                }
            };
        },

        /**
         * @method preselectLayers
         * Adds given layers to map if of type WMS or rest 93
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

                if (layer.isLayerOfType(this._layerType) || layer.isLayerOfType(this._layerType2) ) {
                    sandbox.printDebug('preselecting ' + layerId);
                    this.addMapLayerToMap(layer, true, layer.isBaseLayer());
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
            var me = this,
                openlayer,
                sandbox = me.getSandbox(),
                map = sandbox.getMap(),
                srs = map.getSrsName(),
                layerScales = me.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),
                layerType;

            if (!layer.isLayerOfType(me._layerType) && !layer.isLayerOfType(me._layerType2)) {
                return;
            }

            if (layer.isLayerOfType(me._layerType2)) {
                /**
                 * ArcGIS REST layer
                 * @type {ol}
                 */
                openlayer = new ol.layer.Tile({
                    extent: me.getMap().getView().getProjection().getExtent(),
                    source: new ol.source.TileArcGISRest({
                        url: layer.getLayerUrls()[0]
                    }),
                    id: layer.getId(),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });

                layerType = 'ol3 Arcgis REST';
            } else {
                /**
                 * ArcGIS cached layer.
                 * WMS url is like: http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x} format
                 */
                openlayer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                         url: layer.getLayerUrls()[0]
                    }),
                    id: layer.getId(),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                    buffer: 0
                });
                layerType = 'ol3 Arcgis CACHE';
            }

            layer.setQueryable(true);
            openlayer.opacity = layer.getOpacity() / 100;

            me.getMap().addLayer(openlayer);
            me._layers[openlayer.get('id')] = openlayer;

            if (keepLayerOnTop) {
                me.getMapModule().setLayerIndex(openlayer, me.getMap().getLayers().getArray().length);
            } else {
                me.getMapModule().setLayerIndex(openlayer, 0);
            }

            me.getSandbox().printDebug(
                '#!#! CREATED ' + layerType + ' for ArcGisLayer ' +
                layer.getId()
            );
        },
        /**
         * Adds a single ArcGis rst 93 layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.arcgis.domain.ArcGis93Layer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        _addMapLayer2ToMap: function (layer, keepLayerOnTop, isBaseMap) {




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

            if (!layer.isLayerOfType(this._layerType) && !layer.isLayerOfType(this._layerType2)) {
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
            this._layers[layer.getId()].destroy();
        },
        /**
         * @method getOLMapLayers
         * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
         * @param {Oskari.arcgis.domain.ArcGisLayer} layer
         * @return {OpenLayers.Layer[]}
         */
        getOLMapLayers: function (layer) {
            if (!layer.isLayerOfType(this._layerType) && !layer.isLayerOfType(this._layerType2)) {
                return null;
            }

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

            if (!layer.isLayerOfType(this._layerType) && !layer.isLayerOfType(this._layerType2)) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            if (this._layers[layer.getId()] !== null && this._layers[layer.getId()] !== undefined) {
                this._layers[layer.getId()].setOpacity(layer.getOpacity() / 100);
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