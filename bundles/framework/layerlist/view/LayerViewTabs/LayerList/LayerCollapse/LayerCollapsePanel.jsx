
import React from 'react';
import PropTypes from 'prop-types';
import { Collapse, CollapsePanel, List, ListItem, Tooltip } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Layer } from './Layer/';
import { LayerCountBadge } from './LayerCountBadge';
import { AllLayersSwitch } from './AllLayersSwitch';
import styled from 'styled-components';

const StyledSubCollapse = styled(Collapse)`
    border: none;
    border-top: 1px solid #d9d9d9;
    padding-left: 15px !important;
`;

const StyledCollapsePanel = styled(CollapsePanel)`
    & > div:first-child {
        min-height: 22px;
    };
`;

const StyledCollapsePanelTools = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

const StyledListItem = styled(ListItem)`
    padding: 0 !important;
    display: block !important;
`;

const StyledEditGroup = styled.span`
    padding-right: 5px;
`;



const renderLayer = ({ model, even, selected, controller }) => {
    const itemProps = { model, even, selected, controller };
    return (
            <StyledListItem>
                <Layer key={model.getId()}  {...itemProps} />
            </StyledListItem>
    );
};

renderLayer.propTypes = {
    model: PropTypes.any,
    even: PropTypes.any,
    selected: PropTypes.any,
    controller: PropTypes.any
};

const onToolClick = (event, tool, group) => {
    const id = group.getId();
    const parentId = group.getParentId();
    const groupMethod = group.getGroupMethod();
    const layerCountInGroup = group.getLayers().length;
    const cb = tool.getCallback();
    if (cb) {
        cb(event, id, groupMethod, layerCountInGroup, parentId);
    }
    // Prevent collapse open on tool icon click
    event.stopPropagation();
};


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

const SubCollapsePanel = ({ active, group, selectedLayerIds, controller, propsNeededForPanel }) => {

    const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller);
    const toggleLayersOnMap = (addLayers) => {
        if (addLayers) {
            controller.addGroupLayersToMap(group);
        } else {
            controller.removeGroupLayersFromMap(group);
        }
    };

    return (
        <StyledSubCollapse>
            <StyledCollapsePanel {...propsNeededForPanel}
                header={group.getTitle()}
                extra={
                    <StyledCollapsePanelTools>
                        <LayerCountBadge
                            layerCount={layerRows.length}
                            unfilteredLayerCount={group.unfilteredLayerCount} />
                        <AllLayersSwitch
                            checked={active}
                            layerCount={layerRows.length}
                            onToggle={toggleLayersOnMap} />
                        {
                            group.isEditable() && group.getTools().filter(t => t.getTypes().includes(group.groupMethod)).map((tool, i) =>
                                <Tooltip title={tool.getTooltip()} key={`${tool.getName()}_${i}`}>
                                <StyledEditGroup onClick={(event) =>
                                    onToolClick(event, tool, group)} >
                                    {tool.getIconComponent()}
                                </StyledEditGroup>
                                </Tooltip>
                            )
                        }
                    </StyledCollapsePanelTools>
                }>
                {layerRows.length > 0 && <List bordered={false} dataSource={layerRows} renderItem={renderLayer} />}
                {
                    group.getGroups().map(subgroup => {
                    const layerIds = subgroup.getLayers().map(lyr => lyr.getId());
                    const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));
                    
                    let activeGroup = false;
                    if (layerIds.length > 0 && selectedLayersInGroup.length == layerIds.length) {
                        activeGroup = true;
                    }
                    return (
                        <SubCollapsePanel
                            key={subgroup.id}
                            active={activeGroup}
                            group={subgroup}
                            selectedLayerIds={selectedLayerIds}
                            controller={controller}
                            propsNeededForPanel={propsNeededForPanel}
                        />
                    );
                    }
                )}
            </StyledCollapsePanel>
        </StyledSubCollapse>
    );
};


const LayerCollapsePanel = (props) => {
    const { active, group, selectedLayerIds, controller, ...propsNeededForPanel } = props;
    const layerRows = getLayerRowModels(group.getLayers(), selectedLayerIds, controller);
    const toggleLayersOnMap = (addLayers) => {
        if (addLayers) {
            controller.addGroupLayersToMap(group);
        } else {
            controller.removeGroupLayersFromMap(group);
        }
    };
    return (
        <StyledCollapsePanel {...propsNeededForPanel} 
            header={group.getTitle()}
            extra={
                <StyledCollapsePanelTools>
                    <LayerCountBadge
                        layerCount={layerRows.length}
                        unfilteredLayerCount={group.unfilteredLayerCount} />
                    <AllLayersSwitch
                        checked={active}
                        layerCount={layerRows.length}
                        onToggle={toggleLayersOnMap} />
                    {
                        group.isEditable() && group.getTools().filter(t => t.getTypes().includes(group.groupMethod)).map((tool, i) =>
                            <Tooltip title={tool.getTooltip()} key={`${tool.getName()}_${i}`}>
                            <StyledEditGroup onClick={(event) =>
                                onToolClick(event, tool, group)} >
                                {tool.getIconComponent()}
                            </StyledEditGroup>
                            </Tooltip>
                        )
                    }
                </StyledCollapsePanelTools>
            }>
            {layerRows.length > 0 && <List bordered={false} dataSource={layerRows} renderItem={renderLayer} /> }
            {
                group.getGroups().map(subgroup => {
                    const layerIds = subgroup.getLayers().map(lyr => lyr.getId());
                    const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));
                    
                    let activeGroup = false;
                    if (layerIds.length > 0 && selectedLayersInGroup.length == layerIds.length) {
                        activeGroup = true;
                    }
                    return (
                        <SubCollapsePanel
                            key={subgroup.id}
                            active={activeGroup}
                            group={subgroup}
                            selectedLayerIds={selectedLayerIds}
                            controller={controller}
                            propsNeededForPanel={propsNeededForPanel}
                        />
                    );
                }
            )}
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
