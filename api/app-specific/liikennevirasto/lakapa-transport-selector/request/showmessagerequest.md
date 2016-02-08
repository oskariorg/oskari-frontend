# ShowMessageRequest

Show message to user.

## Examples

### Show message:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ShowMessageRequest');
if (reqBuilder) {
    var request = reqBuilder('Title', 'Message', function(){alert('Hello');});
    sb.request('MainMapModule', request);
}
```