import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch } from '../../../../admin/admin-layereditor/components/Switch';
import { LayerTools } from './Layer/LayerTools';

const LayerDiv = styled('div')`
    background-color: ${props => props.even ? '#ffffff' : '#f3f3f3'};
    clear: both;
    position: relative;
    padding: 6px 10px 6px 40px;
    width: 100%;
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

export const Layer = ({model, even, selected, mutator, ...rest}) => {
    return (
        <LayerDiv even={even} className="layer">
            <CustomTools className="custom-tools"/>
            <Label>
                <FloatingSwitch size="small" checked={selected}
                    onChange={checked => onSelect(checked, model.getId(), mutator)}
                    disabled={model.isSticky()} />
                {model.getName()}
            </Label>
            <LayerTools model={model} mutator={mutator} {...rest}/>
        </LayerDiv>
    );
};

Layer.propTypes = {
    model: PropTypes.any.isRequired,
    even: PropTypes.bool,
    selected: PropTypes.bool,
    mutator: PropTypes.any.isRequired
};
