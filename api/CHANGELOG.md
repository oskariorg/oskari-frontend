# Oskari API changelog

This document describes changes to the public API from Oskari frontend perspective (requests, events, conf/state, services). RPC-developers can check if the request/event API has changed
when the service provider gives notice about Oskari version being upgraded. Oskari bundle/core-developers can check for changes in the bundles they depend on.

Each addition is tagged with [add], [mod] or [rem] telling if it's a new feature, modifies the current functionality or if something has been removed. [rpc] tag indicates that the change affects RPC API.

## 1.35

### RPC

#### [mod] [rpc] New default request

MapModulePlugin.ZoomToFeaturesRequest is a now allowed by default.

### mapmodule - vectorlayerplugin

#### [add] [rpc] New request

MapModulePlugin.ZoomToFeaturesRequest that zooms the map so specific features are visible in the viewport (only for ol3-based maps).

#### [add] [rpc] Vector style improvement

Added functionality to provide a label text to vector features with the style object. Either a static text or dynamic labeling by a property of the feature supported.
Two ways of providing a label:

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
                        },
                        "labelText": "Static text", //OR
                        "labelProperty":"feature_property"
                    }
                }
            }
        ]
    }
```

### search

#### [mod] [rpc] SearchRequest

The parameter given to the request should be a string that will be used to execute the search (previously an object with "searchKey" property).

#### [mod] [rpc] SearchResultEvent

The value of "requestParameters" is now the string that was given to SearchRequest.

### drawtools

#### [mod] [rpc] DrawTools.StartDrawingRequest

'showMeasure' parameter in optional object parameter has been renamed to 'showMeasureOnMap' (if true - measure result will be displayed on map near feature. Default is false.)

Changes to polygon drawing where the polygon intersects with itself. This is by default considered an invalid geometry and as such the geometry is not sent with the event.

#### [mod] [rpc] DrawingEvent

Values of geojson and data.bufferedGeoJson are now proper JSON structures instead of strings with escaped JSON.

## 1.34

Initial api version

---------------------
The file structure is

## Oskari version

### Affected bundle/API definition

#### [tags] API functionality that changes

Description about the API change