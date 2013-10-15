/**
 * @class Oskari.mapframework.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define('Oskari.leaflet.mapmodule.plugin.WmsLayerPlugin',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._supportedFormats = {};

    this.tileSize = [256, 256];

}, {
    /** @static @property __name plugin name */
    __name : 'WmsLayerPlugin',

    /**
     * @method getName
     * @return {String} plugin name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    getMapModule : function() {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method hasUI
     * This plugin doesn't have an UI that we would want to ever hide so always returns false
     * @return {Boolean}
     */
    hasUI : function() {
        return false;
    },
    /**
     * @method register
     * Interface method for the plugin protocol.
     * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
     */
    register : function() {
        this.getMapModule().setLayerPlugin('wmslayer', this);
    },
    /**
     * @method unregister
     * Interface method for the plugin protocol
     * Unregisters self from mapmodules layerPlugins
     */
    unregister : function() {
        this.getMapModule().setLayerPlugin('wmslayer', null);
    },
    /**
     * @method init
     * Interface method for the module protocol.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
    },
    /**
     * @method startPlugin
     * Interface method for the plugin protocol.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);
        for (p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    /**
     * @method stopPlugin
     * Interface method for the plugin protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        for (p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._sandbox = null;
    },
    /**
     * @method start
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this._afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this._afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this._afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this._afterChangeMapLayerStyleEvent(event);
        }
    },

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method preselectLayers
     * Adds given layers to map if of type WMS
     * @param {Oskari.mapframework.domain.WmsLayer[]} layers
     */
    preselectLayers : function(layers) {

        var sandbox = this._sandbox;
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if (!layer.isLayerOfType('WMS')) {
                continue;
            }

            sandbox.printDebug("preselecting " + layerId);
            this._addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /**
     * Handle _afterMapLayerAddEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
     *            event
     */
    _afterMapLayerAddEvent : function(event) {
        this._addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * @method _addMapLayerToMap
     * @private
     * Adds a single WMS layer to this map
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    _addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        if (!layer.isLayerOfType('WMS')) {
            return;
        }

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
            var layerScales = this.getMapModule().calculateLayerScales(_layer.getMaxScale(), _layer.getMinScale());

            var wms = {
                'URL' : _layer.getWmsUrls()[0],
                'LAYERS' : _layer.getWmsName(),
                'FORMAT' : 'image/png'
            };
            
            var maxMin = this.mapModule.calculateLayerMinMaxResolutions(_layer.getMaxScale(), _layer.getMinScale());

            var layerImpl = L.tileLayer.wms(wms.URL, {
                layers : wms.LAYERS,
                format : wms.FORMAT,
                transparent : true,
                continuousWorld : true,
                minZoom : maxMin.min,
                maxZoom : maxMin.max 
            });
            
            this.mapModule.addLayer(layerImpl, _layer, layerIdPrefix + _layer.getId());

            this._sandbox.printDebug("#!#! CREATED L.tileLayer.wms for " + _layer.getId());
            console.log( layerImpl, maxMin);

            if (keepLayerOnTop) {
                this.mapModule.setLayerIndex(layerImpl, this.mapModule.getLayers().length);
            } else {
                this.mapModule.setLayerIndex(layerImpl, 0);
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
    _afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();

        this._removeMapLayerFromMap(layer);
    },
    /**
     * @method _afterMapLayerRemoveEvent
     * Removes the layer from the map
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     */
    _removeMapLayerFromMap : function(layer) {

        if (!layer.isLayerOfType('WMS')) {
            return;
        }

        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            var baseLayerId = "";
            if (layer.getSubLayers().length > 0) {
                for (var i = 0; i < layer.getSubLayers().length; i++) {
                    var subtmp = layer.getSubLayers()[i];
                    var name = 'basemap_' + subtmp.getId();
                    var remLayer = this.mapModule.getLayersByName(name);
                    if (remLayer && remLayer[0] ) {
                        this.mapModule.removeLayer(remLayer[0], layer, name);
                    }
                }
            } else {
                var name = 'layer_' + layer.getId();
                var remLayer = this.mapModule.getLayersByName(name)[0];
                this.mapModule.removeLayer(remLayer, layer, name);
            }
        } else {
            var name = 'layer_' + layer.getId();
            var remLayer = this.mapModule.getLayersByName(name);
            /* This should free all memory */
            this.mapModule.removeLayer(remLayer[0], layer, name);
        }
    },
    /**
     * @method getOLMapLayers
     * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map.
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     * @return {OpenLayers.Layer[]}
     */
    getOLMapLayers : function(layer) {

        if (!layer.isLayerOfType('WMS')) {
            return null;
        }

        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            var baseLayerId = "";
            if (layer.getSubLayers().length > 0) {
                var olLayers = [];
                for (var i = 0; i < layer.getSubLayers().length; i++) {
                    var tmpLayers = this.mapModule.getLayersByName('basemap_' + layer.getSubLayers()[i].getId());
                    olLayers.push(tmpLayers[0]);
                }
                return olLayers;
            } else {
                return this.mapModule.getLayersByName('layer_' + layer.getId());
            }
        } else {
            return this.mapModule.getLayersByName('layer_' + layer.getId());
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
    _afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if (!layer.isLayerOfType('WMS'))
            return;

        if (layer.isBaseLayer() || layer.isGroupLayer()) {
            if (layer.getSubLayers().length > 0) {
                for (var bl = 0; bl < layer.getSubLayers().length; bl++) {
                    var mapLayer = this.mapModule.getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
                if (mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
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
            var styledLayer = this.mapModule.getLayersByName('layer_' + layer.getId());
            if (styledLayer != null && styledLayer.length> 0) {
                var params = {
                    styles : layer.getCurrentStyle().getName()
                };
                console.log("STYLE NOT SET",styledLayer[0], params);
                /*styledLayer[0].setParams(params);*/
            }
        }
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
