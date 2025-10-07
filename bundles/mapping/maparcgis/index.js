import './domain/ArcGisLayer';
import './domain/ArcGis93Layer';
import './plugin/ArcGisLayerPlugin.ol';

// register create function for bundleid
Oskari.bundle('maparcgis', () => {
    return {
        // no-op, this just registers arcgislayer support to be available for mapmodule to use
        start: () => {}
    };
});
