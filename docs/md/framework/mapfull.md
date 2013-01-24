# Map full

<table>
  <tr>
    <td>ID</td><td>mapfull</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapfull.MapFullBundleInstance)</td>
  </tr>
</table>

## Description

Initializes Oskari core with Oskari.mapframework.service.MapLayerService, starts up Oskari.mapframework.ui.module.common.MapModule and renders the map to a HTML element with id "mapdiv".  The bundle doesn't create the "mapdiv" element but assumes it exists on the page. Adds maplayers to the map and moves it to a location and zoom level as specified in state.

## TODO

* HTML element id via configuration?

## Screenshot

![screenshot](<%= docsurl %>images/mapfull.png)

Mapfull using mapmodule-plugin bundle to show map view with some plugins (scalebar, zoombar, wmslayer, panbuttons etc).

## Bundle configuration

```javascript
{
  "plugins":[
    {
      "id":"Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin"
    },
    {
      "id":"Oskari.mapframework.mapmodule.WmsLayerPlugin"
    },
    {
      "id":"Oskari.mapframework.mapmodule.ControlsPlugin"
    }
  ],
  "layers":[
    {
      <1 or more layer definitions, should have at least ones referenced in state.selectedLayers>
    }
  ],
  "globalMapAjaxUrl":"<url for ajax operations>",
  "user":{
     <logged in users details for Oskari.mapframework.domain.User >
  },
  "imageLocation":"<base url mapmodulen for images(optional, defaults to  "/Oskari/resources")>"
}
```

* plugins is an array of map module plugins that will be registered and started on map when the bundle is started. If you specify no plugins, you wont see anything on the map. See different plugins documentation to see which ones you should have here.
* layers is an array of map layer JSON definitions that will be populated to Oskari.mapframework.service.MapLayerService. It can have 0 or more layer definitions but it SHOULD have at least the ones referenced in state.selectedLayers. Otherwise selectedLayers aren't going to be added to map on startup.
* globalMapAjaxUrl is set to Oskari.mapframework.sandbox.Sandbox and can be asked everywhere with sandbox.getAjaxUrl()
* user is optional and should have information about the logged in user. It will be set to Oskari.mapframework.sandbox.Sandbox and can be asked everywhere with sandbox.getUser(). The format of the data should in a form accepted by Oskari.mapframework.domain.User constructor.

## Bundle state

```javascript
{
  "selectedLayers":[
    {
      "id":<id of a preselected layer>,
      "hidden" : <boolean (optional)>,
      "style" : "<style name (optional)>",
      "opacity" : <layer opacity (optional)>
    }
  ],
  "zoom": <zoomlevel 0-12>,
  "east": "<latitude>",
  "north": "<longitude>",
  "size": {
    "width" : <map window width>,
    "height" : <map window height>
  }
}
```

* selectedLayers is an array specifying which layers should be added to map on startup. It can have only id property, but other listed properties are supported as well.
* size is optional but if given will set the map elements size. If size isn't specified the map elements height will be set to window height and the bundle will listen to window resizing to adjust the map size.

## Requests the bundle handles

This bundle doesn't handle any requests, but initializes Oskari.mapframework.core.Core which handles many requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>AddMapLayerRequest</td><td>Adds layers specified in state to the map</td>
  </tr>
  <tr>
    <td>RemoveMapLayerRequest</td><td>If state is set after the bundle is started, removes any layers on map before adding the ones specified in the new state </td>
  </tr>
  <tr>
    <td>ChangeMapLayerOpacityRequest</td><td>Changes the opacity for a selected layer if specified in state</td>
  </tr>
  <tr>
    <td>ChangeMapLayerStyleRequest</td><td>Changes the style for a selected layer if specified in state</td>
  </tr>
  <tr>
    <td>MapModulePlugin.MapLayerVisibilityRequest</td><td>Hides a selected layer after adding it if specified in state</td>
  </tr>
  <tr>
    <td>MapMoveRequest</td><td>Uses sandbox.syncMapState which sends out this request to move the map to location specified in state</td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events, but initializes Oskari.mapframework.ui.module.common.MapModule which listens to many events.

## Events the bundle sends out

This bundle doesn't send out any events, but initializes Oskari.mapframework.core.Core, Oskari.mapframework.service.MapLayerService, Oskari.mapframework.ui.module.common.MapModule which send out many events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to handle map element sizing </td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> Not used directly but a MapModule dependency </td>
  </tr>
  <tr>
    <td> [Proj4js](http://trac.osgeo.org/openlayers/wiki/Documentation/Dev/proj4js) </td>
    <td> Expects Proj4js already linked </td>
    <td> Sets proj4js defs for map module </td>
  </tr>
  <tr>
    <td> [Oskari mapwmts](<%= docsurl %>framework/mapwmts.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Adds support for WMTS maplayers in maplayer service and map module. </td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> To initialize and show the map on UI </td>
  </tr>
  <tr>
    <td> [Oskari mapmodule plugins](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Any bundle providing a map plugin referenced in config needs to be loaded before starting this bundle </td>
  </tr>
</table>
