// cache storage object
const regionsStore = {};

// For sync render (components)
export const getRegions = (regionsetId) => {
    const cachedResponse = regionsStore[regionsetId];
    if (!cachedResponse) {
        throw new Error(`Cache doesn't have regions for: ${regionsetId}.`);
    }
    return cachedResponse;
};

export const getRegionsAsync = async (regionset) => {
    if (!regionset) {
        // log error message
        throw new Error('Regionset id missing');
    }
    const cachedResponse = regionsStore[regionset];
    if (cachedResponse) {
        // found a cached response
        return cachedResponse;
    }
    try {
        const response = await fetch(Oskari.urls.getRoute('GetRegions', {
            regionset,
            srs: Oskari.getSandbox().getMap().getSrsName()
        }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const result = await response.json();
        const onlyWithNames = result.regions.filter(region => region.name);
        // cache results
        regionsStore[regionset] = onlyWithNames;
        return result;
    } catch (error) {
        throw new Error(error);
    }
};
