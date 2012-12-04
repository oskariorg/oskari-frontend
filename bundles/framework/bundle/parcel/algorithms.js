        var map, vectors, guides, markers, split, panel, controls, geojson;
        var highlightCtrlPoint, selectCtrlPoint, pointFeatures;
        var highlightCtrlLine, selectCtrlLine;
        var highlightIntsectPoint, selectIntsectPoint, intsectHandler;
		var EPSILON = 10e-8;
        var markerSize = new OpenLayers.Size(21,25);
        var markerOffset = new OpenLayers.Pixel(-(markerSize.w/2), -markerSize.h);
        var markerMouseOffset = new OpenLayers.Pixel(0, 0);
        var markerIcon = new OpenLayers.Icon('img/marker.png',markerSize,markerOffset);
        var intersectionPoints = [];
        var splitPolygons;
        var activeMarker = null;

        // Debug variables
        var nDebugLyers = 5;
		var debugVectors = [];
        var debugFeaturecollection = [];
		for (var i=0; i < nDebugLyers; i++) {
		  debugFeaturecollection[i] = {
	          "type": "FeatureCollection", 
	          "features": [ 
	            {
	              "geometry": {
	                "type": "GeometryCollection", 
	                "geometries": []
	              }, 
	              "type": "Feature", 
	              "properties": {}
	            }
	          ]
	       }
	    }
        var styleMap = [];


        /*
         * 
         */
        function init(){



            map = new OpenLayers.Map("map");
            vectors = new OpenLayers.Layer.Vector("Vectors",
                {isBaseLayer: true}
            );

            split = new OpenLayers.Layer.Vector("Vectors",
                {isBaseLayer: true}
            );

            guides = new OpenLayers.Layer.Vector("Points", {
                styleMap: new OpenLayers.StyleMap({
                    "temporary": new OpenLayers.Style({
                        strokeColor: '#0000cc',
                        strokeOpacity: .8,
                        strokeWidth: 1,
                        fillColor: '#0000cc',
                        fillOpacity: .3,
                        cursor: "default"
                    })
                })
            });

            markers = new OpenLayers.Layer.Markers( "Markers" );

/*            intersects = new OpenLayers.Layer.Vector("Points", {
                styleMap: new OpenLayers.StyleMap({
                    "temporary": new OpenLayers.Style({
                        fill: true,
                        strokeColor: 'red',
                        strokeOpacity: .8,
                        strokeWidth: 1,
                        fillColor: 'black',
//                        fillOpacity: .3,
                        cursor: "default"
                    })
                })
            });
*/
            var splitStyleMap = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                fill:true,
                strokeColor:"black",
                fillOpacity:.3
            }, OpenLayers.Feature.Vector.style["default"]));
            split = new OpenLayers.Layer.Vector("Split polygons",{isBaseLayer: true, styleMap: splitStyleMap});
           
            var wms = new OpenLayers.Layer.WMS( "OpenLayers WMS", "http://vmap0.tiles.osgeo.org/wms/vmap0?", {layers: 'basic'}); 
            OpenLayers.Feature.Vector.style['default']['strokeWidth'] = '2';

//            map.addLayers([wms, vectors]);
            map.addLayers([vectors,guides,split,markers]);
            map.setLayerIndex(vectors, 10);
            map.setLayerIndex(guides, 20);
            map.setLayerIndex(split, 30);
            map.setLayerIndex(markers, 100);

            map.addControl(new OpenLayers.Control.LayerSwitcher());            
            map.addControl(new OpenLayers.Control.MousePosition());



/* Cancel, undo, redo
var draw = new OpenLayers.Control.DrawFeature(
    map.layers[0], OpenLayers.Handler.Path
);
map.addControl(draw);
draw.activate();

OpenLayers.Event.observe(document, "keydown", function(evt) {
    var handled = false;
    switch (evt.keyCode) {
        case 90: // z
            if (evt.metaKey || evt.ctrlKey) {
                draw.undo();
                handled = true;
            }
            break;
        case 89: // y
            if (evt.metaKey || evt.ctrlKey) {
                draw.redo();
                handled = true;
            }
            break;
        case 27: // esc
            draw.cancel();
            handled = true;
            break;
    }
    if (handled) {
        OpenLayers.Event.stop(evt);
    }
});
*/

            geojson = new OpenLayers.Format.GeoJSON();
            
            map.setCenter(new OpenLayers.LonLat(0, 0), 1);

            // Debug variables            
			styleMap[0] = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
			    fill: false,
			    strokeColor: "red"
			}, OpenLayers.Feature.Vector.style["default"]));

            styleMap[1] = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                fill: false,
                strokeColor: "blue"
            }, OpenLayers.Feature.Vector.style["default"]));

            styleMap[2] = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                fill: false,
                strokeColor: "green"
            }, OpenLayers.Feature.Vector.style["default"]));

            styleMap[3] = new OpenLayers.StyleMap(OpenLayers.Util.applyDefaults({
                fill: false,
                strokeColor: "black"
            }, OpenLayers.Feature.Vector.style["default"]));



/*
var style = $.extend(true, {}, OpenLayers.Feature.Vector.style['default']); // get a copy of the default style
style.fillColor = "${getFillColor}";

styleMap[0] = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style(style, {
        context: {
            getFillColor: function (feature) {
                return getRandomColor();
            }
        }
    })
}); 

styleMap[1] = new OpenLayers.StyleMap({
    "default": new OpenLayers.Style(style, {
        context: {
            getFillColor: function (feature) {
                return getRandomColor();
            }
        }
    })
}); 
*/

			for (var i=0; i < styleMap.length; i++) {
                debugVectors[i] = new OpenLayers.Layer.Vector("Debug Vector Layer "+i,{styleMap: styleMap[i]});
                map.addLayer(debugVectors[i]);
                map.setLayerIndex(debugVectors[i], 50+i);
			};




// marker-testi
//var markers = new OpenLayers.Layer.Markers( "Markers" );
//map.addLayer(markers);
//
//var size = new OpenLayers.Size(21,25);
//var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
//var icon = new OpenLayers.Icon('http://www.openlayers.org/dev/img/marker.png',size,offset);
//markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,0),icon));
//
//var halfIcon = icon.clone();
//markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(0,45),halfIcon));
//
//marker = new OpenLayers.Marker(new OpenLayers.LonLat(90,10),icon.clone());
//marker.setOpacity(0.2);
//marker.events.register('mousedown', marker, function(evt) { alert(this.icon.url); OpenLayers.Event.stop(evt); });
//markers.addMarker(marker);











            controls = {
                line: new OpenLayers.Control.DrawFeature(vectors,
                            OpenLayers.Handler.Path),
                polygon: new OpenLayers.Control.DrawFeature(vectors,
                              OpenLayers.Handler.Polygon,{'featureAdded': polygonAdded}),
                hole:  new OpenLayers.Control.DrawFeature(vectors,
                        OpenLayers.Handler.Polygon,{'featureAdded': holeAdded}),
                modify: new OpenLayers.Control.ModifyFeature(vectors)
            };
            
            for(var key in controls) {
                map.addControl(controls[key]);
            }

            highlightCtrlPoint = new OpenLayers.Control.SelectFeature(guides, {
                hover: true,
                highlightOnly: true,
                toggle: false,
                renderIntent: "temporary"
            });
            map.addControl(highlightCtrlPoint);

            selectCtrlPoint = new OpenLayers.Control.SelectFeature(guides, {
                clickout: false,
                toggle: false,
                multiple: false,
                hover: false,
                toggleKey: null,
                multipleKey: null,
                box: false,
                onSelect: pointSelected
//geometryTypes:
            });
            map.addControl(selectCtrlPoint);

            highlightCtrlLine = new OpenLayers.Control.SelectFeature(vectors, {
                hover: true,
                highlightOnly: true,
                toggle: false,
                renderIntent: "temporary"
            });
            map.addControl(highlightCtrlLine);

            selectCtrlLine = new OpenLayers.Control.SelectFeature(vectors, {
                clickout: false, toggle: false,
                multiple: false, hover: false,
                toggleKey: "ctrlKey",
                multipleKey: null,
                box: false,
                onSelect: lineSelected
            });
            map.addControl(selectCtrlLine);

/*            highlightIntsectPoint = new OpenLayers.Control.SelectFeature(intersects, {
                hover: true,
                highlightOnly: true,
                toggle: false,
                renderIntent: "temporary"
                //geometryTypes:
            });
            map.addControl(highlightIntsectPoint);

            selectIntsectPoint = new OpenLayers.Control.SelectFeature(intersects, {
                clickout: true,
                multiple: false,
                hover: false,
                toggleKey: null,
                multipleKey: null,
                box: false,
                toggle: true,
                onSelect: intsectSelected
            });
            map.addControl(selectIntsectPoint);
*/




// Handler to intercept click.
/*            intsectHandler = new OpenLayers.Handler.Click(
                    selectIntsectPoint,  // The select control
                    {
                        click: function(evt)
                        {
console.log("Click");
                        },
                        dblclick: function(evt)
                        {
console.log("Dbl");
console.log(this.layer);
                            var feature = this.layer.getFeatureFromEvent(evt);
                            console.log(feature);
                            this.layer.select(feature);

/*                        },
                        mouseup: function(evt)
                        {
console.log("Up");

                        },
                        mousedown: function(evt) {
console.log("Down"); */
 /*                       }

                    },
                    {
                        single: false,
                        double: true,
                        stopSingle: false,
                        stopDouble: false
                    }
            );


*/
        }

/* Sweep line start */

 // Memoization of edges to process
