# RemoveMapLayerRequest

Removes a map layer from map.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* mapLayerId </td><td> String </td><td> id for map layer to be removed (Oskari.mapframework.service.MapLayerService) </td><td> </td>
</tr>
</table>

## Examples

Remove layer with id 6 from the map.

```javascript
Oskari.getSandbox().postRequestByName('RemoveMapLayerRequest', [6]);
```
