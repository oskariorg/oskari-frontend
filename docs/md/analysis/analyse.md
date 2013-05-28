# Analyse

<table>
  <tr>
    <td>ID</td><td>analyse</td>
  </tr>
  <tr>
    <td>API</td><td>[link here](<%= apiurl %>link/here)</td>
  </tr>
</table>

## Description

Bundle manages analyse parameter and data setups, requests analyse execute actions and stores analyse results to DB through backend action route


## TODO

* ONLY parameter adn data setup management is finalized 

## Screenshot

![screenshot](<%= docsurl %>images/analyse.png)

## Bundle configuration

Configuration for `/analyse/instance`:
```javascript
config : {
  state : "<not yet designed>"
}
```

## Bundle state

* NOT YET designed/implemented

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

## Requests the bundle handles

<table>
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>analyse.AnalyseRequest</td><td>NOT YET implemented</td>
  </tr>
</table>

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>userinterface.AddExtensionRequest</td><td>Extends the basic UI view.</td>
  </tr>
</table>

### StartAnalyse

<table>
  <tr>
    <th>Request</th><th>Why/when</th>
  </tr>
  <tr>
    <td>userinterface.UpdateExtensionRequest</td><td>Extends the basic UI view.</td>
    <td>catalogue.ShowMetadataRequest</td><td>layer metadata info request</td>
    <td>DisableMapKeyboardMovementRequest</td><td>for text input in flyout</td>
    <td>EnableMapKeyboardMovementRequest</td><td>for text input in flyout</td>
  </tr>
</table>

### Plugins (not yet implemented)



## Events the bundle listens to  (not all events yet)

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>userinterface.ExtensionUpdatedEvent</td>
    <td>Enters/exits the analysis mode.</td>
  </tr>
</table>



## Events the bundle sends out 

### 


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
    <td> [Oskari mapstats](<%= docsurl %>framework/mapanalysis.html)</td>
    <td> Expects to be present in the application setup</td>
    <td> Needed to support the STATS layer type.</td>
  </tr>
</table>
