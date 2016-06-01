# ZoomToFeaturesRequest [RPC]

Zoom to specific or all features on a map.

## Use cases

- Zoom to features on a map

## Description

This request is used to zoom to the extent of all or specific features on the specified layers. If layer(s) not giving, will zoom to all features on the layers, that were created by the VectorLayerPlugin

## Parameters

(* means the parameter is required)

<table class="table">
<tr>
  <th> Name</th><th> Type</th><th> Description</th><th> Default value</th>
</tr>
<tr>
  <td> layer</td><td> Array</td><td> Zooming will be applied to the features on the specified layers. </td><td> All layers, that were created by the VectorLayerPlugin</td>
</tr>
<tr>
  <td> features: key - property name, value - list of property's values </td><td> Array</td><td> Zooming will be applied to the specified features. <br> If not giving, will zoom to all features on the specified layers.</td><td> All features on the specified layers.</td>
</tr>
</table>

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