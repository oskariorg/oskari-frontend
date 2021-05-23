# layerlist

A layer listing functionality for the geoportal.

## Description

Includes listing layers registered in the Oskari instance, hierarchical grouping defined by admin, listing by data provider and listing for layers that are currently on the map. Also includes textual search for layers and pre-defined filters that allow users to find specific type of layers more easily.

Allows other bundles to register pre-defined filters to be shown and adding tools for layers and a hook for admin functionality for adding layers, groups and dataproviders (extensible menu).

## Bundle configuration

No configuration is required, but allows configuration:

- layerGroupToggleLimit (optional number, default 0)

0 = don't show layer toggle for groups
negative number = alwaus show layer toggle for groups
positive number = show layer toggle for groups with at most the amount of layers configured with this

## Bundle state

No state is required.

## Requests the bundle sends out

<table class="table">
<tr>
  <th> Request </th>
  <th> Where/why it's used</th>
</tr>
<tr>
  <td> `MapModulePlugin.MapLayerVisibilityRequest` </td>
  <td>Sends out when user clicks the 'Show/Hide' link on a layer</td>
</tr>
<tr>
  <td> `RemoveMapLayerRequest` </td>
  <td>Sends out when user clicks the 'remove map layer' button</td>
</tr>
<tr>
  <td> `ChangeMapLayerStyleRequest` </td>
  <td>Sent when a layer style is selected from the dropdown.</td>
</tr>
<tr>
  <td> `ChangeMapLayerOpacityRequest` </td>
  <td>Sends out when user changes the opacity for a layer</td>
</tr>
<tr>
  <td> `MapModulePlugin.MapMoveByLayerContentRequest` </td>
  <td> Allows the user to move the map by the layer content</td>
</tr>
<tr>
  <td> `userinterface.UpdateExtensionRequest` </td>
  <td> Handles flyout hide/show </td>
</tr>
<tr>
  <td> `userinterface.AddExtensionRequest` </td>
  <td>Register as part of the UI in start()-method</td>td>
</tr>
<tr>
  <td> `userinterface.RemoveExtensionRequest` </td>
  <td>Unregister from the UI in stop()-method</td>
</tr>
<tr>
  <td> `Guidedtour.AddToGuidedTourRequest` </td>
  <td> Register layerlist to guided tour </td>
</tr>
<tr>
  <td> `catalogue.ShowMetadataRequest` </td>
  <td>Sent when the the info icon is clicked</td>
</tr>
<tr>
  <td> `ShowMapLayerInfoRequest` </td>
  <td>Sent when the the backend status icon is clicked<td>
</tr>
<tr>
  <td> `RearrangeSelectedMapLayerRequest` </td>
  <td>Sends out when user changes the order of layers in the list</td>
</tr>

</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> `AfterMapLayerRemoveEvent` </td><td> Updates UI to remove the layer from selected layers</td>
  </tr>
  <tr>
    <td> `AfterMapLayerAddEvent` </td><td>Updates UI to add the layer to selected layers</td>
  </tr>
  <tr>
    <td> `MapLayerEvent` </td><td>Adds/updates/removes layer from listing based on event</td>
  </tr>
  <tr>
    <td> `BackendStatus.BackendStatusChangedEvent` </td><td>Updates UI to reflect changes in layer backend status</td>
  </tr>
  <tr>
    <td> `userinterface.ExtensionUpdatedEvent` </td><td>React flyout updates</td>
  </tr>
  <tr>
    <td> `MapLayerVisibilityChangedEvent` </td><td>Update UI to change the layer visibility status</td>
  </tr>
  <tr>
    <td> `AfterChangeMapLayerOpacityEvent` </td><td>Changes map layer opacity slider values</td>
  </tr>
  <tr>
    <td> `AfterChangeMapLayerStyleEvent` </td><td>Changes map layer style</td>
  </tr>
  <tr>
    <td> `AfterRearrangeSelectedMapLayerEvent` </td><td>Changes map layer order</td>
  </tr>
  <tr>
    <td> `MapSizeChangedEvent` </td><td>Handles flyout max height</td>
  </tr>

</table>
