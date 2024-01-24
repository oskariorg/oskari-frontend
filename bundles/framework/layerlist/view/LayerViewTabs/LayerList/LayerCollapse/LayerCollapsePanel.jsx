import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'oskari-ui';
import { Controller, ErrorBoundary } from 'oskari-ui/util';
import { Layer } from './Layer/';
import { SubGroupList } from './SubGroupList';
import styled from 'styled-components';

/* ----- Layer list ------ */
// Without this wrapper used here the "even" prop would be passed to "ListItem" that would generate an error
// After we update to styled-components version 5.1 we could use "transient" props instead:
// $-prefixed props are "transient" in styled-comps: https://github.com/styled-components/styled-components/pull/2093
const StyledListItem = styled(({ even, ...rest }) => <ListItem {...rest}/>)`
    background-color: ${props => props.even ? '#ffffff' : '#f3f3f3'};
    padding: 0 !important;
    display: block !important;
`;

const renderLayer = (itemProps, index) => {
    return (
        <StyledListItem key={itemProps.id} even={index % 2 === 0}>
            <Layer {...itemProps} />
        </StyledListItem>
    );
};

const LayerList = ({ layers }) => {
    if (!layers?.length) {
        // no layers
        // return <div>No data</div>;
        return null;
    }
    return (
        <List bordered={false} dataSource={layers} renderItem={renderLayer} />
    );
};
LayerList.propTypes = {
    layers: PropTypes.array.isRequired
};
/* ----- /Layer list ------ */

/*  ----- Main component for LayerCollapsePanel ------ */
// ant-collapse-content-box will have the layer list and subgroup layer list.
//  Without padding 0 the subgroups will be padded twice
const StyledCollapsePanel = styled('div')`
    & > div:first-child {
        min-height: 22px;
    }
`;

const LayerCollapsePanel = (props) => {
    const { group, selectedLayerIds, layerRows, openGroupTitles, opts, controller, ...propsNeededForPanel } = props;
    // const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller, opts);
    // Note! Not rendering layerlist/subgroups when the panel is closed is a trade-off for performance
    //   between render as whole vs render when the panel is opened.
    const isPanelOpen = true; // propsNeededForPanel.isActive;

    return (
        <ErrorBoundary hide={true} debug={{ group, selectedLayerIds }}>
            { isPanelOpen && <StyledCollapsePanel>
                <SubGroupList
                    subgroups={group.getGroups()}
                    selectedLayerIds={selectedLayerIds}
                    opts={opts}
                    openGroupTitles={openGroupTitles}
                    controller={controller}
                    { ...propsNeededForPanel } />
                <LayerList layers={layerRows} />
            </StyledCollapsePanel>
            }
        </ErrorBoundary>
    );
};

LayerCollapsePanel.propTypes = {
    group: PropTypes.any.isRequired,
    selectedLayerIds: PropTypes.array.isRequired,
    openGroupTitles: PropTypes.array.isRequired,
    opts: PropTypes.object,
    controller: PropTypes.instanceOf(Controller).isRequired,
    layerRows: PropTypes.array
};
export { LayerCollapsePanel };
