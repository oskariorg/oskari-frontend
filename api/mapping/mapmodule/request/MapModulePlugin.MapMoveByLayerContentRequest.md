# MapModulePlugin.MapMoveByLayerContentRequest

Allows the user to move the map by layer content.

## Use cases

- Focus the map to place where layer has content
- Focus the map to layer extent

## Description
Moves the map to zoom level that is in the scale with the requested maplayer.
Also moves the map to given layers content if it has content and there is no layer content in the current viewport.

Optionally requests a map to be moved to layer extent (a bounding box that encloses the layer's geometries) which is the zoom level and location where whole layer content is in the viewport.

Triggers AfterMapMoveEvent and MapLayerVisibilityChangedEvent.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* layerId </td><td> String </td><td> id for map layer used in </td><td> </td>
</tr>
<tr>
  <td>  zoomToExtent </td><td> Boolean </td><td> should the map to be zoomed and moved to layer extent </td><td> false </td>
</tr>
</table>

## Examples

Move the map to the layer content
```javascript
var sb = Oskari.getSandbox();

var layerId = layer.getId();

sb.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layerId]);
```

Move and zoom the map to the layer extent
```javascript
var sb = Oskari.getSandbox();

var layerId = layer.getId();

sb.postRequestByName('MapModulePlugin.MapMoveByLayerContentRequest', [layerId, true]);
```

## Related api

- AfterMapMoveEvent
- MapLayerVisibilityChangedEvent
