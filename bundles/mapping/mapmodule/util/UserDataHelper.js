export const getValueFromLocale = (locale, key, lang = Oskari.getLang()) => {
    let values = locale[lang] || {};
    let value = values[key];
    if (value && value.trim()) {
        return Oskari.util.sanitize(value);
    }
    values = locale[Oskari.getDefaultLanguage()] || {};
    value = values[key] || '';
    return Oskari.util.sanitize(value);
};
