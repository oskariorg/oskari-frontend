/**
 * @class Oskari.mapframework.ui.module.common.GeometryEditor.DrawFilterPlugin
 */
Oskari.clazz.define('Oskari.mapframework.ui.module.common.geometryeditor.DrawFilterPlugin', function (config) {
    this.mapModule = null;
    this.pluginName = null;
    this._sandbox = null;
    this._map = null;
    this.drawControls = null;
    this.modifyControls = null;
    this.sourceLayer = null;
    this.targetLayer = null;
    this.markerLayer = null;
    this.markers = [];
    this.markerSize = new OpenLayers.Size(21,25);
    this.markerOffset = new OpenLayers.Pixel(-(this.markerSize.w/2),-this.markerSize.h);
    this.markerIcon = new OpenLayers.Icon('/Oskari/resources/framework/bundle/geometryeditor/images/marker.png', this.markerSize, this.markerOffset);
    this.activeMarker = null;
    this.startIndex = null;
    this.endIndex = null;
    this.editMode = false;
    this.currentDrawMode = null;
    this.prefix = "DrawFilterPlugin.";
    this.creatorId = undefined;
    // Source layer listeners
    this.sourceListeners = {
        point: {},
        line: {},
        edit: {}
    };
    // Target layer listeners
    this.targetListeners = {
        point: {},
        line: {},
        edit: {}
    };
    // Source layer style
    // Todo: defaults from configuration
    this.sourceStyleMaps = {
        point: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: "#0000ff",
                strokeWidth: 2
            }),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        }),
        line: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        }),
        edit: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        })
    };
    // Target layer style
    this.targetStyleMaps = {
        point: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                strokeColor: "#ff0000",
                strokeWidth: 3
            }),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        }),
        line: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        }),
        edit: new OpenLayers.StyleMap({
            "default": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["default"]),
            "select": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["select"]),
            "temporary": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["temporary"]),
            "delete": new OpenLayers.Style(
                OpenLayers.Feature.Vector.style["delete"])
        })
    };

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

        OpenLayers.Control.OskariModifyFeature = OpenLayers.Class(OpenLayers.Control.ModifyFeature, {
            collectVertices: function() {
                this.vertices = [];
                this.virtualVertices = [];
                var control = this;
                function collectComponentVertices(geometry) {
                    var i, vertex, component, len;
                    if(geometry.CLASS_NAME == "OpenLayers.Geometry.Point") {
                        vertex = new OpenLayers.Feature.Vector(geometry);
                        vertex._sketch = true;
                        vertex.renderIntent = control.vertexRenderIntent;
                        control.vertices.push(vertex);
                    } else {
                        var numVert = geometry.components.length;
                        if(geometry.CLASS_NAME == "OpenLayers.Geometry.LinearRing") {
                            numVert -= 1;
                        }
                        for(i=0; i<numVert; ++i) {
                            component = geometry.components[i];
                            if(component.CLASS_NAME == "OpenLayers.Geometry.Point") {
                                // Only common vertices can be edited
                                if(me.isSharedEdge(component)) {
                                    vertex = new OpenLayers.Feature.Vector(component);
                                    vertex._sketch = true;
                                    vertex.renderIntent = control.vertexRenderIntent;
                                    control.vertices.push(vertex);
                                }
                            } else {
                                if (me.targetLayer.features.length === 0) {
                                    return;
                                }
                                collectComponentVertices(component);
                            }
                        }

                        // add virtual vertices in the middle of each edge
                        if (control.createVertices && geometry.CLASS_NAME != "OpenLayers.Geometry.MultiPoint") {
                            for(i=0, len=geometry.components.length; i<len-1; ++i) {
                                var prevVertex = geometry.components[i];
                                var nextVertex = geometry.components[i + 1];
                                if(prevVertex.CLASS_NAME == "OpenLayers.Geometry.Point" &&
                                   nextVertex.CLASS_NAME == "OpenLayers.Geometry.Point") {
                                    if((me.isSharedEdge(prevVertex))||(me.isSharedEdge(nextVertex))) {
                                        var x = (prevVertex.x + nextVertex.x) / 2;
                                        var y = (prevVertex.y + nextVertex.y) / 2;
                                        var point = new OpenLayers.Feature.Vector(
                                            new OpenLayers.Geometry.Point(x, y),
                                            null, control.virtualStyle
                                        );
                                        // set the virtual parent and intended index
                                        point.geometry.parent = geometry;
                                        point._index = i + 1;
                                        point._sketch = true;
                                        control.virtualVertices.push(point);
                                    }
                                }
                            }
                        }
                    }
                }
                collectComponentVertices.call(this, this.feature.geometry);
                this.layer.addFeatures(this.virtualVertices, {silent: true});
                this.layer.addFeatures(this.vertices, {silent: true});
            }
        });

        this.targetListeners["line"] = function(layer) {
            // send an event that the line drawing has been completed
            me.finishedLineDrawing();
        };

        this.targetListeners["edit"] = function(layer) {
            // send an event that the polygon drawing has been completed
            me.finishedEditDrawing();
        };

        this.sourceLayer = new OpenLayers.Layer.Vector(this.prefix + "sourceLayer");
        this.targetLayer = new OpenLayers.Layer.Vector(this.prefix + "targetLayer",{
            eventListeners:  {
                "featuremodified": function(event) {
                    // Update adjacent polygons
                    this.redraw();
                }
            }
        });

        this.drawControls = {
            line: new OpenLayers.Control.DrawFeature(me.targetLayer, OpenLayers.Handler.Path),
            edit: new OpenLayers.Control.DrawFeature(me.targetLayer, OpenLayers.Handler.Polygon),
            selectFeature: new OpenLayers.Control.SelectFeature(me.targetLayer, {
                clickout: false, toggle: false,
                multiple: false, hover: false,
                box: false
            }),
            modifyFeature: new OpenLayers.Control.OskariModifyFeature(me.targetLayer, {
                clickout: false,
                toggle: false
            })
        };

        this._map.addLayers([me.sourceLayer,me.targetLayer]);

        for (var key in this.drawControls) {
            if (this.drawControls.hasOwnProperty(key)) {
                this._map.addControl(this.drawControls[key]);
            }
        }

        // Marker layer
        this.markerLayer = new OpenLayers.Layer.Markers(this.prefix + "MarkerLayer", {});
        this._map.addLayers([me.markerLayer]);

        this._updateLayerOrder();
    },

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
        this.sourceLayer.destroyFeatures();
        this.sourceLayer.styleMap = this.sourceStyleMaps[params.drawMode];
        this.sourceLayer.eventListeners = this.sourceListeners[params.drawMode];
        this.targetLayer.destroyFeatures();
        this.targetLayer.styleMap = this.targetStyleMaps[params.drawMode];
        this.markerLayer.clearMarkers();
        this.markers = [];
        this.activeMarker = null;
        this._updateLayerOrder();

        switch (params.drawMode) {
            case "point":
                this._pointSplit(params);
                break;
            case "line":
                this._lineSplit(params);
                break;
            case "edit":
                this._editSplit(params);
                break;
            case "remove":
                // Nothing to do
                break;
            default:
        }
    },

    _pointSplit: function(params) {
        var me = this;
        var i, x, y;
        this.toggleControl();
        this.startIndex = null;
        this.endIndex = null;
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
        for (i=0; i<linePoints.length; i++) {
            x = linePoints[i].x;
            y = linePoints[i].y;
            if (optimalExtent.contains(x,y)) {
                lonlat = new OpenLayers.LonLat(x,y);
                index = i;
                break;
            }
        }
        if (lonlat === null) {
            lonlat = new OpenLayers.LonLat(linePoints[0].x,linePoints[0].y);
            for (i=0; i<linePoints.length; i++) {
                x = linePoints[i].x;
                y = linePoints[i].y;
                if (extent.contains(x,y)) {
                    lonlat = new OpenLayers.LonLat(x,y);
                    index = i;
                    break;
                }
            }
        }
        var marker1 = new OpenLayers.Marker(lonlat,this.markerIcon.clone());
        marker1.index = index;
        marker1.events.register("mousedown", me, me._selectActiveBaseMarker);
        marker1.markerMouseOffset = new OpenLayers.LonLat(0, 0);

        // Search visible location for the second marker
        lonlat = null;
        for (i=linePoints.length-1; i>=0; i--) {
            x = linePoints[i].x;
            y = linePoints[i].y;
            if (optimalExtent.contains(x,y)) {
                lonlat = new OpenLayers.LonLat(x,y);
                index = i-1;
                break;
            }
        }
        if (lonlat === null) {
            lonlat = new OpenLayers.LonLat(linePoints[0].x,linePoints[0].y);
            for (i=linePoints-1; i>=0; i--) {
                x = linePoints[i].x;
                y = linePoints[i].y;
                if (extent.contains(x,y)) {
                    lonlat = new OpenLayers.LonLat(x,y);
                    index = i-1;
                    break;
                }
            }
        }
        var marker2 = new OpenLayers.Marker(lonlat,this.markerIcon.clone());
        marker2.index = index;
        marker2.events.register("mousedown", me, me._selectActiveBaseMarker);
        marker2.markerMouseOffset = new OpenLayers.LonLat(0, 0);

        this.markers.push(marker1);
        this.markers.push(marker2);

        this.markerLayer.addMarker(this.markers[0]);
        this.markerLayer.addMarker(this.markers[1]);

        // Set a high enough z-index value
        this._updateLayerOrder();

        // Update output layer
        this.updateTargetLine();
    },

    _lineSplit: function(params) {
        var me = this;
        var multiPolygon = params.sourceGeometry;
        this.targetLayer.events.register("featuresadded", this, this.targetListeners[params.drawMode]);
        this.sourceLayer.addFeatures([multiPolygon]);
        this.toggleControl(params.drawMode);
    },

    _editSplit: function(params) {
        var me = this;
        var multiPolygon = params.sourceGeometry;
        this.targetLayer.events.register("featuresadded", this, this.targetListeners[params.drawMode]);
        this.sourceLayer.addFeatures([multiPolygon]);
        this.toggleControl(params.drawMode);
    },

    _selectActiveBaseMarker: function (evt) {
        OpenLayers.Event.stop(evt);
        var me = this;
        var xy = this._map.events.getMousePosition(evt);
        var pixel = new OpenLayers.Pixel(xy.x, xy.y);
        var xyLonLat = this._map.getLonLatFromPixel(pixel);
        me.activeMarker = evt.object;
        me.activeMarker.markerMouseOffset.lon = xyLonLat.lon-me.activeMarker.lonlat.lon;
        me.activeMarker.markerMouseOffset.lat = xyLonLat.lat-me.activeMarker.lonlat.lat;
        me._map.events.register("mouseup", me, me.freezeActiveMarker);
        me._map.events.register("mousemove", me, me.moveActiveMarker);
    },

    /*
     * @method selectActiveMarker
     *
     * @param {} evt
     */
    selectActiveMarker: function (evt) {
        // Handle two point lines
        var lines = this.sourceLayer.features[0].geometry.components;
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].components.length === 2) {
                lines[i].components[0].short = i;
                lines[i].components[1].short = i;
                lines[i].components[0].shortLink = lines[i].components[1];
                lines[i].components[1].shortLink = lines[i].components[0];
            } else {
                lines[i].components[0].short = -1;
                lines[i].components[lines[i].components.length - 1].short = -1;
            }
        }
        this._selectActiveBaseMarker(evt);
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
        var projection = null;
        // Is marker provided with reference information
        if (typeof this.activeMarker.reference !== "undefined") {
            projection = this.activeMarkerReferenceProjection(lonlat);
        } else {
            projection = this.activeMarkerProjection(lonlat);
        }
        this.activeMarker.lonlat = projection.lonlat;
        this.activeMarker.index = projection.index;
        this.markerLayer.redraw();
        this.updateTargetLine();
    },

    pointProjection: function (q, p0, p1) {
        var dotProduct = function (a, b) {
            return a.x*b.x+a.y*b.y;
        };
        var a = p1.x-p0.x;
        var b = p1.y-p0.y;
        var c = q.x*(p1.x-p0.x)+q.y*(p1.y-p0.y);
        var d = p0.y-p1.y;
        var e = p1.x-p0.x;
        var f = p0.y*(p1.x-p0.x)-p0.x*(p1.y-p0.y);
        var pq = {
            x: -(c*e-b*f)/(b*d-a*e),
            y: (c*d-a*f)/(b*d-a*e)
        };

        // Check if inside the segment
        var p0p1 = {
            x: p1.x-p0.x,
            y: p1.y-p0.y
        };
        var pqp1 = {
            x: p1.x-pq.x,
            y: p1.y-pq.y
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

    activeMarkerReferenceProjection: function (refLonlat) {
        var me = this;
        var projection = {
            lonlat: null,
            p: [],
            p0: []
        };
        var point = {
            x: refLonlat.lon,
            y: refLonlat.lat
        };
        var projPoints = [];
        var distances = [];
        var segments = this.activeMarker.reference.segments;
        var minDistInd = 0;
        for (var i = 0; i < segments.polygons.length; i++) {
            for (var j = 0; j < segments.p[i].length; j++) {
                var sp = [segments.p[i][j][0], segments.p[i][j][1]];
                // Eliminate trivial cases
                if (!((sp[0].boundaryPoint) && (sp[1].boundaryPoint))) {
                    continue;
                }
                if ((typeof sp[0].shortLink !== "undefined") && (sp[0].shortLink.id === sp[1].id)) {
                    continue;
                }
                if ((typeof sp[1].shortLink !== "undefined") && (sp[1].shortLink.id === sp[0].id)) {
                    continue;
                }

                var p1 = {
                    x: sp[0].x,
                    y: sp[0].y,
                    closed: true
                };
                var p2 = {
                    x: sp[1].x,
                    y: sp[1].y,
                    closed: true
                };
                var activeMarkerPoint = me.activeMarker.reference.point.markerPoint;

                // Handle meeting pointers
                if ((sp[1].markerPoint !== activeMarkerPoint)) {
                    if ((sp[0].markerPoint >= 0) && (sp[0].markerPoint !== activeMarkerPoint)) {
                        p1.closed = false;
                    }
                }

                if ((sp[0].markerPoint !== activeMarkerPoint)) {
                    if ((sp[1].markerPoint >= 0) && (sp[1].markerPoint !== activeMarkerPoint)) {
                        p2.closed = false;
                    }
                }
                if ((!p1.closed) && (!p2.closed)) {
                    continue;
                }

                // Actual projection
                var projPoint = this.pointProjection(point, p1, p2);
                if (projPoint === null) {
                    continue;
                }
                projPoints.push(projPoint);
                var lastIndex = projPoints.length - 1;
                distances.push(this.getDistance(point, projPoints[lastIndex]));
                if ((distances[lastIndex] < distances[minDistInd]) || (projection.lonlat === null)) {
                    minDistInd = lastIndex;
                    projection.lonlat = new OpenLayers.LonLat(projPoints[minDistInd].x, projPoints[minDistInd].y);
                    if (j === 0) {
                        projection.p0 = [];
                        projection.p = [];
                    } else {
                        projection.p0 = segments.p[i][0];
                        projection.p = segments.p[i][j];
                    }
                }
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
        if (this.targetLayer) {
            this.targetLayer.destroyFeatures();
            this.targetLayer.redraw();
        }
        if (this.markerLayer) {
            this.markerLayer.clearMarkers();
            this.markerLayer.redraw();
        }
    },

    finishDrawFiltering: function () {
        var evtBuilder = this._sandbox.getEventBuilder('DrawFilterPlugin.FinishedDrawFilteringEvent');
        var event = evtBuilder(this.getFiltered(), this.editMode, this.creatorId);
        this._sandbox.notifyAll(event);
    },

    /**
     * Called when line drawing is finished.
     * Disables all draw controls
     * @method
     */
    finishedLineDrawing: function() {
        var me = this;
        this.toggleControl();
        // No manual feature additions anymore
        this.targetLayer.events.remove("featuresadded");
        var multiPolygon = this.sourceLayer.features[0].clone();
        var line = this.targetLayer.features[0].clone();
        this.sourceLayer.destroyFeatures();
        this.targetLayer.destroyFeatures();
        var newFeatures = this._splitGeometryByLine(multiPolygon,line);
        if ((newFeatures !== null)&&(newFeatures.length > 0)) {
            // Add split line
            // this.sourceLayer.addFeatures([newFeatures[1]]);
            // Add new polygons
            var polygons = newFeatures[0].geometry.components;
            for(var i=0; i<polygons.length; i++) {
                this.targetLayer.addFeatures([new OpenLayers.Feature.Vector(polygons[i])]);
            }
            this.drawControls.modifyFeature.activate();
            this.drawControls.modifyFeature.selectFeature(this.targetLayer.features[0]);
        }

        // Point added on the border line between two polygons
        this.targetLayer.events.register("vertexmodified", me, function(event) {
            var vertex = event.vertex;
            if (typeof vertex.references !== "undefined") {
                return;
            }
            // Update adjacent polygon if extra points added
            var i, j, ngbs = [], refs = [];
            var eventGeometry = event.feature.geometry;
            var linearRing = eventGeometry.components[0];
            for (i=1; i<linearRing.components.length-2; i++) {
                if (vertex.id === linearRing.components[i].id) {
                    ngbs = [linearRing.components[i-1].id,linearRing.components[i+1].id];
                    refs = linearRing.components[i-1].references;
                    break;
                }
            }
            var features = me.targetLayer.features;
            updatePolygon: for (i=1; i<features.length-1; i++) {
                var geometry = features[i].geometry;
                if (geometry.CLASS_NAME !== "OpenLayers.Geometry.Polygon") {
                    continue;
                }
                // Handle only relevant polygon
                if ((geometry.id === eventGeometry.id)||(refs.indexOf(geometry.id) < 0)) {
                    continue;
                }
                var points = geometry.components[0].components;
                for (j=0; j<points.length-2; j++) {
                    if ((ngbs.indexOf(points[j].id)>=0)&&(ngbs.indexOf(points[j+1].id)>=0)) {
                        vertex.references = [eventGeometry.id,geometry.id];
                        vertex.markerPoint = -1;
                        points.splice(j+1,0,vertex);
                        me.targetLayer.redraw();
                        break updatePolygon;
                    }
                }
            }
        });
        this._updateLayerOrder();
    },

    /**
     * Called when polygon drawing is finished.
     * Disables all draw controls
     * @method
     */
    finishedEditDrawing: function() {
        this.toggleControl();
        // No manual feature additions anymore
        this.targetLayer.events.remove("featuresadded");

        var inPolygon = this.targetLayer.features[0].clone();
        var outMultiPolygon = this.sourceLayer.features[0].clone();
        var polyComponents = outMultiPolygon.geometry.components;

        this.targetLayer.destroyFeatures();
        for (var i = 0; i < polyComponents.length; i++) {
            var outPolygon = polyComponents[i];
            var inside = true;
            // Is inside?
            for (var j = 0; j < inPolygon.geometry.components[0].components.length; j++) {
                if (!outPolygon.containsPoint(inPolygon.geometry.components[0].components[j])) {
                    inside = false;
                    break;
                }
            }
            if (!inside) {
                continue;
            }
            // Validity check
            if ((outPolygon.components[0].intersects(inPolygon.geometry.components[0])) || (this.checkSelfIntersection(inPolygon.geometry.components[0]))) {
                this.targetLayer.destroyFeatures(inPolygon);
                continue;
            }
            // Add references
            var inPoints = inPolygon.geometry.components[0].components;
            for (var k=0; k<inPoints.length; k++) {
                inPoints[k].references = [inPolygon.id,outPolygon.id];
            }
            // Create hole
            outPolygon.addComponent(inPolygon.geometry.components[0]);
            this.sourceLayer.destroyFeatures();
            this.targetLayer.addFeatures([inPolygon]);
            for (j = 0; j < polyComponents.length; j++) {
                var newFeature = new OpenLayers.Feature.Vector(polyComponents[j]);
                this.targetLayer.addFeatures([newFeature]);
            }
            break;
        }

        this.drawControls.modifyFeature.activate();
        this.drawControls.modifyFeature.selectFeature(this.targetLayer.features[0]);
        this.targetLayer.redraw();
    },

    /*
     * @method checkSelfIntersection
     *
     * @param {}
     */
    checkSelfIntersection: function (polygon) {
        var outer = polygon.components;
        var segments = [];
        for (var i = 1; i < outer.length; i++) {
            var segment = new OpenLayers.Geometry.LineString([outer[i - 1].clone(), outer[i].clone()]);
            segments.push(segment);
        }
        for (var j = 0; j < segments.length; j++) {
            if (this.segmentIntersects(segments[j], segments)) {
                return true;
            }
        }
        return false;
    },

    /*
     * @method segmentIntersects
     *
     * @param {}
     * @param {}
     */
    segmentIntersects: function (segment, segments) {
        for (var i = 0; i < segments.length; i++) {
            if (!segments[i].equals(segment)) {
                if ((segments[i].intersects(segment) && !this.startOrStopEquals(segments[i], segment))) {
                    return true;
                }
            }
        }
        return false;
    },

    /*
     * @method startOrStopEquals
     *
     * @param {}
     */
    startOrStopEquals: function (segment1, segment2) {
        if (segment1.components[0].equals(segment2.components[0])) {
            return true;
        }
        if (segment1.components[0].equals(segment2.components[1])) {
            return true;
        }
        if (segment1.components[1].equals(segment2.components[0])) {
            return true;
        }
        return (segment1.components[1].equals(segment2.components[1]));
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
        for (var key in this.drawControls) {
            if (this.drawControls.hasOwnProperty(key)) {
                var control = this.drawControls[key];
                if (drawMode === key) {
                    control.activate();
                } else {
                    control.deactivate();
                }
            }
        }
    },

    // Todo: split the split function
    _splitGeometryByLine: function(polygons, splitGeom) {
        var me = this;
        // Transform and scale coordinates
        var origin = new OpenLayers.Geometry.Point(0.0, 0.0);
        var reference = [polygons.geometry.components[0].components[0].components[0].x,
            polygons.geometry.components[0].components[0].components[0].y
        ];
        var scaleFactor = 10000.0;
        polygons.geometry.move(-reference[0], -reference[1]);
        polygons.geometry.resize(scaleFactor, origin);

        splitGeom.geometry.move(-reference[0], -reference[1]);
        splitGeom.geometry.resize(scaleFactor, origin);

        // OpenLayers variables
        var lineStyle = {
            strokeColor: '#0000ff',
            strokeOpacity: 1,
            strokeWidth: 2
        };
        var olOldFeatures = polygons.geometry.components.concat(splitGeom.geometry);
        var olNewFeatures = [new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon()),
            new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(), null, lineStyle)
        ];
        var olSolutionPolygons = olNewFeatures[0].geometry.components;
        var olSolutionLineStrings = olNewFeatures[1].geometry.components;
        var olNewPolygons = [];
        var olNewLineStrings = [];
        var olNewLineStringsTmp = [];
        var olPoint;
        var olPoints = [];
        var olHolePoints = [];
        var olEndPoints = [];
        var olLinearRingPoints = [];
        var olLinearRings;
        var olLineStringPoints = [];
        var olPolygon;

        // JSTS variables
        var jstsParser = new jsts.io.OpenLayersParser();
        var jstsPoints;
        var jstsOldPolygon;
        var jstsOldPolygons = [];
        var jstsNewPolygons = [];
        var jstsLine = null;

        // Clipper variables
        var clipPoint, clipPoints;
        var clipPolygon, clipHole;
        var clipValidationTarget = [];
        var clipSourcePolygons = [];
        var clipSubjectPolygons = [];
        var clipTargetPolygons = [];
        var clipSolutionPolygon, clipSolutionPolygons;
        var clipSolutionHoles;

        var cpr;
        var success;
        var clipType;

        var union = null;
        var polygonizer;

        var polygonIndexes = [];
        var pointIndexes = [];
        var sharedEdge = false;
        var crossRing = false;
        var found = false;
        var finished = false;

        var i, j, k, l, m, n, o, p;
        var lastIndex;
        var nextIndex;
        var foundIndex;

        var epsilon = 1.0e6; // about 10 cm x 10 cm

        // Scaling factor for integer operations
        var scale = 1;
        var marker;

        // IE8 compatibility
        this._enableIE8();

        // Input data
        // this._generateJSTSPolygons(olOldFeatures,olLinearRings,olPoints,clipSourcePolygons,clipHole,jstsOldPolygons,jstsOldPolygon,jstsLine,jstsParser,scale);

///
        for (i = olOldFeatures.length - 1; i >= 0; i--) {
            if (olOldFeatures[i].id.indexOf("Polygon") !== -1) {
                var multi = (olOldFeatures[i].id.indexOf("Multi") !== -1);
                if (!multi) {
                    jstsOldPolygon = jstsParser.read(olOldFeatures[i]);
                    if (!jstsOldPolygon.isValid()) {
                        return -1;
                    }
                    jstsOldPolygons.push(jstsOldPolygon);
                }

                finished = (m > 0);
                while (!finished) {
                    clipPolygon = new ClipperLib.Polygon();
                    if (multi) {
                        olLinearRings = olOldFeatures[i].components[m].components;
                    } else {
                        olLinearRings = olOldFeatures[i].components;
                    }
                    if (olLinearRings[0].getArea() >= 0.0) {
                        olPoints = olLinearRings[0].components;
                    } else {
                        olPoints = olLinearRings[0].components.reverse();
                    }
                    for (j = 0; j < olPoints.length - 1; j++) {
                        clipPoint = new ClipperLib.IntPoint(olPoints[j].x, olPoints[j].y);
                        clipPolygon.push(clipPoint);
                    }

                    l = clipSourcePolygons.length;
                    clipSourcePolygons[l] = [];
                    clipSourcePolygons[l].push(clipPolygon);
                    for (j = 1; j < olLinearRings.length; j++) {
                        clipHole = new ClipperLib.Polygon();
                        if (olLinearRings[j].getArea() <= 0.0) {
                            olPoints = olLinearRings[j].components;
                        } else {
                            olPoints = olLinearRings[j].components.reverse();
                        }
                        for (k = 0; k < olPoints.length - 1; k++) {
                            clipPoint = new ClipperLib.IntPoint(olPoints[k].x, olPoints[k].y);
                            clipHole.push(clipPoint);
                        }
                        clipSourcePolygons[l].push(clipHole);
                    }
                    // Scaling for integer operations
                    l = clipSourcePolygons.length - 1;
                    clipSourcePolygons[l] = this.scaleup(clipSourcePolygons[l], scale);
                    if (multi) {
                        m = m + 1;
                        if (m === olOldFeatures[i].components.length) {
                            finished = true;
                        }
                    } else {
                        finished = true;
                    }
                }
            } else if (olOldFeatures[i].id.indexOf("LineString") !== -1) {
                jstsLine = jstsParser.read(olOldFeatures[i]);
            }
        }
///

        // Splitting
        union = null;
        for (i = 0; i < jstsOldPolygons.length; i++) {
            if (jstsLine !== null) {
                union = jstsOldPolygons[i].getExteriorRing().union(jstsLine);
            } else {
                if (union === null) {
                    union = jstsOldPolygons[i].getExteriorRing();
                } else {
                    union = jstsOldPolygons[i].getExteriorRing().union(union);
                }
                if (i < jstsOldPolygons.length - 1) {
                    continue;
                }
            }
            polygonizer = new jsts.operation.polygonize.Polygonizer();
            polygonizer.add(union);
            jstsNewPolygons = polygonizer.getPolygons();

            clipPoints = [];
            olPoints = [];
            olNewLineStrings = [];
            for (j = 0; j < jstsNewPolygons.array.length; j++) {
                clipTargetPolygons = [];
                clipPolygon = new ClipperLib.Polygon();
                jstsPoints = jstsNewPolygons.array[j].shell.points;
                for (k = 0; k < jstsPoints.length - 1; k++) {
                    clipPoint = new ClipperLib.IntPoint(jstsPoints[k].x, jstsPoints[k].y);
                    clipPolygon.push(clipPoint);
                }
                clipTargetPolygons.push(clipPolygon);
                // Scaling for integer operations
                clipTargetPolygons = this.scaleup(clipTargetPolygons, scale);
                cpr = new ClipperLib.Clipper();
                for (k = 0; k < clipSourcePolygons.length; k++) {
                    cpr.AddPolygons(clipSourcePolygons[k], ClipperLib.PolyType.ptSubject);
                }
                cpr.AddPolygons(clipTargetPolygons, ClipperLib.PolyType.ptClip);

                clipSolutionPolygons = new ClipperLib.Polygons();
                clipType = ClipperLib.ClipType.ctIntersection;
                // Cut intersections
                success = cpr.Execute(clipType, clipSolutionPolygons);
                if (!success) {
                    return -2;
                }

                if (clipSolutionPolygons.length === 0) {
                    continue;
                }

                // Polygons to OpenLayers format
                polygonIndexes = [];
                olNewPolygons = [];
                sharedEdge = false;
                for (k = 0; k < clipSolutionPolygons.length; k++) {
                    // Jsts occasionally returns "empty" polygons
                    if (Math.abs(cpr.Area(clipSolutionPolygons[k])) < epsilon) continue;

                    clipValidationTarget.push(clipSolutionPolygons[k]);
                    if (cpr.Area(clipSolutionPolygons[k]) > 0) {
                        clipSolutionPolygon = clipSolutionPolygons[k];
                        olLinearRingPoints = [];
                        for (l = 0; l < clipSolutionPolygon.length; l++) {
                            clipPoint = clipSolutionPolygon[l];
                            foundIndex = -1;
                            for (m = 0; m < clipPoints.length; m++) {
                                if ((clipPoint.X === clipPoints[m].X) && (clipPoint.Y === clipPoints[m].Y)) {
                                    foundIndex = m;
                                    break;
                                }
                            }
                            if (foundIndex >= 0) {
                                olLinearRingPoints.push(olPoints[foundIndex]);
                            } else {
                                clipPoints.push(clipPoint);
                                olPoints.push(new OpenLayers.Geometry.Point(clipPoint.X / scale, clipPoint.Y / scale));
                                lastIndex = olPoints.length - 1;
                                olPoints[lastIndex].references = [];
                                olPoints[lastIndex].markerPoint = -1;
                                olPoints[lastIndex].boundaryPoint = false;
                                olPoints[lastIndex].short = -1;
                                olLinearRingPoints.push(olPoints[lastIndex]);
                            }
                        }
                        olNewPolygons.push(new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(olLinearRingPoints)));
                        lastIndex = olNewPolygons.length - 1;
                        for (l = 0; l < olNewPolygons[lastIndex].components[0].components.length - 1; l++) {
                            olNewPolygons[lastIndex].components[0].components[l].references.push(olNewPolygons[lastIndex].id);
                        }
                        polygonIndexes.push(k);
                    }
                }

                // Holes to OpenLayers format
                for (k = 0; k < clipSolutionPolygons.length; k++) {
                    if (cpr.Area(clipSolutionPolygons[k]) < 0.0) {
                        clipTargetPolygons = [];
                        clipTargetPolygons.push(clipSolutionPolygons[k]);
                        for (l = 0; l < polygonIndexes.length; l++) {

                            // Check which polygon contains the hole
                            cpr = new ClipperLib.Clipper();
                            clipSubjectPolygons = [];
                            clipSubjectPolygons.push(clipSolutionPolygons[polygonIndexes[l]]);
                            cpr.AddPolygons(clipSubjectPolygons, ClipperLib.PolyType.ptSubject);
                            cpr.AddPolygons(clipTargetPolygons, ClipperLib.PolyType.ptClip);
                            clipSolutionHoles = new ClipperLib.Polygons();
                            clipType = ClipperLib.ClipType.ctIntersection;
                            success = cpr.Execute(clipType, clipSolutionHoles);
                            if (!success) {
                                return -3;
                            }

                            if (clipSolutionHoles.length > 0) {
                                clipHole = clipSolutionPolygons[k];
                                olHolePoints = [];
                                for (m = 0; m < clipHole.length; m++) {
                                    clipPoint = clipHole[m];
                                    olHolePoints.push(new OpenLayers.Geometry.Point(clipPoint.X / scale, clipPoint.Y / scale));
                                }
                                olNewPolygons[l].components.push(new OpenLayers.Geometry.LinearRing(olHolePoints));
                                break;
                            }
                        }
                    }
                }
                for (k = 0; k < olNewPolygons.length; k++) {
                    olSolutionPolygons.push(olNewPolygons[k]);
                }
            }
        }

        // Inverse transform and scale
        olPoints = olNewFeatures[0].geometry.getVertices();
        pointIndexes = [];
        for (i = 0; i < olPoints.length; i++) {
            if (pointIndexes.indexOf(olPoints[i].id) < 0) {
                // olPoint not handled yet
                olPoints[i].x = olPoints[i].x / scaleFactor + reference[0];
                olPoints[i].y = olPoints[i].y / scaleFactor + reference[1];
                pointIndexes.push(olPoints[i].id);
            }
        }

        // Lines to OpenLayers format
        for (i = 0; i < olSolutionPolygons.length; i++) {
            olPoints = olSolutionPolygons[i].components[0].components;
            sharedEdge = (olPoints[0].references.length > 1);
            crossRing = sharedEdge;
            olLineStringPoints = [];
            olNewLineStringsTmp = [];
            if (sharedEdge) {
                olLineStringPoints.push(olPoints[0]);
            }
            for (j = 1; j < olPoints.length - 1; j++) {
                if (!this.equalArrays(olPoints[j].references, olPoints[j - 1].references)) {
                    if (sharedEdge) {
                        if (olPoints[j].references.length > 2) olLineStringPoints.push(olPoints[j]);
                        olNewLineStringsTmp.push(new OpenLayers.Geometry.LineString(olLineStringPoints));
                        olLineStringPoints = [];
                    }
                }
                sharedEdge = (olPoints[j].references.length > 1);
                if (sharedEdge) {
                    olLineStringPoints.push(olPoints[j]);
                }
            }
            if (sharedEdge) {
                if ((crossRing) && (olNewLineStringsTmp.length > 0) && (this.equalArrays(olPoints[olPoints.length - 2].references, olPoints[0].references))) {
                    for (j = olLineStringPoints.length - 1; j >= 0; j--) {
                        olNewLineStringsTmp[0].components.splice(0, 0, olLineStringPoints[j]);
                    }
                } else {
                    if (olPoints[0].references.length > 2) olLineStringPoints.push(olPoints[0]);
                    olNewLineStringsTmp.push(new OpenLayers.Geometry.LineString(olLineStringPoints));
                }
            }
            for (j = 0; j < olNewLineStringsTmp.length; j++) {
                olNewLineStrings.push(olNewLineStringsTmp[j]);
            }
        }

        lineStringLoop: for (k = 0; k < olNewLineStrings.length; k++) {
            // Check for duplicates
            for (l = 0; l < olSolutionLineStrings.length; l++) {
                for (m = 0; m < olNewLineStrings[k].components.length; m++) {
                    olPoint = olNewLineStrings[k].components[m];
                    found = false;
                    for (n = 0; n < olSolutionLineStrings[l].components.length; n++) {
                        if (olPoint.id === olSolutionLineStrings[l].components[n].id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found) {
                        break;
                    }
                }
                if (found) {
                    continue lineStringLoop;
                }
            }
            nextIndex = olEndPoints.length;
            lastIndex = olNewLineStrings[k].components.length - 1;
            olEndPoints[nextIndex] = [olNewLineStrings[k].components[0], olNewLineStrings[k].components[lastIndex]];
            // Fixed endpoints
            olEndPoints[nextIndex][0].x0 = olEndPoints[nextIndex][0].x;
            olEndPoints[nextIndex][0].y0 = olEndPoints[nextIndex][0].y;
            olEndPoints[nextIndex][1].x0 = olEndPoints[nextIndex][1].x;
            olEndPoints[nextIndex][1].y0 = olEndPoints[nextIndex][1].y;
            olSolutionLineStrings.push(olNewLineStrings[k]);
        }

        for (k = 0; k < olSolutionLineStrings.length; k++) {
            // Markers
            intersections: for (l = 0; l < 2; l++) {
                if (olEndPoints[k][l].references.length !== 2) continue;
                // Check for duplicates
                for (m = 0; m < this.markerLayer.markers.length; m++) {
                    if (this.markerLayer.markers[m].reference.point.id === olEndPoints[k][l].id) {
                        continue intersections;
                    }
                }
                olEndPoints[k][l].lineId = olSolutionLineStrings[k].id;
                marker = new OpenLayers.Marker(new OpenLayers.LonLat(olEndPoints[k][l].x, olEndPoints[k][l].y), this.markerIcon.clone());
                marker.reference = {
                    point: olEndPoints[k][l],
                    line: k,
                    lineId: olSolutionLineStrings[k].id,
                    segments: {
                        polygons: [],
                        p: []
                    }
                };

                olEndPoints[k][l].markerPoint = this.markerLayer.markers.length + 1;

                // References
                marker.markerMouseOffset = new OpenLayers.LonLat(0, 0);
                for (m = 0; m < olEndPoints[k][l].references.length; m++) {
                    for (n = 0; n < olSolutionPolygons.length; n++) {
                        if (olEndPoints[k][l].references[m] === olSolutionPolygons[n].id) {
                            olPolygon = olSolutionPolygons[n];
                            olPoints = olPolygon.components[0].components;
                            for (o = 0; o < olPoints.length - 1; o++) {
                                if (olPoints[o].id === marker.reference.point.id) {
                                    if (o === 0) {
                                        lastIndex = olPoints.length - 2;
                                    } else {
                                        lastIndex = o - 1;
                                    }
                                    olPoint = olPoints[lastIndex];
                                    sharedEdge = false;
                                    for (p = 0; p < olPoint.references.length; p++) {
                                        if (olPoint.references[p] !== olSolutionPolygons[n].id) {
                                            found = false;
                                            endPoints: for (i = 0; i < olEndPoints.length; i++) {
                                                for (j = 0; j < 2; j++) {
                                                    if (olEndPoints[i][j].id === olPoint.id) {
                                                        if (olEndPoints[i][j].references.length !== 2) {
                                                            continue;
                                                        }
                                                        if ((olSolutionLineStrings[k].components.length === 2) && (this.equalArrays(olPoints[o].references, olPoint.references))) {
                                                            continue;
                                                        }
                                                        found = true;
                                                        break endPoints;
                                                    }
                                                }
                                            }
                                            if (!found) {
                                                sharedEdge = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (sharedEdge) {
                                        sharedEdge = false;
                                        if (o === olPoints.length - 1) {
                                            lastIndex = 0;
                                        } else {
                                            lastIndex = o + 1;
                                        }
                                        olPoint = olPoints[lastIndex];
                                        for (p = 0; p < olPoint.references.length; p++) {
                                            if (olPoint.references[p] !== olSolutionPolygons[n].id) {
                                                endPoints:
                                                for (i = 0; i < olEndPoints.length; i++) {
                                                    for (j = 0; j < 2; j++) {
                                                        if (olEndPoints[i][j].id === olPoint.id) {
                                                            if (olEndPoints[i][j].references.length !== 2) {
                                                                continue;
                                                            }
                                                            if ((olSolutionLineStrings[k].components.length === 2) && (this.equalArrays(olPoints[o].references, olPoint.references))) {
                                                                continue;
                                                            }
                                                            found = true;
                                                            break endPoints;
                                                        }
                                                    }
                                                }
                                                if (!found) {
                                                    sharedEdge = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if (!sharedEdge) {
                                        marker.reference.segments.polygons.push(olPolygon.id);
                                        var refSegments = [
                                            []
                                        ];
                                        refSegments[0][0] = olPoints[o];
                                        refSegments[0][1] = olPoints[lastIndex];
                                        var inds = (o < lastIndex) ? [o, lastIndex] : [lastIndex, o];
                                        // Adjacent marker segments
                                        refSegments.push([(inds[0] > 0) ? olPoints[inds[0] - 1] : olPoints[olPoints.length - 2], olPoints[inds[0]]]);
                                        refSegments.push([(inds[1] < olPoints.length - 1) ? olPoints[inds[1] + 1] : olPoints[0], olPoints[inds[1]]]);
                                        marker.reference.segments.p.push(refSegments);
                                    }
                                }
                            }
                            break;
                        }
                    }
                }
                marker.events.register("mousedown", me, me.selectActiveMarker);
                this.markerLayer.addMarker(marker);
            }
        }


        // Update boundary info
        for (i = 0; i < olNewFeatures[0].geometry.components.length; i++) {
            var olNewPoints = olNewFeatures[0].geometry.components[i].components[0].components;
            for (j = 0; j < olNewPoints.length; j++) {
                if ((olNewPoints[j].references.length === 1) || (olNewPoints[j].markerPoint >= 0)) {
                    olNewPoints[j].boundaryPoint = true;
                }
            }
        }
        return olNewFeatures;
    },

    _enableIE8: function() {
        // IE8 compatibility
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (elt /*, from*/ ) {
                var len = this.length >>> 0;

                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                if (from < 0) {
                    from += len;
                }
                for (; from < len; from++) {
                    if (from in this &&
                        this[from] === elt)
                        return from;
                }
                return -1;
            };
        }
        // From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
        // Production steps of ECMA-262, Edition 5, 15.4.4.18
        // Reference: http://es5.github.com/#x15.4.4.18
        if (!Array.prototype.forEach) {

            Array.prototype.forEach = function forEach(callback, thisArg) {
                'use strict';
                var T, k;

                if (this === null) {
                    throw new TypeError("this is null or not defined");
                }

                var kValue,
                    // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
                    O = Object(this),

                    // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
                    // 3. Let len be ToUint32(lenValue).
                    len = O.length >>> 0; // Hack to convert O.length to a UInt32

                // 4. If IsCallable(callback) is false, throw a TypeError exception.
                // See: http://es5.github.com/#x9.11
                if ({}.toString.call(callback) !== "[object Function]") {
                    throw new TypeError(callback + " is not a function");
                }

                // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
                if (arguments.length >= 2) {
                    T = thisArg;
                }

                // 6. Let k be 0
                k = 0;

                // 7. Repeat, while k < len
                while (k < len) {

                    // a. Let Pk be ToString(k).
                    //   This is implicit for LHS operands of the in operator
                    // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                    //   This step can be combined with c
                    // c. If kPresent is true, then
                    if (k in O) {

                        // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                        kValue = O[k];

                        // ii. Call the Call internal method of callback with T as the this value and
                        // argument list containing kValue, k, and O.
                        callback.call(T, kValue, k, O);
                    }
                    // d. Increase k by 1.
                    k++;
                }
                // 8. return undefined
            };
        }
    },

    /*
     * @method scaleup
     *
     * @param {} poly
     * @param {} scale
     * @return {} returns scaled integer-valued polygon
     */
    scaleup: function (poly, scale) {
        var i, j;
        if (!scale) {
            scale = 1;
        }
        for (i = 0; i < poly.length; i++) {
            for (j = 0; j < poly[i].length; j++) {
                poly[i][j].X = Math.floor(poly[i][j].X * scale);
                poly[i][j].Y = Math.floor(poly[i][j].Y * scale);
            }
        }
        return poly;
    },

    /*
     * @method equalArrays
     *
     * @param {}
     * @param {}
     */
    equalArrays: function (array1, array2) {
        var temp = [];
        var key;
        var i;
        if ((!array1[0]) || (!array2[0])) {
            return false;
        }
        if (array1.length !== array2.length) {
            return false;
        }
        for (i = 0; i < array1.length; i++) {
            key = (typeof array1[i]) + "~" + array1[i];
            if (temp[key]) {
                temp[key]++;
            } else {
                temp[key] = 1;
            }
        }
        for (i = 0; i < array2.length; i++) {
            key = (typeof array2[i]) + "~" + array2[i];
            if (temp[key]) {
                if (temp[key] === 0) {
                    return false;
                } else {
                    temp[key]--;
                }
            } else {
                return false;
            }
        }
        return true;
    },

    updateTargetLine: function() {
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
            this.targetLayer.features[0].geometry.components[0].x = markerData[0].x;
            this.targetLayer.features[0].geometry.components[0].y = markerData[0].y;
            var lastIndex = this.targetLayer.features[0].geometry.components.length-1;
            this.targetLayer.features[0].geometry.components[lastIndex].x = markerData[1].x;
            this.targetLayer.features[0].geometry.components[lastIndex].y = markerData[1].y;
            this.targetLayer.redraw();
            return;
        }
        this.startIndex = markerData[0].index;
        this.endIndex = markerData[1].index;
        // Create a new selected feature
        var points = [];
        points.push(new OpenLayers.Geometry.Point(markerData[0].x,markerData[0].y));
        for (var i = markerData[0].index+1; i<=markerData[1].index; i++) {
            points.push(this.sourceLayer.features[0].geometry.components[i].clone());
        }
        points.push(new OpenLayers.Geometry.Point(markerData[1].x,markerData[1].y));
        var newTarget = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString(points));
        this.targetLayer.destroyFeatures();
        this.targetLayer.addFeatures([newTarget]);
        this.targetLayer.redraw();
    },


    getFiltered: function() {
        if (this.targetLayer.features.length === 0) {
            return null;
        }
        var selectedFeatures = this.targetLayer.selectedFeatures;
        if (selectedFeatures.length > 0) {
            return selectedFeatures[0].geometry.clone();
        } else {
            return this.targetLayer.features[0].geometry.clone();
        }
    },

    _updateLayerOrder: function() {
        var zIndex = Math.max(this._map.Z_INDEX_BASE.Feature,this.sourceLayer.getZIndex())+1;
        this.sourceLayer.setZIndex(zIndex);
        this.sourceLayer.redraw();
        zIndex = zIndex+1;
        this.targetLayer.setZIndex(zIndex);
        this.targetLayer.redraw();
        zIndex = zIndex+1;
        this.markerLayer.setZIndex(zIndex);
        this.markerLayer.redraw();
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

    isSharedEdge: function(point) {
        if (point.references === null){
            return false;
        }
        if (typeof point.references === "undefined"){
            return false;
        }
        if ((typeof point.markerPoint !== "undefined")&&(point.markerPoint >= 0)) {
            return false;
        }
        return point.references.length >= 2;
    },

    /**
     * @method _enableGfi
     * Enables/disables the gfi functionality
     * @param {Boolean} blnEnable true to enable, false to disable
     */
    _enableGfi : function(blnEnable) {
        var gfiReqBuilder = this._sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
        if(gfiReqBuilder) {
            this._sandbox.request(this.getName(), gfiReqBuilder(blnEnable));
        }
    },

    register: function () {

    },

    unregister: function () {},

    startPlugin: function (sandbox) {
        var me = this;
        this._sandbox = sandbox;
        sandbox.register(this);
        sandbox.addRequestHandler('DrawFilterPlugin.StartDrawFilteringRequest', this.requestHandlers.startDrawFilteringHandler);
        sandbox.addRequestHandler('DrawFilterPlugin.StopDrawFilteringRequest', this.requestHandlers.stopDrawFilteringHandler);
        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me._sandbox.registerForEventByName(me, p);
            }
        }
        this._enableGfi(false);
    },
    stopPlugin: function (sandbox) {
        var me = this;
        this.toggleControl();

        if (this.sourceLayer) {
            this.sourceLayer.destroyFeatures();
            this._map.removeLayer(this.sourceLayer);
            this.sourceLayer = undefined;
        }

        if (this.targetLayer) {
            this.targetLayer.destroyFeatures();
            this._map.removeLayer(this.targetLayer);
            this.targetLayer = undefined;
        }

        if (this.markerLayer) {
            this.markerLayer.clearMarkers();
            this._map.removeLayer(this.markerLayer);
            this.markerLayer = undefined;
        }

        for (var p in me.eventHandlers) {
            if (me.eventHandlers.hasOwnProperty(p)) {
                me._sandbox.unregisterFromEventByName(me, p);
            }
        }

        sandbox.removeRequestHandler('DrawFilterPlugin.StartDrawFilteringRequest', this.requestHandlers.startDrawFilteringHandler);
        sandbox.removeRequestHandler('DrawFilterPlugin.StopDrawFilteringRequest', this.requestHandlers.stopDrawFilteringHandler);

        this._enableGfi(true);
        sandbox.unregister(this);

        this._sandbox = null;
    },

    /* @method start
     * called from sandbox
     */
    start: function (sandbox) {
    },

    /**
     * @method stop
     * called from sandbox
     *
     */
    stop: function (sandbox) {
    },
    /**
     * @property {Object} eventHandlers
     * @static
     */
    eventHandlers: {
        'AfterMapMoveEvent': function (event) {
            this._updateLayerOrder();
        }
    },

    /**
     * @method onEvent
     * Event is handled forwarded to correct #eventHandlers if found or discarded
     * if not.
     * @param {Oskari.mapframework.event.Event} event a Oskari event object
     */
    onEvent: function (event) {
        return this.eventHandlers[event.getName()].apply(this, [event]);
    }
}, {
    'protocol': ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.GeometryEditor.Plugin"]
});
