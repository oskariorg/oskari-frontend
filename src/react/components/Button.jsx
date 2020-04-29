import React from 'react';
import PropTypes from 'prop-types';
import AntButton from 'antd/es/button';
import 'antd/es/button/style/index.js';

export const Button = ({ children, ...other }) => (
    <AntButton {...other}>{children}</AntButton>
);

Button.propTypes = {
    children: PropTypes.any
};
