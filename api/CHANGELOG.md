# Oskari API changelog

This document describes changes to the public API from Oskari frontend perspective (requests, events, conf/state, services). RPC-developers can check if the request/event API has changed
when the service provider gives notice about Oskari version being upgraded. Oskari bundle/core-developers can check for changes in the bundles they depend on.

Each addition is tagged with [add], [mod], [rem] telling if it's a new feature, modifies the current functionality or if something has been removed.

Some extra tags:
- [rpc] tag indicates that the change affects RPC API
- [breaking] tag indicates that the change is not backwards compatible

## 2.13.0

### [add] Added `metadatasearch` bundle

React-based drop-in replacement for jQuery-based `metadatacatalogue` for searching metadata. 

### [add] Added `featuredata` bundle

React-based drop-in replacement for jQuery-based `featuredata2` for feature data table.

### [add] Added a parallel version for `statsgrid` bundle

The new implementation is React-based and has the same bundle id so no db migration is required, but the frontend code is linked from the new path (https://github.com/oskariorg/sample-application/pull/33). This makes it easy to switch the implementation to test it out. One notable difference is that the new one doesn't send the events like the old did as it doesn't need them internally. However the events were not exposed in the RPC API so this should not be an issue for most applications. The bundle documentation still refers to the jQuery implementation with the events.

### [rem] Removed `personaldata` bundle

Replaced by the `mydata` bundle.

## 2.11.0

### [mod] AddMapLayerRequest

The layer is no longer added to map synchronously. Additional metadata is loaded from the server when a layer is added to map so sending additional requests directly after sending `AddMapLayerRequest` might not work as they did before.

Introduced a second parameter for the request called `options`. This is used to restore vector layer styles on embedded maps for guest users in a way the user that published the map sees them on the publisher functionality. It can also be used to trigger `MapModulePlugin.MapMoveByLayerContentRequest` after the layer has been added to map (workaround for asynchronous operation).

### [mod] ShowFilteredLayerListRequest

Added third parameter to open the selected layer listing directly.

## 2.10.0

### [rem] MapResizeEnabledRequest

Removed request that was not used or needed anymore. The request could be used for stopping mapmodule from auto-scaling its size when the element size changed, but the current implementation works in a similar way that you can set size of the map element to be different than the container it is in. This does the same thing.

### [rem] MapSizeUpdateRequest

Removed request that was not used or needed anymore now that mapmodule listens to the element size. The request was NOT used to set a new size like the name suggests, but to notify mapmodule about size change like it was an event. This should have been an event instead, but it's no longer required.

### [rem] MapWindowFullScreenRequest

Removed request that was not needed anymore now that mapmodule listens to the element size. The request was NOT used to set a new size for map like the name suggests, but to notify mapmodule about size change like it was an event. This should have been an event instead, but it's no longer required.

## 2.9.0

### [mod] [rpc] [breaking] MapModulePlugin.AddMarkerRequest

For built-in symbols everything stays the same.

For external graphic symbols in markers the size of the marker is:
- when below 10 is calculated as size * 10 + 40 for actual size (while hack'ish this is for backwards compatibility reasons)
- 10 + values are now considered as a pixel value (as documented on the API page)

### [mod] [rpc] DrawTools.StartDrawingRequest

Enabled modifying a geometry with a limited shape for `Circle`, `Box` and `Square`. Previously modifying a polygon shape was always done in a way that resulted in losing the original shape (new points could be added and individual points could be moved to skew the geometry). The previous method for editing is still available when using the shape `Polygon` to be used for editing.

Added an option to use a validation limit for length of a line and area of a polygon.
The `limits` can be set with options:
```javascript
{
    ...,
    limits: {
        area: `number in m2 limiting area size`,
        length: `number in meters limiting line length`
    }
}
```
Changed to show self intersection warning for Polygons as in API documentation. Previously warning was shown only with showMeasureOnMap option.

### [mod] [rpc] DrawingEvent
Added valid property for GeoJson features. Used with `DrawTools.StartDrawingRequest` limits option.

## 2.8.0

### [add] [rpc] StateChangedEvent

Event is sent when a massive application state change occurs like user clicks on the "reset map to default".
This allows RPC-based apps to detect such occurance and re-add for example markers that they need after such reset.

## 2.7.0 [mod] [rpc] [breaking] MapModulePlugin.AddMarkerRequest

The size value is now considered as a pixel value instead of abstracted WHEN using external graphic for marker symbol.
For built-in symbols everything stays the same.

## 2.6.0

### [add] [rpc] MetadataSearchRequest

Added new MetadataSearchRequest. This allows applications to do metadatasearch programmatically.

Find metadata for `tie` search.
```javascript
const sb = Oskari.getSandbox();
sb.postRequestByName('MetadataSearchRequest', [{ search: 'tie' }]);
```

### [add] [rpc] MetadataSearchResultEvent

Added new MetadataSearchResultEvent. This allows applications to get metadata search results.

Event returns following Object:
```javascript
{
  "success": true,
  "results": [{
        "identification":{
          "date":"2021-05-18",
          "code":"publication"
        },
        "natureofthetarget":"dataset",
        "bbox":{
            "top":70.09229553,
            "left":19.08317359,
            "bottom":59.45414258,
            "right":31.58672881
        },
        "organization":"Väylävirasto",
        "name":"Sillat (Taitorakennerekisteri)",
        "rank":-1,
        "id":"cbfed29a-d47f-4b83-a9d0-e96c9a713a88",
        "region":"",
        "geom":"POLYGON ((51857.07752019336 6617351.758085947, 106162.23019201797 6611247.60914618, 160521.75747694494 6605934.9725185605, 214927.9837369584 6601413.041426821, 269373.3028919406 6597681.12401024, 323850.167285723 6594738.6457116045, 378351.0765369692 6592585.151240729, 432868.5663778016 6591220.306118018, 487395.1974830585 6590643.897801558, 541923.5442930857 6590855.836400321, 596446.1838329614 6591856.154975107, 650955.6845310468 6593645.009427913, 705444.5950397715 6596222.67797946, 759905.4330615391 6599589.560233721, 752439.279058465 6707120.567722377, 744900.8507702629 6814657.30555671, 737292.2963510042 6922199.658602795, 729615.7848563935 7029747.505094043, 721873.5056238836 7137300.716763376, 714067.6676445415 7244859.158983923, 706200.4989268251 7352422.690918106, 698274.2458524778 7459991.165674924, 690291.1725247321 7567564.430475263, 682253.5601090218 7675142.326825145, 674163.706166442 7782724.690696563, 637684.9819106762 7780262.600948358, 601176.4170921873 7778377.065625957, 564645.9381468832 7777068.247270706, 528101.4635005761 7776336.258280902, 491550.9064510594 7776181.161365283, 455002.17806454666 7776602.969796763, 418463.190078363 7777601.647466223, 381941.8578017532 7779177.108736253, 345446.1030066919 7781329.218095038, 308983.8568005678 7784057.789610645, 272563.0624726217 7787362.586186218, 236191.67830600997 7791243.318616742, 199877.68034737493 7795699.644448195, 185922.51974644407 7688636.614841255, 172055.50590313738 7581562.838070868, 158280.5546451786 7474477.904805448, 144601.5589337572 7367381.417439794, 131022.38783961348 7260272.990545034, 117546.88551808393 7153152.251308996, 104178.87018318352 7046018.839966641, 90922.13308078656 6938872.410219978, 77780.43746099574 6831712.629646971, 64757.51754980773 6724539.1800989425, 51857.07752019336 6617351.758085947))",
        "channelId":"METADATA_CATALOGUE_CHANNEL"}
    ]
}
```


### [add] [rpc] RearrangeSelectedMapLayerRequest

Allowed request for rpc use and also added request documentation.

```javascript
const layerId = 1;
const position = 0;
channel.postRequest('RearrangeSelectedMapLayerRequest', [layerId, position]);
```

### [add] [rpc] ChangeMapLayerStyleRequest

Allowed request for rpc use.

```javascript
const layerId = 1;
const newStyleName = 'new_awesome_style';
channel.postRequest('ChangeMapLayerStyleRequest', [layerId, newStyleName]);
```

### [add] [rpc] DataForMapLocationEvent

Added new DataForMapLocationEvent. This allows applications to get programmatic access to the content that is normally shown on the map in an `infobox` popup when the user clicks the map (GFI/wfs feature clicks).

Event returns following Object:
```javascript
{
  content: "<table><tr><td>test</td></tr></table>", // or json object
  x: 423424,
  y: 6652055,
  layerId: 1,
  type: "text" // or json or geojson
}
```

### [mod] [rpc] getAllLayers

The RPC `getAllLayers()` function now includes new properties: `config` and `metadataIdentifier`.

The `config` (layer `attributes` `data` block) object includes optional configuration like localized names for vector feature properties etc.

The `metadataIdentifier` string shows layers metadata identifier. If layer haven't metadata identifier, layer object not contains `metadataIdentifier` properties.


```javascript
{
    id: layerId,
    opacity: layerOpacity,
    visible: layerVisibility,
    name : layerName,
    minZoom: minZoomLevel,
    maxZoom: maxZoomLevel,
    config: layerAttributesDataBlock,
    metadataIdentifier: metadataIdentifier
}
```

### [mod] [rpc] SearchRequest and SearchResultEvent

SearchRequest can now take an optional second parameter that is sent to the server side implementation. As the server side implementation are handled by different "channels" depending on the Oskari instance and implementation these options might or might not be handled. However the same options are returned on the SearchResultEvent enabling tracking which event is a response to which request making the functionality more versatile whether any extra flags are supported by the server instance or not. A common handling has been implemented for the key `limit` in the options to request more or less results than the instance default. Contact your Oskari instance administrator for options that are used by the server side on given instance.

## 2.5.0

### [add] userstyle

Added initial bundle documentation. Userstyle functionality has been moved from wfsvector to own bundle.

### [mod] MapModulePlugin.MapLayerUpdateRequest

Added documentation for the request. The request itself has been available from 1.x already but the it wasn't documented.
Since 2.5 it can also be used to force reload of features from a service on a vector/WFS-layer.

## 2.4.0

### [rem] Removed unmaintained bundles

Bundles layerselection2, layerselector2 and hierarchical-layerlist have been removed. Current replacement is the bundle: layerlist.
Bundles admin-layerselector and admin-hierarchical-layerlist have been removed. Current replacement is: admin-layereditor.

See https://github.com/oskariorg/oskari-docs/issues/245 for details.

## 2.3.0

### [add] layerlist

Added initial bundle documentation.

### [add] admin-layereditor

Added initial bundle documentation.

### [rem] mapwfs2

Documentation removed as the code has been removed earlier. The WFS-layer implementation has been replaced with wfsvector bundle.

### [rem] publisher

Removed as the code has been replaced with publisher2 earlier.

## 2.1.0

### [mod] [rpc] ZoomToFeaturesRequest

Now supports an optional maxZoomLevel flag to restrict the amount of zooming we are willing to make while showing the features. This is useful for point features or features that are close to each other. Without this the map might zoom "all-in" that might not be what we want to do.

### [mod] [rpc] VectorLayerRequest

Now can be used to remove vector layers that have been added with the same request. Can be used to cleanup etc.

## 1.55.0

### [add] [rpc] New SetTimeRequest Request

Request to set time for 3d map.

date
Date as a string D/M
```javascript
'28/2' || '1/2' || '01/02' || '01/2'
```

time
Time as a string H:m
```javascript
'10:22' || '9:02'
```

year
Year as a number, defaults to current year (optional)
```javascript
2019 || 2010
```


### [mod] [rpc] AfterMapMoveEvent

Event now includes details for camera position when using the 3D mapmodule

## 1.54.0

### [add] [rpc] New MapTourRequest Request

Request to move along the map from point to point.

locations
List of locations as an array of objects.
Contains longitude, latitude and various optional override options
```javascript
[ { lon, lat }, { lon, lat, duration, delay, zoom, camera: { heading, pitch, roll }, animation } ]
```

options
Object with optional parameters for options as default for all locations.
```javascript
{ duration, delay, zoom, camera: { heading, pitch, roll }, animation, srsName }
```

## 1.53.0

### [mod] [rpc] MapMoveRequest

Added fourth parameter "options".
```javascript
{ srsName, animation }
```
`srsName`: The projection in which the given coordinates are
`animation`: Animation to use on map move. Possible values: `fly`, `pan`.

### [mod] [rpc] StartUserLocationTrackingRequest

Allowed request for rpc use.

### [mod] [rpc] StopUserLocationTrackingRequest

Allowed request for rpc use.

## 1.52.0

### [add] StartUserLocationTrackingRequest

Request to show user's location on map.

### [add] StopUserLocationTrackingRequest

Request to stop user's location tracking.

## 1.51.0

#### [mod] [rpc] New rpc-client version 2.1.0

This release has no breaking changes.

- Added OskariRPC.synchronizerFactory(...) helper for creating one way data-binding for embedded Oskari maps.
- New parameter info is given to channel.onReady() callbacks. It's an object containing two keys, clientSupported signifying that the RPC client version is supported by the embeded map, and version which is the Oskari version in use in the embedded map.

## 1.49.0

### [add] [rpc] AddFeaturesToMapRequest

Added a new option ``animationDuration`` for animating fill color change on update request.

## 1.48.0

### [mod] [rpc] AddFeaturesToMapRequest

Deprecated following layer related options. Use VectorLayerRequest instead.

```javascript
    layerOptions,
    layerInspireName,
    layerOrganizationName,
    showLayer,
    opacity,
    layerName,
    layerDescription,
    layerPermissions
```

### [add] [rpc] VectorLayerRequest

Request to handle layer settings.

## 1.45.0

### [mod] [rpc] FeatureEvent

is now triggered correctly on published maps/ol3 implementation when layer is cleared with MapModulePlugin.RemoveFeaturesFromMapRequest without parameters.

### [mod] [rpc] DrawTools.StopDrawingRequest

A new optional third parameter suppressEvent (boolean).
If true the request doesn't trigger a DrawingEvent. Defaults to false.

### [rem] MetaData.FinishedDrawingEvent

Event removed from Metadatacatalogue bundle. New parallel version uses DrawTools.StartDrawingRequest and DrawTools.StopDrawingRequest instead to draw search coverage area on map.

### [mod] MapMoveByLayerContentRequest

MapMoveByLayerContentRequest now has a new optional param to zoom to layer extent (requires layer coverage data to be available).

### [mod] PublishMapEditorRequest

Now sets the publisher state as a whole for editing an embedded map instead of assuming for example layers to be adjusted prior to sending the request.

### [add] new bundle: GeometryCutter

Geometrycutter is a more bare bones replacement for the "geometryeditor" bundle. Geometrycutter has only two editing modes:

- splitting a feature by a user drawn linestring as if it was a cutting "blade"
- removing a part of a feature that overlaps a user drawn polygon (difference)

### [rem] [breaking] TimeseriesAnimationEvent, AnimateLayerRequest

Timeseries functionality rewrite. Old event & request removed.

### [rem] [breaking] mapfull configuration

Mapfull no longer receives or handles "globalMapAjaxUrl" and "user" in bundle configuration. Handling has been moved to Oskari.app.init().
If you haven't implemented a custom version of "mapfull" bundle or the Oskari-global this has no effect.

## 1.44.1

### [mod] [rpc] DrawingEvent

Fixed an issue where:

1) Draw a shape (like Polygon) with functionality id 1
2) Draw another type of shape (like LineString) with functionality id 2
3) Draw the same shape as in step 1 with functionality id 3

