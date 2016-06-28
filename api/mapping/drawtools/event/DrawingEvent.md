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
  <td> \* geojson </td><td> Object</td><td> Drawn shape. Length and area are always in meters. </td><td> </td>
</tr>
<tr>
  <td> \* data </td><td> Object</td><td> additional info, like bufferedGeoJson and shape</td><td> </td>
</tr>
<tr>
  <td> \* isFinished </td><td> Boolean</td><td> True if feature or drawing is finished</td><td> </td>
</tr>
</table>

## RPC

Event occurs after every click while drawing feature. 

The next occurs before drawing is finished.
<pre class="event-code-block">
<code>
{
  "name": "DrawingEvent",
  "id": "my functionality id",
  "geojson": {
    "type": "FeatureCollection",
    "features": []
  },
  "data": {
    "bufferedGeoJson": {
      "type": "FeatureCollection",
      "features": []
    },
    "shape": "Polygon"
  },
  "isFinished": false
}
</code>
</pre>

The next occurs when drawing is finished, for example after StopDrawingRequest.
<pre class="event-code-block">
<code>
{
  "name": "DrawingEvent",
  "id": "my functionality id",
  "geojson": {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "id": "drawFeature0",
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                350208,
                7011328
              ],
              [
                385024,
                6982144
              ],
              [
                330240,
                6947328
              ],
              [
                386560,
                6924800
              ],
              [
                350208,
                7011328
              ]
            ]
          ]
        },
        "properties": {
          "area": "Alue ei saa muodostaa silmukkaa. Nähdäkseen mittaustuloksen piirrä validi alue."
        }
      }
    ]
  },
  "data": {
    "area": "Alue ei saa muodostaa silmukkaa. Nähdäkseen mittaustuloksen piirrä validi alue.",
    "bufferedGeoJson": {
      "type": "FeatureCollection",
      "features": []
    },
    "shape": "Polygon"
  },
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

DrawPlugin.ol3 sends DrawingEvent:
<pre class="event-code-block">
<code>
/**
 * @method sendDrawingEvent
 * -  sends DrawingEvent
 *
 * @param {String} id
 * @param {object} options include:
 *                  {Boolean} clearCurrent: true - all selection will be removed from the map after stopping plugin, false - will keep selection on the map. Default is false.
 *                  {Boolean} isFinished: true - if drawing is completed. Default is false.
 */
sendDrawingEvent: function(id, options) {
    var me = this;
    var features = me.getFeatures(me._layerId);
    var bufferedFeatures = me.getFeatures(me._bufferedFeatureLayerId);
    var isFinished = false;

    if(me._shape === 'Circle') {
        bufferedFeatures = me.getCircleAsPolygonFeature(features);
        features = me.getCircleAsPointFeature(features);
    } else if(me._shape === 'LineString' && me._buffer > 0) {
        me.addBufferPropertyToFeatures(features, me._buffer);
    }
    // TODO: get geojson for matching id
    var geojson = me.getFeaturesAsGeoJSON(features);
    var bufferedGeoJson = me.getFeaturesAsGeoJSON(bufferedFeatures);

    var data = {
        lenght : me._length,
        area : me._area,
        buffer: me._buffer,
        bufferedGeoJson: bufferedGeoJson,
        shape: me._shape
    };
    if(options.clearCurrent) {
        me.clearDrawing();
    }
    if(options.isFinished) {
        isFinished = options.isFinished;
    }
    var event = me._sandbox.getEventBuilder('DrawingEvent')(id, geojson, data, isFinished);
    me._sandbox.notifyAll(event);
},
</code>
</pre>