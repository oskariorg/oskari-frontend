# StatsGrid.RegionsetChangedEvent

Used to notify that the regionset has changed in statsgrid and any region listing or region specific data should be updated to use the selected regionset and it's regions. Note that both current and previous regionsets can be undefined.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> regionset</td><td> Number </td><td> id for the selected regionset </td><td> undefined </td>
</tr>
<tr>
  <td> previous</td><td> Number </td><td> id for the previously selected regionset </td><td> undefined </td>
</tr>
</table>

## Event methods

### getName()
Returns event name

### getRegionset()
Returns id for the selected regionset. Note! Value can be undefined

### getPrevious()
Returns id for the previously selected regionset. Note! Value can be undefined