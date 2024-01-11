import { getHash } from '../helper/StatisticsHelper';

const statsGridLocale = Oskari.getMsg.bind(null, 'StatsGrid');
// cache storage object
const indicatorMetadataStore = {};
const getCacheKey = (datasourceId, indicatorId) => 'ds_' + datasourceId + '_ind_' + indicatorId;

export const getIndicatorMetadata = async (datasourceId, indicatorId) => {
    if (!datasourceId || !indicatorId) {
        // log error message
        throw new Error('Datasource or indicator missing');
    }
    const cacheKey = getCacheKey(datasourceId, indicatorId);
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
