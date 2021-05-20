export const GROUPING_PRESET = [
    {
        key: 'THEME',
        localeKey: 'inspire',
        method: 'getInspireName'
    },
    {
        key: 'ORGANIZATION',
        localeKey: 'organization',
        method: 'getOrganizationName'
    }
];

export const GROUPING_DATAPROVIDER = GROUPING_PRESET[1].key;

export const TEXT_SEARCH_TYPING_TIMEOUT_SETTINGS = {
    MIN_CHAR_COUNT: 1,
    MAX_CHAR_COUNT: 8,
    MAX: 2000,
    MIN: 200
};
