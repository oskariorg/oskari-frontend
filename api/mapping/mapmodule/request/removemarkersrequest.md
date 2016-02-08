# RemoveMarkersRequest

Markers can be removed from the map by sending a RemoveMarkersRequest. The request can include an ID for removing a single marker
 or when no ID is provided all markers are cleared. 

## Examples

Remove single marker:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest');
if (reqBuilder) {
    var request = reqBuilder('my marker id');
    sb.request('MainMapModule', request);
}
```

Clearing all markers:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MapModulePlugin.RemoveMarkersRequest');
if (reqBuilder) {
    sb.request('MainMapModule', reqBuilder());
}
```
