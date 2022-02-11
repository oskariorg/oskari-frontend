
import { getDiagonalPattern, getHorizontalPattern } from '../../../../../bundles/mapping/mapmodule/oskariStyle/generator.ol';
const PARSER = new DOMParser();
const SIZE = 64; // TODO: 32??

/**
 * @method parsePath
 * @param {String} baseSvg - svg as string
 * @description Parses correct svg based on provided format
 *
 * @returns DOM Element - First path element in the base svg
 */
export const parsePathFromSVG = (baseSvg) => {
    const parsed = PARSER.parseFromString(baseSvg, 'image/svg+xml');
    return parsed.getElementsByTagName('path')[0];
};

export const getAreaPattern = (patternId, patternName, color)=> {
    if (patternName === 'TRANSPARENT') {
        return _composeTransparent(patternId);
    }
    let strokeWidth = 2;
    let path = '';
    // TODO move logic to generator/mapmodule
    switch (patternName) {
        case 'DIAGONAL_THICK':
            strokeWidth = 3;
        case 'DIAGONAL_THIN':
            path = getDiagonalPattern(SIZE, strokeWidth);
            break;
        case 'HORIZONTAL_THICK' :
            strokeWidth = 3;
        case 'HORIZONTAL_THIN':
            path = getHorizontalPattern(SIZE, strokeWidth);
            break;
    }
    return _composeSvgPattern(patternId, path, color, strokeWidth);
};

const _composeSvgPattern = (id, path, color, strokeWidth) => {
    return `<defs>
        <pattern id="${id}" viewBox="0, 0, 64, 64" width="100%" height="100%">
            <path d="${path}" stroke="${color}" stroke-width="${strokeWidth}"/>
        </pattern>
    </defs>`;
}
const _composeTransparent = (id) => {
    return `<defs>
        <pattern id="${id}" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <rect fill="#eee" x="0" width="8" height="8" y="0"/>
            <rect fill="#eee" x="8" width="8" height="8" y="8"/>
        </pattern>
    </defs>`;
}

const areaFills = [
    {
        name: 'TRANSPARENT',
        path: ''
    },
    {
        name: 'SOLID',
        path: ''
    },
    {
        name: 'HORIZONTAL_THIN',
        path: getHorizontalPattern(SIZE, 2)
    },
    {
        name: 'HORIZONTAL_THICK',
        path: getHorizontalPattern(SIZE, 3)
    },
    {
        name: 'DIAGONAL_THIN',
        path: getDiagonalPattern(SIZE, 2)
    },
    {
        name: 'DIAGONAL_THICK',
        path: getDiagonalPattern(SIZE, 3)
    }
];