Resulted in DrawingEvents on step 3 to have an empty features array. Features the user draws are now sent correctly.

DrawingEvent with isFinished = true is now correctly triggered also when user modifies the geometry.
Previously isFinished was only ever "true" for the original draw and always false for any modifications.

Length and area information in the event are now the sum for all the LineStrings (for length) and (non-intersecting) Polygons instead of the last drawn shape.
The length/area is written to geojson properties per feature so if you need to access measurement for the latest feature it's still there like this:

```javascript
    {
        data : {
             length : 0,
             area : 39696895.99975586
        },
        geojson : {
            features : [{ geometry: ..., properties : {
                    area : 20396544
                },
                { geometry: ..., properties : {
                    area : 19300351.99975586
                }]
        }
    }
```

To get the same information you can do `event.geojson.features[event.geojson.features.length - 1].properties.area`, but it makes more sense to have the sum on the data block instead of measures for the latest feature in a collection of features.

Notes:

- If you have just one feature ever this works like before.
- Only lines and polygons are counted for the area/length (circles/points with buffers are not).
- The measurements are for non-buffered features.

### metadatacatalogue [add]

Added new OpenLayers independent version of metadatacatalogue. New bundle.js is under packages/catalogue/metadatacatalogue/. In the new version `MetaData.FinishedDrawingEvent` is removed. Instead you can listen to `DrawingEvent` where id "catalogue.bundle.metadatacatalogue" and isFinished is true.

