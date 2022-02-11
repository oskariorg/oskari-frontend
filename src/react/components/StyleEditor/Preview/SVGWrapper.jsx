import React from 'react';
import PropTypes from 'prop-types';
import { getPointSVG } from './point';

// Viewbox settings for preview svg
const previewViewbox = {
    minX: 0,
    minY: 0,
    width: 60,
    height: 60
};

// Size for preview svg
const defaultPreviewSize = '80px';
const maxSize = 5;
const multiplier = 2.5;

const _composePreviewViewbox = (size) => {
    // calculate viewbox for centering point symbols
    const minX = previewViewbox.minX - (multiplier * (maxSize-size));
    const minY = previewViewbox.minY - (multiplier * (maxSize-size));
    const widthV = previewViewbox.width - (2 * multiplier * size) - multiplier; // multiply by negative to shrink viewbox
    const heightV = previewViewbox.height - (2 * multiplier * size) - multiplier; // multiply by negative to shrink viewbox
    return minX + ' ' + minY + ' ' +  widthV + ' ' + heightV;
};

export const SVGWrapper = ({ width = defaultPreviewSize, height = defaultPreviewSize, propsForSVG }) => {
    const { size } = propsForSVG;
    return (<svg
        viewBox={ _composePreviewViewbox(size) }
        width={ width }
        height={ height }
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={ { __html: getPointSVG(propsForSVG) } }
    >
    </svg>);
};

SVGWrapper.propTypes = {
    propsForSVG: PropTypes.object.isRequired,
    width: PropTypes.string,
    height: PropTypes.string
};
