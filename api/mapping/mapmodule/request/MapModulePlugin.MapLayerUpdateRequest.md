# MapModulePlugin.MapLayerUpdateRequest

Update the map layer data on map.

## Use cases

- Update WMS-layer with additional parameters on GetMap calls
- Refetches features from vector source from the server

## Description

Can be used to refresh a WMS-layer by adding parameters to the GetMap requests like SLD on compatible services or after updating contents of a WFS-service refetch the updated features.

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> \* MapLayerId </td><td> String </td><td> id of map/vector layer used in Oskari.mapframework.service.MapLayerService </td><td> </td>
</tr>
<tr>
  <td> forced </td><td> Boolean </td><td> Forces the update (attaches a timestamp variable for WMS etc). Some parameters might not trigger the update automatically so this tries to make sure the content is refetched from the service. </td><td> </td>
</tr>
<tr>
  <td> params </td><td> Object </td><td> For adding parameters to the request you can attach an object where keys are the params with values being the param value. Does not affect WFS layers currently. </td><td> </td>
</tr>
</table>
