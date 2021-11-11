# ChangeMapLayerStyleRequest [rpc]

Allow user to change map layer style on a map.

## Use cases

- change map layer style

## Description

Requests a map layer style to be changed on a map.

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
  <td> \* style </td><td> String </td><td> wanted style name (need be a configured a map service also) </td><td> </td>
</tr>
</table>

## Examples

Change map layer opacity to 50 %.
```javascript
var sb = Oskari.getSandbox();
var new_style_name = 'new_awesome_style';
sb.postRequestByName('ChangeMapLayerStyleRequest', [layer.id, new_style_name]);
```