/*var EventQueue = function(polygon){

  var individual_vertices = polygon.vertices.length - 1;  // last vertex in geojson is equal to first vertex
  this.number_of_events = 2 * (individual_vertices);        // 2 per edge - last event looping back to 0 is handled by +1 below
  this.eventss = [];

  // build up 2 'events' per edge. One for left vertex, one for right.
  for (var i = 0; i < individual_vertices; i++) {
    var a = 2*i;
    var b = 2*i+1;
    this.eventss[a] = {edge:i};
    this.eventss[b] = {edge:i};
    this.eventss[a].vertex = polygon.vertices[i];
    this.eventss[b].vertex = polygon.vertices[i+1];
    if (this.eventss[a].vertex.compare(this.eventss[b].vertex) < 0) {
      this.eventss[a].type = 'left';
      this.eventss[b].type = 'right';
    } else {
      this.eventss[a].type = 'right';
      this.eventss[b].type = 'left';
    }
  };

  // sort events lexicographically
  this.eventss.sort(function(a,b){ return a.vertex.compare(b.vertex); });
};

*/


// Memoization of edges to process
var EventQueue = function(polygon){

  var individual_vertices = polygon.vertices.length - 1;  // last vertex in geojson is equal to first vertex
  this.number_of_events = 2 * (individual_vertices);        // 2 per edge - last event looping back to 0 is handled by +1 below
  this.events = [];

  // build up 2 'events' per edge. One for left vertex, one for right.
  for (var i = 0; i < individual_vertices; i++) {
    var a = 2*i;
    var b = 2*i+1;
    this.events[a] = {edge:i};
    this.events[b] = {edge:i};
    this.events[a].vertex = polygon.vertices[i];
    this.events[b].vertex = polygon.vertices[i+1];
    if (this.events[a].vertex.compare(this.events[b].vertex) < 0) {
      this.events[a].type = 'left';
      this.events[b].type = 'right';
    } else {
      this.events[a].type = 'right';
      this.events[b].type = 'left';
    }
  };

  // sort events lexicographically
  this.events.sort(function(a,b){ return a.vertex.compare(b.vertex); });
};


