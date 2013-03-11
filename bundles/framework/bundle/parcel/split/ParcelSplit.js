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
    this.markerIcon = new OpenLayers.Icon('img/marker.png',this.markerSize,this.markerOffset);

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

//if (this.test) return;
//this.test = true;

       // Testing

        // var event = this.drawPlugin._sandbox.getEventBuilder('ParcelInfo.ParcelLayerRegisterEvent')(this.drawPlugin.drawLayer);
        // this.drawPlugin._sandbox.notifyAll(event);


       var testPolygon = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([
           new OpenLayers.Geometry.Point(400000,6670000),
           new OpenLayers.Geometry.Point(500000,6670000),
           new OpenLayers.Geometry.Point(500000,6700000),
           new OpenLayers.Geometry.Point(400000,6700000)
       ])]));
/*       var testOper = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing([
           new OpenLayers.Geometry.Point(425000,6680000),
           new OpenLayers.Geometry.Point(475000,6680000),
           new OpenLayers.Geometry.Point(475000,6690000),
           new OpenLayers.Geometry.Point(425000,6690000)
       ])]));
*/       var testOper = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.LineString([
           new OpenLayers.Geometry.Point(390000,6660000),
           new OpenLayers.Geometry.Point(450000,6680000),
           new OpenLayers.Geometry.Point(510000,6730000)
       ]));

//       this.drawPlugin.drawLayer.removeAllFeatures();
       this.drawPlugin.drawLayer.addFeatures([testPolygon,testOper]);
       this.drawPlugin.drawLayer.refresh();
       this.map.setCenter(new OpenLayers.LonLat(450000,6680000), 3.0);
