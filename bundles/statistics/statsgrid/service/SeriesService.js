import geostats from 'geostats/lib/geostats.min.js';
import 'geostats/lib/geostats.css';
import { getHash } from '../helper/StatisticsHelper';

/**
 * @class Oskari.statistics.statsgrid.SeriesService
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.SeriesService',
    /**
     * @method create called automatically on construction
     * @static
     */
    function (sandbox, stateHandler) {
        this._log = Oskari.log('StatsGrid.SeriesService');
        this.stateHandler = stateHandler;
        this.sandbox = sandbox;
        this.setFrameInterval(2000);
        this.selectedValue = null;
        this.statisticsService = null;
        this.values = [];
        this.animating = false;
        this.animatingHandle = null;
        this.seriesStats = {};
        this._setValueInProgress = false;
        this._throttleSelectValue = Oskari.util.throttle(this._setSelectedValue.bind(this), 500);
        this.stateHandler = stateHandler;
        this.stateHandler.addStateListener(() => this.collectGroupStats());
    }, {
        getStatisticsService: function () {
            if (!this.statisticsService) {
                this.statisticsService = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
            }
            return this.statisticsService;
        },
        setFrameInterval: function (interval) {
            this.frameInterval = interval;
            const animated = true;
            this._throttleAnimation = Oskari.util.throttle(() => this.next(animated), interval);
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
        setValues: function (values, selected) {
            const value = typeof selected === 'undefined' ? this.selectedValue : selected;
            if (Array.isArray(values) && values.length > 1) {
                values.sort(this._sortAsc);
                if (values.includes(value)) {
                    this.setSelectedValue(value);
                } else {
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

            var series = this.stateHandler.getState().indicators.filter((ind) => {
                return typeof ind.series !== 'undefined';
            });
            if (series.length > 0) {
                series.forEach((ind) => {
                    ind.selections[ind.series.id] = selected;
                    this.stateHandler.getController().updateIndicator(ind);
                });
            }

            this._setValueInProgress = false;

            if (this.animating) {
                if (this.getSelectedIndex() !== -1 && this.getSelectedIndex() !== this.values.length - 1) {
                    this._throttleAnimation();
                } else {
                    this.animating = false;
                }
            }
            // Nofity table and graph
            var eventBuilder = Oskari.eventBuilder('StatsGrid.ParameterChangedEvent');
            this.sandbox.notifyAll(eventBuilder());
        },
        next: function (animatedChange) {
            if (animatedChange && !this.animating) {
                return;
            }
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
            var regionset = this.stateHandler.getState().activeRegionset;
            if (regionset) {
                var statsByRegionset = this.seriesStats[hash];
                if (statsByRegionset) {
                    return statsByRegionset[regionset];
                }
            }
        },
        _sortAsc: function (a, b) {
            return a - b;
        },
        collectGroupStats: function () {
            var me = this;
            var region = this.stateHandler.getState().activeRegionset;
            if (!region) {
                me._log.warn('Can\'t collect series data without region');
                return;
            }

            var seriesWithoutStats = this.stateHandler.getState().indicators.filter(function (ind) {
                return typeof ind.series !== 'undefined' && !me.getSeriesStats(ind.hash);
            });
            if (seriesWithoutStats.length > 0) {
                var collectedCount = 0;
                var collectedLastStatsCb = function () {
                    collectedCount++;
                    if (collectedCount === seriesWithoutStats.length) {
                        // TODO notify ParameterChangedEvent ??
                    }
                };
                seriesWithoutStats.forEach(function (ind) {
                    me._collectSeriesGroupStats(ind.datasource, ind.indicator, ind.selections, ind.series, collectedLastStatsCb);
                });
            }
        },
        /**
         * @method @private
         * Collect all values for the series to gather stats for classification
         */
        _collectSeriesGroupStats: async function (datasrc, indicator, selections, series, callback) {
            var me = this;
            var collectedValues = [];
            var collectedCount = 0;
            var regionset = this.stateHandler.getState().activeRegionset;

            // Get data for each selection in the series
            for (const val of series?.values) {
                try {
                    var params = {};
                    params[series.id] = val;
                    params = jQuery.extend({}, selections, params);
                    const { indicatorData } = me.stateHandler.getState();
                    const data = indicatorData[indicator];

                    collectedCount++;
                    for (var key in data) {
                        if (data.hasOwnProperty(key)) {
                            var value = data[key];
                            if (value !== undefined && value !== null) {
                                collectedValues.push(value);
                            }
                        }
                    }

                    // Completing the last call
                    if (collectedCount === series.values.length) {
                        var hash = getHash(datasrc, indicator, selections, series);

                        var statsByRegionset = me.seriesStats[hash];
                        if (!statsByRegionset) {
                            statsByRegionset = {};
                            me.seriesStats[hash] = statsByRegionset;
                        }
                        statsByRegionset[regionset] = new geostats(collectedValues);

                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                } catch (error) {
                    me._log.warn('Collecting series data failed for value: ' + val);
                }
            }
        },
        bindToEvents: function (statisticsService) {
            statisticsService.on('StatsGrid.StateChangedEvent', evt => {
                if (evt.isReset()) {
                    return;
                }
                this.collectGroupStats();
            });
            statisticsService.on('StatsGrid.RegionsetChangedEvent', () => this.collectGroupStats());
            statisticsService.on('StatsGrid.IndicatorEvent', evt => {
                if (evt.series) {
                    this.collectGroupStats();
                }
            });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
