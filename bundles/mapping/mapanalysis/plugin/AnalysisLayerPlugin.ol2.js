/**
 * @class Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin
 * Provides functionality to draw Analysis layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',
    /**
     * @static @method create called automatically on construction
     *
     */

    function () {
        var me = this;
        me.ajaxUrl = null;
        if (me._config && me._config.ajaxUrl) {
            me.ajaxUrl = me._config.ajaxUrl;
        }
    }, {
        __name : 'AnalysisLayerPlugin',
        _clazz : 'Oskari.mapframework.bundle.mapanalysis.plugin.AnalysisLayerPlugin',
        /** @static @property layerType type of layers this plugin handles */
        layertype : 'analysislayer',

        getLayerTypeSelector : function() {
            return 'ANALYSIS';
        },

        /**
         * @private @method _initImpl
         * Interface method for the module protocol.
         *
         *
         */
        _initImpl: function () {
            // register domain builder
            var mapLayerService = this.getSandbox().getService(
                    'Oskari.mapframework.service.MapLayerService'
                );

            if (!mapLayerService) {
                return;
            }

            mapLayerService.registerLayerModel(this.layertype,
                'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer');

            var layerModelBuilder = Oskari.clazz.create(
                'Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayerModelBuilder',
                this.getSandbox()
            );
            mapLayerService.registerLayerModelBuilder(this.layertype, layerModelBuilder);
        },

        /**
         * @private @method _startPluginImpl
         * Interface method for the plugin protocol.
         *
         *
         */
        _startPluginImpl: function () {
            if (!this.ajaxUrl) {
                this.ajaxUrl =
                    this.getSandbox().getAjaxUrl() + 'action_route=GetAnalysis?';
            }
        },

        /**
         * Adds a single Analysis layer to this map
         *
         * @method addMapLayerToMap
         * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap: function (layer, keepLayerOnTop, isBaseMap) {
            var me = this,
                sandbox = this.getSandbox(),
                openLayerId = 'layer_' + layer.getId(),
                imgUrl = layer.getWpsUrl() + layer.getWpsLayerId(),
                layerScales = this.getMapModule().calculateLayerScales(
                    layer.getMaxScale(),
                    layer.getMinScale()
                ),
                openLayer = new OpenLayers.Layer.WMS(
                    openLayerId,
                    imgUrl,
                    {
                        layers: layer.getWpsName(),
                        transparent: true,
                        styles: layer.getOverrideSld(),
                        format: 'image/png'
                    },
                    {
                        scales: layerScales,
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                        singleTile: true,
                        buffer: 0
                    }
                );

            openLayer.opacity = layer.getOpacity() / 100;
            this._registerLayerEvents(openLayer, layer);
            this.getMapModule().addLayer(openLayer, !keepLayerOnTop);

            // store reference to layers
            this.setOLMapLayers(layer.getId(), openLayer);

            me.getSandbox().printDebug(
                '#!#! CREATED OPENLAYER.LAYER.WMS for AnalysisLayer ' +
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
         }
    }, {
        "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            'Oskari.mapframework.module.Module',
            'Oskari.mapframework.ui.module.common.mapmodule.Plugin'
        ]
    }
);
