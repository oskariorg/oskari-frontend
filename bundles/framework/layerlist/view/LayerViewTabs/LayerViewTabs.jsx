import React from 'react';
import PropTypes from 'prop-types';
import { shapes } from './propTypes';
import styled from 'styled-components';
import { Tabs, TabPane } from 'oskari-ui';
import { LayerList } from './LayerList/';
import { SelectedLayers, SelectedTab } from './SelectedLayers/';

const StyledTabs = styled(Tabs)`
    max-width: 600px;
`;

export const LayerViewTabs = ({ layerList, locale }) => {
    const layerKey = 0;
    const selectedKey = 1;
    const layers = Oskari.getSandbox().findAllSelectedMapLayers();
    const numLayers = layers.length;
    const { tabs } = locale;
    return (
        <StyledTabs tabPosition='top'>
            <TabPane tab={tabs.layerList} key={layerKey}>
                <LayerList {...layerList.state} mutator={layerList.mutator} locale={locale} />
            </TabPane>
            <TabPane tab={<SelectedTab num={numLayers} text={tabs.selectedLayers} />} key={selectedKey}>
                <SelectedLayers layers={layers} />
            </TabPane>
        </StyledTabs>
    );
};

LayerViewTabs.propTypes = {
    layerList: shapes.stateful.isRequired,
    locale: PropTypes.shape({ tabs: PropTypes.object }).isRequired
};
