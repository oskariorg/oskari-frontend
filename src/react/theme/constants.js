// OSKARI STYLE CONSTANTS
// Use same effect keywords that are mentioned in the map feature styling API documentation
// Note! Copy-pasted from bundles/mapping/mapmodule/oskariStyle!
// TODO: figure out if these should be shared and from map or src
const AUTO = 'auto';
const DARKEN = 'darken';
const LIGHTEN = 'lighten';
const MINOR = 'minor';
const NORMAL = 'normal';
const MAJOR = 'major';

export const DEFAULT_COLORS = {
    NAV_BG: '#333438',
    HEADER_BG: '#fdf8d9',
    ACCENT: '#ffd400',
    DARK_BUTTON_BG: '#141414'
};

export const EFFECT = {
    NONE: 'none',
    AUTO,
    DARKEN,
    LIGHTEN,
    AUTO_MINOR: `${AUTO} ${MINOR}`,
    AUTO_NORMAL: `${AUTO} ${NORMAL}`,
    AUTO_MAJOR: `${AUTO} ${MAJOR}`,
    DARKEN_MINOR: `${DARKEN} ${MINOR}`,
    DARKEN_NORMAL: `${DARKEN} ${NORMAL}`,
    DARKEN_MAJOR: `${DARKEN} ${MAJOR}`,
    LIGHTEN_MINOR: `${LIGHTEN} ${MINOR}`,
    LIGHTEN_NORMAL: `${LIGHTEN} ${NORMAL}`,
    LIGHTEN_MAJOR: `${LIGHTEN} ${MAJOR}`
};
