# RemoveMarkersRequest [RPC]

Remove markers from the map.

## Description

Markers can be removed from the map by sending a RemoveMarkersRequest. The request can include an ID for removing a single marker or when no ID is provided all markers are cleared. 

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> id </td><td> [Parameter type, f.e. "String"]</td><td> id for marker to remove, removes all if undefined </td><td> undefined </td>
</tr>
</table>

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

## Related api

- addMarkerRequest
- afterAddMarkerEvent
- afterRemoveMarkersEvent