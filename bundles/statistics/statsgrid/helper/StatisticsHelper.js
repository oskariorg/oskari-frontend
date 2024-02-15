export const getHashForIndicator = ({ ds, id, selections, series }) => {
    return getHash(ds, id, selections, series);
};

/**
 * Returns a string that can be used to identify an indicator including selections.
 * Shouldn't be parsed to detect which indicator is in question, but used as a simple
 * token to identify a selected indicator or set an active indicator
 * @param  {Number} datasrc    datasource id
 * @param  {Number} indicator  indicator id
 * @param  {Object} selections object containing the parameters for the indicator
 * @param  {Object} series object containing series values for the indicator
 * @return {String}            an unique id for the parameters
 */
export const getHash = (datasrc, indicator, selections, series) => {
    let hash = datasrc + '_' + indicator;
    let seriesKey = '';
    if (typeof series === 'object' && series !== null) {
        seriesKey = series.id;
        hash += '_' + series.id + '=' + series.values[0] + '-' + series.values[series.values.length - 1];
    }
    if (typeof selections === 'object') {
        hash = hash + '_' + Object.keys(selections).filter((key) => {
            // exclude series selection
            return seriesKey !== key;
        }).sort().map((key) => {
            return key + '=' + JSON.stringify(selections[key]);
        }).join(':');
    }
    return hash;
};

export const getDataProviderKey = (indicator) => indicator.ds + '_' + indicator.id;

// filter out data for regions that are not part of the regionset since some adapters return additional data!
// any additional data will result in broken classification
export const populateData = (data, regions, regionset, fractionDigits) => {
    const { format } = Number.isInteger(fractionDigits) ? Oskari.getNumberFormatter(fractionDigits) : {};
    const dataByRegions = [];
    let allInts = true;
    const values = new Set();
    for (const reg of regions) {
        const { id, name } = reg;
        //TODO: validate?
        const value = data[id];
        const formatted = typeof format === 'function' ? format(value) : '';
        dataByRegions.push({ id, value, name, formatted });
        if (value === null || isNaN(value)) {
            continue;
        }
        if (allInts && value % 1 !== 0) {
            allInts = false;
        }
        values.add(value);
    }
    const unique = [...values].sort((a, b) => a - b);
    if (!unique.length) {
         return { error: 'noData', dataByRegions: [] };
    }
    return {
        dataByRegions,
        regionset,
        allInts,
        min: unique[0],
        max: unique[unique.length - 1],
        uniqueCount: unique.length
    };
};

// filter out data for regions that are not part of the regionset since some adapters return additional data!
// any additional data will result in broken classification
export const populateSeriesData = (data, regions, regionset, fractionDigits) => {
    const dataBySelection = {};
    let seriesValues = [];
    let seriesAllInts = true;
    let seriesMin = Number.POSITIVE_INFINITY;
    let seriesMax = Number.NEGATIVE_INFINITY;
    Object.keys(data).forEach(selector => {
        const { dataByRegions, allInts, min, max, error } = populateData(data[selector], regions, regionset, fractionDigits);
        dataBySelection[selector] = dataByRegions;
        if (error) {
            return;
        }
        dataByRegions.forEach(d => seriesValues.push(d.value));
        seriesMax = seriesMax > max  ? seriesMax : max;
        seriesMin = seriesMin < min ? seriesMin : min;
        if (allInts === false) {
            seriesAllInts = false;
        }
    });
    return {
        dataByRegions: [], // TODO: remove when all components handles series
        dataBySelection,
        regionset,
        seriesValues, // needed for series bounds
        min: seriesMin,
        max: seriesMax,
        uniqueCount: new Set(seriesValues).size
    };
};

export const formatData = (data, classification) => {
    const { dataByRegions, dataBySelection } = data;
    const { format } = Oskari.getNumberFormatter(classification.fractionDigits);
    if (dataByRegions) {
        dataByRegions.forEach(region => region.formatted = format(region.value));
    } else if (dataBySelection) {
        Object.keys(dataBySelection).forEach(selector => {
            dataBySelection[selector].forEach(region => region.formatted = format(region.value));
        });
    }
};

export const getUILabels = (ind, metadata) => {
    const selectionValues = Oskari.getMsg('StatsGrid' ,'panels.newSearch.selectionValues');
    const { selections, series } = ind;
    const getError = () => ({
        error: true,
        indicator: '',
        params: '',
        full: '',
        range: '',
        paramsList: []
    });
    try {
        if (!metadata) {
            return getError();
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
        let selectorsFormatted = '(' + uiLabels.map(l => l.label).join(' / ') + ')';
        const range = series ? series.values[0] + ' - ' + series.values[series.values.length - 1] : '';
        if (range) {
            selectorsFormatted = range + ' ' + selectorsFormatted;
        }
        return {
            indicator: localizedName,
            source: Oskari.getLocalized(source),
            params: selectorsFormatted,
            full: localizedName + ' ' + selectorsFormatted,
            paramsList: uiLabels,
            range
        };
    } catch (error) {
        return getError();
    }
};

// series needs to update labels on selected change
export const getUpdatedLabels = (labels, selections) => {
    if (!labels.range) {
        // only labels with range should be updated
        return labels;
    }
    // Doesn't validate selectors
    const paramsList = Object.keys(selections).map( selector => {
        const value = selections[selector];
        return {
            selector,
            id: value,
            label: value
        };
    });
    const params = '(' + paramsList.map(l => l.label).join(' / ') + ')';
    return {
        ...labels,
        full: labels.indicator + ' ' + labels.range + ' ' + params,
        params,
        paramsList
    };
};
