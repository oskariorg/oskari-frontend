import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';
import olStyleIcon from 'ol/style/Icon';
import olStyleText from 'ol/style/Text';

import { LINE_DASH, LINE_JOIN, EFFECT, FILL_STYLE, STYLE_TYPE } from './constants';
import { filterOptionalStyle, getOptionalStyleFilter } from './filter';

const log = Oskari.log('MapModule.util.style');
const TRANSPARENT = 'rgba(0,0,0,0)';

const merge = (...styles) => jQuery.extend(true, {}, ...styles);

export const HIDDEN_STYLE = new olStyleStyle({ visibility: 'hidden' });

const defaultStyles = {};
export const setDefaultStyle = (layerType, styleDef) => {
    defaultStyles[layerType] = styleDef;
};
const getDefaultStyle = layerType => {
    return defaultStyles[layerType] || {};
};

const getFeatureStyle = (layer, extendedDef = {}) => {
    const style = layer.getCurrentStyle();
    const defaultDef = getDefaultStyle(layer.getLayerType());
    return merge(defaultDef, style.getFeatureStyle(), extendedDef);
};

export const useStyleFunction = layer => {
    const current = layer.getCurrentStyle();
    const styleType = geometryTypeToStyleType(layer.getGeometryType());
    const hasPropertyLabel = Oskari.util.keyExists(current.getFeatureStyle(), 'text.labelProperty');
    const hasOptionalStyles = current.getOptionalStyles().length > 0;
    const hasCluster = typeof layer.getClusteringDistance() !== 'undefined';
    return hasOptionalStyles || hasCluster || hasPropertyLabel ||
        !styleType || styleType === STYLE_TYPE.COLLECTION;
};

export const geometryTypeToStyleType = type => {
    let styleType;
    switch (type) {
    case 'LineString':
    case 'MultiLineString':
        styleType = STYLE_TYPE.LINE; break;
    case 'Polygon':
    case 'MultiPolygon':
        styleType = STYLE_TYPE.AREA; break;
    case 'Point':
    case 'MultiPoint':
        styleType = STYLE_TYPE.POINT; break;
    case 'GeometryCollection':
        styleType = STYLE_TYPE.COLLECTION; break;
    }
    return styleType;
};

/**
 * @method getStyleForLayer
 * @param mapmodule
 * @param layer Oskari layer
 * @param extendedDef Oskari style definition which overrides layer's featureStyle
 * @return {ol/style/StyleLike}
 **/
export const getOlStyleForLayer = (mapmodule, layer, extendedDef) => {
    const featureStyle = getFeatureStyle(layer, extendedDef);
    if (!useStyleFunction(layer)) {
        const styleType = geometryTypeToStyleType(layer.getGeometryType());
        return mapmodule.getStyle(featureStyle, styleType);
    }
    const typed = mapmodule.getGeomTypedStyles(featureStyle);
    const optional = layer.getCurrentStyle().getOptionalStyles().map(optionalDef => {
        return {
            filter: getOptionalStyleFilter(optionalDef),
            typed: mapmodule.getGeomTypedStyles(merge(featureStyle, optionalDef))
        };
    });
    return getStyleFunction({ typed, optional });
};

export const getStylesForGeometry = (geometry, styleTypes) => {
    if (!geometry || !styleTypes) {
        return;
    }
    let geometries = [];
    const geomType = geometry.getType ? geometry.getType() : geometry;
    const type = geometryTypeToStyleType(geomType);
    if (type === STYLE_TYPE.COLLECTION) {
        if (typeof geometry.getGeometries === 'function') {
            geometries = geometry.getGeometries() || [];
        }
        if (geometries.length > 0) {
            log.debug('Received GeometryCollection. Using first feature to determine feature style.');
            return getStylesForGeometry(geometries[0], styleTypes);
        } else {
            log.info('Received GeometryCollection without geometries. Feature style cannot be determined.');
        }
    };
    return styleTypes[type] || [];
};

