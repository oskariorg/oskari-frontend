# timeseries

Adds time dimension support for wms and wmts layer.

## Description

Defines a timeseries playback ui. The ui is visible when layer where have a time dimension is added to map.

## Screenshot

![Timeseries](timeseries.png)

## Bundle configuration

No configuration is required, but it can be used to customize animotion speen in milliseconds. If not set, animation speed will be 4000 ms.

```javascript
{
  "animationSpeed" : 3000
}
```

## Bundle state

No statehandling has been implemented for the bundle.

## Requests the bundle sends out

<table class="table">
<tr>
  <th> Request </th>
  <th> Where/why it's used</th>
</tr>
<tr>
  <td> `MapModulePlugin.MapLayerUpdateRequest` </td>
  <td> Updates layers time parameter </td>
</tr>
</table>

## Events the bundle sends out

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <th>TimeseriesAnimationEvent</th><th>Is sent out when timeseries animation advances or is stopped</th>
  </tr>
</table>

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> MapLayerEvent </td><td> Check timeseries playback UI visibility</td>
  </tr>
  <tr>
    <td> MapSizeChangedEvent </td><td> Build timeseries UI again to support different map window sizes </td>
  </tr>
  <tr>
    <td> AfterMapLayerAddEvent </td><td>Shows timeseries playback UI if added layer have time dimension </td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td>Remove timeseries playback UI from map if removed layer is same than animated layer</td>
  </tr>
  <tr>
    <td> ProgressEvent </td><td>Track loading status of animating layer</td>
  </tr>
    <tr>
    <td> TimeseriesAnimationEvent </td><td>The bundle sends out and listens to this event. It is used to update timeseries control UI.</td>
  </tr>
</table>
