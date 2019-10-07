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

## Related api

- MapTourRequest
