import React from 'react';
import PropTypes from 'prop-types';
import AntButton from 'antd/lib/button';
import 'antd/lib/button/style/css';

export const Button = (props) => {
    const {text, ...other} = props;
    return (
        <AntButton {...other}>{text}</AntButton>
    );
};

Button.propTypes = {
    text: PropTypes.string
};
