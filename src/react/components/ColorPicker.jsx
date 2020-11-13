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
        outline-color: #ffd400;
    }
`;

export class ColorPicker extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <StyledColorPicker type='color' />
        );
    }
}