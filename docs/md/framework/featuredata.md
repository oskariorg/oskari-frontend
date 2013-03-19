# Feature Data

<table>
  <tr>
    <td>ID</td><td>featuredata</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.featuredata.FeatureDataBundleInstance)</td>
  </tr>
</table>

## Description

The Bundle provides a grid view for WFS featuredata. It is responsible to getting the data from the server, parsing it and showing it.

## TODO

- filtering features
- multiple tabs handling when they dont fit the screen
- userguide popup handling

## Screenshot

![screenshot](<%= docsurl %>images/featuredata.png)

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>userinterface.AddExtensionRequest</td><td> Register as part of the UI in start()-method</td>
  </tr>
  <tr>
    <td>Toolbar.AddToolButtonRequest</td><td> Requests selection toolbar button</td>
  </tr>
  <tr>
    <td> userinterface.RemoveExtensionRequest </td><td> Unregister from the UI in stop()-method</td>
  </tr>
  <tr>
    <td> HighlightMapLayerRequest </td><td> Requests that a layer is "highlighted" (old mechanic) so highlighting and feature selection will occur using this layer. Sent when a tab is selected (tab presents one layers data)</td>
  </tr>
  <tr>
    <td> DimMapLayerRequest </td><td> Requests that highlighting is removed from a layer (old mechanic) so highlighting and feature selection will be disabled on this layer. Sent when a tab is unselected/removed (tab presents one layers data).</td>
  </tr>
  <tr>
    <td> userguide.ShowUserGuideRequest </td><td> Used to show additional data that wouldn't fit the normal grid. A link is shown instead on grid and clicking the link will open the additional data on user guide "popup".</td>
  </tr>
</table>

## Events the bundle listens to

<table>
<tr>
  <th> Event </th><th> How does the bundle react</th>
</tr>
<tr>
  <td> AfterMapLayerAddEvent </td><td> A tab panel is added to the flyout for the added layer.</td>
</tr>
<tr>
  <td> AfterMapLayerRemoveEvent </td><td> Tab panel presenting the layer is removed from the flyout.</td>
</tr>
<tr>
  <td> AfterMapMoveEvent </td><td> Grid data is updated if the flyout is open. Data is only updated for the layer whose tab is currently selected.</td>
</tr>
<tr>
  <td> WFSFeaturesSelectedEvent </td><td> Highlights the feature on the grid.</td>
</tr>
<tr>
  <td> userinterface.ExtensionUpdatedEvent </td><td> Determines if the layer was closed or opened and enables/disables data updates accordingly.</td>
</tr>
</table>

## Events the bundle sends out

<table>
  <tr>
    <th> Event </th><th> When it is triggered/what it tells other components</th>
  </tr>
  <tr>
    <td> WFSFeaturesSelectedEvent </td><td> Sent when a selection is made on the grid to notify other components that a feature has been selected</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
  <tr>
    <td> [Backend API](<%= docsurl %>backend/featuredata.html) </td>
    <td> N/A </td>
    <td> Feature data provider</td>
  </tr>
  <tr>
    <td> [Oskari toolbar](<%= docsurl %>framework/toolbar.html) </td>
    <td> Expects to be present in application setup </td>
    <td> To register plugin to toolbar</td>
  </tr>
</table>
