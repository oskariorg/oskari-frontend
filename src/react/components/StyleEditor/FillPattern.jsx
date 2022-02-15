import React from 'react';
import PropTypes from 'prop-types';
import { getFillPatternPath } from '../../../../bundles/mapping/mapmodule/oskariStyle/generator.ol';
import { FILLS } from './constants';

const PATTERN_SIZE = 64;

export const isSolid = id => {
    return id === FILLS.SOLID || id < 0;
}

export const FillPattern = ({ id, fillCode, color })=> {
    if (fillCode === FILLS.TRANSPARENT) {
        return (
            <defs>
                <pattern id={id} x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                    <rect fill="#eee" x="0" width="8" height="8" y="0"/>
                    <rect fill="#eee" x="8" width="8" height="8" y="8"/>
                </pattern>
            </defs>
        );
    }
    const { strokeWidth, path } = getFillPatternPath(PATTERN_SIZE, fillCode);
    return (
        <defs>
            <pattern id={id} width={PATTERN_SIZE} height={PATTERN_SIZE}>
                <path d={path} stroke={color} strokeWidth={strokeWidth}/>
            </pattern>
        </defs>
    );
};

FillPattern.propTypes = {
    id: PropTypes.string.isRequired,
    fillCode: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired
};
