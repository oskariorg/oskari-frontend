# myplaces

Allows users to draw geographic features on the map.

## Description

My places functionality.

## Bundle configuration

No configuration required

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>DrawPlugin.StartDrawingRequest</td><td>Returns drawing as a callback parameter</td>
  </tr>
  <tr>
    <td>DrawPlugin.StartDrawingRequest</td><td>Tells drawing plugin to start listening</td>
  </tr>
  <tr>
    <td>DrawPlugin.StopDrawingRequest</td><td>Tells drawing plugin to stop listening</td>
  </tr>
  <tr>
    <td>MyPlaces.EditCategoriesRequest</td><td>Edit category</td>
  </tr>
  <tr>
    <td>MyPlaces.DeleteCategoryRequest</td><td>Shows the corfirm delete -functionality</td>
  </tr>
  <tr>
    <td>MyPlaces.PublishCategoryRequest</td><td>Shows the corfirm publish -functionality</td>
  </tr>
  <tr>
    <td>MyPlaces.EditPlacesRequest</td><td>Shows place form</td>
  </tr>
</table>

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapModulePlugin.GetFeatureInfoActivationRequest</td><td></td>
  </tr>
</table>

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

<table class="table">
  <tr>
    <th> Event </th><th> When it is triggered/what it tells other components</th>
  </tr>
  <tr>
    <td> DrawPlugin.AddedFeatureEvent </td><td> Sent when a feature has been added</td>
  </tr>
  <tr>
    <td> DrawPlugin.FinishedDrawingEvent </td><td> Sent when a drawing has been finished</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[Library name](#link)</td><td>src where its linked from</td><td>*why/where we need this dependency*</td>
  </tr>
</table>

OR

This bundle doesn't have any dependencies.
