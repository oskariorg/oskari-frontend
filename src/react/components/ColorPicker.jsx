import React from 'react';
import { Input } from 'antd';
import styled from 'styled-components';

const StyledColorPicker = styled(Input)`
    width: 50px;

    &:focus,
    &:hover {
        border-color: #ffd400;
    }

    &:focus {
        box-shadow: none;
        outline-color: #ffd400;
    }
`;

export const ColorPicker = (props) => {
    console.log(props);
    return (
        <StyledColorPicker type='color' { ...props } />
    );
}
