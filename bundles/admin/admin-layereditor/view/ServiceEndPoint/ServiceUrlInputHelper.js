export const RESERVED_LAYER_PARAMS = ['service', 'request', 'version'];
export const cleanUrl = (url) => {
    if (!url) {
        return;
    };

    const urlObj = new URL(url);
    const keysToDelete = [];
    urlObj.searchParams.forEach((value, key) => {
        if (RESERVED_LAYER_PARAMS.includes(key.toLowerCase())) {
            keysToDelete.push(key);
        }
    });

    keysToDelete.forEach((key) => urlObj.searchParams.delete(key));
    return urlObj.toString();
};
