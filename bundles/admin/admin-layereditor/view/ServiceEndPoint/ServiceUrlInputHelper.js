export const RESERVED_LAYER_PARAMS = ['service', 'request', 'version'];

export const cleanUrlAndExtractParams = (url) => {
    if (!url) {
        return {};
    }

    if (url.indexOf('http') === -1) {
        url = 'http://' + url;
    }

    const urlObj = new URL(url);
    const params = {};
    urlObj.searchParams.forEach((value, key) => {
        if (!RESERVED_LAYER_PARAMS.includes(key.toLowerCase())) {
            params[key] = value;
        }
    });
    // All URL params are removed from the URL and persisted separately in layer.params.
    urlObj.search = '';

    const parts = urlObj.toString().split('://');
    const retValString = parts.length > 1 ? parts[1] : urlObj.toString();
    const decoded = decodeURIComponent(retValString);
    return {
        cleanedUrl: decoded,
        params
    };
};

export const getFullServiceUrl = (layer) => {
    const { url, params = {} } = layer;
    if (!url) {
        return null;
    }
    const normalized = url.includes('://') ? url : `https://${url}`;
    const urlObj = new URL(normalized);
    Object.entries(params).forEach(([key, value]) => {
        if (value != null) {
            urlObj.searchParams.set(key, String(value));
        }
    });
    return urlObj.toString();
};
