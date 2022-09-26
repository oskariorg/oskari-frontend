# StartDrawingRequest [rpc]

Allows the user to draw on the map.

## Use cases

- measure line
- measure area
- draw dot/line/area

## Description

Activates draw control on map.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* id</td><td> String</td><td> Identifier for request</td><td> </td>
</tr>
<tr>
  <td> \* shape</td><td> String</td><td> Point|LineString|Polygon|Circle|Box|Square</td><td> </td>
</tr>
<tr>
  <td> \* options</td><td> Object</td><td> Parameters for options-object are listed in the next table</td><td> null</td>
</tr>
</table>

Parameters for options-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> drawControl </td><td> Boolean </td><td> true - activates draw control.<br> false - drawing will not activated.</td><td> true</td>
</tr>
<tr>
  <td> modifyControl </td><td> Boolean </td><td> true - activates modify control.<br> false - modifying will not activated.</td><td> true</td>
</tr>
<tr>
  <td> allowMultipleDrawing </td><td> Boolean/String </td><td> true - multiple selection is allowed.<br> false - after drawing is finished (by doubleclick), will stop drawing tool, but keeps selection on the map.<br> 'single' - selection will be removed before drawing a new selection.<br> 'multiGeom' - gathers drawn shapes into a single feature with multigeometry instead of sending multiple features in DrawingEvent. </td><td> true</td>
</tr>
<tr>
  <td> showMeasureOnMap </td><td> Boolean </td><td> Use this parameter for displaying measurement result on line or polygon.<br> true - if measure result should be displayed on drawing feature.</td><td> false</td>
</tr>
<tr>
  <td> geojson </td><td> Object|String</td> <td> FeatureCollection | Feature | Geometry in GeoJson format </td><td> null</td>
</tr>
<tr>
  <td> buffer</td><td> Number</td><td> Buffer for drawing buffered line and dot.</td><td> null</td>
</tr>
<tr>
  <td> limits </td><td> Object </td><td>Optional limits for validating drawn or modified geometry.</td><td>{selfIntersection: true}</td>
</tr>
<tr>
  <td> style</td> <td> Object</td> <td> Styles for draw, modify and intersect mode. If options don't include custom style, sets default styles. See styling example at the last example of this page.</td>
  <td>
  		{
            fill : {
                color : 'rgba(255,0,255,0.2)'
            },
            stroke : {
                color : 'rgba(0,0,0,1)',
                width : 2
            },
            image : {
                radius: 4,
                fill : {
                    color : 'rgba(0,0,0,1)'
                }
            },
            text : {
                scale : 1.3,
                fill : {
                    color : 'rgba(0,0,0,1)'
                },
                stroke : {
                    color : 'rgba(255,255,255,1)',
                    width : 2
                }
            }
        }
    </td>
</tr>
</table>

Limits are used for validating finished geometry. If geometry is invalid, user will see warning text. Parameters for limits-object:

<table class="table">
<tr>
  <th>Name</th><th>Type</th><th>Description</th><th>Default value</th>
</tr>
<tr>
  <td>selfIntersection</td><td>Boolean</td><td>Self-intersecting polygons are not allowed.</td><td> true</td>
</tr>
<tr>
  <td>area</td><td>Number</td><td>Maximum size for valid area in m2.</td><td>infinite</td>
</tr>
<tr>
  <td>length</td><td>Number</td><td>Maximum length for valid line in meters.</td><td>infinite</td>
</tr>
</table>

## Examples

Start to draw for 'measure' functionality and keep the drawing on the map:
```javascript
Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'LineString', {
	showMeasureOnMap: true
}]);
```

Start to draw for 'measure' functionality and remove previous drawing when new drawing is started:
```javascript
Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', ['select', 'Box', {
	showMeasureOnMap: true,
	allowMultipleDrawing: 'single'
}]);
```

Start to draw for 'bufferedselect' functionality without modify:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['bufferedselect', 'LineString', {
	buffer: 50,
	modifyControl: false
}]);
```
DrawingEvent's bufferedGeoJson can be used for selection.


Start to draw a polygon for 'myplaces' functionality with specific style and area size limit:
```javascript
 const style = {
	    draw : {
	        fill : {
	             color: 'rgba(238,0,0,0.3)'
	        },
	        stroke : {
	              color: 'rgba(0,0,0,1)',
	              width: 2
	        },
	        image : {
	              radius: 4,
	              fill: {
	                color: 'rgba(0,0,0,1)'
	              }
	        }
	    },
	    modify : {
	        fill : {
	             color: 'rgba(153,102,255,0.3)'
	        },
	        stroke : {
	              color: 'rgba(0,0,0,1)',
	              width: 2
	        },
	        image : {
	              radius: 4,
	              fill: {
	                color: 'rgba(0,0,0,1)'
	              }
	        }
	    },
	    invalid : {
	        fill : {
	             color: 'rgba(255,255,255,0.3)'
	        },
	        stroke : {
	              color: 'rgba(0,0,0,1)',
	              width: 2,
	              lineDash: 5
	        },
	        image : {
	              radius: 4,
	              fill: {
	                color: 'rgba(0,0,0,1)'
	              }
	        }
	    }
};
Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'Polygon', {
    showMeasureOnMap: true,
	style: style,
	limits: { area: 10000 }
}]);
```

Start to modify a polygon for 'myplaces' functionality:
```javascript
const geometry = {
	"type": "Polygon",
	"coordinates": [
		[
			[420440.7092535111, 6814639.756003482],
			[520280.7092535111, 6814639.756003482],
			[520280.7092535111, 6870043.731054378],
			[420440.7092535111, 6890043.731054378],
			[420440.7092535111, 6814639.756003482]
		]
	]
};

Oskari.getSandbox().postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'Polygon', {
	showMeasureOnMap: true,
	drawControl: false,
	geojson: geometry
}]);
```

## Implementing bundle

## Related API

- StopDrawingRequest
- DrawingEvent
