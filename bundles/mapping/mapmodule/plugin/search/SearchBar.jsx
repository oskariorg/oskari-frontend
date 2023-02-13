import React from 'react';
import styled from 'styled-components';
import { Button, TextInput } from 'oskari-ui';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';
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
    opacity: ${props => props.opacity};
    background: ${props => props.backgroundColor};
    align-items: center;
    padding: 3px 7px 3px 3px;
    border-radius: calc(${props => props.rounding ? props.rounding.replace('%', '') / 100 : 0} * 32px);
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
`;

export const SearchBar = ThemeConsumer(({ theme = {}, disabled = false, placeholder, state = {}, controller }) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const icon = helper.getTextColor();
    const rounding = helper.getButtonRoundness();
    const opacity = helper.getButtonOpacity();
    if (state.minimized) {
        return (
            <MapModuleButton
                className='t_search_minimized'
                icon={<SearchOutlined />}
                onClick={() => controller.requestSearchUI()}
            />);
    }
    const search = () => controller.doSearch();
    return (
        <SearchContainer backgroundColor={bgColor} rounding={rounding} opacity={opacity}>
            <StyledInput
                rounding={rounding}
                value={state.query}
                onChange={e => controller.setQuery(e.target.value)}
                allowClear
                onPressEnter={search}
                disabled={disabled}
                placeholder={placeholder}
            />
            { state.hasOptions &&
                <StyledButton
                    $rounding={rounding}
                    $iconColor={icon}
                    $backgroundColor={bgColor}
                    onClick={() => controller.showOptions()}
                    icon={<SettingOutlined />}
                    className='t_search_options'
                    disabled={disabled}
                />
            }
            <StyledButton
                $rounding={rounding}
                $iconColor={icon}
                $backgroundColor={bgColor}
                onClick={search}
                icon={<SearchOutlined />}
                loading={state.loading}
                className='t_search'
                disabled={disabled}
            />
        </SearchContainer>
    );
});
