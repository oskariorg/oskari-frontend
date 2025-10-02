import './mapmodule.ol';

// register create function for bundleid
Oskari.bundle('mapmodule', () => {
    return {
        // no-op, this just registers mapmodule to be available for mapfull to use
        start: () => {}
    };
});
