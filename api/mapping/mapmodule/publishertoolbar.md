# PublishedToolbar Plugin

## Description

This is a plugin to bring toolbar functionality to published maps. It provides a container for the toolbar bundle to add itself into and available buttons allowing publishable maps to be configured to include only the wanted tools. The toolbar bundle handles most requests, except "Toolbar.ToolContainerRequest", which are handled by publishertoolbar.

## Bundle configuration

```javascript
{
    "toolbarId" : "PublisherToolbar"
}
```

No configuration is required. If the toolbarId is defined, then publishertoolbar creates a new toolbar using the given id into itself. This is particularily useful when configuring a published map.

## Bundle state

No statehandling has been implemented for this.

## Requests the bundle handles

<table class="table">
<tr>
  <th> Request </th><th> How does the bundle react</th>
</tr>
<tr>
  <td> MapModulePlugin.MapLayerVisibilityRequest </td><td> Hides a maplayer or changes a hidden layer to visible.</td>
</tr>
<tr>
  <td> MapModulePlugin.MapMoveByLayerContentRequest </td><td> Moves the map to a location and/or scale where the maplayer has content. (Maplayer geometry is visible in viewport/scale is in range for layer).</td>
</tr>
</table>

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td> Toolbar.ToolContainerRequest </td><td> Creates and removes popup content containers within the plugin container provided by publishertoolbar</td>
  </tr>
</table>

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td> Toolbar.ToolbarRequest </td><td> Adds a toolbar into the published map. </td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> not linked, assumes its linked by map </td>
    <td> Uses Openlayers to parse WKT geometry, detect if it matches to current maps viewport and to get the centerpoint for layers geometry. Also controls Openlayers to show/hide layers.</td>
  </tr>
  <tr>
    <td> [Oskari toolbar](/documentation/bundles/framework/toolbar) </td>
    <td> Oskari's ToolbarBundle </td>
    <td> That handles the toolbar functionality</td>
  </tr>
</table>
