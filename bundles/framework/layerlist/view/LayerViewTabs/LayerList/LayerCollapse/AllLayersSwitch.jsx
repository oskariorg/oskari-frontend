import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Confirm, Message, Switch } from 'oskari-ui';
import { LAYER_GROUP_TOGGLE_DEFAULTS } from '../../../../constants';
import styled from 'styled-components';

const StyledSwitch = styled(Switch)`
margin-left: 5px;
margin-right: 5px;
`;

const LIMIT_FOR_CONFIRMATION = LAYER_GROUP_TOGGLE_DEFAULTS.SANE_LIMIT;

/**
 * Component to toggle all layers on group to or from map.
 * Shows a warning if more than 10 layers would be added.
 */
export const AllLayersSwitch = ({ checked, onToggle, layerCount = 0 }) => {
    if (checked || layerCount < LIMIT_FOR_CONFIRMATION) {
        // when switch is "on" or when there's not enough
        //  layers affected for a confirmation to be shown
        return (
            <StyledSwitch size="small"
                disabled={layerCount === 0}
                checked={layerCount !== 0 && checked}
                onChange={onToggle} />
        );
    }
    // Toggling confirmation with a state using hack
    // It's a workaround for:
    //  - stop panel from opening when switch is shown
    //  - re-render components to make confirm visible when switch is turned on
    // Switch is wrapped to an extra-span to get rid of "did you mean forwardRef()" warning.
    const [confirmOnScreen, showConfirm] = useState(false);
    return (
        <Confirm
            title={<Message messageKey='grouping.manyLayersWarn'/>}
            open={confirmOnScreen}
            onConfirm={(event) => {
                showConfirm(false);
                onToggle(true);
                event.stopPropagation();
            }}
            onCancel={(event) => {
                showConfirm(false);
                event.stopPropagation();
            }}
            // TODO: try to link tooltip to the flyout so it's removed if the flyout is closed.
            // These didn't solve the problem but might be helpful
            // div.oskari-flyout.layerlist
            //getPopupContainer={(triggerNode) => document.querySelector('div.oskari-flyout.layerlist')}
            //destroyTooltipOnHide={true}
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
