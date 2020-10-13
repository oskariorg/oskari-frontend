# ZoomToFeaturesRequest [RPC]

Moves map to show referenced vector features on the viewport.

## Use cases

- Zoom to features on a map

## Description

This request is used to zoom/move the map so requested features are visible on the map viewport. Requested features can be selected by referencing a vector layer and/or referencing attribute data values. If selection is not made the map is zoomed out to show all vector features that have been programmatically added to the map (features added directly from services/map layers providing vector features are not included).

## Parameters

All of the parameters for this request are optional.

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> options</td><td> Object</td><td> Can be used to select layers to include or max zoom level </td><td> See below</td>
</tr>
<tr>
  <td> feature filter </td><td> Object </td><td> Features to zoom to can be selected by defining filters with this parameter. If not provided the features are not filtered.</td><td> No filter/all features on the specified layers are shown.</td>
</tr>
</table>

### Param: options

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> layer</td><td> Array</td><td> Features to show are only included from layers matching ids referenced in the array</td><td> All layers that were created for programmatically added features (by VectorLayerPlugin)</td>
</tr>
<tr>
  <td> maxZoomLevel</td><td> Number</td><td> Can be used to restrict how "close" we want to zoom if the features are very close to each other or a single point.</td><td> No restriction</td>
</tr>
</table>

### Param: feature filter

The feature filter is an object where keys are feature attribute names. The value for specific key is an array listing the accepted values for that attribute. If a feature has that attribute with any of the listed values it will be included in the set.

For example:
```
{
	"name": ["F1","F2"]
}
```

The above filter would only include features where the name attribute has a value of "F1" or "F2".

## Examples

Zoom to extent of the features with id=='F1' or id=='F2' on the layer with layerId == 'layer1' or layerId == 'layer2':
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('MapModulePlugin.ZoomToFeaturesRequest', [
	{layer: ['layer1','layer2']}, 
	{'id': ['F1','F2']}
]);
```

After the zooming is completed a 'FeatureEvent' is triggered with operation 'zoom' and array of the features that was zoomed to.

Zoom to all features on the layer, where layerId == 'testlayer':
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('MapModulePlugin.ZoomToFeaturesRequest', [
	{layer: ['testlayer']}, 
	{}
]);
```
After the zooming is completed a 'FeatureEvent' is triggered with operation 'zoom' and array of the features that was zoomed to.

Zoom to all features on the layers, that are handling by the VectorLayerPlugin 
```javascript
var sb = Oskari.getSandbox();
sb.postRequestByName('MapModulePlugin.ZoomToFeaturesRequest', []);
```
After the zooming is completed a 'FeatureEvent' is triggered with operation 'zoom' and array of the features that was zoomed to.