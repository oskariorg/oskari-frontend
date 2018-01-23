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
  <td> \* shape</td><td> String</td><td> Drawing shape: Point/Circle/Polygon/Box/Square/LineString</td><td> </td>
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
  <td> buffer</td><td> Number</td><td> Buffer for drawing buffered line and dot. If not given or 0, will disable dragging.</td><td> null</td>
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
<tr>
  <td> allowMultipleDrawing </td><td> Boolean/String </td><td> true - multiple selection is allowed.<br> false - after drawing is finished (by doubleclick), will stop drawing tool, but keeps selection on the map.<br> 'single' - selection will be removed before drawing a new selection.<br> 'multiGeom' - gathers drawn shapes into a single feature with multigeometry instead of sending multiple features in DrawingEvent. </td><td> true</td>
</tr>
<tr>
  <td> drawControl </td><td> Boolean </td><td> true - activates draw control.<br> false - drawing will not activated.</td><td> true</td>
</tr>
<tr>
  <td> modifyControl </td><td> Boolean </td><td> true - activates modify control.<br> false - modifying will not activated.</td><td> true</td>
</tr>
<tr>
  <td> showMeasureOnMap </td><td> Boolean </td><td> Use this parameter for displaying measurement result on line or polygon.<br> true - if measure result should be displayed on drawing feature.</td><td> false</td>
</tr>
<tr>
  <td> selfIntersection </td><td> Boolean </td><td> true - user will see warning text if polygon has self-intersection. <br> false - polygon's itself intersection will be not checked. </td><td> true</td>
</tr>
<tr>
  <td> geojson </td><td> String</td> <td> Geojson for editing. If not given, will activate draw/modify control according to given shape.</td><td> null</td>
</tr>
</table>

## Examples

```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', [
		'bufferedLineSelection',
		'LineString']
		{
        	buffer: 200,
            allowMultipleDrawing: 'single',
			drawControl: true,
            modifyControl: false
        }		
);
```

Start to draw for 'measure' functionality and keep the drawing on the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'LineString'], {
	showMeasureOnMap: true
});
```

After the drawing is completed a 'DrawingEvent' is triggered where id is 'measure' with the measure data available in event.getData().

Add a buffer of 50 units (metric) for the line shape we got from the previous 'measure' event:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['measure', 'LineString'], {
	buffer: 50
});
```

Start to draw a circle for 'myplaces' functionality (disabling the buffer by dragging feature and don't setup modify control after finishing):
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'Circle', {
    buffer : 50,
    modifyControl : false
}]);
```
Again on completion a 'DrawingEvent' is triggered with id 'myplaces' with the drawn shape as geojson available in event.getGeoJson().

Start to draw a polygon for 'myplaces' functionality with specific style and showing a label next to the drawing:
```javascript
 var style = {
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
	    intersect : {
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

var sb = Oskari.getSandbox();
sb.postRequestByName('DrawTools.StartDrawingRequest', ['myplaces', 'Polygon', {
    label : 'My drawing',
    style : style
}]);
```
Again on completion a 'DrawingEvent' is triggered with id 'myplaces' with the drawn shape as geojson available in event.getGeoJson().

## Implementing bundle

## Related API

- StopDrawingRequest
- DrawingEvent
