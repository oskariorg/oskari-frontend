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
        this.activeRegion = null;
        this._defaults = {
            classification: {
                count: 5,
                method: 'jenks',
                name: 'Blues',
                type:'seq',
                mode: 'discontinuous',
                reverseColors: false
            }
        };
        this._timers = {};
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
            var previousIndicator = this.activeIndicator;
            this.indicators = []
            this.classification = null;
            this.setActiveIndicator();
            this.setRegionset();
            this.toggleRegion(null);
            // notify
            var eventBuilder = Oskari.eventBuilder('StatsGrid.ActiveIndicatorChangedEvent');
            this.sandbox.notifyAll(eventBuilder(this.activeIndicator, previousIndicator));
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

            // notify if regionset changed
            if(previousSet !== this.regionset) {
                var eventBuilder = Oskari.eventBuilder('StatsGrid.RegionsetChangedEvent');
                this.sandbox.notifyAll(eventBuilder(this.regionset, previousSet));
            }
        },
        /**
         * Toggle the region.
         * @param  {Number} region id for the region that was selected. Assumes it's from the current regionset.
         * @param {String} componentId component id
         */
        toggleRegion : function(region, componentId) {
            // TODO: why does this need componentId?
            var me = this;

            // if region is same than previous then unselect region
            if(region === me.activeRegion) {
                region = null;
            }
            clearTimeout(me._timers.setActiveRegion);

            me._timers.setActiveRegion = setTimeout(function(){
                me.activeRegion = region;
                // notify
                var eventBuilder = Oskari.eventBuilder('StatsGrid.RegionSelectedEvent');
                // TODO: send which region was deselected so implementations can optimize rendering!!!!
                me.sandbox.notifyAll(eventBuilder(me.getRegionset(), region, null, componentId));
            }, 100);
        },

        /**
         * Gets the active region.
         * @method  @public getRegion
         * @return {null|Number} null or selected region
         */
        getRegion: function(){
            return this.activeRegion;
        },


        /**
         * Sets the current classification and sends out event notifying about the change
         * @param {String} indicatorHash indicator hash
         * @param {Object} classification classification
         * @param {Boolean} suppressEvent suppress event
         */
        setClassification : function(indicatorHash, classification, suppressEvent) {
            var me = this;
            if(typeof indicatorHash !== 'string' && typeof classification !== 'object') {
                return;
            }

            var indicator = this.getIndicator(indicatorHash);
            if(indicator) {
                var previousClassification = indicator.classification;
                indicator.classification = classification;
                // notify
                var eventBuilder = Oskari.eventBuilder('StatsGrid.ClassificationChangedEvent');
                if(!suppressEvent && eventBuilder) {
                    this.sandbox.notifyAll(eventBuilder(indicator.classification, previousClassification));
                    me.setActiveIndicator(indicatorHash);
                }
            }

        },
        /**
         * Gets getClassificationOpts
         * @param  {String} indicatorHash indicator hash
         */
        getClassificationOpts : function(indicatorHash) {
            var indicator = this.getIndicator(indicatorHash) || {};
            return jQuery.extend({}, this._defaults.classification, indicator.classification || {});
        },

        /**
         * Returns an wanted indicator.
         * @param  {String} indicatorHash indicator hash
         * @return {Object[]} wanted indicator or null if not found
         */
        getIndicator : function(indicatorHash) {
            if(typeof indicatorHash !== 'string') {
                return null;
            }
            for(var i = 0;i<this.indicators.length; i++) {
                var ind = this.indicators[i];
                if(ind.hash === indicatorHash) {
                    return ind;
                }
            }
            return null;
        },
        /**
         * Returns true if an indicator matching the datasource and id is still selected with any parameters.
         * Can be used to check if we should show the dataprovider information for the indicator or not.
         * @param  {Number}  ds datasource id
         * @param  {String}  id Indicator id
         * @return {Boolean} true if this indicator with any selections is still part of the selected indicators
         */
        isSelected : function(ds, id) {
            for(var i = 0;i<this.indicators.length; i++) {
                var ind = this.indicators[i];
                if(ind.datasource === ds && ind.indicator === id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * Returns an array of objects containing details (datasource, id, selections) of currently selected indicators.
         * @return {Object[]} currently selected indicators
         */
        getIndicators : function() {
            return this.indicators;
        },
        /**
         * @method  @public getIndicatorIndex Gets indicator index startin number 0
         * @param  {String} indicatorHash indicator hash
         * @return {Integer} indicator index
         */
        getIndicatorIndex : function(indicatorHash) {
            for(var i = 0;i<this.indicators.length; i++) {
                var ind = this.indicators[i];
                if(ind.hash === indicatorHash) {
                    return i;
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

            clearTimeout(me._timers.setActiveIndicator);

            // This must be on some way to discard set active indicator if calling repeatly.
            // Because of published map editing, active indicator is changed always when adding indicator.
            me._timers.setActiveIndicator = setTimeout(function(){
                var previous = me.activeIndicator;

                // reset previous
                me.activeIndicator = null;
                me.indicators.forEach(function(ind) {
                    if(ind.hash === indicatorHash) {
                        me.activeIndicator = ind;
                    }
                });
                // get a default if requested was not found
                if(!me.activeIndicator) {
                    me.activeIndicator = me.getActiveIndicator();
                }
                // notify
                var eventBuilder = Oskari.eventBuilder('StatsGrid.ActiveIndicatorChangedEvent');
                me.sandbox.notifyAll(eventBuilder(me.activeIndicator, previous));
            }, 100);
        },
        /**
         * Returns object describing the active indicator or null if there are no indicators selected.
         * @return {Object} null if no active indicator or an object with indicator details
         */
        getActiveIndicator : function() {
            if(this.activeIndicator) {
                // return selected indicator
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
         * @param {Object} classification indicator classification
         *
         * @return {Object} false if indicator is already selected or an object describing the added indicator (includes parameters as an object)
         */
        addIndicator : function(datasrc, indicator, selections, classification) {
            var ind = {
                datasource : Number(datasrc),
                indicator : indicator,
                selections : selections,
                hash : this.getHash(datasrc, indicator, selections),
                classification: classification
            };
            var found = false;
            this.indicators.forEach(function(existing) {
                if(existing.hash === ind.hash) {
                    found = true;
                }
            });
            if(found) {
                return false;
            }
            this.indicators.push(ind);

            // notify
            var eventBuilder = Oskari.eventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(ind.datasource, ind.indicator, ind.selections));

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
            if(me.classification!==null && me.classification[hash]) {
                me.classification[hash] = null;
                delete me.classification[hash];
            }
            this.indicators = newIndicators;

            if(removedIndicator && removedIndicator.hash && this.activeIndicator && this.activeIndicator.hash === removedIndicator.hash) {
                // active was the one removed -> reset active
                this.setActiveIndicator();
            }
            // notify
            var eventBuilder = Oskari.eventBuilder('StatsGrid.IndicatorEvent');
            this.sandbox.notifyAll(eventBuilder(datasrc, indicator, selections, true));


            // if no indicators then reset active region
            if(this.indicators.length === 0) {
                this.toggleRegion(null);
            }

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
            var hash = datasrc + '_' + indicator;
            if(typeof selections === 'object') {
                hash = hash + '_' + Object.keys(selections).sort().map(function(key) {
                    return key + "=" + JSON.stringify(selections[key]);
                }).join(':');
            }
            return hash;
        },
        addFilter : function( filter ) {
            // notify
            var eventBuilder = Oskari.eventBuilder('StatsGrid.Filter');
            this.sandbox.notifyAll(eventBuilder(filter));
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
