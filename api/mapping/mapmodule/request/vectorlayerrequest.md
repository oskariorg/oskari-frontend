# VectorLayerRequest [RPC]

Adds a new feature layer to map or updates an existing layer.

## Use cases

- Add a new feature layer
- Update layer properties

## Description

Prepares a layer for later use or updates an existing layer. 

The request takes one parameter, options.

|Key|Type|Description|
|---:|:---:|:---|---|
| layerId | string | In case you want to add layer with specified id (if the layer does not exist one will be created). Needed, if at a later point you need to be able to remove features on only that specific layer or update the layer's properties. |
| layerInspireName | string | Layer Inspire name (theme) when adding layer to visible (see showLayer). |
| layerOrganizationName | string | Layer organization name when adding layer to visible (see showLayer). |
| showLayer | boolean | Adds layer to layer selector as a selected map layer. |
| opacity | number | Opacity value, 0-100 |
| layerName | string | Name |
| layerDescription | string | Description |
| layerPermissions | object | Permissions `{ publish: 'publication_permission_ok' }` |
| minScale | number | Feature min scale when zoomTo option is used. Don't let map scale to go below the defined scale when zoomed to features. |
| maxScale | number | Feature max scale when zoomTo option is used. Don't let map scale to go below the defined scale when zoomed to features. |
| hover | object | See Hover Settings section below |

Example object
```javascript
{
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
    minScale: 1451336,
    maxScale: 1,
    hover: {
        'content': [
            { 'key': 'Feature ID', 'valueProperty': 'id' }
        ]
    }
}
```

### Hover Settings

Hover describes how to visualize features on mouse hover and what kind of tooltip should be shown. Note that features are not hovered while drawing is active (DrawTools). 

Hover has two optional keys `featureStyle` and `content`. See [Oskari JSON style](/documentation/examples/oskari-style) for `featureStyle` definition.

Content should be content of tooltip as an array. Each object creates a row to the tooltip.
Each row object has `key` or `keyProperty` and `valueProperty`.
`key` is a label and will be rendered as is.
`valueProperty` and `keyProperty` will be fetched from the feature's properties.

```javascript
'hover': {
    'featureStyle':  {...},
    'content': [
        { 'key': 'Feature Data' },
        { 'key': 'Feature ID', 'valueProperty': 'id' },
        { 'keyProperty': 'type', 'valueProperty': 'name' }
    ]
}
```
Exampe above would create a tooltip like

Feature Data
Feature ID: 23098523243
Road: Main Street

## Examples
### Adding a new layer example
Only prepares a layer for later use. To add features to this layer see [AddFeaturesToMapRequest](/api/requests/#unreleased/mapping/mapmodule/request/addfeaturestomaprequest.md).

```javascript
const options = {
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
    minScale: 1451336
};
Oskari.getSandbox().postRequestByName('VectorLayerRequest', [options]); 

```
### Update layer properties example
Define layerId which matches layer's id which should be updated. Add properties which should be updated. Note that if id doesn't match any existing layer, a new layer will be created.

```javascript
const newOptions = {
    layerId: 'MY_VECTOR_LAYER', // existing id
    opacity: 100,
    hover: {
        'content': [
            { 'key': 'Feature ID', 'valueProperty': 'id' }
        ]
    }
};
Oskari.getSandbox().postRequestByName('VectorLayerRequest', [newOptions]); 
```

## Related api

- VectorLayerRequest
- RemoveFeaturesFromMapRequest