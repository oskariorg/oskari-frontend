# coordinatedisplay

## Description

This bundle provides a plugin (Oskari.mapframework.bundle.coordinatedisplay.plugin.CoordinatesPlugin) for mapmodule that shows coordinates on mouse location.

## Screenshot

![screenshot](coordinatedisplay.png)


## Bundle configuration

## Bundle configuration

No configuration is required, but there is one possible configuration:

```javascript
{
  "roundToDecimals" : 2
}
```

Setting roundToDecimals to wanted number will coordinates rounded by wanted decimal plates. 

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
</table>

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
