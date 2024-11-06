import React from 'react';
import PropTypes from 'prop-types';
import { Message, Checkbox } from 'oskari-ui';

export const PanButtonsComponent = ({ state, controller }) => {
    const onSelectionChange = (checked) => {
        controller.setShowArrows(checked);
    };

    const { showArrows } = state;
    return (
        <Checkbox checked={showArrows} onChange={evt => onSelectionChange(evt.target.checked)}>
            <Message bundleKey={'MapModule'} messageKey={'publisherTools.PanButtons.titles.showArrows'}/>
        </Checkbox>
    );
};

PanButtonsComponent.propTypes = {
    state: PropTypes.object,
    controller: PropTypes.object
};