## 1.44

### [mod] [breaking] AddLayerListFilterRequest

Removed function parameter to make request serializable to JSON. The filter function can now be registered to MapLayerService.

Before:
```javascript
// Add new layerlist filter button to layerselector
Oskari.getSandbox().postRequestByName('AddLayerListFilterRequest',[
    'Publishable',
    'Show publishable layers',
    function(layer){
        return (layer.getPermission('publish') === 'publication_permission_ok');
    },
    'layer-publishable',
    'layer-publishable-disabled',
    'publishable'
]);
```

After:

```javascript
// Add layer filter to map layer service
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('publishable', function(layer){
    return (layer.getPermission('publish') === 'publication_permission_ok');
});

// Add layerlist filter button
Oskari.getSandbox().postRequestByName('AddLayerListFilterRequest', [
        'Publishable',
        'Show publishable layers',
        'layer-publishable',
        'layer-publishable-disabled',
        'publishable'
]);
```

### [mod] [breaking] ShowFilteredLayerListRequest

Changed ``stats`` filter name to ``featuredata`` (because it filters featuredata layers and not stats layers). Also made request serializable to JSON (removed function parameter).

Before:
```javascript
// Use buil-in filter
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', [null, 'stats']);

// Register new filter and use this
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', [function(layer) {
    var name = layer.getName().toLowerCase();
    return (name.substring(0,1) === 'a');
},'find_layers_name_start_a', false]);
```

