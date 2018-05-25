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
    updateIndicatorCache: function (datasrc, indicatorId, data) {

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
