import React from 'react';
import { Slider as AntSlider } from 'antd';
import styled from 'styled-components';
import 'antd/es/slider/style/index.js';

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

export const Slider = (props) => (
    <StyledAntSlider {...props} />
);
