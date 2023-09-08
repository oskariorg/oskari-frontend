import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntTabs } from 'antd';
import 'antd/es/tabs/style/index.js';

// Note! There's CSS related to this under
//  oskari-frontend/resources/css/portal.css
//  to fix flickering on Firefox
export const Tabs = ({ children, ...other }) => (
    <AntTabs {...other}>
        {children}
    </AntTabs>
);

Tabs.propTypes = {
    children: PropTypes.any
};
