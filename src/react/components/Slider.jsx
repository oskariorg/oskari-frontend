import React from 'react';
import { Slider as AntSlider } from 'antd';
import styled from 'styled-components';
import 'antd/es/slider/style/index.js';

// TODO colors should come from theme-variables
const StyledAntSlider = styled(AntSlider)`
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
