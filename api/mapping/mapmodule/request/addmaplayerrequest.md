# AddMapLayerRequest

Adds a layer to the map.

## Description

Requests a map layer to be added on the map. Note that the layer details are required to be available on the MapLayerService so it can be referenced with an id. Bundles like layerlist load the collection of layers that are available for the user to the MapLayerService.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* mapLayerId </td><td> String </td><td> id for map layer to be added (Oskari.mapframework.service.MapLayerService) </td><td> </td>
</tr>
<tr>
  <td> options </td><td> Object </td><td> additional options for the layer to be added. The only currently handled key is `userStyles` which is passed on to DescribeLayer to get any styles associated for the layer when using it on a published map. If userStyles is not passed (for guest users) the layer only has the styles added by admin and the style that is referenced as current style. </td><td> </td>
</tr>

</table>

## Examples

Add layer with id 6 on the map.

```javascript
Oskari.getSandbox().postRequestByName('AddMapLayerRequest', [6]);
```
