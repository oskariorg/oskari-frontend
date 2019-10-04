# AddFeaturesToMapRequest [RPC]

Allows user to add features to map.

## Use cases

- add features to map
- update features from map, for example highlight

## Description

Vector features can be added on the map. The request must contain the geometries of the features. The geometry must be provided either as a WKT-string or a GeoJSON - object. Request creates a new feature layer if any layer with given layer id doesn't exist. Optionally, also additional layer control options such as features' style can be provided in a JSON-object. Recommendable practice is to prepare a layer with [VectorLayerRequest](/api/requests/#unreleased/mapping/mapmodule/request/vectorlayerrequest) before adding features.

WKT
```javascript
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";
```

GeoJSON
```javascript
var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3067'
        }
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[488704, 6939136], [489704, 6949136]]
          },
          'properties': {
            'test_property': 1
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [488704, 6939136]
          },
          'properties': {
            'test_property': 2
          }
        }
      ]
};
```

Geometry can also feature properties object. This will identify feature what you want to update. This is usefull for example highlight feature.
```javascript
var updateFeature = {'test_property':2};
```

## Examples

Usage example (GeoJSON)

```javascript
// Define the features as GeoJSON
var x = 488704, y = 6939136;
var geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3067'
        }
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'LineString',
            'coordinates': [[x, y], [x+1000, y+1000]]
          },
          'properties': {
            'test_property': 1
          }
        },
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Point',
            'coordinates': [x, y]
	      },
	      'properties': {
	        'test_property': 2
	      }
        }
      ]
    };

// Add the features on a specific layer
var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
var layerOptions = {
  layerId: 'MY_VECTOR_LAYER',
  centerTo: true
};

Oskari.getSandbox().postRequestByName(rn, [geojsonObject, layerOptions]);
```
<b>layerId</b> - In case you want to add features on a specified layer (if the layer does not exist one will be created). Needed, if at a later point you need to be able to remove features on only that specific layer.

See [VectorLayerRequest](/api/requests/#unreleased/mapping/mapmodule/request/vectorlayerrequest) for vector layer options definitions.

See [Oskari JSON style](/documentation/examples/oskari-style) for Oskari style object definition.

Usage example (WKT)

```javascript
// Define a wkt-geometry
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";

// Some attributes for the feature
var attributes = {
  test_property: 1
};

// Add features
var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
var layerOptions = {
  layerId: 'MY_VECTOR_LAYER',
  centerTo: true,
  attributes
};

Oskari.getSandbox().postRequestByName(rn, [WKT, layerOptions]);
```


Update specific feature.
```javascript
// First add feature, feature format can be an WKT or GeoJSON
// Define a wkt-geometry
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";

// Some attributes for the feature
var attributes = {
  test_property: 100
};

// Add features
Oskari.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [WKT, {
    layerId: 'MY_VECTOR_LAYER',
    clearPrevious: true,
    attributes: attributes
}]);

// Now update previously added feature
// For example change style and animate 1 second shift to new style
var featureStyle = {
  stroke: {
    color: '#00FF00',
    width: 5
  },
  fill {
    color: '#0000FF'
  }
};

// Define wanted feature attributes
var updatedFeatureAttributes = {'test_property':1};
var params = [updatedFeatureAttributes, {
    featureStyle: featureStyle,
    layerId: 'MY_VECTOR_LAYER',
    animationDuration: 1000
}];

Oskari.getSandbox().postRequestByName(
    'MapModulePlugin.AddFeaturesToMapRequest',
    params
);
```

## Related api

- VectorLayerRequest
- RemoveFeaturesFromMapRequest