// Style for cluster circles
const clusterStyleCache = {};
const clusterStyleFunc = feature => {
    const size = feature.get('features').length;
    const cacheKey = `${size}`;
    let style = clusterStyleCache[cacheKey];
    if (!style) {
        style = new olStyleStyle({
            image: new olStyleCircle({
                radius: size > 9 ? 14 : 12,
                stroke: new olStyleStroke({
                    color: '#fff'
                }),
                fill: new olStyleFill({
                    color: '#3399CC' // isSelected '#005d90'
                })
            }),
            text: new olStyleText({
                text: size.toString(),
                font: 'bold 14px sans-serif',
                fill: new olStyleFill({
                    color: '#fff'
                })
            })
        });
        clusterStyleCache[cacheKey] = style;
    }
    return style;
};

export const getStyleFunction = styles => {
    return (feature) => {
        const found = styles.optional.find(op => filterOptionalStyle(op.filter, feature));
        const typed = found ? found.typed : styles.typed;
        const olStyles = getStylesForGeometry(feature.getGeometry(), typed);
        // if typed is from optional styles and it doesn't have labelProperty, check if normal style has
        const { label } = typed || styles.typed;
        const textStyle = olStyles.length ? olStyles[0].getText() : undefined;
        if (textStyle) {
            _setFeatureLabel(feature, textStyle, label);
        }
        return olStyles;
    };
};
export const wrapClusterStyleFunction = styleFunction => {
    return (feature) => {
        // Cluster layer feature
        const feats = feature.get('features');
        if (feats) {
            if (feats.length > 1) {
                return clusterStyleFunc(feature);
            } else {
                // Only single point in cluster. Use it in styling.
                feature = feature.get('features')[0];
            }
        } else {
            // Vector layer feature, hide single points
            const geomType = feature.getGeometry().getType();
            if (geomType === 'Point' ||
                (geomType === 'MultiPoint' && feature.getGeometry().getPoints().length === 1)) {
                return null;
            }
        }
        return styleFunction(feature);
    };
};

const applyAlphaToColorable = (colorable, alpha) => {
    if (!colorable || !colorable.getColor()) {
        return;
    }
    if (Array.isArray(colorable.getColor())) {
        const color = [...colorable.getColor()];
        color[3] = alpha;
        colorable.setColor(color);
        return;
    }
    let colorLike = colorable.getColor();
    if (typeof colorLike !== 'string') {
        return;
    }
    if (colorLike.startsWith('rgba')) {
        colorLike = colorLike.substring(0, colorLike.lastIndexOf(','));
        colorLike += `,${alpha})`;
        colorable.setColor(colorLike);
        return;
    } else if (colorLike.startsWith('rgb')) {
        colorLike = colorLike.replace('rgb', 'rgba');
        colorLike = colorLike.substring(0, colorLike.lastIndexOf(')'));
        colorLike += `,${alpha})`;
        colorable.setColor(colorLike);
        return;
    }
    const rgb = Oskari.util.hexToRgb(colorLike);
    if (!rgb) {
        return;
    }
    const { r, g, b } = rgb;
    colorable.setColor(`rgba(${r},${g},${b},${alpha})`);
};

export const applyOpacity = (olStyle, opacity) => {
    if (!olStyle || isNaN(opacity)) {
        return;
    }
    const alpha = opacity < 1 ? opacity : opacity / 100.0;
    applyAlphaToColorable(olStyle.getFill(), alpha);
    applyAlphaToColorable(olStyle.getStroke(), alpha);
    if (olStyle.getImage()) {
        olStyle.getImage().setOpacity(alpha);
    }
    return olStyle;
};

const _setFeatureLabel = (feature, textStyle, label = {}) => {
    const { text, property } = label;
    if (!property) {
        return;
    }
    let value;
    if (Array.isArray(property)) {
        const keyForFirstValue = property.find(p => feature.get(p));
        value = feature.get(keyForFirstValue);
    } else {
        value = feature.get(property);
    }
    if (!value) {
        return;
    }
    const featureLabel = text ? text + ': ' + value : value;
    textStyle.setText(featureLabel);
};

