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
    }, {
        __name: "StatsGrid.ClassificationService",
        __qname: "Oskari.statistics.statsgrid.ClassificationService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        // limits should be used when creating UI for classification
        limits : {
            // 2-9 ranges is what we have colorsets for in colorservice, 5 as default is arbitrary
            count : {
                min : 2,
                max : 9,
                def : 5
            },
            // values recognized by the code (and geostats)
            method : ['jenks', 'quantile', 'equal'], // , 'manual'
            // values recognized by the code (and geostats)
            mode : ['distinct', 'discontinuous']
        },
        getAvailableMethods: function() {
            return limits.method.slice(0);
        },
        getAvailableModes: function() {
            return limits.mode.slice(0);
        },
        getAvailableOptions : function(data) {
            var validOpts = {};
            var list = this._getDataAsList(data);
            validOpts.maxCount = list.length -1;
            return validOpts;
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
         * @return {Object}               result with values and helper functions
         */
        getClassification : function(indicatorData, options) {
            if(typeof indicatorData !== 'object') {
                throw new Error('Data expected as object with region/value as keys/values.');
            }
            var opts = this._validateOptions(options);
            var list = this._getDataAsList(indicatorData);
            if(list.length < 3) {
                return;
            }
            if(opts.count >= list.length) {
                opts.count = list.length -1;
            }

            if (this._hasNonNumericValues(list)) {
                // geostats can handle this, but lets not support for now (gstats.getUniqueValues() used previously)
                throw new Error('Non-numeric data not supported for now');
            }

            var stats = new geostats(list);
            stats.silent = true;
            stats.setPrecision(opts.precision);

            var a = stats.getClassQuantile(opts.count);
            var response = {};

            if (opts.method === 'jenks') {
                // Luonnolliset välit
                response.bounds = stats.getJenks(opts.count);
            } else if (opts.method === 'quantile') {
                // Kvantiilit
                response.bounds = stats.getQuantile(opts.count);
            } else if (opts.method === 'equal') {
                // Tasavälit
                response.bounds = stats.getEqInterval(opts.count);
            }
            response.ranges = stats.ranges;
            response.stats = {
                min : stats.min(),
                max : stats.max(),
                sum : stats.sum(),
                uniqCount : stats.pop(),
                mean : stats.mean(),
                median : stats.median(),
                variance : stats.variance(),
                stddev : stats.stddev(),
                cov : stats.cov()
            };
            var groups = [];
            var getGroups = function() {
                if(groups.length) {
                    return groups;
                }
                // make groups.length equal to opts.count and each item is an array
                for(var i =0; i < opts.count; ++i) {
                    groups.push([]);
                }
                for(var region in indicatorData) {
                    var value = indicatorData[region];
                    if(typeof value ===  'undefined') {
                        // no value for region -> skip
                        continue;
                    }
                    var index = stats.getRangeNum(value);
                    groups[index].push(region);
                }
                return groups;
            };
            response.getGroups = function(index) {
                var groups = getGroups();
                if(index || index === 0) {
                    if(index < 0 || index >= groups.length) {
                        throw new Error('Grouped to ' + groups.length + ' parts, ' +
                            index + ' is out of bounds.');
                    }
                    return groups[index];
                }
                return groups;
            };
            // functions in response
            response.getIndex = function(value) {
                return stats.getRangeNum(value);
            };
            // createLegend
            response.createLegend = function(colors, title) {
                stats.setColors(colors);
                var legendHTML = stats.getHtmlLegend(null, title || '', true, null, opts.mode);
                return legendHTML;
            };
            return response;
        },
        /**
         * Validates and normalizes options
         * @param  {Object} options options for classification
         * @return {Object}         normalized options
         */
        _validateOptions : function(options) {
            var opts = options || {};
            opts.count = opts.count || this.limits.count.def;
            opts.type = opts.type || 'seq';

            // precision is an integer between 0-20. Will be computed automatically by geostats if no value is set
            //opts.precision = opts.precision || 1;
            var range = this._colorService.getRange(opts.type);
            if(opts.count < range.min) {
                // no need to classify if partitioning to less than 2 groups
                throw new Error('Requires atleast ' + range.min + ' partitions. Count was ' + opts.count);
            }
            if(opts.count > range.max) {
                opts.count = range.max;
            }
            // maybe validate max count?
            opts.method = opts.method || this.limits.method[0];
            // method needs to be one of 'jenks', 'quantile', 'equal', 'manual'
            if(this.limits.method.indexOf(opts.method) === -1) {
                throw new Error('Requested method not allowed: ' + opts.method + ". Allowed values are: " + this.limits.method.join());
            }

            // Jatkuva / epäjatkuva
            opts.mode = opts.mode || this.limits.mode[0];
            if(this.limits.mode.indexOf(opts.mode) === -1) {
                throw new Error('Requested mode not allowed: ' + opts.mode + ". Allowed values are: " + this.limits.mode.join());
            }
            return opts;
        },
        /**
         * Transforms { key: value, key2 : null, key3: undefined, key4 : value2 } to [value, value2]
         * @param  {Object} data input data object
         * @return {Number[]}    values array
         */
        _getDataAsList : function(data) {

            var list = [];
            // object -> array and take out any missing values
            for(var reg in data) {
                var value = data[reg];
                if(value !== undefined && value !== null) {
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
