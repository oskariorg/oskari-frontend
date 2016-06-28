/**
 * @class Oskari.statistics.statsgrid.Cache
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.Cache',

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
