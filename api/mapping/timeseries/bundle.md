# Timeseries

- Adds generalized timeseries UI that any other bundle can use with TimeseriesService
- Adds support for registering layer animation implementations with TimeseriesLayerService (via TimeseriesService)
- Adds implementation for animating WMS layers (via TimeseriesLayerService)

## Screenshot

![Timeseries](timeseries.png)

## Description

Bundles that handle timeseries data/functionality can register with TimeseriesService when they want to show a timeseries control UI. Only one timeseries control UI can be visible at once and TimeseriesService keeps track which one should be visible based on priority. Of different things that can have timeseries UI, layers have the lowest priority.

Bundles that define a new layer type, and which want to support animation, must register a class that will be instantiated for each timeseries enabled layer to implement the animation. This bundle itself registers a animator for "WMS" layers.

## Example - general case

Bundle that wants to show timeseries control UI can register with TimeseriesService:

```javascript
var timeseriesService = sandbox.getService('Oskari.mapframework.bundle.timeseries.TimeseriesService');

var id = 'sivcgeu'; // should be unique within "type"
var type = 'myTypeOfThing'; // arbitrary type for id
var priority = 23; // priority of registered thing, one with lowest priority across all registred things will be shown UI. Additionally type "layer" has lower priority than all other types
var delegate = ...; // Istance of a class that implements Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol. The UI communicates with your timeseries implementation via the delegate. Each separate "thing" that has timeseries state should have their own delegate instance that is registered to timeseriesService

timeseriesService.registerTimeseries(id, type, priority, delegate);

```

And when the bundle wants to remove UI from view:

```javascript
timeseriesService.unregisterTimeseries(id, type);
```

## Example - new layer type

If the bundle wants to add support for timeseries functionality for a certain layer type (AbstractLayer.getLayerType()):


```javascript
var timeseriesLayerService = sandbox.getService('Oskari.mapframework.bundle.timeseries.TimeseriesLayerService');
timeseriesLayerService.registerLayerType('<type>', '<fully qualified class name>');

```

After registering the new type, TimeseriesLayerService will create delegates automatically for any layers of the given type.

The class whose name is given must implement `Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol` and its first two constructor parameters must be `sandbox`, `layerId`. The class must be loaded as part of your bundle.

## Bundle configuration

No configuration is required.

## Bundle state

No statehandling has been implemented for the bundle.

## Events the bundle listens to

<table class="table">
  <tr>
    <th>Event</th><th>Why/when</th>
  </tr>
  <tr>
    <td> MapSizeChangedEvent </td><td> Resize timeseries UI to support different map window sizes </td>
  </tr>
  <tr>
    <td> AfterRearrangeSelectedMapLayerEvent </td><td>Show timeseries UI control for topmost timeseries enabled layer</td>
  </tr>
  <tr>
    <td> AfterMapLayerAddEvent </td><td>Show timeseries UI control for topmost timeseries enabled layer</td>
  </tr>
  <tr>
    <td> AfterMapLayerRemoveEvent </td><td>Show timeseries UI control for topmost timeseries enabled layer</td>
  </tr>
  <tr>
    <td> ProgressEvent </td><td>Track loading status of animating layer</td>
  </tr>
</table>
