import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Switch } from '../../../../admin/admin-layereditor/components/Switch';
import { Checkbox } from '../../../../admin/admin-layereditor/components/Checkbox';
import { LayerTools } from './LayerTools';

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
    margin: 0 5px 0 0;
`;

export const Layer = props => {
    const {model, even, selected, mutator, ...rest} = props;
    const layerId = model.getId();
    const switchProps = {
        defaultChecked: selected,
        onChange: checked => {
            checked ? setTimeout(() => mutator.addLayer(layerId), 300) : mutator.removeLayer(layerId);
        }
    };
    const toolProps = {
        model,
        ...rest
    };
    return (
        <LayerDiv even={even} className="layer">
            <CustomTools className="custom-tools"/>
            <label>
                <FloatingSwitch size="small" {...switchProps} />
                {model.getName()}
            </label>
            <LayerTools {...toolProps}/>
        </LayerDiv>
    );
};

Layer.propTypes = {
    model: PropTypes.any.isRequired,
    selected: PropTypes.bool,
    even: PropTypes.bool,
    mutator: PropTypes.any
};
