import './domain/Tiles3DLayer';
import './plugin/Tiles3DLayerPlugin';

// register create function for bundleid
Oskari.bundle('map3dtiles', () => {
    return {
        // no-op, this just registers 3dtiles support to be available for mapmodule to use
        start: () => {}
    };
});
