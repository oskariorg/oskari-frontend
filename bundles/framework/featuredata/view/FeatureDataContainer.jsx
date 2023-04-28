import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'oskari-ui';
import styled from 'styled-components';

const ContainerDiv = styled('div')`
    padding: 1em
`;
export const FeatureDataContainer = ({ state }) => {
    const { tabs, controller, activeTab } = state;
    return (
        <ContainerDiv>
            <Tabs
                activeKey = { activeTab }
                items={ tabs }
                onChange={(key) => controller.setActiveTab(key)}/>
        </ContainerDiv>
    );
};

FeatureDataContainer.propTypes = {
    state: PropTypes.object
};
