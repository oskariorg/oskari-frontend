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
</table>

## Examples

Add layer with id 6 on the map.

```javascript
Oskari.getSandbox().postRequestByName('AddMapLayerRequest', [6]);
```
