/**
 * @class Oskari.mapframework.bundle.parcel.plugin.DrawPlugin
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.plugin.DrawPlugin', function(instance) {
    this.instance = instance;
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.controls = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.editLayer = null;
    this.markerLayer = null;
    this.currentDrawMode = null;
    this.currentFeatureType = null;
    // Created in init.
    this.splitter = null;
    this.splitSelection = false;
}, {
    getName : function() {
        return this.pluginName;
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
                    // Make sure that all the component states are in sync, such as dialogs.
                    var event = me._sandbox.getEventBuilder('Parcel.FinishedDrawingEvent')();
                    me._sandbox.notifyAll(event);
                    // Disable all draw controls.
                    // Then, the user needs to reselect what to do next.
                    // At the moment, this creates some consistency in the usability.
                    me.toggleControl();

                    // Because a new feature was added, do splitting.
                    me.splitFeature();
                }
            }
        });

        this.editLayer = new OpenLayers.Layer.Vector("Parcel Edit Layer", {
            eventListeners : {
                "featuremodified" : function(event) {
					console.log('fm');
                    var operatingFeature = this.features[0];
                    if (operatingFeature.geometry.CLASS_NAME === "OpenLayers.Geometry.LineString") {
                        var markerLayer = this.map.getLayersByName("Parcel Markers Layer")[0];
                        var order = markerLayer.markers[0].firstLine;
                        var mInd = order ? 0 : 1;

                        var lineRunLength = operatingFeature.geometry.components.length-1;

                        operatingFeature.geometry.components[0].x = markerLayer.markers[mInd].lonlat.lon;
                        operatingFeature.geometry.components[0].y = markerLayer.markers[mInd].lonlat.lat;
                        operatingFeature.geometry.components[lineRunLength].x = markerLayer.markers[(mInd+1)%2].lonlat.lon;
                        operatingFeature.geometry.components[lineRunLength].y = markerLayer.markers[(mInd+1)%2].lonlat.lat;

                        var polygon1 = me.drawLayer.features[0];
                        var polygon2 = me.drawLayer.features[1];
                        var ind1 = polygon1.polygonCorners[0];
                        var ind2 = polygon1.polygonCorners[1];
                        var diff = ind2-ind1-1;
                        polygon1.geometry.components[0].components.splice(ind1+1,diff);
                        if (order) {
                            for (var i = 1; i < lineRunLength; i++) {
                                polygon1.geometry.components[0].components.splice(ind1+i,0,operatingFeature.geometry.components[i]);
                            }
                        } else {
                            for (var i = 1; i < lineRunLength; i++) {
                                polygon1.geometry.components[0].components.splice(ind1+i,0,operatingFeature.geometry.components[lineRunLength-i]);
                            }
                        }
                        polygon1.polygonCorners[1] = polygon1.polygonCorners[0]+lineRunLength;

                        ind1 = polygon2.polygonCorners[0];
                        ind2 = polygon2.polygonCorners[1];
                        diff = ind2-ind1-1;
                        polygon2.geometry.components[0].components.splice(ind1+1,diff);
                        if (order) {
                            for (i = 1; i < lineRunLength; i++) {
                                polygon2.geometry.components[0].components.splice(ind1+i,0,operatingFeature.geometry.components[lineRunLength-i]);
                            }
                        } else {
                            for (var i = 1; i < lineRunLength; i++) {
                                polygon2.geometry.components[0].components.splice(ind1+i,0,operatingFeature.geometry.components[i]);
                            }
                        }
                        polygon2.polygonCorners[1] = polygon2.polygonCorners[0]+lineRunLength;

                    }
                    this.redraw();
                    me.drawLayer.redraw();
                }
            }
        });

		this.markerLayer = new OpenLayers.Layer.Markers("Parcel Markers Layer", {});
		
        var selectEditControl = new OpenLayers.Control.SelectFeature(me.editLayer)
        this._map.addControl(selectEditControl);
        selectEditControl.activate();

        var modifyEditControl = new OpenLayers.Control.ModifyFeature(me.editLayer);
        this._map.addControl(modifyEditControl);
        modifyEditControl.activate();
        
		this.controls = {
			select: selectEditControl,
			modify: modifyEditControl
		};

        this.drawControls = {
            line : new OpenLayers.Control.DrawFeature(me.drawLayer, OpenLayers.Handler.Path),
            area : new OpenLayers.Control.DrawFeature(me.drawLayer, OpenLayers.Handler.Polygon)
        };
        this._map.addLayers([me.drawLayer]);
        for (var key in this.drawControls) {
            this._map.addControl(this.drawControls[key]);
        }

        this._map.addLayers([me.editLayer]);
        this._map.addLayers([me.markerLayer]);
        this._map.setLayerIndex(me.drawLayer, 10);
        this._map.setLayerIndex(me.editLayer, 100);
        this._map.setLayerIndex(me.markerLayer, 1000);

        this.requestHandlers = {
            startDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler', me),
            stopDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.StopDrawingRequestHandler', me),
            cancelDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.CancelDrawingRequestHandler', me),
            saveDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.SaveDrawingRequestHandler', me)
        };

        this.splitter = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.split.ParcelSplit', this);
        this.splitter.init();
    },
    startPlugin : function(sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
        sandbox.addRequestHandler('Parcel.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('Parcel.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('Parcel.CancelDrawingRequest', this.requestHandlers.cancelDrawingHandler);
        sandbox.addRequestHandler('Parcel.SaveDrawingRequest', this.requestHandlers.saveDrawingHandler);
    },
    stopPlugin : function(sandbox) {
        // Let possible info box know that this layer should not be followed.
        var event = sandbox.getEventBuilder('ParcelInfo.ParcelLayerUnregisterEvent')(this.getDrawingLayer());
        sandbox.notifyAll(event);

        // Remove request handlers.
        sandbox.removeRequestHandler('Parcel.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('Parcel.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('Parcel.CancelDrawingRequest', this.requestHandlers.cancelDrawingHandler);
        sandbox.removeRequestHandler('Parcel.SaveDrawingRequest', this.requestHandlers.saveDrawingHandler);
        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
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
     * Draw new feature to the map and zoom to its extent.
     *
     * Removes previous features if any on the map before adding the new feature to the parcel draw layer.
     *
     * This is called when the parcel is loaded from the server or if the parcel should be replaced by new one.
     *
     * The given feature may later be edited by tools selected from the UI. Notice, if feature should be edited by tools,
     * use other functions provided by this class for that.
     *
     * @param {OpenLayers.Feature.Vector} feature The feature that is added to the draw layer. May not be undefined or null.
     * @param {String} featureType The feature type of the feature. This is required when feature is committed to the server.
     * @method
     */
    drawFeature : function(feature, featureType) {
        // remove possible old drawing
        this.drawLayer.removeAllFeatures();
        this.currentFeatureType = null;

        // Let possible parcel info bundle know that layer should be followed.
        // Notice, parcel info should be initialized before this call to make it get an event.
        // Therefore, this is not called during init when layer is created. Another, way might
        // be to set dependency or certain creation order between bundles. But, the dependency is
        // not mandatory to make this bundle work and the order is required only if info should be
        // updated from this bundle.
        var event = this._sandbox.getEventBuilder('ParcelInfo.ParcelLayerRegisterEvent')(this.getDrawingLayer());
        this._sandbox.notifyAll(event);

        // add feature to draw layer
        // This feature will be the parcel that may be edited by the tools.
        var features = [feature];
        this.drawLayer.addFeatures(features);
        
        this.currentFeatureType = featureType;
        // Zoom to the loaded feature.
        this._map.zoomToExtent(this.drawLayer.getDataExtent());

        // Show tool buttons only after the parcel has been loaded.
        // Because parcel may be removed only by loading a new one.
        // The buttons can be shown after this. If a new parcel is loaded,
        // buttons can still be shown.
        if (!this.buttons) {
            // handles toolbar buttons related to parcels
            this.buttons = Oskari.clazz.create("Oskari.mapframework.bundle.parcel.handler.ButtonHandler", this.instance);
            this.buttons.start();
        }
    },
    /**
     * Enables the draw control for given params.drawMode.
     *
     * This function is meant for the tool buttons actions.
     * When a tool is selected, corresponding feature can be drawn on the map.
     *
     * @param {Object} params includes isModify, drawMode, geometry.
     * @method
     */
    startDrawing : function(params) {
        // activate requested draw control for new geometry
        this.toggleControl(params.drawMode);
    },
    /**
     * Called when the user finishes sketching.
     * This function is provided for request handlers.
     *
     * Notice, "featuresadded" is listened separately. Therefore, double clicked finishing is handled
     * that way. Also, when sketching is finished here, the flow continues in "featuresadded" listener.
     *
     * Splits the parcel feature according to the editing.
     *
     *@method
     */
    finishSketchDraw : function() {
        try {
            this.drawControls[this.currentDrawMode].finishSketch();
            // Because flow has been quite by specific button.
            // Remove control. Then, user needs to choose the correct tool again.
            this.toggleControl();

        } catch(error) {
            // happens when the sketch isn't even started -> reset state
            var event = this._sandbox.getEventBuilder('Parcel.ParcelSelectedEvent')();
            this._sandbox.notifyAll(event);
        }
    },
    /**
     * Cancel tool editing action.
     *
     * Remove the cancelled feature.
     * Disables all draw controls.
     *
     * @method
     */
    cancelDrawing : function() {
        // disable all draw controls
        this.toggleControl();
    },
    /**
     * Starts the save flow for the feature on the map.
     * If feature does not exists, does nothing.
     *
     * This function is meant for the tool buttons actions.
     * When a save tool is selected, the flow starts.
     *
     * Disables all draw controls and
     * sends a SaveDrawingEvent with the drawn feature.
     *
     * @method
     */
    saveDrawing : function() {
        if (this.drawLayer.features[0]) {
            // Select the feature that is going to be saved.
            // Then, it is shown for the user if user has unselected it before pressing save button.
            // TODO: this needs to be fixed. You're not supposed to use the selectControl inside the modifyControl!
            this.modifyControl.selectControl.select(this.drawLayer.features[0]);
            this.toggleControl();
            var event = this._sandbox.getEventBuilder('Parcel.SaveDrawingEvent')(this.getDrawing());
            this._sandbox.notifyAll(event);
        }
    },

    /**
     * Enables the given draw control.
     * Disables all the other draw controls.
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
     * @return {OpenLayers.Layer.Vector} Returns the drawn vector layer.
     * @method
     */
    getDrawingLayer : function() {
        return this.drawLayer;
    },
    /**
     * @return {OpenLayers.Feature.Vector} Returns the drawn vector feature from the draw layer. May be undefined if no feature.
     * @method
     */
    getDrawing : function() {
        return this.drawLayer.features[0];
    },
    /**
     * @param {String} featureType The feature type of the parcel feature. This is used when feature is commited to the server.
     */
    setFeatureType : function(featureType) {
        this.currentFeatureType = featureType;
    },
    /**
     * @param {String} The feature type of the parcel feature. This is used when feature is commited to the server.
     */
    getFeatureType : function() {
        return this.currentFeatureType;
    },
    /* @method start
     * called from sandbox
     */
    start : function(sandbox) {
    },
    /**
     * @method stop
     * called from sandbox
     */
    stop : function(sandbox) {
        // Let possible info box know that this layer should not be followed.
        var event = sandbox.getEventBuilder('ParcelInfo.ParcelLayerUnregisterEvent')(getDrawingLayer());
        sandbox.notifyAll(event);
    },
    register : function() {
    },
    unregister : function() {
    },
    /**
     * Handles the splitting of the parcel feature
     * and replaces the feature hold by this instance.
     */
    splitFeature : function() {
        var operatingFeature = this.splitter.split();
        if (operatingFeature != undefined) {
        	this.controls.select.select(operatingFeature);
        	this.controls.modify.selectFeature(operatingFeature);
        	//this.modifyEditControl.selectFeature(operatingFeature);
        }
    }
}, {
    'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
