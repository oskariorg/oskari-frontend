import React from 'react';
import PropTypes from 'prop-types';

// Size for preview
const previewSize = '80px';

// Viewbox settings for preview
const previewViewbox = '0 0 32 32';

// Style settings for wrapping preview rectangle
const previewStyling = {
    border: '1px solid #d9d9d9',
    height: previewSize,
    width: previewSize
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

        this.currentStyle = this.props.styleSettings;
        this.markers = this.props.markers;

        if (typeof this.props.styleSettings.image !== 'undefined') {
            this.currentMarker = this.markers[this.props.styleSettings.image.shape];
        }
    }

    _fillSvgWithStyle () {
        const domParser = new DOMParser();
        const parsed = domParser.parseFromString(this.currentMarker.data, 'image/svg+xml');
        const rawHtmlPath = parsed.getElementsByTagName('path')[0];

        rawHtmlPath.setAttribute('fill', this.props.styleSettings.fill.color);
        rawHtmlPath.setAttribute('stroke', this.props.styleSettings.stroke.color);

        return rawHtmlPath.outerHTML;
    }

    /**
     * @method _addBaseSvg
     *
     * @returns {Component} - combined svg icon with preview base wrapping around provided icon
     *
     */
    _addBaseSvg () {
        return (
            <svg
                viewBox={ previewViewbox } width={ previewSize } height={ previewSize } xmlns="http://www.w3.org/2000/svg"
                dangerouslySetInnerHTML={ {__html: this._fillSvgWithStyle() } }
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