After:
```javascript
// Use built-in filter
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['featuredata']);

// Register new filter
var mapLayerService = Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
mapLayerService.registerLayerFilter('find_layers_name_start_a', function(layer) {
    var name = layer.getName().toLowerCase();
    return (name.substring(0,1) === 'a');
});
// Use new filter by request
Oskari.getSandbox().postRequestByName('ShowFilteredLayerListRequest', ['find_layers_name_start_a', false]);
```

#### [mod] [breaking] ProgressEvent

The event API itself is unchanged, but the only core bundle that sent out the event was not using it according to the API docs. You can ignore this change if your code does not expect ProgressEvent's getID() method to always return string 'maplayer'.

#### [add] TimeseriesAnimationEvent

Event is sent out when timeseries animation advances or is stopped

#### [mod] [rpc]AddFeaturesToMapRequest

New functionalities for ``AddFeaturesToMapRequest``. New options available:
- layerInspireName : Inspire name for added layer
- layerOrganizationName: Organization name for added layer
- showLayer: Show layer to layerselector2/layerselection2. If setted truue then show map (add layer to mapservice).
- opacity: Added layer opacity
- layerName: Added layer name (showed in layerselector2/layerselection2)
- layerDescription: Added layer description (showed subtitle in layerselection2)
- layerPermissions: Added layer permission
- image.sizePx: image icon size in pixels. Used this is size not defined (size is used for Oskari icon size calculation)

