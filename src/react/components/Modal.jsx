import React from 'react';
import PropTypes from 'prop-types';
import { Modal as AntModal } from 'antd';
import 'antd/es/modal/style/index.js';

export const Modal = ({ children, bodyStyle={}, ...other }) => {
    // try keeping the modal height lower than the usable window height
    // so we don't overflow from the page
    const defaultBodyStyle = {
        'maxHeight': (window.innerHeight - 200) + 'px',
        'overflow': 'auto'
    };
    return (
        <AntModal zIndex={ 55500 } bodyStyle={{
            ...defaultBodyStyle,
            ...bodyStyle
        }} {...other}>
            {children}
        </AntModal>
    );
};

Modal.propTypes = {
    children: PropTypes.any
};
