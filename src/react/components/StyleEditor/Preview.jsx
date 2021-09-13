import React from 'react';
import PropTypes from 'prop-types';
import { OSKARI_BLANK_STYLE } from './OskariDefaultStyle';

// Size for preview svg
const previewSize = '80px';

// Viewbox settings for preview svg
const previewViewbox = {
    minX: 0,
    minY: 0,
    width: 60,
    height: 60
};

// Style settings for wrapping preview rectangle
const previewWrapperStyle = {
    border: '1px solid #d9d9d9',
    height: previewSize,
    width: previewSize
};

const linePreviewSVG = '<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000000" d="M10,15L20,35L40,25" stroke-width="3" stroke-linejoin="miter" stroke-linecap="butt" strokeDasharray="0"></path></svg>';
const areaPreviewSVG = '<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect fill="#eee" x="0" width="10" height="10" y="0"><rect fill="#eee" x="10" width="10" height="10" y="10"></rect></rect></pattern></defs><rect x="0" y="0" width="80" height="80" fill="url(#checker)"></rect><path d="M10,17L40,12L29,40Z" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>';
const defaultPatternId = 'patternPreview'; // Static pattern id filled into svg - with this we identify pattern made solely for preview from other dom-elements

let previewAttributes = {
    strokeColor: OSKARI_BLANK_STYLE.stroke.color,
    strokeWidth: OSKARI_BLANK_STYLE.stroke.width,
    strokeLineCap: OSKARI_BLANK_STYLE.stroke.lineCap,
    fill: OSKARI_BLANK_STYLE.defaultFill, // empty string here?
    fillColor: OSKARI_BLANK_STYLE.fill.color,
    pattern: '' //OSKARI_BLANK_STYLE.fill.area.pattern <- this will be part of an SVG IF we are doing an area style with fill pattern
};

let size = 3; // Size of the preview depending on the format - default 3 is for area

/**
 * @method _getPreviewLineDash
 * @param {String} format - format of the current preview
 * @param {Object} oskariStyle - current Oskari style
 * @description Parses current Oskari style on outputs correct linedash value for preview
 * @returns {String} value of the preview linedash or empty string for point tab
 */
const _getPreviewLineDash = (format, oskariStyle) => {
    if ((format === 'line' && oskariStyle.stroke.lineDash === 'dash') ||
        (format === 'area' && oskariStyle.stroke.area.lineDash === 'dash')) {
        return '4, 4';
    }
    return '';
}

/**
 * @method _parsePath
 * @param {String} format - format of the current icon as string (point | line | area)
 * @description Parses correct svg based on provided format
 *
 * @returns rawHtmlPath - DOM object of parsed SVG
 */
const _parsePath = (baseSvg) => {
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(baseSvg, 'image/svg+xml');
    const rawHtmlPath = parsed.getElementsByTagName('path')[0];

    return rawHtmlPath;
}

/**
 * @method _parsePattern
 * @param {String} pattern - current pattern to be parsed as DOM SVG element
 * @description Parses provided pattern and fills it with correct attributes
 *
 * @returns rawHtmlPath - DOM object of current SVG
 */
const _parsePattern = (pattern) => {
    const domParser = new DOMParser();
    const parsed = domParser.parseFromString(pattern.data, 'image/svg+xml');
    const rawHtmlPath = parsed.getElementsByTagName('path')[0];
    rawHtmlPath.setAttribute('stroke', previewAttributes.fillColor);

    return rawHtmlPath;
}

/**
 * @method _composeSvgPattern
 * @param {HTMLElement} patternPath pattern as DOM node element
 * @description Combine provided plain pattern path with definitive svg base
 * @returns {String} full pattern as string
 */
const _composeSvgPattern = (patternPath, patternId) => {
    return '<defs><pattern id="' + patternId +'" viewBox="0, 0, 12, 12" width="100%" height="100%">' + patternPath.outerHTML + '</pattern></defs>';
}

const _composePreviewViewbox = () => {
    let viewboxString = ''
    const widthV = previewViewbox.width - (5 * size); // multiply by negative to shrink viewbox
    const heightV = previewViewbox.height - (5 * size); // multiply by negative to shrink viewbox
    viewboxString = previewViewbox.minX + ' ' + previewViewbox.minY + ' ' +  widthV + ' ' + heightV;
    return viewboxString;
}

/**
 * @method _composePointPath
 * @description Composes point svg path
 * @returns {String} point svg path
 */
const _composePointPath = (oskariStyle, markers) => {
    const path = _parsePath(markers[oskariStyle.image.shape].data);

    previewAttributes.strokeColor = '#000000';
    previewAttributes.fillColor = oskariStyle.fill.color;
    previewAttributes.fill = oskariStyle.image.fill.color;
    previewAttributes.strokeWidth = OSKARI_BLANK_STYLE.defaultStrokeWidth;
    previewAttributes.strokeLineCap = OSKARI_BLANK_STYLE.stroke.lineCap;
    previewAttributes.strokeDashArray = '';
    previewAttributes.strokeLineJoin = OSKARI_BLANK_STYLE.stroke.area.lineJoin;

    path.setAttribute('stroke', previewAttributes.strokeColor);
    path.setAttribute('stroke-width', previewAttributes.strokeWidth);
    path.setAttribute('stroke-linecap', previewAttributes.strokeLineCap);
    path.setAttribute('stroke-dasharray', previewAttributes.strokeDashArray);
    path.setAttribute('stroke-linejoin', previewAttributes.strokeLineJoin);
    path.setAttribute('fill', previewAttributes.fill);
    
    size = oskariStyle.image.size;

    return path.outerHTML;
}

/**
 * @method _composeLinePath
 * @description Composes line svg path
 * @returns {String} line svg path
 */
