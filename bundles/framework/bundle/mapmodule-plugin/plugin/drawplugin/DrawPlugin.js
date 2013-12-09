/**
 * @class Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin', function (config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.editMode = false;
    this.currentDrawMode = null;
    this.prefix = "DrawPlugin.";

    if (config && config.id) {
        // Note that the events and requests need to match the configured prefix based on the id!
        this.prefix = config.id + ".";
    }
    // graphicFill, instance
    if (config && config.graphicFill) {
        this.graphicFill = config.graphicFill;
    }
    this.multipart = (config && config.multipart === true);
}, {
    __name: 'DrawPlugin',

    getName: function () {
        return this.prefix + this.pluginName;
    },
    getMapModule: function () {
        return this.mapModule;
    },
    setMapModule: function (mapModule) {
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
    startDrawing: function (params) {
        if (params.isModify) {
            // preselect it for modification
            this.modifyControls.select.select(this.drawLayer.features[0]);
        } else {
            // remove possible old drawing
            this.drawLayer.destroyFeatures();
            if (params.geometry) {
                // sent existing geometry == edit mode
                this.editMode = true;
                // add feature to draw layer
                var features = [new OpenLayers.Feature.Vector(params.geometry)];
                this.drawLayer.addFeatures(features);
                // preselect it for modification
                this.modifyControls.select.select(this.drawLayer.features[0]);
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
    stopDrawing: function () {
        // disable all draw controls
        this.toggleControl();
        // clear drawing
        this.drawLayer.destroyFeatures();
    },

    forceFinishDraw: function () {
        try {
            //needed when preparing unfinished objects but causes unwanted features into the layer:
            //this.drawControls[this.currentDrawMode].finishSketch();
            this.finishedDrawing(true);
        } catch (error) {
            // happens when the sketch isn't even started -> reset state
            this.stopDrawing();
            var event = this._sandbox.getEventBuilder('DrawPlugin.SelectedDrawingEvent')();
            this._sandbox.notifyAll(event);
        }
    },

    /**
     * Called when drawing is finished.
     * Disables all draw controls and
     * sends a '[this.prefix] + FinishedDrawingEvent' with the drawn the geometry.
     * @method
     */
    finishedDrawing: function (isForced) {
        if (!this.multipart || isForced) {
            // not a multipart, stop editing
            var activeControls = this._getActiveDrawControls(),
                i,
                components;
            for (i = 0; i < activeControls.length; i++) {
                // only lines and polygons have the finishGeometry function
                if (typeof this.drawControls[activeControls[i]].handler.finishGeometry === typeof Function) {
                    // No need to finish geometry if already finished
                    switch (activeControls[i]) {
                    case "line":
                        if (this.drawControls.line.handler.line.geometry.components.length < 2) {
                            continue;
                        }
                        break;
                    case "area":
                        components = this.drawControls.area.handler.polygon.geometry.components;
                        if (components[components.length - 1].components.length < 3) {
                            continue;
                        }
                        break;
                    }
                    this.drawControls[activeControls[i]].handler.finishGeometry();
                }
            }
            this.toggleControl();
        }

        if (!this.editMode) {
            // programmatically select the drawn feature ("not really supported by openlayers")
            // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
            var lastIndex = this.drawLayer.features.length - 1;
            this.modifyControls.select.select(this.drawLayer.features[lastIndex]);
        }

        var event;
        if (!this.multipart || isForced) {
            event = this._sandbox.getEventBuilder('DrawPlugin.FinishedDrawingEvent')(this.getDrawing(), this.editMode);
            this._sandbox.notifyAll(event);
        } else {
            event = this._sandbox.getEventBuilder('DrawPlugin.AddedFeatureEvent')(this.getDrawing(), this.currentDrawMode);
            this._sandbox.notifyAll(event);
        }
    },
    /**
     * Enables the given draw control
     * Disables all the other draw controls
     * @param drawMode draw control to activate (if undefined, disables all
     * controls)
     * @method
     */
    toggleControl: function (drawMode) {
        this.currentDrawMode = drawMode;
        var key, control, activeDrawing, event;

        for (key in this.drawControls) {
            if (this.drawControls.hasOwnProperty(key)) {
                control = this.drawControls[key];
                if (drawMode === key) {
                    control.activate();
                } else {
                    control.deactivate();
                }
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
    init: function (sandbox) {
        var me = this;
        this.requestHandlers = {
            startDrawingHandler: Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StartDrawingRequestPluginHandler', sandbox, me),
            stopDrawingHandler: Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.StopDrawingRequestPluginHandler', sandbox, me),
            getGeometryHandler: Oskari.clazz.create('Oskari.mapframework.ui.module.common.mapmodule.DrawPlugin.request.GetGeometryRequestPluginHandler', sandbox, me)
        };

        this.drawLayer = new OpenLayers.Layer.Vector(this.prefix + "DrawLayer", {
            /*style: {
             strokeColor: "#ff00ff",
             strokeWidth: 3,
             fillOpacity: 0,
             cursor: "pointer"
             },*/
            eventListeners: {
                "featuresadded": function (layer) {
                    // send an event that the drawing has been completed
                    me.finishedDrawing();
                },
                'featuremodified': function(event) {
                    me._sendActiveGeometry(event.feature.geometry);
                }
            }
        });

        this.drawControls = {
            point: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.Point),
            line: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.Path, {
                    callbacks: {
                        modify: function(geom, feature) {
                            me._sendActiveGeometry(me.getActiveDrawing(feature.geometry), 'line');
                        }
                    }
                }),
            area: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.Polygon, {
                    handlerOptions: {
                        holeModifier: "altKey"
                    },
                    callbacks: {
                        modify: function(geom, feature) {
                            me._sendActiveGeometry(me.getActiveDrawing(feature.geometry), 'area');
                        }
                    }
                }),
            /*cut : new OpenLayers.Control.DrawFeature(me.drawLayer,
                                                      OpenLayers.Handler.Polygon,
                                                      {handlerOptions:{drawingHole: true}}),*/
            box: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.RegularPolygon, {
                    handlerOptions: {
                        sides: 4,
                        irregular: true
                    }
                })
        };

        if (this.graphicFill !== null && this.graphicFill !== undefined) {
            var str = this.graphicFill;
            var format = new OpenLayers.Format.SLD();
            var obj = format.read(str),
                p;
            if (obj && obj.namedLayers) {
                for (p in obj.namedLayers) {
                    if (obj.namedLayers.hasOwnProperty(p)) {
                        this.drawLayer.styleMap.styles["default"] = obj.namedLayers[p].userStyles[0];
                        this.drawLayer.redraw();
                        break;
                    }
                }
            }
        }

        // doesn't really need to be in array, but lets keep it for future development
        this.modifyControls = {
            modify: new OpenLayers.Control.ModifyFeature(me.drawLayer, {
                standalone: true
            })
        };
        this.modifyControls.select = new OpenLayers.Control.SelectFeature(me.drawLayer, {
            onBeforeSelect: this.modifyControls.modify.beforeSelectFeature,
            onSelect: this.modifyControls.modify.selectFeature,
            onUnselect: this.modifyControls.modify.unselectFeature,
            scope: this.modifyControls.modify
        });

        this._map.addLayers([me.drawLayer]);
        var key;
        for (key in this.drawControls) {
            if (this.drawControls.hasOwnProperty(key)) {
                this._map.addControl(this.drawControls[key]);
            }
        }
        for (key in this.modifyControls) {
            if (this.modifyControls.hasOwnProperty(key)) {
                this._map.addControl(this.modifyControls[key]);
            }
        }
        // no harm in activating straight away
        this.modifyControls.modify.activate();
    },
    /**
     * Returns the drawn geometry from the draw layer
     * @method
     */
    getDrawing: function () {
        if (this.drawLayer.features.length === 0) {
            return null;
        }
        var featClass = this.drawLayer.features[0].geometry.CLASS_NAME;
        if ((featClass === "OpenLayers.Geometry.MultiPoint") ||
                (featClass === "OpenLayers.Geometry.MultiLineString") ||
                (featClass === "OpenLayers.Geometry.MultiPolygon")) {
            return this.drawLayer.features[0].geometry;
        }

        var drawing = null;
        var components = [],
            i;
        for (i = 0; i < this.drawLayer.features.length; i++) {
            components.push(this.drawLayer.features[i].geometry);
        }
        switch (featClass) {
        case "OpenLayers.Geometry.Point":
            drawing = new OpenLayers.Geometry.MultiPoint(components);
            break;
        case "OpenLayers.Geometry.LineString":
            drawing = new OpenLayers.Geometry.MultiLineString(components);
            break;
        case "OpenLayers.Geometry.Polygon":
            drawing = new OpenLayers.Geometry.MultiPolygon(components);
            break;
        }
        return drawing;
    },

    /**
     * Clones the drawing on the map and adds the geometry
     * currently being drawn to it.
     *
     * @method getActiveDrawing
     * @param  {OpenLayers.Geometry} geometry
     * @return {OpenLayers.Geometry}
     */
    getActiveDrawing: function(geometry) {
        var prevGeom = this.getDrawing(),
            composedGeom;

        if (prevGeom != null) {
            composedGeom = prevGeom.clone();
            composedGeom.addComponent(geometry);
            return composedGeom;
        }
        return geometry;
    },

    /**
     * Returns active draw control names
     * @method
     */
    _getActiveDrawControls: function () {
        var activeDrawControls = [],
            drawControl;
        for (drawControl in this.drawControls) {
            if (this.drawControls.hasOwnProperty(drawControl)) {
                if (this.drawControls[drawControl].active) {
                    activeDrawControls.push(drawControl);
                }
            }
        }
        return activeDrawControls;
    },

    _sendActiveGeometry: function(geometry, drawMode) {
        var eventBuilder = this._sandbox.getEventBuilder('DrawPlugin.ActiveDrawingEvent'),
            event, featClass;

        if (drawMode == null) {
            featClass = geometry.CLASS_NAME;
            switch (featClass) {
            case "OpenLayers.Geometry.LineString":
            case "OpenLayers.Geometry.MultiLineString":
                drawMode = 'line';
                break;
            case "OpenLayers.Geometry.Polygon":
            case "OpenLayers.Geometry.MultiPolygon":
                drawMode = 'area';
                break;
            default:
                return;
            }
        }

        if (eventBuilder) {
            event = eventBuilder(geometry, drawMode);
            this._sandbox.notifyAll(event);
        }
    },

    register: function () {

    },
    unregister: function () {},
    startPlugin: function (sandbox) {
        this._sandbox = sandbox;

        sandbox.register(this);
        sandbox.addRequestHandler('DrawPlugin.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.addRequestHandler('DrawPlugin.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.addRequestHandler('DrawPlugin.GetGeometryRequest', this.requestHandlers.getGeometryHandler);

    },
    stopPlugin: function (sandbox) {

        sandbox.removeRequestHandler('DrawPlugin.StartDrawingRequest', this.requestHandlers.startDrawingHandler);
        sandbox.removeRequestHandler('DrawPlugin.StopDrawingRequest', this.requestHandlers.stopDrawingHandler);
        sandbox.removeRequestHandler('DrawPlugin.GetGeometryRequest', this.requestHandlers.getGeometryHandler);
        sandbox.unregister(this);

        this._map = null;
        this._sandbox = null;
    },
    /* @method start
     * called from sandbox
     */
    start: function (sandbox) {},
    /**
     * @method stop
     * called from sandbox
     *
     */
    stop: function (sandbox) {}
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});