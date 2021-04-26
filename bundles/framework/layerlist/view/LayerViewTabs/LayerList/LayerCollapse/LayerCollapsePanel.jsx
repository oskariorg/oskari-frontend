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
const PanelToolContainer = ({group, layerCount, allLayersOnMap, controller}) => {
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
};
/* ----- /Group tools ------------- */

/* ----- Layer list ------ */
const StyledListItem = styled(ListItem)`
    padding: 0 !important;
    display: block !important;
`;

const renderLayer = ({ model, even, selected, controller }) => {
    const itemProps = { model, even, selected, controller };
    return (
        <StyledListItem>
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
            <StyledSubCollapse key={group.id}>
                <LayerCollapsePanel
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
const StyledCollapsePanel = styled(CollapsePanel)`
    & > div:first-child {
        min-height: 22px;
    };
`;

const getLayerRowModels = (layers = [], selectedLayerIds = [], controller) => {
    return layers.map((oskariLayer, index) => {
        return {
            id: oskariLayer.getId(),
            model: oskariLayer,
            even: index % 2 === 0,
            selected: selectedLayerIds.includes(oskariLayer.getId()),
            controller
        };
    });
};

const LayerCollapsePanel = (props) => {
    const { active, group, selectedLayerIds, controller, ...propsNeededForPanel } = props;
    const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller);
    return (
        <StyledCollapsePanel {...propsNeededForPanel} 
            header={group.getTitle()}
            extra={
                <PanelToolContainer
                    group={group}
                    layerCount={layerRows.length}
                    controller={controller}
                    allLayersOnMap={active} />
            }>
                <SubGroupList
                    subgroups={group.getGroups()}
                    selectedLayerIds={selectedLayerIds}
                    controller={controller}
                    propsNeededForPanel={propsNeededForPanel} />
                <LayerList
                    layers={layerRows} />
        </StyledCollapsePanel>
    );
};


LayerCollapsePanel.propTypes = {
    group: PropTypes.any.isRequired,
    selectedLayerIds: PropTypes.array.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const comparisonFn = (prevProps, nextProps) => {
    // expandIcon is something the parent component adds as a context
    const ignored = ['expandIcon'];
    const arrayChildCheck = ['selectedLayerIds'];
    let useMemoized = true;
    Object.getOwnPropertyNames(nextProps).forEach(name => {
        if (ignored.includes(name)) {
            return;
        }
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
const memoized = React.memo(LayerCollapsePanel, comparisonFn);
export { memoized as LayerCollapsePanel };
