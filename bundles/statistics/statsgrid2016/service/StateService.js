/**
 * @class Oskari.statistics.statsgrid.StateService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.StateService',

    /**
     * @method create called automatically on construction
     * @static
     *
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
        getRegionset : function() {
            return this.regionset;
        },
        setRegionset : function(regionset) {
            var previousSet = this.regionset;
            this.regionset = Number(regionset);
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.RegionsetChangedEvent');
            this.sandbox.notifyAll(eventBuilder(this.regionset, previousSet));
        },
        getIndicators : function() {
            return this.indicators;
        },
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
            // set active to latest
            this.activeIndicator = this.indicators[this.indicators.length - 1];
            return this.getActiveIndicator();
        },
        addIndicator : function(datasrc, indicator, selections) {
            var ind = {
                datasource : Number(datasrc),
                indicator : Number(indicator),
                selections : selections,
                hash : this.getHash(datasrc, indicator, selections)
            };
            // set the latest as active indicator
            this.activeIndicator = ind;

            this.indicators.push(ind);
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(ind.datasource, ind.indicator, ind.selections));
            return ind;
        },
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
                this.activeIndicator = null;
            }
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(datasrc, indicator, selections, true));
            return removedIndicator;
        },
        getHash : function(datasrc, indicator, selections) {
            return datasrc + '_' + indicator + '_' + JSON.stringify(selections);
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