## 1.42

#### [mod] [rpc] SearchResultEvent

``SearchResultEvent`` now includes a "region" key for result locations. It should be used instead of "village". Both are available and have the same value, but the village key will be removed in a future release.


```javascript
{
"id": 0,
"rank": 10,
"lon": "327629.273",
"region": "Tampere",
"village": "Tampere",
"channelId": "REGISTER_OF_NOMENCLATURE_CHANNEL",
"name": "Tampere",
"zoomScale": 56650,
"type": "Kunta, kaupunki",
"lat": "6822513.158"
}
```

#### [mod] [rpc] FeatureEvent

``FeatureEvent`` triggered on OpenLayers 2 based map now returns GeoJSON as JSON (previous returned String with escaped JSON).


#### [mod] [rpc] New rpc-client version

This release has no functional changes.

As part of Oskari becoming an OSGeo-project the repositories are relocated from under https://github.com/nls-oskari to https://github.com/oskariorg.
 This update only updates references in package.json for jschannel fork (dependency) and the RPC-client.

## 1.41

### [mod] [rpc] RouteResultEvent

Now includes the parameters from the request under rawParams key. You can also send an additional id when making the request and the id will be returned under the rawParams. As some routes take longer to determine than others this can be used to detect order of the responses.

Also a RouteResultEvent with success: false is now sent correctly if there's a network issue or some other internal problem.

### [mod] [rpc] AfterMapMoveEvent

