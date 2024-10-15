// protocols that can be removed from url labels
const WELL_KNOWN_PROTO = ['http://', 'https://'];
// for reasonable breakpoint
const SHORTEN_STOP_CHARS = [' ', '/', '&', '?'];
// so we can find a shorten string from the end of the string
const reverseString = (input = '') => input.split('').reverse().join('');

/**
 * The returned string can be a little shorter than preferredLength
 * or in worst case it can be one character over with added '...' in the middle.
 * @param {String} url
 * @param {Number} preferredLength defaults to 50.
 */
export const shortenUrl = (url = '', preferredLength = 50) => {
    if (url.length <= preferredLength) {
        return url;
    }
    const urlValue = removeWellknownProtocolFromUrl(url);
    if (urlValue.length <= preferredLength) {
        return urlValue;
    }
    const partLength = preferredLength / 2;
    const start = shortenString(urlValue, partLength);
    const end = reverseString(shortenString(reverseString(urlValue), partLength));
    return start + '...' + end;
};

/**
 * Removes http:// or https:// from the start of the input url
 * Case-insensitive
 * @see WELL_KNOWN_PROTO for protocols that are removed
 * @param {String} url
 */
const removeWellknownProtocolFromUrl = (url = '') => {
    // this function is just to handle url in case-insensitive way
    if (!url) {
        return url;
    }
    const input = url.toLowerCase();
    const foundProto = WELL_KNOWN_PROTO.findIndex(proto => input.startsWith(proto));
    if (foundProto === -1) {
        return url;
    }
    return url.substring(WELL_KNOWN_PROTO[foundProto].length);
};

/**
 * Shortens given string to maxLength or a bit less if it can find a reasonable
 * character to cut from.
 * @see SHORTEN_STOP_CHARS
 * @param {String} input
 * @param {Number} maxLength defaults to 25
 */
const shortenString = (input = '', maxLength = 25) => {
    if (input.length < maxLength) {
        return input;
    }
    const threshold = maxLength * 0.8;
    let candidate = input.substring(0, threshold);
    let restOfInput = input.substring(threshold).split('');
    while (restOfInput.length && candidate.length < maxLength) {
        const character = restOfInput.shift();
        if (SHORTEN_STOP_CHARS.includes(character)) {
            // encountered char that is natural shorten point
            break;
        }
        candidate += character;
    }
    return candidate;
};
