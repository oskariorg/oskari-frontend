import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, TextInput } from 'oskari-ui';
import { SearchOutlined } from '@ant-design/icons';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledInput = styled(TextInput)`
    height: 24px;
    border-radius: calc(${props => props.rounding ? props.rounding.replace('%', '') / 100 : 0} * 24px);
`;

const StyledButton = styled(Button)`
    margin-left: 7px;
    height: 24px;
    border-radius: calc(${props => props.$rounding ? props.$rounding.replace('%', '') / 100 : 0} * 24px);
    background: ${props => props.$backgroundColor};
    color: ${props => props.$iconColor};
    border: none;
    &:hover {
        background: ${props => props.$backgroundColor};
        color: ${props => props.$iconColor};
        border: none;
    }
    &:focus {
        background: ${props => props.$backgroundColor};
        color: ${props => props.$iconColor};
        border: none;
    }
    &:active {
        background: ${props => props.$backgroundColor};
        color: ${props => props.$iconColor};
        border: none;
    }
`;

const SearchContainer = styled('div')`
    margin: 0 10px 10px 10px;
    display: flex;
    height: 32px;
    flex-direction: row;
    background: ${props => props.backgroundColor};
    align-items: center;
    padding: 3px 7px 3px 3px;
    border-radius: calc(${props => props.rounding ? props.rounding.replace('%', '') / 100 : 0} * 32px);
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
`;

export const SearchBar = ThemeConsumer(({ theme = {}, search, loading, disabled = false, placeholder }) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const icon = helper.getTextColor();
    const rounding = helper.getButtonRoundness();
    const [value, setValue] = useState('');

    return (
        <SearchContainer backgroundColor={bgColor} rounding={rounding}>
            <StyledInput
                rounding={rounding}
                value={value}
                onChange={e => setValue(e.target.value)}
                allowClear
                loading={loading}
                onPressEnter={e => search(value)}
                disabled={disabled}
                placeholder={placeholder}
            />
            <StyledButton
                $rounding={rounding}
                $iconColor={icon}
                $backgroundColor={bgColor}
                onClick={e => search(value)}
                icon={<SearchOutlined />}
                disabled={disabled}
            />
        </SearchContainer>
    );
});
