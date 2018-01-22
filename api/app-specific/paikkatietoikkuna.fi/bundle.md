# terrainprofile

## Description

The bundle provides UI for querying and showing terrain profiles from Paikkatietoikkuna action route "TerrainProfile". A new tool is loaded into the toolbar. Clicking on the tools starts map drawing. After the user has drawn a linestring on the map, the terraing profile is queried from the action route. 

The terrain profile is shown in an area graph, that allows Y-axis zooming by "brushing" the graph. I.e. cliking and dragging a rectangle that corresponds to the desired part of the Y-axis.

The linestring can be modified while the terrain profile functionality is open.


## Bundle configuration

No configuration is required.


## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>DrawTools.StartDrawingRequest</td><td>Starts target linestring drawing</td>
  </tr>
  <tr>
    <td>DrawTools.StopDrawingRequest</td><td>Stops target linestring drawing</td>
  </tr>
  <tr>
    <td>MapModulePlugin.AddMarkerRequest</td><td>Shows location hovered over on the area graph</td>
  </tr>
   <tr>
    <td>MapModulePlugin.RemoveMarkerRequest</td><td>Removes hover location</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`DrawingEvent`</td><td>Track target linestring shape on map</td>
  </tr>
  <tr>
    <td>`Toolbar.ToolSelectedEvent`</td><td>Listens for terrain profile tool activation and starts/ends functionality</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Version </th><th> Purpose</th>
  </tr>
  <tr>
    <td> d3 </td>
    <td> 4.10.0 </td>
    <td> Used for graph drawing</td>
  </tr>
</table>
