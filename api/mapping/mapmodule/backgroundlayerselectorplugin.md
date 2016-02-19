# Background Layer Selection Plugin

## Description

This plugin provides a background maplayer selection "dropdown" on top of the map.

## Screenshot

## Closed

![closed](images/backgroundlayerselection_closed.png)

## Open

![open](images/backgroundlayerselection_open.png)

## List

![list](images/backgroundlayerselection_list.png)

## Bundle configuration

```javascript
{
  "baseLayers" : ["<layerid 1>","<layerid 2>","<layerid 3>""],
  "showAsDropdown" : <true/false>
}
```

Configuration is required to define the preset background layers.

UI can be presented as a button bar or a dropdown, this is controlled with `showAsDropdown`, which defaults to false.

The font and colour scheme of the plugin are configurable, with variables `font` (String) and `colorScheme` (Object) respectively. A CSS class of `oskari-publisher-font-<font>` is expected to be defined with font-family definition. The `colorScheme` object should have keys `buttonColor`, `buttonBackgroundColor`, `buttonSelectedColor`, `buttonSelectedBackgroundColor` and `buttonBorderColor`.

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapModulePlugin.RemoveMapLayerRequest</td>
    <td>Remove old background layer selection</td>
  </tr>
  <tr>
    <td>MapModulePlugin.AddMapLayerRequest</td>
    <td>Add new background layer selection</td>
  </tr>
  <tr>
    <td>MapModulePlugin.RearrangeSelectedMapLayerRequest</td>
    <td>Move bg layer to bottom</td>
  </tr>
</table>

## Events the plugin listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent</td>
    <td>Update selection, bottom baselayer might've changed</td>
  </tr>
  <tr>
    <td>Oskari.mapframework.event.common.AfterMapLayerRemoveEvent</td>
    <td>Redo ui, one of the preset bg layers might've been deleted</td>
  </tr>
  <tr>
    <td>Oskari.mapframework.event.common.AfterMapLayerAddEvent</td>
    <td>Redo ui, we might've gotten a previously missing preset bg layer</td>
  </tr>
  <tr>
    <td>Oskari.mapframework.event.common.MapLayerEvent</td>
    <td>Redo ui, we might've gotten a previously missing preset bg layer</td>
  </tr>
</table>

## Events the plugin sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI</td>
  </tr>
</table>
