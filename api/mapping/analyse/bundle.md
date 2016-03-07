# analyse

## Description

Bundle manages analyse parameter and data setups, requests analyse execute actions and stores analyse results to DB through backend action route.

## Screenshot

![screenshot](analyse.png)

## Bundle configuration

No configuration is required.

## Bundle state

```javascript
state : {
  layerId : "<id of the analysis layer or WFS layer>",
  method : "<analyse method>",
  params : "<{buffer_size, intersector, aggregate_function}>",
  styles : "<{}>",
  propertymode : "<all|none|columns>",
  columns : "<column names, when propertymode is columns>"
}
```


## Requests the bundle sends out

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>`userinterface.AddExtensionRequest`</td><td>Extends the basic UI view.</td>
  </tr>
</table>

### Analyse view

<table class="table">
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>`userinterface.UpdateExtensionRequest`</td><td>Extends the basic UI view.</td>
  </tr>
  <tr>
    <td>`catalogue.ShowMetadataRequest`</td><td>layer metadata info request</td>
  </tr>
  <tr>
    <td>`DisableMapKeyboardMovementRequest`</td><td>for text input in flyout</td>
  </tr>
  <tr>
    <td>`EnableMapKeyboardMovementRequest`</td><td>for text input in flyout</td>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`userinterface.ExtensionUpdatedEvent`</td>
    <td>Enters/exits the analysis mode.</td>
  </tr>
  <tr>
    <td>`AfterMapLayerAddEvent`</td>
    <td>Refreshes the data panel</td>
  </tr>
  <tr>
    <td>`AfterMapLayerRemoveEvent`</td>
    <td>Refreshes the data panel</td>
  </tr>
</table>

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Version 1.7.1 assumed to be linked on the page</td>
    <td> Used to create the UI</td>
  </tr>
  <tr>
    <td> [OpenLayers](http://openlayers.org/) </td>
    <td> Expects OpenLayers already to be linked </td>
    <td> Temp feature drawing and selected geometry editing</td>
  </tr>
  <tr>
    <td> [Oskari mapmodule](/documentation/bundles/framework/mapmodule)</td>
    <td> Expects to be present in the application setup </td>
    <td> To gain control to OpenLayers map</td>
  </tr>
  <tr>
    <td> [Oskari mapanalysis](/documentation/bundles/framework/mapanalysis)</td>
    <td> Expects to be present in the application setup</td>
    <td> Needed to support the ANALYSIS layer type.</td>
  </tr>
</table>
