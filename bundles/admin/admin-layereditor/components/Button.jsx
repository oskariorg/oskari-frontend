import React from 'react';
import PropTypes from 'prop-types';
import AntButton from 'antd/lib/button';
import 'antd/lib/button/style/css';

export const Button = (props) => (
    <AntButton {...props}>{props.children}</AntButton>
);

Button.propTypes = {
    children: PropTypes.any
};
