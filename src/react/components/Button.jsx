import React from 'react';
import PropTypes from 'prop-types';
import { Button as AntButton } from 'antd';

export const Button = ({ children, className, loading = false, ...other }) => {
    let modifiedClass = className || '';
    if (!modifiedClass.includes('t_button')) {
        modifiedClass = 't_button ' + className;
    }
    return (<AntButton className={modifiedClass} loading={loading} {...other}>{children}</AntButton>);
};

Button.propTypes = {
    children: PropTypes.any
};
