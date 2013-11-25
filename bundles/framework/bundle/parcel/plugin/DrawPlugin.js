/**
 * @class Oskari.mapframework.bundle.parcel.plugin.DrawPlugin
 *
 * This plugin handles the drawing of the loaded features and starts the WFST transactions for the saving of the feature data.
 * Also, this function manages the splitting operations of features. This class is the core of this bundle.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.plugin.DrawPlugin',
/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance
 */
function(instance) {
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
	// Created in init
	this.splitter = null;
	this.backupFeatures = [];
	this.splitSelection = false;
	this.basicStyle = null;
	this.selectStyle = null;
	this.selectedFeature = -2;
	this.selectInfoControl = null;
}, {
	/**
	 * @method getName
	 * Returns plugin name.
	 * @return {String} The plugin name.
	 */
	getName : function() {
		return this.pluginName;
	},
    getMap : function() {
		return this._map;
	},

    processFeatures : function() {
        var me = this;
        // Make sure that all the component states are in sync, such as dialogs.
        var event = me._sandbox.getEventBuilder('Parcel.FinishedDrawingEvent')();
        me._sandbox.notifyAll(event);
        // Disable all draw controls.
        // Then, the user needs to reselect what to do next.
        // At the moment, this creates some consistency in the usability.
        me.toggleControl();
        // Because a new feature was added, do splitting.
        me.splitFeature();
    },

	/**
	 * Initializes the plugin:
	 * - layer that is used for drawing
	 * - drawControls
	 * - registers for listening to requests and events
	 * @param sandbox reference to Oskari sandbox
	 * @method init
	 */
	init : function(sandbox) {
		var me = this;
		// This layer will first contain the downloaded feature. After the split is done, that feature
		// removed from the layer
		this.drawLayer = new OpenLayers.Layer.Vector("Parcel Draw Layer", {
			eventListeners : {
				"featuresadded" : function(layer) {
                    if (layer.features[0].geometry.CLASS_NAME === "OpenLayers.Geometry.LineString") {
                        var loc = me.instance.getLocalization('notification').calculating;
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(loc.title, "");
                        // The popup dialog doesn't work without short delay
                        setTimeout(function(){
                            me.processFeatures();
                            dialog.close();
                        },200);
                    } else {
                        me.processFeatures();
                    }
				}
			}
		});
		this.drawLayer.quantumStep = 5000;

		// This layer will contain the geometry that will split the original feature.
		this.editLayer = new OpenLayers.Layer.Vector("Parcel Edit Layer", {
			eventListeners : {
				"featuremodified" : function(event) {
                    var line = event.feature.geometry.components[0];
                    // Line or hole?
                    if (line.components[0].id !== line.components[line.components.length-1].id) {
                        this.updateLine();
                    } else {
                        this.updateHole(event.feature);
                    }
                    // Reproduce the original OL 2.12 behaviour
                    jQuery('svg').find('circle').css('cursor', 'move');
                    jQuery('div.olMapViewport').find('oval').css('cursor', 'move'); // IE8
          			this.redraw();
		        	me.drawLayer.redraw();
				}
			}
		});

		this.editLayer.updateLine = function() {
			var operatingFeature = this.features[0];
			if (operatingFeature.geometry.CLASS_NAME === "OpenLayers.Geometry.MultiLineString") {
				// Handles the point added into the line
				for (var i = 0; i < operatingFeature.geometry.components.length; i++) {
					var lineString = operatingFeature.geometry.components[i];
					for (var k = 0; k < lineString.components.length; k++) {
						var point = lineString.components[k];
						var newReferences = [];
						if ( typeof point.references === "undefined") {
							var prevPoint = lineString.components[k - 1];
							var nextPoint = lineString.components[k + 1];
							for (var l = 0; l < prevPoint.references.length; l++) {
								var refPoly = prevPoint.references[l];
								var found = false;
								for (var m = 0; m < nextPoint.references.length; m++) {
									if (nextPoint.references[m] === refPoly) {
										found = true;
										break;
									}
								}
								if (!found)
									continue;
								var polygon = null;
								for ( m = 0; m < me.drawLayer.features.length; m++) {
									var feature = me.drawLayer.features[m];
									if (feature.geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
										if (feature.geometry.id === refPoly) {
											polygon = feature.geometry;
											break;
										}
									}
								}
								var points = polygon.components[0].components;
								var polyLength = points.length - 1;
								for ( m = 0; m < polyLength; m++) {
									var n = m + 1;
									if ((points[m] === prevPoint) && (points[n] === nextPoint)) {
										points.splice(n, 0, point);
										newReferences.push(polygon.id);
										break;
									}
									if ((points[n] === prevPoint) && (points[m] === nextPoint)) {
										points.splice(n, 0, point);
										newReferences.push(polygon.id);
										break;
									}
								}
							}
							point.references = newReferences;
						}
					}
					// Fixed start and end points of the line
					if (lineString.components[0].references.length === 2) {
						lineString.components[0].x = lineString.components[0].x0;
						lineString.components[0].y = lineString.components[0].y0;
					}
					var lastIndex = lineString.components.length - 1;
					if (lineString.components[lastIndex].references.length === 2) {
						lineString.components[lastIndex].x = lineString.components[lastIndex].x0;
						lineString.components[lastIndex].y = lineString.components[lastIndex].y0;
					}
					// Updates middle points
                    me.controls.modify.deactivate();
                    me.controls.modify.activate();
					me.controls.modify.selectFeature(operatingFeature);
                    me.controls.modify.clickout = false;
                    me.controls.modify.toggle = false;
				}

				this.refresh();
				me.drawLayer.refresh();

				// Redo selection so the info box knows where we're at
				// me.controls.select.select(me.getDrawing());

			}
		};

     	this.editLayer.updateHole = function(lineFeature) {
            var points = lineFeature.geometry.components[0].components;
            if (points.length != lineFeature.numPoints) {
                var polygonFeature = me.drawLayer.features[me.drawLayer.features.length-1];
                polygonFeature.geometry.components[0].components = points;
                lineFeature.numPoints = points.length;
            }
        };

		this.basicStyle = OpenLayers.Util.applyDefaults(this.basicStyle, OpenLayers.Feature.Vector.style['default']);
		this.basicStyle.fillColor = "#bbbb00";
		this.basicStyle.fillOpacity = 0.4;

		this.selectStyle = OpenLayers.Util.applyDefaults(this.selectStyle, OpenLayers.Feature.Vector.style['default']);
		this.selectStyle.fillColor = "#ff0000";
		this.selectStyle.fillOpacity = 0.4;

		// This layer will contain markers which show the points where the operation line
		// crosses with the border of the original layer. Those points may be moved to adjust
		// the split.
		this.markerLayer = new OpenLayers.Layer.Markers("Parcel Markers Layer", {});

		// The select control applies to the edit layer and the drawing layer as we will select the polygon to save for visuals
		var selectEditControl = new OpenLayers.Control.SelectFeature([me.editLayer, me.drawLayer]);
		this._map.addControl(selectEditControl);

		// The select control for infobox
		this.selectInfoControl = new OpenLayers.Control.SelectFeature(me.drawLayer);
		this._map.addControl(this.selectInfoControl);

		var modifyEditControl = new OpenLayers.Control.ModifyFeature(me.editLayer, {clickout:false, toggle:false});
		this._map.addControl(modifyEditControl);

		this.controls = {
			select : selectEditControl,
			modify : modifyEditControl
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

		OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
			defaultHandlerOptions : {
				'single' : true,
				'double' : true,
				'pixelTolerance' : 10,
				'stopSingle' : true,
				'stopDouble' : true
			},

			initialize : function(options) {
				this.handlerOptions = OpenLayers.Util.extend({}, this.defaultHandlerOptions);
				OpenLayers.Control.prototype.initialize.apply(this, arguments);
				this.handler = new OpenLayers.Handler.Click(this, {
					'click' : this.trigger
				}, this.handlerOptions);
			},

			trigger : function(e) {
				var lonlat = me._map.getLonLatFromPixel(e.xy);
				var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);
				var i;
				var oldSelectedFeature = me.selectedFeature;
				var features = me.drawLayer.features;
				for ( i = 0; i < features.length; i++) {
					var geometry = features[i].geometry;
					if (geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon") {
						if (geometry.containsPoint(point)) {
							me.selectedFeature = i;
							// Set selected --> updates infobox
							me.selectInfoControl.select(features[i]);
							break;
						}
					}
					if (i === features.length - 1)
						me.selectedFeature = -2;
				}
				if (oldSelectedFeature != me.selectedFeature) {
					for ( i = 0; i < features.length; i++) {
						me.drawLayer.features[i].style = (i === me.selectedFeature) ? me.selectStyle : me.basicStyle;
					}
					me.editLayer.redraw();
					me.drawLayer.redraw();
				}
			}
		});

		var click = new OpenLayers.Control.Click();
		this._map.addControl(click);
		click.activate();

		this.requestHandlers = {
			startDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.StartDrawingRequestHandler', me),
			stopDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.StopDrawingRequestHandler', me),
			cancelDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.CancelDrawingRequestHandler', me),
			saveDrawingHandler : Oskari.clazz.create('Oskari.mapframework.bundle.parcel.request.SaveDrawingRequestHandler', me)
		};

		this.splitter = Oskari.clazz.create('Oskari.mapframework.bundle.parcel.split.ParcelSplit', this);
		this.splitter.init();
	},
	/**
	 * @method startPlugin
	 * Interface method for the plugin protocol.
	 * Register request handlers.
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 *          reference to application sandbox
	 */
	startPlugin : function(sandbox) {
		this._sandbox = sandbox;
		sandbox.register(this);
		sandbox.addRequestHandler('Parcel.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
		sandbox.addRequestHandler('Parcel.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
		sandbox.addRequestHandler('Parcel.CancelDrawingRequest', this.requestHandlers.cancelDrawingHandler);
		sandbox.addRequestHandler('Parcel.SaveDrawingRequest', this.requestHandlers.saveDrawingHandler);
	},
	/**
	 * @method stopPlugin
	 * Interface method for the plugin protocol.
	 * Unregister request handlers.
	 *
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 *          reference to application sandbox
	 */
	stopPlugin : function(sandbox) {
		// Let possible info box know that this layer should not be followed.
		var event = sandbox.getEventBuilder('ParcelInfo.ParcelLayerUnregisterEvent')([this.getDrawingLayer(), this.getEditLayer()]);
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
	/**
	 * @method getMapModule
	 * @return {Oskari.mapframework.ui.module.common.MapModule} reference to map module
	 */
	getMapModule : function() {
		return this.mapModule;
	},
	/**
	 * @method setMapModule
	 * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map module
	 */
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
	 * @method drawFeature
	 */
	drawFeature : function(features, featureType) {
		this.clear();

		this.currentFeatureType = null;

		// Let possible parcel info bundle know that layer should be followed.
		// Notice, parcel info should be initialized before this call to make it get an event.
		// Therefore, this is not called during init when layer is created. Another, way might
		// be to set dependency or certain creation order between bundles. But, the dependency is
		// not mandatory to make this bundle work and the order is required only if info should be
		// updated from this bundle.
		var event = this._sandbox.getEventBuilder('ParcelInfo.ParcelLayerRegisterEvent')([this.getDrawingLayer(), this.getEditLayer()]);
		this._sandbox.notifyAll(event);

		// Add features to draw layer
		// These features will be the parcels that may be edited by the tools.
		var polygons = [];
		for (var i = 0; i < features.length; i++) {
			polygons.push(features[i].geometry);
		}
		this.drawLayer.addFeatures([new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon(polygons))]);

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
	 * @method finishSketchDraw
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
	 * @method cancelDrawing
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
	 * @method saveDrawing
	 */
	saveDrawing : function() {
        if (this.selectedFeature > -2) {
            // Select the feature that is going to be saved.
            // Then, it is shown for the user if user has unselected it before pressing save button.
            var featureToSave = this.getDrawing();
            this.controls.select.select(featureToSave);
            this.toggleControl();
            var event = this._sandbox.getEventBuilder('Parcel.SaveDrawingEvent')(featureToSave);
            this._sandbox.notifyAll(event);
        }
	},

	/**
	 * Enables the given draw control.
	 * Disables all the other draw controls.
	 * @param drawMode draw control to activate (if undefined, disables all
	 * controls)
	 * @method toggleControl
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
	 * @method getDrawingLayer
	 */
	getDrawingLayer : function() {
		return this.drawLayer;
	},
	/**
	 * @return {OpenLayers.Layer.Vector} Returns the edit vector layer.
	 * @method getEditLayer
	 */
	getEditLayer : function() {
		return this.editLayer;
	},
	/**
	 * @return {OpenLayers.Layer.Vector} Returns the marker layer.
	 * @method getMarkerLayer
	 */
	getMarkerLayer : function() {
		return this.markerLayer;
	},
	/**
	 * TODO: This method needs to be informed which polygon is to be saved.
	 *
	 * @return {OpenLayers.Feature.Vector} Returns the drawn vector feature from the draw layer. May be undefined if no feature.
	 * @method getDrawing
	 */
	getDrawing : function() {
		if (this.selectedFeature > -1) {

			return this.drawLayer.features[this.selectedFeature];

		} else {
			return this.drawLayer.features[0];

		}
	},
        /**
         * Returns the parcel geometry from the draw layer
         * @method
         */
        getParcelGeometry : function() {
            if (this.drawLayer.features.length === 0) return null;
            var cur = 0;
            if (this.selectedFeature > -1) cur = this.selectedFeature;
            return this.drawLayer.features[cur].geometry;
        },
        /**
         * Returns the boundary geometry from the edit layer
         * @method
         */
        getBoundaryGeometry : function() {
            if (this.editLayer.features.length === 0) return null;
            return this.editLayer.features[0].geometry;
        },
	/**
	 * @param {String} featureType The feature type of the parcel feature. This is used when feature is commited to the server.
	 * @method setFeatureType
	 */
	setFeatureType : function(featureType) {
		this.currentFeatureType = featureType;
	},
	/**
	 * @param {String} The feature type of the parcel feature. This is used when feature is commited to the server.
	 * @method getFeatureType
	 */
	getFeatureType : function() {
		return this.currentFeatureType;
	},
	/**
	 * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
    getSandbox : function() {
        return this._sandbox;
    },
	/**
	 * @method start
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
		var event = sandbox.getEventBuilder('ParcelInfo.ParcelLayerUnregisterEvent')([this.getDrawingLayer(), this.getEditLayer()]);
		sandbox.notifyAll(event);
	},
	/**
	 * @method register
	 * Does nothing atm.
	 */
	register : function() {
	},
	/**
	 * @method unregister
	 * Does nothing atm.
	 */
	unregister : function() {
	},

	/**
	 * @method clear
	 * Clears all layers.
	 */
	clear : function() {
		// remove possible old drawing
        this.controls.modify.deactivate();
		this.drawLayer.removeAllFeatures();
		this.editLayer.removeAllFeatures();
		var startIndex = this.markerLayer.markers.length - 1;
		for (var i = startIndex; i >= 0; i--) {
			this.markerLayer.markers[i].destroy();
		}
		this.markerLayer.markers = [];
		this._map.activeMarker = null;
		this.splitSelection = false;
		// Clear parcel map layers
		this.instance.getService().clearParcelMap();

	},
	/**
	 * Handles the splitting of the parcel feature
	 * and replaces the feature hold by this instance.
	 * @method splitFeature
	 */
	splitFeature : function(trivial) {
		var trivialSplit = ( typeof trivial === "undefined" ? false : trivial);
		var operatingFeature = this.splitter.split(trivialSplit);
		if (operatingFeature != undefined) {
			this.controls.select.select(operatingFeature);
			this.controls.modify.selectFeature(operatingFeature);
			this.controls.modify.activate();
            this.controls.modify.clickout = false;
            this.controls.modify.toggle = false;
			//this.drawLayer.features[0].style = this.selectStyle;
			//this.selectedFeature = 0;
			// Make sure the marker layer is topmost (previous activations push the vector layer too high)
			var index = Math.max(this._map.Z_INDEX_BASE['Feature'], this.markerLayer.getZIndex()) + 1;
			this.markerLayer.setZIndex(index);
			this.updateInfobox();
            // Reproduce the original OL 2.12 behaviour
            jQuery('svg').find('circle').css('cursor', 'move');
            jQuery('div.olMapViewport').find('oval').css('cursor', 'move'); // IE8
		}
	},
	/**
	 * Updates feature info in info box.
	 * If there is not a feature in selected state, then 1st feature in drawLayer is selected and updated
	 * @method updateInfobox
	 */
	updateInfobox : function() {

		if (this.selectedFeature > -1) {

			// Set selected
			this.selectInfoControl.select(this.drawLayer.features[this.selectedFeature]);

		} else {
			var features = this.drawLayer.features;
			if (features) {
				this.selectedFeature = 0;
				for ( i = 0; i < features.length; i++) {
					this.drawLayer.features[i].style = (i === this.selectedFeature) ? this.selectStyle : this.basicStyle;
				}
				//me.editLayer.redraw();
				this.drawLayer.redraw();
				this.selectInfoControl.select(this.drawLayer.features[this.selectedFeature]);
			}

		}

	}
}, {
	'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
