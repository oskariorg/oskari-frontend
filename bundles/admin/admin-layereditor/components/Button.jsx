import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';

export const Button = ({children, ...other}) => (
    <AntButton {...other}>{children}</AntButton>
);

Button.propTypes = {
    children: PropTypes.any
};
