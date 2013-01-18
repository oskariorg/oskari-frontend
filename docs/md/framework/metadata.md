# Metadata

<table>
  <tr>
    <td>Bundle-Identifier</td><td>metadata</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>link/here)</td>
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
    <td>ToolSelectionRequest</td><td>When areaselecting tool is pressed</td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies (e.g. jquery plugins)

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
<tr><td> [jQuery](http://api.jquery.com/) </td><td> Version 1.7.1 assumed to be linked (on page locally in portal) </td><td> Used to create the component UI from begin to end
</td></tr><tr><td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html) </td><td> Expects to be present in application setup </td><td> To register plugin to map/gain control to Openlayers map
</td></tr><tr><td> [OpenLayers](http://openlayers.org/) </td><td> Expects OpenLayers already linked </td><td>
</td></tr>
</table>
