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
    this.markerIcon = new OpenLayers.Icon('/Oskari/applications/parcel/img/marker.png',this.markerSize,this.markerOffset);

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

this.test = false;

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
            var lonlat = this.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y))
            lonlat.lon -= this.activeMarker.markerMouseOffset.lon;
            lonlat.lat -= this.activeMarker.markerMouseOffset.lat;

            this.activeMarker.lonlat = this.activeMarkerProjection(lonlat);
            this.activeMarker.reference.point.x = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.x0 = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.y = this.activeMarker.lonlat.lat;
            this.activeMarker.reference.point.y0 = this.activeMarker.lonlat.lat;

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

            var lonlat = this.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y))
            lonlat.lon -= this.activeMarker.markerMouseOffset.lon;
            lonlat.lat -= this.activeMarker.markerMouseOffset.lat;

            this.activeMarker.lonlat = this.activeMarkerProjection(lonlat);
            this.activeMarker.reference.point.x = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.x0 = this.activeMarker.lonlat.lon;
            this.activeMarker.reference.point.y = this.activeMarker.lonlat.lat;
            this.activeMarker.reference.point.y0 = this.activeMarker.lonlat.lat;

            editLayer.updateLine();
            editLayer.redraw();
            parcelLayer.redraw();
            me.drawPlugin.updateInfobox();
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
            var parcelLayer = this.getLayersByName("Parcel Draw Layer")[0];
            //var activeMarker = me.map.activeMarker;
            var point = {x: refLonlat.lon, y: refLonlat.lat};
            var projPoints = [];
            var distances = [];
            var segments = this.activeMarker.reference.segments;
            var minDistInd = 0;
            for (var i = 0; i < segments.polygons.length; i++) {
                for (var j = 0; j < parcelLayer.features.length; j++) {
                    if (parcelLayer.features[j].geometry.CLASS_NAME === "OpenLayers.Geometry.Polygon") {
                        if (parcelLayer.features[j].geometry.id === segments.polygons[i]) {
                            var points = parcelLayer.features[j].geometry.components[0].components;
                            break;
                        }

                    }
                }
                var p1 = {x: segments.p[0][i].x, y: segments.p[0][i].y};
                var p2 = {x: segments.p[1][i].x, y: segments.p[1][i].y};

                projPoints.push(this.pointProjection(point,p1,p2));
                distances.push(this.distance(point,projPoints[i]));
                var lastIndex = distances.length-1;
                if (distances[lastIndex] < distances[minDistInd]) minDistInd = lastIndex;
            }
            return (new OpenLayers.LonLat(projPoints[minDistInd].x,projPoints[minDistInd].y));
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
            editLayer.addFeatures([inPolygon]);
            parcelLayer.addFeatures([inPolygon]);
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
return;
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

            var epsilon = 100;

            // Scaling factor for integer operations
            var scale = 1;

            var marker;

            var logText = "";
debugger;
            for (i=0; i<olOldFeatures.length; i++) {
                if (olOldFeatures[i].id.indexOf("Polygon") !== -1) {
                    jstsOldPolygon = jstsParser.read(olOldFeatures[i]);
                    if (!jstsOldPolygon.isValid()) {
                        console.log("Invalid geometry.");
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
                } else if (olOldFeatures[i].id.indexOf("OpenLayers.Geometry.LineString") != -1) {
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
                    pointIndexes = [];
                    olNewPolygons = [];
                    sharedEdge = false;
                    for (k=0; k<clipSolutionPolygons.length; k++) {
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
                            p: [[],[]]
                        }
                    };

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
                                            marker.reference.segments.p[0].push(olPoints[o]);
                                            marker.reference.segments.p[1].push(olPoints[lastIndex]);
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
    }

});
