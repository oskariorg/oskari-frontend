import React from 'react';
import PropTypes from 'prop-types';
import { Collapse as AntCollapse } from 'antd';
import styled from 'styled-components';
import 'antd/es/collapse/style/';

// Collapse component passes some extra properties to its panels.
// When creating a custom Panel, those properties have to be carried.
// See usage example in bundles/framework/layerlist/view/LayerCollapse.jsx
export const Collapse = ({ children, ...other }) => (
    <AntCollapse {...other}>
        {children}
    </AntCollapse>
);

const StyledPanel = styled(AntCollapse.Panel)`
    & .ant-collapse-content-box {
        padding: 0;
        margin: 0;
    }
    & .ant-collapse-content {
        width: 100%;
    }
`;
export const Panel = ({ children, ...other }) => (
    <StyledPanel {...other}>
        {children}
    </StyledPanel>
);

Collapse.propTypes = {
    children: PropTypes.any
};

Panel.propTypes = {
    children: PropTypes.any
};
