import { getHash, getDataProviderKey, populateData, populateSeriesData } from '../helper/StatisticsHelper';
import { updateIndicatorListInCache, removeIndicatorFromCache } from './SearchIndicatorOptionsHelper';
import { getRegionsAsync } from '../helper/RegionsHelper';
import { BUNDLE_KEY } from '../constants';

// cache storage object
const indicatorMetadataStore = {};
const indicatorDataStore = {};
const getMetaCacheKey = (datasourceId, indicatorId) => 'ds_' + datasourceId + '_ind_' + indicatorId;
const getDataCacheKey = (indicator, regionsetId) => {
    // Don't use series for hash because every time is stored separately
    const hash = getHash(indicator.ds, indicator.id, indicator.selections);
    return 'hash_' + hash + '_rs_' + regionsetId;
};

// for guest user's own indicators
const updateIndicatorMetadataInCache = (indicator, regionsetId) => {
    const { selections = {}, ...restToStore } = indicator;
    const cacheKey = getMetaCacheKey(indicator.ds, indicator.id);
    const cachedResponse = indicatorMetadataStore[cacheKey];
    // user indicator has actually only one selector 'year' which is time param
    const selectors = Object.keys(selections).map(id => {
        const value = selections[id];
        return {
            id,
            time: true,
            values: [{ value, label: value }]
        };
    });
    // store metadata like processMetadata
    if (!cachedResponse) {
        indicatorMetadataStore[cacheKey] = {
            ...restToStore,
            public: true,
            regionsets: regionsetId ? [regionsetId] : [],
            selectors
        };
        return;
    }
    cachedResponse.name = indicator.name;
    cachedResponse.description = indicator.description;
    cachedResponse.source = indicator.source;
    if (regionsetId && !cachedResponse.regionsets.includes(regionsetId)) {
        cachedResponse.regionsets.push(regionsetId);
    }
    // update allowed values
    const { selectors: cachedSelectors } = cachedResponse;
    selectors.forEach(selector => {
        const cached = cachedSelectors.find(s => s.id === selector.id);
        if (!cached) {
            cachedSelectors.push(selector);
            return;
        }
        selector.values.forEach(value => {
            if (cached.values.some(v => v.id === value.id)) {
                // already added
                return;
            }
            cached.values.push(value);
        });
    });
};

const flushIndicatorMetadataCache = (indicator) => {
    const { id, ds } = indicator;
    const cacheKey = getMetaCacheKey(ds, id);
    indicatorMetadataStore[cacheKey] = null;
};

export const getCachedMetadata = (datasourceId, indicatorId) => {
    const cacheKey = getMetaCacheKey(datasourceId, indicatorId);
    return indicatorMetadataStore[cacheKey] || {};
};

