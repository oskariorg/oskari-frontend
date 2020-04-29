import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';
import 'antd/es/popconfirm/style/index.js';

export const Confirm = ({ children, ...other }) => (
    <Popconfirm {...other}>{children}</Popconfirm>
);

Confirm.propTypes = {
    children: PropTypes.any
};
