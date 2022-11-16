import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextInput } from 'oskari-ui';
import { SearchOutlined } from '@ant-design/icons';

const StyledInput = styled(TextInput)`
    height: 25px;
    border-radius: ${props => props.$searchStyle.inputRounding};
`;

const StyledButton = styled(Button)`
    margin-left: 7px;
    height: 25px;
    border-radius: ${props => props.$searchStyle.buttonRounding};
    background: ${props => props.$searchStyle.backgroundColor};
    color: ${props => props.$searchStyle.iconColor};
    border: none;
    &:hover {
        background: ${props => props.$searchStyle.backgroundColor};
        color: ${props => props.$searchStyle.iconColor};
        border: none;
    }
    &:focus {
        background: ${props => props.$searchStyle.backgroundColor};
        color: ${props => props.$searchStyle.iconColor};
        border: none;
    }
    &:active {
        background: ${props => props.$searchStyle.backgroundColor};
        color: ${props => props.$searchStyle.iconColor};
        border: none;
    }
`;

const SearchContainer = styled('div')`
    margin: 0 10px 10px 10px;
    display: flex;
    flex-direction: row;
    background: ${props => props.$searchStyle.backgroundColor};
    align-items: center;
    padding: 3px 7px 3px 3px;
    border-radius: ${props => props.$searchStyle.rounding};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
`;

const THEME_DARK = '#3c3c3c';
const THEME_LIGHT = '#ffffff';
const THEME_3D_LIGHT = 'linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(240,240,240,1) 35%,rgba(221,221,221,1) 100%)';
const THEME_3D_DARK = 'linear-gradient(180deg,rgba(101,101,101,1) 0%,rgba(60,60,60,1) 35%,rgba(9,9,9,1) 100%)';

export const SearchBar = ({ search, loading, styleName, disabled = false, placeholder }) => {
    const [value, setValue] = useState('');

    let style = 'rounded-dark';
    if (styleName) {
        style = styleName;
    }

    let searchStyle = {
        ...THEME_DARK,
        rounding: '8px',
        buttonRounding: '8px'
    }

    const [shape, theme] = style.split('-');
    if (shape === 'rounded') {
        searchStyle.rounding = '8px';
        searchStyle.buttonRounding = '8px';
        searchStyle.inputRounding = '8px';
    } else if (shape === 'sharp') {
        searchStyle.rounding = '0px';
        searchStyle.buttonRounding = '3px';
        searchStyle.inputRounding = '3px';
    } else if (shape === '3d') {
        searchStyle.rounding = '5px';
        searchStyle.buttonRounding = '5px';
        searchStyle.inputRounding = '5px';
    }

    if (theme === 'dark') {
        searchStyle.iconColor = '#ffffff';
        if (shape === '3d') {
            searchStyle.backgroundColor = THEME_3D_DARK;
        } else {
            searchStyle.backgroundColor = THEME_DARK;
        }
    } else if (theme === 'light') {
        searchStyle.iconColor = '#3c3c3c';
        if (shape === '3d') {
            searchStyle.backgroundColor = THEME_3D_LIGHT;
        } else {
            searchStyle.backgroundColor = THEME_LIGHT;
        }
    }

    return (
        <SearchContainer $searchStyle={searchStyle}>
            <StyledInput
                value={value}
                onChange={e => setValue(e.target.value)}
                allowClear
                loading={loading}
                $searchStyle={searchStyle}
                onPressEnter={e => search(value)}
                disabled={disabled}
                placeholder={placeholder}
            />
            <StyledButton
                onClick={e => search(value)}
                icon={<SearchOutlined />}
                $searchStyle={searchStyle}
                disabled={disabled}
            />
        </SearchContainer>
    );
}
