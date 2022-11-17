import React, { useState } from 'react';
import { MapButton, Toolbar } from 'oskari-ui/components/buttons';
import styled from 'styled-components';

const Container = styled('div')`
    width: 32px;
    height: 32px;
    position: relative;
    ${props => props.noMargin ? 'margin: 0' : 'margin: 0 10px 10px 10px'};
    ${props => props.withToolbar && props.toolbarOpen && props.toolbarMargin};
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledButton = styled(MapButton)`
    z-index: 1;
`;

const THEME_LIGHT = {
    color: {
        primary: '#ffffff',
        accent: '#000000'
    }
};
const THEME_LIGHT_GRADIENT = {
    color: {
        primary: 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(240,240,240,1) 35%, rgba(221,221,221,1) 100%)',
        accent: '#000000'
    }
};
const THEME_DARK = {
    color: {
        primary: '#3c3c3c',
        accent: '#ffffff'
    }
};
const THEME_DARK_GRADIENT = {
    color: {
        primary: 'linear-gradient(180deg, rgba(101,101,101,1) 0%, rgba(60,60,60,1) 35%, rgba(9,9,9,1) 100%)',
        accent: '#ffffff'
    }
};

export const MapModuleButton = ({ styleName, title, icon, onClick, size = '32px', noMargin = false, iconActive = false, withToolbar = false, iconSize = '18px', className, children, disabled = false, position, toolbarDirection }) => {
    const [toolbarOpen, setToolbarOpen] = useState(false);

    let roundingPercent = 0;
    let color;

    let style = 'rounded-dark';
    if (styleName) {
        style = styleName;
    }

    const [shape, theme] = style.split('-');

    if (shape === 'rounded') {
        roundingPercent = 50;
    } else if (shape === 'sharp') {
        roundingPercent = 0;
    } else if (shape === '3d') {
        roundingPercent = 10;
    }
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

    let toolbarOpenDirection = 'right';
    if (toolbarDirection) {
        toolbarOpenDirection = toolbarDirection;
    } else if (position) {
        if (position.includes('left')) toolbarOpenDirection = 'right';
        else toolbarOpenDirection = 'left';
    }

    let toolbarMaxWidth = 50;
    const marginDirection = toolbarOpenDirection === 'right' ? 'right' : 'left';
    let toolbarMargin = `margin-${marginDirection}: 0`;
    if (withToolbar && toolbarOpen && children) {
        toolbarMaxWidth = children.length * 34 + 10;
        toolbarMargin = `margin-${marginDirection}: ${toolbarMaxWidth}px`;
    }

    return (
        <Container size={size} noMargin={noMargin} withToolbar={withToolbar} toolbarOpen={toolbarOpen} toolbarMargin={toolbarMargin}>
            <StyledButton
                onClick={withToolbar ? () => setToolbarOpen(!toolbarOpen) : onClick}
                icon={icon}
                theme={{ ...color, roundingPercent }}
                title={title}
                size={size}
                iconActive={iconActive || (withToolbar && toolbarOpen)}
                iconSize={iconSize}
                className={className}
                disabled={disabled}
                position={position}
            />
            {withToolbar && (
                <Toolbar height='32px' open={toolbarOpen} shape={shape} direction={toolbarOpenDirection} maxWidth={toolbarMaxWidth + 100}>
                    {children}
                </Toolbar>
            )}
        </Container>
    );
};
