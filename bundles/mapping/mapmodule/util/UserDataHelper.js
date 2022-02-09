export const getValueFromLocale = (locale, key, lang = Oskari.getLang()) => {
    let values = locale[lang] || {};
    const value = values[key];
    if (value && value.trim()) {
        return value;
    }
    values = locale[Oskari.getDefaultLanguage()] || {};
    return values[key] || '';
};
