
import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Collapse, Confirm, CollapsePanel, List, ListItem, Message, Tooltip, Switch } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Layer } from './Layer/';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import styled from 'styled-components';
import Style from 'ol/style/Style';

const StyledCollapse = styled(Collapse)`
    border-radius: 0 !important;
    &>div {
        border-radius: 0 !important;
        &:last-child {
            padding-bottom: 2px;
        }
    };
`;

const Label = styled('label')`
    display: flex;
    align-items: center;
    cursor: pointer;
    > div {
        margin-left: 8px;
    }
`;

const StyledSubCollapse = styled(Collapse)`
    border-radius: 0 !important;
    &>div {
        border-radius: 0 !important;
        &:last-child {
            padding-bottom: 2px;
        }
    };
    margin-left: 25px !important ;
`;

const StyledCollapsePanel = styled(CollapsePanel)`
    & > div:first-child {
        min-height: 22px;
    };
    padding-left: 10px;
`;

const StyledSubCollapsePanel = styled(CollapsePanel)`
    & > div:first-child {
        min-height: 22px;
    };
    padding-left: 10px;
`;

const StyledListItem = styled(ListItem)`
    padding: 0 !important;
    display: block !important;
    &:first-child > div {
        padding-top: 10px;
    }
    &:last-child > div {
        padding-bottom: 10px;
    }
`;

const StyledEditGroup = styled.span`
    padding-right: 20px;
    padding-bottom: 1px;
`;

