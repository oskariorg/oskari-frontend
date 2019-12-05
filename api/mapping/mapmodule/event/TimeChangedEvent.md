# TimeChangedEvent [rpc]

Notifies of changed time

## Parameters

<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th><th>Default value</th>
    </tr>
    <tr>
        <td>Time</td>
        <td>String</td>
        <td>ISOString of date and time formatted as YYYY-MM-DDTHH:mm:ss.sssZ
         ```
           1970-01-01T09:00:00.000Z
         ```
        </td>
        <td></td>
    </tr>
</table>

## RPC

Event occurs after SetTimeRequest

## Event methods

### getName()
Returns name of the event

### getTime()
Returns setTime of the event

## Related api

- SetTimeRequest
