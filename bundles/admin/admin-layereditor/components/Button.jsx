import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button as AntButton } from 'antd';
import 'antd/es/button/style/index.js';

const Styled = styled(AntButton)`
    > .anticon {
        vertical-align: -0.125em;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
    }
`;

export const Button = ({ children, ...other }) => (
    <Styled {...other}>{children}</Styled>
);

Button.propTypes = {
    children: PropTypes.any
};
