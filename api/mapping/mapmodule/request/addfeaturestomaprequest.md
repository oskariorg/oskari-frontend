# AddFeaturesToMapRequest [RPC]

Allows user to add features to map.

## Use cases

- add features to map
- update features from map, for example highlight

## Description

Vector features can be added on the map. The request must contain the geometries of the features. Optionally, also additional control options such as features' style can be provided in a JSON-object. The geometry must be provided either as a WKT-string or a GeoJSON - object, e.g.

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

Options object
```javascript
{
    layerId: 'MY_VECTOR_LAYER',
    clearPrevious: true,
    layerOptions: {
    	minResolution: 0,
    	maxResolution: 1000
    },
    centerTo: true,
    featureStyle: null,
    optionalStyles: null,
    attributes: null,
    cursor: 'zoom-in',
    prio: 1,
    minScale: 1451336,
    layerInspireName: 'Inspire theme name',
    layerOrganizationName: 'Organization name',
    showLayer: true,
    opacity: 80,
    layerName: 'Layer name',
    layerDescription: 'Description text',
    layerPermissions: {
        'publish': 'publication_permission_ok'
    }
}
```
<ul>
	<li>
		<b>layerId</b> - In case you want to add features on a specified layer (if the layer does not exist one will be created). Needed, if at a later point you need to be able to remove features on only that specific layer.
	</li>
	<li>
		<b>clearPrevious</b> - when true, the previous features will be cleared
	</li>
	<li>
		<b>layerOptions</b> - additional options of the layer.
	</li>
	<li>
		<b>centerTo</b> - Whether to zoom to the added features.
	</li>
	<li>
		<b>featureStyle</b> - A style object.
	</li>
	<li>
    <b>optionalStyles</b> - Styles for geojson features. Style is used, if feature property value matches to style property value
    </li>
	<li>
		<b>attributes</b> - Feature's attributes, especially handy when the geometry is a WKT-string.
	</li>
  <li>
    <b>cursor</b> - Mouse cursor when cursor is over the feature.
  </li>
  <li>
    <b>prio</b> - Feature prio. The lowest number is the must important feature (top on the map). The highest number is the least important.
  </li>
  <li>
    <b>minScale</b> - Feature min scale when zoomTo option is used. Don't let map scale to go below the defined scale when zoomed to features.
  </li>
  <li>
    <b>layerInspireName</b> - Layer Inspire name when adding layer to visible (see showLayer).
  </li><li>
    <b>layerOrganizationName</b> - Layer organization name when adding layer to visible (see showLayer).
  </li><li>
    <b>showLayer</b> - Adds layer to visible (adds layer to layerservice and also select current layer to selected).
  </li><li>
    <b>opacity</b> - Layer opacity.
  </li><li>
    <b>layerName</b> - Layer name. If already added layer then update layer name.
  </li><li>
    <b>layerDescription</b> - Layer description. If already added layer then update layer description.
  </li><li>
    <b>layerPermissions</b> - Layer permissions.
  </li>
</ul>

FeatureStyle/optionalStyles object

FeatureStyle property tells generic and all features used style. OptionalStyles property you can specify style only wanted features. In both of these are same style constructor but in OptionalStyle you need also tell feature where style is used:
```javascript
property: {
  key: 'id',
  value: region
}
```
<ul>
  <li>
    <b>key</b> - feature property what checked for use optional style.
  </li>
  <li>
    <b>value</b> - feature property value what need match to use optianal style for feature.
  </li>
</ul>
Both supported style object:
```javascript
"featureStyle/optionalStyle": {
  "fill": { // fill styles
    "color": "#ff00ff" // fill color
  },
  "stroke": { // stroke styles
    "color": "#ff00ff", // stroke color
    "width": 3, // stroke width
    "lineDash": "dot", // line dash, also supported: dash, dashdot, longdash, longdashdot or solid
    "lineCap": "but" // line cap, also supported: round or square
  },
  "text": { // text style
    "fill": { // text fill style
      "color": "#0000ff" // fill color
    },
    "stroke": { // text stroke style
      "color": "#ff00ff", // stroke color
      "width": 4 // stroke width
    },
    "font": "bold 12px Arial", // font
    "textAlign": "top", // text align
    "offsetX": 12, // text offset x
    "offsetY": 12, // text offset y
    "labelText": "example", // label text
    "labelProperty": "propertyName" // read label from feature property
  },
  "image": { // image style
    "shape": "marker.png", // external icon
    "size": 3, // Oskari icon size.
    "sizePx": 20, // Exact icon px size. Used if 'size' not defined.
    "offsetX": 0, // image offset x
    "offsetY": 0, // image offset y
    "opacity": 0.7, // image opacity
    "radius" 2 // image radius
  }
}
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
    };```

