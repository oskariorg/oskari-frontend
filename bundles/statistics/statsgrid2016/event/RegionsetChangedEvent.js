/**
 * Used to notify that the regionset has changed in statsgrid and any region
 *  listing or region specific data should be updated to show the selected regionset.
 *
 * @class Oskari.statistics.statsgrid.event.RegionsetChangedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.RegionsetChangedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (regionset, previousRegionset) {
        this.regionset = regionset;
        this.previousSet = previousRegionset;
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName : function () {
            return "StatsGrid.RegionsetChangedEvent";
        },
        /**
         * Regionset id
         * @return {Number}
         */
        getRegionset : function() {
            return this.regionset;
        },
        /**
         * Regionset id for previously selected regionset
         * @return {Number}
         */
        getPrevious : function() {
            return this.previousSet;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });