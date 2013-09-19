# UsageTracker

<table>
  <tr>
    <td>ID</td><td>usagetracker</td>
  </tr>
  <tr>
    <td>API</td><td>[link](<%= apiurl %>Oskari.mapframework.bundle.usagetracker.UsageTrackerBundleInstance.html)</td>
  </tr>
</table>

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

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

This bundle doesn't send out any requests.

## Events the bundle listens to

This bundle listen to all configured events. No events by default.

## Events the bundle sends out

This bundle doesn't send out any events.

## Dependencies

<table>
  <tr>
    <th> Dependency </th><th> Linked from </th><th> Purpose </th>
  </tr>
  <tr>
    <td> [jQuery](http://api.jquery.com/) </td>
    <td> Linked in portal theme </td>
    <td> Used to create the component UI from begin to end</td>
  </tr>
</table>