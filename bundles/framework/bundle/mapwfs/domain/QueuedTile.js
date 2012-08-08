/**
 * @class Oskari.mapframework.gridcalc.QueuedTile
 *
 * TODO: check doc
 * This class provides Tile information
 * bounds classs member is a json object with
 * 	left,bottom,right,top properties
 *
 *
 */
Oskari.clazz.define("Oskari.mapframework.gridcalc.QueuedTile",

/**
 * @method create called automatically on construction
 * @static
 * @param options ???
 */
function(options) {
    for(p in options )
    this[p] = options[p];
}, {
    /**
     * @method getBounds
     * TODO: check
     * @return bounds
     */
    getBounds : function() {
        return this.bounds;
    }
});
