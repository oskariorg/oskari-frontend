# RearrangeSelectedMapLayerRequest [rpc]

Allow user to change order of map layers in relation to other layers on the map.

## Use cases

- change selected map layer position

## Description

Requests order of a map layer to be changed in relation to other layers on the map.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* layerId </td><td> Number </td><td> id for maplayer to be modified (Oskari.mapframework.service.MapLayerService) </td><td> </td>
</tr>
<tr>
  <td> \* position </td><td> Number </td><td> wanted new position </td><td> </td>
</tr>
</table>

## Examples

Change map layer position to 0.
```javascript
const sb = Oskari.getSandbox();
const layerId = 1;
const newPosition = 0;
sb.postRequestByName('RearrangeSelectedMapLayerRequest', [layerId, newPosition]);
```