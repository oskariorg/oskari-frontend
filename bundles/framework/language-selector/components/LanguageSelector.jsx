import React from 'react';
import styled from 'styled-components';
import {languageNames} from './languageNames';
import {Select, Option} from '../../../admin/admin-layereditor/components/Select';
import {getSupportedLanguages} from './getSupportedLanguages';

const StyledSelect = styled(Select)`width: 100%;`;

const loc = Oskari.getMsg.bind(null, 'language-selector');

const handleLanguageChange = (language) => {
    let redirect;
    const newLang = 'lang=' + language;
    if (window.location.href.indexOf('?') === -1) {
        redirect = window.location.href + '?' + newLang;
    } else if (window.location.href.indexOf('lang=') > -1) {
        redirect = window.location.href.replace(/lang=[^&]+/, newLang);
    } else {
        redirect = window.location.href + '&' + newLang;
    }
    window.location.href = redirect;
};

export const LanguageSelector = () => {
    const supported = getSupportedLanguages();
    const currentLanguage = Oskari.getLang();
    const langOptions = supported
        .filter((lang) => lang !== currentLanguage)
        .map((lang) => <Option key={lang} value={lang}>{languageNames[lang]}</Option>);
    return (
        <StyledSelect
            className="oskari-language-selector"
            onChange={handleLanguageChange}
            placeholder={loc('title')}
        >{langOptions}</StyledSelect>
    );
};
