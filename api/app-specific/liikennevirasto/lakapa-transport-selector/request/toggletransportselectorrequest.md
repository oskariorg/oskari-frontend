# ToggleTransportSelectorRequest

Toggle transport selection

## Examples

### Toggle transport selector:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ToggleTransportSelectorRequest');
if (reqBuilder) {
    var request = reqBuilder(true);
    sb.request('MainMapModule', request);
}
```