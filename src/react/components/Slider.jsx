import React from 'react';
import { Slider as AntSlider } from 'antd';
import styled from 'styled-components';
import { getNavigationTheme, DEFAULT_COLORS } from 'oskari-ui/theme';

const normal = 4;
const thick = 8;
const handler = 12;
const hover = DEFAULT_COLORS.SLIDER_HOVER;

const StyledAntSlider = styled(AntSlider)`
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
    ${props => props.noMargin ? 'margin: 0;' : ''}

`;

const ThemedAntSlider = styled(StyledAntSlider)`
    .ant-slider-mark {
        top: -21px;
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
        width: 2px;
        top: 0px;
        height: ${props => props.useThick ? thick : normal}px;
    }
`;

const getThemedStyle = (theme, vertical, useThick) => {
    const width = vertical ? 'height' : 'width';
    const height = vertical ?  'width' : 'height';
    const size = useThick ? thick : normal;
    return {
        track: {
            [height]: `${size}px`,
            backgroundColor: theme.getButtonHoverColor()
        },
        rail: {
            [height]: `${size}px`,
            backgroundColor: theme.getTextColor()
        },
        handle: {
            backgroundColor: theme.getButtonHoverColor(),
            [width]: '8px',
            [height]: `${size + handler}px`,
            top: '-2px',
            borderRadius: '6px',
            border: 'solid 1px #3c3c3c'
        }
    };
};

export const Slider = ({ theme, useThick, vertical, ...props }) => {
    if (theme) {
        const helper = getNavigationTheme(theme);
        const style = getThemedStyle(helper, vertical, useThick);
        return <ThemedAntSlider styles={style} theme={helper} useThick={useThick} {...props} />
    }
    return <StyledAntSlider styles={style} vertical= {vertical} {...props} />
};
