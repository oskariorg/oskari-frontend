import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { shapes } from './propTypes';
import styled from 'styled-components';
import { Tabs, TabPane } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { LayerList } from './LayerList/';
import { SelectedLayers, SelectedTab } from './SelectedLayers/';
import { TABS_ALL_LAYERS, TABS_SELECTED_LAYERS } from '.';

const TAB_CHANGE_UI_UPDATE_MS = 200;

const StyledTabs = styled(Tabs)`
    max-width: 600px;
`;

const ControlledTabs = ({ tab, ...rest }) => {
    if (tab) {
        return <StyledTabs activeKey={tab} {...rest} />;
    }
    return <StyledTabs defaultActiveKey={TABS_ALL_LAYERS} {...rest} />;
};
ControlledTabs.propTypes = {
    tab: PropTypes.string
};

const focus = ref => {
    if (ref.current) {
        ref.current.focus();
    }
};

export const LayerViewTabs = ({ tab, layerList, selectedLayers, autoFocusSearch, mutator, locale }) => {
    const searchTermInputRef = useRef(null);
    const { tabs } = locale;
    useEffect(() => {
        if (autoFocusSearch) {
            focus(searchTermInputRef);
        }
    });
    const onChange = tabKey => {
        mutator.setTab(tabKey);
        if (tabKey !== TABS_ALL_LAYERS) {
            return;
        }
        // focus won't work if element is not visible (animation takes some time)
        setTimeout(() => focus(searchTermInputRef), TAB_CHANGE_UI_UPDATE_MS);
    };
    return (
        <ControlledTabs tabPosition='top' tab={tab} onChange={onChange}>
            <TabPane tab={tabs.layerList} key={TABS_ALL_LAYERS}>
                <LayerList ref={searchTermInputRef} {...layerList.state} mutator={layerList.mutator} locale={locale} />
            </TabPane>
            <TabPane tab={<SelectedTab num={selectedLayers.state.layers.length} text={tabs.selectedLayers} />} key={TABS_SELECTED_LAYERS}>
                <SelectedLayers {...selectedLayers.state} locale={locale} mutator={selectedLayers.mutator}/>
            </TabPane>
        </ControlledTabs>
    );
};

LayerViewTabs.propTypes = {
    layerList: shapes.stateful.isRequired,
    selectedLayers: shapes.stateful.isRequired,
    tab: PropTypes.string,
    autoFocusSearch: PropTypes.bool,
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    locale: PropTypes.shape({ tabs: PropTypes.object }).isRequired
};
