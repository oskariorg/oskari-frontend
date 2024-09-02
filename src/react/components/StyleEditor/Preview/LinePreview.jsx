import React from 'react';
import PropTypes from 'prop-types';

const PATH = 'M10,20L30,60L70,40';

export const LinePreview = ({previewSize, strokeDef}) => {
    const { color, width, lineCap, lineDash, lineJoin } = strokeDef;
    const dashArray = lineDash === 'dash' ? `5, ${4 + width}`: ''
    
    return (
        <svg width={previewSize} height={previewSize}>
            <path d={PATH}
                strokeWidth={width}
                strokeLinejoin={lineJoin}
                strokeLinecap={lineCap}
                strokeDasharray={dashArray}
                stroke={color}
                fill='transparent'/>
        </svg>
    );
};

LinePreview.propTypes = {
    previewSize: PropTypes.number.isRequired,
    strokeDef: PropTypes.object.isRequired
};
