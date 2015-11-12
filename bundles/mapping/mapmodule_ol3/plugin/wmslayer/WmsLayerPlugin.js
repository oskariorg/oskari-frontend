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
        
        /**
         * @method _addMapLayerToMap
         * @private
         * Adds a single WMS layer to this map
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
            if (!this.isLayerSupported(layer)) {
                return;
            }

            var me=this,
                layers = [],
                olLayers = [],
                layerIdPrefix = 'layer_';
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap === true) && (layer.getSubLayers().length > 0)) {
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
                    'URL' : _layer.getLayerUrl(),
                    'LAYERS' : _layer.getLayerName(),
                    'FORMAT' : 'image/png'
                };

                var layerImpl = new ol.layer.Tile({
                    source : new ol.source.TileWMS({
                        url : wms.URL,
                        //crossOrigin : 'anonymous',
                        params : {
                            'LAYERS' : wms.LAYERS,
                            'FORMAT' : wms.FORMAT,
                            'srs' : this.getMapModule().getProjection()
                        }
                    }),
                    transparent: true,
                    scales: layerScales,
                    isBaseLayer: false,
                    displayInLayerSwitcher: false,
                    visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                    opacity: layer.getOpacity() / 100
                });
                this.mapModule.addLayer(layerImpl, _layer, layerIdPrefix + _layer.getId());
                // gather references to layers
                olLayers.push(layerImpl);

                this._sandbox.printDebug("#!#! CREATED ol.layer.TileLayer for " + _layer.getId());
                if (keepLayerOnTop) {
                    // This might not be completely correct. We assume keepLayerOnTop means put this layer at the bottom as a faked baselayer.
                    this.mapModule.setLayerIndex(layerImpl, me.getMapModule().getMap().getLayers().getArray().length);
                } else {
                    this.mapModule.setLayerIndex(layerImpl, 0);
                }
            }
            // store reference to layers
            this.setOLMapLayers(layer.getId(), olLayers);
        },

        _createEventHandlers: function () {
            return {
                AfterChangeMapLayerStyleEvent: function (event) {
                    this._afterChangeMapLayerStyleEvent(event);
                }
            };
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
                var styledLayer = this._layers[layer.getId()];
                if (styledLayer != null) {
                    styledLayer.getSource().updateParams({
                        styles : layer.getCurrentStyle().getName()
                    });
                }
            }
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