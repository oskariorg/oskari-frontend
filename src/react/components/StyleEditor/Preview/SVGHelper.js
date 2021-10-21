
const PARSER = new DOMParser();

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
