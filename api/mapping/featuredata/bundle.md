# featuredata

## Description

The Bundle provides a grid view for vector layers' object data.

## Screenshot

![screenshot](featuredata_new.png)

## Bundle configuration

No configuration is required, but there's one possible configuration:

```javascript
{
  "selectionTools" : true
}
```

Setting selectionTools to true will add a new button to toolbar that opens a selection tool dialog. Using selection tools the user can select features by drawing point or area. Features that are inside or intersect the drawn area are selected.

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>Toolbar.AddToolButtonRequest</td><td> Requests selection toolbar button</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
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
  <td> DrawingEvent </td><td> When selection tools finish drawing a selection is performed by the drawn geometry.</td>
</tr>
<tr>
  <td> MapLayerEvent </td><td> When a vector layer is added the bundle adds a tool to the layer allowing to open featuredata grid from the map layers - flyout.</td>
</tr>
<tr>
  <td> MapLayerVisibilityChangedEvent </td><td> Remove or add the tab of the layer whose visibility has changed. If active layer is removed, activate one of the remaining layers or if the removed layer was the last one close the flyout.</td>
</tr>
<tr>
  <td> MapMoveStartEvent </td><td>Reset the loading status of all the vector layers for the loading progress indicator.</td>
</tr>
<tr>
  <td> WFSFeaturesSelectedEvent </td><td> Highlights the feature(s) on the grid.</td>
</tr>
<tr>
  <td> WFSStatusChangedEvent </td><td> Shows a loading/error indicator on UI based on vector layer process status changes.</td>
</tr>
</table>
