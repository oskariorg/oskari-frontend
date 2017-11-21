# geometrycutter

## Description

The bundle provides tools for geometry editing. Currently supported functionality includes spliting Polygon or LineString with user drawn LineString and clipping any geometry with user drawn Polygon.

The target geometry to be cut is assumed to be rendered by the requesting functionality. Geometrycutter only renders the user drawn cutting feature and the cutting results for the duration of the cutting operation. That is, after StopGeometryCuttingRequest, map is cleared from any temporary features rendered by geometrycutter. 

### Usage
1. Send `StartGeometryCuttingRequest` with target GeoJSON and mode
2. Listen to `GeometryCuttingEvent` for updates (if needed)
3. Send `StopGeometryCuttingRequest` when you wish to stop functionality


## Bundle configuration

No configuration is required.


## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>DrawTools.StartDrawingRequest</td><td>Starts cutting geometry drawing</td>
  </tr>
  <tr>
    <td>DrawTools.StopDrawingRequest</td><td>Stops cutting geometry drawing</td>
  </tr>
  <tr>
    <td>MapModulePlugin.AddFeaturesToMapRequest</td><td>Shows geometry cutting results on map</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`DrawingEvent`</td><td>Uses drawn geometry as cutting feature</td>
  </tr>
  <tr>
    <td>`FeatureEvent`</td><td>Listens to clicks. Highlights cutting results displayed on map</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [JSTS](https://github.com/bjornharrtell/jsts) </td>
    <td> Version 1.4.0 assumed to be linked </td>
    <td> Used for geometrical operations </td>
  </tr>
</table>
