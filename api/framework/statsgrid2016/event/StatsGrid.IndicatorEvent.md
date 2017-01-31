# StatsGrid.IndicatorEvent

Used to notify that an indicator has been added to or removed from selected indicators.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* datasource</td><td> Number </td><td> datasource id where the indicator can be found </td><td> </td>
</tr>
<tr>
  <td> \* indicator</td><td> Number </td><td> id for the indicator </td><td> </td>
</tr>
<tr>
  <td> selections</td><td> Object </td><td> Object containing key-value pairs with the indicator parameters like { year : 2016 }</td><td> {} </td>
</tr>
<tr>
  <td> removed</td><td> Boolean </td><td> true if indicator was removed</td><td> false</td>
</tr>
</table>


## Event methods

### getName()
Returns event name

### getDatasource()
Returns datasource id

### getIndicator()
Returns indicator id

### getSelections()
Selections that user made for the indicator like { year : 2016 }

### isRemoved()
True if the indicator was removed, false if it was added.
