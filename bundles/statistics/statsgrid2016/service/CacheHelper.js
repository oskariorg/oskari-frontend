/**
 * @class Oskari.statistics.statsgrid.CacheHelper
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.CacheHelper', function (cache, service) {
    this.cache = cache;
    this.service = service;
}, {
    getRegionsKey: function (regionset) {
        return 'GetRegions_' + regionset;
    },
    getIndicatorListKey: function (datasrc) {
        return 'GetIndicatorList_' + datasrc;
    },
    getIndicatorMetadataKey: function (datasrc, indicatorId) {
        return 'GetIndicatorMetadata_' + datasrc + '_' + indicatorId;
    },
    getIndicatorDataKey: function (datasrc, indicatorId, selectors, regionset) {
        var serialized = '';
        if (typeof selectors === 'object') {
            serialized = '_' + Object.keys(selectors).sort().map(function (key) {
                return key + '=' + JSON.stringify(selectors[key]);
            }).join(':');
        }
        return this.getIndicatorDataKeyPrefix(datasrc, indicatorId) + regionset + serialized;
    },
    getIndicatorDataKeyPrefix: function (datasrc, indicatorId) {
        return 'GetIndicatorData_' + datasrc + '_' + indicatorId + '_';
    },
    /**
     * @method updateIndicatorInCache
     * @param {Number} datasrc id for datasource
     * @param {String} indicatorId id for indicator. Note! For new indicators on guest users it's generated
     */
    updateIndicatorInCache: function (datasrc, indicatorId, data, callback) {
        var me = this;
        var updateMetadataCache = function () {
            // only inject when guest user, otherwise flush from cache
            var metadataCacheKey = me.getIndicatorMetadataKey(datasrc, indicatorId);
            // flush/update indicator metadata from cache
            var metadata = me.cache.get(metadataCacheKey) || me.__getCachedMetadataSkeleton(indicatorId);
            // update indicator fields
            metadata.name[Oskari.getLang()] = data.name;
            metadata.description[Oskari.getLang()] = data.description;
            metadata.source[Oskari.getLang()] = data.datasource;
            me.cache.put(metadataCacheKey, metadata);
            callback();
        };

        if (data.id) {
            // existing indicator -> update it
            this.service.getIndicatorList(datasrc, function (err, response) {
                if (err) {
                    callback(err);
                    return;
                }
                var existingIndicator = response.indicators.find(function (ind) {
                    return '' + ind.id === '' + data.id;
                });
                if (!existingIndicator) {
                    callback('Tried saving an indicator with id, but id didn\'t match existing indicator');
                    return;
                }
                // this probably updates the cache as well as mutable objects are being passed around
                existingIndicator.name = data.name;
                // possibly update "regionsets": [1851,1855] in listing cache
                updateMetadataCache();
            });
        } else {
            // new indicator
            var indicatorListCacheKey = me.getIndicatorListKey(datasrc);
            var cachedListResponse = me.cache.get(indicatorListCacheKey) || {
                complete: true,
                indicators: []
            };
            // only inject when guest user, otherwise flush from cache
            cachedListResponse.indicators.push({
                id: indicatorId,
                name: data.name,
                regionsets: []
            });
            me.cache.put(indicatorListCacheKey, cachedListResponse);
            updateMetadataCache();
        }
    },
    updateIndicatorDataCache: function (datasrc, indicatorId, selectors, regionset, data, callback) {
        var me = this;
        this.service.getIndicatorList(datasrc, function (err, response) {
            // find the indicator that's being edited
            if (err) {
                callback(err);
                return;
            }
            var existingIndicator = response.indicators.find(function (ind) {
                return '' + ind.id === '' + indicatorId;
            });
            if (!existingIndicator) {
                callback('Tried saving dataset for an indicator, but id didn\'t match existing indicator');
                return;
            }
            // this updates the cache as well as mutable objects are being passed around
            if (existingIndicator.regionsets.indexOf(regionset) === -1) {
                // add regionset for indicator if it's a new one
                existingIndicator.regionsets.push(regionset);
            }

            // only inject when guest user, otherwise flush from cache
            var metadataCacheKey = me.getIndicatorMetadataKey(datasrc, indicatorId);
            // flush/update indicator metadata from cache
            var metadata = me.cache.get(metadataCacheKey) || me.__getCachedMetadataSkeleton(indicatorId);
            // update regionsets
            metadata.regionsets = existingIndicator.regionsets;
            Object.keys(selectors).forEach(function (selectorId) {
                var selectorValue = selectors[selectorId];
                var existingSelector = metadata.selectors.find(function (item) {
                    return item.id === selectorId;
                });
                if (!existingSelector) {
                    // new selector -> add it with the only allowed value (the one we are inserting)
                    metadata.selectors.push({
                        id: selectorId,
                        name: selectorId,
                        allowedValues: [{
                            'name': selectorValue,
                            'id': selectorValue
                        }]
                    });
                } else {
                    // there's an existing one, check if the value we are adding is new or not
                    var existingValue = existingSelector.allowedValues.find(function (item) {
                        if (typeof item !== 'object') {
                            // allowed value might be a simple value instead of an object
                            return '' + item === '' + selectorValue;
                        }
                        return '' + item.id === '' + selectorValue;
                    });
                    if (!existingValue) {
                        // only need to modify the values if it's a new value for the selector
                        existingSelector.allowedValues.push({
                            'name': selectorValue,
                            'id': selectorValue
                        });
                    }
                }
            });
            me.cache.put(metadataCacheKey, metadata);

            var dataCacheKey = me.getIndicatorDataKey(datasrc, indicatorId, selectors, regionset);
            me.cache.put(dataCacheKey, data);

            callback();
        });
    },
    __getCachedMetadataSkeleton: function (indicatorId) {
        return {
            'public': true,
            'id': indicatorId,
            'name': {},
            'description': {},
            'source': {},
            'regionsets': [],
            'selectors': []
        };
    },
    clearCacheOnDelete: function (datasrc, indicatorId, selectors, regionset) {
        var metadataCacheKey = this.getIndicatorMetadataKey(datasrc, indicatorId);
        if (!selectors && !regionset) {
            // removed the whole indicator: flush indicator from cache
            this.cache.flushKeysStartingWith(this.getIndicatorDataKeyPrefix(datasrc, indicatorId));
            var indicatorListCacheKey = this.getIndicatorListKey(datasrc);
            var cachedListResponse = this.cache.get(indicatorListCacheKey) || {
                complete: true,
                indicators: []
            };
            // only inject when guest user, otherwise flush from cache
            var listIndex = cachedListResponse.indicators.findIndex(function (ind) {
                return ind.id === indicatorId;
            });
            if (listIndex !== -1) {
                cachedListResponse.indicators.splice(listIndex, 1);
            }
            this.cache.put(indicatorListCacheKey, cachedListResponse);
            this.cache.remove(metadataCacheKey);
        } else if (Oskari.user().isLoggedIn()) {
            // flush the cache for logged in user so it gets reloaded from the server
            // for guests this will show some erronous info, but it's a beast to track which
            //  year/regionsets actually have data and can be removed
            this.cache.remove(metadataCacheKey);
        }
    }
});