/*


        // Memoization of edges to process
        function doEventQueue(eq,polygon){
console.log("D");
console.log(eq);
            var individual_vertices = polygon.vertices.length - 1;  // last vertex in geojson is equal to first vertex
            eq.number_of_events = 2 * (individual_vertices);        // 2 per edge - last event looping back to 0 is handled by +1 below
            eq.eventss = [];

            // build up 2 'events' per edge. One for left vertex, one for right.
            for (var i = 0; i < individual_vertices; i++) {
eq.eventss[2*i] = 2*i;
eq.eventss[2*i+1] = 2*i+1;
                var a = 2*i;
                var b = 2*i+1;
                eq.eventss[a] = {edge:i, type:null, vertex: null};
                eq.eventss[b] = {edge:i, type:null, vertex: null};
                eq.eventss[a].vertex = polygon.vertices[i];
                eq.eventss[b].vertex = polygon.vertices[i+1];
                if (eq.eventss[a].vertex.compare(eq.eventss[b].vertex) < 0) {
                    eq.eventss[a].type = 'left';
                    eq.eventss[b].type = 'right';
                } else {
                    eq.eventss[a].type = 'right';
                    eq.eventss[b].type = 'left';
                }
//console.log(eventQueue.eventss);
console.log(i);
console.log(eq.eventss);
            }
//console.log("00000000000000000000");
//console.log(eventQueue);
            // sort events lexicographically
//            eventQueue.eventss.sort(function(a,b){ return a.vertex.compare(b.vertex); });

console.log("TYRTRYT");
console.log(eq.eventss);
        }

*/



        var Point = function(x,y){
            this.x = x
            this.y = y
        };

        // Determines the xy lexicographical order of two points
        Point.prototype.compare = function(other_point){

            // x-coord first
            if (this.x > other_point.x) return  1;
            if (this.x < other_point.x) return -1;

            // y-coord second
            if (this.y > other_point.y) return  1;
            if (this.y < other_point.y) return -1;

            // they are the same point
            return 0;
        };

        // tests if point is Left|On|Right of the line P0 to P1.
        //
        // returns:
        //  >0 for left of the line
        //  0 for on the line
        //  <0 for right of the line
        Point.prototype.is_left = function(p0, p1){
            return (p1.x - p0.x) * (this.y - p0.y) - (this.x - p0.x) * (p1.y - p0.y);
        };




        var Polygon = function(point_array){
            this.vertices = point_array
        };







        // Tests polygon simplicity.
        // returns true if simple, false if not.
        Polygon.prototype.simple_polygon = function(){

            var event_queue  = new EventQueue(this);
            var sweep_line   = new SweepLine(this);
            // This loop processes all events in the sorted queue
            // Events are only left or right vertices
console.log("#");
console.log(sweep_line);
console.log(event_queue);


//event_queue.events.pop();
            var i = 0;

//            while (event_queue.events.length > 0) {
            while (i < event_queue.events.length) {
                var e = event_queue.events[i];
                if (e.type == 'left') {
                    var s = sweep_line.add(e);
console.log("A");
console.log(s);
console.log(sweep_line.tree.toString());

                    if (sweep_line.intersect(s, s.above)) {
                        return false;
                    }
                    if (sweep_line.intersect(s, s.below)){
                        return false;
                    }

                } else {
                    var s = sweep_line.find(e);
console.log("B");
console.log(s);
console.log(sweep_line.tree.toString());
                    if (sweep_line.intersect(s.above, s.below)) {
                        console.log("third");
                        return false;
                    }

                    sweep_line.remove(s);
                }
                i++;
                e = event_queue.events[i];
            }
            return true;
        };

        Polygon.prototype.intersections = function(){
return null;
            var event_queue  = new EventQueue(this);
            var sweep_line   = new SweepLine(this);
            var intersectionList = [];
            var edge1 = [];
            var edge2 = [];
            var ind1;
            var ind2;
            var p;

            // This loop processes all events in the sorted queue
            // Events are only left or right vertices
            while (e = event_queue.events.shift()) {
console.log("000");
console.log(e);
                if (e.type == 'left') {
console.log("A");
                    var s = sweep_line.add(e);
                    ind1 = (s.edge+1)%this.vertices.length;
                    if (sweep_line.intersect(s, s.above)) {
                        ind2 = (s.above.edge+1)%this.vertices.length;
                        edge1[0] = this.vertices[s.edge].x;
                        edge1[1] = this.vertices[s.edge].y;
                        edge1[2] = this.vertices[ind1].x;
                        edge1[3] = this.vertices[ind1].y;
                        edge2[0] = this.vertices[s.above.edge].x;
                        edge2[1] = this.vertices[s.above.edge].y;
                        edge2[2] = this.vertices[ind2].x;
                        edge2[3] = this.vertices[ind2].y;
console.log("a");
                        p = intersection(edge1,edge2);
                        intersectionList.push([p,s.edge,s.above.edge]);
                    }
                    if (sweep_line.intersect(s, s.below)) {
                        ind2 = (s.below.edge+1)%this.vertices.length;
                        edge1[0] = this.vertices[s.edge].x;
                        edge1[1] = this.vertices[s.edge].y;
                        edge1[2] = this.vertices[ind1].x;
                        edge1[3] = this.vertices[ind1].y;
                        edge2[0] = this.vertices[s.below.edge].x;
                        edge2[1] = this.vertices[s.below.edge].y;
                        edge2[2] = this.vertices[ind2].x;
                        edge2[3] = this.vertices[ind2].y;
console.log("b");
                        p = intersection(edge1,edge2);
                        intersectionList.push([p,s.edge,s.below.edge]);
                    }
                } else {
console.log("C");
                    var s = sweep_line.find(e);
                    if (sweep_line.intersect(s.above, s.below)) {
                        ind1 = (s.above.edge+1)%this.vertices.length;
                        ind2 = (s.below.edge+1)%this.vertices.length;
                        edge1[0] = this.vertices[s.above.edge].x;
                        edge1[1] = this.vertices[s.above.edge].y;
                        edge1[2] = this.vertices[ind1].x;
                        edge1[3] = this.vertices[ind1].y;
                        edge2[0] = this.vertices[s.below.edge].x;
                        edge2[1] = this.vertices[s.below.edge].y;
                        edge2[2] = this.vertices[ind2].x;
                        edge2[3] = this.vertices[ind2].y;
console.log("c");
                        p = intersection(edge1,edge2);
                        intersectionList.push([p, s.above.edge,s.below.edge]);
                    }
                    sweep_line.remove(s);
                }
            }
            return intersectionList;
        };





        /*****
         *
         *   RedBlackNode.js
         *
         *   copyright 2004, Kevin Lindsey
         *   licensing info available at: http://www.kevlindev.com/license.txt
         *
         *****/


        /*****
         *
         *   constructor
         *
         *****/
        var RedBlackNode = function(value) {
            this._left   = null;
            this._right  = null;
            this._value  = value;
            this._height = 1;
            this.VERSION = 1.0;
        }


        /*****
         *
         *   add
         *
         *****/
        RedBlackNode.prototype.add = function(value) {
            var relation = value.compare(this._value);
            var addResult;
            var result;
            var newNode;

            if ( relation != 0 ) {
                if ( relation < 0 ) {
                    if ( this._left != null ) {
                        addResult = this._left.add(value);
                        this._left = addResult[0];
                        newNode = addResult[1];
                    } else {
                        newNode = this._left = new RedBlackNode(value);
                    }
                } else if ( relation > 0 ) {
                    if ( this._right != null ) {
                        addResult = this._right.add(value);
                        this._right = addResult[0];
                        newNode = addResult[1];
                    } else {
                        newNode = this._right = new RedBlackNode(value);
                    }
                }
                result = [this.balanceTree(), newNode];
            } else {
                result = [this, this];
            }

            return result;
        };


        /*****
         *
         *   balanceTree
         *
         *****/
        RedBlackNode.prototype.balanceTree = function() {
            var leftHeight  = (this._left  != null) ? this._left._height  : 0;
            var rightHeight = (this._right != null) ? this._right._height : 0;
            var result;

            if ( leftHeight > rightHeight + 1 ) {
                result = this.swingRight();
            } else if ( rightHeight > leftHeight + 1 ) {
                result = this.swingLeft();
            } else {
                this.setHeight();
                result = this;
            }

            return result;
        };


        /*****
         *
         *   join
         *
         *****/
        RedBlackNode.prototype.join = function(that) {
            var result;

            if ( that == null ) {
                result = this;
            } else {
                var top;

                if ( this._height > that._height ) {
                    top = this;
                    top._right = that.join(top._right);
                } else {
                    top = that;
                    top._left = this.join(top._left);
                }

                result = top.balanceTree();
            }

            return result;
        };


        /*****
         *
         *   moveLeft
         *
         *****/
        RedBlackNode.prototype.moveLeft = function() {
            var right = this._right;
            var rightLeft = right._left;

            this._right = rightLeft;
            right._left = this;
            this.setHeight();
            right.setHeight();

            return right;
        };


        /*****
         *
         *   moveRight
         *
         *****/
        RedBlackNode.prototype.moveRight = function() {
            var left = this._left;
            var leftRight = left._right;

            this._left = leftRight;
            left._right = this;
            this.setHeight();
            left.setHeight();

            return left;
        };


        /*****
         *
         *   remove
         *
         *****/
        RedBlackNode.prototype.remove = function(value) {
            var relation = value.compare(this._value);
            var remResult;
            var result;
            var remNode;

            if ( relation != 0 ) {
                if ( relation < 0 ) {
                    if ( this._left != null ) {
                        remResult = this._left.remove(value);
                        this._left = remResult[0];
                        remNode = remResult[1];
                    } else {
                        remNode = null;
                    }
                } else {
                    if ( this._right != null ) {
                        remResult = this._right.remove(value);
                        this._right = remResult[0];
                        remNode = remResult[1];
                    } else {
                        remNode = null;
                    }
                }

                result = this;
            } else {
                remNode = this;

                if ( this._left == null ) {
                    result = this._right;
                } else if ( this._right == null ) {
                    result = this._left;
                } else {
                    result = this._left.join(this._right);
                    this._left = null;
                    this._right = null;
                }
            }

            if ( remNode != null ) {
                if ( result != null ) {
                    return [result.balanceTree(), remNode];
                } else {
                    return [result, remNode];
                }
            } else {
                return [this, null];
            }
        };


        /*****
         *
         *   setHeight
         *
         *****/
        RedBlackNode.prototype.setHeight = function() {
            var leftHeight  = (this._left  != null) ? this._left._height  : 0;
            var rightHeight = (this._right != null) ? this._right._height : 0;

            this._height = (leftHeight < rightHeight) ? rightHeight + 1 : leftHeight + 1;
        };


        /*****
         *
         *   swingLeft
         *
         *****/
        RedBlackNode.prototype.swingLeft = function() {
            var right      = this._right;
            var rightLeft  = right._left;
            var rightRight = right._right;
            var left       = this._left;

            var leftHeight       = (left       != null ) ? left._height       : 0;
            var rightLeftHeight  = (rightLeft  != null ) ? rightLeft._height  : 0;
            var rightRightHeight = (rightRight != null ) ? rightRight._height : 0;

            if ( rightLeftHeight > rightRightHeight ) {
                this._right = right.moveRight();
            }

            return this.moveLeft();
        };


        /*****
         *
         *   swingRight
         *
         *****/
        RedBlackNode.prototype.swingRight = function() {
            var left      = this._left;
            var leftRight = left._right;
            var leftLeft  = left._left;
            var right     = this._right;

            var rightHeight     = (right     != null ) ? right._height     : 0;
            var leftRightHeight = (leftRight != null ) ? leftRight._height : 0;
            var leftLeftHeight  = (leftLeft  != null ) ? leftLeft._height  : 0;

            if ( leftRightHeight > leftLeftHeight ) {
                this._left = left.moveLeft();
            }

            return this.moveRight();
        };


        /*****
         *
         *   traverse
         *
         *****/
        RedBlackNode.prototype.traverse = function(func) {
            if ( this._left  != null ) this._left.traverse(func);
            func(this);
            if ( this._right != null ) this._right.traverse(func);
        };


        /*****
         *
         *   toString
         *
         *****/
        RedBlackNode.prototype.toString = function() {
            return this._value.toString();
        };







        /*****
         *
         * RedBlackTree.js (actually an AVL)
         *
         * copyright 2004, Kevin Lindsey
         * licensing info available at: http://www.kevlindev.com/license.txt
         *
         * uses duck typing for comparator to determine left and rightedness.
         * added objects must implement a method called .order. eg. a.order(b);
         *
         * .order should return:
         *
         * -1 a <   b
         *  0 a === b
         *  1 a >   b
         *
         *****/


        /*****
         *
         *   constructor
         *
         *****/
        var RedBlackTree = function () {
            this._root      = null;
            this._cursor    = null;
            this._ancestors = [];
            this.VERSION = 1.0;
        }


        /*****  private methods *****/

        /*****
         *
         *   _findNode
         *
         *****/
        RedBlackTree.prototype._findNode = function(value, saveAncestors) {
            if ( saveAncestors == null ) saveAncestors = false;

            var result = this._root;

            if ( saveAncestors ) {
                this._ancestors = [];
            }

            while ( result != null ) {

                var relation = value.compare(result._value);

                if ( relation != 0 ) {
                    if ( saveAncestors ) {
                        this._ancestors.push(result);
                    }
                    if ( relation < 0 ) {
                        result = result._left;
                    } else {
                        result = result._right;
                    }
                } else {
                    break;
                }
            }

            return result;
        };


        /*****
         *
         *   _maxNode
         *
         *****/
        RedBlackTree.prototype._maxNode = function(node, saveAncestors) {
            if ( node == null ) node = this._root;
            if ( saveAncestors == null ) saveAncestors = false;

            if ( node != null ) {
                while ( node._right != null ) {
                    if ( saveAncestors ) {
                        this._ancestors.push(node);
                    }
                    node = node._right;
                }
            }

            return node;
        };


        /*****
         *
         *   _minNode
         *
         *****/
        RedBlackTree.prototype._minNode = function(node, saveAncestors) {
            if ( node == null ) node = this._root;
            if ( saveAncestors == null ) saveAncestors = false;

            if ( node != null ) {
                while ( node._left != null ) {
                    if ( saveAncestors ) {
                        this._ancestors.push(node);
                    }
                    node = node._left;
                }
            }

            return node;
        };


        /*****
         *
         *   _nextNode
         *
         *****/
        RedBlackTree.prototype._nextNode = function(node) {
            if ( node != null ) {
                if ( node._right != null ) {
                    this._ancestors.push(node);
                    node = this._minNode(node._right, true);
                } else {
                    var ancestors = this._ancestors;
                    parent = ancestors.pop();

                    while ( parent != null && parent._right === node ) {
                        node = parent;
                        parent = ancestors.pop();
                    }

                    node = parent;
                }
            } else {
                this._ancestors = [];
                node = this._minNode(this._root, true);
            }

            return node;
        };


        /*****
         *
         *   _previousNode
         *
         *****/
        RedBlackTree.prototype._previousNode = function(node) {
            if ( node != null ) {
                if ( node._left != null ) {
                    this._ancestors.push(node);
                    node = this._maxNode(node._left, true);
                } else {
                    var ancestors = this._ancestors;
                    parent = ancestors.pop();

                    while ( parent != null && parent._left === node ) {
                        node = parent;
                        parent = ancestors.pop();
                    }

                    node = parent;
                }
            } else {
                this._ancestors = [];
                node = this._maxNode(this._root, true);
            }

            return node;
        };


        /*****  public methods  *****/

        /*****
         *
         *   add
         *
         *****/
        RedBlackTree.prototype.add = function(value) {
            var result;

            if ( this._root == null ) {
console.log("null");
                result = this._root = new RedBlackNode(value);
            } else {
console.log("else");
console.log(value);
                var addResult = this._root.add(value);
console.log(this.toString());
                this._root = addResult[0];
                result = addResult[1];
console.log();
            }

            return result;
        };


        /*****
         *
         *   find
         *
         *****/
        RedBlackTree.prototype.find = function(value) {
            var node = this._findNode(value);

            return ( node != null ) ? node._value : null;
        };


        /*****
         *
         *   findNext
         *
         *****/
        RedBlackTree.prototype.findNext = function(value) {
            var current = this._findNode(value, true);

            current = this._nextNode(current);

            return (current != null ) ? current._value : null;
        };


        /*****
         *
         *   findPrevious
         *
         *****/
        RedBlackTree.prototype.findPrevious = function(value) {
            var current = this._findNode(value, true);

            current = this._previousNode(current);

            return (current != null ) ? current._value : null;
        };


        /*****
         *
         *   max
         *
         *****/
        RedBlackTree.prototype.max = function() {
            var result = this._maxNode();

            return ( result != null ) ? result._value : null;
        };


        /*****
         *
         *   min
         *
         *****/
        RedBlackTree.prototype.min = function() {
            var result = this._minNode();

            return ( result != null ) ? result._value : null;
        };


        /*****
         *
         *   next
         *
         *****/
        RedBlackTree.prototype.next = function() {
            this._cursor = this._nextNode(this._cursor);

            return ( this._cursor ) ? this._cursor._value : null;
        };


        /*****
         *
         *   previous
         *
         *****/
        RedBlackTree.prototype.previous = function() {
            this._cursor = this._previousNode(this._cursor);

            return ( this._cursor ) ? this._cursor._value : null;
        };


        /*****
         *
         *   remove
         *
         *****/
        RedBlackTree.prototype.remove = function(value) {
            var result;

            if ( this._root != null ) {
                var remResult = this._root.remove(value);

                this._root = remResult[0];
                result = remResult[1];
            } else {
                result = null;
            }

            return result;
        };


        /*****
         *
         *   traverse
         *
         *****/
        RedBlackTree.prototype.traverse = function(func) {
            if ( this._root != null ) {
                this._root.traverse(func);
            }
        };


        /*****
         *
         *   toString
         *
         *****/
        RedBlackTree.prototype.toString = function() {
            var lines = [];

            if ( this._root != null ) {
                var indentText = "  ";
                var stack = [[this._root, 0, "^"]];

                while ( stack.length > 0 ) {
                    var current = stack.pop();
                    var node    = current[0];
                    var indent  = current[1];
                    var line    = "";

                    for ( var i = 0; i < indent; i++ ) {
                        line += indentText;
                    }

                    line += current[2] + "(" + node.toString() + ")";
                    lines.push(line);

                    if ( node._right != null ) stack.push([node._right, indent+1, "R"]);
                    if ( node._left  != null ) stack.push([node._left,  indent+1, "L"]);
                }
            }

            return lines.join("\n");
        };









        //
        // Javascript port of http://softsurfer.com/Archive/algorithm_0108/algorithm_0108.htm
        //
        // The Intersections for a Set of 2D Segments, and Testing Simple Polygons
        //
        // Shamos-Hoey Algorithm implementation in Javascript
        //


        // A container class for segments (or edges) of the polygon to test
        // Allows storage and retrieval from the Balanced Binary Tree
        var SweepLineSeg = function(ev){
            this.edge = ev.edge;
            this.left_point = null;
            this.right_point = null;
            this.above = null;
            this.below = null;
        };

        // required comparator for binary tree storage. Sort by y axis of the
        // points where the segment crosses L (eg, the left point)
        SweepLineSeg.prototype.compare = function(sls){
            if (this.left_point.y > sls.left_point.y) return 1;
            if (this.left_point.y < sls.left_point.y) return -1;
            return 0;
        };

        SweepLineSeg.prototype.toString = function(){
            return "edge:" + this.edge;
        };


        // Main SweepLine class.
        // For full details on the algorithm used, consult the C code here:
        // http://softsurfer.com/Archive/algorithm_0108/algorithm_0108.htm
        //
        // This is a direct port of the above C to Javascript
        var SweepLine = function(polygon){
            this.tree    = new RedBlackTree();
            this.polygon = polygon;
        };

        // Add Algorithm 'event' (more like unit of analysis) to queue
        // Units are segments or distinct edges of the polygon.
        SweepLine.prototype.add = function(ev){
console.log("-------");
console.log(ev);
console.log(this.tree.toString());

            // build up segment data
            var seg = new SweepLineSeg(ev);
console.log("@@");
console.log(seg);
console.log(new SweepLineSeg(ev));
            var p1 = this.polygon.vertices[seg.edge];
            var p2 = this.polygon.vertices[seg.edge + 1];

            // if it is being added, then it must be a LEFT edge event
            // but need to determine which endpoint is the left one first
            if (p1.compare(p2) < 0){
                seg.left_point  = p1;
                seg.right_point = p2;
            } else {
                seg.left_point  = p2;
                seg.right_point = p1;
            }

            // Add node to tree and setup linkages to "above" and "below"
            // edges as per algorithm
            var nd = this.tree.add(seg);
console.log(nd);
console.log(this.tree.toString());
console.log("=====-------");
            var nx = this.tree.findNext(nd._value);
            var np = this.tree.findPrevious(nd._value);
            if (nx) {
                seg.above = nx;
                seg.above.below = seg;
            }
            if (np) {
                seg.below = np;
                seg.below.above = seg;
            }
            return seg;
        };


        SweepLine.prototype.find = function(ev){

            // need a segment to find it in the tree
            // TODO: TIDY THIS UP!!!
            var seg = new SweepLineSeg(ev);
            var p1 = this.polygon.vertices[seg.edge];
            var p2 = this.polygon.vertices[seg.edge + 1];

            // if it is being added, then it must be a LEFT edge event
            // but need to determine which endpoint is the left one first
            if (p1.compare(p2) < 0){
                seg.left_point  = p1;
                seg.right_point = p2;
            } else {
                seg.left_point  = p2;
                seg.right_point = p1;
            }

            var nd = this.tree.find(seg);

            if (nd){
                return nd;
            } else {
                return false;  // BUG: unsure what to return here. Probably not false.
            }
        };

        // When removing a node from the tree, ensure the above and below links are
        // passed on to adjacent nodes before node is deleted
        SweepLine.prototype.remove = function(seg){

            // Pretty sure there is a bug here as the tree isn't getting pruned correctly.
            // In fact, I thin the remove method is removing the wrong elements from the list.
            //
            try{
                var nd = this.tree.find(seg);
            } catch (err) {
                return;
            }



            var nx = this.tree.findNext(nd);
            if (nx){
                nx.below = seg.below;
            }

            var np = this.tree.findPrevious(nd);
            if (np){
                np.above = seg.above;
            }

            this.tree.remove(seg);
        };

        // test intersect of 2 segments and return: false=none, true=intersect
        SweepLine.prototype.intersect = function(s1, s2){
            if (!s1 || !s2) return false; // no intersect if either segment doesn't exist

            // check for consecutive edges in polygon
            var e1 = s1.edge;
            var e2 = s2.edge;

            if (((e1+1)%this.polygon.vertices.length === e2) || (e1 === (e2+1)%this.polygon.vertices.length))
                return false;      // no non-simple intersect since consecutive

            // test for existence of an intersect point
            var lsign = s2.left_point.is_left(s1.left_point, s1.right_point);     // s2 left point sign
            var rsign = s2.right_point.is_left(s1.left_point, s1.right_point);    // s2 right point sign
            if (lsign * rsign > 0) // s2 endpoints have same sign relative to s1
                return false;      // => on same side => no intersect is possible

            lsign = s1.left_point.is_left(s2.left_point, s2.right_point);     // s1 left point sign
            rsign = s1.right_point.is_left(s2.left_point, s2.right_point);    // s1 right point sign
            if (lsign * rsign > 0) // s1 endpoints have same sign relative to s2
                return false;      // => on same side => no intersect is possible

            return true;           // segments s1 and s2 straddle. Intersect exists.
        }


