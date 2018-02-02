/**
 * @class Oskari.mapframework.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.WmsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     */
    function () {
    },
    {
        __name : 'WmsLayerPlugin',
        _clazz : 'Oskari.mapframework.mapmodule.WmsLayerPlugin',
        layertype : 'wmslayer',

        getLayerTypeSelector : function() {
            return 'WMS';
        },

        _createPluginEventHandlers: function () {
            return {
                AfterChangeMapLayerStyleEvent: function (event) {
                    this._afterChangeMapLayerStyleEvent(event);
                }
            };
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
            var layers = [],
                olLayers = [],
                mapModule = this.getMapModule(),
                subLayers = layer.getSubLayers(),
                layerIdPrefix = 'layer_',
                sandbox = this.getSandbox();
            var me = this;


            // insert layer or sublayers into array to handle them identically
            if (subLayers.length > 0) {
                // replace layers with sublayers
                layers = subLayers;
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            layers.forEach(function (oskariLayer) {
                // default params and options
                var defaultParams = {
                        layers: oskariLayer.getLayerName(),
                        transparent: true,
                        id: oskariLayer.getId(),
                        styles: oskariLayer.getCurrentStyle().getName(),
                        format: 'image/png',
                        version: oskariLayer.getVersion() || '1.1.1'
                    },
                    defaultOptions = {
                        layerId: oskariLayer.getLayerName(),
                        isBaseLayer: false,
                        displayInLayerSwitcher: false,
                        visibility: layer.isInScale(sandbox.getMap().getScale()) && layer.isVisible(),
                        buffer: 0
                    },
                    layerParams = oskariLayer.getParams(),
                    layerOptions = oskariLayer.getOptions(),
                    layerAttributes = oskariLayer.getAttributes();
                
                if(layerAttributes.times) {
                    defaultOptions.singleTile = true;
                }

                if (layerAttributes && layerAttributes.reverseXY && (typeof layerAttributes.reverseXY === 'object')) {
                    defaultOptions.yx = _.clone(layerAttributes.reverseXY);
                }

                // Sub layers could be different types
                if (oskariLayer.getLayerType() !== 'wms') {
                    return;
                }

                if (oskariLayer.isRealtime()) {
                    var date = new Date();
                    defaultParams.time = date.toISOString();
                }

                if (oskariLayer.getMaxScale() || oskariLayer.getMinScale()) {
                    // use resolutions instead of scales to minimize chance of transformation errors
                    var layerResolutions = mapModule.calculateLayerResolutions(oskariLayer.getMaxScale(), oskariLayer.getMinScale());
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

                var openLayer = new OpenLayers.Layer.WMS(layerIdPrefix + oskariLayer.getId(), oskariLayer.getWmsUrls(), defaultParams, defaultOptions);
                me._registerLayerEvents(openLayer, oskariLayer);
                openLayer.opacity = layer.getOpacity() / 100;

                mapModule.addLayer(openLayer, !keepLayerOnTop);
                // gather references to layers
                olLayers.push(openLayer);

                sandbox.printDebug('#!#! CREATED OPENLAYER.LAYER.WMS for ' + oskariLayer.getId());


            });
            // store reference to layers
            this.setOLMapLayers(layer.getId(), olLayers);
        },
        _registerLayerEvents: function(layer, oskariLayer){
          var me = this;
          
          layer.events.register("tileloadstart", layer, function(){
            me.getMapModule().loadingState( oskariLayer._id, true);
          });

          layer.events.register("tileloaded", layer, function(){
            me.getMapModule().loadingState( oskariLayer._id, false);
          });

          layer.events.register("loadend", layer, function(){
         });

         layer.events.register("tileerror", layer, function(){
            me.getMapModule().loadingState( oskariLayer.getId(), null, true );

        });
        },
        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent: function (event) {
            var layer = event.getMapLayer();
            var layerList = this.getOLMapLayers(layer);
            if(!layerList) {
                return;
            }
            layerList.forEach(function(openlayer) {
                openlayer.mergeNewParams({
                    styles: layer.getCurrentStyle().getName()
                });
            });
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
                mapmodule = this.getMapModule(),
                scale = mapmodule.getMapScale(),
                i,
                newRes;

            for (i = 0; i < llen; i += 1) {
                // Make sure the sub exists before mucking about with it
                if (!oLayers || !oLayers[i]) {
                    continue;
                }

                var loopLayer = layerList[i];

                //url might've changed (case forceProxy). Update that.
                oLayers[i].setUrl(_.clone(loopLayer.getLayerUrls()));

                oLayers[i].mergeNewParams(loopLayer.getParams());
                // calculate new resolutions
                newRes = mapmodule.calculateLayerResolutions(
                    loopLayer.getMaxScale(), loopLayer.getMinScale());
                oLayers[i].addOptions({
                    resolutions: newRes
                });
                oLayers[i].setVisibility(loopLayer.isInScale(scale));
                oLayers[i].redraw(true);
            }
        },
        updateLayerParams: function(layer, forced, params) {
            var sandbox = this.getSandbox(),
                i,
                olLayerList,
                count;

            if (!layer) {
                return;
            }

            if (params && layer.isLayerOfType("WMS")) {
                olLayerList = this.mapModule.getOLMapLayers(layer.getId());
                count = 0;
                if (olLayerList) {
                    count = olLayerList.length;
                    for (i = 0; i < olLayerList.length; ++i) {
                        olLayerList[i].mergeNewParams(params);
                    }
                }
                sandbox.printDebug("[MapLayerUpdateRequestHandler] WMS layer / merge new params: " + layer.getId() + ", found " + count);
            }
        }
    },
    {
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
