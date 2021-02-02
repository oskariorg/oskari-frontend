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

export class Preview extends React.Component {
    constructor (props) {
        super(props);

        this.markers = this.props.markers;
        this.size = 3;

        this.previewAttributes = {
            strokeColor: defaults.stroke.color,
            strokeWidth: defaults.stroke.width,
            strokeLineCap: defaults.stroke.lineCap,
            fill: defaults.defaultFill, // tyhjä stringi tähän?
            fillColor: defaults.fill.color,
            pattern: defaults.fill.area.pattern
        };
    }
    
    _fillSvgWithStyle () {
        const format = this.props.format;
        const path = this._parsePath(format);        

        this.previewAttributes.strokeColor = this.props.oskariStyle.stroke.color;
        this.previewAttributes.fillColor = this.props.oskariStyle.fill.color;

        this.previewAttributes.fill = format === 'area'
            ? ('url(#' + defaultPatternId + ')') : format !== 'line' 
            ? this.props.oskariStyle.fill.color : defaults.fill.color;

        if (format === 'area' && ~this.props.oskariStyle.fill.area.pattern) {
            const patternPath = this._parsePattern(this.props.areaFills.find(pattern => pattern.name === this.props.oskariStyle.fill.area.pattern));
            this.previewAttributes.pattern = this._composeSvgPattern(patternPath);
        }

        this.previewAttributes.strokeWidth = format === 'point'
            ? defaults.defaultStrokeWidth : format === 'area'
            ? this.props.oskariStyle.stroke.area.width : this.props.oskariStyle.stroke.width;
        
        this.previewAttributes.strokeLineCap = format === 'line' ? this.props.oskariStyle.stroke.lineCap : defaults.stroke.lineCap;

        this.previewAttributes.strokeDashArray = this._getPreviewLineDash(format, this.props.oskariStyle);
        this.previewAttributes.strokeDashArray = format === 'line' && this.props.oskariStyle.stroke.lineDash === 'dash' ? '4, 4' // line tab
            : format === 'area' && this.props.oskariStyle.stroke.area.lineDash === 'dash' ? '4, 4' // area tab
            : ''; // point tab

        this.previewAttributes.strokeLineJoin = format === 'line' ? this.props.oskariStyle.stroke.area.lineJoin : defaults.stroke.area.lineJoin;

        path.setAttribute('stroke', this.previewAttributes.strokeColor);
        path.setAttribute('stroke-width', this.previewAttributes.strokeWidth);
        path.setAttribute('stroke-linecap', this.previewAttributes.strokeLineCap);
        path.setAttribute('stroke-dasharray', this.previewAttributes.strokeDashArray);
        path.setAttribute('stroke-linejoin', this.previewAttributes.strokeLineJoin);
        if (format !== 'line') {
            path.setAttribute('fill', this.previewAttributes.fill);
        }
        
        this.size = format === 'point' ? this.props.oskariStyle.image.size : defaults.image.size;

        return path.outerHTML;
    }

    /**
     * @method _getPreviewLineDash
     * @param {String} format - format of the current preview
     * @param {Object} oskariStyle - current Oskari style
     * @description Parses current Oskari style on outputs correct linedash value for preview
     * @returns {String}
     */
    _getPreviewLineDash (format, oskariStyle) {
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
    _parsePath (format) {
        let baseSvg =
              format === 'point' ? this.props.markers[this.props.oskariStyle.image.shape].data
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
    _parsePattern (pattern) {
        const domParser = new DOMParser();
        const parsed = domParser.parseFromString(pattern.data, 'image/svg+xml');
        const rawHtmlPath = parsed.getElementsByTagName('path')[0];

        rawHtmlPath.setAttribute('stroke', this.previewAttributes.fillColor);

        return rawHtmlPath;
    }

    /**
     * @method _composeSvgPattern
     * @param {HTMLElement} patternPath pattern as DOM node element
     * @description Combine provided plain pattern path with definitive svg base
     * @returns {String} full pattern as string
     */
    _composeSvgPattern (patternPath) {
        return '<defs><pattern id="' + defaultPatternId +'" viewBox="0, 0, 4, 4" width="50%" height="50%">' + patternPath.outerHTML + '</pattern></defs>';
    }

    _composePreviewViewbox () {
        let viewboxString = ''
        const widthV = previewViewbox.width - (5 * this.size); // multiply by negative to shrink viewbox
        const heightV = previewViewbox.height - (5 * this.size); // multiply by negative to shrink viewbox
        viewboxString = previewViewbox.minX + ' ' + previewViewbox.minY + ' ' +  widthV + ' ' + heightV;
        return viewboxString;
    }

    /**
     * @method _addBaseSvg
     *
     * @returns {Component} - combined svg icon with preview base wrapping around provided icon
     *
     */
    _addBaseSvg () {
        const svgIcon = this._fillSvgWithStyle(); // Get svg icon
        const combinedSvg = this.previewAttributes.pattern + svgIcon; // Add pattern to svg icon

        return (
            <svg
                viewBox={ this._composePreviewViewbox() }
                width={ previewSize }
                height={ previewSize }
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={ {__html: combinedSvg } }
            >
            </svg>
        );
    }

    render () {
        return (
            <div style={ previewWrapperStyle }>
                { this._addBaseSvg(this.props.previewIcon) }
            </div>
        );
    }
};

Preview.propTypes = {
    oskariStyle: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    markers: PropTypes.array,
    areaFills: PropTypes.array
};
