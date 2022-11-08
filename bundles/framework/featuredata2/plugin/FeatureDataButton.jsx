import React from 'react';
import { Button } from 'oskari-ui';
import styled from 'styled-components';

const StyledButton = styled(Button)`
    height: 32px;
    font-size: 14px;
    border: none;
    border-radius: ${props => props.$rounding};
    color: ${props => props.$active ? '#ffd400' : props.$theme.accent};
    background: ${props => props.$theme.primary};
    box-shadow: 1px 1px 2px rgb(0 0 0 / 60%);
    &:hover {
        color: ${props => props.$active ? '#ffd400' : props.$theme.accent};
        background: ${props => props.$theme.primary};
    }
    &:active {
        color: ${props => props.$active ? '#ffd400' : props.$theme.accent};
        background: ${props => props.$theme.primary};
    }
    &:focus {
        color: ${props => props.$active ? '#ffd400' : props.$theme.accent};
        background: ${props => props.$theme.primary};
    }
    display: flex;
    align-items: center;
    justify-content: center;
`;

const THEME_LIGHT = {
        primary: '#ffffff',
        accent: '#000000'
};
const THEME_LIGHT_GRADIENT = {
        primary: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 35%, rgba(221,221,221,1) 100%)',
        accent: '#000000'
};
const THEME_DARK = {
        primary: '#3c3c3c',
        accent: '#ffffff'
};
const THEME_DARK_GRADIENT = {
        primary: 'linear-gradient(180deg, rgba(101,101,101,1) 0%, rgba(60,60,60,1) 35%, rgba(9,9,9,1) 100%)',
        accent: '#ffffff'
};

export const FeatureDataButton = ({ title, icon, active, onClick, disabled, styleName, iconActive, ...rest }) => {
    let style = 'rounded-dark';
    if (styleName) {
        style = styleName;
    }

    const [shape, theme] = style.split('-');

    let color;
    if (theme === 'light') {
        if (shape === '3d') {
            color = THEME_LIGHT_GRADIENT;
        } else {
            color = THEME_LIGHT;
        }
    } else if (theme === 'dark') {
        if (shape === '3d') {
            color = THEME_DARK_GRADIENT
        } else {
            color = THEME_DARK;
        }
    }

    return (
        <StyledButton
            title={title}
            onClick={onClick}
            $theme={color}
            $rounding={shape === 'sharp' ? '0px' : '5px'}
            disabled={disabled}
            $active={active}
            {...rest}
        >
            {icon}
        </StyledButton>
    );
};
