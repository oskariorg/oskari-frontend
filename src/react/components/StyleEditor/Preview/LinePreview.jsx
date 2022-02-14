import React from 'react';
import PropTypes from 'prop-types';

const PATH = 'M10,20L30,60L70,40';

export const LinePreview = ({previewSize, propsForSVG}) => {
    const { color, size, linecap, linedash, linejoin } = propsForSVG;
    const dashArray = linedash === 'dash' ? `5, ${4 + size}`: ''
    
    return (
        <svg width={previewSize} height={previewSize}>
            <path d={PATH}
                strokeWidth={size}
                strokeLinejoin={linejoin}
                strokeLinecap={linecap}
                strokeDasharray={dashArray}
                stroke={color}
                fill='transparent'/>
        </svg>
    );
};

LinePreview.propTypes = {
    previewSize: PropTypes.number.isRequired,
    propsForSVG: PropTypes.object.isRequired
};
