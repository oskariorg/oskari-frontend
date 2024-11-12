import React from 'react';
import { Slider as AntSlider } from 'antd';
import styled from 'styled-components';
import { ThemeConsumer } from 'oskari-ui/util';
import { getNavigationTheme, DEFAULT_COLORS } from 'oskari-ui/theme';

const normal = 4;
const thick = 8;
const handler = 12;
const hover = DEFAULT_COLORS.SLIDER_HOVER;

const StyledAntSlider = styled(AntSlider)`
    ${props => props.noMargin ? 'margin: 0;' : ''}
    .ant-slider-mark-text {
        white-space: nowrap;
        font-size: 11px;
    }
    .ant-slider-dot {
        ${props => props.hideDots ? 'display: none;' : ''}
    }
    &:hover .ant-slider-handle::after {
        box-shadow: 0 0 0 2px ${hover};
    }
`;

const ThemedAntSlider = styled(AntSlider)`
    &&& {
        ${props => props.noMargin ? 'margin: 0;' : ''}
    }
    .ant-slider-mark {
        ${props => props.vertical ? '' : 'top: -18px;'}
    }
    .ant-slider-mark-text {
        color: ${props => props.theme.getTextColor()};
        font-size: 11px;
    }
    .ant-slider-handle::after {
        display: none;
    }
    .ant-slider-dot {
        background: #3c3c3c;
        border: none;
        top: 0px;
        ${props => props.vertical ? 'height': 'width'}: 2px;
        ${props => props.vertical ? 'width': 'height'}: ${props => props.useThick ? thick : normal}px;
    }
    &:hover .ant-slider-track,
    &:hover .ant-slider-handle {
        background-color: ${props => props.theme.getAccentHover()} !important;
    }
`;

const getThemedStyle = (theme, vertical, useThick) => {
    const handleSize = vertical ? 'height' : 'width';
    const thickness = vertical ?  'width' : 'height';
    const alignment = vertical ? 'left' : 'top';
    const size = useThick ? thick : normal;
    return {
        track: {
            [thickness]: `${size}px`,
            backgroundColor: theme.getAccent()
        },
        rail: {
            [thickness]: `${size}px`,
            backgroundColor: theme.getTextColor()
        },
        handle: {
            backgroundColor: theme.getAccent(),
            [handleSize]: '8px',
            [thickness]: `${size + handler}px`,
            [alignment]: '-2px',
            borderRadius: '6px',
            border: 'solid 1px #3c3c3c'
        }
    };
};

export const Slider = ({ theme, useThick, vertical, ...rest }) => {
    return <StyledAntSlider vertical= {vertical} {...rest} />
};

export const ThemedSlider = ThemeConsumer(({ theme, useThick, vertical, ...rest }) => {
    const helper = getNavigationTheme(theme);
    const style = getThemedStyle(helper, vertical, useThick);
    return <ThemedAntSlider styles={style} theme={helper} useThick={useThick} vertical={vertical} {...rest} />
});
