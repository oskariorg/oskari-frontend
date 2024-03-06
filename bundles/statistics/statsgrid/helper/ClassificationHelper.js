import { getDefaultColor, validateColor, getRangeForColor, getAvailableTypes, getRange, getDividedColors, getColorsForClassification, getOptionsForType } from './ColorHelper';
import { equalSizeBands, createClamp } from './util';
import geostats from 'geostats/lib/geostats.min.js';
import 'geostats/lib/geostats.css';
import * as d3 from 'd3';
import { getDataByRegions } from './StatisticsHelper';

const LIMITS = {
    // 2-7 used for points, colorservice's colorsets limits other mapStyles
    count: { min: 2, max: 7 },
    // values recognized by the code (and geostats)
    methods: ['jenks', 'quantile', 'equal', 'manual'],
    // values recognized by the code (and geostats)
    modes: ['distinct', 'discontinuous'],
    // values recognized by the code (and geostats)
    mapStyles: ['choropleth', 'points'],
    // values recognized by the code (and geostats)
    types: getAvailableTypes(),
    fractionDigits: 5
};

const DEFAULTS = {
    count: 5,
    method: 'jenks',
    color: 'Blues',
    type: 'seq',
    mode: 'discontinuous',
    reverseColors: false,
    mapStyle: 'choropleth',
    min: 10,
    max: 60,
    showValues: false
};

export const shouldUpdateClassifiedData = (updated) => {
    const updatedKeys = Array.isArray(updated) ? updated : Object.keys(updated);
    // color and fractonDigits could update group's color and range only
    // also min max affects group's pixel sizes
    const keys = ['count', 'mapStyle', 'method', 'mode', 'color', 'fractionDigits', 'min', 'max'];
    return updatedKeys.some(key => keys.includes(key));
};

export const getClassification = (data, metadata = {}, lastSelected = {}) => {
    const classification = {
        fractionDigits: data.allInts ? 0 : 1
    };
    // store only keys and values which are included in DEFAULTS
    Object.keys(DEFAULTS).forEach(key => {
        classification[key] = typeof lastSelected[key] === 'undefined' ? DEFAULTS[key] : lastSelected[key];
    });
    // override values from metadata
    if (typeof metadata.isRatio === 'boolean') {
        classification.mapStyle = metadata.isRatio ? 'choropleth' : 'points';
    }
    if (typeof metadata.decimalCount === 'number') {
        classification.fractionDigits = metadata.decimalCount;
    }
    if (typeof metadata.base === 'number') {
        // doesn't make sense to use divided classification if data isn't divided
        if (data.min < metadata.base && data.max > metadata.base) {
            // if there is a base value the data is divided at base value
            classification.base = metadata.base;
            classification.type = 'div';
        }
    }
    validateClassification(classification, data);
    return classification;
};

export const validateClassification = (classification, data = {}) => {
    if (!validateColor(classification)) {
        classification.color = getDefaultColor(classification);
    }
    const { max } = classification.mapStyle === 'points' ? LIMITS.count : getRangeForColor(classification.color);
    if (classification.count > max) {
        classification.count = max;
    }
    // geostats fails with jenks if there isn't at least one more unique values than count
    if (classification.method === 'jenks' && data.uniqueCount <= classification.count) {
        const newCount = data.uniqueCount - 1;
        const { min } = LIMITS.count;
        if (newCount >= min) {
            classification.count = newCount;
        } else {
            // cannot use 'jenks', change method
            classification.method = 'equal';
            classification.count = min;
        }
    }
    // Discontinuos mode is problematic for series data,
    // because each class has to get at least one hit -> set distinct mode.
    if (data.seriesValues) {
        classification.mode = 'distinct';
    }
};

export const getGroupStats = (dataBySelection) => {
    const values = Object.values(dataBySelection)
        .reduce((all, data) => [...all, ...Object.values(data)], []);
    return new geostats(values);
};

/**
 * Classifies given dataset.
 * @param  {Object} indicatorData data to classify
 * @param  {Object} opts      options for classification
 * @param  {geostats} groupStats precalculated geostats | optional
 * @return {Object}               result with classified values
 */
