import './domain/MyPlacesLayer';
import './plugin/MyPlacesLayerPlugin.ol';

// register create function for bundleid
Oskari.bundle('mapmyplaces', () => {
    return {
        // no-op, this just registers myplaces support to be available for mapmodule to use
        start: () => {}
    };
});
