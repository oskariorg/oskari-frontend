/**
 * @class Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin', function (config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.sourceLayer = null;
    this.selectionLayer = null;
    this.markerLayer = null;
    this.markers = [];
    this.markerSize = new OpenLayers.Size(21, 25);
    this.markerOffset = new OpenLayers.Pixel(-(this.markerSize.w/2), -this.markerSize.h);
    this.markerIcon = new OpenLayers.Icon('/Oskari/resources/framework/bundle/geometryeditor/images/marker.png', this.markerSize, this.markerOffset);
    this.activeMarker = null;
    this.startIndex = null;
    this.endIndex = null;
    this.editMode = false;
    this.currentDrawMode = null;
    this.prefix = "DrawFilterPlugin.";
    this.creatorId = undefined;

    if (config && config.id) {
        // Note that the events and requests need to match the configured
        // prefix based on the id!
        this.prefix = config.id + ".";
        this.creatorId = config.id;
    }
    // graphicFill, instance
    if (config && config.graphicFill) {
        this.graphicFill = config.graphicFill;
    }
    this.multipart = (config && config.multipart === true);
}, {
    __name: 'DrawFilterPlugin',

    getName: function () {
        return this.prefix + this.pluginName;
    },
    getMapModule: function () {
        return this.mapModule;
    },
    setMapModule: function (mapModule) {
        this.mapModule = mapModule;

        if (mapModule) {
            this._map = mapModule.getMap();
            this.pluginName = mapModule.getName() + this.__name;
        } else {
            this._map = null;
            this.pluginName = null;
        }
    },
    /**
     * Enables the draw filtering control for given params.drawMode.
     * Clears the layer of any previously drawn features.
     * @param params includes mode, geometry, sourceGeometry and style
     * @method
     */
    startDrawFiltering: function (params) {
        var me = this;
        this.sourceLayer.destroyFeatures();
        this.selectionLayer.destroyFeatures();
        this.markerLayer.clearMarkers();
        this.startIndex = null;
        this.endIndex = null;

        if (params.drawMode === "point") {
            var line = params.sourceGeometry;
            this.sourceLayer.addFeatures([line]);
            var linePoints = line.geometry.components;

            var extent = this._map.getExtent();
            var width = extent.right-extent.left;
            var height = extent.top-extent.bottom;
            var optimalExtent = new OpenLayers.Bounds(
                extent.left+0.1*width,
                extent.bottom+0.1*height,
                extent.right-0.1*width,
                extent.top-0.1*height
            );

            // Search visible location for the first marker
            var lonlat = null;
            var index = null;
            for (var i=0; i<linePoints.length; i++) {
                var x = linePoints[i].x;
                var y = linePoints[i].y;
                if (optimalExtent.contains(x,y)) {
                    lonlat = new OpenLayers.LonLat(x,y);
                    index = i;
                    break;
                }
            }
            if (lonlat === null) {
                lonlat = new OpenLayers.LonLat(linePoints[0].x,linePoints[0].y);
                for (var i=0; i<linePoints.length; i++) {
                    var x = linePoints[i].x;
                    var y = linePoints[i].y;
                    if (extent.contains(x,y)) {
                        lonlat = new OpenLayers.LonLat(x,y);
                        index = i;
                        break;
                    }
                }
            }
            var marker1 = new OpenLayers.Marker(lonlat,this.markerIcon.clone());
            marker1.index = index;
            marker1.events.register("mousedown", me, me._selectActiveMarker);
            marker1.markerMouseOffset = new OpenLayers.LonLat(0, 0);

            // Search visible location for the second marker
            lonlat = null;
            for (var i=linePoints.length-1; i>=0; i--) {
                var x = linePoints[i].x;
                var y = linePoints[i].y;
                if (optimalExtent.contains(x,y)) {
                    lonlat = new OpenLayers.LonLat(x,y);
                    index = i-1;
                    break;
                }
            }
            if (lonlat === null) {
                lonlat = new OpenLayers.LonLat(linePoints[0].x,linePoints[0].y);
                for (var i=linePoints-1; i>=0; i--) {
                    var x = linePoints[i].x;
                    var y = linePoints[i].y;
                    if (extent.contains(x,y)) {
                        lonlat = new OpenLayers.LonLat(x,y);
                        index = i-1;
                        break;
                    }
                }
            }
            var marker2 = new OpenLayers.Marker(lonlat,this.markerIcon.clone());
            marker2.index = index;
            marker2.events.register("mousedown", me, this._selectActiveMarker);
            marker2.markerMouseOffset = new OpenLayers.LonLat(0, 0);

            this.markers.push(marker1);
            this.markers.push(marker2);

            this.markerLayer.addMarker(this.markers[0]);
            this.markerLayer.addMarker(this.markers[1]);

            // Set a high enough z-index value
            var zIndex = Math.max(this._map.Z_INDEX_BASE.Feature,this.markerLayer.getZIndex())+1;
            this.markerLayer.setZIndex(zIndex);

            // Update output layer
            this.updateSelectionLayer();
        }
    },

    _selectActiveMarker: function (evt) {
        OpenLayers.Event.stop(evt);
        var me = this;
        var xy = this._map.events.getMousePosition(evt);
        var pixel = new OpenLayers.Pixel(xy.x, xy.y);
        var xyLonLat = this._map.getLonLatFromPixel(pixel);
        this.activeMarker = evt.object;
        this.activeMarker.markerMouseOffset.lon = xyLonLat.lon-this.activeMarker.lonlat.lon;
        this.activeMarker.markerMouseOffset.lat = xyLonLat.lat-this.activeMarker.lonlat.lat;
        this._map.events.register("mouseup", me, me.freezeActiveMarker);
        this._map.events.register("mousemove", me, me.moveActiveMarker);
    },

    moveActiveMarker: function(evt) {
        this.updateActiveMarker(evt);
    },

    freezeActiveMarker: function(evt) {
        this._map.events.unregister("mousemove", this, this.moveActiveMarker);
        this._map.events.unregister("mouseup", this, this.freezeActiveMarker);
        this.updateActiveMarker(evt);
    },

    updateActiveMarker: function(evt) {
        OpenLayers.Event.stop(evt);
        var lonlat = this._map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x, evt.xy.y));
        lonlat.lon -= this.activeMarker.markerMouseOffset.lon;
        lonlat.lat -= this.activeMarker.markerMouseOffset.lat;
        var projection = this.activeMarkerProjection(lonlat);
        this.activeMarker.lonlat = projection.lonlat;
        this.activeMarker.index = projection.index;
        this.markerLayer.redraw();
        this.updateSelectionLayer();
    },

    pointProjection: function (q, p0, p1) {
        var dotProduct = function (a, b) {
            return a.x * b.x + a.y * b.y;
        };
        var a = p1.x - p0.x;
        var b = p1.y - p0.y;
        var c = q.x * (p1.x - p0.x) + q.y * (p1.y - p0.y);
        var d = p0.y - p1.y;
        var e = p1.x - p0.x;
        var f = p0.y * (p1.x - p0.x) - p0.x * (p1.y - p0.y);
        var pq = {
            x: -(c * e - b * f) / (b * d - a * e),
            y: (c * d - a * f) / (b * d - a * e)
        };

        // Check if inside the segment
        var p0p1 = {
            x: p1.x - p0.x,
            y: p1.y - p0.y
        };
        var pqp1 = {
            x: p1.x - pq.x,
            y: p1.y - pq.y
        };
        var dp = dotProduct(p0p1, pqp1);
        var l = dotProduct(p0p1, p0p1);
        if (dp < 0) {
            if (!p1.closed) {
                return null;
            }
            pq.x = p1.x;
            pq.y = p1.y;
        } else if (dp > l) {
            if (!p0.closed) {
                return null;
            }
            pq.x = p0.x;
            pq.y = p0.y;
        }
        // Denominator zero:
        if ((isNaN(pq.x)) || (isNaN(pq.y))) {
            return p0;
        }
        return pq;
    },

    getDistance: function (p1, p2) {
        var x1;
        var isNumber = function isNumber(n) {
            return (!isNaN(parseFloat(n))) && (isFinite(n));
        };

        if (isNumber(p1.lon)) {
            x1 = p1.lon;
        } else if (isNumber(p1.x)) {
            x1 = p1.x;
        } else if (isNumber(p1[0])) {
            x1 = p1[0];
        } else {
            return null;
        }

        var y1;
        if (isNumber(p1.lat)) {
            y1 = p1.lat;
        } else if (isNumber(p1.y)) {
            y1 = p1.y;
        } else if (isNumber(p1[1])) {
            y1 = p1[1];
        } else {
            return null;
        }

        var x2;
        if (isNumber(p2.lon)) {
            x2 = p2.lon;
        } else if (isNumber(p2.x)) {
            x2 = p2.x;
        } else if (isNumber(p2[0])) {
            x2 = p2[0];
        } else {
            return null;
        }

        var y2;
        if (isNumber(p2.lat)) {
            y2 = p2.lat;
        } else if (isNumber(p2.y)) {
            y2 = p2.y;
        } else if (isNumber(p2[1])) {
            y2 = p2[1];
        } else {
            return null;
        }
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    activeMarkerProjection: function (refLonlat) {
        var projection = {
            lonlat: null,
            index: -1
        };
        var point = {
            x: refLonlat.lon,
            y: refLonlat.lat
        };
        var points = this.sourceLayer.features[0].geometry.components;
        // Is valid line?
        if (points.length < 2) {
            return null;
        }
        var distance = null;
        var minDistance = Number.POSITIVE_INFINITY;
        var projPoint = null;

        // Visit all the segments
        for (var i = 1; i < points.length; i++) {
            var j = i - 1;
            var p1 = {
                x: points[j].x,
                y: points[j].y,
                closed: true
            };
            var p2 = {
                x: points[i].x,
                y: points[i].y,
                closed: true
            };

            // Actual projection
            projPoint = this.pointProjection(point, p1, p2);
            if (projPoint === null) {
                continue;
            }

            // Distance comparison
            distance = this.getDistance(point, projPoint);
            if (distance === null) {
                continue;
            }
            if (distance < minDistance) {
                projection.lonlat = new OpenLayers.LonLat(projPoint.x, projPoint.y);
                projection.index = j;
                minDistance = distance;
            }
        }
        return projection;
    },

    /**
     * Disables all draw controls and
     * clears the layer of any drawn features
     * @method
     */
    stopDrawFiltering: function () {
        // disable all draw controls
        this.toggleControl();
        // clear drawing
        if (this.sourceLayer) {
            this.sourceLayer.destroyFeatures();
            this.sourceLayer.redraw();
        }
        if (this.selectionLayer) {
            this.selectionLayer.destroyFeatures();
            this.selectionLayer.redraw();
        }
        if (this.markerLayer) {
            this.markerLayer.clearMarkers();
            this.markerLayer.redraw();
        }
    },

    finishDrawFilter: function () {
        var evtBuilder = this._sandbox.getEventBuilder('DrawFilterPlugin.FinishedDrawFilteringEvent');
        var event = evtBuilder(this.getSelection(), this.editMode, this.creatorId);
        this._sandbox.notifyAll(event);
        //this.stopDrawFiltering();
    },

    /**
     * Called when drawing is finished.
     * Disables all draw controls and
     * sends a '[this.prefix] + FinishedDrawingEvent' with the drawn the geometry.
     * @method
     */
    finishedDrawing: function (isForced) {

return;
/*
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
            var lastIndex = this.sourceLayer.features.length - 1;
            this.modifyControls.select.select(this.sourceLayer.features[lastIndex]);
        }

        var evtBuilder, event;
        if (!this.multipart || isForced) {
            evtBuilder = this._sandbox.getEventBuilder('DrawFilterPlugin.FinishedDrawingEvent');
            event = evtBuilder(this.getDrawing(), this.editMode, this.creatorId);
            this._sandbox.notifyAll(event);
        } else {
            evtBuilder = this._sandbox.getEventBuilder('DrawFilterPlugin.AddedFeatureEvent');
            event = evtBuilder(this.getDrawing(), this.currentDrawMode, this.creatorId);
            this._sandbox.notifyAll(event);
        }
*/
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

/*        var key, control, activeDrawing, event;
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
*/
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
            startDrawFilteringHandler: Oskari.clazz.create('Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StartDrawFilteringRequestPluginHandler', sandbox, me),
            stopDrawFilteringHandler: Oskari.clazz.create('Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin.request.StopDrawFilteringRequestPluginHandler', sandbox, me)
        };

        this.sourceLayer = new OpenLayers.Layer.Vector(this.prefix + "sourceLayer", {
            style: {
             strokeColor: "#0000ff",
             strokeWidth: 2,
             fillOpacity: 0,
             cursor: "pointer"
             },
            eventListeners: {
/*                "featuresadded": function (layer) {
                    // send an event that the drawing has been completed
                    me.finishedDrawing();
                },
                'vertexmodified': function (event) {
                    me._sendActiveGeometry(me.getDrawing());
                } */
            }
        });

        this.selectionLayer = new OpenLayers.Layer.Vector(this.prefix + "selectionLayer", {
            style: {
             strokeColor: "#ff0000",
             strokeWidth: 4,
             fillOpacity: 0,
             cursor: "pointer"
             },
            eventListeners: {
            }
        });

        this.drawControls = {
        };

        this.modifyControls = {
/*            modify: new OpenLayers.Control.ModifyFeature(me.sourceLayer, {
                standalone: true
            })
*/      };
/*        this.modifyControls.select = new OpenLayers.Control.SelectFeature(me.sourceLayer, {
            onBeforeSelect: this.modifyControls.modify.beforeSelectFeature,
            onSelect: this.modifyControls.modify.selectFeature,
            onUnselect: this.modifyControls.modify.unselectFeature,
            scope: this.modifyControls.modify
        });
*/
        this._map.addLayers([me.sourceLayer,me.selectionLayer]);

/*        var key;
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
*/

        // Marker layer
        this.markerLayer = new OpenLayers.Layer.Markers(this.prefix + "MarkerLayer", {});
        var index = Math.max(this._map.Z_INDEX_BASE.Feature, this.markerLayer.getZIndex()) + 1;
        this.markerLayer.setZIndex(index);
        this._map.addLayers([me.markerLayer]);
    },

    updateSelectionLayer: function() {
        var markerData = [];
        var markerDataUnordered = [{
            x: this.markers[0].lonlat.lon,
            y: this.markers[0].lonlat.lat,
            index: this.markers[0].index
        },{
            x: this.markers[1].lonlat.lon,
            y: this.markers[1].lonlat.lat,
            index: this.markers[1].index
        }];

        // Change marker order if needed
        if (this.markers[0].index <= this.markers[1].index) {
            markerData = markerDataUnordered;
        } else {
            markerData = [markerDataUnordered[1],markerDataUnordered[0]];
        }
        // Only end point has moved
        if ((this.startIndex === markerData[0].index)&&(this.endIndex === markerData[1].index)) {
            this.selectionLayer.features[0].geometry.components[0].x = markerData[0].x;
            this.selectionLayer.features[0].geometry.components[0].y = markerData[0].y;
            var lastIndex = this.selectionLayer.features[0].geometry.components.length-1;
            this.selectionLayer.features[0].geometry.components[lastIndex].x = markerData[1].x;
            this.selectionLayer.features[0].geometry.components[lastIndex].y = markerData[1].y;
            this.selectionLayer.redraw();
            return;
        }
        this.startIndex = markerData[0].index;
        this.endIndex = markerData[1].index;
        // Create a new selected feature
        var points = [];
        points.push(new OpenLayers.Geometry.Point(markerData[0].x,markerData[0].y));
        for (var i=markerData[0].index+1; i<=markerData[1].index; i++) {
            points.push(this.sourceLayer.features[0].geometry.components[i].clone());
        }
        points.push(new OpenLayers.Geometry.Point(markerData[1].x,markerData[1].y));
        var newSelection = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(points));
        this.selectionLayer.destroyFeatures();
        this.selectionLayer.addFeatures([newSelection]);
        this.selectionLayer.redraw();
    },

    getSelection: function () {
        return this.selectionLayer.features[0].geometry.clone();
    },

    /**
     * Clones the drawing on the map and adds the geometry
     * currently being drawn to it.
     *
     * @method getActiveDrawing
     * @param  {OpenLayers.Geometry} geometry
     * @return {OpenLayers.Geometry}
     */
    getActiveDrawing: function (geometry) {
        var prevGeom = this.getDrawing(),
            composedGeom;

        if (prevGeom !== null && prevGeom !== undefined) {
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

    _sendActiveGeometry: function (geometry, drawMode) {
/*
        var eventBuilder = this._sandbox.getEventBuilder('DrawFilterPlugin.ActiveDrawingEvent'),
            event,
            featClass;

        if (drawMode === null || drawMode === undefined) {
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
            event = eventBuilder(geometry, drawMode, this.creatorId);
            this._sandbox.notifyAll(event);
        }
*/
    },

    register: function () {

    },
    unregister: function () {},
    startPlugin: function (sandbox) {
        this._sandbox = sandbox;
        sandbox.register(this);
        sandbox.addRequestHandler('DrawFilterPlugin.StartDrawFilteringRequest', this.requestHandlers.startDrawFilteringHandler);
        sandbox.addRequestHandler('DrawFilterPlugin.StopDrawFilteringRequest', this.requestHandlers.stopDrawFilteringHandler);

    },
    stopPlugin: function (sandbox) {
//        this.toggleControl();

        if (this.sourceLayer) {
            this.sourceLayer.destroyFeatures();
            this._map.removeLayer(this.sourceLayer);
            this.sourceLayer = undefined;
        }

      if (this.markerLayer) {
            this.markerLayer.clearMarkers();
            this._map.removeLayer(this.markerLayer);
            this.markerLayer = undefined;
      }

        if (this._map.geometryEditor) {
            delete this._map.geometryEditor;
        }

        sandbox.removeRequestHandler('DrawFilterPlugin.StartDrawFilteringRequest', this.requestHandlers.startDrawFilteringHandler);
        sandbox.removeRequestHandler('DrawFilterPlugin.StopDrawFilteringRequest', this.requestHandlers.stopDrawFilteringHandler);
        sandbox.unregister(this);

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
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.GeometryEditor.Plugin"]
});
