# StatsGrid.RegionSelectedEvent

Used to notify that a region has been selected in statsgrid.
Components handling regions can update "highlighted" regions or the latest selection.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* regionset</td><td> Number </td><td> id for the selected regionset </td><td> </td>
</tr>
<tr>
  <td> \* region</td><td> Number </td><td> id for the selected region in the regionset </td><td> </td>
</tr>
<tr>
  <td> currentSelection</td><td> Number[] </td><td> for multiple selection this can be used to communicate the whole set of currently selected regions </td><td> array with region-param value as the only item </td>
</tr>
<tr>
  <td> triggeredBy </td><td> String </td><td> component id what triggered event  </td><td> component id (map/grid) or null </td>
</tr>

</table>

## Event methods

### getName()
Returns event name

### getRegionset()
Returns id for the regionset where the region can be found.

### getRegion()
Returns id for the region that was selected.

### getSelection()
Returns an array of selected region ids. Defaults to having an array of one region that is the same as returned by getRegion().