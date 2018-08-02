/**
 * @class Oskari.statistics.statsgrid.SeriesService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.SeriesService',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox) {
        this._log = Oskari.log('StatsGrid.SeriesService');
        this.sandbox = sandbox;
        this.setFrameInterval(2000);
        this.selectedValue = null;
        this.stateService = null;
        this.statisticsService = null;
        this.values = [];
        this.isAnimating = false;
        this.animatingHandle = null;
        this.seriesStats = {};
    }, {
        getStateService: function () {
            if (!this.stateService) {
                var statisticsService = this.getStatisticsService();
                if (statisticsService) {
                    this.stateService = statisticsService.getStateService();
                }
            }
            return this.stateService;
        },
        getStatisticsService: function () {
            if (!this.statisticsService) {
                this.statisticsService = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
            }
            return this.statisticsService;
        },
        setFrameInterval: function (interval) {
            this.frameInterval = interval;
            this._throttleAnimation = Oskari.util.throttle(this.next.bind(this), interval);
        },
        getValue: function () {
            return this.selectedValue;
        },
        /**
         * Sets selected value for series layers
         * @param {String} selected indicator selection value
         */
        setValue: function (selected) {
            this.selectedValue = selected;

            var service = this.getStateService();
            if (service) {
                var series = service.getIndicators().filter(function (ind) {
                    return typeof ind.series !== 'undefined';
                });
                if (series.length > 0) {
                    series.forEach(function (ind) {
                        ind.selections[ind.series.id] = selected;
                    });
                    // Nofity table and graph
                    var eventBuilder = Oskari.eventBuilder('StatsGrid.ParameterChangedEvent');
                    this.sandbox.notifyAll(eventBuilder());

                    // Show series stats layer on the map if not there already.
                    var activeInd = service.getActiveIndicator();
                    activeInd = typeof activeInd.series !== 'undefined' ? activeInd : series[series.length - 1];
                    service.setActiveIndicator(activeInd.hash);
                }
            }
        },
        next: function () {
            var selectedIndex = this.values.indexOf(this.selectedValue);
            var nextIndex = 0;
            if (selectedIndex > -1) {
                nextIndex = selectedIndex + 1;
            }
            if (nextIndex > this.values.length - 1) {
                if (this.isAnimating) {
                    this.stopAnimation();
                }
                return false;
            }
            this.setValue(this.values[nextIndex]);
            if (this.isAnimating) {
                this._throttleAnimation();
            }
            return true;
        },
        previous: function () {
            var selectedIndex = this.values.indexOf(this.selectedValue);
            var nextIndex = 0;
            if (selectedIndex > -1) {
                nextIndex = selectedIndex - 1;
            }
            if (nextIndex > this.values.length - 1 || nextIndex < 0) {
                if (this.isAnimating) {
                    this.stopAnimation();
                }
                return false;
            }
            this.setValue(this.values[nextIndex]);
            return true;
        },
        startAnimation: function () {
            this.isAnimating = true;
            this._throttleAnimation();
        },
        stopAnimation: function () {
            if (this.isAnimating) {
                this.isAnimating = false;
            }
        },
        addSeries: function (datasrc, indicator, selections, series) {
            var me = this;
            if (Array.isArray(series.values)) {
                series.values.forEach(function (val) {
                    if (me.values.indexOf(val) === -1) {
                        me.values.push(val);
                    }
                });
                me.values.sort(me._sortAsc);
                if (!me.selectedValue && me.values.length > 0) {
                    me.selectedValue = me.values[0];
                }
                me._collectSeriesGroupStats(datasrc, indicator, selections, series);
            }
        },
        updateSeriesValues: function () {
            var values = this.getStateService().getIndicators().filter(function (ind) {
                return typeof ind.series !== 'undefined';
            }).map(function (ind) {
                return ind.series.values;
            }).sort(this._sortAsc);
            this.values = values;
        },
        getSeriesStats: function (hash) {
            return this.seriesStats[hash];
        },
        _sortAsc: function (a, b) {
            return a - b;
        },
        /**
         * @private _collectSeriesGroupStats
         * Collect all values for the series to gather stats for classification
         */
        _collectSeriesGroupStats: function (datasrc, indicator, selections, series) {
            var me = this;
            var collectedValues = [];
            var collectedCount = 0;

            var collectDataCallbackFactory = function (seriesValue) {
                return function (err, data) {
                    collectedCount++;
                    if (err) {
                        me._log.warn('Collecting series data failed for value: ' + seriesValue);
                    } else {
                        for (var key in data) {
                            if (data.hasOwnProperty(key)) {
                                var value = data[key];
                                if (value !== undefined && value !== null) {
                                    collectedValues.push(value);
                                }
                            }
                        }
                    }
                    // Completing the last call
                    if (collectedCount === series.values.length) {
                        var hash = me.getStateService().getHash(datasrc, indicator, selections, series);
                        me.seriesStats[hash] = new geostats(collectedValues);
                    }
                };
            };

            // Get data for each selection in the series
            series.values.forEach(function (val) {
                var params = {};
                params[series.id] = val;
                params = jQuery.extend({}, selections, params);
                me.getStatisticsService().getIndicatorData(
                    datasrc,
                    indicator,
                    params,
                    series,
                    me.getStateService().getRegionset(),
                    collectDataCallbackFactory(val));
            });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
