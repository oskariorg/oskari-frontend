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

''Describe what the bundle does.''

## TODO

* ''List any planned features''

## Screenshot

![screenshot](<%= docsurl %>images/bundle_id.png)

## Bundle configuration

```javascript
"conf": {
  "queryUrl": "<url for WFS service (this is needed by DigiroadVectorLayerPlugin)>",
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
          "protocolOpts": "<options for the protocol (optional, by default uses what it can get from the layer, like featureType)>"
      }
  }
}
```

OR

No configuration is required.

## Bundle state

```javascript
state : {
  test : 2
}
```

OR

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
    <td>FeatureSelector.FeaturesAddedEvent</td><td>tbd</td>
  </tr>
  <tr>
    <td>FeatureSelector.FeaturesRemovedEvent</td><td>tbd</td>
  </tr>
  <tr>
    <td>AfterMapLayerAddEvent</td><td>tbd</td>
  </tr>
  <tr>
    <td>AfterMapLayerRemoveEvent</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't listen to any events.

## Events the bundle sends out

<table>
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td>tbd</td><td>tbd</td>
  </tr>
</table>

OR

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[Library name](#link)</td><td>src where its linked from</td><td>*why/where we need this dependency*</td>
  </tr>
</table>

OR

This bundle doesn't have any dependencies.
