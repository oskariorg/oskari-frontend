import React from 'react';
import PropTypes from 'prop-types';
import AntTabs from 'antd/lib/tabs';
import 'antd/lib/tabs/style/css';

const AntTabPane = AntTabs.TabPane;

export const TabPane = ({children, ...other}) => {
    return (
        <AntTabPane {...other}>
            {children}
        </AntTabPane>
    );
};

TabPane.propTypes = {
    children: PropTypes.any
};
