import React from 'react';
import PropTypes from 'prop-types';
import { getFillPatternPath } from '../../../../bundles/mapping/mapmodule/oskariStyle/generator.ol';
import { FILLS } from './constants';

const OVERFLOW = 4;

export const isSolid = id => {
    return id === FILLS.SOLID || id < 0;
}

export const FillPattern = ({ id, fillCode, color, size: svgSize })=> {
    // create little bigger pattern to get diagonal corners look nice
    const size = svgSize + OVERFLOW;
    if (fillCode === FILLS.TRANSPARENT) {
        return (
            <defs>
                <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect fill="#eee" x="0" width="8" height="8" y="0"/>
                    <rect fill="#eee" x="8" width="8" height="8" y="8"/>
                </pattern>
            </defs>
        );
    }
    const { strokeWidth, path } = getFillPatternPath(size, fillCode);
    const anchor = -OVERFLOW / 2;
    return (
        <defs>
            <pattern id={id} x={anchor} y={anchor} width={size} height={size} patternUnits="userSpaceOnUse">
                <path d={path} stroke={color} strokeWidth={strokeWidth}/>
            </pattern>
        </defs>
    );
};

FillPattern.propTypes = {
    id: PropTypes.string.isRequired,
    fillCode: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
};
