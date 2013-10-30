# StatsGrid

<table>
  <tr>
    <td>ID</td><td>statsgrid</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>link/here)</td>
  </tr>
</table>

## Description

Bundle fetches data from the SotkaNET statistics and indicator bank (www.sotkanet.fi) and displays the data in a grid and visualizes it on the map. Users can select different indicators from a menu and classify the data in multiple ways, including specifying class breaks by hand (manual breaks).

The grid and the classifier are initialized as plugins so they can be used individually as well. They both use the StatisticsService to send events and make the actual AJAX calls to fetch the data.

Grid section: selected municipalities will be visualized on the map.
Map section: selected municipalities are hilighted in the grid.
Select hilighted mode: selected municipalities (map) are also selected in the grid.

## TODO

* remove hilighted borders when going away from select hilighted mode
* selected grid items should be sent somehow to statsplugin.

## Screenshot

![screenshot](<%= docsurl %>images/bundle_id.png)

## Bundle configuration

Enabling tile:
```javascript
config : {
  "tileClazz": "Oskari.statistics.bundle.statsgrid.Tile",
  "defaultLayerId": 274
}
```

* defaultLayerId is optional, first registered layer of type 'STATS' will be used if not configured
* tileClazz is optional and will add a tile to menu for easier access if configured

Configuration for `ManageStatsPlugin`:
```javascript
config : {
  state : "<following keys are the same as in bundle state: layerId, indicators, currentColumn (optional, defaults to an empty object)>",
  layer : "<id of the layer where the visualizations should be applied to (optional, defaults to null)>",
  published : "<true for a published map so the indicators selection is not included (optional, defaults to false)>"
}
```

## Bundle state

```javascript
state : {
  layerId : "<id of the stats layer>",
  indicators : "<array of indicators>",
  currentColumn : "<selected indicator>",
  methodId : "<id of the selected classification method>",
  numberOfClasses : "<number of classification classes>",
  manualBreaksInput : "<input string for the manual breaks classification method>"
}
```

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>StatsGrid.StatsGridRequest</td>
    <td>Enables/disables the statistics mode depending on the params.</td>
  </tr>
  <tr>
    <td>StatsGrid.TooltipContentRequest</td>
    <td>Sends tooltip info for currently hovered municipality.</td>
  </tr>
</table>

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>userinterface.AddExtensionRequest</td><td>Extends the basic view.</td>
  </tr>
</table>

### ManageStatsPlugin

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapModulePlugin.MapLayerVisibilityRequest</td><td>Shows/hides the layer when necessary.</td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>userinterface.ExtensionUpdatedEvent</td>
    <td>Enters/exits the statistics mode.</td>
  </tr>
  <tr>
    <td>MapStats.StatsVisualizationChangeEvent</td>
    <td>Saves params from the event to the bundle state.</td>
  </tr>
  <tr>
    <td>AfterMapMoveEvent</td>
    <td>Updates parameters for the printout bundle.</td>
  </tr>
  <tr>
    <td>AfterMapLayerRemoveEvent</td>
    <td>Exits the statistics mode.</td>
  </tr>
</table>

### ManageClassificationsPlugin

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>MapLayerEvent</td>
    <td>Shows the classification UI</td>
  </tr>
  <tr>
    <td>AfterMapLayerRemoveEvent</td>
    <td>Removes the classification UI</td>
  </tr>
  <tr>
    <td>AfterMapLayerAddEvent</td>
    <td>Shows the classification UI</td>
  </tr>
  <tr>
    <td>MapLayerVisibilityChangedEvent</td>
    <td>Shows/removes the classification UI depending on the param</td>
  </tr>
  <tr>
    <td>StatsGrid.SotkadataChangedEvent</td>
    <td>Classifies the data and sends an event to visualize it on the map</td>
  </tr>
  <tr>
    <td>StatsGrid.SelectHilightsModeEvent</td>
    <td>Activates mode (isSelectHilightedMode)</td>
  </tr>
  <tr>
    <td>StatsGrid.ClearHilightsEvent</td>
    <td>Deactivates mode (isSelectHilightedMode)</td>
  </tr>
</table>

### ManageStatsPlugin

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>MapStats.FeatureHighlightedEvent</td>
    <td>Highlights the given feature in the grid.</td>
  </tr>
</table>

## Events the bundle sends out

### StatisticsService

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapStats.StatsVisualizationChangeEvent</td>
    <td>After new data has been fetched from the sotkanet service so it can be classified</td>
  </tr>
  <tr>
    <td>MapStats.StatsVisualizationChangeEvent</td>
    <td>After the data has been classified so it can be visualized on the map</td>
  </tr>
</table>

### ManageStatsPlugin

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>MapStats.HoverTooltipContentEvent</td>
    <td>When the TooltipContentRequest is handled to send the tooltip info to the mapstats bundle.</td>
  </tr>
</table>

### StatsToolbar

<table>
  <tr>
    <td>StatsGrid.SelectHilightsModeEvent</td>
    <td>Activates mode (isSelectHilightedMode)</td>
  </tr>
  <tr>
    <td>StatsGrid.ClearHilightsEvent</td>
    <td>Deactivates mode (isSelectHilightedMode)</td>
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
    <td> Expects to be present in the application setup </td>
    <td> To gain control to OpenLayers map</td>
  </tr>
  <tr>
    <td> [Oskari mapstats](<%= docsurl %>framework/mapstats.html)</td>
    <td> Expects to be present in the application setup</td>
    <td> Needed to support the STATS layer type.</td>
  </tr>
  <tr>
    <td> [geostats](http://www.empreinte-urbaine.eu/mapping/geostats/)</td>
    <td> Linked dynamically from /Oskari/libraries/geostats</td>
    <td> Needed for the classifications of the data</td>
  </tr>
</table>
