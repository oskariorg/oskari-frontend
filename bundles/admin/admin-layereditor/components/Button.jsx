import React from 'react';
import PropTypes from 'prop-types';
import Button from 'antd/lib/button';
import 'antd/lib/button/style/css';

const ButtonComponent = (props) => {
    return (
        <Button {...props}>{props.children}</Button>
    );
};

ButtonComponent.propTypes = {
    children: PropTypes.any
};

export default ButtonComponent;

