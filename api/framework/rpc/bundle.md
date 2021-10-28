# RPC

## Description

Provides RPC functionality, i.e. a published map can be controlled from the parent document.

## Example

Examples of all the RPC functionalities can be found [here](https://www.oskari.org/examples/rpc-api/rpc_example.html).

## Bundle configuration

No configuration is required, but it can be used to define allowed functions, events and requests.
By default the [events](https://www.oskari.org/api/events) and [requests](https://www.oskari.org/api/requests) that have the RPC tag in their api documentation are allowed.

### How to add new functions to RPC

Use `RpcService` to add new functions.

```
// listen to application started event and register new RPC function.
Oskari.on('app.start', function (details) {
    const rpcService = Oskari.getSandbox().getService('Oskari.mapframework.bundle.rpc.service.RpcService');

    if (!rpcService) {
        return;
    }

    rpcService.addFunction('example', function () {
        console.log('New added RPC function');
        return 'my example result';
    });

    // async functions can return a promise and signal failure through reject
    rpcService.addFunction('example2', function () {
            return new Promise((resolve, reject) => {
                setTimeout(() => resolve('my async example result'), 500);
              });
    });
});
// now you can call created example function from your published map
channel.example(function(data) {
    console.log(data);
});

channel.example2(function(data) {
    console.log(data);
});
```

### Allowed functions

Allowed functions (config.allowedFunctions) lists all the functions that can be called over rpc.

Defaults at the moment are all the functions what all bundles adds to rpc.
RPC bundle adds default functions and other additionals are optionals (exists in RPC when bundle is added to published view).

RPC:
- getSupportedEvents()
- getSupportedFunctions()
- getSupportedRequests()
- getInfo(clientVersion)
- resetState()
- getCurrentState()
- useState(state)
- sendUIEvent(bundleId, payload)

AbstractMapModule:
- getAllLayers()
- getMapBbox()
- getMapPosition()
- getZoomRange()
- zoomIn()
- zoomOut()
- zoomTo()
- getPixelMeasuresInScale(mmMeasures, scale)
- setCursorStyle(cursorStyle)

MapModuleClassOl:
- getScreenshot

VectorLayerPlugin:
- getFeatures(includeFeatures)

All functions take callbacks as parameters for successhandler and (optional) errorhandler. Most functions are getters and only require the success callback.
useState() is the only function currently that takes other type of parameters. However all functions are mapped in a similar fashion and the first parameter for function call can be used to send parameters to the function. The parameters to send should be sent as an array:

    channel.useState([stateObject], successCB, errorCB);

    channel.getAllLayers(function(data) {
        console.log('Maplayers:", data);
    }, function(err) {
        console.log('Error!", err);
    });

If the first parameter is a function, it's treated as the success callback.

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

Returns events that are supported by rpc functionality. For example:

    {
        "AfterMapMoveEvent": true,
        "MapClickedEvent": true,
        "AfterAddMarkerEvent": true,
        "MarkerClickEvent": true,
        "RouteResultEvent": true,
        "SearchResultEvent": true,
        "UserLocationEvent": true,
        "DrawingEvent": true,
        "FeatureEvent": true,
        "GFIResultEvent": true
    }

**getSupportedFunctions()**

Returns functions that are supported by rpc functionality. For example:

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

Returns requests that are supported  by rpc functionality. For example:

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

**setCursorStyle(cursorStyle)**

Functionality to change the mouse cursor on the map to any valid cursor css declaration ('crosshair','progress' etc.) supported by the browser.

**sendUIEvent(bundleId, payload)**

Used to toggle tools (e.g. coordinatetool) visible.

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
<iframe id="Oskari" src="https://dev.oskari.org/?lang=en&viewId=4"></iframe>
```

Here we open communications with the published map (the URL parameter is the domain of the iframe.src):
```html
<script>
var channel = OskariRPC.connect(
    document.getElementById('Oskari'),
    'https://dev.oskari.org/'
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

This bundle doesn't handle any requests.

## Requests the bundle sends out

Depends on the setup.

## Events the bundle listens to

Depends on the setup.

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
    <td> [JSChannel](https://www.npmjs.com/package/jschannel) </td>
    <td> RPC bundle </td>
    <td> Used at both ends of the pipe for the RPC communication.</td>
  </tr>
</table>
