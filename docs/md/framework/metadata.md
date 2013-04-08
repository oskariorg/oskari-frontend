# Metadata

<table>
  <tr>
    <td>ID</td><td>metadata</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.metadata.MetadataSearchInstance)</td>
  </tr>
</table>

## Description

*Describe what the bundle does.*

## TODO

- *List any planned features*

## Screenshot

![screenshot](<%= docsurl %>images/metadata.png)

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
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

<table>
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

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> Metadata.MapSelectionEvent </td><td> Notifies that an area has been selected. The event includes the selected geometry.</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to map/gain control to Openlayers map</td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td></td>
  </tr>
  <tr>
    <td> [Oskari toolbar](<%= docsurl %>framework/toolbar.html) </td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to toolbar</td>
  </tr>
</table>
