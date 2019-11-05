import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch, Tooltip } from 'oskari-ui';
import { LayerTools } from './LayerTools';

const Flex = styled('div')`
    display: flex;
    align-items: center;
`;
const LayerDiv = styled(Flex)`
    background-color: ${props => props.even ? '#ffffff' : '#f3f3f3'};
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

const onSelect = (checked, layerId, mutator) => {
    checked ? mutator.addLayer(layerId) : mutator.removeLayer(layerId);
};

const onToolClick = tool => {
    const cb = tool.getCallback();
    if (cb) {
        cb();
    }
};

const Layer = ({ model, even, selected, mutator, locale }) => {
    return (
        <LayerDiv even={even} className="layer">
            <CustomTools className="custom-tools">
                {
                    model.getTools()
                        .filter(tool => tool.getTypes().includes('layerList'))
                        .map((tool, i) =>
                            <Tooltip key={`${tool.getName()}_${i}`} title={tool.getTooltip()}>
                                <div className={tool.getIconCls()} onClick={() => onToolClick(tool)}/>
                            </Tooltip>
                        )
                }
            </CustomTools>
            <Body>
                <Label>
                    <Switch size="small" checked={selected}
                        onChange={checked => onSelect(checked, model.getId(), mutator)}
                        disabled={model.isSticky()} />
                    <div>{model.getName()}</div>
                </Label>
            </Body>
            <LayerTools model={model} mutator={mutator} locale={locale}/>
        </LayerDiv>
    );
};

Layer.propTypes = {
    model: PropTypes.any.isRequired,
    even: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    mutator: PropTypes.any.isRequired,
    locale: PropTypes.any.isRequired
};

const memoized = React.memo(Layer);
export { memoized as Layer };
