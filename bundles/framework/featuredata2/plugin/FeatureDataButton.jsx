import React from 'react';
import { Button } from 'oskari-ui';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledButton = styled(Button)`
    height: 32px;
    font-size: 14px;
    border: none;
    opacity: ${props => props.$opacity};
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
    margin-right: ${props => props.$marginRight};
    margin-left: ${props => props.$marginLeft};
    margin-top: 10px;
`;

const ThemedButton = ThemeConsumer(({ theme = {}, active, ...rest }) => {
    const helper = getNavigationTheme(theme);
    const rounding = helper.getButtonRoundness();
    const icon = helper.getTextColor();
    const background = helper.getButtonColor();
    const hover = helper.getButtonHoverColor();
    const opacity = helper.getButtonOpacity();
    return (
        <StyledButton
            $rounding={rounding}
            $iconColor={icon}
            $backgroundColor={background}
            $hoverColor={hover}
            $active={active}
            $opacity={opacity}
            {...rest}
        />
    );
});

export const FeatureDataButton = ({ visible = true, icon, active, onClick, disabled, iconActive, position, loading, ...rest }) => {
    if (!visible) {
        return null;
    }
    let marginRight = '0px';
    let marginLeft = '0px';
    if (position.includes('right')) {
        marginRight = '10px';
    } else if (position.includes('left')) {
        marginLeft = '10px';
    }

    return (
        <div>
            <ThemedButton
                onClick={onClick}
                disabled={disabled}
                active={active}
                loading={loading}
                $marginRight={marginRight}
                $marginLeft={marginLeft}
                {...rest}
            >
                {icon}
            </ThemedButton>
        </div>
    );
};
