/**
 * Provides functionality to draw MyPlaces layers on the map
 * 
 * @class Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmyplaces.plugin.MyPlacesLayerPlugin', 

/**
 * @method create called automatically on construction
 * @static
 */
function(config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
    this.config = config;
    this.ajaxUrl = null;
    if(config && config.ajaxUrl) {
        this.ajaxUrl = config.ajaxUrl;
    }
}, {
    /** @static @property __name plugin name */
    __name : 'MyPlacesLayerPlugin',

    /** @static @property _layerType type of layers this plugin handles */
    _layerType : 'MYPLACES',

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
     * This plugin doesn't have an UI that we would want to ever hide so always returns false
     * 
     * @method hasUI
     * @return {Boolean} 
     */
    hasUI : function() {
        return false;
    },
    /**
     * Interface method for the plugin protocol.
     * Registers self as a layerPlugin to mapmodule with mapmodule.setLayerPlugin()
     * 
     * @method register
     */
    register : function() {
        this.getMapModule().setLayerPlugin('myplaceslayer', this);
    },
    /**
     * Interface method for the plugin protocol
     * Unregisters self from mapmodules layerPlugins
     * 
     * @method unregister
     */
    unregister : function() {
        this.getMapModule().setLayerPlugin('myplaceslayer', null);
    },
    /**
     * Interface method for the module protocol.
     * 
     * @method init
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    init : function(sandbox) {
        var sandboxName = ( this.config ? this.config.sandbox : null ) || 'sandbox';
        var sandbox = Oskari.getSandbox(sandboxName);
        
        // register domain builder
        var mapLayerService = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        if(mapLayerService) {
            mapLayerService.registerLayerModel('myplaceslayer', 'Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayer');

            var layerModelBuilder = Oskari.clazz.create('Oskari.mapframework.bundle.mapmyplaces.domain.MyPlacesLayerModelBuilder', sandbox);
            mapLayerService.registerLayerModelBuilder('myplaceslayer', layerModelBuilder);
        }
    },
    /**
     * Interface method for the plugin protocol.
     *
     * @method startPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();

        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
        if(!this.ajaxUrl) {
            this.ajaxUrl = sandbox.getAjaxUrl() + 'action_route=GetAnalysis?';
        }
    },
    /**
     * Interface method for the plugin protocol
     *
     * @method stopPlugin
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    stopPlugin : function(sandbox) {
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /**
     * Interface method for the module protocol
     *
     * @method start
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * Interface method for the module protocol
     *
     * @method stop
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
        }
    },

    /**
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     * 
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * Adds given analysis layers to map if of type WFS
     * 
     * @method preselectLayers
     * @param {Oskari.mapframework.domain.WfsLayer[]} layers
     */
    preselectLayers : function(layers) {
        var sandbox = this._sandbox;
        for(var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = layer.getId();

            if(!layer.isLayerOfType(this._layerType)) {
                continue;
            }

            sandbox.printDebug("preselecting " + layerId);
            this._addMapLayerToMap(layer, true, layer.isBaseLayer());
        }

    },
    /**
     * @method _afterMapLayerAddEvent
     * @private 
     * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent}
     *            event
     */
    _afterMapLayerAddEvent : function(event) {
        this._addMapLayerToMap(event.getMapLayer(), event.getKeepLayersOrder(), event.isBasemap());
    },
    /**
     * Adds a single MyPlaces layer to this map
     * 
     * @method _addMapLayerToMap
     * @private
     * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer
     * @param {Boolean} keepLayerOnTop
     * @param {Boolean} isBaseMap
     */
    _addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
        if(!layer.isLayerOfType(this._layerType)) {
            return;
        }

        var me = this;
        var markerLayer = this._map.getLayersByName("Markers");
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.removeLayer(markerLayer[mlIdx], false);
                }
            }
        }

        var openLayerId = 'layer_' + layer.getId();
        var imgUrl = layer.getWmsUrl();
        var layerScales = this.getMapModule()
            .calculateLayerScales(layer.getMaxScale(), layer.getMinScale());

        var openLayer = new OpenLayers.Layer.WMS(openLayerId, imgUrl, {
            layers : layer.getWmsName(),
            transparent : true,
            format : "image/png"
        }, {
            scales : layerScales,
            isBaseLayer : false,
            displayInLayerSwitcher : false,
            visibility : true,
            singleTile : true,
            buffer : 0
        });
        

        openLayer.opacity = layer.getOpacity() / 100;

        this._map.addLayer(openLayer);

        this._sandbox.printDebug("#!#! CREATED OPENLAYER.LAYER.WMS for MyPlacesLayer " + layer.getId());

        if(keepLayerOnTop) {
            this._map.setLayerIndex(openLayer, this._map.layers.length);
        } else {
            this._map.setLayerIndex(openLayer, 0);
        }
        if (markerLayer) {
            for (var mlIdx = 0; mlIdx < markerLayer.length; mlIdx++) {
                if (markerLayer[mlIdx]) {
                    this._map.addLayer(markerLayer[mlIdx]);
                }
            }
        }  
    },
    
    /**
     * Handle AfterMapLayerRemoveEvent
     * 
     * @method _afterMapLayerRemoveEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent}
     *            event
     */
    _afterMapLayerRemoveEvent : function(event) {
        var layer = event.getMapLayer();
        if(!layer.isLayerOfType(this._layerType)) {
            return;
        }
        this._removeMapLayerFromMap(layer);
        
    },
    /**
     * Removes the layer from the map
     * 
     * @method _afterMapLayerRemoveEvent
     * @private
     * @param {Oskari.mapframework.domain.WmsLayer} layer
     */
    _removeMapLayerFromMap : function(layer) {
        if(!layer.isLayerOfType(this._layerType)) {
            return null;
        }

        var mapLayer = this.getOLMapLayers(layer);
        /* This should free all memory */
        mapLayer[0].destroy();
    },
    /**
     * Returns references to OpenLayers layer objects for requested layer or null if layer is not added to map. 
     * 
     * @method getOLMapLayers
     * @param {Oskari.mapframework.domain.WfsLayer} layer 
     * @return {OpenLayers.Layer[]}
     */
    getOLMapLayers : function(layer) {
        if(!layer.isLayerOfType(this._layerType)) {
            return null;
        }

        return this._map.getLayersByName('layer_' + layer.getId());
    },
    /**
     * Handle AfterChangeMapLayerOpacityEvent
     * 
     * @method _afterChangeMapLayerOpacityEvent
     * @private
     * @param {Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent}
     *            event
     */
    _afterChangeMapLayerOpacityEvent : function(event) {
        var layer = event.getMapLayer();

        if (!layer.isLayerOfType(this._layerType)) {
            return;
        }

        var opacity = layer.getOpacity() / 100,
            openLayer = this.getOLMapLayers(layer);

        openLayer[0].setOpacity(opacity);
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
