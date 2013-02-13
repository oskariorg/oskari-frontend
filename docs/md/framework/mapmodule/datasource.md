# Data Source

<table>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>/docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.DataSourcePlugin)</td>
  </tr>
</table>

## Description

''Renders a pop-up that contains a list of data providers based on selected layers.''


## Screenshot

![screenshot](<%= docsurl %>images/datasource.png)

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>openDialog</td><td>Opens up pop-up</td>
  </tr>
  <tr>
    <td>getMetadataInfoCallback</td><td>shows metadata associated with the layer</td>
  </tr>
</table>


## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to create the UI and to sort the layers</td>
  </tr>
  <tr>
    <td>[OpenLayers](http://openlayers.org/)</td>
    <td>not linked, assumes its linked by map</td>
    <td>Uses OpenLayers' popup</td>
  </tr>
</table>

