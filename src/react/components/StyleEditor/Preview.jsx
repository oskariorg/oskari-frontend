import React from 'react';
import PropTypes from 'prop-types';

// Size for preview svg
const previewSize = '80px';

// Viewbox settings for preview svg
const previewViewbox = {
    minX: 0,
    minY: 0,
    width: 60,
    height: 60
}

// Style settings for wrapping preview rectangle
const previewWrapperStyle = {
    border: '1px solid #d9d9d9',
    height: previewSize,
    width: previewSize
}

const linePreviewSVG = '<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000000" d="M10,15L20,35L40,25" stroke-width="3" stroke-linejoin="miter" stroke-linecap="butt" strokeDasharray="0"></path></svg>';
const areaPreviewSVG = '<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect fill="#eee" x="0" width="10" height="10" y="0"><rect fill="#eee" x="10" width="10" height="10" y="10"></rect></rect></pattern></defs><rect x="0" y="0" width="80" height="80" fill="url(#checker)"></rect><path d="M10,17L40,12L29,40Z" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>';

const defaultPatternId = 'patternPreview'; // Static pattern id filled into svg - with this we identify pattern made solely for preview from other dom-elements

// Default values for every style settings value
const defaults = {
    fill: {
        color: '#b5b5b5',
        area: {
            pattern: -1
        }
    },
    stroke: {
        color: '#000000',
        width: 1,
        lineDash: 'solid',
        lineCap: 'round',
        area: {
            color: '#000000',
            width: 3,
            lineDash: 'dot',
            lineJoin: 'miter'
        }
    },
    image: {
        shape: 5,
        size: 3,
        sizePx: 20,
        offsetX: 0,
        offsetY: 0,
        opacity: 0.7,
        radius: 2,
        fill: {
            color: '#ff00ff'
        }
    }
};

/**
 * @class Preview
 * @calssdesc <Preview>
 * @memberof module:oskari-ui
 * @see {@link module:oskari-ui/util.LocaleProvider|LocaleProvider}
 * @param {Object} props - { }
 * @param {Component|Callback} previewIcon - callback for creating icon
 * @description Wrap provided svg-icon into base svg of preview
 * 
 * @example <caption>Basic usage</caption>
 * <Preview }/>
 */

export const Preview = (props) => {
    const markers = props.markers;
    const format = props.format;
    let size = 3;

    let previewAttributes = {
        strokeColor: defaults.stroke.color,
        strokeWidth: defaults.stroke.width,
        strokeLineCap: defaults.stroke.lineCap,
        fill: defaults.defaultFill, // empty string here?
        fillColor: defaults.fill.color,
        pattern: defaults.fill.area.pattern
    };
    
    const _fillSvgWithStyle = () => {
        const path = _parsePath(format);        

        previewAttributes.strokeColor = format === 'area' ? props.oskariStyle.stroke.area.color : props.oskariStyle.stroke.color;
        previewAttributes.fillColor = props.oskariStyle.fill.color;

        previewAttributes.fill = format === 'area'
            ? ('url(#' + defaultPatternId + ')') : format !== 'line' 
            ? props.oskariStyle.image.fill.color : defaults.fill.color;

        if (format === 'area' && ~props.oskariStyle.fill.area.pattern) {
            const patternPath = _parsePattern(props.areaFills.find(pattern => pattern.name === props.oskariStyle.fill.area.pattern));
            previewAttributes.pattern = _composeSvgPattern(patternPath);
        }

        previewAttributes.strokeWidth = format === 'point'
            ? defaults.defaultStrokeWidth : format === 'area'
            ? props.oskariStyle.stroke.area.width : props.oskariStyle.stroke.width;
        
        previewAttributes.strokeLineCap = format === 'line' ? props.oskariStyle.stroke.lineCap : defaults.stroke.lineCap;

        previewAttributes.strokeDashArray = _getPreviewLineDash(format, props.oskariStyle);

        previewAttributes.strokeLineJoin = format === 'line' ? props.oskariStyle.stroke.area.lineJoin : defaults.stroke.area.lineJoin;

        path.setAttribute('stroke', previewAttributes.strokeColor);
        path.setAttribute('stroke-width', previewAttributes.strokeWidth);
        path.setAttribute('stroke-linecap', previewAttributes.strokeLineCap);
        path.setAttribute('stroke-dasharray', previewAttributes.strokeDashArray);
        path.setAttribute('stroke-linejoin', previewAttributes.strokeLineJoin);
        if (format !== 'line') {
            path.setAttribute('fill', previewAttributes.fill);
        }
        
        size = format === 'point' ? props.oskariStyle.image.size : defaults.image.size;

        return path.outerHTML;
    }

    /**
     * @method _getPreviewLineDash
     * @param {String} format - format of the current preview
     * @param {Object} oskariStyle - current Oskari style
     * @description Parses current Oskari style on outputs correct linedash value for preview
     * @returns {String} value of the preview linedash or empty string for point tab
     */
    const _getPreviewLineDash = (format, oskariStyle) => {
        if (format === 'line' && oskariStyle.stroke.lineDash === 'dash') {
            return '4, 4';
        } else if (format === 'area' && oskariStyle.stroke.area.lineDash === 'dash') {
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
    const _parsePath = (format) => {
        let baseSvg =
              format === 'point' ? props.markers[props.oskariStyle.image.shape].data
            : format === 'line' ? baseSvg = linePreviewSVG
            : format === 'area' ? baseSvg = areaPreviewSVG
            : false;
        
        const domParser = new DOMParser();
        const parsed = domParser.parseFromString(baseSvg, 'image/svg+xml');
        const rawHtmlPath = parsed.getElementsByTagName('path')[0];

        return rawHtmlPath;
    }

    /**
     * @method _parsePattern
     * @param {String} format - current pattern to be parsed as DOM SVG element
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
    const _composeSvgPattern = (patternPath) => {
        return '<defs><pattern id="' + defaultPatternId +'" viewBox="0, 0, 4, 4" width="50%" height="50%">' + patternPath.outerHTML + '</pattern></defs>';
    }

    const _composePreviewViewbox = () => {
        let viewboxString = ''
        const widthV = previewViewbox.width - (5 * size); // multiply by negative to shrink viewbox
        const heightV = previewViewbox.height - (5 * size); // multiply by negative to shrink viewbox
        viewboxString = previewViewbox.minX + ' ' + previewViewbox.minY + ' ' +  widthV + ' ' + heightV;
        return viewboxString;
    }

    /**
     * @method _addBaseSvg
     *
     * @returns {Component} - combined svg icon with preview base wrapping around provided icon
     *
     */
    const _addBaseSvg = () => {
        const combinedSvg = previewAttributes.pattern + _fillSvgWithStyle(); // Combine pattern and svg icon

        return (
            <svg
                viewBox={ _composePreviewViewbox() }
                width={ previewSize }
                height={ previewSize }
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={ {__html: combinedSvg } }
            >
            </svg>
        );
    }

    return (
        <div style={ previewWrapperStyle }>
            { _addBaseSvg(props.previewIcon) }
        </div>
    );
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    markers: PropTypes.array,
    areaFills: PropTypes.array
};