/**
 * Creates style based on JSON
 * @param {AbstractMapModule} mapModule
 * @param styleDef Oskari style definition
 * @param geomType One of 'area', 'line', 'dot' | optional
 * @param requestedStyle layer's or feature's style definition (not overrided with defaults)
 * @return {Array} ol/style/Style. First item is main style and rest are optional/additional
 */
export const getOlStyles = (mapModule, styleDef, geomType, requestedStyle = {}) => {
    const olStyles = [];
    const style = jQuery.extend(true, {}, styleDef);
    const olStyle = {};
    olStyle.fill = getFillStyle(style);
    if (style.stroke) {
        if (geomType === 'line') {
            delete style.stroke.area;
        }
        const olStroke = getStrokeStyle(style);
        olStyles.push(...getWorkaroundForDash(olStroke));
        olStyle.stroke = olStroke;
    }
    if (style.image) {
        olStyle.image = getImageStyle(mapModule, style, requestedStyle);
    }
    if (style.text) {
        const textStyle = getTextStyle(style);
        if (textStyle) {
            olStyle.text = textStyle;
        }
    }
    const mainStyle = new olStyleStyle(olStyle);
    olStyles.unshift(mainStyle);
    return olStyles;
};

// draw transparent solid stroke to fire hover and click also on gaps with dashed stroke
// open layers renders only dashes so hover or click aren't fired on gaps
const getWorkaroundForDash = olStroke => {
    const lineDash = olStroke.getLineDash();
    if (!lineDash || !lineDash.length) {
        return [];
    }
    const transparent = olStroke.clone();
    applyAlphaToColorable(transparent, 0.01);
    transparent.setLineDash(null);
    const olStyle = new olStyleStyle({ stroke: transparent });
    return [olStyle];
};

/**
 * @method getFillStyle
 * @param styleDef Oskari style definition
 * @return {ol/style/Fill} fill style
 */
const getFillStyle = styleDef => {
    if (!styleDef.fill) {
        return;
    }
    let color = styleDef.fill.color;
    if (!color) {
        return new olStyleFill({ color: TRANSPARENT });
    }
    color = getColorEffect(styleDef.effect, color) || color;

    if (Oskari.util.keyExists(styleDef, 'fill.area.pattern')) {
        const pattern = getFillPattern(styleDef.fill.area.pattern, color);
        if (pattern) {
            return new olStyleFill({ color: pattern });
        }
    }

    return new olStyleFill({ color });
};

/**
 * @method getFillPattern
 * @param {Number} fillStyleCode Oskari style constant
 * @param {String} color color
 * @return {CanvasPattern} fill style
 */
const getFillPattern = (fillStyleCode, color) => {
    if ((!fillStyleCode && fillStyleCode !== 0) || !color) {
        return;
    }
    const canvasSize = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'square';
    ctx.strokeStyle = color;

    switch (fillStyleCode) {
    case FILL_STYLE.THIN_DIAGONAL : return getDiagonalPattern(ctx, canvas, 2);
    case FILL_STYLE.THICK_DIAGONAL : return getDiagonalPattern(ctx, canvas, 3);
    case FILL_STYLE.THIN_HORIZONTAL : return getHorizontalPattern(ctx, canvas, 2);
    case FILL_STYLE.THICK_HORIZONTAL : return getHorizontalPattern(ctx, canvas, 3);
    }
};

