import React from 'react';
import { Button, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledButton = styled(Button)`
    height: 32px;
    font-size: 14px;
    border: none;
    border-radius: calc(${props => props.$rounding ? props.$rounding / 100 : 0} * 32px);
    color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
    background: ${props => props.$backgroundColor};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    &:hover {
        color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        background: ${props => props.$backgroundColor};
    }
    &:active {
        color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        background: ${props => props.$backgroundColor};
    }
    &:focus {
        color: ${props => props.$active ? props.$hoverColor : props.$iconColor};
        background: ${props => props.$backgroundColor};
    }
    display: flex;
    align-items: center;
    justify-content: center;
`;

const ThemedButton = ThemeConsumer(({ theme = {}, active, ...rest }) => {
    const helper = getNavigationTheme(theme);
    const rounding = helper.getButtonRoundness();
    const icon = helper.getTextColor();
    const background = helper.getButtonColor();
    const hover = helper.getButtonHoverColor();
    return (
        <StyledButton
            $rounding={rounding}
            $iconColor={icon}
            $backgroundColor={background}
            $hoverColor={hover}
            $active={active}
            {...rest}
        />
    );
});

export const FeatureDataButton = ({ title, icon, active, onClick, disabled, iconActive, position, ...rest }) => {
    let tooltipPosition = 'top';
    if (position && position.includes('right')) {
        tooltipPosition = 'left';
    } else if (position && position.includes('left')) {
        tooltipPosition = 'right';
    }

    if (title) {
        return (
            <div>
                <Tooltip title={title} placement={tooltipPosition}>
                    <ThemedButton
                        title={title}
                        onClick={onClick}
                        disabled={disabled}
                        active={active}
                        {...rest}
                    >
                        {icon}
                    </ThemedButton>        
                </Tooltip>
            </div>
        );
    }
    return (
        <div>
            <ThemedButton
                onClick={onClick}
                disabled={disabled}
                active={active}
                loading={loading}
                {...rest}
            >
                {icon}
            </ThemedButton>
        </div>
    );
};
