import React from 'react';
import PropTypes from 'prop-types';
import { Modal as AntModal } from 'antd';
import 'antd/es/modal/style/index.js';

export const Modal = ({ children, title, bodyStyle={}, ...other }) => {
    // try keeping the modal height lower than the usable window height
    // so we don't overflow from the page
    let spaceLimit = 200;
    if (title) {
        spaceLimit +=50;
    }
    const defaultBodyStyle = {
        'maxHeight': (window.innerHeight - spaceLimit) + 'px',
        'overflow': 'auto'
    };
    return (
        <AntModal zIndex={ 30005 } title={title} bodyStyle={{
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
