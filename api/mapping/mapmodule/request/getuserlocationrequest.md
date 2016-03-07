# GetUserLocationRequest [RPC]

Get user's location

## Use cases

- Center map to user's location

## Description

This request is used to get user's geolocation. After the geolocation is completed a ``UserLocationEvent`` is triggered where following data is available:
- event.getLon(), tells user geolocation lon coordinate
- event.getLat(), tells user geolocation lat coordinate

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> centerMap </td><td> Boolean </td><td> true if map should be centered to user's location</td><td> </td>
</tr>
</table>

## Examples

Get user geolocation and center map to user location:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MyLocationPlugin.GetUserLocationRequest');
if (reqBuilder) {
	var request = reqBuilder(true);
    sb.request('MainMapModule', request);
}
```

Get user geolocation and not center map to user location:
```javascript
var sb = Oskari.getSandbox();
var reqBuilder = sb.getRequestBuilder('MyLocationPlugin.GetUserLocationRequest');
if (reqBuilder) {
	var request = reqBuilder(false);
    sb.request('MainMapModule', request);
}
```

## Related api

- UserLocationEvent
