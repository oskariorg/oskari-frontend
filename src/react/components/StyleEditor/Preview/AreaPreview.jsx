import React from 'react';
import PropTypes from 'prop-types';
import { FillPattern, isSolid }  from '../FillPattern';

const CAP = 'butt'; // round or square doesn't look nice with dash
const ID_PREFIX = 'preview-fill-pattern-';

const PATH = 'M10,25L70,15L50,70Z';

let patternIdCounter = 1;
export const AreaPreview = ({ previewSize, propsForSVG }) => {
    const { color, fillCode, strokecolor, size, linejoin, strokestyle  } = propsForSVG;

    const dashArray = strokestyle === 'dash' ? `5, ${4 + size}`: ''
    const id = ID_PREFIX + patternIdCounter++;

    const solid = isSolid(fillCode);
    const fillPattern = solid ? color : `url(#${id})`;
    return (
        <svg width={previewSize} height={previewSize}>
            { !solid && <FillPattern id={id} fillCode={fillCode} color={color}/> }
            <path d={PATH}
                stroke={strokecolor}
                strokeWidth={size}
                fill={fillPattern}
                strokeLinejoin={linejoin}
                strokeLinecap={CAP}
                strokeDasharray={dashArray}/>
        </svg>
    );
};

AreaPreview.propTypes = {
    previewSize: PropTypes.number.isRequired,
    propsForSVG: PropTypes.object.isRequired
};
