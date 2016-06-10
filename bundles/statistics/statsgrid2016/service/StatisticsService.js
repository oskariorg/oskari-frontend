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
        this.cache = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.Cache');
        // pushed from instance
        this.datasources = [];
    }, {
        __name: "StatsGrid.StatisticsService",
        __qname: "Oskari.statistics.bundle.statsgrid.StatisticsService",

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        getRegionsets : function() {
            // get statslayers from sandbox -> id + name
            return [{
                id : 1,
                name : "moi"
            }];
        },

        addDatasource : function(ds) {
            if(!ds) {
                // log error message
                return;
            }
            var me = this;
            if (_.isArray(ds)) {
                //if(typeof ds === 'array') -> loop and add all
                ds.forEach(function(item) {
                    me.addDatasource(item);
                });
                return;
            }
            this.datasources.push(ds);
        },

        /**
         * Returns datasource {id, name, type} as object.
         * If id omitted returns all datasources as array.
         * If datasource with matching id isn't found returns null.
         * @param  {Number} id datasource id
         * @return {Object[]|Object|Null} datasource information or null if not found
         */
        getDatasource : function(id) {
            if(!id) {
                return this.datasources;
            }
            var found = null;
            datasources.forEach(function(ds) {
                if(ds.id === id) {
                    found = ds;
                }
            });
            return found;
        },
        /**
         * Returns regionsets that are available to user.
         * Based on maplayers of type STATS.
         */
        getRegionsets : function() {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            var layers = service.getLayersOfType('STATS');
            if(!layers) {
                return [];
            }
            var list = [];
            layers.forEach(function(regionset) {
                list.push({
                    id : regionset.getId(),
                    name : regionset.getName()
                });
            });
            return list;
        },
        /**
         * Calls callback with a list of regions for the regionset.
         * @param  {Number}   regionset regionset id
         * @param  {Function} callback  function to call with error or results
         */
        getRegions : function(regionset, callback) {
            if(!regionset || typeof callback !== 'function') {
                // log error message
                return;
            }
            // TODO: call GetRegions with parameter regionset=regionset
            // use first param as error indicator - null == no error
            callback(null, [{
                "id" : "regionid",
                "name" : "region name"
            }]);
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds       datasource id
         * @param  {Function} callback function to call with error or results
         */
        getIndicatorList : function(ds, callback) {
            if(!ds || typeof callback !== 'function') {
                // log error message
                return;
            }
            var cacheKey = 'GetIndicatorList_' + ds;
            var cached = this.cache.get(cacheKey);
            if(cached) {
                callback(null, cached);
                return;
            }

            var queueKey = 'queueGetIndicatorList_' + ds;
            var queue = this.cache.get(queueKey);
            if(!queue) {
                queue = [];
            }
            queue.push(callback);
            this.cache.put(queueKey, queue);
            if(queue.length > 1) {
                // request already in progress
                return;
            }
            var me = this;
            // call GetIndicatorList with parameter datasource=ds
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    datasource : ds
                },
                url: me.sandbox.getAjaxUrl('GetIndicatorList'),
                success: function (pResp) {
                    me.cache.put(cacheKey, pResp.indicators);
                    var callbacks = me.cache.get(queueKey);
                    callbacks.forEach(function(cb) {
                        cb(null, pResp.indicators);
                    });
                    me.cache.put(queueKey, null);
                },
                error: function (jqXHR, textStatus) {
                    var callbacks = me.cache.get(queueKey);
                    callbacks.forEach(function(cb) {
                        cb('Error loading indicators');
                    });
                    me.cache.put(queueKey, null);
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorMetadata : function(ds, indicator, callback) {
            if(!ds ||!indicator || typeof callback !== 'function') {
                // log error message
                return;
            }
            var me = this;
            // call GetIndicatorMetadata with parameter datasource=ds and indicator=indicator
            // use first param as error indicator - null == no error
            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                data : {
                    datasource : ds,
                    indicator : indicator
                },
                url: me.sandbox.getAjaxUrl('GetIndicatorMetadata'),
                success: function (pResp) {
                    callback(null, pResp);
                },
                error: function (jqXHR, textStatus) {
                    callback('Error loading indicators');
                }
            });
        },
        /**
         * Calls callback with a list of indicators for the datasource.
         * @param  {Number}   ds        datasource id
         * @param  {Number}   indicator indicator id
         * @param  {Function} callback  function to call with error or results
         */
        getIndicatorData : function(ds, indicator, params, regionset, callback) {
            if(!ds ||!indicator || typeof callback !== 'function') {
                // log error message
                return;
            }
            // TODO: call GetIndicatorData with parameters:
            // - datasource=ds
            // - indicator=indicator
            // - selectors=serialized params
            // - regionset = regionset
            // use first param as error indicator - null == no error
            callback(null, { "regionid" : "data" });
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
