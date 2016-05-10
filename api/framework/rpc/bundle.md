# RPC

## Description

Provides RPC functionality, i.e. a published map can be controlled from the parent document.

## Example

<script src="/js/rpc/rpc-client.min.js"></script>
<style>
    iframe {
        background-clip: padding-box;
        border: none;
        border-radius: 12px;
        box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.15);
        clear: both;
        display: block;
        margin-bottom: 12px;
        width: 740px;
        height: 525px;
    }
    #rpcControls {
        text-align: center;
        width: 740px;   
    }

    #rpcControls button,
    #rpcControls output,
    #rpcControls input {
        display: inline-block;
        margin-top: 6px;
    }
</style>
<iframe id="Oskari" src="http://www.paikkatietoikkuna.fi/published/fi/f8ad2bf1-eaf0-44ff-ac90-de4fe3077812"></iframe>
<div id="rpcControls">
    <button id="mml">MML</button>
    <button id="helsinki">Messukeskus</button>
    <button id="lehka">Lehijärvi</button>
    <output id="coords"></output>
</div>
<script>
    var channel = OskariRPC.connect(
            document.getElementById('Oskari'),
            'http://www.paikkatietoikkuna.fi'
        ),
        coords = document.getElementById('coords'),
        setCoords = function(x, y) {
            coords.textContent = x + ', ' + y;
        },
        moveMap = function(centerX, centerY, zoomLevel) {
            channel.postRequest(
                'MapMoveRequest',
                [
                    centerX,
                    centerY,
                    zoomLevel === undefined ? 9 : zoomLevel
                ],
                function() {
                    channel.log('MapMoveRequest posted');
                }
            );
        },
        showGFI = function (lon, lat) {
            channel.postRequest(
                'MapModulePlugin.GetFeatureInfoRequest',
                [
                    lon,
                    lat
                ],
                function() {
                    channel.log('GetFeatureInfoRequest posted');
                }
            );
        },
        zoombar;

