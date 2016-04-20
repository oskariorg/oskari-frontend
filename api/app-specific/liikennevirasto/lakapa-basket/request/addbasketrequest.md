# AddToBasketRequest

Add item to basket.

## Examples

### Add item to basket:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('AddToBasketRequest');
if (reqBuilder) {
	var bbox = {
		'left': 0,
		'bottom': 0,
		'right': 10,
		'left: 10'
	};
	var layers = sb.findAllSelectedMapLayers();
    var request = reqBuilder(bbox, [layer[0]], 'newreqular', 'road', 'identifier', null);
    sb.request('MainMapModule', request);
}
```