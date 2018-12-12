# VectorLayerRequest [RPC]

Adds a new feature layer to map or updates an existing layer.

## Use cases

- Add a new feature layer
- Update layer properties

## Description

Prepares a layer for later use. See AddFeaturesToMapRequest.

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
    hover: null
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
        <b>hover</b> - Layer hover options.
    </li>
</ul>

Hover options describes how to visualize features on hover and what kind of tooltip should be shown. Note that features isn't hovered while drawing is active (DrawTools).
```javascript
hover: {
    // Apply hover style only on features having property "class" with value "building"
    filter: [
        {key: 'class', value: 'building'}
    ],
    featureStyle: {
        inherit: true,
        effect: 'darken',
        stroke: {
            width: 3
        }
    },
    // Tooltips content as an array. Each object creates a row to the tooltip.
    content: [
        // "key" is a label and will be rendered as is.
        { key: 'Feature Data' },
        // "valueProperty" and "keyProperty" are fetched from the feature's properties.
        { key: 'Feature ID', valueProperty: 'id' },
        { keyProperty: 'name', valueProperty: 'value' }
    ]
}
```

Feature style in hover options
```javascript
featureStyle: {
  inherit: true, // Inherit feature's current style and override with own properties
  effect: 'darken', // Make feature's fill color darker. Other option is 'lighten'
  fill: { // fill styles
    color: '#ff00ff' // fill color
  },
  stroke: { // stroke styles
    color: '#ff00ff', // stroke color
    width: 3, // stroke width
    lineDash: 'dot', // line dash, also supported: dash, dashdot, longdash, longdashdot or solid
    lineCap: 'but' // line cap, also supported: round or square
  },
  text: { // text style
    fill: { // text fill style
      color: '#0000ff' // fill color
    },
    stroke: { // text stroke style
      color: '#ff00ff', // stroke color
      width: 4 // stroke width
    },
    font: 'bold 12px Arial', // font
    textAlign: 'top', // text align
    offsetX: 12, // text offset x
    offsetY: 12, // text offset y
    labelText: 'example', // label text
    labelProperty: 'propertyName' // read label from feature property
  },
  image: { // image style
    shape: 'marker.png', // external icon
    size: 3, // Oskari icon size.
    sizePx: 20, // Exact icon px size. Used if 'size' not defined.
    offsetX: 0, // image offset x
    offsetY: 0, // image offset y
    opacity: 0.7, // image opacity
    radius: 2 // image radius
  }
}
```
## Related api

- VectorLayerRequest
- RemoveFeaturesFromMapRequest