```
// Some additional options for the layer
var layerOptions = {
    'minResolution': 2,
    'maxResolution': 100
};
// Override some default styles
var featureStyle = {
  stroke: {
    color: '#FF0000',
    width: 10
  }
};
// Override feature style with feature property based style
var optionalStyles = [{
  property: {
      value: 'AIRPLANE',
      key: 'mode'
  },
  fill: {
      color: '#FF0000'
  },
  stroke: {
      color: '#FF0000',
      width: 5
  }
  },{
  property: {
      value: 'BUS',
      key: 'mode'
  },
  fill: {
      color: '#0000ff'
  },
  stroke: {
      color: '#0000ff',
      width: 5
  }
  }];
>- *key* is feature property name
>- *value* is the property matching value to style
```

```
// Add the features on a specific layer
var rn = 'MapModulePlugin.AddFeaturesToMapRequest';
Oskari.getSandbox().postRequestByName(rn, [geojsonObject, {
    layerId: 'MY_VECTOR_LAYER',
    clearPrevious: true,
    layerOptions: null,
    centerTo: false,
    featureStyle: featureStyle,
    attributes: null,
    optionalStyles: optionalStyles
}]);
```

Usage example (WKT)

```javascript
// Define a wkt-geometry
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";

// Some attributes for the feature
var attributes = {
  test_property: 1
};

// Styling
var featureStyle = {
  fill: {
    color: 'rgba(0,0,0,0.3)',
  },
  stroke: {
    color: '#FF0000',
    width: 10
  },
  text : {
    scale : 1.3,
	  fill : {
	    color : 'rgba(0,0,0,1)'
	  },
	  stroke : {
	    color : 'rgba(255,255,255,1)',
	    width : 2
	  },
	  labelProperty: 'test_property'
  }
};

// Add features
channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [WKT, {
    layerId: 'MY_VECTOR_LAYER',
    clearPrevious: true,
    layerOptions: null,
    centerTo: false,
    featureStyle: featureStyle,
    attributes: attributes
}]);
```

Update specific feature.
```javascript
// First add feature, feature format can be an WKT or GeoJSON
// Define a wkt-geometry
var WKT = "POLYGON ((358911.7134508261 6639617.669712467, 358911.7134508261 6694516.612323322, 382536.4910289571 6694516.612323322, 382536.4910289571 6639617.669712467, 358911.7134508261 6639617.669712467))";

// Some attributes for the feature
var attributes = {
  test_property: 1
};

// Styling
var featureStyle = {
  fill: {
    color: 'rgba(0,0,0,0.3)',
  },
  stroke: {
    color: '#FF0000',
    width: 10
  },
  text : {
    scale : 1.3,
    fill : {
      color : 'rgba(0,0,0,1)'
    },
    stroke : {
      color : 'rgba(255,255,255,1)',
      width : 2
    },
    labelProperty: 'test_property'
  }
};

// Add features
channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [WKT, {
    layerId: 'MY_VECTOR_LAYER',
    clearPrevious: true,
    layerOptions: null,
    centerTo: false,
    featureStyle: featureStyle,
    attributes: attributes
}]);

// Now update previously added feature
// For example change stroke style
var featureStyle = {
  stroke: {
    color: '#00FF00',
    width: 5
  }
};

// Define wanted feature attributes
var updatedFeatureAttributes = {'test_property':1};
var params = [updatedFeatureAttributes, {
    featureStyle: featureStyle,
    layerId: 'MY_VECTOR_LAYER'
}];

channel.postRequest(
    'MapModulePlugin.AddFeaturesToMapRequest',
    params
);
```

## Related api

- removeFeaturesFromMapRequest

