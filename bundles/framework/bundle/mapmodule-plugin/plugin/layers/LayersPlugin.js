/**
 * @class Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin
 *
 * This is a plugin to bring more functionality for the mapmodules map
 * implementation. It provides handling for rearranging layer order and
 * controlling layer visibility. Provides information to other bundles if a layer
 * becomes visible/invisible (out of scale/out of content geometry) and request handlers
 * to move map to location/scale based on layer content. Also optimizes openlayers maplayers
 * visibility setting if it detects that content is not in the viewport.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this._supportedFormats = {};
    // visibility checks are cpu intensive so only make them when tha map has
    // stopped moving
    // after map move stopped -> activate a timer that will
    // do the check after _visibilityPollingInterval milliseconds
    this._visibilityPollingInterval = 1500;
    this._visibilityCheckOrder = 0;
    this._previousTimer = null;
}, {
    /** @static @property __name module name */
    __name : 'LayersPlugin',

    /**
     * @method getName
     * @return {String} module name
     */
    getName : function() {
        return this.pluginName;
    },
    /**
     * @method getMapModule
     * Returns reference to map module this plugin is registered to
     * @return {Oskari.mapframework.ui.module.common.MapModule} 
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
     * @return {Boolean}
     * This plugin doesn't have an UI so always returns false
     */
    hasUI : function() {
        return false;
    },
    /**
     * @method getMap
     * @return {OpenLayers.Map} reference to map implementation
     *
     */
    getMap : function() {
        return this._map;
    },
    /**
     * @method register
     * Interface method for the module protocol
     */
    register : function() {
        /*this.getMapModule().setLayerPlugin('layers', this);*/
    },
    /**
     * @method unregister
     * Interface method for the module protocol
     */
    unregister : function() {
        /*this.getMapModule().setLayerPlugin('layers', null);*/
    },
    /**
     * @method init
     *
     * Interface method for the module protocol. Initializes the request
     * handlers.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    init : function(sandbox) {
        this.requestHandlers = {
            layerVisibilityHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapLayerVisibilityRequestHandler', sandbox, this),
            layerContentHandler : Oskari.clazz.create('Oskari.mapframework.bundle.mapmodule.request.MapMoveByLayerContentRequestHandler', sandbox, this)
        };
    },
    /**
     * @method startPlugin
     *
     * Interface method for the plugin protocol. Registers requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        this._map = this.getMapModule().getMap();
        sandbox.register(this);
        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }
        sandbox.addRequestHandler('MapModulePlugin.MapLayerVisibilityRequest', this.requestHandlers.layerVisibilityHandler);
        sandbox.addRequestHandler('MapModulePlugin.MapMoveByLayerContentRequest', this.requestHandlers.layerContentHandler);

    },
    /**
     * @method stopPlugin
     *
     * Interface method for the plugin protocol. Unregisters requesthandlers and
     * eventlisteners.
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stopPlugin : function(sandbox) {

        sandbox.removeRequestHandler('MapModulePlugin.MapLayerVisibilityRequest', this.requestHandlers.layerVisibilityHandler);
        sandbox.removeRequestHandler('MapModulePlugin.MapMoveByLayerContentRequest', this.requestHandlers.layerContentHandler);
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     *
     * Interface method for the module protocol
     *
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     * 			reference to application sandbox
     */
    stop : function(sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers : {
        'AfterRearrangeSelectedMapLayerEvent' : function(event) {
            this._afterRearrangeSelectedMapLayerEvent(event);
        },
        'MapMoveStartEvent' : function() {
            // clear out any previous visibility check when user starts to move
            // map
            // not always sent f.ex. when moving with keyboard so do this in
            // AfterMapMoveEvent also
            this._visibilityCheckOrder++;
            if(this._previousTimer) {
                clearTimeout(this._previousTimer);
                this._previousTimer = null;
            }
        },
        'AfterMapMoveEvent' : function() {
           this._scheduleVisiblityCheck();
        },
        'AfterMapLayerAddEvent' : function(event) {
            // parse geom if available
            this._parseGeometryForLayer(event.getMapLayer());
            this._scheduleVisiblityCheck();
        }
    },
    
    _scheduleVisiblityCheck : function() {
    	 var me = this;
        if(this._previousTimer) {
            clearTimeout(this._previousTimer);
        	this._previousTimer = null;
       	}
		this._visibilityCheckOrder++;
        this._previousTimer = setTimeout(function() {
        	me._checkLayersVisibility(me._visibilityCheckOrder);
        }, this._visibilityPollingInterval);
    },

    /**
     * @method onEvent
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     */
    onEvent : function(event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    },
    /**
     * @method preselectLayers
     * Does nothing, protocol method for mapmodule-plugin
     */
    preselectLayers : function(layers) {
    },
    /**
     * @method _parseGeometryForLayer
     * @private
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer for which to parse geometry
     *
     * If layer.getGeometry() is empty, tries to parse layer.getGeometryWKT()
     * and set parsed geometry to the layer
     */
    _parseGeometryForLayer : function(layer) {

        // parse geometry if available
        if(layer.getGeometry().length == 0) {
            var layerWKTGeom = layer.getGeometryWKT();
            if(!layerWKTGeom) {
                // no wkt, dont parse
                return;
            }
            // http://dev.openlayers.org/docs/files/OpenLayers/Format/WKT-js.html
            // parse to OpenLayers.Geometry.Geometry[] array ->
            // layer.setGeometry();
            var wkt = new OpenLayers.Format.WKT();

            var features = wkt.read(layerWKTGeom);
            if(features) {
                if(features.constructor != Array) {
                    features = [features];
                }
                var geometries = [];
                for(var i = 0; i < features.length; ++i) {
                    geometries.push(features[i].geometry);
                }
                layer.setGeometry(geometries);
            } else {
                // 'Bad WKT';
            }
        }
    },
    /**
     * @method _checkLayersVisibility
     * @private
     * Loops through selected layers and notifies other modules about visibility
     * changes
     * @param {Number} orderNumber checks orderNumber against
     * #_visibilityCheckOrder
     * 		to see if this is the latest check, if not - does nothing
     */
    _checkLayersVisibility : function(orderNumber) {
        if(orderNumber != this._visibilityCheckOrder) {
            return;
        }
        var layers = this._sandbox.findAllSelectedMapLayers();
        for(var i = 0; i < layers.length; ++i) {
            var layer = layers[i];
            if(!layer.isVisible()) {
                // don't go further if not visible
                continue;
            }
            this.notifyLayerVisibilityChanged(layer);
        }
        this._visibilityCheckScheduled = false;
    },
    /**
     * @method _isInScale
     * @private
     * Checks if the maps scale is in the given maplayers scale range
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check scale against
     */
    _isInScale : function(layer) {
        var scale = this._sandbox.getMap().getScale();
        return layer.isInScale(scale);
    },
    /**
     * @method isInGeometry
     * If the given layer has geometry, checks if it is the maps viewport.
     * If layer doesn't have geometry, returns always true since then we can't
     * determine this.
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check against
     */
    isInGeometry : function(layer) {
        var geometries = layer.getGeometry();
        if( !geometries ) {
        	return true;
        }
        if( geometries.length == 0 ) {
        	return true;
        }

        var viewBounds = this.getMap().getExtent();
        for(var i = 0; i < geometries.length; ++i) {
            var bounds = geometries[i].getBounds();
            if( !bounds ) {
            	continue;
            }
            if( bounds.intersectsBounds(viewBounds) ) {
            	return true;
            }
        }
        return false;
    },
    /**
     * @method notifyLayerVisibilityChanged
     * If the given layer has geometry, checks if it is the maps viewport.
     * If layer doesn't have geometry, returns always true since then we can't
     * determine this.
     * @param
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            layer layer to check against
     */
    notifyLayerVisibilityChanged : function(layer) {
        var scaleOk = layer.isVisible();
        var geometryMatch = layer.isVisible();
        // if layer is visible check actual values
        if(layer.isVisible()) {
            scaleOk = this._isInScale(layer);
            geometryMatch = this.isInGeometry(layer);
        }
        // setup openlayers visibility
        // NOTE: DO NOT CHANGE visibility in internal layer object (it will
        // change in UI also)
        // this is for optimization purposes
        var map = this.getMap();
        if(scaleOk && geometryMatch && layer.isVisible()) {
            // show non-baselayer if in scale, in geometry and layer visible
            var mapLayers = map.getLayersByName('layer_' + layer.getId());
            if(mapLayers && mapLayers.length == 1 ) {
            	var mapLayer = mapLayers[0];
                mapLayer.setVisibility(true);
                mapLayer.display(true);
            }
        } else {
            // otherwise hide non-baselayer
            var mapLayer = map.getLayersByName('layer_' + layer.getId());
			if(mapLayers && mapLayers.length == 1 ) {
            	var mapLayer = mapLayers[0];
                mapLayer.setVisibility(false);
                mapLayer.display(false);
            }
        }
        var event = this._sandbox.getEventBuilder('MapLayerVisibilityChangedEvent')(layer, scaleOk, geometryMatch);
        this._sandbox.notifyAll(event);
    },
    /**
     * @method _afterRearrangeSelectedMapLayerEvent
     *
     * Handles AfterRearrangeSelectedMapLayerEvent.
     * Changes the layer order in Openlayers to match the selected layers list in
     * Oskari.
     *
     * @param
     * {Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent}
     *            event
     */
    _afterRearrangeSelectedMapLayerEvent : function(event) {
        var layers = this._sandbox.findAllSelectedMapLayers();
        var layerIndex = 0;

        var opLayersLength = this._map.layers.length;

        var changeLayer = this._map.getLayersByName('Markers');
        if(changeLayer.length > 0) {
            this._map.setLayerIndex(changeLayer[0], opLayersLength);
            opLayersLength--;
        }
        /* 
        // TODO: could this be used here also?
        // get openlayers layer objects from map
        var layers = this.getMapModule().getOLMapLayers(layer.getId());
        for ( var i = 0; i < layers.length; i++) {
            layers[i].setVisibility(layer.isVisible());
            layers[i].display(layer.isVisible());
        }
         */

        for(var i = 0; i < layers.length; i++) {

            if(layers[i].isBaseLayer()) {
                for(var bl = 0; bl < layers[i].getSubLayers().length; bl++) {
                    var changeLayer = this._map.getLayersByName('basemap_' + layers[i]
                    .getSubLayers()[bl].getId());
                    this._map.setLayerIndex(changeLayer[0], layerIndex);
                    layerIndex++;
                }
            } else if(layers[i].isLayerOfType('WFS')) {
                var wfsReqExp = new RegExp('wfs_layer_' + layers[i].getId() + '_WFS_LAYER_IMAGE*', 'i');
                var mapLayers = this._map.getLayersByName(wfsReqExp);
                for(var k = 0; k < mapLayers.length; k++) {
                    this._map.setLayerIndex(mapLayers[k], layerIndex);
                    layerIndex++;
                }

                var wfsReqExp = new RegExp('wfs_layer_' + layers[i].getId() + '_HIGHLIGHTED_FEATURE*', 'i');
                var changeLayer = this._map.getLayersByName(wfsReqExp);
                if(changeLayer.length > 0) {
                    this._map.setLayerIndex(changeLayer[0], layerIndex);
                    layerIndex++;
                }

            } else {
                var changeLayer = this._map.getLayersByName('layer_' + layers[i].getId());
                this._map.setLayerIndex(changeLayer[0], layerIndex);
                layerIndex++;
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
