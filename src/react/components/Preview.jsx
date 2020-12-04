import React from 'react';
import PropTypes from 'prop-types';

// Size for preview svg
const previewSize = '80px';

// Viewbox settings for preview svg
//const previewViewbox = '0 0 60 60';
const previewViewbox = {
    minX: 0,
    minY: 0,
    width: 60,
    height: 60
}

// Style settings for wrapping preview rectangle
const previewStyling = {
    border: '1px solid #d9d9d9',
    height: previewSize,
    width: previewSize
}

const linePreviewSVG = '<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#000000" d="M10,15L20,35L40,25" stroke-width="3" stroke-linejoin="miter" stroke-linecap="butt" strokeDasharray="0"></path></svg>';
const areaPreviewSVG = '<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><rect fill="#eee" x="0" width="10" height="10" y="0"><rect fill="#eee" x="10" width="10" height="10" y="10"></rect></rect></pattern></defs><rect x="0" y="0" width="80" height="80" fill="url(#checker)"></rect><path d="M10,17L40,12L29,40Z" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path></svg>';

const defaults = {
    defaultStrokeWidth: 1,
    defaultFillColor: '#ffffff',
    defaultSize: 3,
    defaultLineCap: 'square',
    defaultLineJoin: 'mitter',
    defaultFillPattern: -1
}

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
 * <Preview previewIcon={ svgIconCallback }}/>
 */

export class Preview extends React.Component {
    constructor (props) {
        super(props);

        console.log(this.props);
        this.currentStyle = this.props.styleSettings;
        this.markers = this.props.markers;
        this.size = 3;
    }

    _fillSvgWithStyle () {
        const format = this.props.styleSettings.format;
        const strokeColor = this.props.styleSettings.stroke.color;
        
        const strokeWidth = format !== 'point' ? this.props.styleSettings.stroke.width : defaults.defaultStrokeWidth;
        const strokeLineCap = format === 'line' ? this.props.styleSettings.stroke.lineCap : defaults.defaultLineCap;
        
        const fill = format === 'area' ? ('url(#' + this.props.styleSettings.fill.area.pattern + ')')
            : format !== 'line' ? this.props.styleSettings.fill.color : defaults.defaultFillColor;

        const size = format === 'point' ? this.props.styleSettings.image.size : defaults.defaultSize;

        const path = this._parsePath(format);

        path.setAttribute('stroke', strokeColor);
        path.setAttribute('stroke-width', strokeWidth);
        path.setAttribute('stroke-linecap', strokeLineCap);
        path.setAttribute('fill', fill);

        this.size = size;

        return path.outerHTML;
    }

    _parsePath (format) {
        let baseSvg = '';

        if (format === 'point') {
            baseSvg = this.props.markers[this.props.styleSettings.image.shape].data;
        } else if (format === 'line') {
            baseSvg = linePreviewSVG;
        } else if (format === 'area') {
            baseSvg = areaPreviewSVG;
        }
        
        const domParser = new DOMParser();
        const parsed = domParser.parseFromString(baseSvg, 'image/svg+xml');
        const rawHtmlPath = parsed.getElementsByTagName('path')[0];

        return rawHtmlPath;
    }

    /**
     * @method _addBaseSvg
     *
     * @returns {Component} - combined svg icon with preview base wrapping around provided icon
     *
     */
    _addBaseSvg () {
        const svgIcon = this._fillSvgWithStyle();
        const widthV = previewViewbox.width - (5 * this.size); // multiply by negative to shrink viewbox
        const heightV = previewViewbox.height - (5 * this.size); // multiply by negative to shrink viewbox

        return (
            <svg
                viewBox={
                    previewViewbox.minX + ' ' + previewViewbox.minY + ' ' +  widthV + ' ' + heightV
                }
                width={ previewSize }
                height={ previewSize }
                xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={ {__html: svgIcon } }
            >
            </svg>
        );
    }

    render () {
        return (
            <div style={ previewStyling }>
                { this._addBaseSvg(this.props.previewIcon) }
            </div>
        );
    }
};

Preview.propTypes = {
    markers: PropTypes.array.isRequired,
    styleSettings: PropTypes.object.isRequired
};
