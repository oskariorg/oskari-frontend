# Layers Plugin

<table>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapmodule.plugin.LayersPlugin)</td>
  </tr>
</table>

### Description

This is a plugin to bring more functionality for the mapmodules map implementation. It provides handling for rearranging layer order and controlling layer visibility. Provides information to other bundles if a layer becomes visible/invisible (out of scale/out of content geometry) and request handlers to move map to location/scale based on layer content. Also optimizes openlayers maplayers visibility setting if it detects that content is not in the viewport.

### TODO

Has some handling for the markers layer. IMHO shouldn't.

### Bundle configuration

No configuration is required.

### Bundle state

No statehandling has been implemented for this.

### Requests the bundle handles

<table>
<tbody><tr><td> Request </td><td> How does the bundle react
</td></tr><tr><td> MapModulePlugin.MapLayerVisibilityRequest </td><td> Hides a maplayer or changes a hidden layer to visible.
</td></tr><tr><td> MapModulePlugin.MapMoveByLayerContentRequest </td><td> Moves the map to a location and/or scale where the maplayer has content. (Maplayer geometry is visible in viewport/scale is in range for layer).
</td></tr></tbody></table>

### Requests the bundle sends out

This bundle doesn't send any requests.

### Events the bundle listens to

<table>
<tbody><tr><td> Event </td><td> How does the bundle react
</td></tr><tr><td> AfterRearrangeSelectedMapLayerEvent </td><td> Moves the Openlayers maplayers order to match the layer move spesified in the event, also handles markers layer that it would stay on top
</td></tr><tr><td> MapMoveStartEvent </td><td> Stops internal timer scheduled to do a visibility check.
</td></tr><tr><td> AfterMapMoveEvent </td><td> Schedules a visibility check to be done with a small delay (delay to improve performance on concurrent moves)
</td></tr><tr><td> AfterMapLayerAddEvent </td><td> Checks if added layer has geometries. If not, checks if it has geometryWKT (well-known text) value. If WKT is available, parses it to fill in the geometry array.
</td></tr></tbody></table>

### Events the bundle sends out

<table>
<tbody><tr><td> Event </td><td> When it is triggered/what it tells other components
</td></tr><tr><td> MapLayerVisibilityChangedEvent </td><td> Notifies other bundles if a layer has become visible/invisible telling if its out of scale or content area.
</td></tr></tbody></table>

### Dependencies (e.g. jquery plugins)

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr><tr><td> [OpenLayers](http://openlayers.org/) </td><td> not linked, assumes its linked by map </td><td> Uses Openlayers to parse WKT geometry, detect if it matches to current maps viewport and to get the centerpoint for layers geometry. Also controls Openlayers to show/hide layers.
</td></tr></table>
