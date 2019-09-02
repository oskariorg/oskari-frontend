import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntTabs } from 'antd';
import 'antd/es/tabs/style/';

const AntTabPane = AntTabs.TabPane;

export const Tabs = ({children, ...other}) => (
    <AntTabs {...other}>
        {children}
    </AntTabs>
);

export const TabPane = ({children, ...other}) => (
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
