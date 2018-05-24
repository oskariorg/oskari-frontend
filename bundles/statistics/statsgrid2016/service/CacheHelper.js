/**
 * @class Oskari.statistics.statsgrid.CacheHelper
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.CacheHelper', function (cache) {
    this.cache = cache;
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
    }
});
