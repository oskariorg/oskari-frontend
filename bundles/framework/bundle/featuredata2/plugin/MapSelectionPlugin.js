/**
 * @class Oskari.mapframework.bundle.metadata.plugin.MapSelectionPlugin
 *
 * Provides functionality to draw a selection box on the map
 */
Oskari.clazz.define('Oskari.mapframework.bundle.featuredata2.plugin.MapSelectionPlugin', function (config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.drawLayer = null;
    this.editMode = false;
    this.listeners = [];
    this.currentDrawMode = null;
    this.prefix = "Default.";

    if (config && config.id) {
        this.prefix = config.id + ".";
    }
    // graphicFill, instance
    if (config && config.graphicFill) {
        this.graphicFill = config.graphicFill;
    }
    this.multipart = (config && config.multipart === true);
}, {
    __name: 'MapSelectionPlugin',

    /**
     * @method getName
     * @return {String} module name
     */
    getName: function () {
        return this.prefix + this.pluginName;
    },
    /**
     * @method getMapModule
     * Returns reference to map module this plugin is registered to
     * @return {Oskari.mapframework.ui.module.common.MapModule}
     */
    getMapModule: function () {
        return this.mapModule;
    },
    /**
     * @method setMapModule
     * @param {Oskari.mapframework.ui.module.common.MapModule} reference to map
     * module
     */
    setMapModule: function (mapModule) {
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
    addListener: function (listenerFunction) {
        this.listeners.push(listenerFunction);
    },
    /**
     * @method startDrawing
     * Activates the selection tool
     * @params {String} includes drawMode, geometry and style
     */
    startDrawing: function (params) {
        if (params.isModify) {
            // preselect it for modification
            this.modifyControls.select.select(this.drawLayer.features[0]);
        } else if (params.geometry) {
            // sent existing geometry == edit mode
            this.editMode = true;
            // add feature to draw layer
            var features = [new OpenLayers.Feature.Vector(params.geometry)];
            this.drawLayer.addFeatures(features);
            // preselect it for modification
            this.drawControls.select.select(this.drawLayer.features[0]);
        } else {
            // otherwise activate requested draw control for new geometry
            this.editMode = false;
            this._toggleControl(params.drawMode);
        }
    },
    /**
     * @method stopDrawing
     * Disables all draw controls and
     * clears the layer of any drawn features
     */
    stopDrawing: function () {
        // disable all draw controls
        this._toggleControl();
        // clear drawing
        this.drawLayer.removeAllFeatures();
    },
    /**
     * @method setDrawing
     * Sets an initial geometry
     */
    setDrawing: function (geometry) {
        var features = [new OpenLayers.Feature.Vector(geometry)];
        this.drawLayer.addFeatures(features);
    },
    /**
     * @method forceFinishDraw
     * Calls _finishDrawing method to stop selection
     */
    forceFinishDraw: function () {
        this._finishedDrawing(true);
    },
    /**
     * @method _finishedDrawing
     * Called when drawing is finished.
     * Disables all draw controls and
     * calls all listeners with the drawn the geometry.
     * @param {Boolean} isForced stops selection when true
     * @private
     */
    _finishedDrawing: function (isForced) {
        if (!this.multipart || isForced) {
            // not a multipart, stop editing
            this._toggleControl();
        }
        if (!this.editMode) {
            // programmatically select the drawn feature ("not really supported by openlayers")
            // http://lists.osgeo.org/pipermail/openlayers-users/2009-February/010601.html
            var lastIndex = this.drawLayer.features.length - 1;
            this.drawControls.select.select(this.drawLayer.features[lastIndex]);
        }

        var event;
        if (!this.multipart || isForced) {
            event = this._sandbox.getEventBuilder(this.prefix + 'FinishedDrawingEvent')(this.getDrawing(), this.editMode);
            this._sandbox.notifyAll(event);
        } else {
            event = this._sandbox.getEventBuilder(this.prefix + 'AddedFeatureEvent')(this.getDrawing(), this.currentDrawMode);
            this._sandbox.notifyAll(event);
        }
    },
    /**
     * @method _toggleControl
     * Enables the given draw control
     * Disables all the other draw controls
     * @param {String} drawMode draw control to activate (if undefined, disables all
     * controls)
     * @private
     */
    _toggleControl: function (drawMode) {
        var key,
            control;
        this.currentDrawMode = drawMode;
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

        this.drawLayer = new OpenLayers.Layer.Vector(this.prefix + "FeatureData Draw Layer", {

            eventListeners: {
                "featuresadded": function (layer) {
                    // send an event that the drawing has been completed
                    me._finishedDrawing();
                }
            }
        });

        this.drawControls = {

            point: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.Point),
            line: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.Path),
            polygon: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.Polygon),
            square: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.RegularPolygon, {
                    handlerOptions: {
                        sides: 4
                    }
                }),
            circle: new OpenLayers.Control.DrawFeature(me.drawLayer,
                OpenLayers.Handler.RegularPolygon, {
                    handlerOptions: {
                        sides: 40
                    }
                }),
            modify: new OpenLayers.Control.ModifyFeature(me.drawLayer, {
                standalone: true
            }),
            select: new OpenLayers.Control.SelectFeature(me.drawLayer)
        };

        // Make sure selected feature doesn't swallow events so we can drag above it
        // http://trac.osgeo.org/openlayers/wiki/SelectFeatureControlMapDragIssues
        if (this.drawControls.select.handlers !== undefined) { // OL 2.7
            this.drawControls.select.handlers.feature.stopDown = false;
        } else if (this.drawControls.select.handler !== undefined) { // OL < 2.7
            this.drawControls.select.handler.stopDown = false;
            this.drawControls.select.handler.stopUp = false;
        }

        if (this.graphicFill !== null && this.graphicFill !== undefined) {
            var str = this.graphicFill,
                format = new OpenLayers.Format.SLD(),
                obj = format.read(str),
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

        this._map.addLayers([me.drawLayer]);
        var key;
        for (key in this.drawControls) {
            if (this.drawControls.hasOwnProperty(key)) {
                this._map.addControl(this.drawControls[key]);
            }
        }

        this.geojson_format = new OpenLayers.Format.GeoJSON();
    },
    /**
     * @Return the drawn geometry from the draw layer
     * @method getDrawing
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

        var drawing = null,
            components = [],
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
     * @Return {String} the drawn geometry from the draw layer
     * @method getFeatures
     */
    getFeatures: function () {
        return this.drawLayer.features;
    },
    /**
     * @Return {String} the drawn geometry from the draw layer
     * @method getFeaturesAsGeoJSON
     */
    getFeaturesAsGeoJSON: function () {
        var selection = this.geojson_format.write(this.getFeatures()),
            json = JSON.parse(selection);
        json.crs = this._getSRS();
        return json;
    },
    /**
     * @Return array of featuers type in JSON format
     * @method getFullScreenSelection
     */
    getFullScreenSelection: function () {
        // create selection geometry from bbox
        var bbox = this._sandbox.getMap().getBbox(),
            geometry = bbox.toGeometry(),
            selection = this.geojson_format.write(geometry),
            json = JSON.parse(selection);

        var geojs = {
            "type": "FeatureCollection",
            "crs": this._getSRS(),
            "features": []
        };
        var featureJSON = {
            "type": "Feature",
            "geometry": json,
            "properties": {
                "geom_type": "polygon",
                "buffer_radius": "0"
            }
        };
        geojs.features.push(featureJSON);
        return geojs;
    },
    /**
     * @Return{String} reference system as defined in GeoJSON format
     * @method _getSRS
     */
    _getSRS: function () {
        return {
            "type": "name",
            "properties": {
                "name": this._sandbox.getMap().getSrsName()
            }
        };
    },
    /**
     * @method register
     * implements Module protocol register method
     */
    register: function () {

    },
    /**
     * @method unregister
     * implements Module protocol unregister method
     */
    unregister: function () {},
    /**
     * @method startPlugin
     * implements MapModule.Plugin protocol startPlugin method
     */
    startPlugin: function (sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
    },
    /**
     * @method stopPlugin
     * implements MapModule.Plugin protocol stopPlugin method
     */
    stopPlugin: function (sandbox) {
        sandbox.unregister(this);
        this._map = null;
        this._sandbox = null;
    },
    /**
     * @method start
     * implements Module protocol start method
     */
    start: function (sandbox) {},
    /**
     * @method stop
     * implements Module protocol stop method
     */
    stop: function (sandbox) {}
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"]
});
