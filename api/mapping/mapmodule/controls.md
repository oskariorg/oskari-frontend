# Controls

## Description

ControlsPlugin adds zoombox, measure, keyboard and mouse controls to the map.

## Bundle configuration

Map controls are configurable - setting the control values as false the control is not added. All controls are added by default if not explicitly configured.

```javascript
{
  "conf": {
    "zoomBox" : false,
    "measureControls" : false,
    "keyboardControls" : false,
    "mouseControls" : false
  }
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

<table class="table">
  <tr>
    <th>Request</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>ToolSelectionRequest</td><td>Activates requested control</td>
  </tr>
  <tr>
    <td>EnableMapKeyboardMovementRequest</td><td>Enables keyboard movement (if it isn't configured otherwise)</td>
  </tr>
  <tr>
    <td>DisableMapKeyboardMovementRequest</td><td>Disables keyboard movement</td>
  </tr>
  <tr>
    <td>EnableMapMouseMovementRequest</td><td>Enables mouse movement (if it isn't configured otherwise)</td>
  </tr>
  <tr>
    <td>DisableMapMouseMovementRequest</td><td>Disables mouse movement</td>
  </tr>
</table>


## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>Toolbar.ToolSelectedEvent</td><td>Disables zoom/measure controls</td>
  </tr>
</table>


## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table class="table">
  <tr>
    <th>Dependency</th><th>Linked from</th><th>Purpose</th>
  </tr>
  <tr>
    <td> [Oskari mapmodule](/documentation/bundles/framework/mapmodule) </td>
    <td> Expects to be present in application setup </td>
    <td> Controls will be added to map module </td>
  </tr>
</table>

