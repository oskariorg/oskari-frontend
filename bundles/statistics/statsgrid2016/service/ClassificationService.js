/**
 * @class Oskari.statistics.statsgrid.ClassificationService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.ClassificationService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (sandbox) {
        this.sandbox = sandbox;
        this.allowedMethods = ['jenks', 'quantile', 'equal']; // , 'manual'
        this.allowedModes = ['distinct', 'discontinuous'];
    }, {
        __name: "StatsGrid.ClassificationService",
        __qname: "Oskari.statistics.statsgrid.ClassificationService",

        getQName: function () {
            return this.__qname;
        },
        getName: function () {
            return this.__name;
        },
        _validateOptions : function(options) {
            var opts = options || {};
            opts.count = opts.count || 5;

            // precision is an integer between 0-20. Will be computed automatically by geostats if no value is set
            //opts.precision = opts.precision || 1;

            if(opts.count < 2) {
                // no need to classify if partitioning to less than 2 groups
                throw new Error('Requires more than 1 partition. Count was ' + opts.count);
            }
            if(opts.count > 11) {
                // we only have 11 colors in colorsets
                throw new Error('Max count is 11. Count was ' + opts.count);
            }
            // maybe validate max count?
            opts.method = opts.method || this.allowedMethods[0];
            // method needs to be one of 'jenks', 'quantile', 'equal', 'manual'
            if(this.allowedMethods.indexOf(opts.method) === -1) {
                throw new Error('Requested method not allowed: ' + opts.method + ". Allowed values are: " + this.allowedMethods.join());
            }

            // Jatkuva / epäjatkuva
            opts.mode = opts.mode || this.allowedModes[0];
            if(this.allowedModes.indexOf(opts.mode) === -1) {
                throw new Error('Requested mode not allowed: ' + opts.mode + ". Allowed values are: " + this.allowedModes.join());
            }
            return opts;
        },
        getClassification : function(indicatorData, options) {
            if(typeof indicatorData !== 'object') {
                throw new Error('Data expected as object with region/value as keys/values.');
            }
            var opts = this._validateOptions(options);
            var list = this._getDataAsList(indicatorData);

            if (this._hasNonNumericValues(list)) {
                // geostats can handle this, but lets not support for now (gstats.getUniqueValues() used previously)
                throw new Error('Non-numeric data not supported for now');
            }


            var stats = new geostats(list);
            stats.setPrecision(opts.precision);

            var a = stats.getClassQuantile(opts.count);
            var response = {};

            if (opts.method === 'jenks') {
                // Luonnolliset välit
                response.bounds = stats.getJenks(opts.count);
            } else if (opts.method === 'quantile') {
                // Kvantiilit
                response.bounds = stats.getQuantile(classes);
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
            response.getGroups = function() {
                var groups = [];
                // make groups.length equal to opts.count and each item is an array
                for(var i =0; i < opts.count; ++i) {
                    groups.push([]);
                }
                for(var region in indicatorData) {
                    var index = stats.getRangeNum(indicatorData[region]);
                    groups[index].push(region);
                }
                return groups;
            };
            // functions in response
            response.getIndex = function(value) {
                return stats.getRangeNum(value);
            };
            // TODO: do we need createLegend?
            response.createLegend = function(colors, title) {
                stats.setColors(colors);
                return stats.getHtmlLegend(null, title || '', true, null, opts.mode);
            };
            return response;
        },
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