The marker flag has been removed as it was misleading. The value was always false.

### [rem] FeaturesAvailableEvent

Event removed as deprecated and unsupported. Use MapModulePlugin.AddFeaturesToMapRequest instead.

### [mod] AddMapLayerRequest

Request only has one parameter: the layer ID. This simplifies layer order handling and makes it work more intuitively.

### [rem] DimMapLayerRequest, HighlightMapLayerRequest, AfterDimMapLayerEvent and AfterHighlightMapLayerEvent

The above requests and events have been merged to "map.layer.activation" request and event. It has a new boolean flag indicating activation/deactivation instead of own events/requests.

### [rem] AfterShowMapLayerInfoEvent

Event removed as backendstatus bundle sent it to itself reacting to ShowMapLayerInfoRequest that it also handles.

### [rem] CtrlKeyDownRequest and CtrlKeyUpRequest

Requests removed as deprecated. These should be events if anything. Oskari.ctrlKeyDown(blnPressed) can be used instead, but it's deprecated as well.

### [rem] HideMapMarkerRequest and AfterHideMapMarkerEvent

AfterHideMapMarkerEvent was removed as it's no longer used and is misleading as it was used to notify markerlayer being hidden.
HideMapMarkerRequest was removed as it's no longer used and is misleading. Use MapModulePlugin.MarkerVisibilityRequest instead.

### [rem] Printout.PrintWithParcelUIEvent

Removed parcel application specific event from printout.

## 1.40

### [mod] [rpc] InfoBox.ShowInfoBoxRequest

Updating existing infibox in mobile mode had timing problems and ended in javascript error and/or popup being closed instead of updated. This has been fixed.

### [mod] [rpc] [breaking] feedbackService (Open311)

NOTE! Still under construction, this is a POC solution for testing Open311 servers.
For more detailed information, see documentation http://oskari.org/api/requests.

#### GetFeedbackRequest & PostFeedbackRequest

The parameters "getServiceRequests" and "postServiceRequest" are no longer available, but the same content can now be sent with parameter named "payload".
The payload no longer needs to be JSON.stringified.

#### GetFeedbackServiceRequest & GetFeedbackServiceDefinitionRequest

The two requests have been merged to GetFeedbackServiceRequest. The request without a parameter results in a FeedbackResultEvent with a listing of services and
 when the request is sent with a parameter with the value of a service code the event will include metadata (service definition) for that single service.

## 1.39

#### [add] [rpc] New MapModulePlugin.MapLayerUpdateRequest Request

With the request you can force redraw of layers or update any arbitrary layer parameters, such as a WMS layer's SLD_BODY.

Note! When OpenLayers3 is used, GET requests longer than 2048 bytes will be automatically transformed to async ajax POST-requests and proxied. Thus the service itself also has to support http POST-method.

OpenLayers2 will always use GET-requests and will fail, if the GET-request's length exceeds the allowed maximum.

```javascript
sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [layerId, true, {
    SLD_BODY:
        '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">'+
        '    <NamedLayer>'+
        '    <Name>oskari:kunnat2013</Name>'+
        '    <UserStyle>'+
        '    <Title>SLD Cook Book: Simple polygon</Title>'+
        '    <FeatureTypeStyle>'+
        '    <Rule>'+
        '    <PolygonSymbolizer>'+
        '    <Fill>'+
        '    <CssParameter name="fill">#000080</CssParameter>'+
        '    </Fill>'+
        '    </PolygonSymbolizer>'+
        '    </Rule>'+
        '    </FeatureTypeStyle>'+
        '    </UserStyle>'+
        '    </NamedLayer>'+
        '    </StyledLayerDescriptor>'
}]);
```

### [mod] [rpc] infobox

Fixed an issue where InfoBox.InfoBoxEvent was not sent on close when the map is in mobile mode.

## 1.38

#### [add] [rpc] New MapModulePlugin.MarkerVisibilityRequest Request

Use this request to show/hide added marker from map.

Hide wanted marker from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [false, 'TEST_MARKER_ID']);
```

Hide all markers from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [false]);
```

