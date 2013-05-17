# WFS Layer Plugin

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapwfs2.plugin.WfsLayerPlugin)</td>
  </tr>
</table>

## Description

WfsLayerPlugin does event handling and passes needed parameters from events to Mediator's functions that handle cometd messaging for WFS layers.

## Screenshot

![screenshot](<%= docsurl %>images/wfslayer.png)

## Bundle configuration

Sandbox is configurable so that the plugin supports multiple map divs at the same time.

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td> InfoBox.ShowInfoBoxRequest </td><td> When map is clicked and both cometd and ajax data are collected </td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> Send updated location. </td>
  </tr>
  <tr>
    <td> AfterMapLayerAddEvent </td><td> Send added layer information. </td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td> Send removed layer id. </td>
  </tr>
  <tr>
    <td> WFSFeaturesSelectedEvent </td><td> Send selected feature ids. </td>
  </tr>
  <tr>
    <td> MapClickedEvent </td><td> Send map clicks location. </td>
  </tr>
  <tr>
    <td> GetInfoResultEvent </td><td> Update map click information coming from ajax request. </td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerStyleEvent </td><td> Send updated layer style information. </td>
  </tr>
  <tr>
    <td> MapLayerVisibilityChangedEvent </td><td> Send updated layer visibility information. </td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerOpacityEvent </td><td> Update OpenLayer's layer opacity. </td>
  </tr>
  <tr>
    <td> WFSSetFilter </td><td> Send geojson filter. </td>
  </tr>
  <tr>
    <td> WFSImageEvent </td><td> Adds image into OpenLayer's layer. </td>
  </tr>
</table>

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
  <tr>
    <td> [Oskari infobox](<%= docsurl %>framework/infobox.html) </td>
    <td> Oskari's InfoBoxBundle </td>
    <td> That handles the infobox as an Openlayers popup with customized UI</td>
  </tr>
</table>
