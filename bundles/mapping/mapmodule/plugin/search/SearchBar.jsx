import React from 'react';
import styled from 'styled-components';
import { Button, TextInput } from 'oskari-ui';
import { SearchOutlined, SettingOutlined } from '@ant-design/icons';
import { MapModuleButton } from '../../MapModuleButton';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

// this would make the clear cross be closer to edge:
// padding: 4px 0px 4px 11px;
const StyledInput = styled(TextInput)`
    height: 35px;
    border-radius: calc(${props => props.rounding ? props.rounding.replace('%', '') / 100 : 0} * 35px);
`;

// filtering class means that the search uses other channels than what are used by default
// -> highlight the button
const StyledButton = styled(Button)`
    margin-left: 7px;
    height: 35px;
    border-radius: calc(${props => props.$rounding ? props.$rounding.replace('%', '') / 100 : 0} * 35px);
    background: ${props => props.$backgroundColor};
    color: ${props => props.$iconColor};
    border: none;
    &:hover {
        background: ${props => props.$backgroundColor};
        color: ${props => props.$iconColor};
        border: none;
        path {
            fill: ${props => props.$hoverColor};
        }
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
    &.filtering {
        color:  ${props => props.$hoverColor};
    }
`;


const SearchContainer = styled('div')`
    margin: 0 10px 10px 10px;
    display: flex;
    height: 40px;
    flex-direction: row;
    opacity: ${props => props.opacity};
    background: ${props => props.backgroundColor};
    align-items: center;
    padding: 3px 7px 3px 3px;
    border-radius: calc(${props => props.rounding ? props.rounding.replace('%', '') / 100 : 0} * 40px);
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);

    .ant-btn-icon-only > * {
        font-size: 20px;
    }
    input {
        font-size: 15px;
    }
`;

export const SearchBar = ThemeConsumer(({ theme = {}, disabled = false, placeholder, state = {}, controller }) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const icon = helper.getTextColor();
    const rounding = helper.getButtonRoundness();
    const opacity = helper.getButtonOpacity();
    const hover = helper.getButtonHoverColor();
    if (state.minimized) {
        return (
            <MapModuleButton
                className='t_search_minimized'
                icon={<SearchOutlined />}
                onClick={() => controller.requestSearchUI()}
            />);
    }
    const search = () => controller.doSearch();
    const { defaultChannels = [], selectedChannels = []} = state;
    const isUsingDefaultChannels = selectedChannels.length === defaultChannels.length && selectedChannels.every(id => defaultChannels.includes(id));
    let optionsCSSClasses = 't_search_options';
    if (!isUsingDefaultChannels) {
        optionsCSSClasses += ' filtering';
    }
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
                    $hoverColor={hover}
                    onClick={() => controller.showOptions()}
                    icon={<SettingOutlined />}
                    className={optionsCSSClasses}
                    disabled={disabled}
                />
            }
            <StyledButton
                $rounding={rounding}
                $iconColor={icon}
                $backgroundColor={bgColor}
                $hoverColor={hover}
                onClick={search}
                icon={<SearchOutlined />}
                loading={state.loading}
                className='t_search'
                disabled={disabled}
            />
        </SearchContainer>
    );
});
