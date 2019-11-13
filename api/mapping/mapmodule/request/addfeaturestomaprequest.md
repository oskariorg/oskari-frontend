# AddFeaturesToMapRequest [RPC]

Allows user to add features to map.

## Use cases

- add features to map
- update features from map, for example highlight

## Description

Adds vector features to the map or updates existing features.

The request takes two parameters. The first describes the features. When updating existing features on map, the first parameter is an object containing feature attributes that are used for feature matching. The second parameter is for options which are the same in both cases.

#### Adding features to map

The first parameter, geometry must be provided either as a WKT-string or a GeoJSON - object. Request creates a new feature layer if any layer with given layer id doesn't exist. Optionally, also additional layer control options such as features' style can be provided in a JSON-object. 

Recommendable practice is to prepare a layer with [VectorLayerRequest](/api/requests/#unreleased/mapping/mapmodule/request/vectorlayerrequest.md) before adding features.

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

#### Updating existing features on map

The first parameter is an object containing a feature property that is used for feature matching. The value can be an array or a single value.

```javascript
var updateFeatureWithProperty = {'test_property': [1,2]};
```

The property value can also be an object of properties that will be added to matching features.

```javascript
var updateFeatureWithProperty = {
  'test_property': [
    { 'value': 1, 'newly_added_property': 10 },
    { 'value': 2, 'new_added_property': 20 },
  ]
};
```

#### Options
The second parameter is options.

|Key|Type|Description|
|---:|:---:|:---|
| layerId | string | Layer's id to specify which layer you want to add features (if the layer does not exist one will be created).|
| animationDuration | number | On update requests it's possible to animate fill color change. Specify animation duration in ms.|
| attributes | object | Feature's attributes, especially handy when the geometry is a WKT-string.|
| clearPrevious | boolean | when true, the previous features will be cleared|
| centerTo | boolean | Whether to zoom to the added features.|
| cursor | string | Mouse cursor when cursor is over the feature.|
| prio | number | Feature prio. The lowest number is the must important feature (top on the layer). The highest number is the least important.|
| featureStyle | object | Defines a generic style used for all the features.|
| optionalStyles | array | Array of Oskari styles for geojson features. Style is used, if filtering values matches to feature properties.|

See [Oskari JSON style](/documentation/examples/oskari-style) for style object definitions.

## Examples

Add feature using GeoJSON

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
var options = {
  layerId: 'MY_VECTOR_LAYER',
  centerTo: true
};

Oskari.getSandbox().postRequestByName(rn, [geojsonObject, options]);
```

Add feature using WKT

```javascript
// Define a wkt-geometry
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";

// Some attributes for the feature
var attributes = {
  test_property: 1
};

// Add features
var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
var options = {
  layerId: 'MY_VECTOR_LAYER',
  centerTo: true,
  attributes
};

Oskari.getSandbox().postRequestByName(rn, [WKT, options]);
```

Update specific feature

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

var options = {
    featureStyle: featureStyle,
    layerId: 'MY_VECTOR_LAYER',
    animationDuration: 1000
};

Oskari.getSandbox().postRequestByName(
    'MapModulePlugin.AddFeaturesToMapRequest',
     [updatedFeatureAttributes, options]
);
```

## RPC examples
See [Add or remove vector features](/examples/rpc-api/rpc_example.html) for full example.

## Related api
- VectorLayerRequest
- RemoveFeaturesFromMapRequest



