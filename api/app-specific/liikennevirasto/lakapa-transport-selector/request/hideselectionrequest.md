# HideSelectionRequest

Hide selections from map.

## Examples

### Hide selection:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('HideSelectionRequest');
if (reqBuilder) {
    var request = reqBuilder();
    sb.request('MainMapModule', request);
}
```