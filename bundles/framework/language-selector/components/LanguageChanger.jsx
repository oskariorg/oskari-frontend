import React from 'react';
import { LanguageSelect } from './LanguageSelect';
import { getSupportedLanguages } from './getSupportedLanguages';

const handleLanguageChange = (event) => {
    let redirect;
    const newLang = 'lang=' + event.target.value;
    if (window.location.href.indexOf('?') === -1) {
        redirect = window.location.href + '?' + newLang;
    } else if (window.location.href.indexOf('lang=') > -1) {
        redirect = window.location.href.replace(/lang=[^&]+/, newLang);
    } else {
        redirect = window.location.href + '&' + newLang;
    }
    window.location.href = redirect.replace('#', '');
};

export const LanguageChanger = () => {
    const supported = getSupportedLanguages();
    const currentLanguage = Oskari.getLang();
    return <LanguageSelect
        languages={supported}
        value={currentLanguage}
        onChange={handleLanguageChange}
        hideCurrent
    />;
};
