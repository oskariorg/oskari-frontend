# Layer Selection Plugin

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.LayerSelectionPlugin)</td>
  </tr>
</table>

## Description

This plugin provides a maplayer selection "dropdown" on top of the map.

## Screenshot

## Closed

![closed](<%= docsurl %>images/layerselection_closed.png)

## Open

![open](<%= docsurl %>images/layerselection_open.png)

## Bundle configuration

```javascript
{
  baseLayers : ['<layerid 1>','<layerid 2>','<layerid 3>'],
  defaultBase : '<layerid 1>'
}
```

Configuration is not required, but it can be used to set some selected layers as "base layers". Baselayers differ from normal layers that only one base layer is shown at a time.

The styling and font of the plugin are configurable, with variables `toolStyle` (String) and `font` (String), respectively. A CSS class of `oskari-publisher-font-<font>` is expected to be defined with font-family definition. Following values are supported for the `toolStyle`: `rounded-light`, `rounded-dark`, `sharp-dark`, `sharp-light`, `3d-dark` and `3d-light`. An image `map-layer-button-<toolStyle>.png` is expected to be found in plugin's image resources directory.

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapModulePlugin.MapLayerVisibilityRequest </td><td> Controls map layer selection by hiding map layers and making them visible on the map</td>
  </tr>
</table>

## Events the plugin listens to

This plugin doesn't listen any events.

## Events the plugin sends out

This bundle doesn't send any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI</td>
  </tr>
</table>
