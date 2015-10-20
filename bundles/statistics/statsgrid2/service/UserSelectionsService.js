/**
 * @class Oskari.statistics.bundle.statsgrid.UserSelectionsService
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.UserSelectionsService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */
    function (sandbox) {
        this.sandbox = sandbox;
        this.filteredRegions = [];
    }, {
        __name: 'StatsGrid.UserSelectionsService',
        __qname: 'Oskari.statistics.bundle.statsgrid.UserSelectionsService',
        '__defaultRegionCategory' : 1, //'KUNTA',

        /**
         * @method getQName
         * @return Qualified clazz name
         */
        getQName: function () {
            return this.__qname;
        },

        /**
         * @method getName
         * @return Clazz name
         */
        getName: function () {
            return this.__name;
        },

        /**
         * @method getSandbox
         * @return {Object} Sandbox
         */
        getSandbox: function () {
            return this.sandbox;
        },
        setActiveRegionCategory : function (categoryId) {
        	this.activeRegionCategory = categoryId;
        },
        getActiveRegionCategory : function () {
        	return this.activeRegionCategory || this.__defaultRegionCategory;
        },
        getFilteredRegions : function () {
        	return this.filteredRegions;
        },
        /**
         * [addFilteredRegion description]
         * @param {String|String[]} region add region(s) to filtered list
         */
        addFilteredRegion : function (region) {
        	if (_.isArray(region)) {
				this.filteredRegions = this.filteredRegions.concat(region);
        	}
        	else {
				this.filteredRegions.push(region);
        	}
        },
        /**
         * @method removeRegionFilter
         * @param  {String|String[]|null} region remove single or many regions from filter or clear filter if <null>
         */
        removeRegionFilter : function (region) {
        	if (!region) {
        		// if not specified, remove all from filter
        		this.filteredRegions = [];
        		return;
        	}
        	if (_.isArray(region)) {
        		var me = this;
        		_.each(region, function(reg) { me.removeRegionFilter(reg); } );
        		return;
        	}
        	var index = this.__getFilteredRegionIndex(region);
        	if (index !== -1) {
            	this.filteredRegions.splice(index, 1);
        	}
        },

        /**
         * @method isFilteredRegion
         * @param {} region
         */
        isFilteredRegion : function (region) {
        	return this.__getFilteredRegionIndex(region) !== -1;
        },

        /**
         * @method __getFilteredRegionIndex
         * @param {} region
         * @private
         */
        __getFilteredRegionIndex : function (region) {
        	var len = this.filteredRegions.length,
        		i = 0;

            for (; i < len; ++i) {
            	var reg = this.filteredRegions[i];
                if (reg === region) {
                	return i;
                }
            }
            return -1;
        },

        /**
         * @method isIndicatorSelected
         * @param {Object} indicatorSelection Indicator selection
         * @return {Boolean} Whether the given indicator selection is already selected
         */
        isIndicatorSelected: function (indicatorSelection) {
            // TODO implement.
            // Return true if given user selection is already added to the grid...
            return false;
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
