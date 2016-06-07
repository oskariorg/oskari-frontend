# Content editor

<table class="table">

<tbody>

<tr>

<td>ID</td>

<td>ContentEditor</td>

</tr>

</tbody>

</table>

## Description

This bundle provides a new admin tool to manage features properties and geometries.

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table class="table">

<tbody>

<tr>

<th>Request</th>

<th>Where/why it's used</th>

</tr>

<tr>

<td>`ContentEditor.ShowContentEditorRequest`</td>

<td>Shows content editor bundle</td>

</tr>

</tbody>

</table>


## Requests the bundle sends out

<table class="table">

<tbody>

<tr>

<th>Request</th>

<th>Where/why it's used</th>

</tr>

<tr>

<td>`DrawPlugin.StartDrawingRequest`</td>

<td>Start drawing on map</td>

</tr>

<tr>

<td>`DrawPlugin.StopDrawingRequest`</td>

<td>Stop drawing on map</td>

</tr>

<tr>

<td>`MapModulePlugin.MapLayerUpdateRequest`</td>

<td>Forces openlayers update the layers of tiles</td>

</tr>

<tr>

<td>`MapModulePlugin.GetFeatureInfoActivationRequest`</td>

<td>Disable GFI while adding a marker.</td>

</tr>

<tr>

<td>`MapModulePlugin.MapLayerVisibilityRequest`</td>

<td>Hides a maplayer or changes a hidden layer to visible</td>

</tr>

<tr>

<td>`userinterface.RemoveExtensionRequest`</td>

<td>Unregister from the UI in stop()-method.</td>

</tr>


</tbody>

</table>

## Events the bundle listens to

<table class="table">

<tbody>

<tr>

<th>Event</th>

<th>How does the bundle react</th>

</tr>

<tr>

<td>`GetInfoResultEvent`</td>

<td>Receive information about clicked layers</td>

</tr>

<tr>

<td>`DrawPlugin.FinishedDrawingEvent`</td>

<td>Sent drawed geometries when the user has finished the drawing.</td>

</tr>

<tr>

<td>`WFSFeatureGeometriesEvent`</td>

<td>Used to get feature geometries of those WFS Features, which has been highlighted.</td>

</tr>

<tr>

<td>`MapClickedEvent`</td>

<td>Receive information about clicked layers</td>

</tr>

</tbody>

</table>

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">

<tbody>

<tr>

<th>Dependency</th>

<th>Linked from</th>

<th>Purpose</th>

</tr>

<tr>

<td>[jQuery](http://api.jquery.com/)</td>

<td>Assumes to be linked in the page</td>

<td>Used to create the component UI from begin to end</td>

</tr>

</tbody>

</table>
