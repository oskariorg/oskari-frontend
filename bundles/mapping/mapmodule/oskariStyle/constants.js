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

export const FILL_STYLE = {
    THIN_DIAGONAL: 0,
    THICK_DIAGONAL: 1,
    THIN_HORIZONTAL: 2,
    THICK_HORIZONTAL: 3,
    TRANSPARENT: 4,
    SOLID: 5
};

export const PATTERN_STROKE = {
    THIN: 2,
    THICK: 4
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

export const STYLE_TYPE = {
    POINT: 'point',
    LINE: 'line',
    AREA: 'area',
    COLLECTION: 'collection'
};
