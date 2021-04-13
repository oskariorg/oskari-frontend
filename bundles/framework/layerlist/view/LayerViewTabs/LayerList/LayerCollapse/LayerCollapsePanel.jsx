
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Badge, Collapse, Confirm, CollapsePanel, List, ListItem, Message, Tooltip, Switch } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Layer } from './Layer/';
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
    min-width: 120px;
    display: flex;
    justify-content: space-between;
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

const selectGroup = (event, setVisible, checked, group, controller) => {
    setVisible(false);
    // if switch is checked, we add the groups layers to selected layers, if not, we remove all the layers from checked layers
    !checked ? controller.addGroupLayersToMap(group) : controller.removeGroupLayersFromMap(group); 
    event.stopPropagation();
}

const onGroupSelect = (event, setVisible, checked, group, controller) => { 
    // check if we need to show warning (over 10 layers inside the group)
    if(checked && group.layers.length > 10) {
        setVisible(true);
    } else {
        selectGroup(event, setVisible, !checked, group, controller);
    }
    event.stopPropagation();
};

const onCancel = (event, setVisible) => {
    setVisible(false);
    event.stopPropagation();
}


const SubCollapsePanel = ({ active, group, selectedLayerIds, controller, propsNeededForPanel }) => {

    const [visible, setVisible] = useState(false);
    const layerRows = group.getLayers().map((layer, index) => {
        const layerProps = {
            id: layer._id,
            model: layer,
            even: index % 2 === 0,
            selected: Array.isArray(selectedLayerIds) && selectedLayerIds.includes(layer.getId()),
            controller
        };
        return layerProps;
    });
    const badgeText = group.unfilteredLayerCount
        ? layerRows.length + ' / ' + group.unfilteredLayerCount
        : layerRows.length;

    return (
        <StyledSubCollapse>
            <StyledCollapsePanel {...propsNeededForPanel}
                header={group.getTitle()}
                extra={
                    <StyledCollapsePanelTools>
                            <Confirm
                                title={<Message messageKey='grouping.manyLayersWarn'/>}
                                visible={visible}
                                onConfirm={(event) => selectGroup(event, setVisible, active, group, controller)}
                                onCancel={(event) => onCancel(event, setVisible)}
                                okText={<Message messageKey='yes'/>}
                                cancelText={<Message messageKey='cancel'/>}
                                placement='top'
                                popupStyle={{zIndex: '999999'}}
                            >
                                <Switch size="small" checked={active}
                                    onChange={(checked, event) => onGroupSelect(event, setVisible, checked, group, controller)} />
                            </Confirm>
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
                        <Badge inversed={true} count={badgeText} />
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
    const [visible, setVisible] = useState(false);

    const layerRows = group.getLayers().map((layer, index) => {
        const layerProps = {
            id: layer._id,
            model: layer,
            even: index % 2 === 0,
            selected: Array.isArray(selectedLayerIds) && selectedLayerIds.includes(layer.getId()),
            controller
        };
        return layerProps;
    });
    
    const badgeText = group.unfilteredLayerCount
        ? layerRows.length + ' / ' + group.unfilteredLayerCount
        : layerRows.length;

    return (
        <StyledCollapsePanel {...propsNeededForPanel} 
            header={group.getTitle()}
            extra={
                <StyledCollapsePanelTools>
                    <Confirm
                        title={<Message messageKey='grouping.manyLayersWarn'/>}
                        visible={visible}
                        onConfirm={(event) => selectGroup(event, setVisible, active, group, controller)}
                        onCancel={(event) => onCancel(event, setVisible)}
                        okText={<Message messageKey='yes'/>}
                        cancelText={<Message messageKey='cancel'/>}
                        placement='top'
                        popupStyle={{zIndex: '999999'}}
                    >
                        <Switch
                            size="small"
                            checked={active}
                            onChange={(checked, event) => onGroupSelect(event, setVisible, checked, group, controller)}
                        />
                    </Confirm>
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
                    <Badge inversed={true} count={badgeText} />
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
