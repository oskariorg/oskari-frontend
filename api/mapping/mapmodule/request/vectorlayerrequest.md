# VectorLayerRequest [RPC]

Adds a new feature layer to map or updates an existing layer.

## Use cases

- Add a new feature layer
- Update layer properties
- Remove vector features layer

## Description

Prepares a layer for later use or updates an existing layer for vector features.

The request takes one parameter, options.

|Key|Type|Description|Example value|
|:---|:---:|:---|:---:|
| layerId | string | In case you want to add layer with specified id (if the layer does not exist one will be created). Needed, if at a later point you need to be able to remove features on only that specific layer or update the layer's properties. | `'MY_VECTOR_LAYER'` |
| layerInspireName | string | Layer Inspire name (theme) when adding layer to visible (see showLayer). | `'Inspire theme name'` |
| layerOrganizationName | string | Layer organization name when adding layer to visible (see showLayer). | `'Organization name'` |
| showLayer | boolean / string | Adds layer to layer selector as a selected map layer or if set to `registerOnly` only adds layer to layer selector list without selection. | `true` |
| opacity | number | 0-100 | `80` |
| layerName | string | Name | `'Layer name'` |
| layerDescription | string | Description | `'Description text'` | 
| layerPermissions | object | Permissions | `{ publish: 'publication_permission_ok' }` |
| minResolution | number | Features are not shown if map resolution isn't below this. | `128` |
| maxResolution | number | Features are not shown if map resolution isn't above this. | `0.25` |
| hover | object | Describes how to visualize features on hover and what kind of tooltip should be shown. | See Hover Settings below |
| remove | boolean | If the key is present with "truthy" value the layer referenced with layerId is removed from the map. Defaults to undefined. | `true` |

Note! You can use minZoomLevel / maxZoomLevel or minScale / maxScale instead of minResolution / maxResolution.

### Hover Settings

Note that features are not hovered while drawing is active (DrawTools). 

Hover has two optional keys `featureStyle` and `content`. See [Oskari JSON style](/documentation/examples/oskari-style) for `featureStyle` definition.

Content should be content of tooltip as an array. Each object creates a row to the tooltip.
Each row object has `key` or `keyProperty` and `valueProperty`.
`key` is a label and will be rendered as is.
`valueProperty` and `keyProperty` will be fetched from the feature's properties.

For example:
```javascript
{
    'featureStyle':  {
        'inherit': true,
        'effect': 'darken'
    },
    'content': [
        { 'key': 'Feature Data' },
        { 'key': 'Feature ID', 'valueProperty': 'id' },
        { 'keyProperty': 'type', 'valueProperty': 'name' }
    ]
}
```
The features would be darker on mouse hover and they would have a tooltip like:
```
Feature Data
Feature ID: 23098523243
Road: Main Street
```

## Examples
### Adding a new layer example
Only prepares a layer for later use. To add features to this layer see [AddFeaturesToMapRequest](/api/requests/#unreleased/mapping/mapmodule/request/addfeaturestomaprequest.md).

```javascript
var options = {
    layerId: 'MY_VECTOR_LAYER',
    layerInspireName: 'Inspire theme name',
    layerOrganizationName: 'Organization name',
    showLayer: true,
    opacity: 80,
    layerName: 'Layer name',
    layerDescription: 'Description text',
    layerPermissions: {
        'publish': 'publication_permission_ok'
    },
    maxScale: 1,
    minScale: 1451336,
    hover: {
        'featureStyle':  {
            'inherit': true,
            'effect': 'darken'
        }
    }
};
Oskari.getSandbox().postRequestByName('VectorLayerRequest', [options]); 

```
### Update layer properties example

Define layerId which matches layer's id which should be updated. Add properties which should be updated. Note that if id doesn't match any existing layer, a new layer will be created.

```javascript
var newOptions = {
    layerId: 'MY_VECTOR_LAYER', // existing id
    opacity: 100,
    hover: {
        'featureStyle':  {
            'inherit': true,
            'effect': 'darken'
        },
        'content': [
            { 'key': 'Feature ID', 'valueProperty': 'test_property' }
        ]
    }
};
Oskari.getSandbox().postRequestByName('VectorLayerRequest', [newOptions]); 
```

### Remove existing vector layer as part of cleanup

Define layerId which matches layer's id which should be removed. Add a remove-flag with boolean true value to remove the layer.

```javascript
Oskari.getSandbox().postRequestByName('VectorLayerRequest', [{
    layerId: 'MY_VECTOR_LAYER', // existing id
    remove: true
}]);
```

## Related api

- AddFeaturesToMapRequest
- RemoveFeaturesFromMapRequest
