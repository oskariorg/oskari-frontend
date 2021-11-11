# ChangeMapLayerStyleRequest [rpc]

Allow user to change map layer style between preconfigured options on the map (styles available for a WMS-layer etc).

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

Change map layer style to `new_awesome_style`.
```javascript
const sb = Oskari.getSandbox();
const layerId = 1;
const newStyleName = 'new_awesome_style';
sb.postRequestByName('ChangeMapLayerStyleRequest', [layerId, newStyleName]);
```