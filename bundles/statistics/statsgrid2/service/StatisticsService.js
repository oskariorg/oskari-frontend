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

    function (sandbox) {
        this.sandbox = sandbox;
        this.cache = {};

        // This object contains all the data source indicator metadata keyed by the plugin name.
        this.__indicatorsMetadata = {};
        this.__regionCategories = [];
        // This object contains the data grid content values keyed by the indicator id, i.e. column.
        this.__indicators = {};
        this.cacheSize = 0;
        this.callbackQueue = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.CallbackQueue');
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.bundle.statsgrid.StatisticsService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method init
         * Initializes the service
         */
        init: function () {

        },
        getDataSources : function(callback) {
            if(!callback) {
                this.sandbox.printWarn('Provide callback for StatisticsService.getDataSources()');
                return;
            }
            if(this.__indicatorsMetadata.length > 0) {
                callback(this.__indicatorsMetadata);
                return;
            }
            var queueName = 'getDataSources';
            if(!this.callbackQueue.addCallbackToQueue(queueName, callback)) {
                // already handling the request, all callbacks will be called when done
                return;
            }

            var me = this,
                url = Oskari.getSandbox().getAjaxUrl() + "action_route=GetIndicatorsMetadata";
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                url: url,
                success: function (indicatorsMetadata) {
                    if(!indicatorsMetadata || indicatorsMetadata.error) {
                        callback();
                        return;
                    }

                    if (indicatorsMetadata) {
                        /*
                         * The response schema contains plugin classnames as keys to objects with information about the indicators.
                         * "fi.nls.oskari.control.statistics.plugins.sotka.SotkaStatisticalDatasourcePlugin": {
                         *   "indicators": {
                         *     "1411":{
                         *       "source": {...},
                         *       "selectors": {...},
                         *       "description": {...},
                         *       "layers":[
                         *         // FIXME: Localize the layerIds for the dropdown.
                         *         {"layerVersion":"1","type":"FLOAT","layerId":"Kunta"},
                         *         ...
                         *       ],
                         *       "name": {...}
                         *     }, ...
                         *   },
                         *   "localizationKey":"fi.nls.oskari.control.statistics.plugins.sotka.plugin_name"
                         * }
                         */
                        me.__indicatorsMetadata = Oskari.clazz.create(
                                'Oskari.statistics.bundle.statsgrid.domain.SourcesMetadata',
                                indicatorsMetadata);
                    }
                    me.callbackQueue.notifyCallbacks(queueName, [me.__indicatorsMetadata]);
                },
                error: function (jqXHR, textStatus) {
                    me.callbackQueue.notifyCallbacks(queueName);
                }
            });
        },
        getIndicatorValue : function(datasource, id, options, callback) {
            if(!datasource || !id) {
                this.sandbox.printWarn('StatisticsService.getIndicatorValue() with no datasource or id, returning null');
                callback();
                return;
            }
            var indicator =  this._findIndicator(datasource, id);
            var me = this,
                url = this.getDataSources(datasource).getIndicatorValuesUrl(id);

            var queueName = this.callbackQueue.getQueueName('getIndicatorValue', arguments);
            if(!this.callbackQueue.addCallbackToQueue(queueName, callback)) {
                // already handling the request, all callbacks will be called when done
                return;
            }
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    options : JSON.stringify(options)
                },
                url: url,
                success: function (pResp) {
                    if(!pResp || pResp.error) {
                        callback();
                        return;
                    }
                    me.callbackQueue.notifyCallbacks(queueName, [pResp]);
                },
                error: function (jqXHR, textStatus) {
                    me.callbackQueue.notifyCallbacks(queueName);
                }
            });
        },
        getIndicators : function(datasourceId, callback) {
            if(!callback || !datasourceId) {
                this.sandbox.printWarn('Provide datasourceId and callback for StatisticsService.getIndicators()');
                return;
            }
            // return cached if available
            if(this.__indicators[datasourceId]) {
                callback(this.__indicators[datasourceId]);
                return;
            }
            // get indicators from backend
            var ds = this.getDataSource(datasourceId);
            if(!ds) {
                callback();
                return;
            }
            var me = this,
                url = ds.getIndicatorListUrl();

            var queueName = this.callbackQueue.getQueueName('getIndicators', arguments);
            if(!this.callbackQueue.addCallbackToQueue(queueName, callback)) {
                // already handling the request, all callbacks will be called when done
                return;
            }
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                url: url,
                success: function (pResp) {
                    me.__handleIndicatorsResponse(pResp, datasourceId, function() {
                        me.callbackQueue.notifyCallbacks(queueName, arguments);
                    });
                },
                error: function (jqXHR, textStatus) {
                    me.callbackQueue.notifyCallbacks(queueName);
                }
            });
        },
        __handleIndicatorsResponse : function(response, datasourceId, callback) {
            var parsed = [];
            _.each(response, function(data) {
                var indicator = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.domain.Indicator', data);
                parsed.push(indicator);

            });
            this.__indicators[datasourceId] = parsed;
            callback(parsed);
        },
        getRegions : function(categoryId, callback) {
            if(!categoryId) {
                this.sandbox.printWarn('StatisticsService.getIndicatorMetadata() with no categoryId, returning null');
                callback();
                return;
            }
            var category = _.find(this.__regionCategories, function(item) {
                // normalize to strings
                return '' + item.getId() === '' + categoryId;
            });
            if(category.getRegions().length > 0) {
                callback(category);
                return;
            }
            var queueName = this.callbackQueue.getQueueName('getRegions', arguments);
            if(!this.callbackQueue.addCallbackToQueue(queueName, callback)) {
                // already handling the request, all callbacks will be called when done
                return;
            }
            var me = this,
                url = Oskari.getSandbox().getAjaxUrl() + "action_route=StatisticalIndicatorRegions&id=" + categoryId;
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                url: url,
                success: function (pResp) {
                    if(!pResp || pResp.error) {
                        callback();
                        return;
                    }
                    category.setRegions(pResp);
                    me.callbackQueue.notifyCallbacks(queueName, [category]);
                },
                error: function (jqXHR, textStatus) {
                    me.callbackQueue.notifyCallbacks(queueName);
                }
            });
        },
        /**
         * Find indicator, expects indicators to be loaded into this.__indicators[datasource]
         * @param  {[type]} datasource [description]
         * @param  {[type]} id         [description]
         * @return {[type]}            [description]
         */
        _findIndicator : function(datasource, id) {

            var indicator = _.find(this.__indicators[datasource], function(item) {
                // normalize to strings
                return '' + item.getId() === '' + id;
            });

            if(!indicator) {
                this.sandbox.printWarn('Indicator with id ' + id + ' not found');
            }
            return indicator;
        },

        /**
         * @method sendStatsData
         * Sends an event with selected column and the data array.
         * @param {Object} layer Oskari layer which the visualization should be applied to
         * @param {Object} data The data which gets displayed in the grid
         */
        sendStatsData: function (layer, data) {
            var me = this,
                eventBuilder = me.sandbox.getEventBuilder('StatsGrid.StatsDataChangedEvent');
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
         * param ignoreCache (ignore & refresh cache)
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
