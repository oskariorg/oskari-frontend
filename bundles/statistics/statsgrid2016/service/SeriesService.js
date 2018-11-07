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
        this.animating = false;
        this.animatingHandle = null;
        this.seriesStats = {};
        this._setValueInProgress = false;
        this._throttleSelectValue = Oskari.util.throttle(this._setSelectedValue.bind(this), 500);
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
        getFrameInterval: function () {
            return this.frameInterval;
        },
        getValues: function () {
            return this.values.slice();
        },
        getSelectedIndex: function () {
            return this.values.indexOf(this.selectedValue);
        },
        getValue: function () {
            return this.selectedValue;
        },
        setValues: function (values) {
            if (Array.isArray(values) && values.length > 1) {
                values.sort(this._sortAsc);
                if (!this.selectedValue || values.indexOf(this.selectedValue) === -1) {
                    this.setSelectedValue(values[0]);
                }
                this.values = values;
            }
        },
        setSelectedValue: function (selected) {
            return this._throttleSelectValue(selected);
        },
        /**
         * Sets selected value for series layers
         * @param {String} selected indicator selection value
         */
        _setSelectedValue: function (selected) {
            this._setValueInProgress = true;
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
                    this._updateActiveIndicator();
                }
            }

            this._setValueInProgress = false;

            if (this.animating) {
                if (this.getSelectedIndex() !== -1 && this.getSelectedIndex() !== this.values.length - 1) {
                    this._throttleAnimation();
                } else {
                    this.animating = false;
                }
            }
        },
        next: function () {
            if (this._setValueInProgress) {
                return false;
            }
            var selectedIndex = this.values.indexOf(this.selectedValue);
            var nextIndex = 0;
            if (selectedIndex > -1) {
                nextIndex = selectedIndex + 1;
            }
            if (nextIndex > this.values.length - 1) {
                if (this.animating) {
                    this.animating = false;
                }
                return false;
            }
            this.setSelectedValue(this.values[nextIndex]);
            return true;
        },
        previous: function () {
            if (this._setValueInProgress) {
                return false;
            }
            var selectedIndex = this.values.indexOf(this.selectedValue);
            var nextIndex = 0;
            if (selectedIndex > -1) {
                nextIndex = selectedIndex - 1;
            }
            if (nextIndex < 0) {
                return false;
            }
            this.setSelectedValue(this.values[nextIndex]);
            return true;
        },
        setAnimating: function (shouldAnimate) {
            if (shouldAnimate === this.animating) {
                return;
            }
            if (!shouldAnimate) {
                this.animating = false;
                return;
            }
            // check possibility to start animation
            if (this.getSelectedIndex() === -1) {
                return;
            }
            // Step to the beginning, if the series is on the last value
            const isLastValue = this.getSelectedIndex() === this.values.length - 1;
            if (isLastValue) {
                this._setSelectedValue(this.values[0]);
                this.animating = true;
                // Wait frameInterval before starting the animation
                setTimeout(this._throttleAnimation, this.frameInterval);
                return;
            }
            this.animating = true;
            this._throttleAnimation();
        },
        isAnimating: function () {
            return this.animating;
        },
        getSeriesStats: function (hash) {
            var region = this.getStateService().getRegionset();
            if (region) {
                var statsByRegion = this.seriesStats[hash];
                if (statsByRegion) {
                    return statsByRegion[region];
                }
            }
        },
        _sortAsc: function (a, b) {
            return a - b;
        },
        collectGroupStats: function (callback) {
            var me = this;
            var service = this.getStateService();
            var region = service.getRegionset();
            if (!region) {
                me._log.warn('Can\'t collect series data without region');
                return;
            }

            if (service) {
                var seriesWithoutStats = service.getIndicators().filter(function (ind) {
                    return typeof ind.series !== 'undefined' && !me.getSeriesStats(ind.hash);
                });
                if (seriesWithoutStats.length > 0) {
                    if (typeof callback === 'function') {
                        var collectedCount = 0;
                        var collectedLastStatsCb = function () {
                            collectedCount++;
                            if (collectedCount === seriesWithoutStats.length) {
                                callback();
                            }
                        };
                    }
                    seriesWithoutStats.forEach(function (ind) {
                        me._collectSeriesGroupStats(ind.datasource, ind.indicator, ind.selections, ind.series, collectedLastStatsCb);
                    });
                }
            }
        },
        /**
         * @method @private
         * Collect all values for the series to gather stats for classification
         */
        _collectSeriesGroupStats: function (datasrc, indicator, selections, series, callback) {
            var me = this;
            var collectedValues = [];
            var collectedCount = 0;
            var region = me.getStateService().getRegionset();

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

                        var statsByRegion = me.seriesStats[hash];
                        if (!statsByRegion) {
                            statsByRegion = {};
                            me.seriesStats[hash] = statsByRegion;
                        }
                        statsByRegion[region] = new geostats(collectedValues);

                        if (typeof callback === 'function') {
                            callback();
                        }
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
        },
        bindToEvents: function (statisticsService) {
            var me = this;
            var onEvent = function () {
                me.collectGroupStats(me._updateActiveIndicator.bind(me));
            };
            statisticsService.on('StatsGrid.RegionsetChangedEvent', onEvent);
            statisticsService.on('StatsGrid.IndicatorEvent', function (evt) {
                if (evt.series) {
                    onEvent();
                }
            });
        },
        _updateActiveIndicator: function () {
            var stateService = this.getStateService();
            var activeInd = stateService.getActiveIndicator();
            if (activeInd) {
                stateService.setActiveIndicator(activeInd.hash);
            }
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
