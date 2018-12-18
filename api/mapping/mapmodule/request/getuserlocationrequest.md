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
  <td> centerMap </td><td> Boolean </td><td> true if map should be centered to user's location</td><td> false</td>
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
  <td> addToMap</td><td> Boolean</td><td> If true adds user location to the map. The location (point) is added to vector layer with circle (polygon) expressing the location accuracy.</td><td> false</td>
</tr>
<tr>
  <td> enableHighAccuracy</td><td> Boolean</td><td> true to receive the best possible location results</td><td> false</td>
</tr>
<tr>
  <td> timeout</td><td> Number</td><td> Maximum length of time (in milliseconds) the device is allowed to take in order to return a position</td><td> 6000</td>
</tr>
<tr>
  <td> maximumAge</td><td> Number</td><td> Maximum age in milliseconds of a possible cached position. If set to 0 tries to attempt real (not cached) position.</td><td> 0</td>
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

Get accurate user location, add the location to the map and center the map to the location:
```javascript
var options = {
    enableHighAccuracy: true,
    timeout: 15000,
    addToMap: true
};
Oskari.getSandbox().postRequestByName('MyLocationPlugin.GetUserLocationRequest'[true, options]);
```

Remove user location from the map:
```javascript
Oskari.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', [null, null, 'USER_LOCATION_LAYER']);
```

## Related api

- UserLocationEvent
- AddFeaturesToMapRequest
- RemoveFeaturesFromMapRequest
