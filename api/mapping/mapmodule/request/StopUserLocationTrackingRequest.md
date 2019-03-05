# StopUserLocationTrackingRequestHandler

Stop tracking user's location.

## Description

The request is used to deactivate StartUserLocationRequest.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> options</td><td> Object</td><td> Parameters for options-object are listed in the next table</td><td></td>
</tr>
</table>

Parameters for options-object:

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> clearMap</td><td> Boolean</td><td> If true, removes user location or path from the map. Does nothing if StartUserLocationRequest didn't have option addToMap.</td><td> true</td>
</tr>
<tr>
  <td> removePath</td><td> Boolean</td><td> If true, removes user location coordinates.</td><td> false</td>
</tr>
</table>

## Examples

Stop tracking user's location and clear location from map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('StopUserLocationTrackingRequest');
```

## Related api

- StartUserLocationTrackinRequest
- UserLocationEvent
- RemoveFeaturesFromMapRequest
