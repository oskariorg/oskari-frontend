# ChangeLanguageRequest

Change language requst.

## Examples

### Change language to Finnish:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('ChangeLanguageRequest');
if (reqBuilder) {
    var request = reqBuilder('fi');
    sb.request('MainMapModule', request);
}
```