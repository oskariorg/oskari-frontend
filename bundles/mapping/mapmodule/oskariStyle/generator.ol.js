
import olStyleStyle from 'ol/style/Style';
import olStyleFill from 'ol/style/Fill';
import olStyleStroke from 'ol/style/Stroke';
import olStyleCircle from 'ol/style/Circle';
import olStyleIcon from 'ol/style/Icon';
import olStyleText from 'ol/style/Text';

import { LINE_DASH, LINE_JOIN, EFFECT, FILL_STYLE } from './constants';

const TRANSPARENT = 'rgba(0,0,0,0)';

/**
 * Creates style based on JSON
 * @param {AbstractMapModule} mapModule
 * @param styleDef Oskari style definition
 * @param geomType One of 'area', 'line', 'dot' | optional
 * @return {ol/style/Style} style ol3 specific!
 */
export const getOlStyle = (mapModule, styleDef, geomType) => {
    const style = jQuery.extend(true, {}, styleDef);

    const olStyle = {};
    olStyle.fill = getFillStyle(style);
    if (style.stroke) {
        if (geomType === 'line') {
            delete style.stroke.area;
        }
        olStyle.stroke = getStrokeStyle(style);
    }
    if (style.image) {
        olStyle.image = getImageStyle(mapModule, style);
    }
    if (style.text) {
        const textStyle = getTextStyle(style);
        if (textStyle) {
            olStyle.text = textStyle;
        }
    }
    return new olStyleStyle(olStyle);
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
    const { effect } = styleDef;
    const strokeDef = styleDef.stroke.area ? styleDef.stroke.area : styleDef.stroke;
    let { width, color, lineDash, lineCap, lineJoin } = strokeDef;

    if (width === 0) {
        return null;
    }
    if (color) {
        stroke.color = getColorEffect(effect, color) || color;
    }
    else {
        stroke.color = TRANSPARENT;
    }
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
 * @return {ol/style/Circle}
 */
const getImageStyle = (mapModule, styleDef) => {
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
        return new olStyleIcon({
            src: styleDef.image.shape,
            anchorYUnits: 'pixels',
            anchorXUnits: 'pixels',
            anchorOrigin: 'bottom-left',
            anchor: [offsetX, offsetY],
            color: fillColor,
            opacity
        });
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
    const { scale, offsetX, offsetY, rotation, textAlign, textBaseline, font, fill, stroke, labelText } = styleDef.text;
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
    if (!effect || !color) {
        return;
    }
    const minor = 30;
    const normal = 60;
    const major = 90;
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
