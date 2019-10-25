import React from 'react';
import PropTypes from 'prop-types';
import { shapes } from './propTypes';
import styled from 'styled-components';
import { Tabs, TabPane } from 'oskari-ui';
import { LayerList } from './LayerList/';

const StyledTabs = styled(Tabs)`
    max-width: 600px;
`;

const StyledBadge = styled.div`
    min-width: 20px;
    height: 20px;
    color: #000;
    background: #ffd400;
    border-radius: 4px;
    text-align: center;
    padding: 2px 8px;
    font-size: 12px;
    display: inline;
    line-height: 20px;
    margin-left: 5px;
    font-weight: 700;
`;

const SelectedTab = ({ num, text }) => {
    return (
        <span>
            {text}
            <StyledBadge>
                {num}
            </StyledBadge>
        </span>
    );
};

SelectedTab.propTypes = {
    num: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired
};

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
                <ul>
                    {layers.map((layer, i) => {
                        return (
                            <li key={i}>{layer.getName()}</li>
                        );
                    })}
                </ul>
            </TabPane>
        </StyledTabs>
    );
};

LayerViewTabs.propTypes = {
    layerList: shapes.stateful.isRequired,
    locale: PropTypes.shape({ tabs: PropTypes.object }).isRequired
};
