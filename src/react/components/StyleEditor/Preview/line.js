import { parsePathFromSVG } from './SVGHelper';

const linePreviewSVG = `<svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
    <path d="M10,15L20,35L40,25"
        stroke-width="3"
        stroke-linejoin="miter"
        stroke-linecap="butt"
        strokeDasharray="0"
        fill="none"
        stroke="#000000"></path>
</svg>`;

/**
 * @method _composeLinePath
 * @description Composes line svg path
 * @returns {String} line svg path
 */
export const getLineSVG = (lineParams) => {
    const { color, size, linecap, linedash, linejoin } = lineParams;
    const path = parsePathFromSVG(linePreviewSVG);

    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', size);
    path.setAttribute('stroke-linecap', linecap);
    path.setAttribute('stroke-dasharray', linedash === 'dash' ? '4, 4': '');
    path.setAttribute('stroke-linejoin', linejoin);

    return path.outerHTML;
};
