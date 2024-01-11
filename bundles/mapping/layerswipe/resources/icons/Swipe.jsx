import React from 'react';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme } from 'oskari-ui/theme';

const StyledSvg = styled('svg')`
    fill: none !important;
    path {
        fill: none !important;
        stroke: ${props => props.$active ? props.$activeColor : props.$iconColor};
    }
    line {
        stroke: ${props => props.$activeColor};
    }
    &focus,
    &active,
    &:hover {
        path {
            fill: none !important;
            stroke: ${props => props.$activeColor};
        }
    }
`;

export const Swipe = ThemeConsumer(({ theme = {}, active }) => {
    const helper = getNavigationTheme(theme);
    const iconColor = helper.getTextColor();
    const hover = helper.getButtonHoverColor();
    return (
        <StyledSvg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            $iconColor={iconColor}
            $activeColor={hover}
            $active={active}
        >
            <line x1="15" y1="24" x2="16.5" y2="24" fill="none" strokeLinejoin="bevel" strokeWidth="2"/>
            <path d="M19.39,24h6.89A1.63,1.63,0,0,0,28,22.47V9.53A1.63,1.63,0,0,0,26.28,8H18" fill="none" strokeLinejoin="bevel" strokeWidth="2" strokeDasharray="2.89 2.89"/>
            <line x1="16.5" y1="8" x2="15" y2="8" fill="none" strokeLinejoin="bevel" strokeWidth="2"/>
            <path d="M15,8H5.72A1.63,1.63,0,0,0,4,9.53V22.47A1.63,1.63,0,0,0,5.72,24H15" fill="none" strokeMiterlimit="10" strokeWidth="2"/>
            <line x1="16" y1="3.5" x2="16" y2="28.5" fill="none" strokeMiterlimit="10" strokeWidth="2"/>
        </StyledSvg>
    );
});

export { Swipe as SwipeIcon };
