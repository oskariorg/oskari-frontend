const PLACEHOLDER_FILL = '$fill';
const PLACEHOLDER_STROKE = '$stroke';
const SVG_SRC = 'data:image/svg+xml;utf8,';
const EMPTY_MARKER = { data: '<svg/>' };
const STROKE_COLOR = '#000000';
const FILL_COLOR = '#000000';
const SVG_SIZE = 32;
const DEFAULT_MARKER = 2;

const COLORS = [
    '#ffffff',
    '#cccccc',
    '#818282',
    '#666666',
    '#000000',
    '#f8931f',
    '#ffde00',
    '#ff3334',
    '#bf2652',
    '#652d90',
    '#3233ff',
    '#2ba7ff',
    '#26bf4b',
    '#00ff01',
    '#ffff00',
];

let _markers = [];
let _iconSrc = null;
let _defaultStyle = {};
let _customColors = null;
let _themeColors = {};

// getPixelForSize / markerTemplate svg viewBox size
const getScale = (size = 1) => (40 + 10 * size) / 64;

const setColors = colors => {
    _customColors = colors;
};
const getColors = () => Array.isArray(_customColors) ? [..._customColors ] : [...COLORS];

// AppSetup.env.svgMarkers
const setMarkers = markers => {
    _markers = markers || [];
    _iconSrc = null;
};

const getMarkers = () => _markers;

const getMarker = shape => {
    const marker = _markers[shape];
    if (marker) {
        return { ...marker };
    }
    if (typeof shape === 'number') {
        Oskari.log('Oskari customization').warn(`Requested marker: ${shape} doesn't exist. Returning default marker instead.`);
    }
    const defaultMarker = _markers[DEFAULT_MARKER] || _markers[0] || EMPTY_MARKER;
    return { ...defaultMarker };
};

// All svg icons with default colors for style editor buttons etc..
const getSvgIcons = () => {
    if (!_iconSrc) {
        _iconSrc = getMarkers().map((m, index) => getSvg({ shape: index, fill: { color: FILL_COLOR } }));
    }
    return _iconSrc;
};

// oskari style image object
const getSvg = ({ shape, size, fill, stroke }) => {
    const { data, ...offsets } = getMarker(shape);
    const svg = data
        .replace(PLACEHOLDER_FILL, fill?.color || FILL_COLOR)
        .replace(PLACEHOLDER_STROKE, stroke?.color || STROKE_COLOR);
    return {
        ...offsets,
        scale: getScale(size),
        src: SVG_SRC + encodeURIComponent(svg)
    };
};

const getDefaultStyle = () => ({ ..._defaultStyle });

// AppSetup.env.oskariStyle
const setDefaultStyle = (style) => {
    _defaultStyle = style || {};
};

const getFillColor = () => _themeColors.primary || '#FAEBD7';

// to init style editor with theme color
const generateBlankStyle = () => {
    const color = getFillColor();
    if (!color) {
        return { ..._defaultStyle };
    }
    return {
        ..._defaultStyle,
        fill: {
            ..._defaultStyle.fill,
            color
        },
        image: {
            ..._defaultStyle.image,
            fill: {
                color
            }
        }
    };
};

// AppSetup.env.app.theme
const setThemeColors = (theme = {}) => {
    if (!theme.color) {
        return;
    }
    _themeColors = { ...theme.color };
    // Add theme colors to predefined colors
    const colors = [...COLORS, ...Object.values(_themeColors)];
    setColors([...new Set(colors)]);
};

export const Customization = {
    setMarkers,
    getMarkers,
    getMarker,
    getSvg,
    getSvgIcons,
    SVG_SIZE,
    setColors,
    getColors,
    getDefaultStyle,
    setDefaultStyle,
    getFillColor,
    generateBlankStyle,
    setThemeColors
};
