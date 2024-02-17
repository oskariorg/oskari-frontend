import { getHash, getDataProviderKey, populateData, populateSeriesData} from '../helper/StatisticsHelper';
import { updateIndicatorListInCache, removeIndicatorFromCache } from './SearchIndicatorOptionsHelper';
import { getRegionsAsync } from '../helper/RegionsHelper';

const statsGridLocale = Oskari.getMsg.bind(null, 'StatsGrid');
// cache storage object
const indicatorMetadataStore = {};
const indicatorDataStore = {};
const getMetaCacheKey = (datasourceId, indicatorId) => 'ds_' + datasourceId + '_ind_' + indicatorId;
const getDataCacheKey = (indicator, regionsetId) => 'hash_' + indicator.hash + '_rs_' + regionsetId;

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
        // cache results
        indicatorMetadataStore[cacheKey] = result;
        return result;
    } catch (error) {
        throw new Error(error);
    }
};

export const getDataForIndicator = async (indicator, regionset) => {
    const regions = await getRegionsAsync(regionset);
    let data = {};
    const fractionDigits = indicator?.classification?.fractionDigits;
    if (indicator.series) {
        const { id, values } = indicator.series;
        const dataBySelection = {};
        for (let i = 0; i < values.length; i++) {
            const value = values[i];
            const selections = {...indicator.selections, [id]: value};
            const rawData = await getIndicatorData({...indicator, selections}, regionset);
            dataBySelection[value] = rawData;
        }
        data = populateSeriesData(dataBySelection, regions, regionset, fractionDigits);
    } else {
        const rawData = await getIndicatorData(indicator, regionset);
        data = populateData(rawData, regions, regionset, fractionDigits);
    }
    return data;
}

export const getIndicatorData = async (indicator, regionsetId) => {
    const { ds, id, selections = {} } = indicator;
    if (!ds || !id || !regionsetId) {
        throw new Error('Datasource, regionset or indicator id missing');
    }
    const cacheKey = getDataCacheKey(indicator, regionsetId);
    const cachedResponse = indicatorDataStore[cacheKey];
    if (cachedResponse) {
        // found a cached response
        return cachedResponse;
    }
    try {
        const response = await fetch(Oskari.urls.getRoute('GetIndicatorData', {
            datasource: ds,
            indicator: id,
            regionset: regionsetId,
            selectors: JSON.stringify(selections)
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
        updateIndicatorListInCache({ ...indicator, id });
        return id;
    }
    try {
        const response = await fetch(Oskari.urls.getRoute('SaveIndicator'), {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            // All keys used in Frontend doesn't match backend
            body: new URLSearchParams({
                datasource: indicator.ds,
                id: indicator.id,
                name: indicator.name,
                desc: indicator.description,
                source: indicator.source
            })
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const result = await response.json();
        console.log('does result contain required', result);
        updateIndicatorListInCache({ ...indicator, id: result.id });
        return result.id;
    } catch (error) {
        throw new Error('Error saving data to server');
    }
};

export const saveIndicatorData = async (indicator, data, regionset) => {
    if (!indicator || !regionset || !indicator.hash) {
        throw new Error('Indicator (id, hash, selections, data) or regionset missing');
    }
    const cacheKey = getDataCacheKey(indicator, regionsetId);
    if (!Oskari.user().isLoggedIn()) {
        // successfully saved for guest user
        indicatorDataStore[cacheKey] = data;
        //updateIndicatorListInCache();
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
                datasource: indicator.ds,
                id: indicator.id,
                selectors: JSON.stringify(selections),
                regionset,
                data: JSON.stringify(data)
            })
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const result = await response.json();
        console.log('saved data', result);
        indicatorDataStore[cacheKey] = result;
        // updateIndicatorListInCache();
        return;
    } catch (error) {
        throw new Error('Error saving data to server');
    }
};
// selectors and regionset are optional -> will only delete dataset from indicator if given
export const deleteIndicator = async (indicator, regionset) => {
    // TODO: remove indicators from state before deleting indicator data
    const { ds: datasource, ...rest } = indicator;
    const flushDataCache = () => {
        // clearCacheOnDelete
        if (rest.selections) {
            // remove selections and regionset related data (one dataset)
            const cacheKey = getDataCacheKey(indicator, regionsetId);
            delete indicatorDataStore[cacheKey];
        } else {
            // remove all
            const prefix = getDataProviderKey(indicator);
            const hashes = Object.keys(indicatorDataStore);
            hashes.forEach(hash => {
                if (hash.includes(prefix)) {
                    delete indicatorDataStore[cacheKey];
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
        ...indicator,
        regionset
    };
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
        const result = await response.json();
        console.log('delete', result);
        flushDataCache();
        removeIndicatorFromCache(indicator);
        return;
    } catch (error) {
        throw new Error('Error on server');
    }
};

export const getIndicatorObjectToAdd = async (datasourceId, indicatorId, selections, series) => {
    const { name, selectors: availableIndicatorSelectors, source } = await getIndicatorMetadata(datasourceId, indicatorId);
    const localizedIndicatorName = Oskari.getLocalized(name);
    const uiLabels = [];
    Object.keys(selections).forEach(selectorId => {
        const currentParameter = selections[selectorId];
        const indicatorSelector = getIndicatorSelector(availableIndicatorSelectors, selectorId);
        if (!indicatorSelector) {
            // function received a selection that the current indicator doesn't support
            // this can happen when adding multiple indicators in one go
            // selections are combined from all indicators for the UI when adding multiple indicators at once
            // -> not all indicators might have all those parameters/selections -> just skip it in that case
            return;
        }
        let selectorValue = indicatorSelector.allowedValues.find(v => currentParameter === v.id || currentParameter === v);
        if (typeof selectorValue !== 'object') {
            // normalize single value to object with id and value
            selectorValue = {
                id: selectorValue,
                name: selectorValue
            };
        }
        const label = getSelectorValueLocalization(indicatorSelector.id, selectorValue.id) || selectorValue.name;
        uiLabels.push({
            selectorId,
            id: selectorValue.id,
            label
        });
    });
    let selectorsFormatted = ' (' + uiLabels.map(l => l.label).join(' / ') + ')';
    if (series) {
        const range = String(series.values[0]) + ' - ' + String(series.values[series.values.length - 1]);
        selectorsFormatted = range + ' ' + selectorsFormatted;
    }
    return {
        datasource: Number(datasourceId),
        indicator: indicatorId,
        // selections are the params like year=2020 etc
        selections,
        // series is the time range for time series selection
        series,
        hash: getHash(datasourceId, indicatorId, selections, series),
        labels: {
            indicator: localizedIndicatorName,
            source: Oskari.getLocalized(source),
            params: selectorsFormatted,
            full: localizedIndicatorName + ' ' + selectorsFormatted,
            paramsAsObject: uiLabels
        }
    };
};

const getSelectorValueLocalization = (paramName, paramValue) => {
    const localeKey = 'panels.newSearch.selectionValues.' + paramName + '.' + paramValue;
    const value = statsGridLocale(localeKey);
    if (value === localeKey) {
        // returned the localeKey -> we don't have a localized label for this
        return null;
    }
    return value;
};

// returns the selector object from available IF it is supported
const getIndicatorSelector = (availableSelectors, selectorId) => {
    return availableSelectors.find(s => s.id === selectorId);
};
