/**
 * @class Oskari.lupapiste.bundle.myplaces2.plugin.DrawPlugin
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.myplaces2.plugin.DrawPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.editMode = false;
    this.currentDrawMode = null;
}, {
    __name : 'MyPlaces.DrawPlugin',

    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + this.__name;
    },
    /**
     * Enables the draw control for given params.drawMode.
     * Clears the layer of any previously drawn features.
     * TODO: draws the given params.geometry with params.style
     * @param params includes drawMode, geometry and style
     * @method
     */
    startDrawing : function(params) {
        if(params.isModify) {
            // preselect it for modification
            this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        }
        else {
	        // remove possible old drawing
	        this.drawLayer.removeAllFeatures();
        	
	        if(params.geometry) {
	            // sent existing geometry == edit mode
	            this.editMode = true;
	            // add feature to draw layer
	            var features = [new OpenLayers.Feature.Vector(params.geometry)];
	            this.drawLayer.addFeatures(features);
	            // preselect it for modification
	            this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
	        } else {
	            // otherwise activate requested draw control for new geometry
	            this.editMode = false;
	            this.toggleControl(params.drawMode);
	        }
        }
    

    },
    /**
     * Disables all draw controls and
     * clears the layer of any drawn features
     * @method
     */
    stopDrawing : function() {
        // disable all draw controls
        this.toggleControl();
        // clear drawing
        this.drawLayer.removeAllFeatures();
    },
    
    forceFinishDraw : function() {
    	try {
    		this.drawControls[this.currentDrawMode].finishSketch();
    	}
    	catch(error) {
    		// happens when the sketch isn't even started -> reset state
        	this.stopDrawing();
	        var event = this._sandbox.getEventBuilder('MyPlaces.MyPlaceSelectedEvent')();
	        this._sandbox.notifyAll(event);
    	}
    },
    
    /**
     * Called when drawing is finished.
     * Disables all draw controls and
     * sends a MyPlaces.FinishedDrawingEvent with the drawn the geometry.
     * @method
     */
    finishedDrawing : function() {
        this.toggleControl();
        if(!this.editMode) {
	        // programmatically select the drawn feature ("not really supported by openlayers")
	        // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
        	this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        }
        var event = this._sandbox.getEventBuilder('MyPlaces.FinishedDrawingEvent')(this.getDrawing(), this.editMode);
        this._sandbox.notifyAll(event);
    },
    /**
     * Enables the given draw control
     * Disables all the other draw controls
     * @param drawMode draw control to activate (if undefined, disables all
     * controls)
     * @method
     */
    toggleControl : function(drawMode) {
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
        this.requestHandlers = {
            startDrawingHandler : Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.request.StartDrawingRequestPluginHandler', sandbox, me),
            stopDrawingHandler : Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.request.StopDrawingRequestPluginHandler', sandbox, me),
            getGeometryHandler : Oskari.clazz.create('Oskari.lupapiste.bundle.myplaces2.request.GetGeometryRequestPluginHandler', sandbox, me)
        };

        this.drawLayer = new OpenLayers.Layer.Vector("MyPlaces Draw Layer", {
            /*style: {
             strokeColor: "#ff00ff",
             strokeWidth: 3,
             fillOpacity: 0,
             cursor: "pointer"
             },*/
            eventListeners : {
                "featuresadded" : function(layer) {
                	// send an event that the drawing has been completed
                    me.finishedDrawing();
                }
            }
        });
        
        this.drawControls = {
            point : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                                                       OpenLayers.Handler.Point),
            line : new OpenLayers.Control.DrawFeature(me.drawLayer, 
                                                      OpenLayers.Handler.Path),
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
        
        // doesn't really need to be in array, but lets keep it for future development
        this.modifyControls = {
        	//select : new OpenLayers.Control.SelectFeature(me.drawLayer),
        	modify : new OpenLayers.Control.ModifyFeature(me.drawLayer)
        };
        this._map.addLayers([me.drawLayer]);
        for(var key in this.drawControls) {
            this._map.addControl(this.drawControls[key]);
        }
        for(var key in this.modifyControls) {
            this._map.addControl(this.modifyControls[key]);
        }
        // no harm in activating straight away
        this.modifyControls.modify.activate();
    },
    /**
     * Returns the drawn geometry from the draw layer
     * @method
     */
    getDrawing : function() {
        return this.drawLayer.features[0].geometry;
    },
    register : function() {

    },
    unregister : function() {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);
        sandbox.addRequestHandler('MyPlaces.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('MyPlaces.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('MyPlaces.GetGeometryRequest', this.requestHandlers.getGeometryHandler);

    },
    stopPlugin : function(sandbox) {

        sandbox.removeRequestHandler('MyPlaces.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('MyPlaces.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('MyPlaces.GetGeometryRequest', this.requestHandlers.getGeometryHandler);
        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop : function(sandbox) {
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
