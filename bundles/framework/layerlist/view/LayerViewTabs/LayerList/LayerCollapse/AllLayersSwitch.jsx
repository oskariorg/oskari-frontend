import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Switch } from 'oskari-ui';
import styled from 'styled-components';

const StyledSwitch = styled(Switch)`
margin-left: 5px;
margin-right: 5px;
`;

const LIMIT_FOR_CONFIRMATION = 10;

/**
 * Component to toggle all layers on group to or from map.
 * Shows a warning if more than 10 layers would be added.
 */
export const AllLayersSwitch = ({ checked, onToggle, layerCount = 0 }) => {
    if (checked || layerCount < LIMIT_FOR_CONFIRMATION) {
        // when switch is "on" or when there's not enough
        //  layers affected for a confirmation to be shown
        return (
            <StyledSwitch size="small" checked={checked}
                onChange={onToggle} />
        );
    }
    // Toggling confirmation with a state using hack
    // It's a workaround for:
    //  - stop panel from opening when switch is shown
    //  - re-render components to make confirm visible when switch is turned on
    const [confirmOnScreen, showConfirm] = useState(false);
    return (
        <Confirm
            title={<Message messageKey='grouping.manyLayersWarn'/>}
            visible={confirmOnScreen}
            onConfirm={(event) => {
                showConfirm(false);
                onToggle(true);
                event.stopPropagation();
            }}
            onCancel={(event) => {
                showConfirm(false);
                event.stopPropagation();
            }}
            okText={<Message messageKey='yes'/>}
            // TODO: try to link tooltip to the flyout so it's removed if the flyout is closed.
            // These didn't solve the problem but might be helpful
            // div.oskari-flyout.layerlist
            //getPopupContainer={(triggerNode) => document.querySelector('div.oskari-flyout.layerlist')}
            //destroyTooltipOnHide={true}
            cancelText={<Message messageKey='cancel'/>}
            placement='top'
            popupStyle={{zIndex: '999999'}}
        >
            <StyledSwitch
                size="small"
                checked={checked} onClickCapture={(event) => {
                    event.stopPropagation();
                    showConfirm(true);
                }} />
        </Confirm>);
};

AllLayersSwitch.propTypes = {
    checked: PropTypes.bool,
    layerCount: PropTypes.number,
    onToggle: PropTypes.func.isRequired
};

                        