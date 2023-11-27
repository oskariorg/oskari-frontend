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
