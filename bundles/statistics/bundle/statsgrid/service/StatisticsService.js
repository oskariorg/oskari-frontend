/**
 * @class Oskari.statistics.bundle.statsgrid.StatisticsService
 * Methods for sending out events to display data in the grid
 * and to create a visualization of the data on the map.
 * Has a method for sending the requests to backend as well.
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatisticsService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.cache = {};
        this.cacheSize = 0;
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.bundle.statsgrid.StatisticsService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () {

        },

        /**
         * @method sendStatsData
         * Sends an event with selected column and the data array.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data which gets displayed in the grid
         */
        sendStatsData: function (layer, data) {
            var me = this;
            var eventBuilder = me.sandbox.getEventBuilder('StatsGrid.SotkadataChangedEvent');
            if (eventBuilder) {
                var event = eventBuilder(layer, data);
                me.sandbox.notifyAll(event);
            }
        },

        /**
         * @method sendVisualizationData
         * Sends an event with params to build the visualization from.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data for creating the visualization
         */
        sendVisualizationData: function (layer, data) {
            var me = this,
                eventBuilder = me.sandbox.getEventBuilder('MapStats.StatsVisualizationChangeEvent');
            if (eventBuilder) {
                var event = eventBuilder(layer, data);
                me.sandbox.notifyAll(event);
            }
        },

        _cacheStatsData: function (url, data) {
            this.cache[url] = {
                accessed: new Date().getTime(),
                data: data
            };
            this.cacheSize++;
            this._pruneCache(20);
        },

        /**
         * @method _getStatsDataFromCache
         * Does some rudimentary cleanup so the cache doesn't grow huge.
         * param maxSize Maximum entry count for the cache.
         */
        _pruneCache: function (maxSize) {
            if (this.cacheSize > maxSize) {
                // cache has too many entries, remove older ones
                var pruneCount = this.cacheSize - maxSize,
                    entries = [],
                    pruned = [],
                    i,
                    p,
                    compare = function (a, b) {
                        if (a.accessed < b.accessed) {
                            return -1;
                        }
                        if (a.accessed > b.accessed) {
                            return 1;
                        }
                        return 0;
                    };
                // shove keys and access times to a sortable form
                for (p in this.cache) {
                    if (this.cache.hasOwnProperty(p)) {
                        entries.push({
                            accessed: this.cache[p].accessed,
                            url: p
                        });
                    }
                }
                entries.sort(compare);
                // push least recently accessed entries to prune list
                for (i = 0; i < pruneCount; i++) {
                    pruned.push(entries[i].url);
                }
                // prune
                for (i = 0; i < pruned.length; i++) {
                    delete this.cache[pruned[i]];
                }
                this.cacheSize = maxSize;
            }
        },

        /**
         * @method _getStatsDataFromCache
         * Tries to get the stats data from cache.
         *
         * param url to correct action route
         */
        _getStatsDataFromCache: function (url) {
            var cached = this.cache[url],
                ret = null;
            if (cached) {
                cached.accessed = new Date().getTime();
                ret = cached.data;
            }
            return ret;
        },

        /**
         * @method fetchStatsData
         * Make the AJAX call. This method helps
         * if we need to do someting for all the calls to backend.
         * Calls are now cached, cache can be ignored/refreshed for the given URL if need be.
         * Only a successful fetch will be cached.
         *
         * param url to correct action route
         * param successCb (success callback)
         * param errorCb (error callback)
         * param ignoreCache (ignore & refres cache)
         */
        fetchStatsData: function (url, successCb, errorCb, ignoreCache) {
            var me = this;
            if (!ignoreCache) {
                var cachedResp = me._getStatsDataFromCache(url);
                if (cachedResp) {
                    if (successCb) {
                        successCb(cachedResp);
                    }
                    return;
                }
            }
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: url,
                success: function (pResp) {
                    me._cacheStatsData(url, pResp);
                    if (successCb) {
                        successCb(pResp);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (errorCb && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            });
        }

    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
