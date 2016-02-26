# LaKaPa Layer Selector

<table class="table">
  <tr>
    <td>ID</td><td>Lakapa-Layer-Selector</td>
  </tr>
</table>

## Description

This bundle provides a layer selector tool.

## Screenshot

![screenshot](lakapalayerselector.png)


## Bundle configuration

No configuration is required, but it can be used to set group orders.

```javascript
"orders": {
      "regional divisions": 5,
      "background map": 6,
      "digiroad": 4,
      "maritime transport": 0,
      "beta": 3,
      "road traffic": 2,
      "rail traffic": 1
    }
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out


<table class="table">
  <tr>
    <th>Request</th><th>Where/why it's used</th>
  </tr>
  <tr>
    <td>`catalogue.ShowMetadataRequest`</td><td>Show metadata</td>
  </tr>
  <tr>
    <td>`AddMapLayerRequest`</td><td>Add layer to map</td>
  </tr>
  <tr>
    <td>`RemoveMapLayerRequest`</td><td>Remove layer from map</td>
  </tr>
  <tr>
    <td>`ShowMapLayerInfoRequest`</td><td>Show map layer info</td>
  </tr>
  <tr>
    <td>`userinterface.AddExtensionRequest`</td><td>Register as part of the UI in start()-method.</td>
  </tr>
  <tr>
    <td>`userinterface.RemoveExtensionRequest`</td><td>Unregister from the UI in stop()-method.</td>
  </tr>
</table>


## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`userinterface.ExtensionUpdatedEvent`</td>
    <td>Listens to `lakapa-layerselector2` Flyout opens/closes</td>
  </tr>
</table>

## Events the bundle sends out

This bundle doesn't send any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td>[jQuery](http://api.jquery.com/)</td>
    <td>Assumes to be linked in the page</td>
    <td>Used to create the component UI from begin to end</td>
  </tr>
</table>
