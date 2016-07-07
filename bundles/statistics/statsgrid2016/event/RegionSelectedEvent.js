/**
 * Region is selected in statsgrid.
 * Components showing regions can update a "highlighted" region.
 *
 * @class Oskari.statistics.statsgrid.event.RegionSelectedEvent
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.event.RegionSelectedEvent',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (regionset, region, currentSelection) {
        this.regionset = regionset;
        this.region = region;
        this.currentSelection = currentSelection || [region];
    }, {
        /**
         * @method getName
         * Returns event name
         * @return {String} The event name.
         */
        getName : function () {
            return "StatsGrid.RegionSelectedEvent";
        },
        /**
         * Regionset id
         * @return {Number}
         */
        getRegionset : function() {
            return this.regionset;
        },
        /**
         * Region id
         * @return {Number}
         */
        getRegion : function() {
            return this.region;
        },
        /**
         * Region id
         * @return {Number[]}
         */
        getSelection : function() {
            return this.currentSelection;
        }
    }, {
        'protocol': ['Oskari.mapframework.event.Event']
    });