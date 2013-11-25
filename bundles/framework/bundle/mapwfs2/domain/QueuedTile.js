/**
 * @class Oskari.mapframework.gridcalc.QueuedTile
 *
 * TODO: check doc
 * This class provides Tile information
 * bounds classs member is a json object with
 *  left,bottom,right,top properties
 *
 *
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.domain.QueuedTile",

    /**
     * @method create called automatically on construction
     * @static
     * @param options
     */

    function (options) {
        var p;
        for (p in options) {
            if (options.hasOwnProperty(p)) {
                this[p] = options[p];
            }
        }
    }, {
        /**
         * @method getBounds
         * TODO: check
         * @return bounds
         */
        getBounds: function () {
            return this.bounds;
        }
    });