channel.onReady(function() {

    channel.getZoomRange(
        function(data) {
            zoombar = document.createElement('input');
            zoombar.type = 'range';
            zoombar.min = data.min;
            zoombar.max = data.max;
            zoombar.value = data.current;
            zoombar.onchange = function(event) {
                var zoomLevel = this.value;
                // There's no setZoomLevel for now, so we use MapMoveRequest with
                // getMapPosition's x and y coords
                channel.getMapPosition(
                    function(data) {
                        if (console && console.log) {
                            console.log('getMapPosition', JSON.stringify(data));
                        }
                        moveMap(data.centerX, data.centerY, zoomLevel);
                    },
                    function(error, message) {
                        if (console && console.log) {
                            console.log('error', error, message);
                        }
                    }
                );
            };
            document.getElementById('rpcControls').appendChild(zoombar);
        }
    );
    
            'GetPixelMeasuresInScale': function () {
                // A4 example ( size in mm units and portrait orientation
                var me = scale = document.getElementById("inputPlotScale").value;
                if(scale && Number(scale) < 1){
                    jQuery('#publishedMap').parent().find('#id_plot_bbox').remove();
                    channel.log('GetPixelMeasuresInScale: ', ' old plot area removed, if any exists');
                    savedPlotAreaData = null;
                    return;
                }
                if(!scale || scale === ''){
                    channel.getMapPosition(function(data){
                        savedPlotAreaData = [[210, 297], data.scale];
                    });
                }
                else {
                    savedPlotAreaData = [[210, 297], scale];
                }
    
                plotPlotArea([[210, 297], scale]);
    
            },

    // Get current map position
    channel.getMapPosition(
        function(data) {
            if (console && console.log) {
                console.log('getMapPosition', JSON.stringify(data));
            }
            setCoords(data.centerX, data.centerY);
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    // Get current map bbox
    channel.getMapBbox(
        function(data) {
            if (console && console.log) {
                console.log('getMapBbox', JSON.stringify(data));
            }
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    channel.getAllLayers(
        function(data) {
            if (console && console.log) {
                console.log('getAllLayers', JSON.stringify(data));
            }
            // Layer names aren't available through RPC as it might contain sensitive data
            var localization = {
                '24': 'Orthophotos',
                'base_2': 'Topographic map',
                'base_35': 'Background map serie'
            };
            var gfiLayerId = '343';
            data.forEach(function(layer) {
                if (layer.id + '' !== gfiLayerId) {
                    var layerButton = document.createElement('button');
                    layerButton.id = layer.id;
                    layerButton.textContent = localization[layer.id];
                    layerButton.onclick = function() {
                        var lid = this.id;
                        if (console && console.log) {
                            console.log('Showing layer ' + localization[lid]);
                        }
                        data.forEach(function(l) {
                            channel.postRequest(
                                'MapModulePlugin.MapLayerVisibilityRequest',
                                [
                                    l.id,
                                    l.id + '' === lid || l.id + '' === gfiLayerId
                                ]
                            );
                        });
                    };
                    document.getElementById('rpcControls').appendChild(layerButton);
                }
            });
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );
});

    channel.handleEvent(
        'AfterMapMoveEvent',
        function(data) {
            if (console && console.log) {
                console.log('AfterMapMoveEvent', JSON.stringify(data));
            }
            setCoords(data.centerX, data.centerY);
            if (zoombar) {
                zoombar.value = data.zoom;
            }
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    channel.handleEvent(
        'MapClickedEvent',
        function(data) {
            if (console && console.log) {
                console.log('MapClickedEvent', JSON.stringify(data));
            }
            channel.postRequest(
                'MapModulePlugin.AddMarkerRequest', [{
                        x: data.lon,
                        y: data.lat
                    },
                    'RPCMarker'
                ],
                function(error, message) {
                    if (console && console.log) {
                        console.log('error', error, message);
                    }
                }
            );
        },
        function(error, message) {
            if (console && console.log) {
                console.log('error', error, message);
            }
        }
    );

    document.getElementById('lehka').onclick = function() {
        if (console && console.log) {
            console.log('Lehijärvi');
        }
        moveMap(354490.70442968, 6770658.0402485);
    };

    document.getElementById('helsinki').onclick = function() {
        if (console && console.log) {
            console.log('Messukeskus');
        }
        moveMap(385597.68323541, 6675813.1806321);
    };

    document.getElementById('mml').onclick = function () {
        if (console && console.log) {
            console.log('MML GFI');
        }
        moveMap(385587.00507322, 6675359.2539665);
        showGFI(385587.00507322, 6675359.2539665);
    };
</script>

## Bundle configuration

No configuration is required, but it can be used to define allowed functions, events and requests. 
If configuration is not set these defaults will be used:

```javascript
{
    "allowedFunctions" : ["getAllLayers", "getMapPosition", "getSupportedEvents", "getSupportedFunctions", "getSupportedRequests",
        "getZoomRange", "getPixelMeasuresInScale", "getMapBbox", "resetState", "getCurrentState", "useState", "getFeatures"],
    "allowedEvents" : ["AfterMapMoveEvent", "MapClickedEvent", "AfterAddMarkerEvent", "MarkerClickEvent", "RouteResultEvent", "UserLocationEvent", "DrawingEvent"],
    "allowedRequests" : ["InfoBox.ShowInfoBoxRequest", "MapModulePlugin.AddMarkerRequest", "MapModulePlugin.AddFeaturesToMapRequest", "MapModulePlugin.RemoveFeaturesFromMapRequest", "MapModulePlugin.GetFeatureInfoRequest", "MapModulePlugin.MapLayerVisibilityRequest", "MapModulePlugin.RemoveMarkersRequest", "MapMoveRequest", "ShowProgressSpinnerRequest", "GetRouteRequest", "ChangeMapLayerOpacityRequest", "MyLocationPlugin.GetUserLocationRequest",  "DrawTools.StartDrawingRequest", "DrawTools.StopDrawingRequest", "MapModulePlugin.ZoomToFeaturesRequest"]
}
```

### Allowed functions

Allowed functions (config.allowedFunctions) lists all the functions that can be called over rpc.
Defaults at the moment are all the functions defined in RPC-bundles availableFunctions object which include:
- getInfo(clientVersion)
- getAllLayers()
- getMapPosition()
- getSupportedEvents()
- getSupportedFunctions()
- getSupportedRequests()
- getZoomRange()
- getPixelMeasuresInScale([mm_measure1, mm_measure2,..],scale)
- getMapBbox()
- resetState()
- getCurrentState()
- useState(stateObject)
- getFeatures(layerId)

All functions take callbacks as parameters for successhandler and (optional) errorhandler. Most functions are getters and only require the success callback. 
useState() is the only function currently that takes other type of parameters. However all functions are mapped in a similar fashion and the first parameter for function call can be used
to send parameters to the function. The parameters to send should be sent as an array:

    channel.useState([stateObject], successCB, errorCB);

    channel.getAllLayers(function(data) {
        console.log('Maplayers:", data);
    }, function(err) {
        console.log('Error!", err);
    });

If the first parameter is is a function, it's treated as the success callback.

**getInfo(clientVersion)**

Returns generic information about the Oskari instance:

    {
      "version": "1.35.0",
      "clientSupported": true,
      "srs": "EPSG:3067"
    }

This can be used to detect if the Oskari version has been updated without notification. For example in RPC-client you can:

    channel.getInfo(['1.1.0'], function(data) {
        // check if are getting the expected Oskari version
        if(data.version !== "1.35.0" || !data.clientSupported) {
            // handle error, send a notification email to self etc
            // Your application might not work correctly
        }
       channel.log('GetInfo: ', data);
    });
    
**getAllLayers()**

Returns all the layers available on map. If layer has minimum zoom level and maximum zoom level defined, returns also those.
    
    {
        id: layerId,
        opacity: layerOpacity,
        visible: layerVisibility,
        name : layerName,
        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel 
    }

**getMapPosition()**

Returns information about map position:

    {
        "centerX": 401696,
        "centerY": 6724032,
        "zoom": 4,
        "scale": 362834,
        "srsName": "EPSG:3067"
    }

**getSupportedEvents()**

Returns event that are supported by rpc functionality.

    {
        "AfterMapMoveEvent": true,
        "MapClickedEvent": true,
        "AfterAddMarkerEvent": true,
        "MarkerClickEvent": true,
        "RouteResultEvent": true,
        "SearchResultEvent": true,
        "UserLocationEvent": true,
        "DrawingEvent": true,
        "FeatureEvent": true
    }

**getSupportedFunctions()**

Returns functions that are supported by rpc functionality.

    {
        "getSupportedEvents": true,
        "getSupportedFunctions": true,
        "getSupportedRequests": true,
        "getInfo": true,
        "getAllLayers": true,
        "getMapBbox": true,
        "getMapPosition": true,
        "getZoomRange": true,
        "getPixelMeasuresInScale":true,
        "resetState": true,
        "getCurrentState": true,
        "useState": true,
        "getFeatures": true
    }

**getSupportedRequests()**

Returns requests that are supported  by rpc functionality

    {
        "InfoBox.ShowInfoBoxRequest": true,
        "MapModulePlugin.AddMarkerRequest": true,
        "MapModulePlugin.AddFeaturesToMapRequest": true,
        "MapModulePlugin.RemoveFeaturesFromMapRequest": true,
        "MapModulePlugin.GetFeatureInfoRequest": true,
        "MapModulePlugin.MapLayerVisibilityRequest": true,
        "MapModulePlugin.RemoveMarkersRequest": true,
        "MapMoveRequest": true,
        "ShowProgressSpinnerRequest": true,
        "GetRouteRequest": true,
        "SearchRequest": true,
        "ChangeMapLayerOpacityRequest": true,
        "MyLocationPlugin.GetUserLocationRequest": true,
        "DrawTools.StartDrawingRequest": true,
        "DrawTools.StopDrawingRequest": true,
        "MapModulePlugin.ZoomToFeaturesRequest": true
    }

**getZoomRange()**

Returns information about map zoom range.

    {
        "min": 0,
        "max": 13,
        "current": 4
    }

**zoomIn(), zoomOut(), zoomTo()**

Returns current zoom level after zooming.

**getPixelMeasuresInScale([mm_measure1, mm_measure2,..], scale)**

    Returns pixel mesurements for mm measurements in requested scale.
    Scale is optional. If scale is not defined, current map scale or fit scale is used.
    If scale is not defined and there are two measurements, then function computes fit scale so that paper size area covers the whole map. 
    In case of two measurements: if 1st measure is longer than 2nd measure, then the orientation is landscape.
    Pixel values could be used for to plot  e.g. A4 size area on the map.
    input: [[210,297], 100000] returns below data (zoomLevel tells nearest zoom level where pixel measures fit the map viewport)

        {
          "pixelMeasures": [
            82,
            116
          ],
          "scale": "100000",
          "zoomLevel": "5"
        }



**resetState()**

Resets the saved map state. State means i.a. map positions and selected layers and their properties.

**getCurrentState()**

Returns the state of the map.

    {
        "mapfull": {
            "state": {
                "north": 6751897.3481153,
                "east": 411650.70779123,
                "zoom": 2,
                "srs": "EPSG:3067",
                "selectedLayers": [
                    {
                        "id": "base_35",
                        "opacity": 100,
                        "style": "default"
                    },
                    {
                        "id": 454,
                        "opacity": 43,
                        "style": "aluevaki_base"
                    }
                ],
                "plugins": {
                    "MainMapModuleMarkersPlugin": {
                        "markers": []
                    }
                }
            }
        },
        "toolbar": {
            "state": {}
        }
    }

**useState()**

Loads a saved map state.

**getFeatures(layerId)**

Function gets features as geojson object grouped by layer if the value of given parameter is true. If parameter is not given, will return array of layerIds. 
For example in RPC-client you can:

    channel.getFeatures([true], function(data) {
       channel.log('GetFeatures: ', data);
    });


**getScreenshot() (beta)**

This is an experimental function that might be changed/removed. It's only available when the Oskari instance uses Openlayers 3 based mapmodule.
The function returns an empty string if screenshot could not be produced and a dataURL for png-image when successful.

Usage requires additional configuration on the map layers used on the published map. The map layers have to be set to support CORS in oskari's layer administration, i.e. the attributes-field must contain the crossOrigin definition:
```javascript
{
    crossOrigin: 'anonymous'
}
```

Additionally, the service providing the layer tiles must support CORS, i.e. have the Access-Control-Allow-Origin - header set.

```javascript
Access-Control-Allow-Origin:*
```

### Allowed events

Allowed events (config.allowedEvents) lists all the events that can be listened to over rpc. 
List will be modified on startup so events that are not available in the appsetup will be removed from the list.

### Allowed requests

Allowed requests (config.allowedRequests) lists all the requests that can be sent over rpc. 
List will be modified on startup so requests that are not available in the appsetup will be removed from the list.

## Using the bundle functionality

First of all the bundle's configuration must have a "domain" value, that will be checked against the communication origin.
```javascript
{
    'domain': 'oskari.org'
}
```
If you're using the Oskari backend, this is injected automatically based on the domain set for the published map.

Next we'll need a map and the required libraries:
```html
<script src="/js/rpc/rpc-client.min.js"></script>
<iframe id="Oskari" src="http://demo.paikkatietoikkuna.fi/published/fi/8184"></iframe>
```

Here we open communications with the published map (the URL parameter is the domain of the iframe.src):
```html
<script>
var channel = OskariRPC.connect(
    document.getElementById('Oskari'),
    'http://demo.paikkatietoikkuna.fi'
);
</script>
```

As of OskariRPC version 1.1.0 the channel object has an onReady(function() {})-function where you can register a callback that is notified when the connection to map has been established. After the connection has been established you can query for supported events/requests and functions that can be used to interact with the map. These can change between Oskari instances since both appsetups and configurations for allowed functionalities can change based on the Oskari provider.

After the channel has been created you can control the map with functions and requests and react to map events.

Calling a function:
```javascript
// Get current map position
channel.onReaady(function() {
    channel.getMapPosition(
        function(data) {
            console.log(
                'getMapPosition',
                data.centerX,
                data.centerY
            );
        },
        function(error, message) {
            console.log('error', error, message);
        }
    ); 
});
```

Adding an event listener:
```javascript
channel.handleEvent(
    'AfterMapMoveEvent',
    function(data) {
        console.log(
            'AfterMapMoveEvent',
            data.centerX,
            data.centerY
        );
    },
    function(error, message) {
        console.log('error', error, message);
    }
);
```

And posting a request:
```javascript
channel.postRequest(
    'MapModulePlugin.AddMarkerRequest',
    [
        {
            x: 354490.70442968,
            y: 6770658.0402485
        },
        'RPCMarker'
    ],
    function(error, message) {
        console.log('error', error, message);
    }
);
```

## Bundle state

No statehandling has been implemented for the bundle.

## Requests the bundle handles

This bundle doesn't handles any requests.

## Requests the bundle sends out

Depends wholly on the setup.

## Events the bundle listens to

Depends wholly on the setup.

## Events the bundle sends out

This bundle doesn't send any events.

## FAQ / error situations

#### Mostly on startup when parent page begins the connection process, but before the iframe is ready to listen (thrown from JSChannel on the parent page and will self-correct on most occasions):

    Failed to execute 'postMessage' on 'DOMWindow': The target origin provided ('http://iframe.src.domain') does not match the recipient window's origin ('http://parentpage.domain').

#### The actual domain of the iframe src differs from the domain that is told on the OskariRPC.connect() call (thrown from JSChannel on the parent page):

    Uncaught SyntaxError: Failed to execute 'postMessage' on 'Window': Invalid target origin 'http://connect.call.param.domain' in a call to 'postMessage'.

#### The domain configured for embedded map (when published) is different from the page that it's embedded in (thrown from RPC-bundle):

    Error ["invalid_origin", "Invalid domain for parent page/origin. Published domain does not match: http://parentpage.domain"]
    Uncaught Error: RPC call failed!

#### Trying to post an unsupported request (thrown from RPC-bundle):

    channel.postRequest('MyRequest');

    Error ["request_not_available", "Request not available: MyRequest"]
    Uncaught Error: RPC call failed!

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [JSChannel](https://github.com/nls-oskari/jschannel) </td>
    <td> RPC bundle </td>
    <td> Used at both ends of the pipe for the RPC communication.</td>
  </tr>
</table>
