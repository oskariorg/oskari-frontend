/**
 * @method arrayToObject
 * Maps a given array to a dictionary format for easier access
 * @param  {String[]} list will be used as keys in the result object. Values are boolean 'true' for each
 * @return {Object}   object with list items as keys and bln true as values
 */
export function arrayToObject (list) {
    var result = {};
    for (var i = 0; i < list.length; ++i) {
        result[list[i]] = true;
    }
    return result;
}

/**
 * @method domainMatch
 * Used to check message origin, JSChannel only checks for an exact
 * match where we need subdomain matches as well.
 *
 * @param  {string} origin Origin domain
 * @param  {string} domain configured domain
 *
 * @return {Boolean} Does origin match config domain
 */
export function domainMatch (origin, domain) {
    if (!origin) {
        Oskari.log('RPCUtil').warn('No origin in RPC message');
        // no origin, always deny
        return false;
    }
    // Allow subdomains and different ports
    if (domain === null || domain === undefined || !domain.length) {
        // Publication is not restricted by domain
        return true;
    }

    var url = document.createElement('a');
    url.href = origin;
    var originDomain = url.hostname;

    var allowed = originDomain.endsWith(domain);
    if (!allowed) {
        // always allow from localhost
        if (originDomain === 'localhost') {
            Oskari.log('RPCUtil').warn('Origin mismatch, but allowing localhost. Published to: ' + domain);
            return true;
        }
        Oskari.log('RPCUtil').warn('Origin not allowed for RPC: ' + origin);
    }
    return allowed;
}
