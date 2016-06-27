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
        addIndicator : function(datasrc, indicator, selections) {
            var ind = {
                datasource : Number(datasrc),
                indicator : Number(indicator),
                selections : selections,
                hash : this._getIndicatorHash(datasrc, indicator, selections)
            };

            this.indicators.push(ind);
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(ind.datasource, ind.indicator, ind.selections));
        },
        removeIndicator : function(datasrc, indicator, selections) {
            var newIndicators = [];
            var hash = this._getIndicatorHash(datasrc, indicator, selections);
            this.indicators.forEach(function(ind) {
                if(ind.hash !== hash) {
                    newIndicators.push(ind);
                }
            });
            this.indicators = newIndicators;
            // notify
            var eventBuilder = this.sandbox.getEventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(datasrc, indicator, selections, true));
        },
        _getIndicatorHash : function(datasrc, indicator, selections) {
            return datasrc + '_' + indicator + '_' + JSON.stringify(selections);
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
