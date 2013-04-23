# Feature Selector

<table>
  <tr>
    <td>ID</td><td>digiroad-featureselector</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>docs/oskari/api/#!/api/Oskari.digiroad.bundle.featureselector.FeatureSelectorBundleInstance)</td>
  </tr>
</table>

## Description

Bundle adds a grid to display features fetched via WFS or some other protocol supported by OpenLayers. Users can then view the features and edit them.

Features get added to the grid when the user clicks on the map. Alt key can be used to draw a rectangle which selects all features intersecting with the box and control key can be used to select multiple features and toggling selected features.

## TODO

* State handling

## Screenshot

![screenshot](<%= docsurl %>images/digiroad-featureselector.png)

## Bundle configuration

```javascript
"conf": {
  "queryUrl": "<url for WFS/other feature service (this is needed by DigiroadVectorLayerPlugin)>",
  "targetLayers": {
      "<layer id of a WMS layer>": {
          "objectId": "<the id field of the features>",
          "geometryName": "<geometry name of the features (optional, defaults to 'the_geom')>",
          "headers": [{
              "id": "<unique id used by the grid>",
              "name": "<name to display to users>",
              "field": "<corresponding field of a feature>",
              "editor": "<'integer', 'text' or 'select' (optional, if not specified, the data field is not editable)>"
          }],
          "protocolType": "<the type of the protocol used to fetch the features (optional, defaults to 'WFS')>",
          "protocolOpts": "<options for the protocol (optional, by default uses what it can get from the WMS layer, like featureType)>"
      }
  }
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>tbd</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>tbd</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't send out any requests.

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>AfterMapLayerAddEvent</td><td>If the layer is a WMS layer and it has been defined in config (in targetLayers), it creates a grid to the flyout. It also creates a vector layer (for adding features on the layer) and adds it to the map.</td>
  </tr>
  <tr>
    <td>AfterMapLayerRemoveEvent</td><td>Removes all the features bound to the layer and removes the grid from the flyout. Also destroys the created vector layer.</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesAddedEvent</td><td>Adds the features sent by the event to the grid and binds a hover event to them.</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesRemovedEvent</td><td>Removes the features sent by the event from the grid.</td>
  </tr>
</table>

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesAddedEvent</td><td>DigiroadVectorLayerPlugin sends this event when the user clicks on the map to select features.</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesRemovedEvent</td><td>DigiroadVectorLayerPlugin sends this event when the user clicks on an empty spot on the map or uses the control key on a feature which has been selected already (toggle).</td>
  </tr>
  <tr>
    <td>FeatureHighlightEvent</td><td>Upon moving the mouse cursor over a feature in the grid this event gets sent. It has a type which can be either 'highlight' or 'unHighlight'.</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeatureEditedEvent</td><td>Triggered when the user double clicks a cell in the grid, enter a new value and presses enter.</td>
  </tr>
</table>

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked (on page locally in portal) </td>
    <td> Used to handle map element sizing </td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already linked </td>
    <td> Not used directly but a MapModule dependency </td>
  </tr>
  <tr>
    <td> [SlickGrid](https://github.com/mleibman/SlickGrid) </td>
    <td> Assumed to be linked </td>
    <td> Uses SlickGrid for rendering the features. </td>
  </tr>
  <tr>
    <td> [Oskari divmanazer](<%= docsurl %>framework/divmanazer.html) </td>
    <td> DivManazerBundle </td>
    <td> Provides flyout/tile functionality</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> To initialize and show the map on UI </td>
  </tr>
  <tr>
    <td> [Oskari mapmodule plugins](<%= docsurl %>framework/mapmodule.html) </td>
    <td> Expects to be present in application setup </td>
    <td> Any bundle providing a map plugin referenced in config needs to be loaded before starting this bundle </td>
  </tr>
</table>
