# Updating dependencies

List of some recognized fragile points on the code that could break when updating dependencies.

## OpenLayers

See notes: https://github.com/openlayers/openlayers/releases

Timeseries implementation tries to preload the "next" image to be shown (the next "time" on the timeseries) for showing WMS-T layers and tinkers with some internals of OpenLayers: https://github.com/oskariorg/oskari-frontend/pull/2732

## Cesium

See notes:
- https://github.com/CesiumGS/cesium/releases
- https://github.com/CesiumGS/cesium/blob/main/CHANGES.md

On Oskari 2.14 cesium was switched to @cesium/engine as we aren't using the widgets part. However it seems it's more difficult to track the changes on the engine as changelog describes the "full release" of everything cesium (or more difficult to track which version of engine is used on which Cesium release).

The engine version can be found here: https://github.com/CesiumGS/cesium/blob/1.123.1/packages/engine/package.json#L3 (when cesium version is 1.123.1).

## ol-cesium

Maintained under openlayers and acts as glue between cesium and OpenLayers. We can use most of OpenLayers API while showing data on Cesium.

Support for OpenLayers 10.x added in this change https://github.com/openlayers/ol-cesium/commit/fa317f96d1621c4bce17482a581de82eb83c9517

## AntD

Usually styles tend to break when updating AntD. However in the 5.x version AntD introduced theming using props on components. This might make it easier to update.
