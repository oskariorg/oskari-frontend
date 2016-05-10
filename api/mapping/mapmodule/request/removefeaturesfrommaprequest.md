# RemoveFeaturesFromMapRequest [rpc]

Remove vector features from map

## Use cases

- remove features from specific layer
- remove all features from map

## Description

Removes all or specific vector features from the specified layer or all features from all layers. 

## Examples

Remove all vectors from all layers
```javascript
var rn = 'MapModulePlugin.RemoveFeaturesFromMapRequest';
this.sandbox.postRequestByName(rn, []);
```

Remove everything from a specific layer. The 'layer' parameter can be either layer_id (String) or layer-object (Openlayers).
```javascript
this.sandbox.postRequestByName(rn, [null, null, myLayer);
```

Remove all feature's whose 'test_property' === 1 from myLayer
```javascript
this.sandbox.postRequestByName(rn, ['test_property', 1, myLayer);
```
## Related api

- addFeaturesToMapRequest