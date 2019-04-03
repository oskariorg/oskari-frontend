import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {languageNames} from './languageNames';
import {Select, Option} from '../../../admin/admin-layereditor/components/Select';

const StyledSelect = styled(Select)`width: 100%;`;

const loc = Oskari.getMsg.bind(null, 'language-selector');

export const LanguageSelect = ({languages, value, onChange, hideCurrent}) => {
    const langOptions = languages
        .filter((lang) => !hideCurrent || lang !== value)
        .map((lang) => <Option key={lang} value={lang}>{languageNames[lang] || lang}</Option>);

    return (
        <StyledSelect
            className="oskari-language-selector"
            onChange={onChange}
            value={!hideCurrent ? value : undefined}
            placeholder={loc('title')}
        >{langOptions}</StyledSelect>
    );
};

LanguageSelect.propTypes = {
    languages: PropTypes.arrayOf(PropTypes.string).isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    hideCurrent: PropTypes.bool
};
