/**
 * @class Oskari.mapframework.bundle.mapfull.MapFullBundleInstance
 *
 * Initializes Oskari core and starts a map window application. Much of the map related properties
 * and initial state are read from bundle configuration/state.
 *
 * See bundle documentation at http://www.oskari.org/trac/wiki/DocumentationBundleMapfull
 */
define([
	"bundles/framework/bundle/mapfull/instance",
	"libraries/Proj4js/proj4js-2.2.1/proj4-src",
	"lodash"
], function(MapFull, proj4, _) {
	// let's make proj4 global so that ol3 can find and use it
	window.proj4 = proj4;

    Oskari
        .cls("Oskari.mapframework.bundle.mapfull.MapFullBundleInstance")
        .category({
            nomaprender: true,
	        _handleProjectionDefs: function (defs) {
	        	var defaultDefs = [
	                    ["EPSG:3067", "+proj=utm +zone=35 +ellps=GRS80 +units=m +no_defs"],
	                    ["EPSG:4326", "+title=WGS 84 +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
	                ];
	        	if (_.isArray(defs)) {
	                proj4.defs(defs);
	        	} else if (_.isObject(defs)) {
	        		// Note! arrays are also Objects
	        		for (proj in defs) {
	        			proj4.defs(proj, defs[proj]);
	        		}
	        	} else {
	                proj4.defs(defaultDefs);
	        	}
	        }
        });
});