import React from 'react';
import PropTypes from 'prop-types';
import { hexToRGBA } from './util';

const STROKE_WIDTH = 1;
const FONT_SIZE = 12;
const FONT_COLOR = '#3c3c3c';
const TEXT_MARGIN = 20;
const SEPARATOR = ' - '; // geostats default separator
const CIRCLE_STYLE = {
    stroke: '#000000',
    strokeWidth: STROKE_WIDTH
};
const COUNT_FONT_STYLE = {
    fontSize: '0.8em',
    fontStyle: 'italic',
    fill: '#666666',
    dx: 4
};

export const PointSvg = ({ range, count, color, sizePx, format, maxSize, opacity, pointY }) => {
    const fillColor = opacity !== 1 ? hexToRGBA(color, opacity) : color;
    // range '100 - 200'
    const minMax = range.split(SEPARATOR);
    const min = format(parseFloat(minMax[0]));
    const max = format(parseFloat(minMax[1]));
    const text = min === max ? min : min + SEPARATOR + max;
    const wh = sizePx + STROKE_WIDTH * 2;
    const r = sizePx / 2;
    const cx = maxSize / 2 + STROKE_WIDTH;
    const cy = r + STROKE_WIDTH;

    const tx = TEXT_MARGIN + maxSize;
    // Centralize text to point
    const align = FONT_SIZE / 3;
    const ty = cy + align < FONT_SIZE ? FONT_SIZE : cy + align;
    return (
        <svg y={pointY} height={wh}>
            <circle {...CIRCLE_STYLE} fill={fillColor} cx={cx} cy={cy} r={r}/>
            <text fill={FONT_COLOR} x={tx} y={ty}>
                { text }
                <tspan {...COUNT_FONT_STYLE}>({ count })</tspan>
            </text>
        </svg>
    );
};
PointSvg.propTypes = {
    count: PropTypes.number.isRequired,
    opacity: PropTypes.number.isRequired,
    sizePx: PropTypes.number.isRequired,
    pointY: PropTypes.number.isRequired,
    maxSize: PropTypes.number.isRequired,
    range: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    format: PropTypes.func.isRequired
};
