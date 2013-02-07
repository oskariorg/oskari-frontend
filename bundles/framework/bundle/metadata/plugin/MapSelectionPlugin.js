/**
 * @class Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin
 *
 * Provides functionality to draw a selection box on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.listeners = [];
    this.currentDrawMode = null;
}, {
    __name : 'Metadata.MapSelectionPlugin',

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
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * @method addListener
     * Registers a listener that will be notified when a selection has been made.
     * The function will receive the selection geometry as parameter (OpenLayers.Geometry).
     * @param {Function} listenerFunction
     */
    addListener : function(listenerFunction) {
        this.listeners.push(listenerFunction);
    },
    /**
     * @method startDrawing
     * Clears previous selection and activates the selection tool
     */
    startDrawing : function() {
        // remove possible old drawing
        this.drawLayer.removeAllFeatures();
        // activate requested draw control for new geometry
        this._toggleControl('area');
    },
    /**
     * @method stopDrawing
     * Disables all draw controls and
     * clears the layer of any drawn features
     */
    stopDrawing : function() {
        // disable all draw controls
        this._toggleControl();
        // clear drawing
        this.drawLayer.removeAllFeatures();
    },
    /**
     * @method setDrawing
     * Sets an initial geometry
     */
    setDrawing : function(geometry) {
        var features = [new OpenLayers.Feature.Vector(geometry)];
        this.drawLayer.addFeatures(features);
    },
    
    /**
     * @method _finishedDrawing
     * Called when drawing is finished.
     * Disables all draw controls and
     * calls all listeners with the drawn the geometry.
     * @private
     */
    _finishedDrawing : function() {
        this._toggleControl();
        var geometry = this.getDrawing();
        for(var i = 0; i < this.listeners.length; ++i) {
            this.listeners[i](geometry);
        }
        // create event
        console.log('sb', this._sandbox);
        var event = this._sandbox.getEventBuilder('Metadata.MapSelectionEvent')(geometry);
        console.log('sending event', event);
        this._sandbox.notifyAll(event);
    },
    /**
     * @method _toggleControl
     * Enables the given draw control
     * Disables all the other draw controls
     * @param drawMode draw control to activate (if undefined, disables all
     * controls)
     */
    _toggleControl : function(drawMode) {
    	this.currentDrawMode = drawMode;
    	
        for(var key in this.drawControls) {
            var control = this.drawControls[key];
            if(drawMode == key) {
                control.activate();
            } else {
                control.deactivate();
            }
        }
    },
    /**
     * Initializes the plugin:
     * - layer that is used for drawing
     * - drawControls
     * - registers for listening to requests
     * @param sandbox reference to Oskari sandbox
     * @method
     */
    init : function(sandbox) {
        var me = this;

        this.drawLayer = new OpenLayers.Layer.Vector("Metadata Draw Layer", {
            /*style: {
             strokeColor: "#ff00ff",
             strokeWidth: 3,
             fillOpacity: 0,
             cursor: "pointer"
             },*/
            eventListeners : {
                "featuresadded" : function(layer) {
                	// send an event that the drawing has been completed
                    me._finishedDrawing();
                }
            }
        });
        
        this.drawControls = {
            area : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                                                      OpenLayers.Handler.Polygon),
            box : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                        OpenLayers.Handler.RegularPolygon, {
                            handlerOptions: {
                                sides: 4,
                                irregular: true
                            }
                        })
        };
        
        this._map.addLayers([me.drawLayer]);
        for(var key in this.drawControls) {
            this._map.addControl(this.drawControls[key]);
        }
    },
    /**
     * Returns the drawn geometry from the draw layer
     * @method
     */
    getDrawing : function() {
        return this.drawLayer.features[0].geometry;
    },
    /**
     * @method register
     * implements Module protocol register method
     */
    register : function() {

    },
    /**
     * @method unregister
     * implements Module protocol unregister method
     */
    unregister : function() {
    },
    /**
     * @method startPlugin
     * implements MapModule.Plugin protocol startPlugin method
     */
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
    },
    /**
     * @method stopPlugin
     * implements MapModule.Plugin protocol stopPlugin method
     */
    stopPlugin : function(sandbox) {

        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     * implements Module protocol start method
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * implements Module protocol stop method
     */
    stop : function(sandbox) {
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
