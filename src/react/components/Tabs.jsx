import React from 'react';
import PropTypes from 'prop-types';
import { Tabs as AntTabs } from 'antd';
import 'antd/es/tabs/style/index.js';
import styled from 'styled-components';

// Fixes flickering when tabs reach the right side of the container element AND a scrollbar is shown on the container
// The tabs flicker between showing the last tab name as whole and/or switching it to the "..." icon.
// This seems to only happen on the Firefox browser
const StyledTabs = styled(AntTabs)`
.ant-tabs-nav-wrap {
    padding-right: 2em;
}
`;
export const Tabs = ({ children, ...other }) => (
    <StyledTabs {...other}>
        {children}
    </StyledTabs>
);

Tabs.propTypes = {
    children: PropTypes.any
};
