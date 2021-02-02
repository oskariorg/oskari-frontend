import React from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from 'antd';
import 'antd/es/popconfirm/style/index.js';

// NOTE! z-index is overridden in resources/css/portal.css
// Without the override the confirm is shown behind flyouts (for example in admin)

export const Confirm = ({ children, ...other }) => (
    <Popconfirm {...other}>{children}</Popconfirm>
);

Confirm.propTypes = {
    children: PropTypes.any
};
