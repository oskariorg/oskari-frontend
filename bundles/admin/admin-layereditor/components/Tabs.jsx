import React from 'react';
import PropTypes from 'prop-types';
import AntTabs from 'antd/lib/tabs';
import 'antd/lib/tabs/style/css';

const AntTabPane = AntTabs.TabPane;

export const Tabs = (props) => {
    const {tabPanes, ...other} = props;
    return (
        <AntTabs {...other}>
            {tabPanes.map((pane, key) => (
                <AntTabPane {...pane} key={key}>{pane.content}</AntTabPane>
            ))}
        </AntTabs>
    );
};

Tabs.propTypes = {
    tabPanes: PropTypes.array
};