/* Sweep line end */


        /*
         * 
         */
        function serialize() {
            document.getElementById('features').value = geojson.write(vectors.features, true);
        }

        /*
         *
         */
        function loadData() {

        }

        /*
         * 
         */
        function deserialize() {
            var element = document.getElementById('text');
            var features = geojson.read(element.value);
            var bounds;
            if(features) {
                if(features.constructor != Array) {
                    features = [features];
                }
                for(var i=0; i<features.length; ++i) {
                    if (!bounds) {
                        bounds = features[i].geometry.getBounds();
                    } else {
                        bounds.extend(features[i].geometry.getBounds());
                    }
                    
                }
                vectors.addFeatures(features);
                map.zoomToExtent(bounds);
                var plural = (features.length > 1) ? 's' : '';
                element.value = features.length + ' feature' + plural + ' added'
            } else {
                element.value = 'Bad input';
            }
        }

        /*
         * 
         */
        function intersect() {
            var features = vectors.features;
            var feat1, feat2, intersects12, intersects21;
            var parts = [];
            // reset attributes
            for(var i=0; i<features.length; ++i) {
                features[i].attributes.intersectsWith = [];
            }
            for(var i=0; i<features.length-1; ++i) {
                feat1 = features[i];
                for(var j=i+1; j<features.length; ++j) {
                    feat2 = features[j];
                    intersects12 = feat1.geometry.intersects(feat2.geometry);
                    if(intersects12) {
                        feat1.attributes.intersectsWith.push("f" + j);
                        parts.push("f" + i + " intersects f" + j + "\n");
                    }
                    intersects21 = feat2.geometry.intersects(feat1.geometry);
                    if(intersects21) {
                        feat2.attributes.intersectsWith.push("f" + i);
                        parts.push("f" + j + " intersects f" +  i + "\n");
                    }
                    if(intersects12 != intersects21) {
                        parts.push("trouble with " + i + " and " + j + "\n");
                    }
                }
            }
            if(parts.length > 0) {
                document.getElementById("intersections").value = parts.join("");
            } else {
                document.getElementById("intersections").value = "no intersections";
            }
        }


        /*
         * 
         */
		function swap(array,i,j) {
			var tmp = array[i];
			array[i] = array[j];
			array[j] = tmp;			
		}


        /*
         * 
         */
		function getRandomColor() {
		    var letters = '0123456789ABCDEF'.split('');
		    var color = '#';
		    for (var i = 0; i < 6; i++) {
		        color += letters[Math.round(Math.random() * 15)];
		    }
		    return color;
		};


        /*
         * 
         */
		function partition(array, begin, end, pivot) {
		 	var piv=array[pivot];
		 	swap(array,pivot,end-1);
		 	var store=begin;
		 	for(var i=begin; i<end-1; i++) {
				var toSwap = false;
	            for (var j=0; j<array[i].length; j++) {
	                if (Math.abs(array[i][j]-piv[j])>EPSILON) {
	                	if (array[i][j]<=piv[j]) toSwap = true;
	            	    break;
	                }
	            }				
		 		if (toSwap) {
		 			swap(array,store,i);
		 			store = store+1;
		 		}
		 	}
		 	swap(array,end-1,store);		 
		 	return store;
		 }
 
 
        /*
         * 
         */
		 function qsort(array, begin, end) {
		 	if(end-1>begin) {
		 		var pivot=begin+Math.floor(Math.random()*(end-begin));		 
		 		pivot=partition(array, begin, end, pivot);		 
		 		qsort(array, begin, pivot);
		 		qsort(array, pivot+1, end);
			}
		}
 
        /*
         * 
         */
 		function sortEdges(edges) {
            return qsort(edges, 0, edges.length);
 		}

        /*
         * 
         */
 		function reviseEdges(edges) {
 			var revisedEdge = [];
 			var revise;
            for (var i=0; i<edges.length; i++) {
                if (Math.abs(edges[i][0]-edges[i][2])>EPSILON) {
                	revise = (edges[i][0]>edges[i][2])
                } else {
                	revise = (edges[i][1]>edges[i][3])                	
                }
                if (revise) {
                	revisedEdge = [edges[i][2],edges[i][3],edges[i][0],edges[i][1]];
                	edges[i] = revisedEdge;
                }
            }
 		}    
    
    
    
        /*
         * 
         */
 		function createBoundingBox(edges) {
			var bbox = [];
            for (var i=0; i<edges.length; i++) {           
            	bbox[i] = [Number.MAX_VALUE, Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE];
	            for (var j=0; j<edges[i].length; j++) {                       	
	            	for (var k=0; k<2; k++) {
                        for (var l=0; l<2; l++) {
                        	var m = 2*k+l;
                        	var n = 2+l;
	                        if (edges[i][j][m]<bbox[i][l]) bbox[i][l]=edges[i][j][m];
                    	    if (edges[i][j][m]>bbox[i][n]) bbox[i][n]=edges[i][j][m];
                    	}
                   }
            	}
            }
			return bbox;
 		}

        /*
         * 
         */
 		function applyBoundingBox(edges,bbox) {
 			var newArray = [];
            for (var i=0; i<bbox.length; i++) {
                loop_edges:
                for (var j=0; j<edges.length; j++) {
            	    for (var k=0; k<2; k++) {
                        for (var l=0; l<2; l++) {            	    	
                        	var m = 2*k+l;
                            if ((edges[j][m]<bbox[i][l])||(edges[j][m]>bbox[i][2+l])) continue loop_edges;
                        }
            	    }            	
            	   newArray.push(edges[j]);
            	}	
            }
 			return newArray;
 		}

        /*
         * 
         */
        function applySweepLine(source,target) {
        	var newArray = [];
/*        	var j;
            for (var i=0; i<source.length; i++) {
	            for (var j=0; j<target.length; j++) {
	                for (var k=0; k<target.length; k++) {
	                    if (source[i][2*k]>=target[j][0]= {
	                    	
	                    }
	                }
					
    	        }
            }
*/        	return source;
        }


        /*
         * 
         */
        function update() {
            var vertices;
            var geometry;
            // reset modification mode
            controls.modify.mode = OpenLayers.Control.ModifyFeature.RESHAPE;
            var rotate = document.getElementById("rotate").checked;
            if(rotate) {
                controls.modify.mode |= OpenLayers.Control.ModifyFeature.ROTATE;
            }
            var resize = document.getElementById("resize").checked;
            if(resize) {
                controls.modify.mode |= OpenLayers.Control.ModifyFeature.RESIZE;
                var keepAspectRatio = document.getElementById("keepAspectRatio").checked;
                if (keepAspectRatio) {
                    controls.modify.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
                }
            }
            var drag = document.getElementById("drag").checked;
            if(drag) {
                controls.modify.mode |= OpenLayers.Control.ModifyFeature.DRAG;
            }
            if (rotate || drag) {
                controls.modify.mode &= ~OpenLayers.Control.ModifyFeature.RESHAPE;
            }
            controls.modify.createVertices = document.getElementById("createVertices").checked;

            if (document.getElementById("remove").checked) {
                guides.removeAllFeatures();
                var features = vectors.features;
                pointFeatures = {
                    coordinates: [],
                    featureId: [],
                    id: []                    
                };
                for(var i=0; i<features.length; i++) {
                    geometry = features[i].geometry;
                    if (geometry.CLASS_NAME=="OpenLayers.Geometry.LineString") {
                        vertices = geometry.getVertices();
                        for (var j=0; j<vertices.length; j++) {
                            var newPointFeature = new OpenLayers.Feature.Vector(vertices[j].clone()); 
                            pointFeatures.coordinates.push(newPointFeature);
                            pointFeatures.featureId.push(features[i].id);
                            pointFeatures.id.push(vertices[j].id);
                        }
                    }
                }
                guides.addFeatures(pointFeatures.coordinates);
                highlightCtrlPoint.activate();
                selectCtrlPoint.activate();
            } else {
                guides.removeAllFeatures();    
                highlightCtrlPoint.deactivate();
                selectCtrlPoint.deactivate(); 
            }
            
            if (document.getElementById("removeLine").checked) {
                highlightCtrlLine.activate();
                selectCtrlLine.activate(); 
            } else {
                highlightCtrlLine.deactivate();
                selectCtrlLine.deactivate(); 
            }

            if (document.getElementById("move").checked) {
                controls.modify.deactivate();
map.setLayerIndex(markers, 100000);
controls.modify.mode = OpenLayers.Control.ModifyFeature.DRAG;
                var marker;
                for (var i=0; i<markers.markers.length; i++) {
                    markers.markers[i].events.register("mousedown", marker, selectActiveMarker);
                }
            } else {
                controls.modify.activate();
                for (var i=0; i<markers.markers.length; i++) {
                    map.events.unregister("mousedown",markers.markers[i],selectActiveMarker);
                }
                map.events.unregister("mouseup", map, freezeActiveMarker);
                map.events.unregister("mousemove", map, moveActiveMarker);
                markers.redraw();
            }

        }


        /*
         *
         */
        function selectActiveMarker(evt) {
            OpenLayers.Event.stop(evt);
            var xy = map.events.getMousePosition(evt);
            var pixel = new OpenLayers.Pixel(xy.x,xy.y);
            var xyLonLat = map.getLonLatFromPixel(pixel);
            activeMarker = evt.object;
            markerMouseOffset.lon = xyLonLat.lon-activeMarker.lonlat.lon;
            markerMouseOffset.lat = xyLonLat.lat-activeMarker.lonlat.lat;
            map.events.register("mouseup", map, freezeActiveMarker);
            map.events.register("mousemove", map, moveActiveMarker);
        }

        /*
         *
         */
        function moveActiveMarker(evt) {
            var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y))
            lonlat.lon -= markerMouseOffset.lon;
            lonlat.lat -= markerMouseOffset.lat;
            activeMarker.lonlat = activeMarkerProjection(lonlat);
