/**
 * @class Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin
 * Provides functionality to draw Stats layers on the map
 */
Oskari.clazz.define('Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin',

    /**
     * @method create called automatically on construction
     * @static
     */

    function () {
        var me = this;

        me._clazz =
            'Oskari.arcgis.bundle.maparcgis.plugin.ArcGisLayerPlugin';
        me._name = 'ArcGisLayerPlugin';

        me._layer = {};
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
         * @param {Oskari.Sandbox} sandbox
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
                AfterChangeMapLayerStyleEvent: function () {
                },
                AfterMapMoveEvent: function (event) {
                    this._afterMapMoveEvent(event);
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
         * Handle _afterMapMoveEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
         *            event
         */
        _afterMapMoveEvent: function () {
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
         */
        addMapLayerToMap: function (layer, keepLayerOnTop) {
            var me = this,
                sandbox = me.getSandbox();

            if (!layer.isLayerOfType(me._layerType) && !layer.isLayerOfType(me._layerType2)) {
                return;
            }

            if (layer.isLayerOfType(me._layerType2)) {
                me._addMapLayer2ToMap(layer, keepLayerOnTop);
                return;
            }

            var jsonp = new OpenLayers.Protocol.Script();
            jsonp.createRequest(layer.getLayerUrl(), {
                f: 'json',
                pretty: 'true'
            }, function (layerInfo) {
                layerInfo.spatialReference.wkid = me.getMap().projection.substr(
                    me.getMap().projection.indexOf(':') + 1
                );
                var openLayer = new OpenLayers.Layer.ArcGISCache(
                    'arcgislayer_' + layer.getId(),
                    layer.getLayerUrl(),
                    {
                        layerInfo: layerInfo,
                        // OpenLayers.Layer.ArcGISCache defaults to baselayer
                        // if left as is -> Oskari layer ordering doesn't work correctly
                        isBaseLayer: false
                    }
                );

                me._layer[layer.getId()] = openLayer;

                openLayer.opacity = layer.getOpacity() / 100;
                openLayer.setVisibility(layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible());
                me._registerLayerEvents(openLayer, _layer);
                me.getMapModule().addLayer(openLayer, !keepLayerOnTop);

            });

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.ArcGis for ArcGisLayer ' +
                layer.getId()
            );
        },
        /**
         * Adds a single ArcGis rst 93 layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.arcgis.domain.ArcGis93Layer} layer
         * @param {Boolean} keepLayerOnTop
         */
        _addMapLayer2ToMap: function (layer, keepLayerOnTop) {
            var me = this,
                sandbox = me.getSandbox();

            if (!layer.isLayerOfType(me._layerType2)) {
                return;
            }
            var params = {
                layers: 'show:' + layer.getLayerName(),
                srs:me.getMap().projection.substr(
                    me.getMap().projection.indexOf(':') + 1),
                transparent: 'true'};

            var openLayer = new OpenLayers.Layer.ArcGIS93Rest( 'arcgis93layer_' + layer.getId(),
                layer.getLayerUrls()[0],
                params);


            openLayer.isBaseLayer = false;
            me._layer[layer.getId()] = openLayer;

            openLayer.opacity = layer.getOpacity() / 100;
            openLayer.setVisibility(layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible());

            me._registerLayerEvents(openLayer, layer);
            me.getMap().addLayer(openLayer, !keepLayerOnTop);

            // Set queryable
            layer.setQueryable(true);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.ArcGis93Rest for ArcGisLayer ' +
                layer.getId()
            );
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
            if(!this._layer[layer.getId()]) {
                return;
            }
            this._layer[layer.getId()].destroy();
            delete this._layer[layer.getId()];
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
            if(!this._layer[layer.getId()]) {
                return [];
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
            var olLayers = this.getOLMapLayers(layer);

            if (!olLayers || olLayers.length === 0) {
                return;
            }

            this.getSandbox().printDebug(
                'Setting Layer Opacity for ' + layer.getId() + ' to ' +
                layer.getOpacity()
            );
            for(var i = 0; i < olLayers.length; ++i) {
                olLayers[i].setOpacity(layer.getOpacity() / 100);
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
    });
