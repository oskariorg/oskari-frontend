# TimeChangedEvent [rpc]

Notifies of changed time

## Parameters
(* means the parameter is required)
<table>
    <tr>
        <th>Name</th><th>Type</th><th>Description</th><th>Default value</th>
    </tr>
    <tr>
        <td> \* time</td><td>String</td><td>time formatted as HH:mm</td><td></td>
    </tr>
    <tr>
        <td> \* date </td><td>String</td><td>date formatted as DD/mm</td><td></td>
    </tr>
</table>

## RPC

Event occurs after SetTimeRequest

## Event methods

### getName()
Returns name of the event

### getTime()
Returns time of the event

### getDate()
Returns date of the event

### getParams()
Returns all parameters of the event as an object:
```javascript
{
    'date': this.getDate(),
    'time': this.getTime()
};
```

## Related api

- SetTimeRequest
