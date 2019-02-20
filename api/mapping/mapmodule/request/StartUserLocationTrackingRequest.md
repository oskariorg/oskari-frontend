# StartUserLocationTrackingRequest

Start tracking user's location.

## Use cases

- Record path and add the path to the map
- Center the map to the user's location when location changes

## Description

This request is used to track user's geolocation. After the geolocation is changed a ``UserLocationEvent`` is triggered. Optionally the location or the path can be added to the map.

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
  <td> centerMap</td><td> String</td><td> If 'single', centers the map to user's location and zooms map according to location accuracy. If 'update', centers map also on location update.</td><td></td>
</tr>
<tr>
  <td> addToMap</td><td> String</td><td> If 'point', adds user's location as point. If 'location', adds point with location accuracy circle. If 'path', adds location path to the map and adds new point to path on location update.</td><td> false</td>
</tr>
<tr>
  <td> enableHighAccuracy</td><td> Boolean</td><td> true to receive the best possible location results</td><td> true</td>
</tr>
<tr>
  <td> timeout</td><td> Number</td><td> Maximum length of time (in milliseconds) the device is allowed to take in order to return a position</td><td> 6000</td>
</tr>
<tr>
  <td> maximumAge</td><td> Number</td><td> Maximum age in milliseconds of a possible cached position. If set to 0 tries to attempt real (not cached) position.</td><td> 5000</td>
</tr>
</table>

## Examples

Start tracking user's location, move the map to location and add location with accuracy circle to the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('StartUserLocationTrackingRequest', [{addToMap: 'location', centerMap: 'single'}]);
```

Start tracking user's location and add path to the map:
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('StartUserLocationTrackingRequest', [{addToMap: 'path', centerMap: 'update'}]);
}
```

## Related api

- StopUserLocationTrackingRequest
- UserLocationEvent
- AddFeaturesToMapRequest
