
// ----------------------------------------------------------------------
// Built-in formatters
// TODO: add params handling for formatters
// ----------------------------------------------------------------------
const linkFormatter = (value, params = {}) => {
    let label = params.label;
    if (!label) {
        if (params.fullUrl === true) {
            label = value;
        } else {
            // defaults to shortened url (max 50 chars for default)
            label = shortenUrl(value);
        }
    }
    return `<a href="${value}" rel="noreferrer noopener" target="_blank" title="${value}">${label}</a>`;
};

const WELL_KNOWN_PROTO = ['http://', 'https://'];
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

const shortenUrl = (url = '', maxLength = 50) => {
    if (url.length <= maxLength) {
        return url;
    }
    const urlValue = removeWellknownProtocolFromUrl(url);
    if (urlValue.length <= maxLength) {
        return urlValue;
    }
    const partLength = maxLength / 2;
    const start = shortenString(urlValue, partLength);
    const end = reverseString(shortenString(reverseString(urlValue), partLength));
    return start + '...' + end;
};

const reverseString = (input = '') => input.split('').reverse().join('');

const SHORTEN_STOP_CHARS = [' ', '/', '&', '?'];
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

const imgFormatter = (value, params = {}) => {
    // TODO: onError=replace with nicer placeholder? Maybe when refactoring to React?
    const img = `<img class="oskari_gfi_img" src="${value}"></img>`;
    if (params.link === true) {
        return linkFormatter(value, { label: img });
    }
    return img;
};
// TODO: add decimal precision formatting etc localized formatting
const numberFormatter = (value) => value;

// Creates a formatter that takes value and wraps it in the html-element that was given as param when creating the formatter.
const tagWrapper = (tag) => (value) => `<${tag}>${value}</${tag}>`;

// ----------------------------------------------------------------------
// Formatter REGISTRY
// Note! other components can add or override formatters
// ----------------------------------------------------------------------

const DEFAULT_FORMATTER = '__default';
const formatters = {
    [DEFAULT_FORMATTER]: (value) => value,
    link: linkFormatter,
    image: imgFormatter,
    number: numberFormatter
};
const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'i', 'b', 'em'];
tags.forEach(tag => { formatters[tag] = tagWrapper(tag); });

const hasFormatter = type => type && typeof formatters[type] === 'function';
const setFormatter = (type, func) => { formatters[type] = func; };
const getFormatter = type => {
    if (hasFormatter(type)) {
        return formatters[type];
    }
    // return formatter that tries to detect the type from value
    return (value) => {
        const typeGuess = detectType(value);
        if (hasFormatter(typeGuess)) {
            return formatters[typeGuess](value);
        }
        // if we can't detect the formatter, return value as is
        return value;
    };
};

const detectType = (value) => {
    if (!value) {
        return DEFAULT_FORMATTER;
    }
    if (typeof value === 'number') {
        return 'number';
    }
    if (typeof value === 'string') {
        const protocolSeparator = value.indexOf('://');
        if (protocolSeparator >= 0 && protocolSeparator < 10) {
            // protocol separator found "close enough" to the start -> format as link
            return 'link';
        }
    }
    return DEFAULT_FORMATTER;
};

export {
    getFormatter,
    setFormatter
};