export const getClassifiedData = (indicator, groupStats) => {
    const { classification: opts, data: { seriesValues } } = indicator;
    const dataByRegions = getDataByRegions(indicator);
    const values = seriesValues || dataByRegions.map(d => d.value).filter(val => typeof val !== 'undefined');
    if (!values.length || seriesValues.length < 3) {
        return { error: 'noEnough' };
    }
    const isDivided = opts.type === 'div';
    const { format } = Oskari.getNumberFormatter(opts.fractionDigits);

    const stats = new geostats(values);
    stats.silent = true;
    stats.setPrecision();

    const bounds = isDivided ? getDividedBounds(stats, opts) : getBounds(stats, opts);
    if (bounds.some(bound => isNaN(bound))) {
        console.warn('Failed to create bounds');
        return { error: 'noEnough' };
    }

    const ranges = opts.mode === 'distinct'
        ? getRangesFromBounds(bounds, opts, format)
        : getValueRanges(values, bounds, format);
    const colors = isDivided ? getDividedColors(opts, bounds) : getColorsForClassification(opts);
    const pixels = isDivided ? getDividedPixels(opts, bounds) : getPixelsForClassification(opts);
    if (![colors, pixels, ranges].every(list => Array.isArray(list) && list.length === opts.count)) {
        console.warn('Failed to create groups');
        return { error: 'general' };
    }
    const groups = [];
    for (let i = 0; i < opts.count; i++) {
        const group = {
            sizePx: pixels[i],
            range: ranges[i],
            color: colors[i],
            minValue: bounds[i],
            regionIds: []
        };
        groups.push(group);
    }

    const getGroupForValue = value => {
        const index = bounds.findIndex(bound => value < bound);
        // first groups values is between bounds[0] and bounds[1]
        // max value === last bound, max value isn't found, return last group index
        return index === -1 ? bounds.length - 2 : index - 1;
    };
    dataByRegions.forEach(({ value, id }) => {
        if (typeof value === 'undefined') {
            // no value for region -> skip
            return;
        }
        const index = getGroupForValue(value);
        groups[index].regionIds.push(id);
    });
    const statistics = {
        min: stats.min(),
        max: stats.max(),
        sum: stats.sum(),
        uniqCount: stats.pop(),
        mean: stats.mean(),
        median: stats.median(),
        variance: stats.variance(),
        stddev: stats.stddev(),
        cov: stats.cov()
    };
    return {
        groups,
        bounds,
        stats: statistics
    };
};

const getBounds = (stats, opts) => {
    if (opts.method === 'jenks') {
        return stats.getClassJenks(opts.count);
    }
    if (opts.method === 'quantile') {
        return stats.getQuantile(opts.count);
    }
    if (opts.method === 'equal') {
        return stats.getEqInterval(opts.count);
    }
    if (opts.method === 'manual') {
        const bounds = getBoundsFallback(opts.manualBounds, opts.count, stats.min(), stats.max());
        stats.setBounds(bounds);
        return bounds;
    }
    return [];
};

const getPixelsForClassification = (classification, index) => {
    const { min, max, count } = classification;
    const x = d3.scaleLinear()
        .domain([0, count - 1])
        .range([min, max]);

    const getSize = index => {
        const size = Math.floor(x(index));
        // Make size an even value for rendering
        return size % 2 !== 0 ? size + 1 : size;
    };

    if (typeof index !== 'undefined') {
        return getSize(index);
    }
    const sizes = [];
    for (let i = 0; i < count; i++) {
        sizes.push(getSize(i));
    }
    return sizes;
};

const getDividedPixels = (classification, bounds) => {
    const { min, max, base = 0 } = classification;
    const baseIndex = bounds.findIndex(bound => bound >= base);
    const minValueDif = base - bounds[0];
    const maxValueDif = bounds[bounds.length - 1] - base;
    const x = d3.scaleLinear()
        .domain([base, Math.max(minValueDif, maxValueDif)])
        .range([min, max]);

    const getSize = index => {
        const size = Math.floor(x(index));
        // Make size an even value for rendering
        return size % 2 !== 0 ? size + 1 : size;
    };
    const sizes = [];
    for (let i = 0; i < bounds.length - 1; i++) {
        const val = i < baseIndex ? base - bounds[i] : bounds[i + 1] - base;
        sizes[i] = getSize(val);
    }
    return sizes;
};

const getDividedBounds = (stats, classification) => {
    const { method, count, manualBounds, base = 0 } = classification;
    let bounds;
    if (method === 'jenks') {
        bounds = stats.getClassJenks(count);
    } else if (method === 'quantile') {
        bounds = stats.getQuantile(count);
    } else if (method === 'equal') {
        bounds = stats.getEqInterval(count);
    } else if (method === 'manual') {
        bounds = getBoundsFallback(manualBounds, count, stats.min(), stats.max());
        // TODO: handle base bound drag
        return bounds;
    }
    const potentialBaseIndex = bounds.findIndex(bound => bound > base);
    const lastIndex = bounds.length - 1;
    if (potentialBaseIndex <= 0) {
        // All bounds are under or over base
        return bounds;
    }
    // clamp function is used to ensure that we don't modify first or last bound
    const clamp = createClamp(1, lastIndex - 1);
    if (count % 2 === 0) {
        const deltaToLowerBound = base - bounds[potentialBaseIndex - 1];
        const deltaToUpperBound = bounds[potentialBaseIndex] - base;
        // by default base index is the next bound over base value
        let indexForBase = potentialBaseIndex;
        if (deltaToLowerBound < deltaToUpperBound) {
            // but if next bound over base value is further from base than the lower bound, adjust lower instead
            indexForBase = potentialBaseIndex - 1;
        }
        indexForBase = clamp(indexForBase);
        bounds[indexForBase] = base;
    } else {
        // odd count has 'neutral' group so both bounds have to move to base
        let under = clamp(potentialBaseIndex - 1);
        let over = clamp(potentialBaseIndex);
        if (under === over) {
            if (over === 1) {
                over++;
            } else {
                under--;
            }
        }
        bounds[under] = base;
        bounds[over] = base;
    }
    return bounds;
};

