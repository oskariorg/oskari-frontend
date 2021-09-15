/**
 * Prefix object keys with "data-" so we can safely pass them to DOM element
 * @param {String} format point, line or area
 * @param {Object} props flags for style selection based on format
 */
const getAsDataAttributes = (format, props) => {
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
    return {
        color: style.fill.color,
        strokecolor: style.stroke.area.color,
        size: style.stroke.area.width,
        strokestyle: style.stroke.area.lineDash,
        pattern: style.fill.area.pattern
    };
};

const getLinePropsFromStyle = (style) => {
    return {
        color: style.stroke.color,
        size: style.stroke.width,
        linecap: style.stroke.lineCap,
        linedash: style.stroke.lineDash,
        linejoin: style.stroke.area.lineJoin
    };
};

const getPointPropsFromStyle = (style) => {
    return {
        color: style.image.fill.color,
        size: style.image.size,
        shape: style.image.shape
    };
};

export const StyleMapper = {
    getPropsForFormat,
    getAsDataAttributes
};
