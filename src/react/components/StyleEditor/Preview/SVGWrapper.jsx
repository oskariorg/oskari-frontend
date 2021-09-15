import React from 'react';
import PropTypes from 'prop-types';

// Viewbox settings for preview svg
const previewViewbox = {
    minX: 0,
    minY: 0,
    width: 60,
    height: 60
};

// Size for preview svg
const defaultPreviewSize = '80px';

const _composePreviewViewbox = (size) => {
    let viewboxString = ''
    const widthV = previewViewbox.width - (5 * size); // multiply by negative to shrink viewbox
    const heightV = previewViewbox.height - (5 * size); // multiply by negative to shrink viewbox
    viewboxString = previewViewbox.minX + ' ' + previewViewbox.minY + ' ' +  widthV + ' ' + heightV;
    return viewboxString;
};

export const SVGWrapper = ({ width = defaultPreviewSize, height = defaultPreviewSize, iconSize = 3, content = '' }) => {
    return (<svg
        viewBox={ _composePreviewViewbox(iconSize) }
        width={ width }
        height={ height }
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={ { __html: content } }
    >
    </svg>);
};

SVGWrapper.propTypes = {
    content: PropTypes.string.isRequired,
    width: PropTypes.string,
    height: PropTypes.string,
    iconSize: PropTypes.number
};
