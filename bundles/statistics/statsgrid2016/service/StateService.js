/**
 * @class Oskari.statistics.statsgrid.StateService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.StateService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox) {
        this.sandbox = sandbox;
        this.indicators = [];
        this.regionset = null;
        this.activeIndicator = null;
    }, {
        __name: "StatsGrid.StateService",
        __qname: "Oskari.statistics.statsgrid.StateService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        /**
         * Resets the current state and sends events about the changes.
         * Removes all selected indicators, selected region and regionset is set to undefined
         */
        reset : function() {
            var me = this;
            this.indicators.forEach(function(ind) {
                me.removeIndicator(ind.datasource, ind.indicator, ind.selections);
            });
            this.selectRegion();
            this.setRegionset();
        },
        /**
         * Returns id of the current regionset
         * @return {Number} id of current regionset
         */
        getRegionset : function() {
            return this.regionset;
        },
        /**
         * Sets the current regionset and sends out event notifying about the change
         * @param {Number|String} regionset id of the selected regionset
         */
        setRegionset : function(regionset) {
            var previousSet = this.regionset;
            this.regionset = Number(regionset);
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.RegionsetChangedEvent');
            this.sandbox.notifyAll(eventBuilder(this.regionset, previousSet));
        },
        /**
         * Selects the region. Only sends out an event for now, selected region is not tracked by the service.
         * @param  {Number} region id for the region that was selected. Assumes it's from the current regionset.
         */
        selectRegion : function(region) {
            // notify only for now
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.RegionSelectedEvent');
            this.sandbox.notifyAll(eventBuilder(this.getRegionset(), region));
        },
        /**
         * Returns an array of objects containing details (datasource, id, selections) of currently selected indicators.
         * @return {Object[]} currently selected indicators
         */
        getIndicators : function() {
            return this.indicators;
        },
        /**
         * @method  @public getIndicatorIndex Gets indicator index startin number 1
         * @param  {String} indicatorHash indicator hash
         * @return {Integer} indicator index
         */
        getIndicatorIndex : function(indicatorHash) {
            for(var i = 0;i<this.indicators.length; i++) {
                var ind = this.indicators[i];
                if(ind.hash === indicatorHash) {
                    return i+1;
                }
            }
            return null;
        },
        /**
         * Sets the active indicator and sends an event about the change
         * @param {String} indicatorHash the unique hash from selected indicators details. See getHash()
         */
        setActiveIndicator : function(indicatorHash) {
            var me = this;
            var previous = this.activeIndicator;

            // reset previous
            me.activeIndicator = null;
            this.indicators.forEach(function(ind) {
                if(ind.hash === indicatorHash) {
                    me.activeIndicator = ind;
                }
            });
            // get a default if requested was not found
            if(!this.activeIndicator) {
                this.activeIndicator = this.getActiveIndicator();
            }

            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.ActiveIndicatorChangedEvent');
            this.sandbox.notifyAll(eventBuilder(this.activeIndicator, previous));
        },
        /**
         * Returns object describing the active indicator or null if there are no indicators selected.
         * @return {Object} null if no active indicator or an object with indicator details
         */
        getActiveIndicator : function() {
            if(this.activeIndicator) {
                // return selected indicator
                // TODO: maybe check that it still is in the indicators array?
                return this.activeIndicator;
            }
            if(!this.indicators.length) {
                // no indicators present -> null
                return null;
            }
            // return latest if not set
            return this.indicators[this.indicators.length - 1];
        },
        /**
         * Adds indicator to selected indicators. Triggers event to notify about change
         * and sets the added indicator as the active one triggering another event.
         * @param  {Number} datasrc    datasource id
         * @param  {Number} indicator  indicator id
         * @param  {Object} selections object containing the parameters for the indicator
         * @return {Object}            an object describing the added indicator (includes parameters as an object)
         */
        addIndicator : function(datasrc, indicator, selections) {
            var ind = {
                datasource : Number(datasrc),
                indicator : indicator,
                selections : selections,
                hash : this.getHash(datasrc, indicator, selections)
            };
            this.indicators.push(ind);

            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(ind.datasource, ind.indicator, ind.selections));

            // set the latest as active indicator
            this.setActiveIndicator(ind.hash);

            return ind;
        },
        /**
         * Remove an indicator from selected indicators. Triggers event to notify about change
         * and if the removed indicator was the active one, resets the active indicator triggering another event.
         * @param  {Number} datasrc    datasource id
         * @param  {Number} indicator  indicator id
         * @param  {Object} selections object containing the parameters for the indicator
         * @return {Object}            an object describing the removed indicator (includes parameters as an object)
         */
        removeIndicator : function(datasrc, indicator, selections) {
            var me = this;
            var newIndicators = [];
            var hash = this.getHash(datasrc, indicator, selections);
            var removedIndicator = null;
            this.indicators.forEach(function(ind) {
                if(ind.hash !== hash) {
                    newIndicators.push(ind);
                }
                else {
                    removedIndicator = ind;
                }
            });
            this.indicators = newIndicators;

            if(this.activeIndicator && this.activeIndicator.hash === removedIndicator.hash) {
                // active was the one removed -> reset active
                this.setActiveIndicator();
            }
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(datasrc, indicator, selections, true));
            return removedIndicator;
        },
        /**
         * Returns a string that can be used to identify an indicator including selections.
         * Shouldn't be parsed to detect which indicator is in question, but used as a simple
         * token to identify a selected indicator or set an active indicator
         * @param  {Number} datasrc    datasource id
         * @param  {Number} indicator  indicator id
         * @param  {Object} selections object containing the parameters for the indicator
         * @return {String}            an unique id for the parameters
         */
        getHash : function(datasrc, indicator, selections) {
            return datasrc + '_' + indicator + '_' + JSON.stringify(selections);
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