Show wanted marker from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [true, 'TEST_MARKER_ID']);
```

Show all markers from map:
```javascript
channel.postRequest('MapModulePlugin.MarkerVisibilityRequest', [true]);
```

#### [mod] [rpc] MapModulePlugin.AddFeaturesToMapRequest

If some feature's style must be updated (for example for highlighting it on click), the first parameter of request should be key-value-object that identifiers the specific feature existing on the map. Request will check if the feature with given property exists on the map and will update its style according to the style given in the options object.

```javascript
var featureProperty = {'id': 'F1'}; // key is feature property name, value is the property matching value to style
var options = {
    featureStyle: {
        fill: {
            color: '#ff0000'
        },
        stroke : {
            color: '#ff0000',
            width: 5
        },
        text : {
            scale : 1.3,
            fill : {
                color : 'rgba(0,0,0,1)'
            },
            stroke : {
                color : 'rgba(255,255,255,1)',
                width : 2
            }
        }
    },
    layerId: 'VECTOR'
};
channel.postRequest('MapModulePlugin.AddFeaturesToMapRequest', [featureProperty, options]);
 ```

## 1.37

### mapmodule

#### [mod] [rpc] AddMarkerRequest

Improved request to more readably and changed option names.
Custom SVG and external graphic icon properties changed.

External icon changes:
- iconUrl -property not used any more, use instead shape property
- shape -property, tell here external icon url
- offsetX, tell here where marker icon center x point should be. If not setted used 16 (center point)
- offsetY, tell here where marker icon center y point should be. If not setted used 16 (center point)

For example:
```javascript
    var MARKER_ID = "external_marker";
    var data = {
        x: 386020,
        y: 6670057,
        shape: 'http://demo.paikkatietoikkuna.fi/Oskari/resources/framework/bundle/mapmodule-plugin/images/marker.png',
        offsetX: 16, // center point x position from left to right
        offsetY: 0 // center point y position from bottom to up
    };
    channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
