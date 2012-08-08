/**
 * A Plugin to manage WMTS OpenLayers map layers
 *
 */
Oskari.clazz.define('Oskari.mapframework.wmts.mapmodule.plugin.WmtsLayerPlugin', 
                    function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
    this._wmtsLayerClazz = Oskari.clazz.create("Oskari.openlayers.Patch.layer.WMTS");
}, {
    __name : 'WmtsLayerPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMap : function() {
        return this._map;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this.pluginName = mapModule.getName() + this.__name;
    },
    register : function() {
        this.getMapModule().setLayerPlugin('WmtsLayer', this);
    },
    unregister : function() {
        this.getMapModule().setLayerPlugin('WmtsLayer', null);
    },
    init : function(sandbox) {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
    },
    stopPlugin : function(sandbox) {

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /*
     * @method start called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop called from sandbox
     *
     */
    stop : function(sandbox) {
    },
    eventHandlers : {
        'AfterMapLayerAddEvent' : function(event) {
            this.afterMapLayerAddEvent(event);
        },
        'AfterMapLayerRemoveEvent' : function(event) {
            this.afterMapLayerRemoveEvent(event);
        },
        'AfterChangeMapLayerOpacityEvent' : function(event) {
            this.afterChangeMapLayerOpacityEvent(event);
        },
        'AfterChangeMapLayerStyleEvent' : function(event) {
            this.afterChangeMapLayerStyleEvent(event);
        }
    },

    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     *
     */
    preselectLayers : function(layers) {

        var sandbox = this._sandbox;
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(!layer.isLayerOfType('WMTS'))
                continue;

            sandbox.printDebug("preselecting " + layerId);
            this.addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /***********************************************************
     * Handle AfterMapLaeyrAddEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerAddEvent : function(event) {
        this.addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * primitive for adding layer to this map
     */
    addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {

        if(!layer.isLayerOfType('WMTS'))
            return;

        var me = this;
        var map = me.getMap();
        
        var matrixIds = layer.getWmtsMatrixSet().matrixIds;
        var layerDef = layer.getWmtsLayerDef();

        var layerName = null;
        if(layer.isBaseLayer()) {
            layerName = 'basemap_' + layer.getId();
        } else {
            layerName = 'layer_' + layer.getId();
        }

        var sandbox = this._sandbox;

        var wmtsUrl = layer.getWmtsUrls()[0];
        var matrixSet = layer.getWmtsMatrixSet();

        var wmtsLayerConfig = {
            visibility : true,
            transparent : true,
            // id : layerId, // this would break OpenLayers
            format : "image/png",
            url : wmtsUrl,
            layer : layer.getWmtsName(),
            style : layer.getCurrentStyle().getName(),
            matrixIds : matrixSet.matrixIds,
            matrixSet : matrixSet.identifier,
            isBaseLayer : layer.isBaseLayer(),
            buffer : 0,
            minScale : layer.getMinScale(),
            maxScale : layer.getMaxScale()
        };

        sandbox.printDebug("[WmtsLayerPlugin] creating WMTS Layer " + 
                           matrixSet.identifier + " / " + 
                           wmtsLayerConfig.id + "/" + 
                           wmtsLayerConfig.layer + "/" + 
                           wmtsLayerConfig.url);

        var fix = OpenLayers.Util.applyDefaults(wmtsLayerConfig, {
            url : wmtsUrl,
            name : layerName,
            style : layer.getCurrentStyle().getName(),
            matrixIds : matrixSet.matrixIds,
            layerDef : layerDef
        });

        // var wmtsLayer = new OpenLayers.Layer.WMTS(fix);
        var layerClazz = this._wmtsLayerClazz.getPatch();
        // Oskari.$("WMTSLayer");
        var wmtsLayer = new layerClazz(fix);
        wmtsLayer.opacity = layer.getOpacity() / 100;

        sandbox.printDebug("[WmtsLayerPlugin] created WMTS layer " + 
                           wmtsLayer);

        map.addLayers([wmtsLayer]);

    },
    /***********************************************************
     * Handle AfterMapLayerRemoveEvent
     *
     * @param {Object}
     *            event
     */
    afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();

        this.removeMapLayerFromMap(layer);
    },
    removeMapLayerFromMap : function(layer) {

        if(!layer.isLayerOfType('WMTS'))
            return;

        if(layer.isBaseLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
                    var remLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                    remLayer[0].destroy();
                }
            } else {
                var remLayer = this._map.getLayersByName('layer_' + layer.getId());
                remLayer[0].destroy();
            }
        } else {
            var remLayer = this._map.getLayersByName('layer_' + layer.getId());
            /* This should free all memory */
            remLayer[0].destroy();
        }
    },
    getOLMapLayers : function(layer) {

        if(!layer.isLayerOfType('WMTS'))
            return null;

        if(layer.isBaseLayer()) {
            var baseLayerId = "";
            if(layer.getSubLayers().length > 0) {
                for(var i = 0; i < layer.getSubLayers().length; i++) {
                    return this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[i].getId());
                }
            } else {
                return this._map.getLayersByName('layer_' + layer.getId());
            }
        } else {
            return this._map.getLayersByName('layer_' + layer.getId());
        }
        return null;
    },
    afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType('WMTS'))
            return;

        if(layer.isBaseLayer()) {
            if(layer.getSubLayers().length > 0) {
                for(var bl = 0; bl < layer.getSubLayers().length; bl++) {
                    var mapLayer = this._map.getLayersByName('basemap_' + layer
                    .getSubLayers()[bl].getId());
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            } else {
                var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
                if(mapLayer[0] != null) {
                    mapLayer[0].setOpacity(layer.getOpacity() / 100);
                }
            }
        } else {
            this._sandbox.printDebug("Setting Layer Opacity for " + layer.getId() + " to " + layer.getOpacity());
            var mapLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(mapLayer[0] != null) {
                mapLayer[0].setOpacity(layer.getOpacity() / 100);
            }
        }
    },
    /***********************************************************
     * Handle AfterChangeMapLayerStyleEvent
     *
     * @param {Object}
     *            event
     */
    afterChangeMapLayerStyleEvent : function(event) {
        var layer = event.getMapLayer();

        if(!layer.isLayerOfType('WMTS'))
            return;

        /** Change selected layer style to defined style */
        if(!layer.isBaseLayer()) {
            var styledLayer = this._map.getLayersByName('layer_' + layer.getId());
            if(styledLayer != null) {
                styledLayer[0].mergeNewParams({
                    styles : layer.getCurrentStyle().getName()
                });
            }
        }
    }
}, {
    'protocol' : [ "Oskari.mapframework.module.Module",
                   "Oskari.mapframework.ui.module.common.mapmodule.Plugin" ]
});
