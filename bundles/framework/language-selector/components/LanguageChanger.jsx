import React from 'react';
import { LanguageSelect } from './LanguageSelect';
import { getSupportedLanguages } from './getSupportedLanguages';

const handleLanguageChange = (langCode) => {
    const oldSearch = window.location.search;
    const newLang = 'lang=' + langCode;
    if (oldSearch === '') {
        return redirect('?' + newLang);
    } 
    if (oldSearch.indexOf('lang=') > -1) {
        return redirect(oldSearch.replace(/lang=[^&]+/, newLang));
    } 
    return redirect(oldSearch + '&' + newLang);
};

const redirect = (search) => {
    const { pathname, hash } = window.location;
    window.location.href = (pathname + search + hash);
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
