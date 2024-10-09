import React from 'react';
import { Slider as AntSlider } from 'antd';
import styled from 'styled-components';
import { getNavigationTheme } from 'oskari-ui/theme';

const normal = 4;
const thick = 8;
const handler = 12;

// TODO colors should come from theme-variables
const StyledAntSlider = styled(AntSlider)`
    &.ant-slider-vertical {
        .ant-slider-handle {
            margin-bottom: 0;
        }
        .ant-slider-mark {
            top: 2px;
        }
    }
`;
const ThemedAntSlider = styled(StyledAntSlider)`
    .ant-slider-mark {
        top: -21px;
    }
    .ant-slider-mark-text {
        color: ${props => props.theme.getTextColor()};
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
            background: theme.getButtonHoverColor()
        },
        rail: {
            [height]: `${size}px`,
            background: theme.getTextColor()
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
        const styles = getThemedStyle(helper, vertical, useThick);
        return <ThemedAntSlider styles={styles} theme={helper} useThick={useThick} {...props} />
    }
    return <StyledAntSlider {...props} />
};
