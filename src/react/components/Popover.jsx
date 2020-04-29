import React from 'react';
import PropTypes from 'prop-types';
import AntPopover from 'antd/es/popover';
import 'antd/es/popover/style/index.js';

export const Popover = ({ children, ...other }) => (
    <AntPopover {...other}>{children}</AntPopover>
);

Popover.propTypes = {
    children: PropTypes.any
};
