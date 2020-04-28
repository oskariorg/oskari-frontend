import React from 'react';
import PropTypes from 'prop-types';
import AntSpin from 'antd/es/spin';
import 'antd/es/spin/style/index.js';

export const Spin = ({ children, ...other }) => (
    <AntSpin {...other}>{children}</AntSpin>
);

Spin.propTypes = {
    children: PropTypes.any
};
