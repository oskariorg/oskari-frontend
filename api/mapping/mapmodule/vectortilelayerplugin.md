# Vector Tile Layer Plugin  

## Description

The plugin offers functionality to add Vector tile layers ([MVT](https://www.mapbox.com/vector-tiles/specification/)) to the map. Added layers support styling with Oskari style definitions, see featureStyle/optionalStyles in AddFeaturesToMapRequest. Maps with projection EPSG:3857 (Web Mercator) work out of the box, other projections need tile grid configuration in the layer options.


## Layer data model

The layer domain object is subclassed from AbstractLayer as usual.

The layer url must be in XYZ-format, eg. `https://mytiles.com/vectortile/{epsg}/{z}/{x}/{y}.pbf`. Placeholder `epsg` is optional and if present, will be replaced with current projection of the map, eg. `EPSG:3067`. Placeholders `x`, `y` and `z` will be replaced with tile coordinates calculated from the map view and tile grid.

The layer model field `options` is of type object having multiple optional keys `tileGrid`, `styles`, `hover` and `attributions`.

### Tile Grid

Map projections apart from EPSG:3857 (Web Mercator) need tile grid configuration in the layer options. The configuration format is in the format of Open Layers [TileGrid class options](http://openlayers.org/en/v5.2.0/apidoc/module-ol_tilegrid_TileGrid-TileGrid.html#TileGrid). For example:

```javascript
"tileGrid": {
    "origin": [-548576, 8388608],
    "resolutions": [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
    "tileSize": [256, 256]
}
```

### Styles

The appearance of the vector layer is defined with Oskari JSON style definition for each MVT internal "layer". If the `styles` key exists in the layer options, the value should be a object with at least key `default`, having the defalult style definition. Additionally other styles can be defined with additional keys, eg.

```javascript
"styles": {
    "default": {...},
    "myOwnStyle": {...},
    ...
}
```

Each style definition has keys for the MVT layer names that should be rendered:

```javascript
"styles": {
    "default": {
        "building": {...}
        "water": {...},
        "transportation": {...},
        "landcover": {...}
    },
    ...
}
```

And each key has object value with one or both keys `featureStyle`, `optionalStyles`. Content of these is defined at AddFeaturesToMapRequest documentation. Full style example:

```javascript
"styles": {
    "default": {
        "building": {
            "featureStyle": {
                "fill": {
                    "color": "#ff00ff"
                }
            },
            "optionalStyles": [
                {
                    "property": {
                        "key": "id",
                        "value": 417771333
                    },
                    "stroke": {
                        "color": "#000000",
                        "width": 2
                    }
                }
            ]
        }
    },
    "black_buildings": {
        "building": {
            "featureStyle": {
                "fill": {
                    "color": "#000000"
                }
            }
        }
    }
}
```

### Hover

Hover describes how to visualize features on mouse hover and what kind of tooltip should be shown.
Hover has two optional keys `featureStyle` and `content`.

Content should be content of tooltip as an array. Each object creates a row to the tooltip.
Each row object has `key` or `keyProperty` and `valueProperty`.
`key` is a label and will be rendered as is.
`valueProperty` and `keyProperty` will be fetched from the feature's properties.

```javascript
"hover": {
    "featureStyle":  {...},
    "content": [{...}]
        { "key": "Feature Data" },
        { "key": 'Feature ID', "valueProperty": "id" },
        { "keyProperty": "type", "valueProperty": "name" }
    ]
}
```
Exampe above would create a tooltip like

Feature Data
Feature ID: 23098523243
Road: Main Street

### Attributions

Defines layer attributions to be shown at the bottom of the map.
If the `link` property is defined, renders an attribution as a link to the given address.

```javascript
"attributions": [
    {"label": "© MapTiler", "link":"https://www.maptiler.com/license/maps/"},
    {"label": "© OpenStreetMap contributors", "link":"https://www.openstreetmap.org/copyright"}
]
```

## TODO

* Layer collections. Only individual layers are currently supported.

## Plugin configuration

No configuration is required. 

## Plugin state

No statehandling has been implemented.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> imported from NPM</td>
    <td> Uses OpenLayers Vector tile source & layer support</td>
  </tr>
</table>
