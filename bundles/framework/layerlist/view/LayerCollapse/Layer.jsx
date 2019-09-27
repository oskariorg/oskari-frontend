import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch } from 'oskari-ui';
import { LayerTools } from './Layer/LayerTools';

const LayerDiv = styled('div')`
    background-color: ${props => props.even ? '#ffffff' : '#f3f3f3'};
    clear: both;
    position: relative;
    padding: 6px 70px 6px 40px;
    min-height: 14px;
    line-height: 14px;
    
`;
const CustomTools = styled('div')`
    position: absolute;
    left: 5px;
    :hover {
        cursor: pointer;
    }
`;
const FloatingSwitch = styled(Switch)`
    float: left;
    margin: 0 8px 0 0 !important;
`;
const Label = styled('label')`
    cursor: pointer;
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

const Layer = ({ model, even, selected, mapSrs, mutator, locale }) => {
    return (
        <LayerDiv even={even} className="layer">
            <CustomTools className="custom-tools">
                {
                    model.getTools()
                        .filter(tool => tool.getTypes().includes('layerList'))
                        .map((tool, i) => (
                            <div key={`${tool.getName()}_${i}`}
                                className={tool.getIconCls()}
                                title={tool.getTooltip()}
                                onClick={() => onToolClick(tool)}/>)
                        )
                }
            </CustomTools>
            <Label>
                <FloatingSwitch size="small" checked={selected}
                    onChange={checked => onSelect(checked, model.getId(), mutator)}
                    disabled={model.isSticky()} />
                {model.getName()}
            </Label>
            <LayerTools model={model} mutator={mutator} locale={locale} mapSrs={mapSrs}/>
        </LayerDiv>
    );
};

Layer.propTypes = {
    model: PropTypes.any.isRequired,
    even: PropTypes.bool.isRequired,
    selected: PropTypes.bool.isRequired,
    mapSrs: PropTypes.string.isRequired,
    mutator: PropTypes.any.isRequired,
    locale: PropTypes.any.isRequired
};

const memoized = React.memo(Layer);
export { memoized as Layer };
