# Realtime Plugin

<table>
  <tr>
    <td>ID</td>
    <td>Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin</td>
  </tr>
  <tr>
    <td>API</td>
    <td>[link](<%= apiurl %>Oskari.mapframework.bundle.mapmodule.plugin.RealtimePlugin.html)</td>
  </tr>
</table>

## Description

Plugin implements functionality for real time layers. It refreshes the map periodically for each real time layer.

## TODO

* Should update the GFI dialog as well

## Bundle configuration

By default, minimum refresh rate is configured to 1000 milliseconds and no maximum value is set. Also, no layer types are ignored. Those can be overridden with a config:

```json
{
  // Both in milliseconds
  "minRefreshRate": 5000,
  "maxRefreshRate": 60000,
  // Array of types
  "ignoredLayerTypes": ['WFS']
}
```

## Bundle state

No statehandling has been implemented.

## Requests the bundle handles

This bundle doesn't handle any requests.

## Requests the bundle sends out

<table>
  <tr>
    <th>Request</th>
    <th>Why/when</th>
  </tr>
  <tr>
    <td>MapModulePlugin.MapLayerUpdateRequest</td>
    <td>Sent in itervals for each realtime layer to update the map.</td>
  </tr>
</table>

## Events the bundle listens to

<table>
  <tr>
    <th>Event</th><th>How does the bundle react</th>
  </tr>
  <tr>
    <td>AfterMapLayerAddEvent</td>
    <td>Sets the interval to send update requests to refresh the map</td>
  </tr>
  <tr>
    <td>AfterMapLayerRemoveEvent</td>
    <td>Removes the interval for the layer</td>
  </tr>
  <tr>
    <td>MapLayerEvent</td>
    <td>Updates the refresh rate for the updated layer</td>
  </tr>
  <tr>
    <td>MapLayerVisibilityChangedEvent</td>
    <td>Removes the interval for the layer</td>
  </tr>
  <tr>
    <td>AfterMapMoveEvent</td>
    <td>Resets the interval for each visible real time layer</td>
  </tr>
</table>

## Events the bundle sends out

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
