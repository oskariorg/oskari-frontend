import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as AntCollapse } from 'antd';
import 'antd/es/collapse/style/';

// Collapse component passes some extra properties to its panels.
// When creating a custom Panel, those properties have to be carried.
// See usage example in bundles/framework/layerlist/view/LayerCollapse.jsx
export const Collapse = ({ children, ...other }) => (
    <AntCollapse {...other}>
        {children}
    </AntCollapse>
);

export const Panel = ({ children, ...other }) => (
    <AntCollapse.Panel {...other}>
        {children}
    </AntCollapse.Panel>
);

Collapse.propTypes = {
    children: PropTypes.any
};

Panel.propTypes = {
    children: PropTypes.any
};
