# TransportChangedRequest

Transport changed.

## Examples

### Show message:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('TransportChangedRequest');
if (reqBuilder) {
    var request = reqBuilder('road');
    sb.request('MainMapModule', request);
}
```