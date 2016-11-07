/**
 * @class Oskari.statistics.statsgrid.StatisticsService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.StatisticsService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox) {
        this.sandbox = sandbox;
        this.cache = Oskari.clazz.create('Oskari.statistics.statsgrid.Cache');
        this.state = Oskari.clazz.create('Oskari.statistics.statsgrid.StateService', sandbox);
        this.classification = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationService', sandbox);
        this.colors = Oskari.clazz.create('Oskari.statistics.statsgrid.ColorService');
        // pushed from instance
        this.datasources = [];
        // attach on, off, trigger functions
        Oskari.makeObservable(this);
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.statsgrid.StatisticsService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        /**
         * Used to propate Oskari events for files that have reference to service, but don't need to be registered to sandbox.
         * Usage: service.on('StatsGrid.RegionsetChangedEvent', function(evt) {});
         *
         * statsgrid/instance.js registers eventhandlers and calls this to let components know about events.
         * @param  {Oskari.mapframework.event.Event} event event that needs to be propagated to components
         */
        notifyOskariEvent : function(event) {
            this.trigger(event.getName(), event);
        },
        getStateService : function() {
            return this.state;
        },
        getClassificationService : function() {
            return this.classification;
        },
        getColorService : function() {
            return this.colors;
        },
        addDatasource : function(ds) {
            if(!ds) {
                // log error message
                return;
            }
            var me = this;
            if (_.isArray(ds)) {
                //if(typeof ds === 'array') -> loop and add all
                ds.forEach(function(item) {
                    me.addDatasource(item);
                });
                return;
            }
            this.datasources.push(ds);
        },

        getSelectionsText: function(indicator, locale, callback) {
            var me = this;
            var selectionsTexts = [];

            me.getIndicatorMetadata(indicator.datasource, indicator.indicator, function(err, ind){
                for(var sel in indicator.selections){
                    var val = indicator.selections[sel];

                    ind.selectors.forEach(function(selector, index) {
                        selector.allowedValues.forEach(function(value) {
                            if(val === (value.id || value)) {
                                var name = value.name || value.id || value;
                                var optName = (locale.selectionValues[selector.id] && locale.selectionValues[selector.id][name]) ? locale.selectionValues[selector.id][name] : name;

                                selectionsTexts.push(optName);
                            }

                        });
                    });

                }

                var selectionsText = ' ( ' +  selectionsTexts.join(' / ') + ' )';
                if(typeof callback === 'function') {
                    callback(selectionsText);
                }
            });
        },
        /**
         * Returns datasource {id, name, type} as object.
         * If id omitted returns all datasources as array.
         * If datasource with matching id isn't found returns null.
         * @param  {Number} id datasource id
         * @return {Object[]|Object|Null} datasource information or null if not found
         */
        getDatasource : function(id) {
            if(!id) {
                return this.datasources;
            }
            var found = null;
            this.datasources.forEach(function(ds) {
                if(ds.id === id) {
                    found = ds;
                }
            });
            return found;
        },
        /**
         * Returns regionsets that are available to user.
         * Based on maplayers of type STATS.
         */
        getRegionsets : function(includeOnlyIds) {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var layers = service.getLayersOfType('STATS');
            if(!layers) {
                return [];
            }
            var list = [];
            layers.forEach(function(regionset) {
                list.push({
                    id : regionset.getId(),
                    name : regionset.getName()
                });
            });
            var singleValue = typeof includeOnlyIds === 'number' || typeof includeOnlyIds === 'string';
            if(singleValue) {
                // wrap to an array
                includeOnlyIds = [includeOnlyIds];
            }
            if(_.isArray(includeOnlyIds)) {
                var result = _.filter(list, function(reg) {
                    return includeOnlyIds.indexOf(reg.id) !== -1;
                });
                if(singleValue) {
                    // if requested with single value, unwrap result from array
                    return result.length ? result[0] : null;
                }
                return result;
            }
            return list;
        },
        /**
         * Calls callback with a list of regions for the regionset.
         * @param  {Number}   regionset regionset id
         * @param  {Function} callback  function to call with error or results
         */
        getRegions : function(regionset, callback) {
            if(!regionset || typeof callback !== 'function') {
                // log error message
                return;
            }
            var me = this;
            var cacheKey = 'GetRegions_' + regionset;
            if(this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if(this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetRegions with parameter regionset=regionset
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    regionset : regionset
                },
                url: this.sandbox.getAjaxUrl('GetRegions'),
                success: function (pResp) {
                    me.cache.respondToQueue(cacheKey, null, pResp.regions);
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading regions');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds       datasource id
         * @param  {Function} callback function to call with error or results
         */
        getIndicatorList : function(ds, callback) {
            if(!ds || typeof callback !== 'function') {
                // log error message
                return;
            }
            var cacheKey = 'GetIndicatorList_' + ds;
            if(this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if(this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }

            var me = this;
            // call GetIndicatorList with parameter datasource=ds
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    datasource : ds
                },
                url: me.sandbox.getAjaxUrl('GetIndicatorList'),
                success: function (pResp) {
                    me.cache.respondToQueue(cacheKey, null, pResp.indicators);
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading indicators');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorMetadata : function(ds, indicator, callback) {
            if(!ds || !indicator || typeof callback !== 'function') {
                // log error message
                return;
            }
            var me = this;
            var cacheKey = 'GetIndicatorMetadata_' + ds + '_' + indicator;
            if(this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if(this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetIndicatorMetadata with parameter datasource=ds and indicator=indicator
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    datasource : ds,
                    indicator : indicator
                },
                url: me.sandbox.getAjaxUrl('GetIndicatorMetadata'),
                success: function (pResp) {
                    me.cache.respondToQueue(cacheKey, null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading indicator metadata');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorData : function(ds, indicator, params, regionset, callback) {
            if(!ds ||!indicator || !regionset || typeof callback !== 'function') {
                // log error message
                return;
            }
            var me = this;
            var data = {
                datasource : ds,
                indicator : indicator,
                regionset : regionset,
                selectors : JSON.stringify(params || {})
            };
            var cacheKey = 'GetIndicatorData_' + JSON.stringify(data);
            if(this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if(this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetIndicatorData with parameters:
            // - datasource=ds
            // - indicator=indicator
            // - selectors=serialized params
            // - regionset = regionset
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : data,
                url: this.sandbox.getAjaxUrl('GetIndicatorData'),
                success: function (pResp) {
                    me.getRegions(regionset, function(err, regions) {
                        if(err) {
                            me.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                            return;
                        }
                        // filter out data for regions that are not part of the regionset since some adapters return additional data!
                        // any additional data will result in broken classification
                        var filteredResponse = {};
                        regions.forEach(function(reg) {
                            filteredResponse[reg.id] = pResp[reg.id];
                        });
                        me.cache.respondToQueue(cacheKey, null, filteredResponse);

                    });
                },
                error: function (jqXHR, textStatus) {
                    me.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                }
            });
        },
        getSelectedIndicatorsRegions: function() {
            var me = this;
            var indicators = me.getStateService().getIndicators();
            var regionsets = [];
            var addRegions = function(regions){
                for(var i=0;i<regions.length;i++) {
                    if(jQuery.inArray(regions[i], regionsets) === -1){
                        regionsets.push(regions[i]);
                    }
                }
            };
            for(var i = 0;i<indicators.length; i++) {
                var ind = indicators[i];
                me.getIndicatorMetadata(ind.datasource, ind.indicator, function(err,indicator){
                    if(!err){
                        addRegions(indicator.regionsets);
                    }
                });
            }
            return regionsets;
        },
        getCurrentDataset : function(callback) {
            var me = this;
            if(typeof callback !== 'function') {
                // TODO: log error
                return;
            }
            var setId = this.getStateService().getRegionset();
            if(!setId) {
                callback("No regionset selected");
                return;
            }
            var regionset = this.getRegionsets(setId);
            var response = {
                regionset : {
                    id : setId,
                    name : regionset.name
                },
                indicators : [],
                data : []
            };
            var indicators = this.getStateService().getIndicators();
            this.getRegions(setId, function(err, regions) {
                if(err) {
                    callback(err, response);
                    return;
                }

                regions.forEach(function(reg) {
                    response.data.push({
                        id : reg.id,
                        name : reg.name,
                        values : {}
                    });
                });
                if(!indicators.length) {
                    // no indicators, just respond with regions
                    callback(null, response);
                    return;
                }
                // figure out ui names and data for indicators
                var count = 0;
                var errors = 0;
                var done = function() {
                    if(errors) {
                        callback('Error populating indicators', response);
                        return;
                    }
                    callback(null, response);
                };
                indicators.forEach(function(ind) {
                    var metadata = {
                        datasource : {
                            id : ind.datasource,
                            name : me.getDatasource(ind.datasource).name
                        },
                        id : ind.indicator,
                        name : "N/A",
                        selections : ind.selections,
                        hash : ind.hash
                    };
                    response.indicators.push(metadata);
                    // inProgress is a flag for detecting if both async ops have completed
                    var inProgress = true;
                    count++;
                    me.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                        if(err) {
                            errors++;
                            return;
                        }
                        metadata.name = Oskari.getLocalized(indicator.name);
                        // detect if this indicator is fully populated
                        if(!inProgress) {
                            count--;
                        }
                        inProgress = false;
                        if(count === 0) {
                            done();
                        }
                    });

                    me.getIndicatorData(ind.datasource, ind.indicator, ind.selections, setId, function(err, indicatorData) {
                        if(err) {
                            errors++;
                            return;
                        }
                        response.data.forEach(function(item) {
                            item.values[ind.hash] = indicatorData[item.id];
                        });
                        // detect if this indicator is fully populated
                        if(!inProgress) {
                            count--;
                        }
                        inProgress = false;
                        if(count === 0) {
                            done();
                        }
                    });
                });
            });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
