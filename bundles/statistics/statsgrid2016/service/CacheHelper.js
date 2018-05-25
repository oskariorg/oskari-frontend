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
            var metadata = me.cache.get(metadataCacheKey) || {
                'public': true,
                'id': indicatorId,
                'name': {},
                'description': {},
                'source': {},
                'regionsets': [],
                'selectors': []
            };
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
    updateIndicatorDataCache: function () {

    },
    clearCacheOnDelete: function (datasrc, indicatorId, selectors, regionset) {
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
            var metadataCacheKey = this.getIndicatorMetadataKey(datasrc, indicatorId);
            this.cache.remove(metadataCacheKey);
        } else {
            // TODO: MODIFY indicator in caches
        }
    }
});
