
import React from 'react';
import PropTypes from 'prop-types';
import { Badge, Collapse, CollapsePanel, List, ListItem, Tooltip, Switch } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { Layer } from './Layer/';
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

const renderLayer = ({ model, even, selected, controller }) => {
    
    console.log(model);
    const itemProps = { model, even, selected, controller };
    return (
        <StyledListItem>
            <Layer key={model.getId()} {...itemProps} />
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

const SubCollapsePanel = ({ group, selectedLayerIds, controller, propsNeededForPanel }) => {
    const layerRows = group.getLayers().map((layer, index) => {
        const layerProps = {
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

    const text = `
        A dog is a type of domesticated animal.
        Known for its loyalty and faithfulness,
        it can be found as a welcome guest in many households across the world.
        `;

    return (
        <StyledSubCollapse>
            <StyledSubCollapsePanel {...propsNeededForPanel}
                header={group.getTitle()}
                showArrow
                //showArrow={group.getLayers().length > 0}
                extra={
                    <React.Fragment>
                        <Switch size="small" />
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
                {layerRows.length > 0 && <List bordered={false} dataSource={layerRows} renderItem={renderLayer} />}
                {group.getGroups().map(subgroup => {
                    return <SubCollapsePanel key={subgroup.id} group={subgroup} selectedLayerIds={selectedLayerIds} controller={controller} propsNeededForPanel={propsNeededForPanel} />
                })}
            </StyledSubCollapsePanel>
        </StyledSubCollapse>
    );
};


const LayerCollapsePanel = (props) => {
    const { group, subgroup, selectedLayerIds, controller, ...propsNeededForPanel } = props;
    //console.log(group);
    const layerRows = group.getLayers().map((layer, index) => {
        const layerProps = {
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
                    <Switch size="small" />
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
            {layerRows.length > 0 && <List bordered={false} dataSource={layerRows} renderItem={renderLayer} />}
            {group.getGroups().map(subgroup => (
                <SubCollapsePanel key={subgroup.id} group={subgroup} selectedLayerIds={selectedLayerIds} controller={controller} propsNeededForPanel={propsNeededForPanel}>
                    {/* {subgroup.getGroups().map(subsubgroup => {
                        return <SubCollapsePanel key={subsubgroup.id} group={subsubgroup} selectedLayerIds={selectedLayerIds} controller={controller} propsNeededForPanel={propsNeededForPanel} />
                    })} */}
                </SubCollapsePanel>
            ))}
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
