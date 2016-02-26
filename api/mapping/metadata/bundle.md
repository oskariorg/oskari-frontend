# metadata

Deprecated. Provides UI to make selection on map.

## Screenshot

![screenshot](metadata.png)

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>Toolbar.AddToolButtonRequest</td><td>Adds selection area tool to toolbar on startup</td>
  </tr>
  <tr>
    <td>Toolbar.SelectToolButtonRequest</td><td>Selects default tool after Metadata.MapSelectionEvent</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> Toolbar.ToolSelectedEvent </td><td> Removes drawing when a tool is selected</td>
  </tr>
  <tr>
    <td> Metadata.MapSelectionEvent </td><td> Requests toolbar to select default tool</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](/documentation/bundles/framework/mapmodule) </td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to map/gain control to Openlayers map</td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td></td>
  </tr>
  <tr>
    <td> [Oskari toolbar](/documentation/bundles/framework/toolbar) </td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to toolbar</td>
  </tr>
</table>