```

Custom SVG icon changes:
- shape -property object not needed. Tell here now the svg data, for example ```<svg>...</svg>```
- offsetX, tell here where marker icon center x point should be. If not setted used 16 (center point)
- offsetY, tell here where marker icon center y point should be. If not setted used 16 (center point)

For example:
```javascript
    var MARKER_ID = "happy_face_marker";
    var data = {
            x: 411650.70779123,
            y: 6751897.3481153,
            msg : '',
            shape: '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>',
            offsetX: 16, // center point x position from left to right
            offsetY: 16, // center point y position from bottom to up
            size: 3
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
```

Old request also working well but user that uses old way request and these properties are informed to warning log messages. ```Old way requests it's recommended to switch to the new format.```

## 1.36

### infobox

#### [mod] [rpc] ShowInfoBoxRequest

**Changes not backwards compatible!**

Request is modified to allow giving multiple additional parameters (hidePrevious, colourScheme, font) in one options-object. Request now allows giving mobileBreakpoints as one parameter. MobileBreakpoints means the size of the screen in pixels to start showing infobox in mobile mode.

It is now also possible to define links and buttons to infobox content and give them information that is shown in InfoboxActionEvent when link/button is clicked.

Request is modified also so that infobox can be shown for the marker. This can done by giving marker id instead of lonlat in position-object. If marker id and lon/lat is defined, then infobox is tried to show for marker, if marker is not found then infobox is shown for defined coordinates. If infobox cannot be shown, then it is informed in InfoBox.InfoBoxEvent.

For more detailed information, see [documentation](http://oskari.org/api/requests) and [RPC example](http://oskari.org/examples/rpc-api/rpc_example.html).

NOTE! The changes are not backwards compatible! The basic change that should be done in most use cases is to remove hidePrevious-value (true/false) from parameterlist to the options-object. Other changes may also be required. See the updated request-documentation for getting advice to update your requests.

### mapmodule

#### [mod] [rpc] AddMarkerRequest

Improved request to allow add custom svg markers. Custom marker is defined in shape-object.

```javascript
    var MARKER_ID = "happy_face_marker";
    var data = {
            x: 411650.70779123,
            y: 6751897.3481153,
            msg : '',
            shape: {
                data: '<svg width="32" height="32"><g fill="#9955ff" transform="matrix(0.06487924,0,0,0.06487924,0,1.73024e-6)"><g><path d="M 246.613,0 C 110.413,0 0,110.412 0,246.613 c 0,136.201 110.413,246.611 246.613,246.611 136.2,0 246.611,-110.412 246.611,-246.611 C 493.224,110.414 382.812,0 246.613,0 Z m 96.625,128.733 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m -196.743,0 c 21.128,0 38.256,17.128 38.256,38.256 0,21.128 -17.128,38.256 -38.256,38.256 -21.128,0 -38.256,-17.128 -38.256,-38.256 0,-21.128 17.128,-38.256 38.256,-38.256 z m 100.738,284.184 c -74.374,0 -138.225,-45.025 -165.805,-109.302 l 48.725,0 c 24.021,39.5 67.469,65.885 117.079,65.885 49.61,0 93.058,-26.384 117.079,-65.885 l 48.725,0 C 385.46,367.892 321.608,412.917 247.233,412.917 Z" /></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></g><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /><g transform="translate(0,-461.224)" /></svg>',
                x: 16, // center point x position
                y: 16 // center point y position
            },
            size: 3
        };
        channel.postRequest('MapModulePlugin.AddMarkerRequest', [data, MARKER_ID]);
```

### feedbackService (Open311)

#### [add] [rpc] GetFeedbackRequest

NOTE! Under construction, this is a POC solution for testing Open311 servers.

Get posted feedback data out of Open311 service.

For more detailed information, see documentation http://oskari.org/api/requests.

#### [add] [rpc] PostFeedbackRequest

NOTE! Under construction, this is a POC solution for testing Open311 servers.

Posts user's feedback data to the Open311 service.

For more detailed information, see documentation http://oskari.org/api/requests.


#### [add] [rpc] GetFeedbackServiceRequest

NOTE! Under construction, this is a POC solution for testing Open311 servers

Get Open311 feedback service list.

For more detailed information, see documentation http://oskari.org/api/requests.

#### [add] [rpc] GetFeedbackServiceDefinitionRequest

NOTE! Under construction, this is a POC solution for testing Open311 servers

Get the definition of one feedback service.

For more detailed information, see documentation http://oskari.org/api/requests.

### RPC

#### [add] [rpc] New functions

setCursorStyle(cursorStyle) - function added. Functionality to change the mouse cursor on the map to any valid cursor css declaration ('crosshair','progress' etc.) supported by the browser.

An experimental **getScreenshot()** function is now available when the Oskari instance uses Openlayers 3 based mapmodule.
The function returns an empty string if screenshot could not be produced and a dataURL for png-image when successful.

Usage requires additional configuration on the map layers used on the published map!

**GetPixelMeasuresInScale([mm_measure1, mm_measure2,..],scale)** function is now available for requesting pixel values.
Input: array of mm measurements , requested scale (optional) e.g. [[210,297], 100000]
Output: array of pixel measurements , requested scale

Returns pixel mesurements for mm measurements in requested scale.
Use case: Plot paper size area on a map. See plotPlotArea-function in rpc_example.html.
If scale is not entered, function computes fit scale so that paper size area covers the whole map.

New functions to zoom map: zoomIn, zoomOut, zoomTo. All return the current zoomlevel after zooming.

## 1.35

### RPC

#### [mod] [rpc] New default event

InfoboxActionEvent is now allowed by default.

InfoBox.InfoBoxEvent is now allowed by default.

#### [add] [rpc] New event

InfoboxActionEvent is used to notify which link/button is clicked in the infobox.

#### [mod] [rpc] getAllLayers function modified

GetAllLayers now returns also minimum zoom level and maximum zoom level for the layer if layer has them defined.

```javascript
    {
        id: layerId,
        opacity: layerOpacity,
        visible: layerVisibility,
        name : layerName,
        minZoom: minZoomLevel,
        maxZoom: maxZoomLevel
    };
```

#### [mod] [rpc] New rpc-client version

The JSChannel dependency has been updated. The old version is not compatible with the new one so rpc-client needs to be updated to 2.0.1.

This fix error when sending more than one paramaeter with null values.

#### [add] [rpc] New functions

getFeatures(layerId) that gets features as geojson object grouped by layer if layerId===true. If layerId not given, will return array of layerIds.

getInfo(clientVersion) returns generic information about the Oskari instance:

```javascript
    {
        "version" : "1.35.0",
        "clientSupported" : true,
        "srs" : "EPSG:4326"
    }
```

#### [mod] [rpc] New default request

MapModulePlugin.ZoomToFeaturesRequest is now allowed by default.

InfoBox.HideInfoBoxRequest is now allowed by default.

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
