import { StatisticsHandler } from '../handler/StatisticsHandler';
import { getHash } from '../helper/StatisticsHelper';

/**
 * @class Oskari.statistics.statsgrid.StatisticsService
 */
(function (Oskari) {
    /* eslint-disable n/no-callback-literal */
    const _log = Oskari.log('StatsGrid.StatisticsService');
    let _cacheHelper = null;

    Oskari.clazz.define('Oskari.statistics.statsgrid.StatisticsService', function (sandbox, conf = {}, locale) {
        this.sandbox = sandbox;
        this.locale = locale;
        this.stateHandler = new StatisticsHandler(this, conf);
        this.cache = Oskari.clazz.create('Oskari.statistics.statsgrid.Cache');
        _cacheHelper = Oskari.clazz.create('Oskari.statistics.statsgrid.CacheHelper', this.cache, this);
        this.series = Oskari.clazz.create('Oskari.statistics.statsgrid.SeriesService', sandbox, this.stateHandler);
        this.colors = Oskari.clazz.create('Oskari.statistics.statsgrid.ColorService');
        this.classification = Oskari.clazz.create('Oskari.statistics.statsgrid.ClassificationService', this.colors);
        this.error = Oskari.clazz.create('Oskari.statistics.statsgrid.ErrorService', sandbox);

        // attach on, off, trigger functions
        Oskari.makeObservable(this);

        // possible values: wms, vector
        this._mapModes = ['vector'];

        // Make series service listen for changes
        this.series.bindToEvents(this);

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
        setMapModes: function (mapModes) {
            this._mapModes = mapModes;
        },
        getMapModes: function () {
            return this._mapModes;
        },
        hasMapMode: function (mode) {
            const me = this;
            let hasMode = false;
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
        getClassificationService: function () {
            return this.classification;
        },
        getColorService: function () {
            return this.colors;
        },
        getErrorService: function () {
            return this.error;
        },
        getAllServices: function () {
            return {
                seriesService: this.series,
                classificationService: this.classification,
                colorService: this.colors,
                errorService: this.error
            };
        },
        getStateHandler: function () {
            return this.stateHandler;
        },
        getIndicator: function (hash) {
            return this.stateHandler.getState().indicators.find(ind => ind.hash === hash);
        },
        getUserDatasource: function () {
            return this.stateHandler.getState().datasources.find((src) => {
                return src.type === 'user';
            });
        },
        /**
         * Returns true if an indicator matching the datasource and id is still selected with any parameters.
         * Can be used to check if we should show the dataprovider information for the indicator or not.
         * @param  {Number}  ds datasource id
         * @param  {String}  id Indicator id
         * @return {Boolean} true if this indicator with any selections is still part of the selected indicators
         */
        isSelected: function (ds, id) {
            const indicators = this.stateHandler.getState().indicators;
            for (var i = 0; i < indicators.length; i++) {
                var ind = indicators[i];
                if (ind.datasource === ds && ind.indicator === id) {
                    return true;
                }
            }
            return false;
        },
        isSeriesActive: function () {
            const active = this.getIndicator(this.stateHandler.getState().activeIndicator);
            return active && !!active.series;
        },
        getUILabels: async function (ind) {
            const selectionValues = this.locale('panels.newSearch.selectionValues');
            const { datasource, indicator, selections, series } = ind;
            try {
                const metadata = await this.getIndicatorMetadata(datasource, indicator);
                if (!metadata) {
                    return {
                        error: true,
                        indicator: '',
                        params: '',
                        full: '',
                        paramsAsObject: {}
                    };
                }
                const { name, selectors, source } = metadata;
                const uiLabels = [];
                Object.keys(selections).forEach(key => {
                    const selection = selections[key];
                    const foundSelector = selectors.find(s => s.id === key);
                    if (foundSelector) {
                        const value = foundSelector.allowedValues.find(v => selection === v.id || selection === v);
                        const isObject = typeof value === 'object';
                        const selector = foundSelector.id;
                        const id = isObject ? value.id : value;
                        let label;
                        if (isObject) {
                            label = value.name;
                        } else {
                            // try finding localization for the param
                            label = Oskari.util.keyExists(selectionValues, selector + '.' + value) ? selectionValues[selector][value] : value;
                        }
                        uiLabels.push({ selector, id, label });
                    }
                });
                const localizedName = Oskari.getLocalized(name);
                let selectorsFormatted = ' (' + uiLabels.map(l => l.label).join(' / ') + ')';
                if (series) {
                    const range = String(series.values[0]) + ' - ' + String(series.values[series.values.length - 1]);
                    selectorsFormatted = range + ' ' + selectorsFormatted;
                }
                return {
                    indicator: localizedName,
                    source: Oskari.getLocalized(source),
                    params: selectorsFormatted,
                    full: localizedName + ' ' + selectorsFormatted,
                    paramsAsObject: uiLabels
                };
            } catch (error) {
                return {
                    error: true,
                    indicator: '',
                    params: '',
                    full: '',
                    paramsAsObject: {}
                };
            }
        },
        getDatasources: function () {
            return this.stateHandler.getState().datasources.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
        },
        /**
         * Returns datasource {id, name, type} as object.
         * If id omitted returns all datasources as array.
         * If datasource with matching id isn't found returns null.
         * @param  {Number} id datasource id
         * @return {Object[]|Object|Null} datasource information or null if not found
         */
        getDatasource: function (id) {
            const list = this.stateHandler.getState().datasources;
            if (!id) {
                return list;
            }
            let found = null;
            list.forEach((ds) => {
                if ('' + ds.id === '' + id) {
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
            const list = this.stateHandler.getState().regionsets || [];
            if (!list || list.length === 0) {
                return [];
            }
            const singleValue = typeof includeOnlyIds === 'number' || typeof includeOnlyIds === 'string';
            if (singleValue) {
                // wrap to an array
                includeOnlyIds = [includeOnlyIds];
            }
            if (Array.isArray(includeOnlyIds)) {
                const result = list.filter((reg) => {
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
                const onlyWithNames = result.regions.filter((region) => {
                    return !!region.name;
                });
                this.cache.respondToQueue(cacheKey, null, onlyWithNames);
                return onlyWithNames;
            } catch (error) {
                this.cache.respondToQueue(cacheKey, 'Error loading regions');
                throw new Error(error);
            }
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds       datasource id
         */
        getIndicatorList: async function (ds) {
            if (!ds) {
                // log error message
                throw new Error('Datasource missing');
            }
            const cacheKey = _cacheHelper.getIndicatorListKey(ds);
            const cachedResponse = this.cache.tryCachedVersion(cacheKey);
            if (cachedResponse) {
                // found a cached response
                return cachedResponse;
            }

            if (this.cache.addToQueue(cacheKey)) {
                // request already in progress
                return;
            }

            const getData = async () => {
                // call GetIndicatorList with parameter datasource=ds
                // use first param as error indicator - null == no error
                try {
                    const response = await fetch(Oskari.urls.getRoute('GetIndicatorList', {
                        datasource: ds
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
                    this.cache.respondToQueue(cacheKey, 'Error loading indicators');
                    throw new Error(this.locale('errors.indicatorListIsEmpty'));
                }
            };

            const updateIncompleteIndicatorList = async () => {
                _log.info('Indicator listing was not complete. Refreshing in 10 seconds');
                return new Promise((resolve, reject) => {
                    setTimeout(async () => {
                        this.cache.remove(cacheKey);
                        // try again after 10 seconds
                        resolve(await getData());
                    }, 10000);
                });
            };

            try {
                const response = await getData(ds);
                if (!response.complete) {
                    let result;
                    let i;
                    while (!result?.complete && i < 5) {
                        if (response.indicators?.length === result.indicators?.length) {
                            throw new Error('Same indicator list as in previous try. There might be some problems with the service');
                        }
                        result = await updateIncompleteIndicatorList(response.indicators);
                        i++;
                    }
                    if (!result?.complete) {
                        throw new Error('Error loading indicators');
                    }
                    return result;
                } else {
                    // send out event about new indicators
                    const eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                    this.sandbox.notifyAll(eventBuilder(ds));
                    return response;
                }
            } catch (error) {
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
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Object}   params    indicator selections
         * @param  {Object}   series    serie keys
         * @param  {Object}   regionset regionset
         */
        getIndicatorData: async function (ds, indicator, params, series, regionset) {
            if (!ds || !indicator || !regionset) {
                // log error message
                throw new Error('Datasource, regionset or indicator missing');
            }
            if (series && series.values.indexOf(params[series.id]) === -1) {
                throw new Error('Requested dataset is out of range');
            }

            const data = {
                datasource: ds,
                indicator: indicator,
                regionset: regionset,
                selectors: JSON.stringify(params || {})
            };

            const cacheKey = _cacheHelper.getIndicatorDataKey(ds, indicator, params, regionset);
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
                    ...data
                }), {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                if (!response.ok) {
                    const error = await response.json();
                    if (error?.error?.includes('No such regionset:')) {
                        this.cache.respondToQueue(cacheKey, []);
                        return [];
                    } else {
                        throw new Error(response.statusText);
                    }
                }
                const result = await response.json();
                const regions = await this.getRegions(regionset);
                // filter out data for regions that are not part of the regionset since some adapters return additional data!
                // any additional data will result in broken classification
                const filteredResponse = {};
                for (const reg of regions) {
                    filteredResponse[reg.id] = result[reg.id];
                }
                const hash = getHash(ds, indicator, params, series);
                this._setInitialFractions(hash, filteredResponse);
                this.cache.respondToQueue(cacheKey, null, filteredResponse);
                return filteredResponse;
            } catch (error) {
                this.cache.respondToQueue(cacheKey, 'Error loading indicator data');
                throw new Error(error);
            }
        },
        /**
         * @method @private _setInitialFractions
         * Sets initial fractionDigits for presentation of indicator
         * Zero if indicator has only integers values, otherwise 1
         * @param {String} indicatorHash
         * @param {Object} data indicator data
         */
        _setInitialFractions: function (indicatorHash, data) {
            const ind = this.getIndicator(indicatorHash);
            if (!ind) {
                return;
            }
            if (typeof ind.classification.fractionDigits !== 'number') {
                const allInts = Object.keys(data).every(function (key) {
                    return data[key] % 1 === 0;
                });
                ind.classification.fractionDigits = allInts ? 0 : 1;
            }
        },
        getSelectedIndicatorsRegions: async function () {
            const indicators = this.stateHandler.getState().indicators;
            const regionsets = [];
            const addRegions = function (regions) {
                for (let i = 0; i < regions.length; i++) {
                    if (jQuery.inArray(regions[i], regionsets) === -1) {
                        regionsets.push(regions[i]);
                    }
                }
            };
            for (let i = 0; i < indicators.length; i++) {
                const ind = indicators[i];
                try {
                    const indicator = await this.getIndicatorMetadata(ind.datasource, ind.indicator);
                    addRegions(indicator.regionsets);
                } catch (error) {
                    throw new Error(error);
                }
            }
            return regionsets;
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
                // send out event about updated indicators
                me.sandbox.notifyAll(Oskari.eventBuilder('StatsGrid.DatasourceEvent')(datasrc));
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
                // send out event about updated indicators
                me.sandbox.notifyAll(Oskari.eventBuilder('StatsGrid.DatasourceEvent')(datasrc));
                return result;
            } catch (error) {
                throw new Error('Error saving data to server');
            }
        },
        /**
         * selectors and regionset are optional -> will only delete dataset from indicator if given
         */
        deleteIndicator: async function (datasrc, indicatorId, selectors, regionset) {
            // remove indicators from state before deleting indicator data
            this.stateHandler.getState().indicators
                .filter(ind => ind.datasource === datasrc && ind.indicator === indicatorId)
                .forEach(ind => {
                    this.stateHandler.getController().removeIndicator(getHash(ind.datasource, ind.indicator, ind.selections, ind.series));
                });
            if (!Oskari.user().isLoggedIn()) {
                // just flush cache
                _cacheHelper.clearCacheOnDelete(datasrc, indicatorId, selectors, regionset);
                return;
            }
            const me = this;
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
                if (!selectors) {
                    // if selectors/regionset is missing -> trigger a DatasourceEvent as the indicator listing changes
                    const eventBuilder = Oskari.eventBuilder('StatsGrid.DatasourceEvent');
                    me.sandbox.notifyAll(eventBuilder(datasrc));
                }
                return result;
            } catch (error) {
                throw new Error('Error on server');
            }
        },
        /**
         * @method  @public  getUnsupportedRegionsets
         * @description returns a list of unsupported regionsets for the currently selected datasource
         * @param datasource datasource
         */
        getUnsupportedRegionsets: function (ds) {
            const { datasources, regionsets } = this.stateHandler.getState();
            const all = regionsets.slice(0);

            const supported = datasources.find(function (e) {
                return e.id === Number(ds);
            });
            if (supported) {
                supported.regionsets.forEach(function (index) {
                    for (let i = 0; i < all.length; i++) {
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

            const unsupportedDatasources = [];
            const datasources = this.stateHandler.getState().datasources;
            datasources.forEach(function (ds) {
                const supported = regionsets.some(function (iter) {
                    return ds.regionsets.indexOf(Number(iter)) !== -1;
                });
                if (!supported) {
                    unsupportedDatasources.push(ds);
                }
            });
            return unsupportedDatasources;
        }
    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
}(Oskari));
