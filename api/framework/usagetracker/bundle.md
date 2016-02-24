# usagetracker

Pings the server when any of the configured events occur.

## Description

A configurable event-based usage tracker. When Events fire, the currect state is sent with an ajax GET to the configured logUrl.

## Bundle configuration

```javascript
"conf": {
  "logUrl" : "http://localhost:8080/logger",
  "events" : ["AfterMapMoveEvent",
            "AfterMapLayerAddEvent",
            "AfterMapLayerRemoveEvent",
            "MapLayerVisibilityChangedEvent"]
}
```

## Events the bundle listens to

This bundle listen to all configured events. No events by default.

## Dependencies

<table class="table">
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
</table>