export const getIndicatorMetadata = async (datasourceId, indicatorId) => {
    if (!datasourceId || !indicatorId) {
        throw new Error('Datasource or indicator missing');
    }
    const cacheKey = getMetaCacheKey(datasourceId, indicatorId);
    const cachedResponse = indicatorMetadataStore[cacheKey];
    if (cachedResponse) {
        // found a cached response
        return cachedResponse;
    }

    try {
        const response = await fetch(Oskari.urls.getRoute('GetIndicatorMetadata', {
            datasource: datasourceId,
            indicator: indicatorId
        }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const result = await response.json();
        const processed = processMetadata(result);
        // cache results
        indicatorMetadataStore[cacheKey] = processed;
        return processed;
    } catch (error) {
        // TODO: indicatorMetadataError
        throw new Error(error);
    }
};
const processMetadata = (meta) => {
    const locValues = Oskari.getMsg(BUNDLE_KEY, 'panels.newSearch.selectionValues');
    const locParams = Oskari.getMsg(BUNDLE_KEY, 'parameters');
    const metaSelectors = meta.selectors || [];
    const selectors = [];
    metaSelectors.forEach(metaSelector => {
        const { id, allowedValues, time = false } = metaSelector;
        const values = allowedValues.map(val => {
            // value or { name, id }
            const value = val.id || val;
            const name = val.name || value;
            const label = locValues[id]?.[name] || name;
            // use value, label to use as Select option
            return { value, label };
        });
        const label = locParams[id] || id;
        const selector = { id, values, time, label };
        if (time) {
            selectors.unshift(selector);
        } else {
            selectors.push(selector);
        }
    });
    const name = Oskari.getLocalized(meta.name) || '';
    const source = Oskari.getLocalized(meta.source) || '';
    const description = Oskari.getLocalized(meta.description) || '';
    return { ...meta, name, source, description, selectors };
};

export const getDataForIndicator = async (indicator, regionset) => {
    const regions = await getRegionsAsync(regionset);
    // TODO: regionsetsIsEmpty
    let data = {};
    const fractionDigits = indicator?.classification?.fractionDigits;
    if (indicator.series) {
        const { id, values } = indicator.series;
        const dataBySelection = {};
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const selections = { ...indicator.selections, [id]: value };
            let rawData = {};
            try {
                rawData = await getIndicatorData({ ...indicator, selections }, regionset);
            } catch (ignored) {}
            dataBySelection[value] = rawData;
        }
        data = populateSeriesData(dataBySelection, regions, regionset, fractionDigits);
    } else {
        let rawData = {};
        try {
            rawData = await getIndicatorData(indicator, regionset);
        } catch (ignored) {}
        data = populateData(rawData, regions, regionset, fractionDigits);
    }
    return data;
};

export const getIndicatorData = async (indicator, regionsetId) => {
    if (!indicator || !regionsetId) {
        throw new Error('Indicator (id, ds, selections) or regionset id missing');
    }
    const cacheKey = getDataCacheKey(indicator, regionsetId);
    const cachedResponse = indicatorDataStore[cacheKey];
    if (cachedResponse) {
        // found a cached response
        return cachedResponse;
    }
    try {
        const response = await fetch(Oskari.urls.getRoute('GetIndicatorData', {
            datasource: indicator.ds,
            indicator: indicator.id,
            regionset: regionsetId,
            selectors: JSON.stringify(indicator.selections)
        }), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            const { error = '' } = await response.json();
            if (error.includes('No such regionset:')) {
                return {};
            }
            throw new Error(response.statusText);
        }
        const result = await response.json();
        indicatorDataStore[cacheKey] = result;
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const saveIndicator = async (indicator) => {
    if (!indicator) {
        throw new Error('Indicator missing');
    }
    if (!Oskari.user().isLoggedIn()) {
        const id = indicator.id || 'RuntimeIndicator' + Oskari.seq.nextVal('RuntimeIndicator');
        const saved = { ...indicator, id };
        updateIndicatorListInCache(saved);
        updateIndicatorMetadataInCache(saved);
        return id;
    }
    // All keys used in Frontend doesn't match backend
    const body = {
        datasource: indicator.ds,
        name: indicator.name,
        desc: indicator.description,
        source: indicator.source
    };
    if (indicator.id) {
        body.id = indicator.id;
    }
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
        // Flush cache as update is implemented only for quest user
        removeIndicatorFromCache({ ds: indicator.ds });
        return result.id;
    } catch (error) {
        throw new Error('Error saving data to server');
    }
};

export const saveIndicatorData = async (indicator, data, regionsetId) => {
    if (!indicator || !data || !regionsetId) {
        throw new Error('Indicator (id, ds, selections), data or regionset id missing');
    }
    const cacheKey = getDataCacheKey(indicator, regionsetId);
    if (!Oskari.user().isLoggedIn()) {
        // successfully saved for guest user
        indicatorDataStore[cacheKey] = data;
        updateIndicatorListInCache(indicator, regionsetId);
        updateIndicatorMetadataInCache(indicator, regionsetId);
        return;
    }
    // send data to server for logged in users
    try {
        const response = await fetch(Oskari.urls.getRoute('AddIndicatorData'), {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: new URLSearchParams({
                datasource: indicator.ds,
                id: indicator.id,
                selectors: JSON.stringify(indicator.selections),
                regionset: regionsetId,
                data: JSON.stringify(data)
            })
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        await response.json();
        // Flush cache as update is implemented only for quest user
        removeIndicatorFromCache({ ds: indicator.ds });
        flushIndicatorMetadataCache(indicator);
    } catch (error) {
        throw new Error('Error saving data to server');
    }
};
// selectors and regionset are optional -> will only delete dataset from indicator if given
export const deleteIndicator = async (indicator, regionsetId) => {
    const flushDataCache = () => {
        // clearCacheOnDelete
        const cacheKey = getDataCacheKey(indicator, regionsetId);
        if (indicator.selections) {
            // remove selections and regionset related data (one dataset)
            delete indicatorDataStore[cacheKey];
        } else {
            // remove all
            const prefix = getDataProviderKey(indicator);
            Object.keys(indicatorDataStore).forEach(key => {
                if (key.includes(prefix)) {
                    delete indicatorDataStore[key];
                }
            });
        }
    };
    if (!Oskari.user().isLoggedIn()) {
        // just flush caches
        flushDataCache();
        removeIndicatorFromCache(indicator);
        return;
    }
    const data = {
        datasource: indicator.ds,
        id: indicator.id
    };
    // only remove dataset from indicator, not the whole indicator
    if (indicator.selections) {
        data.selectors = JSON.stringify(indicator.selections);
        data.regionset = regionsetId;
    }
    try {
        const response = await fetch(Oskari.urls.getRoute('DeleteIndicator'), {
            method: 'POST',
            body: new URLSearchParams(data),
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        await response.json();
        flushDataCache();
        // Flush caches as update is implemented only for quest user
        removeIndicatorFromCache({ ds: indicator.ds });
    } catch (error) {
        throw new Error('Error on server');
    }
};
