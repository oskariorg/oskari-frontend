/**
 * @class Oskari.mapframework.bundle.parcel.plugin.DrawPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.plugin.DrawPlugin', function() {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.editMode = false;
    this.currentDrawMode = null;
    this.currentFeatureType = null;
    // Created in init.
    this.splitter = null;
}, {
    getName : function() {
        return this.pluginName;
    },
    getMapModule : function() {
        return this.mapModule;
    },
    setMapModule : function(mapModule) {
        this.mapModule = mapModule;
        this._map = mapModule.getMap();
        this.pluginName = mapModule.getName() + 'Parcel.DrawPlugin';
    },
    /**
     *
     */
    drawFeature : function(feature, featureType) {
        // remove possible old drawing
        this.drawLayer.removeAllFeatures();
        this.editMode = true;
        // add feature to draw layer
        var features = [feature];
        this.drawLayer.addFeatures(features);
        // preselect it for modification
        this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        this.currentFeatureType = featureType;
        // Zoom to the loaded feature.
        this._map.zoomToExtent(this.drawLayer.getDataExtent());
    },
    /**
     * Enables the draw control for given params.drawMode.
     * Clears the layer of any previously drawn features.
     * TODO: draws the given params.geometry with params.style
     * @param params includes drawMode, geometry and style
     * @method
     */
    startDrawing : function(params) {
        if (params.isModify) {
            // preselect it for modification
            this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);

        } else {
            if (params.geometry) {
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
     * Disables all draw controls.
     * @method
     */
    stopDrawing : function() {
        // disable all draw controls
        this.toggleControl();
    },

    /**
     * Clears the layer of any drawn features
     * @method
     */
    clearDrawing : function() {
        // clear drawing
        this.drawLayer.removeAllFeatures();
        this.currentFeatureType = null;
    },

    saveDrawing : function() {
        this.finishedDrawing();
    },

    forceFinishDraw : function() {
        try {
            this.drawControls[this.currentDrawMode].finishSketch();
        } catch(error) {
            // happens when the sketch isn't even started -> reset state
            this.stopDrawing();
            this.clearDrawing();
            var event = this._sandbox.getEventBuilder('Parcel.ParcelSelectedEvent')();
            this._sandbox.notifyAll(event);
        }
    },

    /**
     * Called when drawing is finished.
     * Disables all draw controls and
     * sends a Parcel.FinishedDrawingEvent with the drawn the geometry.
     * @method
     */
    finishedDrawing : function() {
        this.toggleControl();
        if (!this.editMode) {
            // programmatically select the drawn feature ("not really supported by openlayers")
            // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
            this.modifyControls.modify.selectControl.select(this.drawLayer.features[0]);
        }
        var event = this._sandbox.getEventBuilder('Parcel.FinishedDrawingEvent')(this.getDrawing(), this.editMode);
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

        for (var key in this.drawControls) {
            var control = this.drawControls[key];
            if (drawMode == key) {
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

        this.drawLayer = new OpenLayers.Layer.Vector("Parcel Draw Layer", {
            eventListeners : {
                "featuresadded" : function(layer) {
                }
            }
        });

        this.drawControls = {
            point : new OpenLayers.Control.DrawFeature(me.drawLayer, OpenLayers.Handler.Point),
            line : new OpenLayers.Control.DrawFeature(me.drawLayer, OpenLayers.Handler.Path),
            area : new OpenLayers.Control.DrawFeature(me.drawLayer, OpenLayers.Handler.Polygon),
            box : new OpenLayers.Control.DrawFeature(me.drawLayer, OpenLayers.Handler.RegularPolygon, {
                handlerOptions : {
                    sides : 4,
                    irregular : true
                }
            })
        };

        // doesn't really need to be in array, but lets keep it for future development
        this.modifyControls = {
            modify : new OpenLayers.Control.ModifyFeature(me.drawLayer)
        };
        this._map.addLayers([me.drawLayer]);
        for (var key in this.drawControls) {
            this._map.addControl(this.drawControls[key]);
        }
        for (var key in this.modifyControls) {
            this._map.addControl(this.modifyControls[key]);
        }
        // no harm in activating straight away
        this.modifyControls.modify.activate();

        this.requestHandlers = {
            startDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler', sandbox, me),
            stopDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.StopDrawingRequestHandler', sandbox, me),
            saveDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.SaveDrawingRequestHandler', sandbox, me)
        };
        
        this.splitter = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.split.ParcelSplit', this);
        this.splitter.init();
    },
    /**
     * Returns the drawn feature from the draw layer
     * @method
     */
    getDrawing : function() {
        return this.drawLayer.features[0];
    },
    setFeatureType : function(featureType) {
        this.currentFeatureType = featureType;
    },
    getFeatureType : function() {
        return this.currentFeatureType;
    },    
    register : function() {

    },
    unregister : function() {
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
        sandbox.addRequestHandler('Parcel.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('Parcel.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('Parcel.SaveDrawingRequest', this.requestHandlers.saveDrawingHandler);
    },
    stopPlugin : function(sandbox) {
        sandbox.removeRequestHandler('Parcel.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('Parcel.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('Parcel.SaveDrawingRequest', this.requestHandlers.saveDrawingHandler);
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
