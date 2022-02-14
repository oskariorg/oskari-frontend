import React from 'react';
import PropTypes from 'prop-types';

const PARSER = new DOMParser();

const getPointSVG = (pointParams) => {
    const { color, shape } = pointParams;
    const baseSvg = Oskari.getMarkers()[shape].data;
    const parsed = PARSER.parseFromString(baseSvg, 'image/svg+xml');
    const path = parsed.getElementsByTagName('path')[0];
    path.setAttribute('fill', color);
    return path.outerHTML;
};

// Viewbox settings for preview svg
const previewViewbox = {
    minX: 0,
    minY: 0,
    width: 60,
    height: 60
};

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

export const SVGWrapper = ({ previewSize, propsForSVG }) => {
    const { size } = propsForSVG;
    return (<svg
        viewBox={ _composePreviewViewbox(size) }
        width={ previewSize }
        height={ previewSize }
        xmlns="http://www.w3.org/2000/svg"
        dangerouslySetInnerHTML={ { __html: getPointSVG(propsForSVG) } }
    >
    </svg>);
};

SVGWrapper.propTypes = {
    previewSize: PropTypes.number.isRequired,
    propsForSVG: PropTypes.object.isRequired
};
