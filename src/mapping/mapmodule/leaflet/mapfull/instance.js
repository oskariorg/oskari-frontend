/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 * 
 * Initializes Oskari core and starts a map window application. Much of the map related properties
 * and initial state are read from bundle configuration/state. 
 * 
 * See bundle documentation at http://www.oskari.org/trac/wiki/DocumentationBundleMapfull
 */
define(["bundles/framework/bundle/mapfull/instance"], function(MapFull) {
    Oskari
        .cls("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance")
        .category({
            nomaprender: true
        });
});