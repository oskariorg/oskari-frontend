# VectorLayerRequest [RPC]

Adds a new feature layer to map or updates an existing layer.

## Use cases

- Add a new feature layer
- Update layer properties

## Description

Prepares a layer for later use.

Options object
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
    animationDuration: null,
    attributes: null,
    clearPrevious: true,
    centerTo: true,
    cursor: 'zoom-in',
    prio: 1,
    maxScale: 1,
    minScale: 1451336,    
    featureStyle: {},
    optionalStyles: [],  
    hover: {}
}
```
<ul>
    <li>
        <b>layerId</b> - In case you want to add layer with specified id (if the layer does not exist one will be created). Needed, if at a later point you need to be able to remove features on only that specific layer or update the layer's properties.
    </li><li>
        <b>layerInspireName</b> - Layer Inspire name when adding layer to visible (see showLayer).
    </li><li>
        <b>layerOrganizationName</b> - Layer organization name when adding layer to visible (see showLayer).
    </li><li>
        <b>showLayer</b> - Adds layer to layer selector as a selected map layer.
    </li><li>
        <b>opacity</b> - Layer opacity.
    </li><li>
        <b>layerName</b> - Layer name. If already added layer then update layer name.
    </li><li>
        <b>layerDescription</b> - Layer description. If already added layer then update layer description.
    </li><li>
        <b>layerPermissions</b> - Layer permissions.
    </li><li>
        <b>animationDuration</b> - On update requests it's possible to animate fill color change. Specify animation duration in ms.
    </li><li>
        <b>attributes</b> - Feature's attributes, especially handy when the geometry is a WKT-string.
    </li><li>
		<b>clearPrevious</b> - when true, the previous features will be cleared
	</li><li>
        <b>centerTo</b> - Whether to zoom to the added features.
    </li><li>
        <b>cursor</b> - Mouse cursor when cursor is over the feature.
    </li><li>
        <b>prio</b> - Feature prio. The lowest number is the must important feature (top on the map). The highest number is the least important.
    </li><li>
        <b>minScale</b> - Feature min scale when zoomTo option is used. Don't let map scale to go below the defined scale when zoomed to features.
    </li><li>
        <b>maxScale</b> - Feature max scale when zoomTo option is used. Don't let map scale to go below the defined scale when zoomed to features.
    </li><li>
        <b>featureStyle</b> - A Oskari style object.
    </li><li>
        <b>optionalStyles</b> - Array of Oskari styles for geojson features. Style is used, if filtering values matches to feature properties.
    </li><li>
        <b>hover</b> - Layer hover options. Oskari style with hover options.
    </li>
</ul>

FeatureStyle property defines a generic style used for all the features. With optionalStyles property you can specify style for certain features only. Hover options describes how to visualize features on hover and what kind of tooltip should be shown. Note that features isn't hovered while drawing is active (DrawTools).

See [Oskari JSON style](/documentation/examples/oskari-style) for style object definitions.

## Examples
### Adding a new layer example
Only prepares a layer for later use. To add features to this layer see [AddFeaturesToMapRequest](/api/requests/#unreleased/mapping/mapmodule/request/addfeaturestomaprequest).

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
    featureStyle: {},
    optionalStyles: [],
    hover: {}
};
Oskari.getSandbox().postRequestByName('VectorLayerRequest', [newOptions]); 
```
FeatureStyle property defines a generic style used for all the features. With optionalStyles property you can specify style for certain features only. The constructor is the same for both of these styles but in optionalStyle you also need to specify the feature it is used for.

See [Oskari JSON style](/documentation/examples/oskari-style) for style object definitions.

## Related api

- VectorLayerRequest
- RemoveFeaturesFromMapRequest