import { parsePathFromSVG } from './SVGHelper';
import { OSKARI_BLANK_STYLE } from '../OskariDefaultStyle';

const areaPreviewSVG = `<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <pattern id="checker" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect fill="#eee" x="0" width="10" height="10" y="0">
                <rect fill="#eee" x="10" width="10" height="10" y="10"></rect>
            </rect>
        </pattern>
    </defs>
    <rect x="0" y="0" width="80" height="80" fill="url(#checker)"></rect>
    <path d="M10,17L40,12L29,40Z" stroke-linejoin="miter" stroke-linecap="butt" stroke-dasharray="0"></path>
</svg>`;

/**
 * @method _composeSvgPattern
 * @param {HTMLElement} patternPath pattern as DOM node element
 * @description Combine provided plain pattern path with definitive svg base
 * @returns {String} full pattern as string
 */
 const _composeSvgPattern = (patternPath, patternId) => {
    return '<defs><pattern id="' + patternId +'" viewBox="0, 0, 12, 12" width="100%" height="100%">' + patternPath.outerHTML + '</pattern></defs>';
}

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

const getPatternSVG = (areaFills, patternId) => {
    const name = getPatternName(patternId);
    const patternSVG = areaFills.find(pattern => pattern.name === name);
    return parsePathFromSVG(patternSVG.data);
}

/**
* @method getAreaSVG
* @description Composes area svg path
* @returns {String} area svg path
*/
let patternIdCounter = 0;
export const getAreaSVG = (areaParams, areaFills) => {
   const { color, strokecolor, size, linejoin, strokestyle, pattern } = areaParams;
   const path = parsePathFromSVG(areaPreviewSVG);

   path.setAttribute('stroke', strokecolor);
   path.setAttribute('stroke-width', size);
   path.setAttribute('stroke-linecap', OSKARI_BLANK_STYLE.stroke.lineCap);
   path.setAttribute('stroke-dasharray', strokestyle === 'dash' ? '4, 4': '');
   path.setAttribute('stroke-linejoin', linejoin);

   const patternId = 'patternPreview' + patternIdCounter++;
   const fillPatternSVG = getPatternSVG(areaFills, pattern);
   fillPatternSVG.setAttribute('stroke', color);
   path.setAttribute('fill', 'url(#' + patternId + ')');

   return _composeSvgPattern(fillPatternSVG, patternId) + path.outerHTML;
};
