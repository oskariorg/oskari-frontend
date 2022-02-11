import { LINE_DASH } from '../../../../../bundles/mapping/mapmodule/oskariStyle/constants';

/**
 * @method _composeLinePath
 * @description Composes line svg path
 * @returns {String} line svg path
 */
export const getLineSVG = (lineParams) => {
    const { color, size, linecap, linedash, linejoin } = lineParams;
    const dashArray = linedash === LINE_DASH.DASH ? `5, ${4 + size}`: ''
    console.log(dashArray);
    const svg =
        `<svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
            <path d="M10,20L30,60L70,40"
                stroke-width="${2 * size}"
                stroke-linejoin="${linejoin}"
                stroke-linecap="${linecap}"
                stroke-dasharray="${dashArray}"
                stroke="${color}"
                fill="transparent"/>
        </svg>`;

    return svg;
};
