# ShowBoundingBoxRequest

Show bounding box to map.

## Examples

### Show bounding box to map:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowBoundingBoxRequest');
if (reqBuilder) {
    var request = reqBuilder({
    	'left': 0,
    	'bottom': 0,
    	'top': 10,
    	'right': 10
    });
    sb.request('MainMapModule', request);
}
```