const _composeLinePath = (oskariStyle) => {
    const path = _parsePath(linePreviewSVG);        

    previewAttributes.strokeColor = oskariStyle.stroke.color;
    previewAttributes.fillColor = oskariStyle.fill.color;
    previewAttributes.fill = OSKARI_BLANK_STYLE.fill.color;

    previewAttributes.strokeWidth = oskariStyle.stroke.width;
    previewAttributes.strokeLineCap = oskariStyle.stroke.lineCap;
    previewAttributes.strokeDashArray = _getPreviewLineDash('line', oskariStyle);
    previewAttributes.strokeLineJoin = oskariStyle.stroke.area.lineJoin;

    path.setAttribute('stroke', previewAttributes.strokeColor);
    path.setAttribute('stroke-width', previewAttributes.strokeWidth);
    path.setAttribute('stroke-linecap', previewAttributes.strokeLineCap);
    path.setAttribute('stroke-dasharray', previewAttributes.strokeDashArray);
    path.setAttribute('stroke-linejoin', previewAttributes.strokeLineJoin);

    size = OSKARI_BLANK_STYLE.image.size;

    return path.outerHTML;
}

/**
 * @method _composeAreaPath
 * @description Composes area svg path
 * @returns {String} area svg path
 */
let patternIdCounter = 0;
const _composeAreaPath = (oskariStyle, areaFills) => {
    const path = _parsePath(areaPreviewSVG);
    const patternId = defaultPatternId + patternIdCounter++;

    previewAttributes.strokeColor = oskariStyle.stroke.area.color;
    previewAttributes.fillColor = oskariStyle.fill.color;
    previewAttributes.fill = 'url(#' + patternId + ')';

    let patternName = 'SOLID';
    if (oskariStyle.fill.area.pattern === 0) {
        patternName = 'DIAGONAL_THIN';
    } else if (oskariStyle.fill.area.pattern === 1) {
        patternName = 'DIAGONAL_THICK';
    } else if (oskariStyle.fill.area.pattern === 2) {
        patternName = 'HORIZONTAL_THIN';
    } else if (oskariStyle.fill.area.pattern === 3) {
        patternName = 'HORIZONTAL_THICK';
    } else if (oskariStyle.fill.area.pattern === 4) {
        patternName = 'TRANSPARENT';
    } else if (oskariStyle.fill.area.pattern === 5) {
        patternName = 'SOLID';
    }

    const patternPath = _parsePattern(areaFills.find(pattern => pattern.name === patternName));
    previewAttributes.pattern = _composeSvgPattern(patternPath, patternId); // this has to be set after fillColor

    previewAttributes.strokeWidth = oskariStyle.stroke.area.width;
    previewAttributes.strokeLineCap = OSKARI_BLANK_STYLE.stroke.lineCap;
    previewAttributes.strokeDashArray = _getPreviewLineDash('area', oskariStyle);
    previewAttributes.strokeLineJoin = OSKARI_BLANK_STYLE.stroke.area.lineJoin;

    path.setAttribute('stroke', previewAttributes.strokeColor);
    path.setAttribute('stroke-width', previewAttributes.strokeWidth);
    path.setAttribute('stroke-linecap', previewAttributes.strokeLineCap);
    path.setAttribute('stroke-dasharray', previewAttributes.strokeDashArray);
    path.setAttribute('stroke-linejoin', previewAttributes.strokeLineJoin);
    path.setAttribute('fill', previewAttributes.fill);

    size = OSKARI_BLANK_STYLE.image.size;

    return path.outerHTML;
}

const getTestParamsObject = (format, style) => {

    const additionalAttrs = {
        format,
        size
    };
    if (format === 'point') {
        additionalAttrs.size = style.image.size;
        additionalAttrs.color = style.image.fill.color;
        additionalAttrs.shape = style.image.shape;
    } else if (format === 'line') {
        additionalAttrs.color = style.stroke.color;
        additionalAttrs.size = style.stroke.width;
        additionalAttrs.linecap = style.stroke.lineCap;
        additionalAttrs.linedash = style.stroke.lineDash;
        additionalAttrs.linejoin = style.stroke.area.lineJoin;
    } else if (format === 'area') {
        additionalAttrs.color = style.fill.color;
        additionalAttrs.strokecolor = style.stroke.area.color;
        additionalAttrs.size = style.stroke.area.width;
        additionalAttrs.strokestyle = style.stroke.area.lineDash;
        additionalAttrs.pattern = style.fill.area.pattern;
    }
    const testAttrs = {};
    Object.keys(additionalAttrs).forEach(key => {
        testAttrs['data-' + key] = additionalAttrs[key];
    });
    return testAttrs;
}
/**
 * @class Preview
 * @calssdesc <Preview>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 * @description Wrap provided svg-icon into base svg of preview
 * 
 * @example <caption>Basic usage</caption>
 * <Preview }/>
 */

export const Preview = ({markers, areaFills, format, oskariStyle}) => {
    const svgIcon =
        format === 'area' ? _composeAreaPath(oskariStyle, areaFills) :
        format === 'line' ? _composeLinePath(oskariStyle) :
        format === 'point' ? _composePointPath(oskariStyle, markers) :
        false;
    const combinedSvg = previewAttributes.pattern + svgIcon; // Add pattern to svg icon
    return (
        <div style={ previewWrapperStyle } className="t_preview" { ...getTestParamsObject(format, oskariStyle) } >
            <svg
                viewBox={ _composePreviewViewbox() }
                width={ previewSize }
                height={ previewSize }
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={ {__html: combinedSvg } }
            >
            </svg>
        </div>
    );
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    markers: PropTypes.array,
    areaFills: PropTypes.array
};
