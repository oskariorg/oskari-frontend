# ShowFeatureRequest

Show feature to map.

## Examples

### Show feature to map
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowFeatureRequest');
if (reqBuilder) {
	var points = [
	    new OpenLayers.Geometry.Point(0, 0),
	    new OpenLayers.Geometry.Point(0, 100),
	    new OpenLayers.Geometry.Point(100, 100),
	    new OpenLayers.Geometry.Point(100, 0)
	];
	var ring = new OpenLayers.Geometry.LinearRing(points);
	var polygon = new OpenLayers.Geometry.Polygon([ring]);

	// create some attributes for the feature
	var attributes = {name: "my name", bar: "foo"};
	var feature = new OpenLayers.Feature.Vector(polygon, attributes);
    var request = reqBuilder(feature);
    sb.request('MainMapModule', request);
}
```