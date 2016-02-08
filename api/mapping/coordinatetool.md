# Coordinate Display

<table class="table">
  <tr>
    <td>ID</td><td>coordinatetool</td>
  </tr>
  <tr>
    <td>API</td><td>[link](/api/latest/classes/Oskari.mapframework.bundle.coordinatetool.CoordinateToolBundleInstance.html)</td>
  </tr>
</table>

## Description

This bundle provides a plugin (Oskari.mapframework.bundle.coordinatetool.plugin.CoordinateToolPlugin) for mapmodule that can:
* shows coordinates on mouse location
* shows coordinates on mouse map click
* center map to given coordinates


## Screenshot

![screenshot](/images/bundles/coordinatetool.png)


## Bundle configuration

No configuration is required, but there is one possible configuration:

```javascript
{
  "roundToDecimals" : 2
}
```

Setting roundToDecimals to wanted number will coordinates rounded by wanted decimal plates. 

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table class="table">
  <tr>
    <th> Request </th><th> Where/why it's used</th>
  </tr>
  <tr>
    <td>`MapMoveRequest`</td><td> Move map to selected coordinates.</td>
  </tr>
</table>


## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>`MouseHoverEvent`</td><td>Updates the coordinates gotten from event to the UI.</td>
  </tr>
  <tr>
    <td>`AfterMapMoveEvent`</td><td>Updates the updated coordinates for map center.</td>
  </tr>
  <tr>
    <td>`MapClickedEvent`</td><td>Updates the coordinates gotten from event to the UI.</td>
  </tr>
  <tr>
    <td>`Publisher.ColourSchemeChangedEvent`</td><td>Updates the UI colour schema from event.</td>
  </tr>
  <tr>
    <td>`Publisher2.ColourSchemeChangedEvent`</td><td>Updates the UI colour schema from event.</td>
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
