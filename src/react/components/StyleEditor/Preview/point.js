import { parsePathFromSVG } from './SVGHelper';

export const getPointSVG = (pointParams) => {
    const { color, shape } = pointParams;
    const markers = Oskari.getMarkers();
    const path = parsePathFromSVG(markers[shape].data);
    path.setAttribute('fill', color);

    return path.outerHTML;
};