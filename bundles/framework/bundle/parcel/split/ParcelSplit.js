/**
 * @class Oskari.mapframework.bundle.parcel.split.ParcelSplit
 *
 * Provides tools to split parcel.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.parcel.split.ParcelSplit',

/**
 * @method create called automatically on construction
 * @static
 * @param {} drawPlugin
 *          Plugin provides other elements for use if required by this class.
 */
function(drawPlugin) {
    // Class constructor initializes variables here.
    // Plugin provides other elements for use if required by this class.

   /**
    * @property drawPlugin
    *
    *
    */
    this.drawPlugin = drawPlugin;

   /**
    * @property intersectionPoints
    *
    *
    */
    this.intersectionPoints = [];

   /**
    * @property markerSize
    *
    *
    */
    this.markerSize = new OpenLayers.Size(21,25);

   /**
    * @property markerOffset
    *
    *
    */
    this.markerOffset = new OpenLayers.Pixel(-(this.markerSize.w/2), -this.markerSize.h);

   /**
    * @property markerIcon
    *
    *
    */
    this.markerIcon = new OpenLayers.Icon('/Oskari/resources/parcel/images/marker.png',this.markerSize,this.markerOffset);

   /**
    * @property splitPolygons
    *
    *
    */
    this.splitPolygons = [];

   /**
    * @property map
    *
    *
    */
    this.map = this.drawPlugin.getMapModule().getMap();

   /**
    * @property map.activeMarker
    *
    *
    */
    this.map.activeMarker = null;

}, {

    // Class functions and objects are defined here.
    // Items that are meant for private use only have _ prefix.

    /**
     * @method init
     *
     * Initializations to be called after construction.
     */
    init : function() {
    },

    /**
     * @method split
     *
     * Splits the parcel.
     * 
     * {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance provides the features that are used for the splitting.
     */
    split : function(trivial) {
    	var me = this;
        if (this.drawPlugin.splitSelection) return;

        var parcelLayer = this.drawPlugin.drawLayer;
        var editLayer = this.drawPlugin.editLayer;

        this.map.moveActiveMarker = function(evt) {
            var lonlat = this.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y));
            lonlat.lon -= this.activeMarker.markerMouseOffset.lon;
            lonlat.lat -= this.activeMarker.markerMouseOffset.lat;

            var projection = this.activeMarkerProjection(lonlat);
            this.activeMarker.lonlat = projection.lonlat;
            this.activeMarker.reference.point.x = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.x0 = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.y = this.activeMarker.lonlat.lat;
            this.activeMarker.reference.point.y0 = this.activeMarker.lonlat.lat;

            if (projection.p.length > 0) me.updatePolygons(projection.p,projection.p0);

            editLayer.updateLine();
            editLayer.redraw();
            parcelLayer.redraw();
            me.drawPlugin.updateInfobox();
 
            this.getLayersByName("Parcel Markers Layer")[0].redraw();
            OpenLayers.Event.stop(evt);
        };

        this.map.freezeActiveMarker = function(evt) {
            this.events.unregister("mousemove",this,this.moveActiveMarker);
            this.events.unregister("mouseup",this,this.freezeActiveMarker);
            OpenLayers.Event.stop(evt);

            var lonlat = this.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y));
            lonlat.lon -= this.activeMarker.markerMouseOffset.lon;
            lonlat.lat -= this.activeMarker.markerMouseOffset.lat;

            var projection = this.activeMarkerProjection(lonlat);
            this.activeMarker.lonlat = projection.lonlat;
            this.activeMarker.reference.point.x = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.x0 = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.y = this.activeMarker.lonlat.lat;
            this.activeMarker.reference.point.y0 = this.activeMarker.lonlat.lat;

            editLayer.updateLine();
            editLayer.redraw();
            parcelLayer.redraw();
            me.drawPlugin.updateInfobox();

            // Reproduce the original OL 2.12 behaviour
            jQuery('svg').find('circle').css('cursor', 'move');
            jQuery('div.olMapViewport').find('oval').css('cursor', 'move'); // IE8
        };

        this.map.pointProjection = function(q,p0,p1) {
            var dotProduct  = function(a,b) {
                return a.x*b.x+ a.y*b.y;
            };

            var a = p1.x-p0.x;
            var b = p1.y-p0.y;
            var c = q.x*(p1.x-p0.x)+q.y*(p1.y-p0.y);
            var d = p0.y-p1.y;
            var e = p1.x-p0.x;
            var f = p0.y*(p1.x-p0.x)-p0.x*(p1.y-p0.y);
            var pq = {x:-(c*e-b*f)/(b*d-a*e), y:(c*d-a*f)/(b*d-a*e)};

            // Check if inside the segment
            var p0p1 = {x:p1.x-p0.x, y:p1.y-p0.y};
            var pqp1 = {x:p1.x-pq.x, y:p1.y-pq.y};
            var dp = dotProduct(p0p1,pqp1);
            var l =  dotProduct(p0p1,p0p1);
            if (dp < 0) {
                pq.x = p1.x;
                pq.y = p1.y;
            } else if (dp > l) {
                pq.x = p0.x;
                pq.y = p0.y;
            }
            // Denominator zero:
            if ((isNaN(pq.x))||(isNaN(pq.y))) return p0;
            return pq;
       };

        this.map.distance = function(p1,p2) {
            var x1;
            var isNumber = function isNumber(n) {
                return (!isNaN(parseFloat(n)))&&(isFinite(n));
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
            return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
        };


        this.map.activeMarkerProjection  = function(refLonlat) {
            var projection = {
                lonlat : null,
                p : [],
                p0 : []
            };
            var parcelLayer = this.getLayersByName("Parcel Draw Layer")[0];
            //var activeMarker = me.map.activeMarker;
            var point = {x: refLonlat.lon, y: refLonlat.lat};
            var projPoints = [];
            var distances = [];
            var segments = this.activeMarker.reference.segments;
            var minDistInd = 0;
            for (var i = 0; i < segments.polygons.length; i++) {
                for (var j = 0; j < segments.p[i].length; j++) {
                    var sp = [segments.p[i][j][0],segments.p[i][j][1]];
                    if (!((sp[0].boundaryPoint)&&(sp[1].boundaryPoint))) continue;
                    var p1 = {x: sp[0].x, y: sp[0].y};
                    var p2 = {x: sp[1].x, y: sp[1].y};
                    projPoints.push(this.pointProjection(point,p1,p2));
                    var lastIndex = projPoints.length-1;
                    distances.push(this.distance(point,projPoints[lastIndex]));
                    if ((distances[lastIndex] < distances[minDistInd])||(projection.lonlat === null)) {
                        minDistInd = lastIndex;
                        projection.lonlat = new OpenLayers.LonLat(projPoints[minDistInd].x,projPoints[minDistInd].y);
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
        };

        this.drawPlugin.splitSelection = true;
        var baseMultiPolygon = parcelLayer.features[0];
        if (baseMultiPolygon.geometry.CLASS_NAME !== "OpenLayers.Geometry.MultiPolygon") return;
        this.drawPlugin.backupFeatures = [baseMultiPolygon.clone()];

        // Trivial split
        if (trivial) {
            var polygons = this.drawPlugin.backupFeatures[0].geometry.components;
            this.drawPlugin.drawLayer.removeAllFeatures();
            this.drawPlugin.editLayer.removeAllFeatures();
            for (var i = 0; i < polygons.length; i++) {
                this.drawPlugin.drawLayer.addFeatures(new OpenLayers.Feature.Vector(this.drawPlugin.backupFeatures[0].geometry.components[i]));
                this.drawPlugin.drawLayer.features[i].style = this.drawPlugin.basicStyle;
            }
            this.drawPlugin.drawLayer.features[0].style = this.drawPlugin.selectStyle;
            this.drawPlugin.selectedFeature = 0;
            parcelLayer.redraw();
            editLayer.redraw();
            return null;
        }

        var featureInd = parcelLayer.features.length-1;
        if (featureInd < 1) return;
        var operatingFeature = parcelLayer.features[featureInd];

        switch (operatingFeature.geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Polygon":
                this.splitHole(baseMultiPolygon,operatingFeature);
                break;
            case "OpenLayers.Geometry.LineString":
                var newFeatures = this.splitLine(baseMultiPolygon,operatingFeature);
                this.drawPlugin.drawLayer.removeAllFeatures();
                for (var i = 0; i < newFeatures[0].geometry.components.length; i++) {
                    this.drawPlugin.drawLayer.addFeatures(new OpenLayers.Feature.Vector(newFeatures[0].geometry.components[i]));
                    this.drawPlugin.drawLayer.features[i].style = this.drawPlugin.basicStyle;
                }
                this.drawPlugin.editLayer.addFeatures(newFeatures[1]);
                break;
        }
        OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
        this.drawPlugin.drawLayer.features[0].style = this.drawPlugin.selectStyle;
        this.drawPlugin.selectedFeature = 0;
        parcelLayer.redraw();
        editLayer.redraw();
        return editLayer.features[0];
    },

    /*
     * @method splitHole
     *
     * @param {} outPolygon
     * @param {} inPolygon
     */
    splitHole : function(outPolygons,inPolygon) {
        var parcelLayer = this.drawPlugin.drawLayer;
        var editLayer = this.drawPlugin.editLayer;
        var polyComponents = outPolygons.geometry.components;

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
            if (!inside) continue;

            // Validity check
            if ((outPolygon.components[0].intersects(inPolygon.geometry.components[0]))
            ||(this.checkSelfIntersection(inPolygon.geometry.components[0]))) {
                parcelLayer.destroyFeatures(inPolygon);
                continue;
            }

            outPolygon.addComponent(inPolygon.geometry.components[0]);
            parcelLayer.removeAllFeatures();
            for (j = 0; j < polyComponents.length; j++) {
                var newFeature = new OpenLayers.Feature.Vector(polyComponents[j]);
                newFeature.style = this.drawPlugin.basicStyle;
                parcelLayer.addFeatures([newFeature]);
            }
            inPolygon.style = this.drawPlugin.basicStyle;
            parcelLayer.addFeatures([inPolygon]);

            var editPoints = inPolygon.geometry.components[0].components;
            var editFeature = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString([new OpenLayers.Geometry.LineString(editPoints)]));
            editFeature.numPoints = editPoints.length;
            editLayer.addFeatures([editFeature]);

            break;
        }
    },


        /*
         * @method scaleup
         *
         * @param {} poly
         * @param {} scale
         * @return {} returns scaled integer-valued polygon
         */
        scaleup : function(poly, scale) {
            var i, j;
            if (!scale) scale = 1;
            for(i = 0; i < poly.length; i++) {
                for(j = 0; j < poly[i].length; j++) {
                  poly[i][j].X = Math.floor(poly[i][j].X*scale);
                  poly[i][j].Y = Math.floor(poly[i][j].Y*scale);
                }
            }
            return poly;
        },

        /*
         * @method splitLine
         *
         * @param {} polygon
         * @param {} line
         * @return {}
         */
        splitLine : function(polygons,line) {
            // Transform and scale coordinates
            var origin = new OpenLayers.Geometry.Point(0.0, 0.0);
            var reference = [polygons.geometry.components[0].components[0].components[0].x,
                             polygons.geometry.components[0].components[0].components[0].y];
            var scaleFactor = 10000.0;
            polygons.geometry.move(-reference[0],-reference[1]);
            polygons.geometry.resize(scaleFactor,origin);
            line.geometry.move(-reference[0],-reference[1]);
            line.geometry.resize(scaleFactor,origin);

            // OpenLayers variables
            var lineStyle = { strokeColor: '#0000ff', strokeOpacity: 1, strokeWidth: 2};
            var olOldFeatures = polygons.geometry.components.concat(line.geometry);
            var olNewFeatures = [new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon()),
                                 new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(),null,lineStyle)];
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
            var olLineString;
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
            // var clipValidationSource;
            // var clipValidationResult;
            var clipSourcePolygons = [];
            var clipSubjectPolygons = [];
            var clipTargetPolygons = [];
            var clipSolutionPolygon, clipSolutionPolygons;
            var clipSolutionHoles;

            var cpr;
            var success;
            var clipType;

            var union;
            var polygonizer;

            var polygonIndexes = [];
            var pointIndexes = [];
            var sharedEdge = false;
            var crossRing = false;
            var found = false;

            var i, j, k, l, m, n, o, p;
            var lastIndex;
            var nextIndex;
            var foundIndex;

            var epsilon = 1.0e6; // about 10 cm x 10 cm

            // Scaling factor for integer operations
            var scale = 1;
            var marker;
            var logText = "";

            // IE8 compatibility
            if (!Array.prototype.indexOf) {
                Array.prototype.indexOf = function (elt /*, from*/) {
                    var len = this.length >>> 0;

                    var from = Number(arguments[1]) || 0;
                    from = (from < 0)
                        ? Math.ceil(from)
                        : Math.floor(from);
                    if (from < 0)
                        from += len;

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

                    if (this == null) {
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

            // Input data
            for (i=0; i<olOldFeatures.length; i++) {
                if (olOldFeatures[i].id.indexOf("Polygon") !== -1) {
                    jstsOldPolygon = jstsParser.read(olOldFeatures[i]);
                    if (!jstsOldPolygon.isValid()) {
                        //console.log("Invalid geometry.");
                        return -1+logText;
                    }
                    jstsOldPolygons.push(jstsOldPolygon);
                    clipPolygon = new ClipperLib.Polygon();
                    olLinearRings = olOldFeatures[i].components;
                    if (olLinearRings[0].getArea() >= 0.0) {
                        olPoints = olLinearRings[0].components;
                    } else {
                        olPoints = olLinearRings[0].components.reverse();
                    }
                    for (j=0; j<olPoints.length-1; j++) {
                        clipPoint = new ClipperLib.IntPoint(olPoints[j].x, olPoints[j].y);
                        clipPolygon.push(clipPoint);
                    }
                    l = clipSourcePolygons.length;
                    clipSourcePolygons[l] = [];
                    clipSourcePolygons[l].push(clipPolygon);
                    for (j=1; j<olLinearRings.length; j++) {
                        clipHole = new ClipperLib.Polygon();
                        if (olLinearRings[j].getArea() <= 0.0) {
                            olPoints = olLinearRings[j].components;
                        } else {
                            olPoints = olLinearRings[j].components.reverse();
                        }
                        for(k=0; k<olPoints.length-1; k++) {
                            clipPoint = new ClipperLib.IntPoint(olPoints[k].x, olPoints[k].y);
                            clipHole.push(clipPoint);
                        }
                        clipSourcePolygons[i].push(clipHole);
                    }
                    // Scaling for integer operations
                    l = clipSourcePolygons.length-1;
                    clipSourcePolygons[l] = this.scaleup(clipSourcePolygons[l], scale);
                } else if (olOldFeatures[i].id.indexOf("LineString") !== -1) {
                    jstsLine = jstsParser.read(olOldFeatures[i]);
                }
            }

            // Debugging info
            logText += " olOldFeatures ";
            logText += olOldFeatures;
            logText += " clipSourcePolygons ";
            logText += clipSourcePolygons;
            logText += " jstsOldPolygons ";
            logText += jstsOldPolygons ;
            logText += " jstsLine ";
            logText += jstsLine;

            // Handle cases with no divisions
            if (jstsLine === null) {
                return [olOldFeatures];
            }

            // Splitting
            for (i=0; i<jstsOldPolygons.length; i++) {
                logText += " i ";
                logText += i.toString()+" / "+jstsOldPolygons.length;
                if (jstsLine !== null) {
                    union = jstsOldPolygons[i].getExteriorRing().union(jstsLine);
                } else {
                    union = jstsOldPolygons[i];
                }
                polygonizer = new jsts.operation.polygonize.Polygonizer();
                polygonizer.add(union);
                jstsNewPolygons = polygonizer.getPolygons();

                logText += " jstsNewPolygons ";
                logText += jstsNewPolygons;

                clipPoints = [];
                olPoints = [];
                olNewLineStrings = [];
                for (j=0; j<jstsNewPolygons.array.length; j++) {
                    logText += "j";
                    logText += j+" / "+jstsNewPolygons.array.length;

                    clipTargetPolygons = [];
                    clipPolygon = new ClipperLib.Polygon();
                    jstsPoints = jstsNewPolygons.array[j].shell.points;
                    for(k=0; k<jstsPoints.length-1; k++) {
                        clipPoint = new ClipperLib.IntPoint(jstsPoints[k].x, jstsPoints[k].y);
                        clipPolygon.push(clipPoint);
                    }
                    clipTargetPolygons.push(clipPolygon);
                    // Scaling for integer operations
                    clipTargetPolygons = this.scaleup(clipTargetPolygons, scale);
                    cpr = new ClipperLib.Clipper();
                    cpr.AddPolygons(clipSourcePolygons[i], ClipperLib.PolyType.ptSubject);
                    cpr.AddPolygons(clipTargetPolygons, ClipperLib.PolyType.ptClip);

                    clipSolutionPolygons = new ClipperLib.Polygons();
                    clipType = ClipperLib.ClipType.ctIntersection;

                    // Cut intersections
                    success = cpr.Execute(clipType, clipSolutionPolygons);
                    if (!success) return -2+logText;

                    logText += " clipSourcePolygons[i] ";
                    logText += clipSourcePolygons[i];
                    logText += " clipTargetPolygons ";
                    logText += clipTargetPolygons;
                    logText += " clipSolutionPolygons ";
                    logText += clipSolutionPolygons;

                    if (clipSolutionPolygons.length === 0) continue;

                    // Polygons to OpenLayers format
                    polygonIndexes = [];
                    olNewPolygons = [];
                    sharedEdge = false;
                    for (k=0; k<clipSolutionPolygons.length; k++) {
                        // Jsts occasionally returns "empty" polygons
                        if (Math.abs(cpr.Area(clipSolutionPolygons[k])) < epsilon) continue;

                        clipValidationTarget.push(clipSolutionPolygons[k]);
                        if (cpr.Area(clipSolutionPolygons[k]) > 0) {
                            clipSolutionPolygon = clipSolutionPolygons[k];
                            olLinearRingPoints = [];
                            for (l=0; l<clipSolutionPolygon.length; l++) {
                                clipPoint = clipSolutionPolygon[l];
                                foundIndex = -1;
                                for (m=0; m<clipPoints.length; m++) {
                                    if ((clipPoint.X === clipPoints[m].X) && (clipPoint.Y === clipPoints[m].Y)) {
                                        foundIndex = m;
                                        break;
                                    }
                                }
                                if (foundIndex >= 0) {
                                    olLinearRingPoints.push(olPoints[foundIndex]);
                                } else {
                                    clipPoints.push(clipPoint);
                                    olPoints.push(new OpenLayers.Geometry.Point(clipPoint.X/scale, clipPoint.Y/scale));
                                    lastIndex = olPoints.length-1;
                                    olPoints[lastIndex].references = [];
                                    olPoints[lastIndex].markerPoint = false;
                                    olPoints[lastIndex].boundaryPoint = false;
                                    olLinearRingPoints.push(olPoints[lastIndex]);
                                }
                            }
                            olNewPolygons.push(new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(olLinearRingPoints)));
                            lastIndex = olNewPolygons.length-1;
                            for (l = 0; l < olNewPolygons[lastIndex].components[0].components.length-1; l++) {
                                olNewPolygons[lastIndex].components[0].components[l].references.push(olNewPolygons[lastIndex].id);
                            }
                            polygonIndexes.push(k);
                        }
                    }

                    // Debug info
                    logText += " olPoints ";
                    logText += olPoints;
                    logText += " olLinearRingPoints ";
                    logText += olLinearRingPoints;
                    logText += " olNewPolygons ";
                    logText += olNewPolygons;

                    // Holes to OpenLayers format
                    for (k=0; k<clipSolutionPolygons.length; k++) {
                        logText += " Holes k ";
                        logText += k+" / "+clipSolutionPolygons.length;

                        if (cpr.Area(clipSolutionPolygons[k]) < 0.0) {
                            clipTargetPolygons = [];
                            clipTargetPolygons.push(clipSolutionPolygons[k]);
                            for (l=0; l<polygonIndexes.length; l++) {

                                // Check which polygon contains the hole
                                cpr = new ClipperLib.Clipper();
                                clipSubjectPolygons = [];
                                clipSubjectPolygons.push(clipSolutionPolygons[polygonIndexes[l]]);
                                cpr.AddPolygons(clipSubjectPolygons, ClipperLib.PolyType.ptSubject);
                                cpr.AddPolygons(clipTargetPolygons, ClipperLib.PolyType.ptClip);
                                clipSolutionHoles = new ClipperLib.Polygons();
                                clipType = ClipperLib.ClipType.ctIntersection;
                                success = cpr.Execute(clipType, clipSolutionHoles);
                                if (!success) return -3+logText;

                                // Debugging info
                                logText += " clipSubjectPolygons ";
                                logText += clipSubjectPolygons;
                                logText += " clipTargetPolygons ";
                                logText += clipTargetPolygons;
                                logText += " clipSolutionHoles ";
                                logText += clipSolutionHoles;

                                if (clipSolutionHoles.length > 0) {
                                    clipHole = clipSolutionPolygons[k];
                                    olHolePoints = [];
                                    for (m=0; m<clipHole.length; m++) {
                                        clipPoint = clipHole[m];
                                        olHolePoints.push(new OpenLayers.Geometry.Point(clipPoint.X/scale, clipPoint.Y/scale));
                                    }
                                    olNewPolygons[l].components.push(new OpenLayers.Geometry.LinearRing(olHolePoints));
                                    break;
                                }
                            }
                        }
                    }
                    logText += " olNewPolygons ";
                    logText += olNewPolygons;
                    for (k=0; k<olNewPolygons.length; k++) {
                        olSolutionPolygons.push(olNewPolygons[k]);
                    }
                }
            }

            // Inverse transform and scale
            olPoints = olNewFeatures[0].geometry.getVertices();
            pointIndexes = [];
            for (i=0; i<olPoints.length; i++) {
                if (pointIndexes.indexOf(olPoints[i].id) < 0) {
                    // olPoint not handled yet
                    olPoints[i].x = olPoints[i].x/scaleFactor+reference[0];
                    olPoints[i].y = olPoints[i].y/scaleFactor+reference[1];
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
                if (sharedEdge) olLineStringPoints.push(olPoints[0]);
                for (j = 1; j < olPoints.length-1; j++) {
                    if (!this.equalArrays(olPoints[j].references, olPoints[j-1].references)) {
                        if (sharedEdge) {
                            if (olPoints[j].references.length > 2) olLineStringPoints.push(olPoints[j]);
                            olNewLineStringsTmp.push(new OpenLayers.Geometry.LineString(olLineStringPoints));
                            olLineStringPoints = [];
                        }
                    }
                    sharedEdge = (olPoints[j].references.length > 1);
                    if (sharedEdge) olLineStringPoints.push(olPoints[j]);
                }
                if (sharedEdge) {
                    if ((crossRing)&&(olNewLineStringsTmp.length>0)&&(this.equalArrays(olPoints[olPoints.length-2].references, olPoints[0].references))) {
                        for (j=olLineStringPoints.length-1; j>=0; j--) {
                            olNewLineStringsTmp[0].components.splice(0,0,olLineStringPoints[j]);
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

            lineStringLoop:
            for (k=0; k<olNewLineStrings.length; k++) {
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
                        if (!found) break;
                    }
                    if (found) continue lineStringLoop;
                }
                nextIndex = olEndPoints.length;
                lastIndex = olNewLineStrings[k].components.length-1;
                olEndPoints[nextIndex] = [olNewLineStrings[k].components[0],olNewLineStrings[k].components[lastIndex]];
                // Fixed endpoints
                olEndPoints[nextIndex][0].x0 = olEndPoints[nextIndex][0].x;
                olEndPoints[nextIndex][0].y0 = olEndPoints[nextIndex][0].y;
                olEndPoints[nextIndex][1].x0 = olEndPoints[nextIndex][1].x;
                olEndPoints[nextIndex][1].y0 = olEndPoints[nextIndex][1].y;
                olSolutionLineStrings.push(olNewLineStrings[k]);
            }

            for (k = 0; k < olSolutionLineStrings.length; k++) {
                // Markers
                intersections:
                for (l = 0; l < 2; l++) {
                    if (olEndPoints[k][l].references.length !== 2) continue;
                    // Check for duplicates
                    for (m = 0; m < this.drawPlugin.markerLayer.markers.length; m++) {
                        if (this.drawPlugin.markerLayer.markers[m].reference.point.id === olEndPoints[k][l].id) continue intersections;
                    }

                    marker = new OpenLayers.Marker(new OpenLayers.LonLat(olEndPoints[k][l].x,olEndPoints[k][l].y),this.markerIcon.clone());
                    marker.reference = {
                        point : olEndPoints[k][l],
                        segments : {
                            polygons : [],
                            p: []
                        }
                    };
                    olEndPoints[k][l].markerPoint = true;

                    // References
                    marker.markerMouseOffset = new OpenLayers.LonLat(0,0);
                    for (m = 0; m < olEndPoints[k][l].references.length; m++) {
                        for (n = 0; n < olSolutionPolygons.length; n++) {
                            if (olEndPoints[k][l].references[m] === olSolutionPolygons[n].id) {
                                olPolygon = olSolutionPolygons[n];
                                olPoints = olPolygon.components[0].components;
                                for (o = 0; o < olPoints.length-1; o++) {
                                    if (olPoints[o].id === marker.reference.point.id) {
                                        if (o === 0) {
                                            lastIndex = olPoints.length-2;
                                        } else {
                                            lastIndex = o-1;
                                        }
                                        olPoint = olPoints[lastIndex];
                                        sharedEdge = false;
                                        for (p = 0; p < olPoint.references.length; p++ ) {
                                            if (olPoint.references[p] !== olSolutionPolygons[n].id) {
                                                found = false;
                                                endPoints:
                                                for (i = 0; i < olEndPoints.length; i++) {
                                                    for (j = 0; j < 2; j++) {
                                                        if (olEndPoints[i][j].id === olPoint.id) {
                                                            if (olEndPoints[i][j].references.length !== 2) continue;
                                                            if ((olSolutionLineStrings[k].components.length === 2)&&(this.equalArrays(olPoints[o].references,olPoint.references))) continue;
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
                                            if (o === olPoints.length-1) {
                                                lastIndex = 0;
                                            } else {
                                                lastIndex = o+1;
                                            }
                                            olPoint = olPoints[lastIndex];
                                            for (p = 0; p < olPoint.references.length; p++ ) {
                                                if (olPoint.references[p] !== olSolutionPolygons[n].id) {
                                                    endPoints:
                                                    for (i = 0; i < olEndPoints.length; i++) {
                                                        for (j = 0; j < 2; j++) {
                                                            if (olEndPoints[i][j].id === olPoint.id) {
                                                                if (olEndPoints[i][j].references.length !== 2) continue;
                                                                if ((olSolutionLineStrings[k].components.length === 2)&&(this.equalArrays(olPoints[o].references,olPoint.references))) continue;
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
                                            var refSegments = [[]];
                                            refSegments[0][0] = olPoints[o];
                                            refSegments[0][1] = olPoints[lastIndex];
                                            var inds = (o < lastIndex) ? [o,lastIndex] : [lastIndex,o];
                                            // Adjacent marker segments
                                            refSegments.push([(inds[0] > 0) ? olPoints[inds[0]-1] : olPoints[olPoints.length-2],olPoints[inds[0]]]);
                                            refSegments.push([(inds[1] < olPoints.length-1) ? olPoints[inds[1]+1] : olPoints[0],olPoints[inds[1]]]);
                                            marker.reference.segments.p.push(refSegments);
                                        }
                                    }
                                }
                                break;
                            }
                        }
                    }
                    marker.events.register("mousedown", marker, this.selectActiveMarker);
                    this.drawPlugin.markerLayer.addMarker(marker);
                }
            }

            // Update boundary info
            for (i = 0; i < olNewFeatures[0].geometry.components.length; i++) {
                var olNewPoints = olNewFeatures[0].geometry.components[i].components[0].components;
                for (j = 0; j < olNewPoints.length; j++) {
                   if ((olNewPoints[j].references.length == 1) || (olNewPoints[j].markerPoint)) {
                       olNewPoints[j].boundaryPoint = true;
                   }
                }
            }

            /* // Checking if everything is correct
            success = false;
            clipValidationSource = [];
            for (i=0; i<clipSourcePolygons.length; i++) {
                for (j=0; j<clipSourcePolygons[i].length; j++) {
                     clipValidationSource.push(clipSourcePolygons[i][j]);
                }
            }

            for (i=0; i<clipValidationTarget.length; i++) {
                cpr = new ClipperLib.Clipper();
                var cl = [];
                cl.push(clipValidationTarget[i]);
                cpr.AddPolygons(clipValidationSource, ClipperLib.PolyType.ptSubject);
                cpr.AddPolygons(cl, ClipperLib.PolyType.ptClip);
                clipType = ClipperLib.ClipType.ctXor;
                clipValidationResult = new ClipperLib.Polygons();
                success = cpr.Execute(clipType, clipValidationResult);
                clipValidationSource = clipValidationResult;
            }
            success = (clipValidationSource.length === 0);

            if (success) {
                split.addFeatures(olNewFeatures);
            } else {
                return -10+logText;
            } */

            return olNewFeatures;
        },

        /*
         * @method selectActiveMarker
         *
         * @param {} evt
         */
        selectActiveMarker : function(evt) {
            OpenLayers.Event.stop(evt);
            var xy = this.map.events.getMousePosition(evt);
            var pixel = new OpenLayers.Pixel(xy.x,xy.y);
            var xyLonLat = this.map.getLonLatFromPixel(pixel);
            this.map.activeMarker = evt.object;
            this.map.activeMarker.markerMouseOffset.lon = xyLonLat.lon-this.map.activeMarker.lonlat.lon;
            this.map.activeMarker.markerMouseOffset.lat = xyLonLat.lat-this.map.activeMarker.lonlat.lat;
            this.map.events.register("mouseup", this.map, this.map.freezeActiveMarker);
            this.map.events.register("mousemove", this.map, this.map.moveActiveMarker);
        },

    /*
     * @method checkSelfIntersection
     *
     * @param {}
     */
    checkSelfIntersection: function(polygon){
        var outer = polygon.components;
        var segments = [];
        for(var i=1;i<outer.length;i++){
            var segment= new OpenLayers.Geometry.LineString([outer[i-1].clone(), outer[i].clone()]);
            segments.push(segment);
        }
        for(var j=0;j<segments.length;j++){
            if (this.segmentIntersects(segments[j],segments)){
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
    segmentIntersects: function(segment,segments){
        for(var i=0;i<segments.length;i++){
            if (!segments[i].equals(segment)){
                if ((segments[i].intersects(segment) && !this.startOrStopEquals(segments[i],segment))){
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
    startOrStopEquals: function(segment1,segment2){
        if (segment1.components[0].equals(segment2.components[0])) return true;
        if (segment1.components[0].equals(segment2.components[1])) return true;
        if (segment1.components[1].equals(segment2.components[0])) return true;
        return (segment1.components[1].equals(segment2.components[1]));
    },

    /*
     * @method equalArrays
     *
     * @param {}
     * @param {}
     */
    equalArrays: function(array1, array2) {
       var temp = [];
       var key;
       var i;
       if ( (!array1[0]) || (!array2[0]) ) {
          return false;
       }
       if (array1.length != array2.length) {
          return false;
       }
       for (i=0; i<array1.length; i++) {
          key = (typeof array1[i]) + "~" + array1[i];
          if (temp[key]) { temp[key]++; } else { temp[key] = 1; }
       }
       for (i=0; i<array2.length; i++) {
          key = (typeof array2[i]) + "~" + array2[i];
          if (temp[key]) {
             if (temp[key] == 0) { return false; } else { temp[key]--; }
          } else {
             return false;
          }
       }
       return true;
    },

    /*
     * @method updatePolygons
     *
     * @param {}
     * @param {}
     */
    updatePolygons: function(p,p0) {
        var pInd = -1;
        var p0Ind = -1;
        var i, j, k, l, m, n;
        var marker = this.map.activeMarker;
        var markerIndexes = [[],[]];

        // Search the correct point
        pLoop:
        for (i=0; i<2; i++) {
            for (j=0; j<2; j++) {
                if (p[i].id === p0[j].id) {
                    pInd = i;
                    p0Ind = (j+1)%2;
                    break pLoop;
                }
            }
        }
        if (pInd < 0) return; // This should not happen
        var remPolygon = null;

        // Remove the point from old polygon
        var features = this.drawPlugin.drawLayer.features;
        var fInd;
        for (i=0; i<features.length; i++) {
            if (features[i].geometry.id === p[pInd].references[0]) {
                remPolygon = features[i].geometry;
                fInd = i;
                break;
            }
        }

        var mInd = -1;
        i = 0;
        var removed = false;
        while (i < features[fInd].geometry.components[0].components.length) {
            if (features[fInd].geometry.components[0].components[i].id === p[pInd].id) { // Removable point
                features[fInd].geometry.components[0].components.splice(i,1);
                if (i==0) {
                    features[fInd].geometry.components[0].components.splice(features[fInd].geometry.components[0]-1,1);
                    features[fInd].geometry.components[0].components.push(features[fInd].geometry.components[0].components[0]);
                }
                removed = true;
                if (mInd >= 0) {
                    break;
                } else {
                    continue;
                }

            } else if (features[fInd].geometry.components[0].components[i].id === p0[p0Ind].id) { // Marker
                mInd = i;
                if (removed) break;
            }
            i = i+1;
        }
        // Add the point to new polygon
        var point = p[pInd];
        addPoint:
        for (i=0; i<2; i++) {
            if (p0[p0Ind].references[i] === p[pInd].references[0]) {
                continue;
            }
            var addPolygon;
            for (j=0; j<features.length; j++) {
                if (features[j].geometry.id === p0[p0Ind].references[i]) {
                    addPolygon = features[j].geometry;
                    var cornerInd = -1;
                    var prevInd = -1;
                    var nextInd = -1;
                    for (k=0; k<features[j].geometry.components[0].components.length-1; k++) {
                        if (features[j].geometry.components[0].components[k].id === p0[p0Ind].id) {
                            cornerInd = k;
                            prevInd = (k === 0) ? features[j].geometry.components[0].components.length-2 : k-1;
                            nextInd = (k === features[j].geometry.components[0].components.length-2) ? 0 : k+1;
                            break;
                        }
                    }
                    if (features[j].geometry.components[0].components[prevInd].boundaryPoint) {
                        features[j].geometry.components[0].components.splice(prevInd+1,0,point);
                        if (cornerInd !== 0) {
                            cornerInd = cornerInd+1;
                        }
                    } else {
                        if (nextInd !== 0) {
                            features[j].geometry.components[0].components.splice(nextInd,0,point);
                        } else {
                            features[j].geometry.components[0].components.splice(features[j].geometry.components[0].components.length-1,0,point);
                        }
                    }
                    p[pInd].references = [addPolygon.id];
                    break addPoint;
                }
            }
        }

        // Update marker references
        var markers = this.drawPlugin.markerLayer.markers;
        for (i=0; i<markers.length; i++) {
            marker = markers[i];
            for (k=0; k<2; k++) {
                var refPoints = null;
                var markerInd = -1;
                refPoints = features[k].geometry.components[0].components;

                for (l=0; l<refPoints.length; l++) {
                    if (refPoints[l].id === marker.reference.point.id) {
                        markerInd = l;
                        break;
                    }
                }

                marker.reference.segments.p[k][0][0] = refPoints[markerInd];
                if (refPoints[markerInd+1].boundaryPoint) {
                    marker.reference.segments.p[k][0][1] = refPoints[markerInd+1];
                    var newInd1;
                    if (markerInd === refPoints.length-2) {
                        newInd1 = 1;
                    } else if (markerInd === refPoints.length-1) {
                        newInd1 = 2;
                    } else {
                      newInd1 = markerInd+2;
                    }
                    marker.reference.segments.p[k][1][0] = refPoints[newInd1];
                    marker.reference.segments.p[k][1][1] = refPoints[markerInd+1];

                    var newInd2 = (markerInd === 0) ? refPoints.length-2 : markerInd-1;
                    marker.reference.segments.p[k][2][0] = refPoints[newInd2];
                    marker.reference.segments.p[k][2][1] = refPoints[markerInd];
                } else {
                    var newInd3 = (markerInd === 0) ? refPoints.length-2 : markerInd-1;
                    marker.reference.segments.p[k][0][1] = refPoints[newInd3];

                    var newInd4 = (newInd3 === 0 ) ? refPoints.length-2 : newInd3-1;
                    marker.reference.segments.p[k][1][0] = refPoints[newInd4];
                    marker.reference.segments.p[k][1][1] = refPoints[newInd3];

                    marker.reference.segments.p[k][2][0] = refPoints[markerInd+1];
                    marker.reference.segments.p[k][2][1] = refPoints[markerInd];
                }
            }
        }



/*
        for (k=0; k<2; k++) {
            var id = p0[p0Ind].references[k];
            var refPoints = null;
            var markerInd = -1;
            if (id === remPolygon.id) {
                markerInd = mInd;
            } else {
                markerInd = cornerInd;
            }
            refPoints = features[k].geometry.components[0].components;
            marker.reference.segments.p[k][0][0] = refPoints[markerInd];
            if (refPoints[markerInd+1].boundaryPoint) {
                marker.reference.segments.p[k][0][1] = refPoints[markerInd+1];
                var newInd1;
                if (markerInd === refPoints.length-2) {
                    newInd1 = 1;
                } else if (markerInd === refPoints.length-1) {
                    newInd1 = 2;
                } else {
                  newInd1 = markerInd+2;
                }
                marker.reference.segments.p[k][1][0] = refPoints[newInd1];
                marker.reference.segments.p[k][1][1] = refPoints[markerInd+1];

                var newInd2 = (markerInd === 0) ? refPoints.length-2 : markerInd-1;
                marker.reference.segments.p[k][2][0] = refPoints[newInd2];
                marker.reference.segments.p[k][2][1] = refPoints[markerInd];
            } else {
                var newInd3 = (markerInd === 0) ? refPoints.length-2 : markerInd-1;
                marker.reference.segments.p[k][0][1] = refPoints[newInd3];

                var newInd4 = (newInd3 === 0 ) ? refPoints.length-2 : newInd3-1;
                marker.reference.segments.p[k][1][0] = refPoints[newInd4];
                marker.reference.segments.p[k][1][1] = refPoints[newInd3];

                marker.reference.segments.p[k][2][0] = refPoints[markerInd+1];
                marker.reference.segments.p[k][2][1] = refPoints[markerInd];
            }
        }
*/

    }
});
