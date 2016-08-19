# MapModulePlugin.MarkerVisibilityRequest [RPC]

Show or hide marker from map.

## Use cases

- hide wanted marker from map
- hide all markers from map
- show wanted marker from map
- show all markers from map

## Description

Markers can be hided/showed to the map by sending an MarkerVisibilityRequest. The request must contain the marker visibility and
optional parameter is wanted marker id. If marker id is not defined then show/hide all markers from map.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td>/* visibility </td><td> Boolean </td><td> is marker visible (true/false)</td><td> </td>
</tr>
<tr>
  <td> id </td><td> String </td><td> id for marker.</td><td> /td>
</tr>
</table>

## Examples

Hide wanted marker from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [false, 'TEST_MARKER_ID']);
```

Hide all markers from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [false]);
```

Show wanted marker from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [true, 'TEST_MARKER_ID']);
```

Show all markers from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [true]);
```

## Related api

- addMarkerRequest

