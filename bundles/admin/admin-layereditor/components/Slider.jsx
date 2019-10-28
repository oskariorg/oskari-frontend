import React from 'react';
import { Slider as AntSlider } from 'antd';
import styled from 'styled-components';
import 'antd/es/slider/style/index.js';

const StyledAntSlider = styled(AntSlider)`
    .ant-slider-track {
        background-color: #0091ff;
    }
    .ant-slider-handle {
        border: #0091ff solid 2px;
    }
    .ant-slider:hover .ant-slider-track {
        background-color: #0091ff;
    }
    .ant-slider:hover .ant-slider-handle {
        border: #0091ff solid 2px;
    }
`;

export const Slider = (props) => (
    <StyledAntSlider {...props} />
);
