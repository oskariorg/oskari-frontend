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

export const getValueSorter = asc => {
    return (a, b) => {
        if (a.value === b.value) return 0;
        if (typeof a.value === 'undefined') return -1;
        if (typeof b.value === 'undefined') return 1;
        return asc ? b.value - a.value : a.value - b.value;
    };
};

export const getDataByRegions = (indicator, optRegionset) => {
    const { dataByRegions, dataBySelection, regionset } = indicator.data || {};
    // use optional regionset to be sure that we have right data
    if (optRegionset && optRegionset !== regionset) {
        return [];
    }
    if (dataBySelection) {
        const { id } = indicator.series || {};
        const selection = indicator.selections[id];
        if (Array.isArray(dataBySelection[selection])) {
            return dataBySelection[selection];
        }
    }
    if (Array.isArray(dataByRegions)) {
        return dataByRegions;
    }
    return [];
};

// filter out data for regions that are not part of the regionset since some adapters return additional data!
// any additional data will result in broken classification
export const populateData = (data, regions, regionset, fractionDigits) => {
    const { format } = Number.isInteger(fractionDigits) ? Oskari.getNumberFormatter(fractionDigits) : {};
    const dataByRegions = [];
    let allInts = true;
    const values = new Set();
    // also table assumes that every region has value and list is ordered by regions
    regions.forEach(({ id, name }) => {
        const value = data[id];
        const ignore = value === null || isNaN(value);
        const formatted = !ignore && typeof format === 'function' ? format(value) : '';
        // use undefined always to simplify value exits checks and sorting (region without value is sorted last)
        dataByRegions.push({ id, value: ignore ? undefined : value, name, formatted });
        if (ignore) {
            return;
        }
        if (allInts && value % 1 !== 0) {
            allInts = false;
        }
        values.add(value);
    });
    const unique = [...values].sort((a, b) => a - b);
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
    const seriesValues = [];
    let seriesAllInts = true;
    let seriesMin = Number.POSITIVE_INFINITY;
    let seriesMax = Number.NEGATIVE_INFINITY;
    Object.keys(data).forEach(selector => {
        const { dataByRegions, allInts, min, max, error } = populateData(data[selector], regions, regionset, fractionDigits);
        dataBySelection[selector] = dataByRegions;
        if (error) {
            return;
        }
        dataByRegions.forEach(d => {
            if (typeof d.value === 'undefined') {
                return;
            }
            seriesValues.push(d.value);
        });
        seriesMax = seriesMax > max ? seriesMax : max;
        seriesMin = seriesMin < min ? seriesMin : min;
        if (allInts === false) {
            seriesAllInts = false;
        }
    });
    return {
        dataBySelection,
        regionset,
        seriesValues, // needed for series bounds
        min: seriesMin,
        max: seriesMax,
        allInts: seriesAllInts,
        uniqueCount: new Set(seriesValues).size
    };
};

export const formatData = (data, classification) => {
    const { dataByRegions, dataBySelection } = data;
    const { format } = Oskari.getNumberFormatter(classification.fractionDigits);
    const fomatRegion = region => {
        region.formatted = typeof region.value === 'undefined' ? '' : format(region.value);
    };
    if (dataByRegions) {
        dataByRegions.forEach(fomatRegion);
    } else if (dataBySelection) {
        Object.keys(dataBySelection).forEach(selector => {
            dataBySelection[selector].forEach(fomatRegion);
        });
    }
};

export const getUILabels = (ind, metadata) => {
    if (!metadata) {
        return {};
    }
    const { selections, series } = ind;
    const { name, selectors, source } = metadata;
    const paramsList = [];
    Object.keys(selections).forEach(id => {
        const selector = selectors.find(s => s.id === id);
        if (!selector) {
            return;
        }
        const selection = selections[id];
        const { value, label } = selector.values.find(v => v.value === selection) || {};
        if (value) {
            paramsList.push({ id, value, label });
        }
    });
    let selectorsFormatted = paramsList.length ? '(' + paramsList.map(l => l.label).join(' / ') + ')' : '';
    const range = series ? series.values[0] + ' - ' + series.values[series.values.length - 1] : '';
    if (range) {
        selectorsFormatted = range + ' ' + selectorsFormatted;
    }
    const max = 50;
    const min = 20;
    const full = name + ' ' + selectorsFormatted;
    let short = '';
    if (full.length > max) {
        const end = Math.max(max - selectorsFormatted.length, min);
        short = name.substring(0, end) + '... ' + selectorsFormatted;
    }
    return {
        indicator: name,
        source,
        params: selectorsFormatted,
        full,
        short,
        paramsList,
        range
    };
};

// series needs to update labels on selected change
export const getUpdatedLabels = (labels, selections) => {
    if (!labels.range) {
        // only labels with range should be updated
        return labels;
    }
    // Doesn't validate selectors
    const paramsList = Object.keys(selections).map(id => {
        const value = selections[id];
        return {
            id,
            value,
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
