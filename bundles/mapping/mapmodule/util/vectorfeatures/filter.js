
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import GeoJSONWriter from 'jsts/org/locationtech/jts/io/GeoJSONWriter';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';

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

const propertiesMatchFilter = (props = {}, filter) => {
    if (!filter || !filter.attribute || !filter.operator) {
        // no filter defined
        return true;
    }
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
};

export const filterFeaturesByAttribute = (features, filter = {}) => {
    return features.filter(feature => {
        return propertiesMatchFilter(feature.properties || {}, filter);
    });
};

const reader = new GeoJSONReader();
const writer = new GeoJSONWriter();
export const filterFeaturesByGeometry = (features, geometry) => {
    const geomFilter = reader.read(geometry);
    const jstsGeomFeatures = features.map(feature => ({
        id: feature.id,
        properties: {
            ...feature.properties
        },
        // this is not very performant since we write geojson from ol feature to
        //  get it parsed by jsts and then we write it back to geojson from jsts geometry
        geometry: reader.read(feature.geometry)
    }));
    return jstsGeomFeatures
        .filter(feature => RelateOp.relate(geomFilter, feature.geometry).isIntersects())
        .map(feature => ({
            ...feature,
            geometry: writer.write(feature.geometry)
        }));
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
