# Map Module

<table>
  <tr>
    <td>ID</td><td>mapmodule</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.ui.module.common.MapModule)</td>
  </tr>
</table>

## Description

Provides abstraction for map implementation (Openlayers) and provides a plugin mechanism to add additional functionality to map.

## TODO

- Configurable zoomlevels

## Bundle configuration

No configuration is required and it is not handled like normal bundles. 

Configuration can be given when constructing the mapmodule through constructor call. Usually its passed through the mapfull bundle configuration:

```javascript
{
    "resolutions" : [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
    "maxExtent" : {
        "left" : -548576.0,
        "bottom" : 6291456.0,
        "right" : 1548576.0,
        "top" :  8388608
    },
    "units" : "m",
    "srsName" : "EPSG:3067"
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table>
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> MapModulePlugin.MapLayerUpdateRequest </td><td> Forces openlayers update the layers of tiles</td>
  </tr>
  <tr>
    <td> MapMoveRequest </td><td> Moving map position</td>
  </tr>
  <tr>
    <td> ClearHistoryRequest </td><td> Clearing Openlayers history(not used yet, the history handling are yet in statehandler)</td>
  </tr>
</table>

* Plugins might handle additional requests

## Requests the bundle sends out

This bundle doesn't send out any requests

* Plugins might send additional requests

## Events the bundle listens to

<table>
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> SearchClearedEvent</td><td> Removing all markers from map</td>
  </tr>
</table>

* Plugins might listen to additional events

## Events the bundle sends out

<table>
  <tr>
    <th> Event </th><th>Why/when</th>
  </tr>
  <tr>
    <td> MapMoveStartEvent </td><td> When draging start</td>
  </tr>
  <tr>
    <td> AfterMapMoveEvent</td><td> After map has moved</td>
  </tr>
</table>

* Plugins might send additional events

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> Used for all map functionality</td>
  </tr>
</table>
