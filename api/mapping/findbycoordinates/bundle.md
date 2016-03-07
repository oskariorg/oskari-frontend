# findbycoordinates

## Description

Creates a service and a user interface for searching nearest address on a map and adds a button to the toolbar for reverse geocode search. Requires server side functionality.

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> MapClickedEvent </td><td> Does search when tool is selected</td>
  </tr>
  <tr>
    <td> Toolbar.ToolSelectedEvent </td><td>Removes layer from the map</td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerOpacityEvent </td><td>Changes map layer opacity</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [colpick Color Picker](http://colpick.com/plugin) </td>
    <td> Heatmap bundle </td>
    <td> Used to select colors for heatmap</td>
  </tr>
</table>
