import { equalSizeBands } from '../util/equalSizeBands';
import geostats from 'geostats/lib/geostats.min.js';
import 'geostats/lib/geostats.css';

/**
 * @class Oskari.statistics.statsgrid.ClassificationService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationService',

    /**
     * @method create called automatically on construction
     * @static
     */
    function (colorService) {
        this._colorService = colorService;
        this.lastUsedBounds = null;
        this.log = Oskari.log(this.getQName());
    }, {
        __name: 'StatsGrid.ClassificationService',
        __qname: 'Oskari.statistics.statsgrid.ClassificationService',

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        // limits should be used when creating UI for classification
        limits: {
            // 2-7 used for points, colorservice's colorsets limits other mapStyles
            count: {
                min: 2,
                max: 7
            },
            // values recognized by the code (and geostats)
            methods: ['jenks', 'quantile', 'equal', 'manual'],
            // values recognized by the code (and geostats)
            modes: ['distinct', 'discontinuous'],
            // values recognized by the code (and geostats)
            mapStyles: ['choropleth', 'points']
        },
        getRangeForPoints: function () {
            return { ...this.limits.count };
        },
        getAvailableMethods: function () {
            return [...this.limits.methods];
        },
        getAvailableModes: function () {
            return [...this.limits.modes];
        },
        getAvailableMapStyles: function () {
            return [...this.limits.mapStyles];
        },
        getLimits: function () {
            return { ...this.limits };
        },
        /**
         * Classifies given dataset.
         * Returns an object like :
         * {
         *     bounds : [<classification bounds as numbers like [0,2,5,6]>],
         *     ranges : [<classification ranges as strings ["0-2", "2-5", "5-6"]>],
         *     stats : {
         *         min : <min value in data>,
         *         max : <max value in data>,
         *         ...
         *         mean : <mean value in data>
         *     },
         *     getGroups : <function to return keys in data grouped by value ranges, takes an optional param index to get just one group>,
         *     getIndex : <function to return a group index for data
         *     createLegend : <function to create html-legend for ranges, takes colorset and optional title as params>
         * }
         * Options can include:
         * {
         *    count : <number between 2-9 - defaults to 5>,
         *    method : <one of 'jenks', 'quantile', 'equal' - defaults to 'jenks'>,
         *    mode : <one of 'distinct', 'discontinuous' - defaults to 'distinct'>,
         *    precission : <undefined or integer between 0-20 - defaults to undefined>
         * }
         * @param  {Object} indicatorData data to classify. Keys are available for groups, values are used for classification
         * @param  {Object} options       optional instructions for classification
         * @param  {geostats} groupStats precalculated geostats | optional
         * @return {Object}               result with values and helper functions
         */
        getClassification: function (indicatorData, options, groupStats) {
            var me = this;
            if (typeof indicatorData !== 'object') {
                this.log.warn('Data expected as object with region/value as keys/values.');
                return { error: 'noData' };
            }
            var opts = me._validateOptions(options);
            var list = me._getDataAsList(indicatorData);
            var formatter = Oskari.getNumberFormatter(opts.fractionDigits);

            if (me._hasNonNumericValues(list)) {
                // geostats can handle this, but lets not support for now (gstats.getUniqueValues() used previously)
                this.log.warn('Non-numeric data not supported for now');
                return { error: 'noData' };
            }

            var stats = new geostats(list);
            stats.silent = true;
            stats.setPrecision(opts.precision);

            var response = {};

            const setBounds = (stats) => {
                if (opts.method === 'jenks') {
                    // Luonnolliset välit
                    response.bounds = stats.getClassJenks(opts.count);
                    stats.setBounds(response.bounds);
                    stats.setRanges();
                } else if (opts.method === 'quantile') {
                    // Kvantiilit
                    response.bounds = stats.getQuantile(opts.count);
                } else if (opts.method === 'equal') {
                    // Tasavälit
                    response.bounds = stats.getEqInterval(opts.count);
                } else if (opts.method === 'manual') {
                    const bounds = this.getBoundsFallback(opts.manualBounds, opts.count, stats.min(), stats.max());
                    response.bounds = stats.setClassManually(bounds);
                }
            };

            if (groupStats) {
                if (groupStats.serie.length < 3) {
                    return { error: 'noEnough' };
                }
                groupStats.silent = true;
                groupStats.setPrecision(opts.precision);

                if (opts.count >= groupStats.serie.length) {
                    opts.count = groupStats.serie.length - 1;
                }
                var groupOpts = groupStats.classificationOptions || {};
                var calculateBounds =
                    !groupStats.classificationOptions ||
                    groupOpts.method !== opts.method ||
                    groupOpts.count !== opts.count ||
                    (opts.method === 'manual' && !Oskari.util.arraysEqual(groupStats.bounds, opts.manualBounds));

                if (calculateBounds) {
                    setBounds(groupStats);
                    groupOpts.method = opts.method;
                    groupOpts.count = opts.count;
                    groupStats.classificationOptions = groupOpts;
                }
                // Set bounds manually.
                stats.setBounds(groupStats.bounds);
                stats.setRanges();
            } else {
                if (list.length < 2) {
                    return { error: 'noEnough' };
                } else if (list.length === 2) {
                    // TODO: these should be handled when options are edited
                    opts.count = list.length;
                    /* Switch method from jenks to quantile with value length of two since geostats.getClassJenks()
                     * does not return bounds correctly with two values
                     */
                    if (opts.method === 'jenks') {
                        opts.method = 'quantile';
                    }
                } else if (opts.count >= list.length) {
                    opts.count = list.length - 1;
                }
                setBounds(stats);
            }
            response.stats = {
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

            let ranges;
            if (opts.method === 'manual') {
                ranges = this.getRangesFromBounds(response.bounds);
            } else {
                ranges = opts.mode === 'discontinuous' ? stats.getInnerRanges() : stats.getRanges();
            }
            // TODO: could use regionIds.length where count is needed
            stats.doCount();
            const counts = stats.counter;
            const colors = this._colorService.getColorsForClassification(options);
            const pixels = this.getPixelsForClassification(options);

            if (![colors, pixels, counts, ranges].every(list => list.length === opts.count)) {
                this.log.warn('Failed to create groups');
                return { error: 'general' };
            }
            const groups = [];
            for (let i = 0; i < opts.count; i++) {
                const group = {
                    sizePx: pixels[i],
                    range: ranges[i],
                    color: colors[i],
                    count: counts[i],
                    regionIds: []
                };
                groups.push(group);
            }
            for (const region in indicatorData) {
                const value = indicatorData[region];
                if (typeof value === 'undefined') {
                    // no value for region -> skip
                    continue;
                }
                var index = stats.getRangeNum(value);
                groups[index].regionIds.push(region);
            }
            response.groups = groups;
            response.format = formatter.format;

            // TODO: could add bounds to groups (and maybe remove range as its parsed and formatted for legend)
            this.lastUsedBounds = response.bounds;
            var maxBounds = [];
            if (response.bounds) {
                // max bounds are calculated for color scale used in diagram
                var values = stats.sorted();
                var j = 1;
                for (var i = 0; i < values.length; i++) {
                    if (parseFloat(values[i]) > parseFloat(response.bounds[j])) {
                        maxBounds.push(values[i]);
                        j++;
                    }
                }
            }
            response.maxBounds = maxBounds;
            response.getHtmlLegend = function (colors) {
                // Choropleth  legend
                return stats.getHtmlLegend(colors, '', true, formatter.format, opts.mode);
            };
            return response;
        },
        getPixelsForClassification: function (classification, index) {
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
        },
        getRangesFromBounds: function (bounds) {
            const ranges = [];
            for (let i = 0; i < bounds.length - 1; i++) {
                ranges.push(bounds[i] + ' - ' + bounds[i + 1]);
            }
            return ranges;
        },
        getBoundsFallback: function (bounds, count, dataMin, dataMax) {
            return this._tryKnownBounds(bounds, count, dataMin, dataMax) || equalSizeBands(count, dataMin, dataMax);
        },
        _tryKnownBounds: function (givenBounds, count, dataMin, dataMax) {
            return this._tryBounds(givenBounds, count, dataMin, dataMax) || this._tryBounds(this.lastUsedBounds, count, dataMin, dataMax);
        },
        _tryBounds: function (bounds, count, dataMin, dataMax) {
            if (!bounds) {
                return;
            }
            if (bounds[0] !== dataMin || bounds[bounds.length - 1] !== dataMax) {
                return;
            }
            const targetLength = count + 1;
            if (bounds.length === targetLength) {
                return bounds.slice();
            }
            if (bounds.length > targetLength) {
                return bounds.slice(0, targetLength - 1).concat([dataMax]);
            }

            const extraNeeded = equalSizeBands(targetLength - bounds.length + 1, bounds[bounds.length - 2], dataMax);

            return bounds
                .slice(0, -2)
                .concat(extraNeeded);
        },
        /**
         * Validates and normalizes options
         * @param  {Object} options options for classification
         * @return {Object}         normalized options
         */
        // TODO: should validate earlier
        _validateOptions: function (options) {
            var opts = options || {};
            opts.count = opts.count || 5;
            opts.type = opts.type || 'seq';

            var range = opts.mapStyle === 'points'
                ? this.getRangeForPoints()
                : this._colorService.getRange(opts.type, opts.mapStyle);
            if (opts.count < range.min) {
                // no need to classify if partitioning to less than 2 groups
                throw new Error('Requires atleast ' + range.min + ' partitions. Count was ' + opts.count);
            }
            // TODO: can't update values on validate
            if (opts.count > range.max) {
                opts.count = range.max;
            }
            // maybe validate max count?
            const methods = this.getAvailableMethods();
            opts.method = opts.method || methods[0];
            // method needs to be one of 'jenks', 'quantile', 'equal', 'manual'
            if (methods.indexOf(opts.method) === -1) {
                throw new Error('Requested method not allowed: ' + opts.method + '. Allowed values are: ' + methods.join());
            }

            // Jatkuva / epäjatkuva
            const modes = this.getAvailableModes();
            opts.mode = opts.mode || modes[0];
            if (modes.indexOf(opts.mode) === -1) {
                throw new Error('Requested mode not allowed: ' + opts.mode + '. Allowed values are: ' + modes.join());
            }
            return opts;
        },
        /**
         * Transforms { key: value, key2 : null, key3: undefined, key4 : value2 } to [value, value2]
         * @param  {Object} data input data object
         * @return {Number[]}    values array
         */
        _getDataAsList: function (data) {
            var list = [];
            // object -> array and take out any missing values
            for (var reg in data) {
                var value = data[reg];
                if (value !== undefined && value !== null) {
                    list.push(value);
                }
            }
            return list;
        },
        /**
         * Determines if there are NaN-values in the input
         * @param  {Array}  values Array of values
         * @return {Boolean}       true if there are NaN values in the array
         */
        _hasNonNumericValues: function (values) {
            var i, val, valLen;
            for (i = 0, valLen = values.length; i < valLen; i += 1) {
                val = values[i];
                if (val !== undefined) {
                    if (isNaN(val)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
