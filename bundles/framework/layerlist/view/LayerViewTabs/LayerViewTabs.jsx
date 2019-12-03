import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { shapes } from './propTypes';
import styled from 'styled-components';
import { Tabs, TabPane } from 'oskari-ui';
import { Mutator, withMutator, withLocale } from 'oskari-ui/util';
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

const LayerViewTabs = ({ tab, layerList, selectedLayers, autoFocusSearch, mutator, Message }) => {
    const searchTermInputRef = useRef(null);
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
            <TabPane
                key={TABS_ALL_LAYERS}
                tab={<Message messageKey='tabs.layerList' />}
            >
                <LayerList ref={searchTermInputRef} {...layerList.state} mutator={layerList.mutator} />
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
                <SelectedLayers {...selectedLayers.state} mutator={selectedLayers.mutator}/>
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
    Message: PropTypes.elementType.isRequired
};

const contextWrap = withMutator(withLocale(LayerViewTabs));
export { contextWrap as LayerViewTabs };
