# ShowHelpRequest

Show help.

## Examples

### Show message:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowHelpRequest');
if (reqBuilder) {
    var request = reqBuilder('road');
    sb.request('MainMapModule', request);
}
```