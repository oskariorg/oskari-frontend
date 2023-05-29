import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import 'antd/es/checkbox/style/index.js';
import styled from 'styled-components';

const StyledCheckbox = styled(AntCheckbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }
`;

export const Checkbox = (props) => (
    <StyledCheckbox {...props} />
);
