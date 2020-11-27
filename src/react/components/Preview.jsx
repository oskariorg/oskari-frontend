import React from 'react';
import PropTypes from 'prop-types';

//Size for preview
const previewSize = '80px';

// Style settings for preview rectangle
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
 *
 * @example <caption>Basic usage</caption>
 * <Preview previewIcon={ svgIconCallback }}/>
 */

export class Preview extends React.Component {
    constructor (props) {
        super(props);
    }

    /**
     * @method _addBaseSvg
     * @param {Component} path - svg image or callback for creating preview icon
     *
     * @returns {Component} - combined svg icon with preview base wrapping around provided icon
     *
     */
    _addBaseSvg (path) {
        return (
            <svg viewBox={ '0 0 ' + previewSize + ' ' + previewSize } width={ previewSize } height={ previewSize } xmlns="http://www.w3.org/2000/svg">
                <svg viewBox="0 0 80 80" width="120" height="120" x="0" y="0" id="marker">
                    { path }
                </svg>
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
    previewIcon: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element
    ]).isRequired
};
