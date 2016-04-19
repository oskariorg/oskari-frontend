# GetFeatureInfoRequest [RPC]

Display feature info box.

## Use cases

- show feature info in certain point

## Description

Requests feature info for the given spot on the map to be shown.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* lon </td><td> Number </td><td> x coordinate of the feature info location</td><td> </td>
</tr>
<tr>
  <td> \* lat </td><td> Number </td><td> y coordinate of the feature info location</td><td> </td>
</tr>
</table>

## Examples

Display feature info box om map
```javascript
var lonlat = [411650.70779123, 6751897.3481153];
var sb = Oskari.getSandbox();
sb.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', lonlat);
```