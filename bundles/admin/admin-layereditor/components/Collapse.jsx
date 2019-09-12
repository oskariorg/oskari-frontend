import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as AntCollapse } from 'antd';
import 'antd/es/collapse/style/';

const AntPanel = AntCollapse.Panel;

export const Collapse = ({children, ...other}) => (
    <AntCollapse {...other}>
        {children}
    </AntCollapse>
);

export const Panel = ({children, ...other}) => (
    <AntPanel {...other}>
        {children}
    </AntPanel>
);

Collapse.propTypes = {
    children: PropTypes.any
};

Panel.propTypes = {
    children: PropTypes.any
};
