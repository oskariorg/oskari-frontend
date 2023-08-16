import React from 'react';
import PropTypes from 'prop-types';
import { FillPattern, isSolid }  from '../FillPattern';

const CAP = 'butt'; // round or square doesn't look nice with dash
const ID_PREFIX = 'preview-fill-pattern-';

const PATH = 'M10,25L70,15L50,70Z';

let patternIdCounter = 1;
export const AreaPreview = ({ previewSize, strokeDef, fillDef }) => {
    const { color: strokeColor, width, lineDash, lineJoin  } = strokeDef;
    const { color: fillColor, area: { pattern } } = fillDef;

    const dashArray = lineDash === 'dash' ? `5, ${4 + width}`: ''
    const id = ID_PREFIX + patternIdCounter++;

    const solid = isSolid(pattern);
    const fillPattern = solid ? fillColor : `url(#${id})`;
    return (
        <svg width={previewSize} height={previewSize}>
            { !solid && <FillPattern id={id} fillCode={pattern} color={fillColor} size={previewSize}/> }
            <path d={PATH}
                stroke={strokeColor}
                strokeWidth={width}
                fill={fillPattern}
                strokeLinejoin={lineJoin}
                strokeLinecap={CAP}
                strokeDasharray={dashArray}/>
        </svg>
    );
};

AreaPreview.propTypes = {
    previewSize: PropTypes.number.isRequired,
    strokeDef: PropTypes.object.isRequired,
    fillDef: PropTypes.object.isRequired
};
