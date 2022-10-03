# DrawingEvent [rpc]

Notifies that sketch has been changed or drawing is finished.

## Description

Used to notify that sketch is changed or drawing finished. Event is sent every time that sketch changes (cursor is moved while drawing) and when drawing is finished. 

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* id </td><td> String</td><td> drawing id as given in StartDrawingRequest</td><td> </td>
</tr>
<tr>
  <td> \* geojson </td><td> Object</td><td> Drawn features in GeoJson format </td><td> </td>
</tr>
<tr>
  <td> \* data </td><td> Object</td><td> additional info</td><td> </td>
</tr>
<tr>
  <td> \* isFinished </td><td> Boolean</td><td> True if drawing is finished</td><td> </td>
</tr>
</table>

## RPC

Unfinished event is sent every time that sketch changes. 
<pre class="event-code-block">
<code>
{
  "name": "DrawingEvent",
  "id": "my functionality id",
  "geojson": {...},
  "data": {
    "area": 594933884.35, // The sum of all areas in square meters
    "buffer": 0, // requested buffer
    "bufferedGeoJson": {...}, // contains buffered features if buffer is requested
    "length": 264071.08700662444, // The sum of all line lengths in meters
    "showMeasureOnMap": true,
    "shape": "Polygon" // requested shape
  },
  "isFinished": false
}
</code>
</pre>

Finished event occurs when sketch is finished. For example after `StopDrawingRequest`, double-click or end drag on modify.
<pre class="event-code-block">
<code>
{
  "name": "DrawingEvent",
  "id": "my functionality id",
  "geojson": { ... },
  "data": { ... },
  "isFinished": true
}
</code>
</pre>

## Event methods

### getName()
Returns name of the event

### getId()
Returns id of the drawing

### getGeoJson)
Returns geojson of the drawing

### getData()
Returns data of the drawing

### getIsFinished()
Returns true if drawing is finished

### getParams()
Returns all the params of the event.
<pre class="event-code-block">
<code>
{
    name: this.getName(),
    id: this.getId(),
    geojson: this.getGeoJson(),
    data: this.getData(),
    isFinished: this.getIsFinished()
};
</code>
</pre>

## Examples

Event handler for own finished drawings:
```javascript
    handleDrawingEvent (event) {
        if (event.getId() === MY_ID && event.getIsFinished()) {
            const geojson = event.getGeoJson();
            const data = event.getData();
            // do something with data and features
        }
    }
```

`DrawTools.StartDrawingRequest` with id `measure` and shape `Polygon`. Event for valid finished drawing:
<pre class="event-code-block">
<code>
{
  "name": "DrawingEvent",
  "id": "measure",
  "isFinished": true,
  "data": {
      "area": 10527600800.565893,
      "buffer": 0,
      "shape": "Polygon",
      "showMeasureOnMap": false,
      "bufferedGeoJson": {
        "type": "FeatureCollection",
        "crs": "EPSG:3067",
        "features": []
      }
    },
  "geojson": {
    "type": "FeatureCollection",
    "crs": "EPSG:3067",
    "features": [
      {
        "type": "Feature",
        "id": "drawFeature0",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [330356.9714432531,6903137.5567356525],
            [328820.9714432531,6823265.5567356525],
            [422004.9714432531,6818145.5567356525],
            [439924.9714432531,6875489.5567356525],
            [383352.9611277134,6932447.561893423],
            [335224.9611277134,6934495.561893423],
            [310136.9611277134,6924767.561893423],
            [330356.9714432531,6903137.5567356525]
          ]
        },
        "properties": {
          "area": 10527600800.565893,
          "valid": true
        }
      }
    ]
  }
}
</code>
</pre>

`DrawTools.StartDrawingRequest` with id `measure` and shape `Polygon`. Event for invalid finished drawing:
<pre class="event-code-block">
<code>
{
  "name": "DrawingEvent",
  "id": "measure",
  "isFinished": true,
  "data": {
      "area": 594933884.3552058,
      "buffer": 0,
      "shape": "Polygon",
      "showMeasureOnMap": false,
      "bufferedGeoJson": {
        "type": "FeatureCollection",
        "crs": "EPSG:3067",
        "features": []
      }
    },
  "geojson": {
    "type": "FeatureCollection",
    "crs": "EPSG:3067",
    "features": [
      {
        "type": "Feature",
        "id": "drawFeature0",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
              [350208,7011328],
              [385024,6982144],
              [330240,6947328],
              [386560,6924800],
              [350208,7011328]
          ]
        },
        "properties": {
          "area": "Polygon self-intersection is not allowed. Edit current polygon or draw a new polygon.",
          "valid": false
        }
      }
    ]
  }
}
</code>
</pre>
