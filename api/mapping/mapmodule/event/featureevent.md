# FeatureEvent [rpc]

Used to notify about add, remove, update and click events for features.

## Description

Notifies other components that feature has been added, removed, updated (highlight) or clicked on the map.

## RPC

Occurs after adding or removing features to or from map, or after feature has been clicked.

<pre class="event-code-block">
<code>
{
  "operation": "add",
  "features": [
    {
      "id": "F24",
      "geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "id": "F24",
            "geometry": {
              "type": "LineString",
              "coordinates": [
                [
                  488704,
                  6939136
                ],
                [
                  588704,
                  7039136
                ]
              ]
            },
            "properties": {
              "test_property": 1,
              "oskari-cursor": "zoom-in",
              "highlighted": false // or true. This property come from when update feature
            }
          }
        ]
      },
      "layerId": "VECTOR"
    },
    {
      "id": "F25",
      "geojson": {
        "type": "FeatureCollection",
        "features": [
          {
            "type": "Feature",
            "id": "F25",
            "geometry": {
              "type": "Point",
              "coordinates": [
                488704,
                6939136
              ]
            },
            "properties": {
              "test_property": 2
            }
          }
        ]
      },
      "layerId": "VECTOR"
    }
  ]
}
</code>
</pre>

## Event methods

### setOpAdd()
Sets this._operation to 'add' and returns this

### setOpRemove()
Sets this._operation to 'remove' and returns this

### setOpClick()
Sets this._operation to 'click' and returns this

### setOpZoom()
Sets this._operation to 'zoom' and returns this

### getName()
Returns event name

### addFeature(id, geojson, layerId)
Adds feature parameters to this._features and returns this

### getParams

RPC needed function. Returns an object with keys 'features' and 'operation' where operation is one of: 'add', 'remove', 'click', 'zoom' and
features is an array containing objects presenting the features that were affected. Each feature object has the following properties:

- id : id for the feature
- geojson : the feature with attributes as geojson
- layerId : id of the layer that the feature is/was on

## Examples

VectorLayerPlugin adds feature to clickEvent after feature has been clicked on the map and notifies other components about it.

<pre class="event-code-block">
<code>
__featureClicked: function(features, olLayer) {
    var sandbox = this.getSandbox();
    var clickEvent = sandbox.getEventBuilder('FeatureEvent')().setOpClick();
    var formatter = this._supportedFormats['GeoJSON'];
    var me = this;
    _.forEach(features, function (feature) {
        var geojson = formatter.write([feature]);
        clickEvent.addFeature(feature.id, geojson, me._getLayerId(olLayer.name));
    });
    sandbox.notifyAll(clickEvent);
},
</code>
</pre>