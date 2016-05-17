# MapModulePlugin.MapLayerVisibilityRequest [RPC]

Allows user to change map layer visibility.

## Use cases

- Hide or show map/vector layer on a map

## Description

Requests a layer to be shown or hidden on a map. Triggers mapLayerVisibilityChangedEvent.

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
  <td> \* visible </td><td> Boolean </td><td> should map/vector layer be visible or not </td><td> </td>
</tr>
</table>

## Examples

Hide map layer on a map
```javascript
var sb = Oskari.getSandbox();
visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
if (visibilityRequestBuilder) {
    var request = visibilityRequestBuilder(this._layer.getId(), false);
    sandbox.request(this, request);
}
```

Hide vector layer on a map
```javascript
var vectorLayerId = 'VECTOR';
var sb = Oskari.getSandbox();
visibilityRequestBuilder = sandbox.getRequestBuilder('MapModulePlugin.MapLayerVisibilityRequest');
if (visibilityRequestBuilder) {
    var request = visibilityRequestBuilder(vectorLayerId, false);
    sandbox.request(this, request);
}
```

## Related api

- afterMapLayerVisibilityChangedEvent