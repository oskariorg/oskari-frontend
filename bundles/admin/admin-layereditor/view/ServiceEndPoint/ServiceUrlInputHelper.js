export const RESERVED_LAYER_PARAMS = ['service', 'request', 'version'];
export const cleanUrl = (url) => {
    if (!url) {
        return;
    };

    if (url.indexOf('http') === -1) {
        url = 'http://' + url;
    }

    const urlObj = new URL(url);
    const keysToDelete = [];
    urlObj.searchParams.forEach((value, key) => {
        if (RESERVED_LAYER_PARAMS.includes(key.toLowerCase())) {
            keysToDelete.push(key);
        }
    });

    keysToDelete.forEach((key) => urlObj.searchParams.delete(key));

    const parts = urlObj.toString().split('://');
    const retValString = parts.length > 1 ? parts[1] : urlObj.toString();
    const decoded = decodeURIComponent(retValString);
    return decoded;
};
