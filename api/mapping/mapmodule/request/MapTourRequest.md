# MapTourRequest [RPC]

Allows programmatic tour around the map showcasing multiple locations

## Use cases

- Move the map along route for visualization purposes

## Description

Requests a map to be moved to certain zoom level and location for a duration of time, after that we move to the next zoom level and location until we are out of locations. Triggers afterMapMoveEvent.

## Parameters

The parameters consist of an array of location objects with options related to certain locations and options object that defines default options for the whole route.

(* means the parameter is required)

Parameters for location-object:
<table class="table">
<tr>
  <th>Name</th><th>Type</th><th>Description</th>
</tr>
<tr>
  <td> \* lon </td>
  <td> coordinate </td>
  <td> x coordinate of the camera location </td>
</tr>
<tr>
  <td> \* lat </td>
  <td> coordinate </td>
  <td> y coordinate of the camera location </td>
</tr>
<tr>
  <td> animation </td>
  <td> String </td>
  <td> The way how the camera moves to the location. Option are 'fly'|'pan'|'zoomPan'. NOTE! Currently 3D view supports only animation 'fly' </td>
</tr>
<tr>
  <td> zoom </td>
  <td> Object | Number </td>
  <td> { scale: 4000 } | {left, top, bottom, right} | 8 </td>
</tr>
<tr>
  <td> duration </td>
  <td> Number </td>
  <td> Time in milliseconds that it takes to move to this location.</td>
</tr>
<tr>
  <td> delay </td>
  <td> Number </td>
  <td> Time in milliseconds that the camera stays in the location.</td>
</tr>
<tr>
  <td> camera </td>
  <td> Object </td>
  <td> Orientation of the camera. Described in the next table.</td>
</tr>
</table>

Parameters for camera-object:
(NOTE! Currently all the parameters need to be given if any of those is given.)
<table class="table">
<tr>
  <th>Name</th><th>Type</th><th>Description</th>
</tr>
<tr>
  <td> heading </td>
  <td> Number </td>
  <td> Camera rotation in degrees [0, 360] from the local north direction where a positive angle is increasing. Default is 0,0 (north).</td>
</tr>
<tr>
  <td> roll </td>
  <td> coordinate </td>
  <td> Camera roll in degrees [0, 360)]. Roll is the first rotation applied about the local east axis. Default is 0,0. </td>
</tr>
<tr>
  <td> pitch </td>
  <td> Number </td>
  <td> Camera pitch in degrees [-180, 180]. Pitch is the rotation from the local east-north plane. Positive pitch angles are above the plane. Negative pitch angles are below the plane. Default is -90 (looking down). </td>
</tr>
</table>

Parameters for options-object are mostly the same options that can be given to location-object: animation, zoom, duration, delay and camera. These work as default options for the whole route. Besides the following options can be given to whole route:
<table class="table">
<tr>
  <th>Name</th><th>Type</th><th>Description</th>
</tr>
<tr>
  <td> srsName </td>
  <td> String </td>
  <td> Coordinate reference system, for example 'EPSG:3857' </td>
</tr>
</table>

## Examples

Map tour request for 3D view:
```javascript
var sb = Oskari.getSandbox();

var location1 = {
    lon: 2776319, 
    lat: 8435539,
    camera: {heading: 0, roll: 0, pitch: -50}
}
var location2 = { 
    lon: 2775484, 
    lat: 8444623,
    camera: {heading: 180, roll: 0, pitch: -80},
    duration: 20000
}
var location3 = {
    lon: 2776341, 
    lat: 8438528,
    camera: {heading: 180, roll: 0, pitch: -50},
    duration: 30000,
    zoom: 14
}
var location4 = {
    lon: 2776881, 
    lat: 8437044,
    camera: {heading: 90, roll: 0, pitch: -50},
    zoom: 15
}

var location5 = {
    lon: 2648813, 
    lat: 8736992,
    camera: {heading: 0, roll: 0, pitch: -40},
    zoom: 10,
    duration: 40000
}
var options = {
    zoom: 12,
    delay: 1000,
    duration: 10000
}

sb.postRequestByName('MapTourRequest', [[location1, location2, location3, location4, location5], options]);
```

## Related api

- MapTourEvent
