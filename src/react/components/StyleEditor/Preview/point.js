import { parsePathFromSVG } from './SVGHelper';
import { OSKARI_BLANK_STYLE } from '../OskariDefaultStyle';
import { constants } from '../index';

export const getPointSVG = (pointParams) => {
    const { color, shape } = pointParams;
    const path = parsePathFromSVG(constants.MARKERS[shape].data);

    path.setAttribute('stroke', '#000000');
    path.setAttribute('stroke-width', OSKARI_BLANK_STYLE.defaultStrokeWidth);
    path.setAttribute('stroke-linecap', OSKARI_BLANK_STYLE.stroke.lineCap);
    path.setAttribute('stroke-dasharray', '');
    path.setAttribute('stroke-linejoin', OSKARI_BLANK_STYLE.stroke.area.lineJoin);
    path.setAttribute('fill', color);

    return path.outerHTML;
};