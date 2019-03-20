import React from 'react';
import styled from 'styled-components';
import AntSwitch from 'antd/lib/switch';
import 'antd/lib/switch/style/css';

const checkedColor = '#1890ff';
const uncheckedColor = 'rgba(0,0,0,.25)';
const StyledSwitch = styled(AntSwitch)`
    border: 1px solid transparent;
    background: ${props => props.checked ? checkedColor : uncheckedColor};
    &:hover:enabled {
        background: ${props => props.checked ? checkedColor : uncheckedColor};
    }
    &:focus {
        background: ${props => props.checked ? checkedColor : uncheckedColor};
    }
`;

export const Switch = props => <StyledSwitch {...props}/>;
Switch.propTypes = {};
