import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';

export const ButtonComponent = (props) => {
    const {text, ...other} = props;
    return (
        <Button {...other}>{text}</Button>
    );
};

ButtonComponent.propTypes = {
    text: PropTypes.string
};