const getRangeString = (min, max) => {
    return `${min} - ${max}`;
};

const getRangesFromBounds = (bounds, opts, format) => {
    const { fractionDigits } = opts;
    const ranges = [];
    const lastRange = bounds.length - 2;
    for (let i = 0; i < bounds.length - 1; i++) {
        let min = bounds[i];
        let max = bounds[i + 1];
        const same = min === max;
        // decrease groups max range by fraction digit, skip last
        max = i === lastRange || same ? format(max) : format(max.toFixed(fractionDigits) - Math.pow(10, -fractionDigits));
        if (same) {
            ranges.push(max);
        } else {
            min = format(min);
            ranges.push(getRangeString(min, max));
        }
    }
    return ranges;
};

const getValueRanges = (data, bounds, format) => {
    // TODO: could use sorted unique values which is used for classification options
    const sorted = [...new Set(data)].sort((a, b) => a - b);
    const ranges = [];
    const lastRange = bounds.length - 2;
    for (let i = 0; i < bounds.length - 1; i++) {
        const max = bounds[i + 1];
        const min = bounds[i];
        const values = sorted.filter(val => val >= min && val < max);
        if (i === lastRange) {
            // max value === last bound, add max value to last range
            values.push(sorted[sorted.length - 1]);
        }
        if (values.length === 0) {
            ranges[i] = '';
        } else if (values.length === 1) {
            ranges[i] = format(values[0]);
        } else {
            ranges[i] = getRangeString(format(values[0]), format(values[values.length - 1]));
        }
    }
    return ranges;
};

const getBoundsFallback = (bounds, count, dataMin, dataMax) => {
    return _tryBounds(bounds, count, dataMin, dataMax) || equalSizeBands(count, dataMin, dataMax);
};

const _tryBounds = (bounds, count, dataMin, dataMax) => {
    if (!bounds) {
        return;
    }
    if (bounds[0] !== dataMin || bounds[bounds.length - 1] !== dataMax) {
        return;
    }
    if (bounds.length === count + 1) {
        return bounds.slice();
    }
};

export const getEditOptions = (classification, data) => {
    const { type, count, reverseColors, mapStyle, base, method } = classification;
    const { min: minValue, max: maxValue } = data;
    let { uniqueCount } = data;

    const { methods, modes, mapStyles, types, fractionDigits } = LIMITS;
    const { min, max } = mapStyle === 'points' ? LIMITS.count : getRange(type);

    const colorCount = mapStyle === 'points' ? 2 + count % 2 : count;
    const colorsets = mapStyle === 'points' && type !== 'div' ? [] : getOptionsForType(type, colorCount, reverseColors);

    const disabled = [];
    if (uniqueCount < 3) {
        disabled.push('jenks');
        // only jenks breaks with small unique count, show at least count 2 for others
        if (method !== 'jenks') {
            uniqueCount = 2;
        }
    }

    // if dataset has negative and positive values it can be divided, base !== 0 has to be given in metadata
    const dividable = minValue < 0 && maxValue > 0;
    if (typeof base !== 'number' && !dividable) {
        // disable option if base isn't given in metadata or dataset isn't dividable
        disabled.push('div');
    }

    const toOption = (option, value) => ({
        value,
        label: Oskari.getMsg('StatsGrid', `classify.${option}.${value}`),
        disabled: disabled.includes(value)
    });
    const getNumberOptions = (min, max) => Array.from({ length: max - min + 1 }, (v, i) => i + min).map(i => ({ value: i, label: `${i}` }));
    return {
        methods: methods.map(val => toOption('methods', val)),
        modes: modes.map(val => toOption('modes', val)),
        mapStyles: mapStyles.map(val => toOption('mapStyles', val)),
        types: types.map(val => toOption('types', val)),
        counts: getNumberOptions(min, Math.min(uniqueCount, max)),
        fractionDigits: getNumberOptions(0, fractionDigits),
        colorsets
    };
};
