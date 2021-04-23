import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Switch } from 'oskari-ui';
import styled from 'styled-components';

const StyledSwitch = styled(Switch)`
margin-left: 5px;
margin-right: 5px;
`;



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
};

const LayerToggle = ({ onToggle, checked = false }) => {
    return (<StyledSwitch size="small" checked={checked}
        onChange={(checked, event) => {
            onToggle(checked);
            event.stopPropagation();
        }} />);
}

/*
<AllLayersSwitch checked={active} onToggle={(checked) => !checked ? controller.addGroupLayersToMap(group) : controller.removeGroupLayersFromMap(group); }
*/
export const AllLayersSwitch = ({ checked, onToggle, layerCount = 0 }) => {
    //const [visible, setVisible] = useState(false);
    const ToggleComp = (<LayerToggle checked={checked} onToggle={onToggle} />);
    return ToggleComp;
    /*
    if (layerCount < 10) {
        return ToggleComp;
    }
    return (<Confirm
        title={<Message messageKey='grouping.manyLayersWarn'/>}
        visible={visible}
        onConfirm={(event) => {
            setVisible(false);
            onToggle(active);
            event.stopPropagation();
        }}
        onCancel={(event) => onCancel(event, setVisible)}
        okText={<Message messageKey='yes'/>}
        cancelText={<Message messageKey='cancel'/>}
        placement='top'
        popupStyle={{zIndex: '999999'}}
    >
        {ToggleComp}
    </Confirm>);
    */
};

AllLayersSwitch.propTypes = {
    checked: PropTypes.bool,
    layerCount: PropTypes.number,
    onToggle: PropTypes.func.isRequired
};

                        