const getDiagonalPattern = (ctx, canvas, lineWidth) => {
    ctx.lineWidth = lineWidth;
    const numberOfStripes = lineWidth > 2 ? 12 : 18;
    const bandWidth = canvas.width / numberOfStripes;
    for (let i = 0; i < numberOfStripes * 2 + 2; i++) {
        if (i % 2 === 0) {
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(i * bandWidth + bandWidth / 2, 0);
        ctx.lineTo(i * bandWidth + bandWidth / 2 - canvas.width, canvas.width);
        ctx.stroke();
    }
    return ctx.createPattern(canvas, 'repeat');
};

const getHorizontalPattern = (ctx, canvas, lineWidth) => {
    ctx.lineWidth = lineWidth;
    const numberOfStripes = lineWidth > 2 ? 16 : 18;
    const bandWidth = canvas.width / numberOfStripes;
    for (let i = 0; i < numberOfStripes; i++) {
        if (i % 2 === 0) {
            continue;
        }
        ctx.beginPath();
        ctx.moveTo(0, i * bandWidth + bandWidth / 2);
        ctx.lineTo(canvas.width, i * bandWidth + bandWidth / 2);
        ctx.stroke();
    }
    return ctx.createPattern(canvas, 'repeat');
};

/**
 * Parses stroke style from json
 * @method getStrokeStyle
 * @param {Object} style json
 * @return {ol/style/Stroke}
 */
const getStrokeStyle = styleDef => {
    const stroke = {};
    const strokeDef = styleDef.stroke.area ? styleDef.stroke.area : styleDef.stroke;
    const effect = strokeDef.effect || styleDef.effect;
    let { width, color, lineDash, lineCap, lineJoin } = strokeDef;

    if (width === 0) {
        return null;
    }
    stroke.color = color ? getColorEffect(effect, color) || color : TRANSPARENT;
    if (width) {
        stroke.width = width;
    }
    if (lineDash) {
        if (Array.isArray(lineDash)) {
            stroke.lineDash = lineDash;
        } else {
            const getDash = (segment, gap) => [segment, gap + (width || 0)];
            switch (lineDash) {
            case LINE_DASH.DASH:
                stroke.lineDash = getDash(5, 4);
                break;
            case LINE_DASH.DOT:
                stroke.lineDash = getDash(1, 1);
                break;
            case LINE_DASH.DASHDOT:
                stroke.lineDash = getDash(5, 1).concat(getDash(1, 1));
                break;
            case LINE_DASH.LONGDASH:
                stroke.lineDash = getDash(10, 4);
                break;
            case LINE_DASH.LONGDASHDOT:
                stroke.lineDash = getDash(10, 1).concat(getDash(1, 1));
                break;
            case LINE_DASH.SOLID:
                stroke.lineDash = [];
                break;
            default: stroke.lineDash = [lineDash];
            }
        }
        stroke.lineDashOffset = 0;
    }
    if (lineCap) {
        stroke.lineCap = lineCap;
    }
    if (lineJoin) {
        if (lineJoin === LINE_JOIN.MITRE) {
            lineJoin = 'miter';
        }
        stroke.lineJoin = lineJoin;
    }
    return new olStyleStroke(stroke);
};

/**
 * Parses image style from json
 * @method getImageStyle
 * @param {Object} style json
 * @param {Object} requestedStyle layer's or feature's style definition (not overrided with defaults)
 * @return {ol/style/Circle}
 */
const getImageStyle = (mapModule, styleDef, requestedStyle) => {
    const image = {};
    let size = mapModule.getDefaultMarkerSize();

    if (styleDef.image && styleDef.image.sizePx) {
        size = styleDef.image.sizePx;
    } else if (styleDef.image && styleDef.image.size) {
        size = mapModule.getPixelForSize(styleDef.image.size);
    }

    if (typeof size !== 'number') {
        size = mapModule.getDefaultMarkerSize();
    }

    styleDef.image.size = size;

    let fillColor = styleDef.image.fill ? styleDef.image.fill.color : undefined;
    fillColor = getColorEffect(styleDef.effect, fillColor) || fillColor;

    const opacity = styleDef.image.opacity || 1;

    if (mapModule.isSvg(styleDef.image)) {
        styleDef.image.color = fillColor;
        return new olStyleIcon({
            src: mapModule.getSvg(styleDef.image),
            size: [size, size],
            imgSize: [size, size],
            opacity
        });
    } else if (styleDef.image && styleDef.image.shape) {
        const offsetX = (!isNaN(styleDef.image.offsetX)) ? styleDef.image.offsetX : 16;
        const offsetY = (!isNaN(styleDef.image.offsetY)) ? styleDef.image.offsetY : 16;
        const iconOpts = {
            src: styleDef.image.shape,
            anchorYUnits: 'pixels',
            anchorXUnits: 'pixels',
            anchorOrigin: 'bottom-left',
            anchor: [offsetX, offsetY],
            opacity
        };
        if (Oskari.util.keyExists(requestedStyle, 'image.fill.color')) {
            iconOpts.color = fillColor;
        }
        return new olStyleIcon(iconOpts);
    }

    if (styleDef.image.radius) {
        image.radius = styleDef.image.radius;
    } else {
        image.radius = 1;
    }
    if (styleDef.snapToPixel) {
        image.snapToPixel = styleDef.snapToPixel;
    }
    if (fillColor) {
        if (opacity !== 1) {
            let rgb = null;
            if (fillColor.charAt(0) === '#') {
                // check if color is hex
                rgb = Oskari.util.hexToRgb(fillColor);
                fillColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')';
            } else if (fillColor.indexOf('rgb(') > -1) {
                // else check at if color is rgb
                const hexColor = '#' + Oskari.util.rgbToHex(fillColor);
                rgb = Oskari.util.hexToRgb(hexColor);
                fillColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')';
            }
        }
        image.fill = new olStyleFill({
            color: fillColor
        });
    }
    if (styleDef.stroke) {
        image.stroke = getStrokeStyle(styleDef);
    }
    return new olStyleCircle(image);
};

/**
 * Parses JSON and returns matching ol/style/Text
 * @param  {Object} textStyleJSON text style definition
 * @return {ol/style/Text} parsed style or undefined if no param is given
 */
const getTextStyle = styleDef => {
    if (!styleDef || !styleDef.text) {
        return;
    }
    const text = {};
    const { scale, offsetX, offsetY, rotation, textAlign, textBaseline, font, fill, stroke, labelText, overflow } = styleDef.text;
    if (scale) {
        text.scale = scale;
    }
    if (offsetX) {
        text.offsetX = offsetX;
    }
    if (offsetY) {
        text.offsetY = offsetY;
    }
    if (rotation) {
        text.rotation = rotation;
    }
    if (textAlign) {
        text.textAlign = textAlign;
    }
    if (textBaseline) {
        text.textBaseline = textBaseline;
    }
    if (font) {
        text.font = font;
    }
    if (overflow) {
        text.overflow = !!overflow;
    }
    if (fill && fill.color) {
        text.fill = new olStyleFill({
            color: getColorEffect(styleDef.effect, fill.color) || fill.color
        });
    }
    if (stroke) {
        text.stroke = getStrokeStyle(styleDef.text);
    }
    if (labelText) {
        if (typeof labelText === 'number') {
            text.text = labelText.toString();
        } else {
            text.text = labelText;
        }
    }
    return new olStyleText(text);
};

/**
 * @method getColorEffect
 * @param {String} effect Oskari style constant
 * @param {String} color Color to apply the effect on
 * @return {String} Affected color or undefined if effect or color is missing
 */
const getColorEffect = (effect, color) => {
    if (!effect || !color || effect === EFFECT.NONE) {
        return;
    }
    const minor = 60;
    const normal = 90;
    const major = 120;
    const getEffect = (delta, auto) => Oskari.util.alterBrightness(color, delta, auto);
    switch (effect) {
    case EFFECT.AUTO : return getEffect(normal, true);
    case EFFECT.AUTO_MINOR : return getEffect(minor, true);
    case EFFECT.AUTO_NORMAL : return getEffect(normal, true);
    case EFFECT.AUTO_MAJOR : return getEffect(major, true);
    case EFFECT.DARKEN : return getEffect(-normal);
    case EFFECT.DARKEN_MINOR : return getEffect(-minor);
    case EFFECT.DARKEN_NORMAL : return getEffect(-normal);
    case EFFECT.DARKEN_MAJOR : return getEffect(-major);
    case EFFECT.LIGHTEN : return getEffect(normal);
    case EFFECT.LIGHTEN_MINOR : return getEffect(minor);
    case EFFECT.LIGHTEN_NORMAL : return getEffect(normal);
    case EFFECT.LIGHTEN_MAJOR : return getEffect(major);
    }
};
