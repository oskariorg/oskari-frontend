import { getHash } from '../helper/StatisticsHelper';

/**
 * @class Oskari.statistics.statsgrid.StatisticsService
 */
(function (Oskari) {
    /* eslint-disable n/no-callback-literal */
    const _log = Oskari.log('StatsGrid.StatisticsService');
    let _cacheHelper = null;

    Oskari.clazz.define('Oskari.statistics.statsgrid.StatisticsService', function (instance, locale) {
        this.sandbox = instance.getSandbox();
        this.locale = locale;
        this.stateHandler = stateHandler;
        this.cache = Oskari.clazz.create('Oskari.statistics.statsgrid.Cache');
        _cacheHelper = Oskari.clazz.create('Oskari.statistics.statsgrid.CacheHelper', this.cache, this);

        this.log = Oskari.log(this.getQName());
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
        /**
         * Calls callback with a list of regions for the regionset.
         * @param  {Number}   regionset regionset id
         */
        getRegions: async function (regionset) {
            if (!regionset) {
                this.log.warn('Requested regions without regionset');
                throw new Error('Regionset missing');
            }

            const cacheKey = _cacheHelper.getRegionsKey(regionset);
            const cachedResponse = this.cache.tryCachedVersion(cacheKey);
            if (cachedResponse) {
                // found a cached response
                return cachedResponse;
            }

            if (this.cache.addToQueue(cacheKey)) {
                // request already in progress
                return;
            }
            // call GetRegions with parameter regionset=regionset
            // use first param as error indicator - null == no error
            try {
                const response = await fetch(Oskari.urls.getRoute('GetRegions', {
                    regionset,
                    srs: this.sandbox.getMap().getSrsName()
                }), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                const onlyWithNames = result.regions.filter(region => region.name);
                this.cache.respondToQueue(cacheKey, null, onlyWithNames);
                return onlyWithNames;
            } catch (error) {
                this.cache.respondToQueue(cacheKey, 'Error loading regions');
                throw new Error(error);
            }
        },

        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         */
        getIndicatorMetadata: async function (ds, indicator) {
            if (!ds || !indicator) {
                // log error message
                throw new Error('Datasource or indicator missing');
            }

            const cacheKey = _cacheHelper.getIndicatorMetadataKey(ds, indicator);
            const cachedResponse = this.cache.tryCachedVersion(cacheKey);
            if (cachedResponse) {
                // found a cached response
                return cachedResponse;
            }

            if (this.cache.addToQueue(cacheKey)) {
                // request already in progress
                return;
            }
            // call GetIndicatorMetadata with parameter datasource=ds and indicator=indicator
            // use first param as error indicator - null == no error
            try {
                const response = await fetch(Oskari.urls.getRoute('GetIndicatorMetadata', {
                    datasource: ds,
                    indicator
                }), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();

                this.cache.respondToQueue(cacheKey, null, result);
                return result;
            } catch (error) {
                this.cache.respondToQueue(cacheKey, 'Error loading indicator metadata');
                throw new Error(error);
            }
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Object}   indicator indicator id
         * @param  {Number}   regionset regionset
         */
        getIndicatorData: async function (indicator = {}, regionset) {
            const { ds, id, selections, series } = indicator;
            if (!ds || !id || !regionset) {
                // log error message
                throw new Error('Datasource, regionset or indicatorId missing');
            }
            if (series && series.values.indexOf(selections[series.id]) === -1) {
                throw new Error('Requested dataset is out of range');
            }

            const cacheKey = _cacheHelper.getIndicatorDataKey(ds, id, selections, regionset);
            _log.debug('Getting data with key', cacheKey);

            const cachedResponse = this.cache.tryCachedVersion(cacheKey);
            if (cachedResponse) {
                // found a cached response
                return cachedResponse;
            }

            if (this.cache.addToQueue(cacheKey)) {
                // request already in progress
                return;
            }
            // call GetIndicatorData with parameters:
            // - datasource=ds
            // - indicator=indicator
            // - selectors=serialized params
            // - regionset = regionset
            // use first param as error indicator - null == no error
            try {
                const response = await fetch(Oskari.urls.getRoute('GetIndicatorData', {
                    datasource: ds,
                    indicator: id,
                    regionset,
                    selectors: JSON.stringify(selections || {})
                }), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    const error = await response.json();
                    // error?.error?.includes('No such regionset:')
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                this.cache.respondToQueue(cacheKey, null, result);
                return result;
            } catch (error) {
                this.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                throw new Error(error);
            }
        },
        saveIndicator: async function (datasrc, data) {
            if (!datasrc) {
                throw new Error('Datasource missing');
            }
            if (!data) {
                throw new Error('Data missing');
            }

            if (!Oskari.user().isLoggedIn()) {
                // successfully saved for guest user
                const indicatorId = data.id || 'RuntimeIndicator' + Oskari.seq.nextVal('RuntimeIndicator');
                _cacheHelper.updateIndicatorInCache(datasrc, indicatorId, data);
                return {
                    ds: datasrc,
                    id: indicatorId
                };
            }
            const body = {
                // my indicators datasource id
                datasource: datasrc,
                name: data.name,
                desc: data.description,
                // textual name for the source the data is from
                source: data.datasource
            };

            if (data.id) {
                body.id = data.id;
            }
            // send data to server for logged in users
            try {
                const response = await fetch(Oskari.urls.getRoute('SaveIndicator'), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams(body)
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                _log.debug('SaveIndicator', result);
                _cacheHelper.updateIndicatorInCache(datasrc, result.id, data);
                return {
                    ds: datasrc,
                    id: result.id
                };
            } catch (error) {
                throw new Error('Error saving data to server');
            }
        },
        saveIndicatorData: async function (datasrc, indicatorId, selectors, data) {
            const me = this;
            if (!datasrc) {
                throw new Error('Datasource missing');
            }
            if (!indicatorId) {
                throw new Error('Indicator missing');
            }
            if (!selectors) {
                throw new Error('Selectors missing');
            }
            if (!data) {
                throw new Error('Data missing');
            }
            const regionset = selectors.regionset;
            const actualSelectors = {};
            Object.keys(selectors).forEach(function (selectorId) {
                if (selectorId !== 'regionset') {
                    // filter out regionset
                    actualSelectors[selectorId] = selectors[selectorId];
                }
            });
            if (!Oskari.user().isLoggedIn()) {
                // successfully saved for guest user
                _cacheHelper.updateIndicatorDataCache(datasrc, indicatorId, actualSelectors, regionset, data);
                return;
            }
            // send data to server for logged in users
            try {
                const response = await fetch(Oskari.urls.getRoute('AddIndicatorData'), {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: new URLSearchParams({
                        datasource: datasrc,
                        id: indicatorId,
                        selectors: JSON.stringify(actualSelectors),
                        regionset: regionset,
                        data: JSON.stringify(data)
                    })
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                _log.debug('AddIndicatorData', result);
                _cacheHelper.updateIndicatorDataCache(datasrc, indicatorId, actualSelectors, regionset, data);
                return result;
            } catch (error) {
                throw new Error('Error saving data to server');
            }
        },
        /**
         * selectors and regionset are optional -> will only delete dataset from indicator if given
         */
        deleteIndicator: async function (datasrc, indicatorId, selectors, regionset) {
            const stateHandler = this.instance.getStateHandler();
            if (!stateHandler) {
                throw new Error('Failed to get state handler');
            }
            // remove indicators from state before deleting indicator data
            stateHandler.getController().removeIndicators(datasrc, indicatorId);
            if (!Oskari.user().isLoggedIn()) {
                // just flush cache
                _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                return;
            }
            const data = {
                datasource: datasrc,
                id: indicatorId
            };

            const postData = new URLSearchParams(data);
            postData.append('datasource', datasrc);
            postData.append('id', indicatorId);
            if (selectors && typeof selectors === 'object') {
                // only remove dataset from indicator, not the whole indicator
                postData.append('selectors', JSON.stringify(selectors));
                postData.append('regionset', regionset);
            }

            try {
                const response = await fetch(Oskari.urls.getRoute('DeleteIndicator'), {
                    method: 'POST',
                    body: postData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const result = await response.json();
                _log.debug('DeleteIndicator', result);
                _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                return result;
            } catch (error) {
                throw new Error('Error on server');
            }
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
}(Oskari));