//            activeMarker.lonlat.lon -= markerMouseOffset.lon;
//            activeMarker.lonlat.lat -= markerMouseOffset.lat;
            markers.redraw();
            // var lonlatGCS = OpenLayers.Layer.SphericalMercator.inverseMercator(lonlat.lon, lonlat.lat);
            OpenLayers.Event.stop(evt);
        }

        /*
         *
         */
        function freezeActiveMarker(evt) {
            map.events.unregister("mousemove",map, moveActiveMarker);
            map.events.unregister("mouseup",map, freezeActiveMarker);
            OpenLayers.Event.stop(evt);


            var lonlat = map.getLonLatFromPixel(new OpenLayers.Pixel(evt.xy.x,evt.xy.y))
            lonlat.lon -= markerMouseOffset.lon;
            lonlat.lat -= markerMouseOffset.lat;
            activeMarker.lonlat = activeMarkerProjection(lonlat);


/*

            var pixel = new OpenLayers.Pixel(evt.xy.x,evt.xy.y);
            activeMarker.lonlat = map.getLonLatFromPixel(pixel);
            activeMarker.lonlat.lon -= markerMouseOffset.lon;
            activeMarker.lonlat.lat -= markerMouseOffset.lat;
*/
            var line = vectors.getFeatureById(activeMarker.polylineID);
//            var vertices = line.geometry.getVertices();
            var edgeInd = activeMarker.polylineEdge;

/*            var comp = line.geometry.components;
            // Lisää tarvittaessa uudet välipisteet
            for (var i = 1; i < markerInfo.length; i++) {
                var ind1 = markerInfo[i-1].index;
                var x1 = markers.markers[ind1].lonlat.lon;
                var y1 = markers.markers[ind1].lonlat.lat;
                var ind2 = markerInfo[i].index;
                var x2 = markers.markers[ind2].lonlat.lon;
                var y2 = markers.markers[ind2].lonlat.lat;
                var x12 = 0.5*(x1+x2);
                var y12 = 0.5*(y1+y2);
                var midPoint = new OpenLayers.Geometry.Point(x12,y12);
                console.log("line: "+line);
                comp.splice(comp.length-1,0,midPoint);
                markers.markers[i].polylineEdge++;
            }
*/
            // Siirretään edellisen pisteen sijainti
/*            var vertices = line.geometry.getVertices();
            var xm = activeMarker.lonlat.lon;
            var ym = activeMarker.lonlat.lat;

//            var dist1 = distance(vertices[edgeInd],activeMarker.lonlat0);
            var dist2 = distance(vertices[edgeInd+1],activeMarker.lonlat);
            var unitVec = [];
            unitVec[0] = (xm-vertices[edgeInd+1].x)/dist2;
            unitVec[1] = (ym-vertices[edgeInd+1].y)/dist2;
            var comp = line.geometry.components;
            comp[activeMarker.polylineEdge].x = xm+unitVec[0]*activeMarker.dist;
            comp[activeMarker.polylineEdge].y = ym+unitVec[1]*activeMarker.dist;
*/
            if (splitPolygons !== null) {
                var comp = [];
//                for (var i = 0; i < 2; i++) {
                    comp[0] = splitPolygons[0].geometry.components[0].components;
                    if (activeMarker.first) {
                        comp[0][splitPolygons[0].polygonCorners[0]].x = activeMarker.lonlat.lon;
                        comp[0][splitPolygons[0].polygonCorners[0]].y = activeMarker.lonlat.lat;
                    } else {
                        comp[0][splitPolygons[0].polygonCorners[1]].x = activeMarker.lonlat.lon;
                        comp[0][splitPolygons[0].polygonCorners[1]].y = activeMarker.lonlat.lat;
                    }
                    comp[1] = splitPolygons[1].geometry.components[0].components;
                    if (activeMarker.first) {
                        comp[1][splitPolygons[1].polygonCorners[1]].x = activeMarker.lonlat.lon;
                        comp[1][splitPolygons[1].polygonCorners[1]].y = activeMarker.lonlat.lat;
                    } else {
                        comp[1][splitPolygons[1].polygonCorners[0]].x = activeMarker.lonlat.lon;
                        comp[1][splitPolygons[1].polygonCorners[0]].y = activeMarker.lonlat.lat;
                    }
//                }

            }

//          activeMarker = null; tämä ehkä voisi olla null
            markers.redraw();
            vectors.redraw();
            split.redraw();
        }

       /**
        *
        */
        function activeMarkerProjection(refLonlat) {
            var point = {x: refLonlat.lon, y: refLonlat.lat};
            var polygonID = activeMarker.polygonID;
            var polygon = vectors.getFeatureById(polygonID);
            var edge = activeMarker.polygonEdge;
            var vertices = polygon.geometry.getVertices();
            var nEdges = vertices.length;
            var inds = [(edge-1+nEdges)%nEdges,edge,(edge+1+nEdges)%nEdges,(edge+2+nEdges)%nEdges];
            var projPoints = [];
            var distances = [];

            var minDistInd = 0;
            for (var i = 0; i < 3; i++) {
                projPoints[i] = projection(point,vertices[inds[i]],vertices[inds[i+1]]);
                distances[i] = distance(point,projPoints[i]);
                if (distances[i] < distances[minDistInd]) minDistInd = i;
            }
            activeMarker.polygonEdge = (edge+minDistInd+nEdges-1)%nEdges;

//            return (new OpenLayers.LonLat(projPoints[minDistInd].x,projPoints[minDistInd].y));



            // Temp:
            activeMarker.polygonEdge = edge;
            return (new OpenLayers.LonLat(projPoints[1].x,projPoints[1].y));
        }


       /**
        *
        */
       function projection(q,p0,p1) {
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
       } // BUG: käsittele tapaus nimittäjä==0


       /**
        *
        */
        function dotProduct(a,b) {
           return a.x* b.x+ a.y*b.y;
       }


       /**
        *
        */
        function isNumber(n) {
          return (!isNaN(parseFloat(n)))&&(isFinite(n));
        }


        /*
         *
         */
        function distance(p1,p2) {
            var x1;
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
        }
        /*
         * 
         */
        function pointSelected(e) {             
            var guidesFeatures = guides.features;
            guides_loop:
            for(var i=0; i<guidesFeatures.length; i++) {
                if (guidesFeatures[i].id === e.id) {                    
                    var geometry = vectors.getFeatureById(pointFeatures.featureId[i]).geometry;
                    var vertices = geometry.getVertices();
                    for(var j=0; j<vertices.length; j++) {
                        if (vertices[j].id === pointFeatures.id[i]) {
                            if (geometry.removeComponent(vertices[j])) update(); //guides.removeFeatures(guidesFeatures[i]); 
                            break guides_loop;
                        }                    
                    }
                }    
            }
            vectors.redraw();
            guides.redraw();
        };


        /*
         *
         */
        function intsectSelected(e) {

/*            var guidesFeatures = guides.features;
            guides_loop:
                    for(var i=0; i<guidesFeatures.length; i++) {
                        if (guidesFeatures[i].id === e.id) {
                            var geometry = vectors.getFeatureById(pointFeatures.featureId[i]).geometry;
                            var vertices = geometry.getVertices();
                            for(var j=0; j<vertices.length; j++) {
                                if (vertices[j].id === pointFeatures.id[i]) {
                                    if (geometry.removeComponent(vertices[j])) update(); //guides.removeFeatures(guidesFeatures[i]);
                                    break guides_loop;
                                }
                            }
                        }
                    }
            vectors.redraw();
            guides.redraw();*/
console.log("Selected");
        };



        /*
         * 
         */
        function lineSelected(e) {
            vectors.removeFeatures(vectors.getFeatureById(e.id));
            vectors.redraw();
        };


        /*
         * 
         */
        function toggleControl(element) {
            for(key in controls) {
                var control = controls[key];
                if(element.value == key && element.checked) {
                    control.activate();
                } else {
                    control.deactivate();
                }
            }
        }


        /*
         * 
         */
        function det(a,b,c,d) {
            return a*d-b*c;            
        }

        /*
         * 
         */
        function isInside(p,edge) {
            var bbox = edge.slice();
            if (bbox[0]>bbox[2]) swap(bbox,0,2);
            if (bbox[1]>bbox[3]) swap(bbox,1,3);                        
            return (p[0]>=bbox[0])&&(p[0]<=bbox[2])&&(p[1]>=bbox[1])&&(p[1]<=bbox[3]);            
        }


        /*
         * 
         */
        function intersection2(edge1,edge2) {
            var det0 = det(edge1[0]-edge1[2],edge1[1]-edge1[3],edge2[0]-edge2[2],edge2[1]-edge2[3]);
            if (Math.abs(det0)<EPSILON) return null;
            var det1 = det(edge1[0],edge1[1],edge1[2],edge1[3]); 
            var det2 = det(edge2[0],edge2[1],edge2[2],edge2[3]);
            var detx = det(det1,edge1[0]-edge1[2],det2,edge2[0]-edge2[2]);
            var x = detx/det0; 
            var dety = det(det1,edge1[1]-edge1[3],det2,edge2[1]-edge2[3]);
            var y = dety/det0;
            var p = [x,y];
            return ((isInside(p,edge1))&&(isInside(p,edge2)))?p:null; 
        }


        /*
         *
         */
        function intersection(edge1,edge2) {
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
            var p = [x,y]

            //  Success.
            return p;
        }




        /*
         *
         */
        function polygonAdded(feature) {
        }


        /*
         *
         */
        function nestedPolygons(outPolygon,inPolygon) {
            var inVertices = inPolygon.getVertices();
            var outVertices = outPolygon.getVertices();
            var inLine
            for (var i=0; i<inVertices.length; i++) {
                if (!outPolygon.intersects(inVertices[i])) return false;
// pisteet ovat siis sisällä, mutta tähän vielä varmistus,että reunat eivät leikkaa (koverat tapaukset)
            }
            return true;
        }


        /*
         *
         */
        function holeAdded(feature) { // to-do: if pois
            var inPolygon = feature.geometry;
            var features = vectors.features;
            var accepted =false;
            for(var i=0; i<features.length; i++) {
                var outPolygon = features[i].geometry;
                if (outPolygon.CLASS_NAME=="OpenLayers.Geometry.Polygon") {
                    if (outPolygon === inPolygon) continue;
                    if (nestedPolygons(outPolygon,inPolygon)) {
                        outPolygon.addComponent(inPolygon.components[0]);
                        accepted = true;
                    }
                }
            }
            if (!accepted) vectors.removeFeatures([feature]);

            vectors.redraw();
        }

        /*
         *  naive approach - working on much better one
         */
        function generateSplitPolygons(polygonEdges, polylineEdges) {
            var point;
            var point1 = null;
            var point2;
            var points = [];
            var linearRing;
            var polygons = [];
            var styles = [];
            var i;

            // kerätään leikkauspisteet, kaksi kappaletta
/*            var intersections = [];
            var intersectionsX = [];
            var intersectionsY = [];
            polygon_loop:
            for (i=0; i<polygonEdges.length; i++) {
                for (var j=0; j<polylineEdges.length; j++) {
                    for (var k=0; k<polylineEdges[j].length; k++) {
                        var p = intersection(polygonEdges[i],polylineEdges[j][k]);
                        if (p !== null) {
                            intersections.push([i,j,k]);
                            intersectionsX.push(p[0]);
                            intersectionsY.push(p[1]);
                            if (intersections.lenght>1) break polygon_loop;
                        }
                    }
                }
            }
*/
            if (intersectionPoints.length<1) return null;

/*

            for (i=0; i<polygonEdges.length; i++) {
                if (point1 === null) {
                    point1 = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
                    points.push(point1);
                }
                point2 = new OpenLayers.Geometry.Point(polygonEdges[i][2], polygonEdges[i][3]);
                if (point2.distanceTo(point1) > EPSILON) {
                    points.push(point2);
                } else {
                    linearRing = new OpenLayers.Geometry.LinearRing(points);

                    polygons.push(new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([linearRing])));
                    var n = polygons.length-1; 
                    styles.push(OpenLayers.Util.applyDefaults(styles[n], OpenLayers.Feature.Vector.style['default']));
                    styles[n].fillColor = getRandomColor();
                    polygons[n].style = styles[n]; 
                    
                    point1 = null;
                    points = [];
                }
            }
*/

/*            if (intersections[0][2] > intersections[1][2]) {
                intersections.splice(1,0,intersections[0]);
                intersectionsX.splice(1,0,intersections[0]);
                intersectionsY.splice(1,0,intersections[0]);
                intersections.splice(0,1);
                intersectionsX.splice(0,1);
                intersectionsY.splice(0,1);
            }
*/
            // leikkaus
            points = [];
            var polygonCorners1 = [];
            for (i=0; i<intersectionPoints[0][6]+1; i++) {
                point = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
                points.push(point);
            }
            point = new OpenLayers.Geometry.Point(intersectionPoints[0][0][0],intersectionPoints[0][0][1]);
            points.push(point);
            polygonCorners1.push(points.length-1);

            for (var i = intersectionPoints[0][5]+1; i < intersectionPoints[1][5]+1; i++) {
                point = new OpenLayers.Geometry.Point(polylineEdges[intersectionPoints[0][4]][i][0],polylineEdges[intersectionPoints[0][4]][i][1]);
                points.push(point);
            }

            point = new OpenLayers.Geometry.Point(intersectionPoints[1][0][0],intersectionPoints[1][0][1]);
            points.push(point);
            polygonCorners1.push(points.length-1);
            for (i=intersectionPoints[1][6]+1; i<polygonEdges.length; i++) {
                point = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
                points.push(point);
            }
            var polygon1 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points)]));
            var style1 = OpenLayers.Util.applyDefaults(style1, OpenLayers.Feature.Vector.style['default']);
            style1.fillColor = getRandomColor();
            polygon1.style = style1;
            polygon1.polygonCorners = polygonCorners1;


            points = [];
            var polygonCorners2 = [];
            for (i=intersectionPoints[0][6]+1; i<intersectionPoints[1][6]+1; i++) {
                point = new OpenLayers.Geometry.Point(polygonEdges[i][0], polygonEdges[i][1]);
                points.push(point);
            }
            point = new OpenLayers.Geometry.Point(intersectionPoints[1][0][0],intersectionPoints[1][0][1]);
            points.push(point);
            polygonCorners2.push(points.length-1);

            for (i = intersectionPoints[1][5]; i > intersectionPoints[0][5]; i--) {
                point = new OpenLayers.Geometry.Point(polylineEdges[intersectionPoints[0][4]][i][0],polylineEdges[intersectionPoints[0][4]][i][1]);
                points.push(point);
            }

            point = new OpenLayers.Geometry.Point(intersectionPoints[0][0][0],intersectionPoints[0][0][1]);
            points.push(point);
            polygonCorners2.push(points.length-1);
            var polygon2 = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Polygon([new OpenLayers.Geometry.LinearRing(points)]));
            var style2 = OpenLayers.Util.applyDefaults(style2, OpenLayers.Feature.Vector.style['default']);
            style2.fillColor = getRandomColor();
            polygon2.style = style2;
            polygon2.polygonCorners = polygonCorners2;

            return [polygon1,polygon2];
        }


        /*
         * 
         */
        function doSplit() {
            document.getElementById("split_button").disabled = true;

            var features = vectors.features;
            var geometry;
            var vertices;
            var output = "";
            var polygonEdges = [];
            var polygonEdgesSweeped = [];
            var polygonEdgesBounded = [];
            var polylineEdges = [];
            var boundingBox = [];
            var nLines = 0;
            var polygonSizes = [];
            var polylineSizes = [];
            var rawData = [];

            // Kerätään data (to-do: iffittely pois)
            for(var i=0; i<features.length; i++) {
            	geometry = features[i].geometry;
            	vertices = geometry.getVertices();
				if (geometry.CLASS_NAME=="OpenLayers.Geometry.Polygon") {
	            	for (var j=0; j<vertices.length; j++) {
	            		var j1 = (j+1)%vertices.length;
						polygonEdges.push([vertices[j].x,vertices[j].y,vertices[j1].x,vertices[j1].y,features[i].id,j]);
    	        	}
				} else if (geometry.CLASS_NAME=="OpenLayers.Geometry.LineString") {
                    polylineSizes.push(vertices.length);
              	    nLines = nLines+1;
              	    polylineEdges[nLines-1] = [];
	            	for (var j=0; j<vertices.length-1; j++) {
                        polylineEdges[nLines-1].push([vertices[j].x,vertices[j].y,vertices[j+1].x,vertices[j+1].y,features[i].id,j]);
    	        	}
				}
            }
            
/*            // Järjestetään taulukot
            
            // Polygons
			reviseEdges(polygonEdges);
            sortEdges(polygonEdges);

            // Sweep line filter
            polygonEdgesSweeped = applySweepLine(polygonEdges,polylineEdges);

            // Visualize the sweep line
            debugVectors[0].removeAllFeatures();            
            debugFeaturecollection[0].features[0].geometry.geometries = [];
            for (var i=0; i<polygonEdgesSweeped.length; i++) {
                debugFeaturecollection[0].features[0].geometry.geometries[i] = {
                            "type": "LineString", 
                            "coordinates": 
                                [[polygonEdgesSweeped[i][0], polygonEdgesSweeped[i][1]], 
                                  [polygonEdgesSweeped[i][2], polygonEdgesSweeped[i][3]]]
                        };
            }                         
            debugVectors[0].addFeatures(geojson.read(debugFeaturecollection[0]));

            // Polylines
            for (var i=0; i<polylineEdges.length; i++) {
	//			reviseEdges(polylineEdges[i]);
//            	sortEdges(polylineEdges[i]);
            }
//            boundingBox = createBoundingBox(polylineEdges);

            // Visualize the bounding box
            debugVectors[1].removeAllFeatures();            
            debugFeaturecollection[1].features[0].geometry.geometries = [];
            for (var i=0; i<boundingBox.length; i++) {
                debugFeaturecollection[1].features[0].geometry.geometries[i] = {
                            "type": "Polygon", 
                            "coordinates": 
                                [[[boundingBox[i][0], boundingBox[i][1]], 
                                  [boundingBox[i][2], boundingBox[i][1]], 
                                  [boundingBox[i][2], boundingBox[i][3]], 
                                  [boundingBox[i][0], boundingBox[i][3]], 
                                  [boundingBox[i][0], boundingBox[i][1]]]]
                        };
                debugVectors[1].addFeatures(geojson.read(debugFeaturecollection[1]));
            }
           
            // Bounding box filter
            polygonEdgesBounded = applyBoundingBox(polygonEdgesSweeped,boundingBox);                        

//console.log(polygonEdgesBounded);
            // Visualize the bounding box filtered edges
            debugVectors[2].removeAllFeatures();            
            debugFeaturecollection[2].features[0].geometry.geometries = [];
            for (var i=0; i<polygonEdgesBounded.length; i++) {
                debugFeaturecollection[2].features[0].geometry.geometries[i] = {
                            "type": "LineString", 
                            "coordinates": 
                                [[polygonEdgesBounded[i][0], polygonEdgesBounded[i][1]], 
                                  [polygonEdgesBounded[i][2], polygonEdgesBounded[i][3]]]
                        };
            }                         
            debugVectors[2].addFeatures(geojson.read(debugFeaturecollection[2]));
*/
            
            // Intersections (naive approach) - working on the better one
            // Only two intersection points are allowed
            var numIntersections = 0;
            var removedPoints = 0;
            for (var i=0; i<polylineEdges.length; i++) {
                var line = vectors.getFeatureById(polylineEdges[i][0][4]);
                var comp = line.geometry.components;
                for (var j=0; j<polylineEdges[i].length; j++) {
                    if (numIntersections > 1) {
                        comp[j].outside = (typeof comp[j].outside === 'undefined');
                        continue;
                    }
                    for (var k=0; k<polygonEdges.length; k++) {
                        var p = intersection(polylineEdges[i][j],polygonEdges[k]);
                        if (p === null) {
                            comp[j].outside = (numIntersections < 1);
                        } else {
                            comp[j].outside = false;
                            intersectionPoints.push([p,polygonEdges[k][4],polygonEdges[k][5],polylineEdges[i][j][4],i,j,k]);
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
                if (intersectionPoints[0][6] > intersectionPoints[1][6]) intersectionPoints.reverse();
                if (intersectionPoints[0][5] > intersectionPoints[1][5]) {
                    polylineEdges[i].reverse();
                    for (var l = 0; l < polylineEdges[i].length; l++) {
                        var temp0 = polylineEdges[i][l][0];
                        var temp1 = polylineEdges[i][l][1];
                        polylineEdges[i][l][0] = polylineEdges[i][l][2];
                        polylineEdges[i][l][1] = polylineEdges[i][l][3];
                        polylineEdges[i][l][2] =temp0;
                        polylineEdges[i][l][3] =temp1;
                    }
                    intersectionPoints[0][5] = polylineEdges[i].length-1-intersectionPoints[0][5];
                    intersectionPoints[1][5] = polylineEdges[i].length-1-intersectionPoints[1][5];
                }

                comp[polylineEdges[i].length].outside = (typeof comp[j].outside === 'undefined');
                var j = 0;
                while (j<comp.length) {
                    if (comp[j].outside) {
                        comp.splice(j,1);
//                        for (var i = 0; i < intersectionPoints.length; i++) {
//                            if (intersectionPoints[i][5] > j) intersectionPoints[i][5]--;
//                        }
                        continue;
                    }
                    j++;
                }
            }
            vectors.redraw();

/*




            var points = [new Point(0, 0), new Point(0, 1), new Point(1, 1), new Point(0, 1), new Point(0.0001, 0.00001)];
            var polygon = new Polygon(points);

            console.log(polygon.simple_polygon()+" polygon is simple");



            var points = [new Point(2.0, 2.0), new Point(2.0, 3.0), new Point(3.0, 3.0), new Point(4.0, 3.0), new Point(4.0, 2.0), new Point(1.9, 2.00001)];
            var polygon = new Polygon(points);

            console.log(polygon.simple_polygon()+" polygon is complex");


            var points = [new Point(2.0, 2.0), new Point(2.0, 3.0), new Point(3.0, 3.0), new Point(1.0, 2.5)];
            var polygon = new Polygon(points);

            console.log(polygon.simple_polygon()+" polygon is complex");



            var points = [new Point(2.0, 2.0), new Point(2.0, 3.0), new Point(3.0, 3.0), new Point(1.0, 2.0+EPSILON)];
            var polygon = new Polygon(points);

            console.log(polygon.simple_polygon()+" polygon is complex");

*/



            // Tarkistetaan polygonien kunnollisuus








            // Sweepline intersection algorithm
            var swPoint;
            var swPoints = [];
            for (var i=0; i<polygonEdges.length; i++) {
            swPoint = new Point(polygonEdges[i][0],polygonEdges[i][1]);
//console.log(swPoint);
                swPoints.push(swPoint);
            }
            //to-do: erikoistapaukset huomioiva algoritmi
            //tässä nyt workaround ilmeisimpään ongelmaan
            var xEps = 0.00001;
            var yEps = 0.00001;
            var nInd = polygonEdges.length-1;
            xEps = polygonEdges[nInd][2]-polygonEdges[nInd][0] > 0.0 ? -xEps : xEps;
            yEps = polygonEdges[nInd][3]-polygonEdges[nInd][1] > 0.0 ? -yEps : yEps;

            swPoint = new Point(polygonEdges[nInd][2]+xEps,polygonEdges[nInd][3]+yEps);
            swPoints.push(swPoint);
            var swPolygon = new Polygon(swPoints);

/*console.log("--------");
console.log(swPolygon);
console.log(swPolygon.simple_polygon());
console.log("--------");
            intersectionPoints = [];
*/




            var rawPoint;
            var rawPoints = [];
            // Kerätään data (to-do: iffittely pois)
            for(var i=0; i<features.length; i++) {
                geometry = features[i].geometry;
                vertices = geometry.getVertices();
                if (geometry.CLASS_NAME=="OpenLayers.Geometry.Polygon") {
                    polygonSizes.push(vertices.length);
                    for (var j=0; j<vertices.length; j++) {
                        rawPoint = new Point(vertices[j].x,vertices[j].y);
                        rawPoints.push(rawPoint);
                    }
                    rawPoint = new Point(vertices[0].x,vertices[0].y);
                    xEps = 0.00001;
                    yEps = 0.00001;
                    nInd = vertices.length-1;
                    xEps = polygonEdges[nInd][2]-polygonEdges[nInd][0] > 0.0 ? -xEps : xEps;
                    yEps = polygonEdges[nInd][3]-polygonEdges[nInd][1] > 0.0 ? -yEps : yEps;
                    rawPoint.x += xEps;
                    rawPoint.y += yEps;
                    rawPoints.push(rawPoint);
                }
            }

            for(var i=0; i<features.length; i++) {
                geometry = features[i].geometry;
                vertices = geometry.getVertices();
                if (geometry.CLASS_NAME=="OpenLayers.Geometry.LineString") {
                    polylineSizes.push(vertices.length);
                    for (var j=0; j<vertices.length; j++) {
                        rawPoint = new Point(vertices[j].x,vertices[j].y);
                        rawPoints.push(rawPoint);
                    }
                    rawPoints.push(rawPoint);
                }
            }


            var rawPolygon = new Polygon(rawPoints);


console.log("====");
console.log(rawPolygon);
            var isSimple = rawPolygon.simple_polygon();
console.log(isSimple);
console.log("====");
/*            var rawIntSec = rawPolygon.intersections();
console.log("###");
console.log(rawIntSec);

            if (rawIntSec !== null) {
                for (var i = 0; i < rawIntSec.length; i++) {
                    var p = intersection(polygonEdges[rawIntSec[i][0]],polygonEdges[rawIntSec[i][1]]);

                    if (p !== null) intersectionPoints.push([rawIntSec[i][0],0,0]);//polygonEdges[rawIntSec[i][0]][4],polygonEdges[rawIntSec[i][0]][5]]);
                }
//            }






            var sweep_line = new SweepLine(swPolygon);
            var event_queue = new EventQueue(swPolygon);
            var ev;
            while (ev = event_queue.events.pop()){
                sweep_line.add(ev);
            }
console.log(sweep_line.find({edge:1}));
*/




            // Visualize the intersection points
/*            debugVectors[3].removeAllFeatures();
            debugFeaturecollection[3].features[0].geometry.geometries = [];
            var pointVectors = [];
            for (var i=0; i<intersectionPoints.length; i++) {
                var point = new OpenLayers.Geometry.Point(intersectionPoints[i][0][0],intersectionPoints[i][0][1]);
                point.parentFeature = intersectionPoints[i][1];
                point.parentEdge = intersectionPoints[i][2];
                pointVectors.push(new OpenLayers.Feature.Vector(point));
            }
            debugVectors[3].addFeatures(pointVectors);
*/
/*
            intersects.removeAllFeatures();
            var pointVectors = [];
            for (var i=0; i<intersectionPoints.length; i++) {
                var point = new OpenLayers.Geometry.Point(intersectionPoints[i][0][0],intersectionPoints[i][0][1]);
                point.parentFeature = intersectionPoints[i][1];
                point.parentEdge = intersectionPoints[i][2];
                pointVectors.push(new OpenLayers.Feature.Vector(point));
            }
            intersects.addFeatures(pointVectors);


*/


/*
            var marker;
            for (var i=0; i<intersectionPoints.length; i++) {
                var point = new OpenLayers.Geometry.Point(intersectionPoints[i][0][0],intersectionPoints[i][0][1]);
                marker = new OpenLayers.Marker(new OpenLayers.LonLat(point.x,point.y),markerIcon.clone());
                marker.setOpacity(0.8);
                marker.parentFeature = intersectionPoints[i][1];
                marker.parentEdge = intersectionPoints[i][2];
                marker.events.register("mousedown", marker, function(evt) {
                    OpenLayers.Event.stop(evt);
                    activeMarker = this;
                    map.events.register("mouseup", map, freezeActiveMarker);
                    map.events.register("mousemove", map, moveActiveMarker);
                });
                markers.addMarker(marker);
            }
*/
            var marker;
            var minPolygonEdge = Number.POSITIVE_INFINITY;
            var minPolygonEdgeIndex = -1;
            for (var i=0; i<intersectionPoints.length; i++) {
                var point = new OpenLayers.Geometry.Point(intersectionPoints[i][0][0],intersectionPoints[i][0][1]);
                marker = new OpenLayers.Marker(new OpenLayers.LonLat(point.x,point.y),markerIcon.clone());
                marker.setOpacity(0.8);
                marker.polygonID = intersectionPoints[i][1];
                marker.polygonEdge = intersectionPoints[i][2];
                marker.polylineID = intersectionPoints[i][3];
                marker.polylineEdge = intersectionPoints[i][4];
                marker.first = false;
                if (marker.polygonEdge < minPolygonEdge) {
                    minPolygonEdge = marker.polygonEdge;
                    minPolygonEdgeIndex = i;
                }
//                marker.lonlat0 = new OpenLayers.LonLat(marker.lonlat.lon, marker.lonlat.lat);
//                marker.dist0 = distance(vertices[edgeInd],activeMarker.lonlat0);
                markers.addMarker(marker);
            }
            if (minPolygonEdgeIndex >= 0) markers.markers[minPolygonEdgeIndex].first = true;

            // Lisää tarvittaessa uudet välipisteet
/*            var line;
            for(var i=0; i<features.length; i++) {
                line = features[i];
            	geometry = line.geometry;
				if (geometry.CLASS_NAME !== "OpenLayers.Geometry.LineString") continue;
                vertices = geometry.getVertices();
                var nNewPoints = 0;
                for (var j = 0; j < vertices.length-1; j++) {
                    var markerInfo = [];
                    var nMarkers = 0;
                    for (var k = 0; k < markers.markers.length; k++) {
                        if (markers.markers[k].polylineID !== line.id) continue;
                        if (markers.markers[k].polylineEdge !== j) continue;
                        markers.markers[k].dist = distance(markers.markers[k].lonlat,vertices[j]);
                        markerInfo[nMarkers] = {};
                        markerInfo[nMarkers].index = k;
//                        markerInfo[nMarkers].dist = distance(vertices[j],markers.markers[k].lonlat);
                        nMarkers++;
                    }
                    if (markerInfo.length>1) {
                        markerInfo.sort(function(a,b) {
                            return a.dist-b.dist;
                        });
                    } else {
                        continue;
                    }
console.log("@");
console.log(markerInfo);
                    var comp = line.geometry.components;
                    for (var k = 1; k < markerInfo.length; k++) {
                        var ind1 = markerInfo[k-1].index;
                        var x1 = markers.markers[ind1].lonlat.lon;
                        var y1 = markers.markers[ind1].lonlat.lat;
                        var ind2 = markerInfo[k].index;
                        var x2 = markers.markers[ind2].lonlat.lon;
                        var y2 = markers.markers[ind2].lonlat.lat;
                        var xa = (2.0*x1+x2)/3.0;
                        var ya = (2.0*y1+y2)/3.0;
                        var xb = (x1+2.0*x2)/3.0;
                        var yb = (y1+2.0*y2)/3.0;
                        var midPointA = new OpenLayers.Geometry.Point(xa,ya);
                        nNewPoints++;
                        comp.splice(j+nNewPoints,0,midPointA);
                        markers.markers[ind2].polylineEdge++;
                        var midPointB = new OpenLayers.Geometry.Point(xb,yb);
                        nNewPoints++;
                        comp.splice(j+nNewPoints,0,midPointB);
                        markers.markers[ind2].polylineEdge++;
                        vertices = geometry.getVertices();
                        markers.markers[ind2].dist = distance(markers.markers[ind2].lonlat,vertices[markers.markers[ind2].polylineEdge]);
                    }

                    var ind1 = markerInfo[markerInfo.length-1].index;
                    var x1 = markers.markers[ind1].lonlat.lon;
                    var y1 = markers.markers[ind1].lonlat.lat;
                    var x2 = vertices[j+nNewPoints+1].x;
                    var y2 = vertices[j+nNewPoints+1].y;
                    var x12 = 0.5*(x1+x2);
                    var y12 = 0.5*(y1+y2);
                    var midPoint = new OpenLayers.Geometry.Point(x12,y12);
                    nNewPoints++;
                    comp.splice(j+nNewPoints,0,midPoint);
//                    markers.markers[ind1].polylineEdge++;
//                    markers.markers[ind1].dist = distance(markers.markers[ind1].lonlat,vertices[j+nNewPoints]);
                }
            }
            //BUG: huolehdi että näitä välipisteitä ei voi poistaa
*/

            // simppeli splittaus tässä vaiheessa
            splitPolygons = generateSplitPolygons(polygonEdges,polylineEdges);
            split.removeAllFeatures();
            if (splitPolygons !== null) split.addFeatures(splitPolygons);

			// Output
			if (polygonEdges.length>0) output = "Polygon\n";
            for (var i=0; i<polygonEdges.length; i++) {
            	output += polygonEdges[i]+"\n";
            }
            output += "\n";
            for (var i=0; i<polylineEdges.length; i++) {
				output += "Polyline "+i+"\n";
		        for (var j=0; j<polylineEdges[i].length; j++) {
				    output += polylineEdges[i][j]+"\n";
            	}
            	output += "\n";
            }			
            document.getElementById('splits').value = output;
        }


        // preload images
        (function() {
            var roots = ["draw_point", "draw_line", "draw_polygon", "pan"];
            var onImages = [];
            var offImages = [];
            for(var i=0; i<roots.length; ++i) {
                onImages[i] = new Image();
                onImages[i].src = "theme/default/img/" + roots[i] + "_on.png";
                offImages[i] = new Image();
                offImages[i].src = "theme/default/img/" + roots[i] + "_on.png";
            }
        })();
