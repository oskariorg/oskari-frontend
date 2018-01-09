/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
    function () {
    }, {
        __name : 'WmtsLayerPlugin',
        _clazz : 'Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin',
        layertype : 'wmtslayer',

        getLayerTypeSelector : function() {
            return 'WMTS';
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

            mapLayerService.registerLayerModel(this.layertype, 'Oskari.mapframework.wmts.domain.WmtsLayer');
            layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.wmts.service.WmtsLayerModelBuilder');
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);

            this.service = Oskari.clazz.create('Oskari.mapframework.wmts.service.WMTSLayerService', mapLayerService, this.getSandbox());
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
            if (!this.isLayerSupported(layer)) {
                return;
            }
            var me = this;
            var map = me.getMap();
            var mapModule = me.getMapModule();
            var wmtsHolderLayer = this._getPlaceHolderWmtsLayer(layer);
            map.addLayer(wmtsHolderLayer);
            this.setOLMapLayers(layer.getId(), wmtsHolderLayer);
            this.service.getCapabilitiesForLayer(layer, function(wmtsLayer) {
                me.getSandbox().printDebug("[WmtsLayerPlugin] created WMTS layer " + wmtsLayer);
                me._registerLayerEvents(wmtsLayer, layer);

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
                    me.setOLMapLayers(layer.getId(), wmtsLayer);
            }, function() {
            });


        },
        /**
         * Reserves correct position for wmts layer, which will be added async later
         * This layer is removed, when the finalized wmts layer will be added
         * @param layer
         * @returns {*}
         * @private
         */
        _getPlaceHolderWmtsLayer: function (layer) {

            var layerHolder = new ol.layer.Vector({
                    source: new ol.source.Vector({}),
                    title: 'layer_' + layer.getId(),
                    visible: false
                }
            );

            return layerHolder;
        },
        /**
         * Adds event listeners to ol-layers
         * @param {OL3 layer} layer
         * @param {Oskari layerconfig} oskariLayer
         *
         */
        _registerLayerEvents: function(layer, oskariLayer){
        var me = this;
        var source = layer.getSource();

        source.on('tileloadstart', function() {
          me.getMapModule().loadingState( oskariLayer.getId(), true);
        });

        source.on('tileloadend', function() {
          me.getMapModule().loadingState( oskariLayer.getId(), false);
        });

        source.on('tileloaderror', function() {
          me.getMapModule().loadingState( oskariLayer.getId(), null, true );
        });

        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.AbstractMapLayerPlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