//       debugger;
       // End testing

    },

    /**
     * @method split
     *
     * Splits the parcel.
     * 
     * {Oskari.mapframework.bundle.parcel.DrawingToolInstance} instance provides the features that are used for the splitting.
     */
    split : function() {
        if (this.drawPlugin.splitSelection) return;

        var parcelLayer = this.drawPlugin.drawLayer;
        var editLayer = this.drawPlugin.editLayer;

        this.map.moveActiveMarker = function(evt) {
            var lonlat = this.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y))
            lonlat.lon -= this.activeMarker.markerMouseOffset.lon;
            lonlat.lat -= this.activeMarker.markerMouseOffset.lat;
            this.activeMarker.lonlat = this.activeMarkerProjection(lonlat);
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

            var parcelLayer = this.getLayersByName("Parcel Draw Layer")[0];
            var editLayer = this.getLayersByName("Parcel Edit Layer")[0];
            var markerLayer = this.getLayersByName("Parcel Markers Layer")[0];
            var line = parcelLayer.getFeatureById(this.activeMarker.polylineID);
            var edgeInd = this.activeMarker.polylineEdge;

            var operatingLine = editLayer.features[0];
            var polygon1 = parcelLayer.features[0];
            var polygon2 = parcelLayer.features[1];

            var lineInd;
            if (this.activeMarker.firstLine) {
                lineInd = 0;
                operatingLine.geometry.components[lineInd].x = this.activeMarker.lonlat.lon;
                operatingLine.geometry.components[lineInd].y = this.activeMarker.lonlat.lat;

            } else {
                lineInd = operatingLine.geometry.components.length-1;
                operatingLine.geometry.components[lineInd].x = this.activeMarker.lonlat.lon;
                operatingLine.geometry.components[lineInd].y = this.activeMarker.lonlat.lat;
            }

            if (this.activeMarker.first) {
                polygon1.geometry.components[0].components[polygon1.polygonCorners[0]] = operatingLine.geometry.components[lineInd];
                polygon2.geometry.components[0].components[polygon2.polygonCorners[1]] = operatingLine.geometry.components[lineInd];
            } else {
                var nInd = operatingLine.geometry.components.length-1;
                polygon1.geometry.components[0].components[polygon1.polygonCorners[1]] = operatingLine.geometry.components[lineInd];
                polygon2.geometry.components[0].components[polygon2.polygonCorners[0]] = operatingLine.geometry.components[lineInd];
            }
            editLayer.redraw();
            parcelLayer.redraw();
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

            // Tarkistetaan onko segmentin sisällä
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
            return pq;
       }; // huom. tapaus nimittäjä==0


        this.map.activeMarkerProjection  = function(refLonlat) {
            var parcelLayer = this.getLayersByName("Parcel Draw Layer")[0];

            var point = {x: refLonlat.lon, y: refLonlat.lat};
            // var polygonID = this.activeMarker.polygonID;
            // var polygon = parcelLayer.getFeatureById(polygonID);
            var edge = this.activeMarker.polygonEdge;
            //var vertices = polygon.geometry.getVertices();
            var vertices = this.backupVertices;
            var nEdges = vertices.length;
            var inds = [(edge-1+nEdges)%nEdges,edge,(edge+1+nEdges)%nEdges,(edge+2+nEdges)%nEdges];
            var projPoints = [];
            var distances = [];
            var distance = function(p1,p2) {
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

            var minDistInd = 0;
            for (var i = 0; i < 3; i++) {
                projPoints[i] = this.pointProjection(point,vertices[inds[i]],vertices[inds[i+1]]);
                distances[i] = distance(point,projPoints[i]);
                if (distances[i] < distances[minDistInd]) minDistInd = i;
            }
            this.activeMarker.polygonEdge = (edge+minDistInd+nEdges-1)%nEdges;

            // return (new OpenLayers.LonLat(projPoints[minDistInd].x,projPoints[minDistInd].y));

            // kun vain yksi väli mahdollinen:
            this.activeMarker.polygonEdge = edge;
            return (new OpenLayers.LonLat(projPoints[1].x,projPoints[1].y));
        };

        var featureInd = parcelLayer.features.length-1;
        if (featureInd < 1) return;

        this.drawPlugin.splitSelection = true;
        var basePolygon = parcelLayer.features[0];
        var operatingFeature = parcelLayer.features[featureInd];
        switch (operatingFeature.geometry.CLASS_NAME) {
            case "OpenLayers.Geometry.Polygon":
                this.splitHole(basePolygon,operatingFeature);
                break;
            case "OpenLayers.Geometry.LineString":
//                this.splitLineOld(basePolygon,operatingFeature);
                var newFeatures = this.splitLine(basePolygon,operatingFeature);
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
    splitHole : function(outPolygon,inPolygon) {
        var parcelLayer = this.drawPlugin.drawLayer;

        // Validity check
        if ((outPolygon.geometry.components[0].intersects(inPolygon.geometry.components[0]))
        ||(this.checkSelfIntersection(inPolygon.geometry.components[0]))) {
            parcelLayer.destroyFeatures(inPolygon);
            return;
        }

        var editLayer = this.drawPlugin.editLayer;
        outPolygon.geometry.addComponent(inPolygon.geometry.components[0]);
        parcelLayer.destroyFeatures(inPolygon);
        inPolygon.style = this.drawPlugin.basicStyle;

        editLayer.addFeatures([inPolygon]);
debugger;
    },

    /*
     * @method splitLine
     *
     * @param {} polygon
     * @param {} line
     */
    splitLineOld : function(polygon,line) {


/*
{
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -94.921875,
                            58.7109375
                        ],
                        [
                            -100.546875,
                            -42.5390625
                        ],
                        [
                            47.109375,
                            -51.6796875
                        ],
                        [
                            49.21875,
                            55.8984375
                        ],
                        [
                            -94.921875,
                            58.7109375
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -136.40625,
                        17.2265625
                    ],
                    [
                        -23.203125,
                        -8.0859375
                    ],
                    [
                        87.890625,
                        15.8203125
                    ]
                ]
            }
        }
    ]
}
*/














            var parcelLayer = this.drawPlugin.drawLayer;
            var editLayer = this.drawPlugin.editLayer;
            var markerLayer = this.drawPlugin.markerLayer;
            var vertices;
            var polygonEdges = [];
            var polylineEdges = [];
            var nLines = 0;
            var polylineSizes = [];
            var i, j, j1;

//            var parcelLayer = this.drawPlugin.drawLayer;

          	vertices = line.geometry.getVertices();
            polylineSizes.push(vertices.length);
            nLines = nLines+1;
            polylineEdges[nLines-1] = [];
            for (j=0; j<vertices.length-1; j++) {
                polylineEdges[nLines-1].push([vertices[j].x,vertices[j].y,vertices[j+1].x,vertices[j+1].y,line.id,j]);
            }

            vertices = polygon.geometry.getVertices();
            for (j=0; j<vertices.length; j++) {
                j1 = (j+1)%vertices.length;
                polygonEdges.push([vertices[j].x,vertices[j].y,vertices[j1].x,vertices[j1].y,polygon.id,j]);
            }

            var numIntersections = 0;
            var removedPoints = 0;
            for (i=0; i<polylineEdges.length; i++) {
                // var line = vectors.getFeatureById(polylineEdges[i][0][4]);
                var comp = line.geometry.components;
                for (j=0; j<polylineEdges[i].length; j++) {
                    if (numIntersections > 1) {
                        comp[j].outside = (typeof comp[j].outside === 'undefined');
                        continue;
                    }
                    for (var k=0; k<polygonEdges.length; k++) {
                        var p = this.intersection(polylineEdges[i][j],polygonEdges[k]);
                        if (p === null) {
                            comp[j].outside = (numIntersections < 1);
                        } else {
                            comp[j].outside = false;
                            this.intersectionPoints.push([p,polygonEdges[k][4],polygonEdges[k][5],polylineEdges[i][j][4],i,j,k]);
                            if (numIntersections === 0) {
                                comp[j].x = p[0];
                                comp[j].y = p[1];
                                numIntersections++;
                            } else {
                                numIntersections++;
                                comp[j+1].x = p[0];
                                comp[j+1].y = p[1];
                                comp[j+1].outside = false;
                                break;
                            }
                        }
                    }
                }
                var reversed = false;
                if (this.intersectionPoints[0][6] > this.intersectionPoints[1][6]) this.intersectionPoints.reverse();
                if (this.intersectionPoints[0][5] > this.intersectionPoints[1][5]) {
                    reversed = true;
                    polylineEdges[i].reverse();
                    for (var l = 0; l < polylineEdges[i].length; l++) {
                        var temp0 = polylineEdges[i][l][0];
                        var temp1 = polylineEdges[i][l][1];
                        polylineEdges[i][l][0] = polylineEdges[i][l][2];
                        polylineEdges[i][l][1] = polylineEdges[i][l][3];
                        polylineEdges[i][l][2] =temp0;
                        polylineEdges[i][l][3] =temp1;
                    }
                    this.intersectionPoints[0][5] = polylineEdges[i].length-1-this.intersectionPoints[0][5];
                    this.intersectionPoints[1][5] = polylineEdges[i].length-1-this.intersectionPoints[1][5];
                }

                comp[polylineEdges[i].length].outside = (typeof comp[j].outside === 'undefined');
                j = 0;
                while (j<comp.length) {
                    if (comp[j].outside) {
                        comp.splice(j,1);
                        continue;
                    }
                    j++;
                }
            }

            var minPolygonEdge = Number.POSITIVE_INFINITY;
            var minPolygonEdgeIndex = -1;
            var marker;

            for (i=0; i<this.intersectionPoints.length; i++) {
            	
                var point = new OpenLayers.Geometry.Point(this.intersectionPoints[i][0][0],this.intersectionPoints[i][0][1]);
                
                marker = new OpenLayers.Marker(new OpenLayers.LonLat(point.x,point.y),this.markerIcon.clone());
                marker.setOpacity(0.8);
                marker.polygonID = this.intersectionPoints[i][1];
                marker.polygonEdge = this.intersectionPoints[i][2];
                marker.polylineID = this.intersectionPoints[i][3];
                marker.polylineEdge = this.intersectionPoints[i][5];
                marker.first = false;
                marker.firstLine = ((i===0)&&(!reversed))||((i>0)&&(reversed));
                marker.markerMouseOffset = new OpenLayers.LonLat(0, 0);

                if (marker.polygonEdge < minPolygonEdge) {
                    minPolygonEdge = marker.polygonEdge;
                    minPolygonEdgeIndex = i;
                }

                markerLayer.addMarker(marker);
                
            }
            if (minPolygonEdgeIndex >= 0) markerLayer.markers[minPolygonEdgeIndex].first = true;

            for (i=0; i<markerLayer.markers.length; i++) {
                markerLayer.markers[i].events.register("mousedown", marker, this.selectActiveMarker);
            }


            this.splitPolygons = this.generateSplitPolygons(polygonEdges,polylineEdges);

            this.map.backupVertices = parcelLayer.features[0].geometry.getVertices();
            parcelLayer.removeAllFeatures();
            parcelLayer.addFeatures(this.splitPolygons);

            editLayer.addFeatures([line]);
            OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';
    },


    /*
     * @method generateSplitPolygons
     *
     * @param {} polygonEdges
     * @param {} polylineEdges
     * @return {} returns single localization string or
     */
    generateSplitPolygons : function(polygonEdges, polylineEdges) {
        var point;
        var point1 = null;
        var point2;
        var points1 = [];
        var points2 = [];
        var linearRing;
        var polygons = [];
        var styles = [];
        var i;
        var commonPoints = [];

        if (this.intersectionPoints.length<1) return null;

        // leikkaus
        points1 = [];
        var polygonCorners1 = [];
        for (i=0; i<this.intersectionPoints[0][6]+1; i++) {
            point = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
            points1.push(point);
        }
        point = new OpenLayers.Geometry.Point(this.intersectionPoints[0][0][0],this.intersectionPoints[0][0][1]);
        points1.push(point);
        polygonCorners1.push(points1.length-1);
        commonPoints.push(point);

        for (i = this.intersectionPoints[0][5]+1; i < this.intersectionPoints[1][5]+1; i++) {
            point = new OpenLayers.Geometry.Point(polylineEdges[this.intersectionPoints[0][4]][i][0],polylineEdges[this.intersectionPoints[0][4]][i][1]);
            points1.push(point);
            commonPoints.push(point);
        }

        point = new OpenLayers.Geometry.Point(this.intersectionPoints[1][0][0],this.intersectionPoints[1][0][1]);
        points1.push(point);
        polygonCorners1.push(points1.length-1);
        commonPoints.push(point);

        for (i=this.intersectionPoints[1][6]+1; i<polygonEdges.length; i++) {
            point = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
            points1.push(point);
        }

        var polygon1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points1)]));
        polygon1.style = this.drawPlugin.basicStyle;
        polygon1.polygonCorners = polygonCorners1;

        points2 = [];
        var polygonCorners2 = [];
        for (i=this.intersectionPoints[0][6]+1; i<this.intersectionPoints[1][6]+1; i++) {
            point = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
            points2.push(point);
        }
        point = commonPoints[commonPoints.length-1];
        points2.push(point);
        polygonCorners2.push(points2.length-1);

        for (i = commonPoints.length-2; i>0; i--) {
            point = commonPoints[i];
            points2.push(point);
        }

        point = commonPoints[0];
        points2.push(point);
        polygonCorners2.push(points2.length-1);
        var polygon2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points2)]));
        polygon2.style = this.drawPlugin.basicStyle;
        polygon2.polygonCorners = polygonCorners2;

        return [polygon1,polygon2];
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
        splitLine : function(polygon,line) {
            // OpenLayers variables
            var lineStyle = { strokeColor: '#0000ff', strokeOpacity: 1, strokeWidth: 2};
            var olOldFeatures = [polygon].concat([line]);
            var olNewFeatures = [new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiPolygon()),
                                 new OpenLayers.Feature.Vector(new OpenLayers.Geometry.MultiLineString(),null,lineStyle)];
            var olSolutionPolygons = olNewFeatures[0].geometry.components;
            var olSolutionLineStrings = olNewFeatures[1].geometry.components;
            var olNewPolygons = [];
            var olNewLineStrings = [];
            var olPoints = [];
            var olLinearRingPoints = [];
            var olLinearRings;
            var olLineStringPoints = [];
            var olLineString;

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

            var i, j, k, l, m;
            var lastIndex;
            var foundIndex;

            // Scaling factor for integer operations
            var scale = 1;

            var marker;

            var logText = "";

            for (i=0; i<olOldFeatures.length; i++) {
                if (olOldFeatures[i].geometry.CLASS_NAME=="OpenLayers.Geometry.Polygon") {
                    jstsOldPolygon = jstsParser.read(olOldFeatures[i].geometry);
                    if (!jstsOldPolygon.isValid()) {
                        console.log("Invalid geometry.");
                        return -1+logText;
                    }
                    jstsOldPolygons.push(jstsOldPolygon);
                    clipPolygon = new ClipperLib.Polygon();
                    olLinearRings = olOldFeatures[i].geometry.components;
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
                    // Skaalaus kokonaislukuoperaatioita varten
                    l = clipSourcePolygons.length-1;
                    clipSourcePolygons[l] = this.scaleup(clipSourcePolygons[l], scale);
                } else if (olOldFeatures[i].geometry.CLASS_NAME=="OpenLayers.Geometry.LineString") {
                    jstsLine = jstsParser.read(olOldFeatures[i].geometry);
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

                    // Polygons and lines to OpenLayers format
                    polygonIndexes = [];
                    pointIndexes = [];
                    olNewPolygons = [];
                    for (k=0; k<clipSolutionPolygons.length; k++) {
                        clipValidationTarget.push(clipSolutionPolygons[k]);
                        if (cpr.Area(clipSolutionPolygons[k]) > 0) {
                            clipSolutionPolygon = clipSolutionPolygons[k];
                            olLinearRingPoints = [];
                            olLineStringPoints = [];
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
                                    if (!sharedEdge) sharedEdge = true;
                                    if (l === 0) crossRing = true;
                                    olLineStringPoints.push(olPoints[foundIndex]);
                                    if ((l === clipSolutionPolygon.length-1) && (crossRing)) {
                                        for (m=olLineStringPoints.length-1; m>=0; m--) {
                                            olNewLineStrings[0].components.splice(0,0,olLineStringPoints[m]);
                                        }
                                    }
                                } else {
                                    clipPoints.push(clipPoint);
                                    olPoints.push(new OpenLayers.Geometry.Point(clipPoint.X/scale, clipPoint.Y/scale));
                                    lastIndex = olPoints.length-1;
                                    olPoints[lastIndex].references = [];
                                    olLinearRingPoints.push(olPoints[lastIndex]);
                                    if (sharedEdge) {
                                        sharedEdge = false;
                                        olNewLineStrings.push(new OpenLayers.Geometry.LineString(olLineStringPoints));
                                        olLineStringPoints = [];
                                    }
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
                                    olPoints = [];
                                    for (m=0; m<clipHole.length; m++) {
                                        clipPoint = clipHole[m];
                                        olPoints.push(new OpenLayers.Geometry.Point(clipPoint.X/scale, clipPoint.Y/scale));
                                    }
                                    olNewPolygons[l].components.push(new OpenLayers.Geometry.LinearRing(olPoints));
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

                    for (k=0; k<olNewLineStrings.length; k++) {
                        olPoints = [];
                        olLineString = olNewLineStrings[k];
                        olPoints.push(olLineString.components[0]);
                        lastIndex = olLineString.components.length-1;
                        olPoints.push(olLineString.components[lastIndex]);
                        // Kiinnitetyt päätepisteet
                        olPoints[0].x0 = olPoints[0].x;
                        olPoints[0].y0 = olPoints[0].y;
                        olPoints[1].x0 = olPoints[1].x;
                        olPoints[1].y0 = olPoints[1].y;

                        // Markerit
/*                        for (l = 0; l < 2; l++) {
                            marker = new OpenLayers.Marker(new OpenLayers.LonLat(olPoints[l].x,olPoints[l].y),this.markerIcon.clone());
                            marker.pointReference = olPoints[l].id;
                            marker.markerMouseOffset = new OpenLayers.LonLat(0,0);
                            for (m = 0; m < olPoints[l].references.length; m++) {



                            }

                            marker.events.register("mousedown", marker, this.selectActiveMarker);
                            this.drawPlugin.markerLayer.addMarker(marker);
                        }
*/
/*
                                    for (i=0; i<this.intersectionPoints.length; i++) {



                var point = new OpenLayers.Geometry.Point(this.intersectionPoints[i][0][0],this.intersectionPoints[i][0][1]);

                marker = new OpenLayers.Marker(new OpenLayers.LonLat(point.x,point.y),this.markerIcon.clone());
                marker.setOpacity(0.8);
                marker.polygonID = this.intersectionPoints[i][1];
                marker.polygonEdge = this.intersectionPoints[i][2];
                marker.polylineID = this.intersectionPoints[i][3];
                marker.polylineEdge = this.intersectionPoints[i][5];
                marker.first = false;
                marker.firstLine = ((i===0)&&(!reversed))||((i>0)&&(reversed));
                marker.markerMouseOffset = new OpenLayers.LonLat(0, 0);

                if (marker.polygonEdge < minPolygonEdge) {
                    minPolygonEdge = marker.polygonEdge;
                    minPolygonEdgeIndex = i;
                }

                markerLayer.addMarker(marker);

            }
            if (minPolygonEdgeIndex >= 0) markerLayer.markers[minPolygonEdgeIndex].first = true;

            for (i=0; i<markerLayer.markers.length; i++) {
                markerLayer.markers[i].events.register("mousedown", marker, this.selectActiveMarker);
            }
*/

                        olSolutionLineStrings.push(olLineString);
                    }
                }
            }

            /* // Checking if everything is fine
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
     * @method getRandomColor
     * @return {} returns single localization string or
     */
/*    getRandomColor : function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    },
*/

    /*
     * @method intersection
     *
     * @param {} edge1
     * @param {} edge2
     * @return {} returns single localization string or
     */
    intersection : function(edge1,edge2) {
        var Ax = edge1[0];
        var Ay = edge1[1];
        var Bx = edge1[2];
        var By = edge1[3];
        var Cx = edge2[0];
        var Cy = edge2[1];
        var Dx = edge2[2];
        var Dy = edge2[3];

        var distAB, theCos, theSin, newX, ABpos;

        //  Fail if either line segment is zero-length.
        if ((Ax === Bx && Ay === By) || (Cx === Dx && Cy === Dy)) return null;


        // to-do: tarkista miten käsitellään:
        //  Fail if the segments share an end-point.
        if ((Ax === Cx && Ay === Cy) || (Bx === Cx && By === Cy)
                ||  (Ax === Dx && Ay === Dy) || (Bx === Dx && By === Dy)) {
            return null;
        }

        //  (1) Translate the system so that point A is on the origin.
        Bx-=Ax; By-=Ay;
        Cx-=Ax; Cy-=Ay;
        Dx-=Ax; Dy-=Ay;

        //  Discover the length of segment A-B.
        distAB=Math.sqrt(Bx*Bx+By*By);

        //  (2) Rotate the system so that point B is on the positive X axis.
        theCos=Bx/distAB;
        theSin=By/distAB;
        newX=Cx*theCos+Cy*theSin;
        Cy=Cy*theCos-Cx*theSin;
        Cx=newX;
        newX=Dx*theCos+Dy*theSin;
        Dy=Dy*theCos-Dx*theSin;
        Dx=newX;

        //  Fail if segment C-D doesn't cross line A-B.
        if ((Cy<0.0 && Dy<0.0) || (Cy>=0.0 && Dy>=0.0)) return null;

        //  (3) Discover the position of the intersection point along line A-B.
        ABpos=Dx+(Cx-Dx)*Dy/(Dy-Cy);

        //  Fail if segment C-D crosses line A-B outside of segment A-B.
        if ((ABpos<0.0) || (ABpos>distAB)) return null;

        //  (4) Apply the discovered position to line A-B in the original coordinate system.
        var x = Ax+ABpos*theCos;
        var y = Ay+ABpos*theSin;

        //  Success.
        return [x,y];
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
    }

});
