# mapmodule

## Description

Provides abstraction for map implementation (Openlayers 2/3) and provides a plugin mechanism to add additional functionality to map.

## TODO

- Configurable zoomlevels

## Bundle configuration

Some configuration is needed for URLs:
```javascript
{
  "termsUrl" : {
    "fi" : "//www.paikkatietoikkuna.fi/web/fi/kayttoehdot",
    "sv" : "//www.paikkatietoikkuna.fi/web/sv/anvandningsvillkor",
    "en" : "//www.paikkatietoikkuna.fi/web/en/terms-and-conditions"
  },
  "mapUrlPrefix" : {
    "fi":"//www.paikkatietoikkuna.fi/web/fi/kartta?",
    "sv":"//www.paikkatietoikkuna.fi/web/sv/kartfonstret?",
    "en":"//www.paikkatietoikkuna.fi/web/en/map-window?"
  }
}
```

Configuration is not handled like normal bundles.

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
    "srsName" : "EPSG:3067",
    "openLayers" : {
        "imageReloadAttemps": 5,
        "onImageLoadErrorColor": "transparent"
    }
}
```

## Bundle state

No statehandling has been implemented.

## Bundle functions

### getProjectionDecimals

Function returns wanted projection decimals. If wanted projection is not defined, then using map projection. Decimals concluded from projection units. Now 'degrees' units returns 6 and 'm' units returns 0.
For example:
```javascript
var mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
var mapProjectionDecimals = mapmodule.getProjectionDecimals();
console.log('Map projection decimals = '+mapProjectionDecimals);
var WGS84Decimals = mapmodule.getProjectionDecimals('EPSG:4326');
console.log('WGS84 projection decimals = '+WGS84Decimals);
```

### getProjectionUnits

Function returns wanted projection units. If wanted projection is not defined, then using map projection.
For example:
```javascript
var mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
var mapUnits = mapModule.getProjectionUnits();
console.log('Map projection units = ' + mapUnits);
var WGS84Units = mapModule.getProjectionUnits('EPSG:4326');
console.log('WGS84 projection units = ' + WGS84Units);
```

## Requests the bundle handles

<table class="table">
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

<table class="table">
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> SearchClearedEvent</td><td> Removing all markers from map</td>
  </tr>
</table>

* Plugins might listen to additional events

## Events the bundle sends out

<table class="table">
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

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> Used for all map functionality</td>
  </tr>
</table>
