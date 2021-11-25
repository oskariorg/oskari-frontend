
import GeoJSONReader from 'jsts/org/locationtech/jts/io/GeoJSONReader';
import RelateOp from 'jsts/org/locationtech/jts/operation/relate/RelateOp';
import Envelope from 'jsts/org/locationtech/jts/geom/Envelope';
import GeometryFactory from 'jsts/org/locationtech/jts/geom/GeometryFactory';

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
const filterFeaturesByJSTSGeometry = (features, jstsGeometry) => {
    const geomFilter = (feature) => RelateOp.relate(jstsGeometry, reader.read(feature.geometry)).isIntersects();
    return features.filter(geomFilter);
};
export const filterFeaturesByGeometry = (features, geometry) => {
    const jstsGeometry = reader.read(geometry);
    return filterFeaturesByJSTSGeometry(features, jstsGeometry);
};
const GEOM_FACTORY = new GeometryFactory();
export const filterFeaturesByExtent = (features, extent) => {
    if (!extent || extent.length < 4) {
        return features;
    }
    // https://github.com/bjornharrtell/jsts/blob/master/src/org/locationtech/jts/geom/Envelope.js
    // assumes that extent is [x1, x2, y1, y2], but openlayers uses [left, bottom, right, top]
    const daa = GEOM_FACTORY.toGeometry(new Envelope(extent[0], extent[2], extent[1], extent[3]))
    return filterFeaturesByJSTSGeometry(features, daa);
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
