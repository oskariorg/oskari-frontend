# StatsGrid.ActiveIndicatorChangedEvent

Notifies when an indicator has been selected (in grid etc).
Components handling indicators should update a "highlighted" indicator where needed.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> current</td><td> Object </td><td> object describing the current active indicator </td><td> undefined </td>
</tr>
<tr>
  <td> previous</td><td> Object </td><td> object describing the previus active indicator </td><td>undefined </td>
</tr>
</table>

Both current and previous have the same type object as value:

```javascript
{
    datasource : <datasource id as number>,
    indicator : <indicator id as number>,
    selections : <object with key-value pairs of the selection>,
    hash : <an internal identifier that presents the above as a string>
}
```

## Event methods

### getName()
Returns event name

### getCurrent()
Returns id for the regionset where the region can be found. Note! This might be undefined for example when the last selected indicator was removed.

### getPrevious()
Returns id for the region that was selected. Note! This might be undefined for example this is the first indicator added.