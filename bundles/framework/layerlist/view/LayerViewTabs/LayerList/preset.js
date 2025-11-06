export const GROUPING_PRESET = [
    {
        key: 'THEME',
        localeKey: 'inspire',
        method: 'getGroups'
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
    MAX: 1600,
    MIN: 200
};

// Config for mobile use.
// In mobile mode:
// * searchText.length < MIN_CHAR_COUNT -> initiate search with enter
// * searchText.length >= MIN_CHAR_COUNT -> always use MIN delay
export const TEXT_SEARCH_TYPING_TIMEOUT_SETTINGS_MOBILE = {
    MIN_CHAR_COUNT: 5,
    MIN: 1000
};
