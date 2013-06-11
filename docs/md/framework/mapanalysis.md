# Map analysis

<table>
  <tr>
    <td>ID</td><td>mapAnalysis</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>docs/oskari/api/#!/api/Oskari.mapframework.bundle.mapanalysis.MapAnalysisBundleInstance)</td>
  </tr>
</table>

## Description

Adds support for analysis layers. The analysisLayerPlugin needs to be registered for the map in order to visualize analysis layers


## TODO

* Real functionality for visualization after the analyse storage is available

## Screenshot

![screenshot](<%= docsurl %>images/mapanalysis.png)

## Bundle configuration

```javascript
config : {
  ajaxUrl : [url]
}
```
* ajaxUrl defaults to sandbox.getAjaxUrl() + 'action_route=Get?'.

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.


## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

<table>
  <tr>
    <th>AfterMapLayerAddEvent</th><th> Real functionality NOT YET implemented</th>
    </tr>
    <tr>
    <th>AfterMapLayerRemoveEvent</th><th> Destroy map layer from a map</th>
     </tr>
    <tr>
    <th>AfterChangeMapLayerOpacityEvent</th><th>Real functionality  NOT YET implemented</th>
     </tr>
    <tr>
    <th>MapAnalysis.AnalysisVisualizationChangeEvent</th><th>Real functionality NOT YET implemented</th>
  </tr>
</table>

## Events the bundle sends out

<table>
  <tr>
    <th>analysisVisualizationChangeEvent</th><th>Sent when a analysis visualization has been changed - NOT YET implemented</th>
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
