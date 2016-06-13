/**
 * @class Oskari.statistics.bundle.statsgrid.StatisticsService
 * Methods for sending out events to display data in the grid
 * and to create a visualization of the data on the map.
 * Has a method for sending the requests to backend as well.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.Cache',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function () {
        this.cache = {};
        this.cacheSize = 0;
    }, {
        put : function(key, value) {
            this.cache[key] = value;
        },
        get : function(key) {
            return this.cache[key];
        }
    });
