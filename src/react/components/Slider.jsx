import React from 'react';
import AntSlider from 'antd/es/slider';
import styled from 'styled-components';
import 'antd/es/slider/style/index.js';

// TODO colors should come from theme-variables
const StyledAntSlider = styled(AntSlider)`
    &.ant-slider-vertical {
        padding: 0;
        margin: 0;
        .ant-slider-handle {
            margin-bottom: 0;
            margin-left: -7px;
        } 
        .ant-slider-dot {
            width: 6px;
            height: 6px;
            left: 1px;
        }
        .ant-slider-mark {
            top: 2px;
        }
    }
    .ant-slider-track {
        background-color: #0091ff;
    }
    .ant-slider-handle {
        border: #0091ff solid 2px;
        margin-top: -6px;
    }
    &:hover .ant-slider-track {
        background-color: #003fc3 !important;
    }
    &:hover .ant-slider-handle {
        border: #003fc3 solid 2px !important;
    }
`;

export const Slider = (props) => (
    <StyledAntSlider {...props} />
);
