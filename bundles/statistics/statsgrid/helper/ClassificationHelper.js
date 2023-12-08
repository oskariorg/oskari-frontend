import { getDefaultColor, validateColor, getRangeForColor, getAvailableTypes, getRange, getDividedColors, getColorsForClassification, getOptionsForType } from './ColorHelper';
import { equalSizeBands, createClamp } from './util';
import geostats from 'geostats/lib/geostats.min.js';
import 'geostats/lib/geostats.css';
import * as d3 from 'd3';

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

export const DEFAULT_OPTS = {
    classification: {
        count: 5,
        method: 'jenks',
        color: 'Blues',
        type: 'seq',
        mode: 'discontinuous',
        reverseColors: false,
        mapStyle: 'choropleth',
        transparency: 100, // or from statslayer
        min: 10,
        max: 60,
        showValues: false
    }
};

export const getRangeForPoints = () => {
    return { ...LIMITS.count };
};

export const getAvailableMethods = () => {
    return [...LIMITS.methods];
};

export const getAvailableModes = () => {
    return [...LIMITS.modes];
};

export const getAvailableMapStyles = () => {
    return [...LIMITS.mapStyles];
};

export const getLimits = (mapStyle, type) => {
    if (mapStyle === 'points') {
        return { ...LIMITS };
    }
    const count = getRange(type);
    return { ...LIMITS, count };
};

/**
 * Classifies given dataset.
 * @param  {Object} indicatorData data to classify. Keys are available for groups, values are used for classification
 * @param  {Object} opts      options for classification
 * @param  {geostats} groupStats precalculated geostats | optional
 * @return {Object}               result with classified values
 */
export const getClassification = (indicatorData, opts, groupStats, uniqueCount) => {
    if (typeof indicatorData !== 'object') {
        console.warn('Data expected as object with region/value as keys/values.');
        return { error: 'noData' };
    }
    // TODO: data should be validated and unique values counted in one place
    // stateservice.getState() => returns or service triggers state for all components
    const dataAsList = Object.values(indicatorData).filter(val => val !== null && val !== undefined);
    const dataSize = uniqueCount || new Set(dataAsList).size;
    // geostats fails with jenks if there isn't at least one more unique values than count
    const minData = opts.method === 'jenks' ? Math.max(opts.count + 1, 3) : 1;
    if ((groupStats && groupStats.serie.length < 3) || dataSize < minData) {
        return { error: 'noEnough' };
    }
    const isDivided = opts.type === 'div';
    const { format } = Oskari.getNumberFormatter(opts.fractionDigits);
    var stats = new geostats(dataAsList);
    stats.silent = true;
    stats.setPrecision();
    let bounds;
    const setBounds = (stats) => {
        if (opts.method === 'jenks') {
            bounds = stats.getClassJenks(opts.count);
        } else if (opts.method === 'quantile') {
            bounds = stats.getQuantile(opts.count);
        } else if (opts.method === 'equal') {
            bounds = stats.getEqInterval(opts.count);
        } else if (opts.method === 'manual') {
            bounds = getBoundsFallback(opts.manualBounds, opts.count, stats.min(), stats.max());
            stats.setBounds(bounds);
        }
    };

    if (groupStats) {
        groupStats.silent = true;
        var groupOpts = groupStats.classificationOptions || {};
        const calculateBounds =
            groupOpts.method !== opts.method ||
            groupOpts.count !== opts.count ||
            (opts.method === 'manual' && !Oskari.util.arraysEqual(groupStats.bounds, opts.manualBounds));

        if (calculateBounds) {
            setBounds(groupStats);
            groupOpts.method = opts.method;
            groupOpts.count = opts.count;
            groupStats.classificationOptions = groupOpts;
        } else {
            bounds = groupStats.bounds;
        }
        // Set bounds manually.
        stats.setBounds(groupStats.bounds);
    } else if (isDivided) {
        bounds = getDividedBounds(stats, opts);
    } else {
        setBounds(stats);
    }
    if (bounds.some(bound => isNaN(bound))) {
        console.warn('Failed to create bounds');
        return { error: 'noEnough' };
    }

    const ranges = opts.mode === 'distinct'
        ? getRangesFromBounds(bounds, opts, format)
        : getValueRanges(dataAsList, bounds, format);
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
    for (const region in indicatorData) {
        const value = indicatorData[region];
        if (typeof value === 'undefined') {
            // no value for region -> skip
            continue;
        }
        var index = getGroupForValue(value);
        groups[index].regionIds.push(region);
    }
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
        format,
        stats: statistics
    };
};

export const validateClassification = (classification) => {
    if (!validateColor(classification)) {
        classification.color = getDefaultColor(classification);
    }
    const { max } = classification.mapStyle === 'points'
        ? getRangeForPoints()
        : getRangeForColor(classification.color);
    if (classification.count > max) {
        classification.count = max;
    }
};

export const getPixelsForClassification = (classification, index) => {
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

export const getDividedPixels = (classification, bounds) => {
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

export const getDividedBounds = (stats, classification) => {
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

export const getRangeString = (min, max) => {
    return `${min} - ${max}`;
};

export const getRangesFromBounds = (bounds, opts, format) => {
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

export const getValueRanges = (data, bounds, format) => {
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

export const getBoundsFallback = (bounds, count, dataMin, dataMax) => {
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

export const getEditOptions = (activeIndicator, uniqueCount, minMax) => {
    const { type, count, reverseColors, mapStyle, base, method } = activeIndicator.classification;
    const { count: { min, max }, methods, modes, mapStyles, types, fractionDigits } = getLimits(mapStyle, type);

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
    const dividable = minMax && minMax.min < 0 && minMax.max > 0;
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
