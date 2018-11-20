/**
 * @class Oskari.statistics.statsgrid.StatisticsService
 */
(function (Oskari) {
    var _log = Oskari.log('StatsGrid.StatisticsService');
    var _cacheHelper = null;

    Oskari.clazz.define('Oskari.statistics.statsgrid.StatisticsService', function (sandbox, locale) {
        this.sandbox = sandbox;
        this.locale = locale;
        this.cache = Oskari.clazz.create('Oskari.statistics.statsgrid.Cache');
        _cacheHelper = Oskari.clazz.create('Oskari.statistics.statsgrid.CacheHelper', this.cache, this);
        this.series = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesService', sandbox);
        this.state = Oskari.clazz.create('Oskari.statistics.statsgrid.StateService', sandbox, this.series);
        this.colors = Oskari.clazz.create('Oskari.statistics.statsgrid.ColorService');
        this.classification = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationService', this.colors);
        this.error = Oskari.clazz.create('Oskari.statistics.statsgrid.ErrorService', sandbox);

        // pushed from instance
        this.datasources = [];
        this.regionsets = [];
        // attach on, off, trigger functions
        Oskari.makeObservable(this);

        // possible values: wms, vector
        this._mapModes = ['vector'];

        // Make series service listen for changes
        this.series.bindToEvents(this);
    }, {
        __name: 'StatsGrid.StatisticsService',
        __qname: 'Oskari.statistics.statsgrid.StatisticsService',

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
        getSeriesService: function () {
            return this.series;
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
            if (Array.isArray(ds)) {
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
        getUserDatasource: function () {
            return this.datasources.find(function (src) {
                return src.type === 'user';
            });
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
                var selectorsFormatted;
                if (indicator.series) {
                    var range = String(indicator.series.values[0]) + ' - ' + String(indicator.series.values[indicator.series.values.length - 1]);
                    selectorsFormatted = range + ' (' + preferredFormatting.join(' / ') + ')';
                } else {
                    selectorsFormatted = '(' + preferredFormatting.join(' / ') + ')';
                }

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
                if ('' + ds.id === '' + id) {
                    found = ds;
                }
            });
            return found;
        },
        addRegionset: function (regionset) {
            if (!regionset) {
                // log error message
                return;
            }
            var me = this;
            if (Array.isArray(regionset)) {
                // if(typeof regionset === 'array') -> loop and add all
                regionset.forEach(function (item) {
                    me.addRegionset(item);
                });
                return;
            }
            if (regionset.id && regionset.name) {
                this.regionsets.push(regionset);
            } else {
                _log.info('Ignoring regionset without id or name:', regionset);
            }
        },
        /**
         * Returns regionsets that are available to user.
         * Based on maplayers of type STATS.
         */
        getRegionsets: function (includeOnlyIds) {
            var list = this.regionsets || [];
            if (!list || list.length === 0) {
                return [];
            }
            var singleValue = typeof includeOnlyIds === 'number' || typeof includeOnlyIds === 'string';
            if (singleValue) {
                // wrap to an array
                includeOnlyIds = [includeOnlyIds];
            }
            if (Array.isArray(includeOnlyIds)) {
                var result = list.filter(function (reg) {
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
            var cacheKey = _cacheHelper.getRegionsKey(regionset);
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
                url: Oskari.urls.getRoute('GetRegions'),
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
            var cacheKey = _cacheHelper.getIndicatorListKey(ds);
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
                    me.getIndicatorList(ds, function (err, newResponse) {
                        if (err) {
                            // Don't call callback with err as we will be trying again.
                            _log.warn('Error updating indicator list.');
                            return;
                        }
                        if (!newResponse.complete && newResponse.indicators.length === previousList.length) {
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
                url: Oskari.urls.getRoute('GetIndicatorList'),
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
            var cacheKey = _cacheHelper.getIndicatorMetadataKey(ds, indicator);
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
                url: Oskari.urls.getRoute('GetIndicatorMetadata'),
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
         * @param  {Object}   params    indicator selections
         * @param  {Object}   series    serie keys
         * @param  {Object}   regionset regionset
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorData: function (ds, indicator, params, series, regionset, callback) {
            if (typeof callback !== 'function') {
                // log error message
                return;
            }
            if (!ds || !indicator || !regionset) {
                // log error message
                callback('Datasource, regionset or indicator missing');
                return;
            }
            if (series && series.values.indexOf(params[series.id]) === -1) {
                callback('Requested dataset is out of range');
                return;
            }
            var me = this;
            var data = {
                datasource: ds,
                indicator: indicator,
                regionset: regionset,
                selectors: JSON.stringify(params || {})
            };

            var cacheKey = _cacheHelper.getIndicatorDataKey(ds, indicator, params, regionset);
            _log.debug('Getting data with key', cacheKey);

            function fractionInit (err, data) {
                var hash = me.state.getHash(ds, indicator, params, series);
                if (!err) {
                    me._setInitialFractions(hash, data);
                }
                callback(err, data);
            }
            if (this.cache.tryCachedVersion(cacheKey, fractionInit)) {
                // found a cached response
                return;
            }
            if (this.cache.addToQueue(cacheKey, fractionInit)) {
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
                url: Oskari.urls.getRoute('GetIndicatorData'),
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
        /**
         * @method @private _setInitialFractions
         * Sets initial fractionDigits for presentation of indicator
         * Zero if indicator has only integers values, otherwise 1
         * @param {String} indicatorHash
         * @param {Object} data indicator data
         */
        _setInitialFractions: function (indicatorHash, data) {
            var ind = this.state.getIndicator(indicatorHash);
            if (!ind) {
                return;
            }
            if (!ind.classification) {
                ind.classification = this.state.getClassificationOpts(indicatorHash);
            }
            if (typeof ind.classification.fractionDigits !== 'number') {
                var allInts = Object.keys(data).every(function (key) {
                    return data[key] % 1 === 0;
                });
                ind.classification.fractionDigits = allInts ? 0 : 1;
            }
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
                callback('No regionset selected');
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
                        series: ind.series,
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

                    me.getIndicatorData(ind.datasource, ind.indicator, ind.selections, ind.series, setId, function (err, indicatorData) {
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
        },
        saveIndicator: function (datasrc, data, callback) {
            var me = this;
            if (typeof callback !== 'function') {
                return;
            }
            if (!datasrc) {
                callback('Datasource missing');
                return;
            }
            if (!data) {
                callback('Data missing');
                return;
            }
            var responseHandler = function (err, indicatorId) {
                if (err) {
                    callback(err);
                    return;
                }
                // send out event about new/updated indicators
                var eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                me.sandbox.notifyAll(eventBuilder(datasrc));
                callback(null, {
                    ds: datasrc,
                    id: indicatorId
                });
            };

            if (!Oskari.user().isLoggedIn()) {
                // successfully saved for guest user
                var indicatorId = data.id || 'RuntimeIndicator' + Oskari.seq.nextVal('RuntimeIndicator');
                _cacheHelper.updateIndicatorInCache(datasrc, indicatorId, data, function (err) {
                    responseHandler(err, indicatorId);
                });
                return;
            }
            // send data to server for logged in users
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    // my indicators datasource id
                    datasource: datasrc,
                    id: data.id,
                    name: data.name,
                    desc: data.description,
                    // textual name for the source the data is from
                    source: data.datasource
                },
                url: Oskari.urls.getRoute('SaveIndicator'),
                success: function (pResp) {
                    _log.debug('SaveIndicator', pResp);
                    _cacheHelper.updateIndicatorInCache(datasrc, pResp.id, data, function (err) {
                        // send out event about new/updated indicators
                        responseHandler(err, pResp.id);
                    });
                },
                error: function (jqXHR, textStatus) {
                    responseHandler('Error saving data to server');
                }
            });
        },
        saveIndicatorData: function (datasrc, indicatorId, selectors, data, callback) {
            var me = this;
            if (typeof callback !== 'function') {
                return;
            }
            if (!datasrc) {
                callback('Datasource missing');
                return;
            }
            if (!indicatorId) {
                callback('Indicator missing');
                return;
            }
            if (!selectors) {
                callback('Selectors missing');
                return;
            }
            if (!data) {
                callback('Data missing');
                return;
            }
            var regionset = selectors.regionset;
            var actualSelectors = {};
            Object.keys(selectors).forEach(function (selectorId) {
                if (selectorId !== 'regionset') {
                    // filter out regionset
                    actualSelectors[selectorId] = selectors[selectorId];
                }
            });
            if (!Oskari.user().isLoggedIn()) {
                // successfully saved for guest user
                _cacheHelper.updateIndicatorDataCache(datasrc, indicatorId, actualSelectors, regionset, data, callback);
                // send out event about updated indicators
                me.sandbox.notifyAll(Oskari.eventBuilder('StatsGrid.DatasourceEvent')(datasrc));
                return;
            }
            // send data to server for logged in users
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: {
                    datasource: datasrc,
                    id: indicatorId,
                    selectors: JSON.stringify(actualSelectors),
                    regionset: regionset,
                    data: JSON.stringify(data)
                },
                url: Oskari.urls.getRoute('AddIndicatorData'),
                success: function (pResp) {
                    _log.debug('AddIndicatorData', pResp);
                    _cacheHelper.updateIndicatorDataCache(datasrc, indicatorId, actualSelectors, regionset, data, callback);
                    // send out event about updated indicators
                    me.sandbox.notifyAll(Oskari.eventBuilder('StatsGrid.DatasourceEvent')(datasrc));
                },
                error: function (jqXHR, textStatus) {
                    callback('Error saving data to server');
                }
            });
        },
        /**
         * selectors and regionset are optional -> will only delete dataset from indicator if given
         */
        deleteIndicator: function (datasrc, indicatorId, selectors, regionset, callback) {
            if (!Oskari.user().isLoggedIn()) {
                // just flush cache
                _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                callback();
                return;
            }
            var me = this;
            var data = {
                datasource: datasrc,
                id: indicatorId
            };
            if (selectors && typeof selectors === 'object') {
                // only remove dataset from indicator, not the whole indicator
                data.selectors = JSON.stringify(selectors);
                data.regionset = regionset;
            }
            jQuery.ajax({
                type: 'POST',
                dataType: 'json',
                data: data,
                url: Oskari.urls.getRoute('DeleteIndicator'),
                success: function (pResp) {
                    _log.debug('DeleteIndicator', pResp);
                    _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                    if (!selectors) {
                        // if selectors/regionset is missing -> trigger a DatasourceEvent as the indicator listing changes
                        var eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                        me.sandbox.notifyAll(eventBuilder(datasrc));
                    }
                    callback();
                },
                error: function (jqXHR, textStatus) {
                    callback('Error on server');
                }
            });
        },
        /**
         * @method  @public  getUnsupportedRegionsets
         * @description returns a list of unsupported regionsets for the currently selected datasource
         * @param datasource datasource
         */
        getUnsupportedRegionsets: function (ds) {
            var all = this.regionsets.slice(0);
            var supported = this.datasources.find(function (e) {
                return e.id === Number(ds);
            });
            if (supported) {
                supported.regionsets.forEach(function (index) {
                    for (var i = 0; i < all.length; i++) {
                        if (all[i].id === index) {
                            all.splice(i, 1);
                        }
                    }
                });
                return all;
            }
        },
        /**
         * @method  @public  getUnsupportedDatasets
         * @description returns a list of unsupported datasources for the currently selected regionset(s)
         * @param regionsets regionsets
         */
        getUnsupportedDatasetsList: function (regionsets) {
            if (regionsets === null) {
                return;
            }

            var unsupportedDatasources = [];
            this.datasources.forEach(function (ds) {
                var supported = regionsets.some(function (iter) {
                    return ds.regionsets.indexOf(Number(iter)) !== -1;
                });
                if (!supported) {
                    unsupportedDatasources.push(ds);
                }
            });
            return unsupportedDatasources;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
}(Oskari));
