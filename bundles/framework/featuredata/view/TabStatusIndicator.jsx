import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'oskari-ui';
import styled from 'styled-components';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';

const theme = getHeaderTheme(Oskari.app.getTheming().getTheme());

const TabLoadingContainer = styled('div')`
    color: ${theme.getTextColor()}
`;

const SpinnerContainer = styled('span')`
    padding-left: 1.5em;
`;

export const TabTitle = styled('div')`
    color: ${theme.getTextColor()}
`;

export const TabLoadingTitle = (props) => {
    const { layer } = props;
    return <TabLoadingContainer>
        {layer.getName()}
        <SpinnerContainer>
            <Spin></Spin>
        </SpinnerContainer>
    </TabLoadingContainer>;
};

TabLoadingTitle.propTypes = {
    layer: PropTypes.any
};

TabTitle.propTypes = {
    layer: PropTypes.any
};

export const TabErrorTitle = styled('div')`
    color: red;
`;
