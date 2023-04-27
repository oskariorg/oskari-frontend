import React from 'react';
import PropTypes from 'prop-types';
import { Tabs } from '../../../../src/react/components/Tabs';
import styled from 'styled-components';

const ContainerDiv = styled('div')`padding: 1em`;
export const FeatureDataContainer = ({ tabs, features }) => {
    return (
        <ContainerDiv>
            <Tabs items={tabs}/>
        </ContainerDiv>
    );
};

FeatureDataContainer.propTypes = {
    tabs: PropTypes.any,
    features: PropTypes.any
};
