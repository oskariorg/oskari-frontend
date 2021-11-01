
const MAP_TYPE_FOR_VALUE_TYPE = {
    'percentage': 'choropleth',
    'relative change': 'choropleth',
    'ratio': 'choropleth',
    'count': 'points',
    'split': 'points'
};
export const getMapTypeForValueType = (valueType, defaultType = 'choropleth') => MAP_TYPE_FOR_VALUE_TYPE[valueType] || defaultType;

/*
type: "seq" = kvantatiivinen, "div" == jakautuva, "qual" = kvalitatiivinen
split = dots (should use 2 colors "negative vs positive" but we don't support that currently)
count = all with same color as dots
*/
const COLOR_SCALE = {
    'percentage': 'seq',
    'relative change': 'div',
    'ratio': 'seq',
    'count': '',
    'split': ''
};
export const getColorScaleTypeForValueType =  (valueType, defaultType = 'seq') => COLOR_SCALE[valueType] || defaultType;
