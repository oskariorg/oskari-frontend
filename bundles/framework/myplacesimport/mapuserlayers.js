import '../../mapping/mapuserlayers/domain/UserLayer';
import '../../mapping/mapuserlayers/plugin/UserLayersLayerPlugin.ol';

// Note! This is being replaced by myfeatures AND is done a bit different than other bundles, because
//  the new loader automatically detects localizations relative to this file. As mapping/mapuserlayers
//  uses localizations from this bundle: This is the way they are picked up by the oskari-bundle loader.
Oskari.bundle('mapuserlayers', () => {
    return {
        // no-op, this just registers userlayer support to be available for mapmodule to use
        start: () => {}
    };
});
