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
                var defaultParams = {
                        'LAYERS': _layer.getLayerName(),
                        'TRANSPARENT': true,
                        'ID': _layer.getId(),
                        'STYLES': _layer.getCurrentStyle().getName(),
                        'FORMAT': 'image/png',
                        'VERSION' : _layer.getVersion()
                    },
                    layerParams = _layer.getParams() || {},
                    layerOptions = _layer.getOptions() || {};

                if (_layer.isRealtime()) {
                    var date = new Date();
                    defaultParams['TIME'] = date.toISOString();
                }
                // override default params and options from layer
                for (var key in layerParams) {
                    if (layerParams.hasOwnProperty(key)) {
                        defaultParams[key.toUpperCase()] = layerParams[key];
                    }
                }
                var layerImpl = null;
                if(layerOptions.singleTile === true) {

                      layerImpl = new ol.layer.Image({
                        source: new ol.source.ImageWMS({
                            url : _layer.getLayerUrl(),
                            params : defaultParams
                        }),
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                } else {
                    layerImpl = new ol.layer.Tile({
                        source : new ol.source.TileWMS({
                            url : _layer.getLayerUrl(),
                            params : defaultParams
                        }),
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                }
                // Set min max Resolutions
                if (_layer.getMaxScale() && _layer.getMaxScale() !== -1 ) {
                        layerImpl.setMinResolution(this.getMapModule().calculateScaleResolution(_layer.getMaxScale()));
                }
                if (_layer.getMinScale()  && _layer.getMinScale() !== -1 ) {
                    // No definition, if scale is greater than max resolution scale
                    if (_layer.getMinScale() < this.getMapModule().getMapScales()[0] ) {
                        layerImpl.setMaxResolution(this.getMapModule().calculateScaleResolution(_layer.getMinScale()));
                    }
                }
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