import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntTabs } from 'antd';
import 'antd/es/tabs/style/index.js';

export const Tabs = ({ children, ...other }) => (
    <AntTabs {...other}>
        {children}
    </AntTabs>
);

Tabs.propTypes = {
    children: PropTypes.any
};
