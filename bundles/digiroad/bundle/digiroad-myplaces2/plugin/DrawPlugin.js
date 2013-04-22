/**
 * @class Oskari.digiroad.bundle.myplaces2.plugin.DrawPlugin
 */
Oskari.clazz.define('Oskari.digiroad.bundle.myplaces2.plugin.DrawPlugin', function(url) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.snappingGridLayer = null;
    this.snappingLayerStrategy = null;
    this.editMode = false;
    this.currentDrawMode = null;
    this.queryUrl = url;
}, {
    __name : 'DigiroadMyPlaces.DrawPlugin',

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
     * @method createSnappingGridLayer
     * Creates the layer which is used as a 'grid' to the user drawing a geometry.
     */
    createSnappingGridLayer: function(protocolUrl) {
        var layer, protocol, styleMap;

        this.snappingLayerStrategy = new OpenLayers.Strategy.BBOX({
        	ratio: 1,
        	autoActivate: false
        });

        protocol = new OpenLayers.Protocol.WFS({
            url: protocolUrl,
            srsName: "EPSG:3067",
            version: "1.1.0",
            featureType: "LIIKENNE_ELEMENTTI",
            featureNS: "http://digiroad.karttakeskus.fi/LiVi",
            featurePrefix: "LiVi",
            geometryName: "GEOMETRY",
            outputFormat: "json"
        });

        styleMap = new OpenLayers.StyleMap({'strokeOpacity': 0.0});

        layer = new OpenLayers.Layer.Vector("snappingGridLayer", {
            protocol: protocol,
            strategies: [this.snappingLayerStrategy],
            filter: new OpenLayers.Filter.Comparison({
                type : OpenLayers.Filter.Comparison.EQUAL_TO,
                property : "TIEE_KUNTA",
                value : kuntayllapito.user.kuntaKoodi
            }),
            styleMap: styleMap,
            minScale: 25001,
            maxScale: 1
        });

        return layer;
    },

    /**
     * Activates the BBOX strategy used to fetch data to the snapping 'grid'.
     * This gets activated when user clicks a drawing tool.
     */
    activateSnapping: function() {
        this.snappingLayerStrategy.activate();
        if(this.snappingGridLayer) {
        	this.snappingGridLayer.refresh({force: true})
        }
    },
    
    /**
     * Deactivates the snapping layer BBOX strategy and destroys all the features
     * on the layer.
     */
    deactivateSnapping: function() {
        this.snappingLayerStrategy.deactivate();
        if(this.snappingGridLayer) {
            this.snappingGridLayer.removeAllFeatures();
        }
    },
    /**
     * Enables the draw control for given params.drawMode.
     * Clears the layer of any previously drawn features.
     * TODO: draws the given params.geometry with params.style
     * @param params includes drawMode, geometry and style
     * @method
     */
    startDrawing : function(params) {
    	this.activateSnapping();
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
        this.deactivateSnapping();
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
    	this.deactivateSnapping();
        this.toggleControl();
        if(!this.editMode) {
	        // programmatically select the drawn feature ("not really supported by openlayers")
	        // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
        	this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        }
        var event = this._sandbox.getEventBuilder('DigiroadMyPlaces.FinishedDrawingEvent')(this.getDrawing(), this.editMode);
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
            startDrawingHandler : Oskari.clazz.create('Oskari.digiroad.bundle.myplaces2.request.StartDrawingRequestPluginHandler', sandbox, me),
            stopDrawingHandler : Oskari.clazz.create('Oskari.digiroad.bundle.myplaces2.request.StopDrawingRequestPluginHandler', sandbox, me),
            getGeometryHandler : Oskari.clazz.create('Oskari.digiroad.bundle.myplaces2.request.GetGeometryRequestPluginHandler', sandbox, me)
        };

        // the URL should not be hard coded here but meh I'm lazy.
        this.snappingGridLayer = this.createSnappingGridLayer(this.queryUrl);
        
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
        
        var snapControl = new OpenLayers.Control.Snapping({
            layer: this.drawLayer,
            targets: [this.snappingGridLayer],
            greedy: false
        });
        this._map.addControl(snapControl);
        snapControl.activate();
        
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
        this._map.addLayers([me.drawLayer, this.snappingGridLayer]);
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
        sandbox.addRequestHandler('DigiroadMyPlaces.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('DigiroadMyPlaces.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('DigiroadMyPlaces.GetGeometryRequest', this.requestHandlers.getGeometryHandler);

    },
    stopPlugin : function(sandbox) {

        sandbox.removeRequestHandler('DigiroadMyPlaces.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('DigiroadMyPlaces.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('DigiroadMyPlaces.GetGeometryRequest', this.requestHandlers.getGeometryHandler);
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
