import { getAreaPattern } from './SVGHelper';
import { OSKARI_BLANK_STYLE } from '../OskariDefaultStyle';

const CAP = OSKARI_BLANK_STYLE.stroke.lineCap;
const ID_PREFIX = 'patternPreview-';

const getPreviewSVG = (params, patternDef, fillPattern ) => {
    const { strokecolor, size, linejoin, strokestyle } = params;
    const dash = strokestyle === 'dash' ? '5, 4': '';
    return `<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            ${patternDef}
        <path d="M10,17L40,12L29,40Z" stroke="${strokecolor}" stroke-width="${size}" fill="${fillPattern}"
            stroke-linejoin="${linejoin}" stroke-linecap="${CAP}" stroke-dasharray="${dash}">
        </path>
    </svg>`;
};

const getPatternName = (patternId) => {
    switch (patternId) {
        case 0:
            return 'DIAGONAL_THIN';
        case 1:
            return 'DIAGONAL_THICK';
        case 2:
            return 'HORIZONTAL_THIN';
        case 3:
            return 'HORIZONTAL_THICK';
        case 4:
            return 'TRANSPARENT';
        default:
            return 'SOLID';
    };
}

/**
* @method getAreaSVG
* @description Composes area svg path
* @returns {String} area svg path
*/
let patternIdCounter = 0;
export const getAreaSVG = (areaParams) => {
    patternIdCounter++;
    let { color, pattern, ...params } = areaParams;
    if (color==='') {
        color = 'none';
    }
    const patternName = getPatternName(pattern);
    const patternId = ID_PREFIX + patternIdCounter;
    // TODO add pattern only when really needed
    const fillPattern = pattern < 0 || pattern > 3 ? color : `url(#${patternId})`;


    const patternDef = getAreaPattern(patternId, patternName, color);
    return getPreviewSVG(params, patternDef, fillPattern);
};
