import React from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'oskari-ui';
import styled from 'styled-components';
import { getHeaderTheme } from 'oskari-ui/theme/ThemeHelper';
import { FEATUREDATA_WFS_STATUS } from './FeatureDataContainer';

const theme = getHeaderTheme(Oskari.app.getTheming().getTheme());

const TabLoadingContainer = styled('div')`
    color: ${theme.getTextColor()}
`;

const SpinnerContainer = styled('span')`
    padding-left: 1.5em;
`;

const TabLoadingTitle = (props) => {
    const { title } = props;
    return <TabLoadingContainer>
        {title}
        <SpinnerContainer>
            <Spin></Spin>
        </SpinnerContainer>
    </TabLoadingContainer>;
};

TabLoadingTitle.propTypes = {
    title: PropTypes.any
};

const TabErrorTitle = styled('div')`
    color: red;
`;

const TabTitleContainer = styled('div')`
    color: ${theme.getTextColor()}
`;

export const TabTitle = (props) => {
    const { status, title } = props;

    if (status) {
        if (status === FEATUREDATA_WFS_STATUS.loading) {
            return <TabLoadingTitle title={title}/>;
        }

        if (status === FEATUREDATA_WFS_STATUS.error) {
            return <TabErrorTitle>{title}</TabErrorTitle>;
        }
    }

    return <TabTitleContainer>{title}</TabTitleContainer>;
};

TabTitle.propTypes = {
    title: PropTypes.any,
    status: PropTypes.string
};
