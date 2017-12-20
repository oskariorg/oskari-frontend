/**
 * @class Oskari.statistics.statsgrid.StatisticsService
 */
(function (Oskari) {
    var _log = Oskari.log('StatsGrid.StatisticsService');

    Oskari.clazz.define('Oskari.statistics.statsgrid.StatisticsService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox, locale) {
        this.sandbox = sandbox;
        this.locale = locale;
        this.cache = Oskari.clazz.create('Oskari.statistics.statsgrid.Cache');
        this.state = Oskari.clazz.create('Oskari.statistics.statsgrid.StateService', sandbox);
        this.colors = Oskari.clazz.create('Oskari.statistics.statsgrid.ColorService');
        this.classification = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationService', this.colors);
        this.error = Oskari.clazz.create('Oskari.statistics.statsgrid.ErrorService', sandbox);

        // pushed from instance
        this.datasources = [];
        // attach on, off, trigger functions
        Oskari.makeObservable(this);

        // possible values: wms, vector
        this._mapModes = ['vector'];
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.statsgrid.StatisticsService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        setMapModes: function (mapModes) {
            this._mapModes = mapModes;
        },
        getMapModes: function () {
            return this._mapModes;
        },
        hasMapMode: function (mode) {
            var me = this;
            var hasMode = false;
            me._mapModes.forEach(function (mapmode) {
                if (mapmode === mode) {
                    hasMode = true;
                }
            });
            return hasMode;
        },
        /**
         * Used to propate Oskari events for files that have reference to service, but don't need to be registered to sandbox.
         * Usage: service.on('StatsGrid.RegionsetChangedEvent', function(evt) {});
         *
         * statsgrid/instance.js registers eventhandlers and calls this to let components know about events.
         * @param  {Oskari.mapframework.event.Event} event event that needs to be propagated to components
         */
        notifyOskariEvent: function (event) {
            this.trigger(event.getName(), event);
        },
        getStateService: function () {
            return this.state;
        },
        getClassificationService: function () {
            return this.classification;
        },
        getColorService: function () {
            return this.colors;
        },
        getErrorService: function () {
            return this.error;
        },
        addDatasource: function (ds) {
            if (!ds) {
                // log error message
                return;
            }
            var me = this;
            if (_.isArray(ds)) {
                // if(typeof ds === 'array') -> loop and add all
                ds.forEach(function (item) {
                    me.addDatasource(item);
                });
                return;
            }
            // normalize to always have info-object (so far only holds optional description url of service with "url" key)
            ds.info = ds.info || {};
            this.datasources.push(ds);
        },

        getUILabels: function (indicator, callback) {
            var me = this;
            var locale = this.locale;
            if (typeof callback !== 'function') {
                // log error message
                return;
            }

            me.getIndicatorMetadata(indicator.datasource, indicator.indicator, function (err, ind) {
                if (err) {
                    callback({
                        error: true,
                        indicator: '',
                        params: '',
                        full: '',
                        paramsAsObject: {}
                    });
                    return;
                }

                var uiLabels = [];
                var preferredFormatting = [];
                for (var sel in indicator.selections) {
                    var val = indicator.selections[sel];

                    ind.selectors.forEach(function (selector) {
                        selector.allowedValues.forEach(function (value) {
                            if (val !== (value.id || value)) {
                                return;
                            }
                            var name = value.name;
                            if (!name) {
                                name = value.id || value;
                                // try finding localization for the param
                                // FIXME: get rid of this -> have server give ui labels
                                name = (locale[selector.id] && locale[selector.id][name]) ? locale[selector.id][name] : name;
                            }
                            uiLabels.push({
                                selector: selector.id,
                                id: value.id || value,
                                label: name
                            });

                            preferredFormatting.push(name);
                        });
                    });
                }

                var name = Oskari.getLocalized(ind.name);
                var selectorsFormatted = '(' + preferredFormatting.join(' / ') + ')';
                callback({
                    indicator: name,
                    source: Oskari.getLocalized(ind.source),
                    params: selectorsFormatted,
                    full: name + ' ' + selectorsFormatted,
                    paramsAsObject: uiLabels
                });
            });
        },
        /**
         * Returns datasource {id, name, type} as object.
         * If id omitted returns all datasources as array.
         * If datasource with matching id isn't found returns null.
         * @param  {Number} id datasource id
         * @return {Object[]|Object|Null} datasource information or null if not found
         */
        getDatasource: function (id) {
            if (!id) {
                return this.datasources;
            }
            var found = null;
            this.datasources.forEach(function (ds) {
                if (ds.id === id) {
                    found = ds;
                }
            });
            return found;
        },
        /**
         * Returns regionsets that are available to user.
         * Based on maplayers of type STATS.
         */
        getRegionsets: function (includeOnlyIds) {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var layers = service.getLayersOfType('STATS');
            if (!layers) {
                return [];
            }
            var list = [];
            layers.forEach(function (regionset) {
                list.push({
                    id: regionset.getId(),
                    name: regionset.getName()
                });
            });
            var singleValue = typeof includeOnlyIds === 'number' || typeof includeOnlyIds === 'string';
            if (singleValue) {
                // wrap to an array
                includeOnlyIds = [includeOnlyIds];
            }
            if (_.isArray(includeOnlyIds)) {
                var result = _.filter(list, function (reg) {
                    return includeOnlyIds.indexOf(reg.id) !== -1;
                });
                if (singleValue) {
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
        getRegions: function (regionset, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!regionset) {
                // log error message
                callback('Regionset missing');
                return;
            }
            var me = this;
            var cacheKey = 'GetRegions_' + regionset;
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetRegions with parameter regionset=regionset
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    regionset: regionset,
                    srs: this.sandbox.getMap().getSrsName()
                },
                url: this.sandbox.getAjaxUrl('GetRegions'),
                success: function (pResp) {
                    var onlyWithNames = pResp.regions.filter(function (region) {
                        return !!region.name;
                    });
                    me.cache.respondToQueue(cacheKey, null, onlyWithNames);
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
        getIndicatorList: function (ds, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds) {
                // log error message
                callback('Datasource missing');
                return;
            }
            var cacheKey = 'GetIndicatorList_' + ds;
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }

            var me = this;
            var updateIncompleteIndicatorList = function (previousList) {
                _log.info('Indicator listing was not complete. Refreshing in 10 seconds');
                setTimeout(function () {
                    me.cache.remove(cacheKey);
                    // try again after 10 seconds
                    me.getIndicatorList(ds, function (err, newList) {
                        if (err) {
                            // Don't call callback with err as we will be trying again.
                            _log.warn('Error updating indicator list.');
                            return;
                        }
                        if (newList.indicators.length === previousList.length) {
                            // same list size??? somethings propably wrong
                            _log.warn('Same indicator list as in previous try. There might be some problems with the service');
                            return;
                        }
                        // send out event about new indicators
                        var eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                        me.sandbox.notifyAll(eventBuilder(ds));
                    });
                }, 10000);
            };

            // call GetIndicatorList with parameter datasource=ds
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    datasource: ds
                },
                url: me.sandbox.getAjaxUrl('GetIndicatorList'),
                success: function (pResp) {
                    me.cache.respondToQueue(cacheKey, null, pResp);
                    if (!pResp.complete) {
                        // wasn't complete dataset - remove from cache and poll for more
                        updateIncompleteIndicatorList(pResp.indicators);
                    }
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
        getIndicatorMetadata: function (ds, indicator, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds || !indicator) {
                // log error message
                callback('Datasource or indicator missing');
                return;
            }
            var me = this;
            var cacheKey = 'GetIndicatorMetadata_' + ds + '_' + indicator;
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
                // request already in progress
                return;
            }
            // call GetIndicatorMetadata with parameter datasource=ds and indicator=indicator
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: 'GET',
                dataType: 'json',
                data: {
                    datasource: ds,
                    indicator: indicator
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
        getIndicatorData: function (ds, indicator, params, regionset, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds || !indicator || !regionset) {
                // log error message
                callback('Datasource, regionset or indicator missing');
                return;
            }
            var me = this;
            var data = {
                datasource: ds,
                indicator: indicator,
                regionset: regionset,
                selectors: JSON.stringify(params || {})
            };
            var serialized = '';
            if (typeof params === 'object') {
                serialized = '_' + Object.keys(params).sort().map(function (key) {
                    return key + '=' + JSON.stringify(params[key]);
                }).join(':');
            }
            var cacheKey = 'GetIndicatorData_' + ds + '_' + indicator + '_' + regionset + serialized;
            if (this.cache.tryCachedVersion(cacheKey, callback)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, callback)) {
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
                type: 'GET',
                dataType: 'json',
                data: data,
                url: this.sandbox.getAjaxUrl('GetIndicatorData'),
                success: function (pResp) {
                    me.getRegions(regionset, function (err, regions) {
                        if (err) {
                            me.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                            return;
                        }
                        // filter out data for regions that are not part of the regionset since some adapters return additional data!
                        // any additional data will result in broken classification
                        var filteredResponse = {};
                        regions.forEach(function (reg) {
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
        getSelectedIndicatorsRegions: function () {
            var me = this;
            var indicators = me.getStateService().getIndicators();
            var regionsets = [];
            var addRegions = function (regions) {
                for (var i = 0; i < regions.length; i++) {
                    if (jQuery.inArray(regions[i], regionsets) === -1) {
                        regionsets.push(regions[i]);
                    }
                }
            };
            for (var i = 0; i < indicators.length; i++) {
                var ind = indicators[i];
                me.getIndicatorMetadata(ind.datasource, ind.indicator, function (err, indicator) {
                    if (!err) {
                        addRegions(indicator.regionsets);
                    }
                });
            }
            return regionsets;
        },
        getCurrentDataset: function (callback) {
            var me = this;
            if (typeof callback !== 'function') {
                return;
            }
            var setId = this.getStateService().getRegionset();
            if (!setId) {
                callback("No regionset selected");
                return;
            }
            var regionset = this.getRegionsets(setId);
            var response = {
                regionset: {
                    id: setId,
                    name: regionset.name
                },
                indicators: [],
                data: []
            };
            var indicators = this.getStateService().getIndicators();
            this.getRegions(setId, function (err, regions) {
                if (err) {
                    callback(err, response);
                    return;
                }

                regions.forEach(function (reg) {
                    response.data.push({
                        id: reg.id,
                        name: reg.name,
                        values: {}
                    });
                });
                if (!indicators.length) {
                    // no indicators, just respond with regions
                    callback(null, response);
                    return;
                }
                // figure out ui names and data for indicators
                var count = 0;
                var errors = 0;
                var done = function () {
                    if (errors) {
                        callback('Error populating indicators', response);
                        return;
                    }
                    callback(null, response);
                };
                indicators.forEach(function (ind) {
                    var metadata = {
                        datasource: {
                            id: ind.datasource,
                            name: me.getDatasource(ind.datasource).name
                        },
                        id: ind.indicator,
                        name: 'N/A',
                        selections: ind.selections,
                        hash: ind.hash
                    };
                    response.indicators.push(metadata);
                    me.getIndicatorMetadata(ind.datasource, ind.indicator, function (err, indicator) {
                        count++;
                        if (err) {
                            errors++;
                            return;
                        }
                        metadata.name = Oskari.getLocalized(indicator.name);
                        if (count === indicators.length * 2) {
                            // if count is 2 x indicators length both metadata and indicator data has been loaded for all indicators
                            done();
                        }
                    });

                    me.getIndicatorData(ind.datasource, ind.indicator, ind.selections, setId, function (err, indicatorData) {
                        count++;
                        if (err) {
                            errors++;
                            return;
                        }
                        response.data.forEach(function (item) {
                            item.values[ind.hash] = indicatorData[item.id];
                        });
                        if (count === indicators.length * 2) {
                            done();
                        }
                    });
                });
            });
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));
