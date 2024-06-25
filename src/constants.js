const AUTO = 'auto';
const DARKEN = 'darken';
const LIGHTEN = 'lighten';
const MINOR = 'minor';
const NORMAL = 'normal';
const MAJOR = 'major';

export const DELTA = {
    [MINOR]: 60,
    [NORMAL]: 90,
    [MAJOR]: 120
};

export const DEFAULT_DELTA = DELTA[NORMAL];

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
