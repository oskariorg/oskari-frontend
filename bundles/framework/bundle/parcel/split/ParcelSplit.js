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
                parcelLayer.redraw();
                editLayer.redraw();
                break;
            case "OpenLayers.Geometry.LineString":
                this.splitLine(basePolygon,operatingFeature);
                parcelLayer.redraw();
                editLayer.redraw();
                break;
        }
        parcelLayer.redraw();
        return operatingFeature;
    },


    /*
     * @method splitHole
     *
     * @param {} outPolygon
     * @param {} inPolygon
     */
    splitHole : function(outPolygon,inPolygon) {
        var parcelLayer = this.drawPlugin.drawLayer;
        var editLayer = this.drawPlugin.editLayer;
        outPolygon.geometry.addComponent(inPolygon.geometry.components[0]);
        editLayer.addFeatures([inPolygon]);
        parcelLayer.features.splice(parcelLayer.features.length-1,1);
    },


    /*
     * @method splitLine
     *
     * @param {} polygon
     * @param {} line
     */
    splitLine : function(polygon,line) {
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
        var style1;
        style1 = OpenLayers.Util.applyDefaults(style1, OpenLayers.Feature.Vector.style['default']);
        style1.fillColor = this.getRandomColor();
        style1.fillOpacity = 0.6;
        polygon1.style = style1;
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
        var style2;
        style2 = OpenLayers.Util.applyDefaults(style2, OpenLayers.Feature.Vector.style['default']);
        style2.fillColor = this.getRandomColor();
        style2.fillOpacity = 0.6;
        polygon2.style = style2;
        polygon2.polygonCorners = polygonCorners2;

        return [polygon1,polygon2];
    },


    /*
     * @method getRandomColor
     * @return {} returns single localization string or
     */
    getRandomColor : function() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.round(Math.random() * 15)];
        }
        return color;
    },


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
	}

});
