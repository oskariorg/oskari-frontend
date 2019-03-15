import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
const FloatingCheckbox = styled(Checkbox)`
    float: left;
`;

export const Layer = props => {
    const {model, even} = props;
    return (
        <LayerDiv even={even} className="layer">
            <CustomTools className="custom-tools"/>
            <FloatingCheckbox>{model.getName()}</FloatingCheckbox>
            <LayerTools {...props}/>
        </LayerDiv>
    );
};

Layer.propTypes = {
    model: PropTypes.any,
    even: PropTypes.bool
};
