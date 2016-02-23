# Map Stats

## Description

Adds support for statistics layers. The StatsLayerPlugin needs to be registered for the map in order to visualize statistics.

## TODO

* Remove hard-coded properties, e.g. `kuntakoodi`.

## Bundle configuration

```javascript
config : {
  ajaxUrl : [url]
}
```
* ajaxUrl defaults to sandbox.getAjaxUrl() + 'action_route=GetStatsTile'.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

### StatsLayerPlugin

<table class="table">
  <tr>
    <th>StatsGrid.TooltipContentRequest</th>
    <th>Requests to get content for the hover tooltip.</th>
  </tr>
</table>

## Events the bundle listens to

### StatsLayerPlugin

<table class="table">
  <tr>
    <th>MapStats.HoverTooltipContentEvent</th>
    <th>Sets the content of the hover tooltip</th>
  </tr>
</table>

## Events the bundle sends out

<table class="table">
  <tr>
    <th>StatsVisualizationChangeEvent</th><th>Sent when a statistics visualization has been changed</th>
  </tr>
</table>

### StatsLayerPlugin

<table class="table">
  <tr>
    <th>MapStats.FeatureHighlightedEvent</th>
    <th>Sent when an are (municipality) is clicked on the map.</th>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already to be linked </td>
    <td> To modify map</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](/documentation/bundles/framework/mapmodule)</td>
    <td> Expects to be present in application setup </td>
    <td> To gain control to OpenLayers map</td>
  </tr>
</table>
