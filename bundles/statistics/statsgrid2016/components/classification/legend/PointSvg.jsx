import React from 'react';
import PropTypes from 'prop-types';

const STROKE_WIDTH = 1;
const CIRCLE_STYLE = {
    stroke: '#000000',
    strokeWidth: STROKE_WIDTH
};

export const PointSvg = ({ fillColor, sizePx, maxSizePx }) => {
    const height = sizePx + STROKE_WIDTH * 2;
    const width = maxSizePx + STROKE_WIDTH * 2;
    const r = sizePx / 2;
    const cx = maxSizePx / 2 + STROKE_WIDTH;
    const cy = r + STROKE_WIDTH;

    return (
        <svg height={height} width={width}>
            <circle {...CIRCLE_STYLE} fill={fillColor} cx={cx} cy={cy} r={r}/>
        </svg>
    );
};
PointSvg.propTypes = {
    sizePx: PropTypes.number.isRequired,
    maxSizePx: PropTypes.number.isRequired,
    fillColor: PropTypes.string.isRequired
};
