# MapTourEvent [rpc]

Notifies status of MapTourRequest

## Parameters

<table>
    <tr>
        <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
    </tr>
    <tr>
        <td>status</td>
        <td>Object</td>
        <td>Object with status of MapTourRequest
         ```
           {
               step
               steps
           } 
         ```
        </td>
        <td></td>
    </tr>
    <tr>
        <td>location</td>
        <td>Object</td>
        <td>Object with current longitude and latitude
        ```
            {
                lon,
                lat
            }
        ```
        </td>
        <td></td>
    </tr>
    <tr>
        <td>completed</td>
        <td>Boolean</td>
        <td>Returns true if tour completed</td>
        <td></td>
    </tr>
    <tr>
        <td>cancelled</td>
        <td>Boolean</td>
        <td>Returns true if tour cancelled</td>
        <td></td>
    </tr>
</table>

## RPC

Event occurs after every step of MapMoveRequest

## Event methods

### getName()
Returns name of the event

### getStatus()
Returns status of the event

### getLocation()
Returns map location

### getCompleted
Returns completion status of tour

### getCancelled
Returns cancellation status of tour

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

- MapTourRequest
