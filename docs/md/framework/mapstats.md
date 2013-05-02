# Map Stats

<table>
  <tr>
    <td>ID</td><td>mapstats</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapstats.MapStatsBundleInstance)</td>
  </tr>
</table>

## Description

Adds support for statistics layers. The StatsLayerPlugin needs to be registered for the map in order to visualize statistics.


## TODO

* ''Remove hard-coded properties, e.g. kuntakoodi.''

## Screenshot

![screenshot](<%= docsurl %>images/mapstats.png)

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

This bundle doesn't send out any requests.

## Events the bundle listens to

This bundle doesn't listen to any events.

## Events the bundle sends out

<table>
  <tr>
    <th>StatsVisualizationChangeEvent</th><th>Sent when a statistics visualization has been changed</th>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already to be linked </td>
    <td> To modify map</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html)</td>
    <td> Expects to be present in application setup </td>
    <td> To gain control to OpenLayers map</td>
  </tr>
</table>
