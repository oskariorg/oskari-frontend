import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { languageNames } from './languageNames';

const StyledSelect = styled('select')`
    width: 100%;
    & option[value="_"][disabled] {
        display: none;
    }
`;

const loc = Oskari.getMsg.bind(null, 'language-selector');

export const LanguageSelect = ({ languages, value, onChange, hideCurrent }) => {
    const langOptions = languages
        .filter((lang) => !hideCurrent || lang !== value)
        .map((lang) => <option key={lang} value={lang}>{languageNames[lang] || lang}</option>);
    const placeholder = <option value="_" disabled>{loc('title')}</option>;
    return (
        <StyledSelect
            className="oskari-language-selector"
            onChange={event => onChange(event.target.value)}
            value={!hideCurrent ? value : undefined}
            defaultValue="_">
            {placeholder}
            {langOptions}
        </StyledSelect>
    );
};

LanguageSelect.propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    hideCurrent: PropTypes.bool
};
