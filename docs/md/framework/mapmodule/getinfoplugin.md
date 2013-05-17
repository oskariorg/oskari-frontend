# Get Info Plugin

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.mapmodule.GetInfoPlugin)</td>
  </tr>
</table>

## Description

This plugin provides view of the from GetFeatureInfo and similar results what are processed in backend

## Screenshot

![screenshot](<%= docsurl %>images/gfi_query.png)

## Bundle configuration

Handling infoBox in the plugin is made configurable. Makes it possible to request infoBox with additional information later on.

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

This plugin doesn't sends out any requests

## Events the bundle listens to

<table>
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> EscPressedEvent </td><td> Closing GetInfo "popup" from screen.</td>
  </tr>
  <tr>
    <td> MapClickedEvent </td><td> Send ajax request to backend system.</td>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> Cancel ajax request.</td>
  </tr>
</table>

## Events the plugin sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>GetInfoResultEvent</td><td> Result of ajax request formatted send as an event so that infobox handling can be done elsewhere </td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI</td>
  </tr>
  <tr>
    <td> [Oskari infobox](<%= docsurl %>framework/infobox.html) </td>
    <td> Oskari's InfoBoxBundle </td>
    <td> That handles the infobox as an Openlayers popup with customized UI
  </td>
  </tr>
  <tr>
    <td> [Backend API](<%= docsurl %>backend/mapmodule/getinfoplugin.html) </td>
    <td> N/A </td>
    <td> Get info is handle in backend</td>
  </tr>
</table>
