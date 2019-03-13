import React from 'react';
import PropTypes from 'prop-types';
import AntButton from 'antd/lib/button';
import 'antd/lib/button/style/css';

export const Button = ({children, ...other}) => (
    <AntButton {...other}>{children}</AntButton>
);

Button.propTypes = {
    children: PropTypes.any
};
