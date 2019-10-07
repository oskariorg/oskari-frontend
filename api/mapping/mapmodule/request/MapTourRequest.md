# MapTourRequest [RPC]

Allows programmatic tour around the map showcasing multiple locations

## Use cases

- Move the map along route for visualization purposes

## Description

Requests a map to be moved to certain zoom level and location for a duration of time, after that we move to the next zoom level and location until we are out of locations. Triggers afterMapMoveEvent.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* locations </td>
  <td> Array of Objects</td>
  <td> List of locations as an array of objects.
    Contains longitude, latitude and various optional override options 
    ```javascript
    [
        {
            lon: x,
            lat: y
        },
        {
            lon: x,
            lat: y,
            animation: 'fly'|'pan'|'zoomPan',
            zoom: { scale: 4000 } | {left, top, bottom, right} | 8,
            duration: 3000,
            delay: 750,
            camera: {
                heading: -2,
                roll: 0.5,
                pitch: -0.1
            }
        }
    ]
    ```</td>
  <td></td>
</tr>
<tr>
  <td> options </td>
  <td> Object </td>
  <td> 
  Object with optional parameters for options as default for all locations.
  ```javascript
  { 
    srsName: 'EPSG:3857',
    cancelled: () => true,
    completed: () => true,
    animation: 'fly'|'pan'|'zoomPan',
    zoom: { scale: 4000 } | {left, top, bottom, right} | 8,
    duration: 3000,
    delay: 750,
    camera: {
        heading: -2,
        roll: 0.5,
        pitch: -0.1
    }
  }
  ```
  </td>
  <td> </td>
</tr>
</table>

## Examples

Tour map
```javascript
var sb = Oskari.getSandbox();

var location1 = { 
        lon: 552935, 
        lat: 7332639,
        delay: 2000
    }
var location2 = {
        lon: 8438530,
        lat: 2789651,
        duration: 6000
    }
var location3 = {
        lon: 8500506,
        lat: 2479009,
    }
var options = {
        zoom: 10, 
        animation: 'fly', 
        duration: 3000,
        camera: {
            heading: -0.14003,
            roll: 0.00001,
            pitch: -0.35
        },
		delay: 2000
    }

sb.postRequestByName('MapTourRequest', [[location1, location2, location3], options]);
```

## Related api

- MapTourEvent
