import React from 'react';
import PropTypes from 'prop-types';
import { Popover as AntPopover } from 'antd';

export const Popover = ({ children, ...other }) => (
    <AntPopover {...other}>{children}</AntPopover>
);

Popover.propTypes = {
    children: PropTypes.any
};
