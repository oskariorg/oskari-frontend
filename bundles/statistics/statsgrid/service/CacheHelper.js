import { removeIndicatorFromCache, updateIndicatorListInCache } from '../handler/SearchIndicatorOptionsHelper';
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
    getIndicatorMetadataKey: function (datasrc, indicatorId) {
        return 'GetIndicatorMetadata_' + datasrc + '_' + indicatorId;
    },
    getIndicatorDataKey: function (datasrc, indicatorId, selectors, regionset) {
        let serialized = '';
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
    updateIndicatorInCache: async function (datasrc, indicatorId, data) {
        const me = this;
        const updateMetadataCache = function () {
            // only inject when guest user, otherwise flush from cache
            const metadataCacheKey = me.getIndicatorMetadataKey(datasrc, indicatorId);
            // flush/update indicator metadata from cache
            const metadata = me.cache.get(metadataCacheKey) || me.__getCachedMetadataSkeleton(indicatorId);
            // update indicator fields
            metadata.name[Oskari.getLang()] = data.name;
            metadata.description[Oskari.getLang()] = data.description;
            metadata.source[Oskari.getLang()] = data.datasource;
            me.cache.put(metadataCacheKey, metadata);
        };

        try {
            if (data.id) {
                // existing indicator -> update it
                updateIndicatorListInCache(datasrc, {
                    id: data.id,
                    name: data.name
                });
                // possibly update "regionsets": [1851,1855] in listing cache
                updateMetadataCache();
            } else {
                // new indicator
                // only inject when guest user, otherwise flush from cache
                updateIndicatorListInCache(datasrc, {
                    id: indicatorId,
                    name: data.name,
                    regionsets: []
                });
                updateMetadataCache();
            }
        } catch (error) {
            throw new Error(error);
        }
    },
    updateIndicatorDataCache: async function (datasrc, indicatorId, selectors, regionset, data) {
        const me = this;
        try {
            // existing indicator -> update it
            const existingIndicator = updateIndicatorListInCache(datasrc, {
                id: indicatorId,
                newRegionset: regionset
            });

            // only inject when guest user, otherwise flush from cache
            const metadataCacheKey = me.getIndicatorMetadataKey(datasrc, indicatorId);
            // flush/update indicator metadata from cache
            const metadata = me.cache.get(metadataCacheKey) || me.__getCachedMetadataSkeleton(indicatorId);
            // update regionsets
            metadata.regionsets = existingIndicator.regionsets;
            Object.keys(selectors).forEach(function (selectorId) {
                const selectorValue = selectors[selectorId];
                const existingSelector = metadata.selectors.find(function (item) {
                    return item.id === selectorId;
                });
                if (!existingSelector) {
                    // new selector -> add it with the only allowed value (the one we are inserting)
                    metadata.selectors.push({
                        id: selectorId,
                        name: selectorId,
                        allowedValues: [{
                            name: selectorValue,
                            id: selectorValue
                        }]
                    });
                } else {
                    // there's an existing one, check if the value we are adding is new or not
                    const existingValue = existingSelector.allowedValues.find(function (item) {
                        if (typeof item !== 'object') {
                            // allowed value might be a simple value instead of an object
                            return '' + item === '' + selectorValue;
                        }
                        return '' + item.id === '' + selectorValue;
                    });
                    if (!existingValue) {
                        // only need to modify the values if it's a new value for the selector
                        existingSelector.allowedValues.push({
                            name: selectorValue,
                            id: selectorValue
                        });
                    }
                }
            });
            me.cache.put(metadataCacheKey, metadata);

            const dataCacheKey = me.getIndicatorDataKey(datasrc, indicatorId, selectors, regionset);
            me.cache.put(dataCacheKey, data);
        } catch (error) {
            throw new Error(error);
        }
    },
    __getCachedMetadataSkeleton: function (indicatorId) {
        return {
            public: true,
            id: indicatorId,
            name: {},
            description: {},
            source: {},
            regionsets: [],
            selectors: []
        };
    },
    clearCacheOnDelete: function (datasrc, indicatorId, selectors, regionset) {
        const metadataCacheKey = this.getIndicatorMetadataKey(datasrc, indicatorId);
        if (!selectors && !regionset) {
            // removed the whole indicator: flush indicator from cache
            this.cache.flushKeysStartingWith(this.getIndicatorDataKeyPrefix(datasrc, indicatorId));
            // remove single with guest user
            removeIndicatorFromCache(datasrc, indicatorId);
            this.cache.remove(metadataCacheKey);
        } else if (Oskari.user().isLoggedIn()) {
            // flush the cache for logged in user so it gets reloaded from the server
            // for guests this will show some erronous info, but it's a beast to track which
            //  year/regionsets actually have data and can be removed
            this.cache.remove(metadataCacheKey);
            // flush whole user indicators listing from cache for logged in user
            removeIndicatorFromCache(datasrc);
            this.cache.remove(this.getIndicatorDataKey(datasrc, indicatorId, selectors, regionset));
        }
    }
});
