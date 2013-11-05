/**
 * @class Oskari.ol2.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define('Oskari.ol2.mapmodule.WmsLayerPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name plugin name */
    __name : 'WmsLayerPlugin',

    /**
     * @method _addMapLayerToMap
     * @private
     * Adds a single WMS layer to this map
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    _addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

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

            // default params and options
            var defaultParams = {
                layers : _layer.getWmsName(),
                transparent : true,
                id : _layer.getId(),
                styles : _layer.getCurrentStyle().getName(),
                format : "image/png"
            }, defaultOptions = {
                layerId : _layer.getWmsName(),
                isBaseLayer : false,
                displayInLayerSwitcher : false,
                visibility : true,
                buffer : 0
            }, layerParams = _layer.getParams(), layerOptions = _layer.getOptions();
            if (_layer.getMaxScale() || _layer.getMinScale()) {
                // use resolutions instead of scales to minimize chance of transformation errors
                var layerResolutions = this.getMapModule().calculateLayerResolutions(_layer.getMaxScale(), _layer.getMinScale());
                defaultOptions.resolutions = layerResolutions;
            }
            // override default params and options from layer
            for (var key in layerParams) {
                defaultParams[key] = layerParams[key];
            }
            for (var key in layerOptions) {
                defaultOptions[key] = layerOptions[key];
            }

            var openLayer = new OpenLayers.Layer.WMS(layerIdPrefix + _layer.getId(), _layer.getWmsUrls(), defaultParams, defaultOptions);
            openLayer.opacity = _layer.getOpacity() / 100;

            this.getMapModule().addLayer(openLayer, _layer, _layer.getWmsName());
            this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for " + _layer.getId());

            if (keepLayerOnTop) {
                this.getMapModule().setLayerIndex(openLayer, this.getMapModule().getLayers().length);
            } else {
                this.getMapModule().setLayerIndex(openLayer, 0);
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
                    var remLayer = this.getMapModule().getLayersByName('basemap_' + subtmp.getId());
                    if (remLayer && remLayer[0]) {
                        this.getMapModule().removeLayer(remLayer[0], layer);
                    }
                }
            } else {
                var remLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
                if (remLayer && remLayer[0]) {
                    this.getMapModule().removeLayer(remLayer[0], layer);
                }
            }
        } else {
            var remLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
            if (remLayer && remLayer[0]) {
                this.getMapModule().removeLayer(remLayer[0], layer);
            }
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
                    var mapLayer = this.getMapModule().getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
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
            var styledLayer = this.getMapModule().getLayersByName('layer_' + layer.getId());
            if (styledLayer != null) {
                styledLayer[0].mergeNewParams({
                    styles : layer.getCurrentStyle().getName()
                });
            }
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
    "extend" : ["Oskari.mapping.mapmodule.plugin.MapLayerPlugin"]
});
