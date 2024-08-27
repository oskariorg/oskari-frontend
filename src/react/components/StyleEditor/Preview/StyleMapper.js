/**
 * Prefix object keys with "data-" so we can safely pass them to DOM element
 * @param {String} format point, line or area
 * @param {Object} props flags for style selection based on format
 */
export const getAsDataAttributes = (format, style) => {
    const props = getPropsForFormat(format, style);
    const testAttrs = {
        'data-format': format
    };
    Object.keys(props).forEach(key => {
        testAttrs['data-' + key] = props[key];
    });
    return testAttrs;
};

/**
 * Returns a simplified object based on format for generating preview SVG
 * @param {String} format geometry type: point, line or area
 * @param {Object} style Oskari style object
 * @returns simplified style object for SVG generator
 */
const getPropsForFormat = (format, style) => {
    if (format === 'point') {
        return getPointPropsFromStyle(style);
    } else if (format === 'line') {
        return getLinePropsFromStyle(style);
    } else if (format === 'area') {
        return getAreaPropsFromStyle(style);
    }
    throw new Error("Unrecognized format");
}

const getAreaPropsFromStyle = (style) => {
    const { fill = {} } = style;
    const stroke = style.stroke?.area || {};
    return {
        color: fill.color,
        strokecolor: stroke.color,
        size: stroke.width,
        strokestyle: stroke.lineDash,
        linejoin: stroke.lineJoin,
        pattern: fill.area?.pattern
    };
};

const getLinePropsFromStyle = (style = {}) => {
    const {stroke = {}} = style;
    return {
        color: stroke.color,
        size: stroke.width,
        linecap: stroke.lineCap,
        linedash: stroke.lineDash,
        linejoin: stroke.lineJoin
    };
};

const getPointPropsFromStyle = (style = {}) => {
    const {image = {}} = style;
    const {fill = {}} = image;
    return {
        color: fill.color,
        size: image.size,
        shape: image.shape
    };
};
