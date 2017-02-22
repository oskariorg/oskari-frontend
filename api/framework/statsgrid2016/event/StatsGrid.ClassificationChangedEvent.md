# StatsGrid.ClassificationChangedEvent

Notifies when an classification has been changed (in edit classification).


## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> current</td><td> Object </td><td> object describing the current classification </td><td>  </td>
</tr>
<tr>
  <td> previous</td><td> Object </td><td> object describing the previous classification </td><td> </td>
</tr>
</table>

Both current and previous have the same type object as value:

```javascript
{
    method: <method as string>,
    count: <classification count as number>,
    mode: <mode as string>,
    type: <type as string>,
    colorIndex: <color index as number>,
    reverseColors: <reverse colors as boolean>
}
```

## Event methods

### getName()
Returns event name

### getCurrent()
Returns current classification object.

### getPrevious()
Returns previous classification object.