const RenderLayer = ({ model, even, selected, controller, innerRef, draggableProps, dragHandleProps }) => {
    const itemProps = { model, even, selected, controller };
    return (
            <div ref={innerRef} {...draggableProps} {...dragHandleProps}>
                <StyledListItem>
                    <Layer key={model.getId()}  {...itemProps} />
                </StyledListItem>
            </div>
    );
};
RenderLayer.propTypes = {
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

const selectGroup = (event, checked, group, controller) => {
    !checked ? controller.addGroup(group) : controller.removeGroup(group);
    event.stopPropagation();

}

const deactivateGroup = (event, group, controller) => {
    controller.deactivateGroup(group);
    event.stopPropagation();

}

const onSelect = (event, checked, group, controller) => { 
    if(checked) {
        if (!controller.showWarn(group)) {
           event.stopPropagation();
           return;
        } else {
            selectGroup(event, !checked, group, controller);
        }
    } else {
        selectGroup(event, !checked, group, controller);
    }
};


const onDragEnd = result => {/*
    
}



const SubCollapsePanel = ({ active, group, selectedLayerIds, selectedGroupIds, controller, showWarn, warnActive, propsNeededForPanel, innerRef, draggableProps, dragHandleProps }) => {
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
            <StyledSubCollapsePanel {...propsNeededForPanel}
                header={group.getTitle()}
                showArrow
                //showArrow={group.getLayers().length > 0}
                extra={
                    <React.Fragment>
                            <Confirm
                                title={<Message messageKey='grouping.manyLayersWarn'/>}
                                visible={warnActive}
                                onConfirm={(event) => selectGroup(event, active, group, controller)}
                                onCancel={(event) => deactivateGroup(event, group, controller)}
                                okText={<Message messageKey='yes'/>}
                                cancelText={<Message messageKey='cancel'/>}
                                placement='top'
                                popupStyle={{zIndex: '999999'}}
                            >
                                <Switch size="small" checked={active}
                                onChange={(checked, event) => onSelect(event, checked, group, controller)} />
                            </Confirm>
                        {
                            group.isEditable() && group.getTools().filter(t => t.getTypes().includes(group.groupMethod)).map((tool, i) =>
                                <Tooltip title={tool.getTooltip()} key={`${tool.getName()}_${i}`}>
                                    <StyledEditGroup className={tool.getIconCls()} onClick={(event) =>
                                        onToolClick(event, tool, group)} />
                                </Tooltip>
                            )
                        }
                        <Badge inversed={true} count={badgeText} />
                    </React.Fragment>
                }>
                
                <DragDropContext onDragEnd={onDragEnd()}>

                {layerRows.length > 0 && 
                    <Droppable droppableId="layers">
                        {(provided) => (

                        <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        >
                            <List 
                            bordered={false} 
                            dataSource={layerRows} 
                            renderItem={(item, index) => (
                                <Draggable
                                key={item.id}
                                draggableId={`${item.id}`}
                                index={index}
                                >
                                    {(provided) => (
                                    <RenderLayer 
                                    innerRef={provided.innerRef}
                                    model={item.model} 
                                    even={item.even} 
                                    selected={item.selected} 
                                    controller={item.controller}
                                    draggableProps={provided.draggableProps}
                                    dragHandleProps={provided.dragHandleProps}/>
                                )}

                                </Draggable>
                            )} >
                            </List>
                            {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                }
                </DragDropContext>
                {group.getGroups().map(subgroup => {
                    const layerIds = subgroup.getLayers().map(lyr => lyr.getId());
                    const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));
                    
                    let activeGroup = false;
                    if (layerIds.length > 0 && selectedLayersInGroup.length == layerIds.length) {
                        activeGroup = true;
                        console.log(active);
                    }
                    const warnActive = showWarn.includes(subgroup.id);
                return(
                    <SubCollapsePanel key={subgroup.id} active={activeGroup} group={subgroup} selectedLayerIds={selectedLayerIds} selectedGroupIds={selectedGroupIds} controller={controller} showWarn={showWarn} warnActive={warnActive} propsNeededForPanel={propsNeededForPanel}/>);

            }
            )}
            </StyledSubCollapsePanel>
        </StyledSubCollapse>
    );
};


const LayerCollapsePanel = (props) => {
    const { active, group, selectedLayerIds, selectedGroupIds, controller, showWarn, warnActive, ...propsNeededForPanel } = props;

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
            showArrow={layerRows.length > 0}
            extra={
                <React.Fragment>
                <Confirm
                    title={<Message messageKey='grouping.manyLayersWarn'/>}
                    visible={warnActive}
                    onConfirm={(event) => selectGroup(event, active, group, controller)}
                    onCancel={(event) => deactivateGroup(event, group, controller)}
                    okText={<Message messageKey='yes'/>}
                    cancelText={<Message messageKey='cancel'/>}
                    placement='top'
                    popupStyle={{zIndex: '999999'}}
                >
                    <Switch size="small" checked={active}
                    onChange={(checked, event) => onSelect(event, checked, group, controller)} />
                </Confirm>
                    {
                        group.isEditable() && group.getTools().filter(t => t.getTypes().includes(group.groupMethod)).map((tool, i) =>
                            <Tooltip title={tool.getTooltip()} key={`${tool.getName()}_${i}`}>
                                <StyledEditGroup className={tool.getIconCls()} onClick={(event) =>
                                    onToolClick(event, tool, group)} />
                            </Tooltip>
                        )
                    }
                    <Badge inversed={true} count={badgeText} />

                </React.Fragment>
            }>
            <DragDropContext onDragEnd={onDragEnd()}>

                {layerRows.length > 0 && 
                    <Droppable droppableId="layers">
                        {(provided) => (

                        <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        >
                            <List 
                            bordered={false} 
                            dataSource={layerRows} 
                            renderItem={(item, index) => (
                                <Draggable
                                key={item.id}
                                draggableId={`${item.id}`}
                                index={index}
                                >
                                    {(provided) => (
                                    <RenderLayer 
                                    innerRef={provided.innerRef}
                                    model={item.model} 
                                    even={item.even} 
                                    selected={item.selected} 
                                    controller={item.controller}
                                    draggableProps={provided.draggableProps}
                                    dragHandleProps={provided.dragHandleProps}/>
                                  )}

                                </Draggable>
                            )} >
                            </List>
                            {provided.placeholder}
                        </div>
                    )}
                    </Droppable>
                }
            </DragDropContext>
 
            {group.getGroups().map(subgroup => {
                    const layerIds = subgroup.getLayers().map(lyr => lyr.getId());
                    const selectedLayersInGroup = selectedLayerIds.filter(id => layerIds.includes(id));
                    
                    let activeGroup = false;
                    if (layerIds.length > 0 && selectedLayersInGroup.length == layerIds.length) {
                        activeGroup = true;
                        console.log(active);
                    }
                const warnActive = showWarn.includes(subgroup.id);
                return(
                    <SubCollapsePanel key={subgroup.id} active={activeGroup} group={subgroup} selectedLayerIds={selectedLayerIds} selectedGroupIds={selectedGroupIds} controller={controller} showWarn={showWarn} warnActive={warnActive} propsNeededForPanel={propsNeededForPanel}/>);

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
