import React from 'react';
import AntSwitch from 'antd/lib/switch';
import 'antd/lib/switch/style/css';
import styled from 'styled-components';

const StyledSwitch = styled(AntSwitch)`
    ${props => props.checked && 'background: #1890ff;'}
`;

export const Switch = props => <StyledSwitch {...props}/>;
Switch.propTypes = {};
