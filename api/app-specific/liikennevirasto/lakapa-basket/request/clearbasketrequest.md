# ClearBasketRequest

Clear basket.

## Examples

### Clear basket:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ClearBasketRequest');
if (reqBuilder) {
    var request = reqBuilder();
    sb.request('MainMapModule', request);
}
```