import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';
import 'antd/es/button/style/index.js';

export const Button = ({ children, className, ...other }) => {
    let modifiedClass = className || '';
    if (!modifiedClass.includes('t_button')) {
        modifiedClass = 't_button ' + className;
    }
    return (<AntButton className={modifiedClass} {...other}>{children}</AntButton>);
};

Button.propTypes = {
    children: PropTypes.any
};
