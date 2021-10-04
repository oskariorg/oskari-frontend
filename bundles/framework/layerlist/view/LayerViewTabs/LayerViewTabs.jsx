import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { shapes } from './propTypes';
import styled from 'styled-components';
import { Tabs, TabPane, Message } from 'oskari-ui';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { LayerList } from './LayerList/';
import { SelectedLayers, SelectedTab } from './SelectedLayers/';
import { TABS_ALL_LAYERS, TABS_SELECTED_LAYERS } from '.';

const TAB_CHANGE_UI_UPDATE_MS = 200;

const StyledTabs = styled(Tabs)`
    max-width: 600px;
    width: -moz-fit-content; // without this vendor prefix layerlist scrollbar doesn't have enough space and cuts content
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

const LayerViewTabs = ({ tab, layerList, selectedLayers, autoFocusSearch, opts, controller }) => {
    // NOT sure why search would not focus when rendered and the ref/focus code could be inside LayerList-component?
    // The effect should be that when that tab is shown we focus on the search
    const searchTermInputRef = useRef(null);
    useEffect(() => {
        if (autoFocusSearch) {
            focus(searchTermInputRef);
        }
    });
    const onChange = tabKey => {
        controller.setTab(tabKey);
        if (tabKey !== TABS_ALL_LAYERS) {
            return;
        }
        // focus won't work if element is not visible (animation takes some time)
        setTimeout(() => focus(searchTermInputRef), TAB_CHANGE_UI_UPDATE_MS);
    };
    return (
        <ControlledTabs tabPosition='top' tab={tab} onChange={onChange}>
            <TabPane
                key={TABS_ALL_LAYERS}
                tab={<Message messageKey='tabs.layerList' />}
            >
                <LayerList ref={searchTermInputRef} opts={opts} {...layerList.state} controller={layerList.controller} />
            </TabPane>
            <TabPane
                key={TABS_SELECTED_LAYERS}
                tab={
                    // The initial render causes the badge to blink.
                    // When the key changes, React creates a new instance of the component and the blinking starts again.
                    <SelectedTab
                        key={selectedLayers.state.layers.length}
                        num={selectedLayers.state.layers.length}
                        messageKey='tabs.selectedLayers'/>
                }>
                <SelectedLayers {...selectedLayers.state} controller={selectedLayers.controller}/>
            </TabPane>
        </ControlledTabs>
    );
};

LayerViewTabs.propTypes = {
    layerList: shapes.stateful.isRequired,
    selectedLayers: shapes.stateful.isRequired,
    tab: PropTypes.string,
    opts: PropTypes.object,
    autoFocusSearch: PropTypes.bool,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const contextWrap = LocaleConsumer(LayerViewTabs);
export { contextWrap as LayerViewTabs };
