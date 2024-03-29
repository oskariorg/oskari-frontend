import React from 'react';
import { Checkbox as AntCheckbox } from 'antd';
import 'antd/es/checkbox/style/index.js';
import styled from 'styled-components';

const StyledCheckbox = styled(AntCheckbox)`
    + .ant-checkbox-wrapper {
        margin-left: 0;
    }

    .ant-checkbox {
        margin-bottom: auto;
    }
`;

export const Checkbox = (props) => (
    <StyledCheckbox {...props} />
);
