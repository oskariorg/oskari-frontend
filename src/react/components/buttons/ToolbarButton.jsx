import React from 'react';
import { Tooltip } from '../Tooltip';
import styled from 'styled-components';
import { ThemeConsumer } from '../../util';
import { getNavigationTheme } from '../../theme';

const StyledToolbar = styled('div')`
    position: absolute;
    opacity: 0.8;
    ${props => props.direction}: 0;
    top: 0;
    padding-${props => props.direction}: ${props => props.height};
    height: ${props => props.height};
    border-radius: calc(${props => props.rounding ? props.rounding.replace('%', '') / 100 : 0} * ${props => props.height});
    background: ${props => props.background};
    display: flex;
    align-items: center;
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    ${props => props.open ? `
        max-width: ${props => props.maxWidth};
        -moz-transition: max-width .3s linear;
        -ms-transition: max-width .3s linear;
        -o-transition: max-width .3s linear;
        -webkit-transition: max-width .3s linear;
        transition: max-width .3s linear;
        overflow: hidden;
    ` : `
        max-width: 0;
        -moz-transition: max-width .3s linear;
        -ms-transition: max-width .3s linear;
        -o-transition: max-width .3s linear;
        -webkit-transition: max-width .3s linear;
        transition: max-width .3s linear;
        visibility: hidden;
    `}
`;

const ToolbarItem = styled('div')`
    color: ${props => props.color};
    fill: ${props => props.color};
    margin: 0 10px 0 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%
`;

const Icon = styled('div')`
    width: 18px;
    height: 18px;
    svg {
        fill: ${props => props.$active ? props.$activeColor : props.$iconColor};
        path {
            fill: ${props => props.$active ? props.$activeColor : props.$iconColor};
        }
    }
`;

export const ToolbarButtonItem = ThemeConsumer(({ theme = {}, icon, onClick, iconActive = false, title, disabled = false }) => {
    const helper = getNavigationTheme(theme);
    const iconColor = helper.getTextColor();
    const hoverColor = helper.getButtonHoverColor();

    if (title) {
        return (
            <Tooltip title={title}>
                <ToolbarItem onClick={disabled ? null : onClick} color={iconColor}>
                    <Icon
                        $active={iconActive}
                        $activeColor={hoverColor}
                        $iconColor={iconColor}
                    >
                        {icon}
                    </Icon>
                </ToolbarItem>
            </Tooltip>
        );
    } else {
        return (
            <ToolbarItem onClick={disabled ? null : onClick} color={iconColor}>
                <Icon
                    $active={iconActive}
                    $activeColor={hoverColor}
                    $iconColor={iconColor}
                >
                    {icon}
                </Icon>
            </ToolbarItem>
        );
    }
});

const ThemedToolbar = ThemeConsumer(({ theme = {}, realWidth, maxWidth, children, ...rest }) => {
    const helper = getNavigationTheme(theme);
    const bgColor = helper.getButtonColor();
    const rounding = helper.getButtonRoundness();

    return (
        <StyledToolbar
            rounding={rounding}
            background={bgColor}
            maxWidth={maxWidth}
            realWidth={realWidth}
            {...rest}
        >
            {children}
        </StyledToolbar>
    );
});

export const Toolbar = ({ height, children, open = false, direction, toolbarWidth, maxWidth, ...rest }) => {
    const toolbarMaxWidth = `${maxWidth}px`;
    const realWidth = `${toolbarWidth}px`;
    let directionControl = 'left';
    if (direction === 'left') {
        directionControl = 'right';
    }

    return (
        <ThemedToolbar open={open} height={height} direction={directionControl} realWidth={realWidth} maxWidth={toolbarMaxWidth} {...rest}>
            {children}
        </ThemedToolbar>
    );
};
