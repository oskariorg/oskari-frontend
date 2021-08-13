// OSKARI STYLE CONSTANTS
// These are mentioned in the api documentation

export const LINE_DASH = {
    DASH: 'dash',
    DASHDOT: 'dashdot',
    DOT: 'dot',
    LONGDASH: 'longdash',
    LONGDASHDOT: 'longdashdot',
    SOLID: 'solid'
};

export const LINE_JOIN = {
    MITRE: 'mitre',
    ROUND: 'round',
    BEVEL: 'bevel'
};

export const LINE_CAP = {
    BUTT: 'butt',
    ROUND: 'round'
};

const AUTO = 'auto';
const DARKEN = 'darken';
const LIGHTEN = 'lighten';
const MINOR = 'minor';
const NORMAL = 'normal';
const MAJOR = 'major';

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

export const FILL_STYLE = {
    THIN_DIAGONAL: 'thin_diagonal',
    THICK_DIAGONAL: 'thick_diagonal',
    THIN_HORIZONTAL: 'thin_horizontal',
    THICK_HORIZONTAL: 'thick_horizontal',
    TRANSPARENT: 'transparent',
    SOLID: 'solid'
};

export const FILTER = {
    EQUAL: 'value',
    IN: 'in',
    NOT_IN: 'notIn',
    LIKE: 'like',
    NOT_LIKE: 'notLike',
    LESS: 'lessThan',
    LESS_EQUAL: 'atMost',
    GREATER: 'greaterThan',
    GREATER_EQUAL: 'atLeast',
    REG_EXP: 'regexp',
    WILD_CARD: '*'
};
