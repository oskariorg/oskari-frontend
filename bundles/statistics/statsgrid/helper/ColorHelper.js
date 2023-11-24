import { COLOR_SETS } from '../constants';

const LIMITS = {
    types: ['div', 'seq', 'qual'],
    names: COLOR_SETS.map(set => set.name)
};

const DEFAULTS = {
    points: '#2ba7ff',
    divPoints: 'RdBu',
    seq: 'Blues',
    div: 'BrBG',
    qual: 'Paired'
};

/**
 * [getColorsForClassification description]
 * @param  {Object} classification object with count as number, type as string, name as string and optional reverseColors boolean
 * @return {Object[]} array of colors to use for legend and map
 */
export const getColorsForClassification = (classification) => {
    const { mapStyle, count, color, reverseColors } = classification;
    let set = [];
    if (mapStyle === 'points') {
        for (let i = 0; i < count; i++) {
            set.push(color || DEFAULTS.points);
        }
    } else {
        set = getColorset(count, color);
    }
    return reverseColors ? [...set].reverse() : set;
};

export const getDividedColors = (classification, bounds) => {
    const { mapStyle, base = 0 } = classification;
    const baseIndex = bounds.findIndex(bound => bound >= base);

    if (mapStyle === 'points') {
        return _getDividedPoints(classification, baseIndex);
    }
    return _getDividedChoropleth(classification, baseIndex);
};

const _getDividedChoropleth = (classification, baseIndex) => {
    const { count, color, reverseColors } = classification;

    const neutral = count % 2; // has neutral color: 1 else: 0
    const underBase = baseIndex;
    const overBase = count - baseIndex - neutral;

    const colorCount = Math.max(underBase, overBase) * 2 + neutral;
    const colorset = [...getColorset(colorCount, color)];
    if (reverseColors) {
        colorset.reverse();
    }
    // colorset: dark - light - (neutral) - light - dark
    // use darker colors
    const colors = [];
    for (let i = 0; i < underBase; i++) {
        colors[i] = colorset[i];
    }
    if (neutral === 1) {
        const neutralColorIndex = Math.floor(colorCount / 2);
        colors[baseIndex] = colorset[neutralColorIndex];
    }
    const colorsCount = colorset.length;
    for (let i = 1; i <= overBase; i++) {
        colors[count - i] = colorset[colorsCount - i];
    }
    return colors;
};

const _getDividedPoints = (classification, baseIndex) => {
    const { count, color, reverseColors } = classification;
    const isEven = count % 2 === 0;

    const colorCount = isEven ? 2 : 3;
    const colorset = [...getColorset(colorCount, color)];
    if (reverseColors) {
        colorset.reverse();
    }

    const colors = [];
    if (isEven) {
        for (let i = 0; i < count; i++) {
            colors[i] = i < baseIndex ? colorset[0] : colorset[1];
        }
    } else {
        for (let i = 0; i < count; i++) {
            if (i === baseIndex) {
                colors[i] = colorset[1];
            } else {
                colors[i] = i < baseIndex ? colorset[0] : colorset[2];
            }
        }
    }
    return colors;
};

const getColorsets = () => {
    return COLOR_SETS.map(set => {
        const { colors, ...rest } = set;
        return {
            ...rest,
            colors: colors.map(str => str.split(',').map(color => '#' + color))
        };
    });
};

export const getAvailableTypes = () => {
    return [...LIMITS.types];
};

export const getRange = (type) => {
    const max = getColorsets().filter(set => set.type === type)
        .map(({ colors }) => colors[colors.length - 1].length)
        .reduce((max, size) => max > size ? max : size);
    return { min: 2, max };
};

export const getRangeForColor = (color) => {
    const { colors } = getColorsets().find(set => set.name === color) || {};
    if (!colors) {
        throw new Error(`Couldn't get count range for color: ${color}`);
    }
    const max = colors[colors.length - 1].length;
    return { min: 2, max };
};

export const validateColor = (classification) => {
    const { mapStyle, color, type } = classification;
    if (typeof color !== 'string') {
        return false;
    }
    if (mapStyle === 'points' && type !== 'div') {
        return !!Oskari.util.hexToRgb(color);
    }
    const colorset = getColorsets().find(set => set.name === color);
    const { type: setType } = colorset || {};
    return setType === type;
};

export const getDefaultColor = (classification) => {
    const { mapStyle, type } = classification;
    if (mapStyle === 'points') {
        if (type === 'div') {
            return DEFAULTS.divPoints;
        }
        return DEFAULTS.points;
    }
    const colorset = DEFAULTS[type];
    if (!colorset) {
        throw new Error(`No default color for type: ${type}`);
    }
    return colorset;
};

/**
 * Tries to return an array of colors where length equals count parameter.
 * If such set is not available, throws Error
 * @param  {Number} count number of colors requested
 * @param  {String} name  name
 * @param  {String} type  optional type
 * @return {String[]}     array of hex-strings as colors like ["#d8b365","#5ab4ac"]
 */
export const getColorset = (count, name, type) => {
    const colorset = getColorsets().find(set => set.name === name);
    if (!colorset) {
        throw new Error('No matching colorset found!');
    }
    if (type && type !== colorset.type) {
        throw new Error('Requested type does not match to colorset!');
    }
    // 2 colors is the first set and index starts at 0 -> -2
    const colors = colorset.colors[count - 2];
    if (!colors || colors.length !== count) {
        throw new Error(`Failed to get colorset: ${name} with ${count} colors.`);
    }
    return colors;
};

/**
 * Options to show in classification UI for selected type and count
 * @param  {String} type  Colorset type.
 * @param  {Number} count amount of colors (throws an error if out of range)
 * @return {Object[]} Returns an array of objects like { name : "nameOfSet", colors : [.. array of hex colors...]}
 */
export const getOptionsForType = (type, count, reverse) => {
    // 2 colors is the first set and index starts at 0 -> -2
    const arrayIndex = count - 2;

    return getColorsets()
        .filter(set => set.type === type && arrayIndex < set.colors.length)
        .map(set => {
            const { name } = set;
            const colors = set.colors[arrayIndex];
            return {
                name,
                colors: reverse ? [...colors].reverse() : colors
            };
        });
};
