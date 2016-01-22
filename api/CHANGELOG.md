# Oskari API changelog

This document describes changes to the public API from Oskari frontend perspective (requests, events, conf/state, services). RPC-developers can check if the request/event API has changed
when the service provider gives notice about Oskari version being upgraded. Oskari bundle/core-developers can check for changes in the bundles they depend on.

## 1.35

### search

#### SearchRequest - RPC

The parameter given to the request should be a string that will be used to execute the search (previously an object with "searchKey" property).

#### SearchResultEvent - RPC

The value of "requestParameters" is now the string that was given to SearchRequest.

### drawtools

#### DrawTools.StartDrawingRequest - RPC

'showMeasure' parameter in optional object parameter has been renamed to 'showMeasureOnMap' (if true - measure result will be displayed on map near feature. Default is false.)

Changes to polygon drawing where the polygon intersects with itself. This is by default considered an invalid geometry and as such the geometry is not sent with the event.

#### DrawingEvent - RPC

Values of geojson and data.bufferedGeoJson are now proper JSON structures instead of strings with escaped JSON.

## 1.34

Initial api version