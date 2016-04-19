# ChangeMapLayerOpacityRequest [RPC]

Allows user to change map layer opacity on a map.

## Use cases

- change map layer opacity

## Description

Requests a map layer opacity to be changed on a map. 

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* mapLayerId </td><td> String </td><td> id for maplayer to be modified (Oskari.mapframework.service.MapLayerService) </td><td> </td>
</tr>
<tr>
  <td> \* opacity </td><td> Number </td><td> desired opacity of the map layer (0-100) </td><td> </td>
</tr>
</table>

## Examples

Change map layer opacity to 50 %.
```javascript
var sb = Oskari.getSandbox();
var new_opacity = 50;
sb.postRequestByName('ChangeMapLayerOpacityRequest', [layer.id, new_opacity]);
```
