import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, List, ListItem } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Layer } from './Layer/';
import { LayerCountBadge } from './LayerCountBadge';
import { AllLayersSwitch } from './AllLayersSwitch';
import { GroupToolRow } from './GroupToolRow';
import styled from 'styled-components';

/* ----- Group tools ------------- */
const StyledCollapsePanelTools = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
// Memoed based on layerCount, allLayersOnMap and group.unfilteredLayerCount
const PanelToolContainer = React.memo(({group, layerCount, allLayersOnMap, controller}) => {
    const toggleLayersOnMap = (addLayers) => {
        if (addLayers) {
            controller.addGroupLayersToMap(group);
        } else {
            controller.removeGroupLayersFromMap(group);
        }
    };
    return (
        <StyledCollapsePanelTools>
            <LayerCountBadge
                layerCount={layerCount}
                unfilteredLayerCount={group.unfilteredLayerCount} />
            <AllLayersSwitch
                checked={allLayersOnMap}
                layerCount={layerCount}
                onToggle={toggleLayersOnMap} />
            <GroupToolRow group={group} />
        </StyledCollapsePanelTools>
    );
}, (prevProps, nextProps) => {
    const propsToCheck = ['allLayersOnMap', 'layerCount'];
    const changed = propsToCheck.some(prop => prevProps[prop] !== nextProps[prop]);
    if (changed) {
        return false;
    }
    const unfilteredTypeChange = typeof prevProps.group.unfilteredLayerCount !== typeof nextProps.group.unfilteredLayerCount;
    const unfilteredCountChange = prevProps.group.unfilteredLayerCount !== nextProps.group.unfilteredLayerCount;
    return !unfilteredTypeChange || !unfilteredCountChange;
});
/* ----- /Group tools ------------- */

/* ----- Layer list ------ */
// Without this wrapper used here the "even" prop would be passed to "ListItem" that would generate an error
// After we update to styled-components version 5.1 we could use "transient" props instead:
// $-prefixed props are "transient" in styled-comps: https://github.com/styled-components/styled-components/pull/2093
const StyledListItem = styled(({ even, ...rest }) => <ListItem {...rest}/>)`
    background-color: ${props => props.even ? '#ffffff' : '#f3f3f3'};
    padding: 0 !important;
    display: block !important;
`;

const renderLayer = ({ model, selected, controller }, index) => {
    const itemProps = { model, selected, controller };
    return (
        <StyledListItem even={index % 2 === 0}>
            <Layer key={model.getId()}  {...itemProps} />
        </StyledListItem>
    );
};

const LayerList = ({ layers }) => {
    if (!layers.length) {
        // no layers
        return null;
    }
    return (
        <List bordered={false} dataSource={layers} renderItem={renderLayer} />
    );
};
/* ----- /Layer list ------ */

/* ----- Subgroup list ------ */
const StyledSubCollapse = styled(Collapse)`
    border: none;
    border-top: 1px solid #d9d9d9;
    padding-left: 15px !important;
`;
const SubGroupList = ({ subgroups = [], selectedLayerIds, controller, propsNeededForPanel }) => {
    if (!subgroups.length) {
        // no subgroups
        return null;
    }

    return subgroups.map(group => {
        const layerIds = group.getLayers().map(lyr => lyr.getId());
        const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));

        let allLayersOnMap = false;
        if (layerIds.length > 0 && selectedLayersInGroup.length == layerIds.length) {
            allLayersOnMap = true;
        }
        return (
            <StyledSubCollapse>
                <LayerCollapsePanel
                    key={group.id}
                    active={allLayersOnMap}
                    group={group}
                    selectedLayerIds={selectedLayerIds}
                    controller={controller}
                    propsNeededForPanel={propsNeededForPanel}
                />
            </StyledSubCollapse>
        );
    });
};
/* ----- /Subgroup list ------ */

/*  ----- Main component for LayerCollapsePanel ------ */
// ant-collapse-content-box will have the layer list and subgroup layer list. 
//  Without padding 0 the subgroups will be padded twice
const StyledCollapsePanel = styled(CollapsePanel)`
    > .ant-collapse-content > .ant-collapse-content-box {
        padding: 0px;
    }
    & > div:first-child {
        min-height: 22px;
    };
`;

const getLayerRowModels = (layers = [], selectedLayerIds = [], controller) => {
    return layers.map(oskariLayer => {
        return {
            id: oskariLayer.getId(),
            model: oskariLayer,
            selected: selectedLayerIds.includes(oskariLayer.getId()),
            controller
        };
    });
};

const LayerCollapsePanel = (props) => {
    const { active, group, selectedLayerIds, controller, ...propsNeededForPanel } = props;
    const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller);
    // set group switch active if all layers in group are selected
    const allLayersOnMap = layerRows.every(layer => selectedLayerIds.includes(layer.id));
    // Note! Not rendering layerlist/subgroups when the panel is closed is a trade-off for performance
    //   between render as whole vs render when the panel is opened.
    const isPanelOpen = propsNeededForPanel.isActive;
    return (
        <StyledCollapsePanel {...propsNeededForPanel} 
            header={group.getTitle()}
            extra={
                <PanelToolContainer
                    group={group}
                    layerCount={layerRows.length}
                    controller={controller}
                    allLayersOnMap={allLayersOnMap} />
            }>
                { isPanelOpen && <React.Fragment>
                    <SubGroupList
                        subgroups={group.getGroups()}
                        selectedLayerIds={selectedLayerIds}
                        controller={controller}
                        { ...propsNeededForPanel } />
                    <LayerList
                        layers={layerRows} />
                </React.Fragment>}
        </StyledCollapsePanel>
    );
};


LayerCollapsePanel.propTypes = {
    group: PropTypes.any.isRequired,
    selectedLayerIds: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
/*
const comparisonFn = (prevProps, nextProps) => {
    // expandIcon is something the parent component adds as a context
    const ignored = ['expandIcon'];
    const arrayChildCheck = ['selectedLayerIds'];
    let useMemoized = true;

    if (prevProps.group.getTitle() !== nextProps.group.getTitle()) {
        // re-render if name changes
        return false;
    }
    // check if layers have changed
    const prevLayers = prevProps.group.getLayers().map(lyr => lyr.getId());
    const nextLayers = nextProps.group.getLayers().map(lyr => lyr.getId());

    if (!Oskari.util.arraysEqual(prevLayers, nextLayers)) {
        return false;
    }
    // TODO: check if layer names have changed?
    // check if group contains selected layers/layers that have been removed from selected layers
    const prevLayersOnSelected = prevLayers.some(id => selectedLayerIds.includes(id));
    const nextLayersOnSelected = nextLayers.some(id => selectedLayerIds.includes(id));
    if (prevLayersOnSelected !== nextLayersOnSelected) {
        return false;
    }

    Object.getOwnPropertyNames(nextProps).forEach(name => {
        if (ignored.includes(name)) {
            return;
        }
        // TODO: check if layerids <> selectedlayerids change?
        if (arrayChildCheck.includes(name)) {
            if (!Oskari.util.arraysEqual(nextProps[name], prevProps[name])) {
                useMemoized = false;
            }
            return;
        }
        if (nextProps[name] !== prevProps[name]) {
            useMemoized = false;
        }
    });
    return useMemoized;
};
/*
const memoized = React.memo(LayerCollapsePanel, comparisonFn);
export { memoized as LayerCollapsePanel };
*/
export { LayerCollapsePanel };
