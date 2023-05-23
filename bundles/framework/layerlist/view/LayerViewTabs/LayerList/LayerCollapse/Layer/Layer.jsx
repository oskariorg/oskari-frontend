import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Tooltip } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import { LayerTools } from './LayerTools';

const Flex = styled('div')`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap-reverse;
    align-items: center;
`;
const LayerDiv = styled(Flex)`
    clear: both;
    padding: 6px;
    min-height: 16px;
    line-height: 16px;
`;
const CustomTools = styled(Flex)`
    min-width: 20px;
    margin-right: 5px;
    div:hover {
        cursor: pointer;
    }
`;
const Label = styled('label')`
    display: flex;
    align-items: center;
    cursor: pointer;
    > div {
        margin-left: 8px;
    }
`;
const Body = styled(Flex)`
    flex-grow: 1;
`;

const onSelect = (checked, layerId, controller) => {
    checked ? controller.addLayer(layerId) : controller.removeLayer(layerId);
};

const onToolClick = tool => {
    const cb = tool.getCallback();
    if (cb) {
        cb();
    }
};

const Layer = ({ model, selected, opts, controller }) => {
    return (
        <LayerDiv className="t_layer" data-id={model.getId()}>
            <CustomTools className="custom-tools">
                {
                    model.getTools()
                        .filter(tool => tool.getTypes().includes('layerList'))
                        .map((tool, i) =>
                            <Tooltip key={`${tool.getName()}_${i}`} title={tool.getTooltip()}>
                                <div onClick={() => onToolClick(tool)}>
                                    {tool.getIconComponent()}
                                </div>
                            </Tooltip>
                        )
                }
            </CustomTools>
            <Body>
                <Label>
                    <Switch size="small" checked={selected}
                        onChange={checked => onSelect(checked, model.getId(), controller)}
                        disabled={model.isSticky()} />
                    <div>{model.getName()}</div>
                </Label>
            </Body>
            <LayerTools model={model} controller={controller} opts={opts}/>
        </LayerDiv>
    );
};

Layer.propTypes = {
    model: PropTypes.any.isRequired,
    selected: PropTypes.bool.isRequired,
    opts: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};

const memoized = React.memo(Layer, (prevProps, nextProps) => {
    const nameChanged = prevProps.model.getName() !== nextProps.model.getName();
    if (nameChanged) {
        return false;
    }
    const propsToCheck = ['selected'];
    const propsChanged = propsToCheck.some(prop => prevProps[prop] !== nextProps[prop]);
    return !propsChanged;
});
export { memoized as Layer };
