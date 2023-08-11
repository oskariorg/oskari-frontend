import React from 'react';
import styled from 'styled-components';
import { Switch as AntSwitch } from 'antd';
import 'antd/es/switch/style/index.js';

const Label = styled.label`
    display: flex;
    & button {
        margin-right: 10px;
    }
`;

export const Switch = ({ label, ...props }) => {
    if (label) {
        return (
            <Label>
                <AntSwitch {...props}/>
                {label}
            </Label>
        );
    }
    return (
        <AntSwitch {...props}/>
    );
};
