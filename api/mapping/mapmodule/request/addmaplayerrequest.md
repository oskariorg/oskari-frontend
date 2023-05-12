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
  <td> options </td><td> Object </td><td> additional options for the layer to be added. See details below.</td><td> </td>
</tr>
</table>

### Options

<table class="table">
<tr>
  <th> Name</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* mapLayerId </td><td> String </td><td> id for map layer to be added (Oskari.mapframework.service.MapLayerService) </td><td> </td>
</tr>
<tr>
  <td> userStyles </td><td> String </td><td> Passed on to DescribeLayer to get any styles associated for the layer when using it on a published map. If userStyles is not passed (for guest users) the layer only has the styles added by admin and the style that is referenced as current style. </td><td> </td>
</tr>
<tr>
  <td> zoomContent </td><td> boolean / any </td><td> If the key is present, a `MapModulePlugin.MapMoveByLayerContentRequest` is triggered directly after layer is added to the map. This is a workaround for AddMapLayerRequest no longer being synchoronous operation on Oskari 2.11. As the layer extent is loaded as a part of adding the layer to map, sending a MapMoveByLayerContentRequest manually right after requesting the layer to be added to map is not working properly. The value of this key is passed as a parameter to `MapModulePlugin.MapMoveByLayerContentRequest`. This requires the layer to have coverage information available and might not work properly if the service the layer is from has incorrect metadata/coverage information.</td><td> </td>
</tr>
</table>

## Examples

Add layer with id 6 on the map.

```javascript
Oskari.getSandbox().postRequestByName('AddMapLayerRequest', [6]);
```
