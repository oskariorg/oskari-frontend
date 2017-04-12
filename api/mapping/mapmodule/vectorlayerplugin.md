# Vector Layer Plugin

## Description

''Provides functionality to draw vector layers on the map.''

## Bundle configuration

No configuration is required. Following is optional:
```javascript
{
    "layers": [    
        {
            "id": "EXAMPLE1",
            "style": {
                "fill": {
                    "color": "#ff00ff"
                },
                "stroke": {
                    "color": "#ff00ff",
                    "width": 3
                },
                "text": {
                    "fill": {
                        "color": "#0000ff"
                    },
                    "stroke": {
                        "color": "#ff00ff",
                        "width": 4
                    }
                }
            }
        }
    ]
}
```

This configuration creates one (or many) layer(s) when plugin is started. You can tell layer default style for style object. When feature added layer style is used if feature request not contains feature style. If layer and feature style is not defined using defaults.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>MapModulePlugin.AddFeaturesToMapRequest</td><td>Add features on the map</td>
  </tr>
  <tr>
    <td>MapModulePlugin.RemoveFeaturesFromMapRequest</td><td>Removes features from map</td>
  </tr>
</table>

## Requests the bundle sends out

This plugin doesn't sends any requests.

## Events the bundle listens to

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td> Remove OpenLayer's layer from map. </td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerOpacityEvent </td><td> Update OpenLayer's layer opacity. </td>
  </tr>
  
</table>

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI and to sort the layers</td>
  </tr>
  <tr>
    <td>[OpenLayers](http://openlayers.org/)</td>
    <td>not linked, assumes its linked by map</td>
    <td>Used to create the vector layer.</td>
  </tr>
</table>

