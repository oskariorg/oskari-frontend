const operators = {
    '=': (a, b) => a === b,
    '~=': (a, b) => Oskari.util.stringLike(a, b),
    '≠': (a, b) => a !== b,
    '~≠': (a, b) => !Oskari.util.stringLike(a, b),
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '≥': (a, b) => a <= b,
    '≤': (a, b) => a <= b
};

/**
 * @method filterByAttribute Filters the given record list.
 * @param {Object} filter a filter from WFSSetPropertyFilter event
 * @param {Array} featurePropertyList array of feature properties (object) to filter
 * @return {Array} filtered array or the original recordList if the filter was invalid.
 */
export const filterByAttribute = (filter, featurePropertyList) => {
    const filteredList = featurePropertyList.filter(props => {
        let val = props[filter.attribute];
        if (typeof val === 'undefined' || val === null) {
            return false;
        }
        const isNumType = typeof val === 'number';
        const filterValNum = Number(filter.value);
        let filterVal = isNumType && !isNaN(filterValNum) ? filterValNum : filter.value;
        if (!isNumType && !filter.caseSensitive) {
            val = val.toUpperCase();
            filterVal = filterVal.toUpperCase();
        }
        return operators[filter.operator](val, filterVal);
    });
    return filteredList;
};

/**
 * @method getFilterAlternativesAsArray Arranges attribute filters based on AND & OR statements.
 * @param {WFSSetPropertyFilter} event event containing the filters
 * @return {Array} An array of arrays containing attribute filters for each OR statement.
 */
export const getFilterAlternativesAsArray = event => {
    if (!event || !event.getFilters()) {
        return;
    }
    const { filters } = event.getFilters();
    if (!filters || filters.length === 0) {
        return;
    }
    const alternatives = [[]];
    let attributeFilters = alternatives[0];
    filters.forEach(filter => {
        if (filter.attribute) {
            attributeFilters.push(filter);
        }
        if (!filter.boolean) {
            return;
        }
        if (filter.boolean === 'AND') {
            attributeFilters.push(filter);
        } else if (filter.boolean === 'OR') {
            attributeFilters = [];
            alternatives.push(attributeFilters);
        }
    });
    return alternatives;
};
