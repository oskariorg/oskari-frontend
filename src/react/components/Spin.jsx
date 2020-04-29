import React from 'react';
import PropTypes from 'prop-types';
import { Spin as AntSpin } from 'antd';
import 'antd/es/spin/style/index.js';

export const Spin = ({ children, ...other }) => (
    <AntSpin {...other}>{children}</AntSpin>
);

Spin.propTypes = {
    children: PropTypes.any
};
