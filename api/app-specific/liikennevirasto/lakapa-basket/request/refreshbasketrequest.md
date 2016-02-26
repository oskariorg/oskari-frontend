# RefreshBasketRequest

Refresh basket.

## Examples

### Refresh basket:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('RefreshBasketRequest');
if (reqBuilder) {
    var request = reqBuilder();
    sb.request('MainMapModule', request);
}
```