# statsgrid2016

Statistics data display. This will replace the statsgrid bundle specification when the implementation has the comparable functionalities as the current one. The bundle depends on mapstats-bundle that provides support for statslayer layertype.

## Description

The bundle is used to display and manage statistics data from multiple datasources. It uses maplayers of type statslayer (support provided by mapstats bundle) as regionsets and configuration should provide available datasources. Common dataformat is used to read indicator listings, metadata and actual statistics data from the server. Regions in regionsets are based on the the statslayers and mapping to regions data for statistics data is handled by the server side implementation.

Indicator selector, regionset selector and a datagrid with the indicator data are shown in a flyout. Also manages the statistics data state that is used by mapstats to visualize the data on map.

## TODO

* add region selection and highlighting in map
* add region filtering
* add tooltip to map regions with indicator data

## Bundle configuration

```javascript
{
        "sources": [{
          "id": 1,
          "name": "SotkaNET",
          "type": "system"
        }, {
          "id": 2,
          "name": "KHR",
          "type": "system"
        }],
        "grid": true,
        "allowClassification" : true,
        "vectorViewer": true
      }
```

* `sources` is required and describes the available datasources. Each datasource have their own indicator listings etc so any reference to indicator must include reference to the datasource the indicator is located in.
* `grid` is optional and defaults to true. Toggles if the datatable should be shown
* `allowClassification` is optional and defaults to true. Toggles if the user can change the classification for the data.
* `vectorViewer` is optional and default to false. Shows region on the map the vector format.


## Bundle state

```javascript
 {
     "indicators": [{
         "ds": 1,
         "id": 5,
         "selections": {
             "sex": "male",
             "year": "1991"
         },
         classification : {
          ...
         }
       }
     }, {
         "ds": 1,
         "id": 6,
         "selections": {
             "sex": "male",
             "year": "1994"
         }
     }],
     "regionset": 7,
     "active": "1_6_{\"sex\":\"male\",\"year\":\"1994\"}",
     "view" : true
 }
```

* `indicators` lists any indicators the user has selected with the parameters (selections) that were used when the indicator was selected. DS refers to datasource and id to indicator id in that datasource. Selections vary between datasources and indicators. Classification is the color options and other classification details for the indicator.
* `regionset` is the id of the statslayer that is currently used as a regionset
* `active` is a "serialized hash" that is used internally to refer to one indicator in the state.indicators list.
* `view` is a boolean where true means that the datagrid (flyout) should be shown when the bundle is started. With false the map will render the active indicator but the flyout is closed.

## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>userinterface.AddExtensionRequest</td><td> Registers as part of the UI </td>
  </tr>
  <tr>
    <td>userinterface.UpdateExtensionRequest</td><td> To open and close the UI programmatically on state change/UIChangeEvent</td>
  </tr>
</table>


## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>userinterface.ExtensionUpdatedEvent</td>
    <td>Enters/exits the statistics mode.</td>
  </tr>
  <tr>
    <td>UIChangeEvent</td>
    <td>Removes the statsgrid UI from the screen when this event is received.</td>
  </tr>
  <tr>
    <td>StatsGrid.IndicatorEvent</td>
    <td>UI grid is updated based on the event.</td>
  </tr>
  <tr>
    <td>StatsGrid.RegionsetChangedEvent</td>
    <td>UI grid is updated based on the event.</td>
  </tr>
  <tr>
    <td>StatsGrid.RegionSelectedEvent</td>
    <td>UI grid is updated based on the event. The corresponding row is highlighted.</td>
  </tr>
  <tr>
    <td>StatsGrid.ActiveIndicatorChangedEvent</td>
    <td>UI grid is updated based on the event. The corresponding column is highlighted.</td>
  </tr>
  <tr>
    <td>StatsGrid.ClassificationChangedEvent</td>
    <td>Updates legend (and map with mapstats) when classification is changed.</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> Oskari mapmodule</td>
    <td> Expects to be present in the application setup </td>
    <td> To control maplayers as regionsets via requests </td>
  </tr>
  <tr>
    <td> Oskari mapstats </td>
    <td> Expects to be present in the application setup </td>
    <td> Provides support for statslayer layertype which are used as regionsets </td>
  </tr>
  <tr>
    <td> Oskari divmanazer</td>
    <td> Expects to be present in the application setup </td>
    <td> For basic UI components </td>
  </tr>
  <tr>
    <td> [geostats](https://github.com/simogeo/geostats)</td>
    <td> Internally linked from /Oskari/libraries/geostats</td>
    <td> Needed for the classifications of the data</td>
  </tr>
</table>
