import React from 'react';
import PropTypes from 'prop-types';
import AntTabs from 'antd/es/tabs';
import 'antd/es/tabs/style/index.js';

const AntTabPane = AntTabs.TabPane;

export const Tabs = ({ children, ...other }) => (
    <AntTabs {...other}>
        {children}
    </AntTabs>
);

export const TabPane = ({ children, ...other }) => (
    <AntTabPane {...other}>
        {children}
    </AntTabPane>
);

Tabs.propTypes = {
    children: PropTypes.any
};

TabPane.propTypes = {
    children: PropTypes.any
};
