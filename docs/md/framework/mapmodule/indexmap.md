# Index Map

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin)</td>
  </tr>
</table>

## Description

This plugin adds an indexmap for the map it is registered to.

## Screenshot

## Closed

![closed](<%= docsurl %>images/indexmap_closed.png)

## Open

![open](<%= docsurl %>images/indexmap_open.png)

## Bundle configuration

No configuration is required.

## Requests the plugin handles

This plugin doesn't handle any requests.

## Requests the plugin sends out

This plugin doesn't sends any requests.

## Events the plugin listens to

<table>
  <tr>
    <td> Event </td><td> How does the bundle react</td>
  </tr>
  <tr>
    <td> AfterMapMoveEvent </td><td> Updates ui to current map location</td>
  </tr>
</table>

## Events the plugin sends out

This bundle doesn't send any events.

## Dependencies

<table>
  <tr>
    <td> Dependency </td><td> Linked from </td><td> Purpose</td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> not linked, assumes its linked by map </td>
    <td> Uses OpenLayers.Control.OverviewMap to render the index map.</td>
  </tr>
</table>
