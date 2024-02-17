/*
------------------ CACHING ------------------------
*/
// cache storage object
const indicatorListPerDatasource = {};
const getCacheKey = datasourceId => 'ds_' + datasourceId;

/**
 * Remove single OR all indicators from cache
 * @param {Number} datasourceId
 * @param {Number|String} indicatorId (optional)
 */
export const removeIndicatorFromCache = (indicator) => {
    const { ds, id } = indicator;
    const cachedResponse = indicatorListPerDatasource[getCacheKey(ds)];
    if (!cachedResponse) {
        return;
    }
    if (id) {
        // single indicator
        cachedResponse.indicators = cachedResponse.indicators.filter(indicator => indicator.id !== id);
    } else {
        // all indicators
        indicatorListPerDatasource[getCacheKey(ds)] = null;
    }
};
/**
 * Updates or adds to indicator listing cache
 * Indicator always has id and might have name OR newRegionset key
 */
export const updateIndicatorListInCache = (indicator, regionset) => {
    const cachedResponse = indicatorListPerDatasource[getCacheKey(indicator.ds)];
    if (!cachedResponse) {
        return;
    }
    const cachedIndicator = cachedResponse.indicators.find(cachedInd => cachedInd.id === indicator.id);
    if (!cachedIndicator) {
        // insert
        // only inject when guest user, otherwise flush from cache
        cachedResponse.indicators.push({ indicator, regionsets: [regionset]});
        return indicator;
    }
    // name not sent when updating regionset, TODO: why?
    cachedIndicator.name = indicator.name || cachedIndicator.name;
    // update regionset
    // this updates the cache as well as mutable objects are being passed around
    const regionsets = cachedIndicator.regionsets || [];
    if (regionset && !regionsets.includes(regionset)) {
        // add regionset for indicator if it's a new one
        regionsets.push(regionset);
        cachedIndicator.regionsets = regionsets;
    }
    return cachedIndicator;
};
/*
------------------ /CACHING ------------------------
*/

/*
------------------ MAIN FUNCTIONALITY ------------------------
*/
/**
 * Fetches listing from server andd calls callback with a list of indicators for the datasource.
 *
 * This could be a long operation and successCallback might be called several times
 * with the list of indicators.
 * We use callbacks to enable partial updates as partial indicator list might be returned
 * while parsing the responses from the backing services.
 * If the results are already cached on the server the callback is only called once
 * @param {Number}   datasourceId       datasource id
 * @param {function} successCallback    called 0-n times with the whole list of indicators as param for all calls
 * @param {function} errorCallback      called if there's an error. Called only once with error message as param.
 */
export const populateIndicatorOptions = async (datasourceId, successCallback, errorCallback) => {
    if (!datasourceId) {
        if (typeof errorCallback === 'function') {
            errorCallback('errors.myIndicatorDatasource');
        }
        return;
    }
    const cacheKey = 'ds_' + datasourceId;
    const cachedResponse = indicatorListPerDatasource[cacheKey];
    if (cachedResponse) {
        // found a cached response
        successCallback({
            complete: true,
            indicators: [...cachedResponse.indicators]
        });
        return;
    }

    try {
        const response = await populateIndicatorListFromServer(datasourceId, successCallback);
        const value = {
            // always signal complete when we are done with retries, even if server returned !complete
            complete: true,
            indicators: response.indicators || []
        };
        if (response.complete) {
            // cache result if complete
            // this allows the server to continue processing and return updated list when available
            indicatorListPerDatasource[cacheKey] = value;
        }
        successCallback(value);
    } catch (error) {
        if (typeof errorCallback === 'function') {
            errorCallback('errors.indicatorListError');
        } else {
            throw new Error(error);
        }
    }
};
/*
------------------ /MAIN FUNCTIONALITY ------------------------
*/

/*
------------------ INTERNAL HELPERS ------------------------
*/

const RETRY_LIMIT = 5;
const populateIndicatorListFromServer = async (datasourceId, successCallback, retryCount = RETRY_LIMIT, previousResult = {}) => {
    const response = await getIndicatorListFromServer(datasourceId);
    if (response.complete) {
        return response;
    }
    if (retryCount === 0) {
        // not succesful after {RETRY_LIMIT} tries
        throw new Error('Error loading indicators. Tried ' + RETRY_LIMIT + ' times');
    }
    const newIndicatorCount = response.indicators?.length || 0;
    const previousIndicatorCount = previousResult.indicators?.length || 0;
    let newRetryCount = retryCount;
    if (newIndicatorCount === previousIndicatorCount) {
        // Same indicator list as in previous try -> not getting anything new.
        // There might be some problems with the service -> reduce retries
        newRetryCount = retryCount - 1;
    } else {
        // notify we have new results but keep on going with the timeout
        successCallback(response);
    }

    return new Promise((resolve, reject) => {
        // try again after 10 seconds
        setTimeout(async () => {
            try {
                resolve(await populateIndicatorListFromServer(datasourceId, successCallback, newRetryCount, response));
            } catch (err) {
                reject(err);
            }
        }, 10000);
    });
};

const getIndicatorListFromServer = async (datasourceId) => {
    try {
        const response = await fetch(Oskari.urls.getRoute('GetIndicatorList', {
            datasource: datasourceId
        }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        return await response.json();
    } catch (error) {
        throw new Error('errors.indicatorListIsEmpty');
    }
};
