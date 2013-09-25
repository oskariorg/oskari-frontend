# Layer Selection

<table>
  <tr>
    <td>ID</td><td>layerselection2</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance.html)</td>
  </tr>
</table>

## Description
The bundle presents listing for currently selected maplayers. For each maplayer the user can change the opacity, hide/show the maplayer and remove it from map. 
If a maplayer is not visible in current map scale/location, the user sees a message about it and a link to move the map to location where there is content on the maplayer. 
If the layer can be published the layer has a text telling the user about it. The user can change the order of maplayers by dragging them into different order. 
Layer styles can be selected from a dropdown where applicable.
Possible layer tools (wfs grid, statslayer mode) are listed in layer containers.

## TODO

* handles wmts tooltip eventhough its not a core layer type

## Screenshot

![screenshot](<%= docsurl %>images/layerselection2.png)

## Bundle configuration

No configuration is required.

## Bundle state

This bundle doesn't have state information since it reflects the state of the map which is controlled elsewhere.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td> userinterface.AddExtensionRequest </td><td> Register as part of the UI in start()-method</td>
  </tr>
  <tr>
    <td> userinterface.RemoveExtensionRequest </td><td> Unregister from the UI in stop()-method</td>
  </tr>
  <tr>
    <td> ChangeMapLayerOpacityRequest </td><td> Sends out when user changes the opacity for a layer</td>
  </tr>
  <tr>
    <td> MapModulePlugin.MapLayerVisibilityRequest </td><td> Sends out when user clicks the 'Show/Hide' link on a layer</td>
  </tr>
  <tr>
    <td> MapModulePlugin.MapMoveByLayerContentRequest </td><td> Sends out when user clicks the 'Zoom/Move map to scale/content' link</td>
  </tr>
  <tr>
    <td> RearrangeSelectedMapLayerRequest </td><td> Sends out when user changes the order of layers in the list</td>
  </tr>
  <tr>
    <td> RemoveMapLayerRequest </td><td> Sends out when user clicks the 'remove map layer' button</td>
  </tr>
  <tr>
    <td> ChangeMapLayerStyleRequest </td><td> Sent when a layer style is selected from the dropdown.</td></tr><tr><td> catalogue.ShowMetadataRequest </td><td> Sent when the the info icon is clicked.</td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th> Event </th><th> How does the bundle react</th>
  </tr>
  <tr>
    <td> AfterMapLayerAddEvent </td><td> Adds the layer to the UI listing</td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td> Removes the layer from the UI listing</td>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Only listens to 'update' operation and updates the name of the layer in UI</td>
  </tr>
  <tr>
    <td> MapLayerVisibilityChangedEvent </td><td> Changes the UI for the layer (shows out-of-scale message/tools if in-scale etc)</td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerOpacityEvent </td><td> Changes the UI for the layer if event creator isn't this bundle. Opacity controls are set to match the data in Oskari when some external component changes layer opacity. (e.g. statehandler)</td>
  </tr>
  <tr>
    <td> AfterChangeMapLayerStyleEvent </td><td> Changes the UI for the layer if event creator isn't this bundle. Style drowdown is set to match the data in Oskari when some external component changes layer style. (e.g. statehandler)</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Oskari oskariui](<%= docsurl %>framework/oskariui.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for layer ddrag&amp;drop and opacity slider</td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Needed for flyout/tile functionality</td>
  </tr>
</table>
